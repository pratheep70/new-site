import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  FileQuestion,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { useAuth } from '../context/AuthContext';
import {
  adminCreateFaq,
  adminDeleteFaq,
  adminFetchAuditLogs,
  adminFetchEnquiries,
  adminFetchEnquiryDetail,
  adminFetchFaqs,
  adminUpdateEnquiryStatus,
  adminUpdateFaq,
  type AdminEnquiryDetail,
  type AdminEnquiryItem,
  type ApiFaq,
  type AuditLogItem,
} from '../lib/api';
import { ENQUIRY_SERVICE_OPTIONS } from '../data/catalog';
import { ENQUIRY_STATUSES, type EnquiryStatus } from '../utils/validation';

const STATUS_BADGE_CLASSES: Record<string, string> = {
  NEW: 'bg-sky-50 text-sky-800 border-sky-200',
  IN_REVIEW: 'bg-amber-50 text-amber-800 border-amber-200',
  CONTACTED: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  QUOTED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  CLOSED: 'bg-slate-100 text-slate-700 border-slate-300',
};

type AdminTab = 'enquiries' | 'faqs' | 'audit';

export function AdminPage() {
  const { firebaseUser, dbUser, loading, authError, signInWithGoogle, logout, getFreshToken } =
    useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('enquiries');

  // Enquiries state
  const [enquiries, setEnquiries] = useState<AdminEnquiryItem[]>([]);
  const [totalEnquiries, setTotalEnquiries] = useState(0);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);
  const [enquiriesError, setEnquiriesError] = useState<string | null>(null);

  // Selected detail
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<AdminEnquiryDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [nextStatus, setNextStatus] = useState<EnquiryStatus>('NEW');
  const [internalNotes, setInternalNotes] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // FAQs state
  const [faqs, setFaqs] = useState<ApiFaq[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(false);
  const [newFaqService, setNewFaqService] = useState('general');
  const [newFaqCategory, setNewFaqCategory] = useState('General & Process');
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [savingFaq, setSavingFaq] = useState(false);

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(false);

  const isAdmin = dbUser?.role === 'ADMIN';

  const loadEnquiries = useCallback(async () => {
    const token = await getFreshToken();
    if (!token) return;
    setLoadingEnquiries(true);
    setEnquiriesError(null);
    try {
      const res = await adminFetchEnquiries(token, {
        search: searchQuery,
        status: statusFilter,
      });
      setEnquiries(res.items);
      setTotalEnquiries(res.total);
      setStatusCounts(res.statusCounts);
    } catch (err) {
      setEnquiriesError(
        err instanceof Error ? err.message : 'Failed to load enquiries.',
      );
    } finally {
      setLoadingEnquiries(false);
    }
  }, [getFreshToken, searchQuery, statusFilter]);

  const loadDetail = useCallback(
    async (id: number) => {
      const token = await getFreshToken();
      if (!token) return;
      setSelectedId(id);
      setLoadingDetail(true);
      setSaveFeedback(null);
      try {
        const d = await adminFetchEnquiryDetail(token, id);
        setDetail(d);
        setNextStatus(d.status);
        setInternalNotes(d.internalNotes || '');
        setStatusNote('');
      } catch {
        setDetail(null);
      } finally {
        setLoadingDetail(false);
      }
    },
    [getFreshToken],
  );

  const loadFaqs = useCallback(async () => {
    const token = await getFreshToken();
    if (!token) return;
    setLoadingFaqs(true);
    try {
      const items = await adminFetchFaqs(token);
      setFaqs(items);
    } finally {
      setLoadingFaqs(false);
    }
  }, [getFreshToken]);

  const loadAudit = useCallback(async () => {
    const token = await getFreshToken();
    if (!token) return;
    setLoadingAudit(true);
    try {
      const items = await adminFetchAuditLogs(token);
      setAuditLogs(items);
    } finally {
      setLoadingAudit(false);
    }
  }, [getFreshToken]);

  useEffect(() => {
    if (!isAdmin) return;
    if (activeTab === 'enquiries') {
      void loadEnquiries();
    } else if (activeTab === 'faqs') {
      void loadFaqs();
    } else if (activeTab === 'audit') {
      void loadAudit();
    }
  }, [isAdmin, activeTab, loadEnquiries, loadFaqs, loadAudit]);

  async function handleStatusSave(e: React.FormEvent) {
    e.preventDefault();
    if (!detail) return;
    const token = await getFreshToken();
    if (!token) return;
    setSavingStatus(true);
    setSaveFeedback(null);
    try {
      await adminUpdateEnquiryStatus(token, detail.id, {
        status: nextStatus,
        internalNotes,
        note: statusNote,
      });
      setSaveFeedback('Enquiry status updated.');
      await Promise.all([loadEnquiries(), loadDetail(detail.id)]);
    } catch (err) {
      setSaveFeedback(
        err instanceof Error ? err.message : 'Unable to save status update.',
      );
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleCreateFaq(e: React.FormEvent) {
    e.preventDefault();
    const token = await getFreshToken();
    if (!token) return;
    setSavingFaq(true);
    try {
      await adminCreateFaq(token, {
        serviceSlug: newFaqService,
        category: newFaqCategory,
        question: newFaqQuestion,
        answer: newFaqAnswer,
      });
      setNewFaqQuestion('');
      setNewFaqAnswer('');
      await loadFaqs();
    } finally {
      setSavingFaq(false);
    }
  }

  async function handleToggleFaqPublish(faq: ApiFaq) {
    const token = await getFreshToken();
    if (!token) return;
    await adminUpdateFaq(token, faq.id, { isPublished: !faq.isPublished });
    await loadFaqs();
  }

  async function handleDeleteFaq(id: number) {
    const token = await getFreshToken();
    if (!token) return;
    await adminDeleteFaq(token, id);
    await loadFaqs();
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-[#334E68]">
          <Loader2 className="w-5 h-5 animate-spin text-[#008CD2]" aria-hidden="true" />
          <span>Verifying session...</span>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <>
        <SeoHead
          title="Staff Admin Portal | SIGN IN DOCUMENTS CLEARING"
          description="Protected administrative portal for Sign In Transactions Follow Up Services LLC staff."
          canonicalPath="/admin"
        />
        <section className="bg-[#F5F8FB] py-20 px-4">
          <div className="max-w-md mx-auto bg-white border border-[#DCE5EE] rounded-xl p-8">
            <p className="text-xs font-semibold text-[#008CD2] mb-2">
              Staff Portal
            </p>
            <h1 className="text-2xl font-bold text-[#0B2545] mb-2">
              Authorized Staff Sign-In
            </h1>
            <p className="text-sm text-[#334E68] leading-relaxed mb-6">
              Sign in with your authorized Google account to review consultation
              enquiries, update statuses, and manage website FAQs. Public
              registration is disabled.
            </p>

            {authError && (
              <div
                role="alert"
                className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-900 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => void signInWithGoogle()}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#008CD2] hover:bg-[#0074B3] text-white text-sm font-semibold transition-colors"
            >
              <span>Sign In with Google</span>
            </button>

            <div className="mt-6 pt-5 border-t border-[#DCE5EE] text-xs text-[#52606D] flex items-center justify-between">
              <Link to="/" className="text-[#008CD2] hover:underline">
                Return to Website
              </Link>
              <span>Role-protected access</span>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <SeoHead
          title="Access Restricted | SIGN IN DOCUMENTS CLEARING"
          description="Administrative permissions required."
          canonicalPath="/admin"
        />
        <section className="bg-[#F5F8FB] py-20 px-4">
          <div className="max-w-lg mx-auto bg-white border border-[#DCE5EE] rounded-xl p-8">
            <div className="flex items-start gap-3 mb-4">
              <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h1 className="text-xl font-bold text-[#0B2545]">
                  Administrator Access Required
                </h1>
                <p className="text-sm text-[#334E68] mt-1">
                  Signed in as <span className="font-semibold">{firebaseUser.email}</span>{' '}
                  (role: <span className="font-mono">{dbUser?.role || 'STAFF'}</span>).
                </p>
              </div>
            </div>
            <p className="text-sm text-[#334E68] leading-relaxed mb-6">
              This account is not listed in the authorized administrator allowlist
              (<span className="font-mono text-xs">ADMIN_EMAILS</span>). Contact
              the system owner to grant administrator permissions.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => void logout()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0B2545] text-white text-sm font-semibold"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                <span>Sign Out</span>
              </button>
              <Link
                to="/"
                className="px-4 py-2 rounded-lg border border-[#CBD5E1] text-sm font-semibold text-[#0B2545]"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <SeoHead
        title="Admin Dashboard | SIGN IN DOCUMENTS CLEARING"
        description="Manage enquiries, FAQs, and audit logs."
        canonicalPath="/admin"
      />

      <section className="bg-[#F5F8FB] min-h-[75vh] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Admin Header */}
          <div className="bg-white border border-[#DCE5EE] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-[#52606D]">
                Staff Console · {dbUser.email}
              </p>
              <h1 className="text-2xl font-bold text-[#0B2545]">
                Enquiry &amp; Content Management
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-[#F5F8FB] border border-[#DCE5EE] rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveTab('enquiries')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
                    activeTab === 'enquiries'
                      ? 'bg-white text-[#008CD2] shadow-sm border border-[#DCE5EE]'
                      : 'text-[#334E68]'
                  }`}
                >
                  <ClipboardList className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Enquiries</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('faqs')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
                    activeTab === 'faqs'
                      ? 'bg-white text-[#008CD2] shadow-sm border border-[#DCE5EE]'
                      : 'text-[#334E68]'
                  }`}
                >
                  <FileQuestion className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>FAQs</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('audit')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${
                    activeTab === 'audit'
                      ? 'bg-white text-[#008CD2] shadow-sm border border-[#DCE5EE]'
                      : 'text-[#334E68]'
                  }`}
                >
                  Audit Log
                </button>
              </div>

              <button
                type="button"
                onClick={() => void logout()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F5F8FB] text-xs font-semibold text-[#0B2545]"
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {activeTab === 'enquiries' && (
            <>
              {/* Status summary strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-white border border-[#DCE5EE] rounded-lg p-4">
                  <p className="text-xs text-[#52606D]">Matching Total</p>
                  <p className="text-2xl font-bold text-[#0B2545] tabular-nums mt-1">
                    {totalEnquiries}
                  </p>
                </div>
                {ENQUIRY_STATUSES.map((st) => (
                  <div
                    key={st}
                    className="bg-white border border-[#DCE5EE] rounded-lg p-4"
                  >
                    <p className="text-xs text-[#52606D]">{st.replace('_', ' ')}</p>
                    <p className="text-2xl font-bold text-[#0B2545] tabular-nums mt-1">
                      {statusCounts[st] ?? 0}
                    </p>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div className="bg-white border border-[#DCE5EE] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search
                    className="w-4 h-4 text-[#52606D] absolute left-3 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <label htmlFor="admin-search" className="sr-only">
                    Search enquiries
                  </label>
                  <input
                    id="admin-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by reference, name, phone, or email..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#CBD5E1] text-sm"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label htmlFor="admin-status-filter" className="sr-only">
                    Filter by status
                  </label>
                  <select
                    id="admin-status-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-[#CBD5E1] text-sm bg-white"
                  >
                    <option value="ALL">All Statuses</option>
                    {ENQUIRY_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => void loadEnquiries()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#CBD5E1] text-sm font-medium text-[#0B2545] hover:bg-[#F5F8FB]"
                  >
                    <RefreshCw className="w-4 h-4" aria-hidden="true" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {enquiriesError && (
                <div
                  role="alert"
                  className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-900"
                >
                  {enquiriesError}
                </div>
              )}

              {/* Split table & detail panel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-7 bg-white border border-[#DCE5EE] rounded-xl overflow-hidden">
                  {loadingEnquiries ? (
                    <div className="p-10 text-center text-sm text-[#52606D]">
                      Loading enquiries...
                    </div>
                  ) : enquiries.length === 0 ? (
                    <div className="p-10 text-center">
                      <p className="text-base font-semibold text-[#0B2545]">
                        No enquiries match the current filter
                      </p>
                      <p className="text-sm text-[#52606D] mt-1">
                        Submissions from the public consultation form will appear
                        here immediately.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-[#DCE5EE] bg-[#F5F8FB] text-xs font-semibold text-[#52606D]">
                            <th className="py-3 px-4">Reference</th>
                            <th className="py-3 px-4">Client</th>
                            <th className="py-3 px-4">Service</th>
                            <th className="py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EDF3F8]">
                          {enquiries.map((item) => (
                            <tr
                              key={item.id}
                              onClick={() => void loadDetail(item.id)}
                              className={`cursor-pointer transition-colors ${
                                selectedId === item.id
                                  ? 'bg-[#EDF6FC]'
                                  : 'hover:bg-[#F5F8FB]'
                              }`}
                            >
                              <td className="py-3 px-4 font-mono text-xs font-semibold text-[#008CD2] tabular-nums whitespace-nowrap">
                                {item.referenceCode}
                              </td>
                              <td className="py-3 px-4">
                                <p className="font-semibold text-[#0B2545]">
                                  {item.fullName}
                                </p>
                                <p className="text-xs text-[#52606D] tabular-nums">
                                  {item.phone}
                                </p>
                              </td>
                              <td className="py-3 px-4 text-xs text-[#334E68]">
                                {item.serviceTitle}
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded border text-xs font-semibold ${
                                    STATUS_BADGE_CLASSES[item.status] ||
                                    'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Detail Panel */}
                <div className="lg:col-span-5 bg-white border border-[#DCE5EE] rounded-xl p-6">
                  {loadingDetail ? (
                    <div className="py-12 text-center text-sm text-[#52606D]">
                      Loading enquiry details...
                    </div>
                  ) : !detail ? (
                    <div className="py-12 text-center text-sm text-[#52606D]">
                      Select an enquiry row to review client details, status
                      history, and internal notes.
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="flex items-start justify-between gap-2 pb-4 border-b border-[#DCE5EE]">
                        <div>
                          <p className="font-mono text-xs font-semibold text-[#008CD2] tabular-nums">
                            {detail.referenceCode}
                          </p>
                          <h2 className="text-lg font-bold text-[#0B2545] mt-0.5">
                            {detail.fullName}
                          </h2>
                          {detail.companyName && (
                            <p className="text-xs text-[#52606D]">
                              {detail.companyName}
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded border text-xs font-semibold ${
                            STATUS_BADGE_CLASSES[detail.status] || ''
                          }`}
                        >
                          {detail.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-[#52606D]">Phone</p>
                          <p className="font-semibold text-[#0B2545] tabular-nums">
                            {detail.phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#52606D]">Email</p>
                          <p className="font-semibold text-[#0B2545] break-all">
                            {detail.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#52606D]">Service</p>
                          <p className="font-semibold text-[#0B2545]">
                            {detail.serviceTitle}
                          </p>
                        </div>
                        <div>
                          <p className="text-[#52606D]">Submitted</p>
                          <p className="font-semibold text-[#0B2545] tabular-nums">
                            {new Date(detail.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="bg-[#F5F8FB] border border-[#DCE5EE] rounded-lg p-3.5 text-sm text-[#0B2545]">
                        <p className="text-xs font-semibold text-[#52606D] mb-1">
                          Client Message
                        </p>
                        <p className="leading-relaxed">{detail.message}</p>
                      </div>

                      <form onSubmit={handleStatusSave} className="space-y-3 pt-2 border-t border-[#DCE5EE]">
                        <div>
                          <label
                            htmlFor="detail-status"
                            className="block text-xs font-semibold text-[#0B2545] mb-1"
                          >
                            Update Status
                          </label>
                          <select
                            id="detail-status"
                            value={nextStatus}
                            onChange={(e) =>
                              setNextStatus(e.target.value as EnquiryStatus)
                            }
                            className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] text-sm bg-white"
                          >
                            {ENQUIRY_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="detail-internal-notes"
                            className="block text-xs font-semibold text-[#0B2545] mb-1"
                          >
                            Internal Notes
                          </label>
                          <textarea
                            id="detail-internal-notes"
                            rows={2}
                            value={internalNotes}
                            onChange={(e) => setInternalNotes(e.target.value)}
                            placeholder="Staff notes on follow-up..."
                            className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] text-sm"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="detail-history-note"
                            className="block text-xs font-semibold text-[#0B2545] mb-1"
                          >
                            Status History Comment (Optional)
                          </label>
                          <input
                            id="detail-history-note"
                            type="text"
                            value={statusNote}
                            onChange={(e) => setStatusNote(e.target.value)}
                            placeholder="e.g. Called client and shared checklist"
                            className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] text-sm"
                          />
                        </div>

                        {saveFeedback && (
                          <p className="text-xs font-medium text-[#3E6E0B] flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{saveFeedback}</span>
                          </p>
                        )}

                        <button
                          type="submit"
                          disabled={savingStatus}
                          className="w-full py-2.5 px-4 rounded-lg bg-[#008CD2] hover:bg-[#0074B3] text-white text-sm font-semibold disabled:opacity-60"
                        >
                          {savingStatus ? 'Saving...' : 'Save Status & Notes'}
                        </button>
                      </form>

                      {detail.statusHistory.length > 0 && (
                        <div className="pt-3 border-t border-[#DCE5EE]">
                          <p className="text-xs font-semibold text-[#0B2545] mb-2">
                            Status History
                          </p>
                          <ul className="space-y-2 text-xs text-[#334E68]">
                            {detail.statusHistory.map((h) => (
                              <li
                                key={h.id}
                                className="border border-[#EDF3F8] rounded p-2 bg-[#F5F8FB]/50"
                              >
                                <span className="font-semibold text-[#0B2545]">
                                  {h.fromStatus ? `${h.fromStatus} -> ` : ''}
                                  {h.toStatus}
                                </span>
                                {h.note && <p className="mt-0.5">{h.note}</p>}
                                <p className="text-[11px] text-[#52606D] mt-0.5 tabular-nums">
                                  {new Date(h.createdAt).toLocaleString()}
                                  {h.changedByEmail ? ` · ${h.changedByEmail}` : ''}
                                </p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'faqs' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 bg-white border border-[#DCE5EE] rounded-xl p-6">
                <h2 className="text-lg font-bold text-[#0B2545] mb-4">
                  Add New FAQ
                </h2>
                <form onSubmit={handleCreateFaq} className="space-y-4">
                  <div>
                    <label
                      htmlFor="faq-service-slug"
                      className="block text-xs font-semibold text-[#0B2545] mb-1"
                    >
                      Related Service
                    </label>
                    <select
                      id="faq-service-slug"
                      value={newFaqService}
                      onChange={(e) => setNewFaqService(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] text-sm bg-white"
                    >
                      <option value="general">General</option>
                      {ENQUIRY_SERVICE_OPTIONS.map((opt) => (
                        <option key={opt.slug} value={opt.slug}>
                          {opt.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="faq-category"
                      className="block text-xs font-semibold text-[#0B2545] mb-1"
                    >
                      Category Label
                    </label>
                    <input
                      id="faq-category"
                      type="text"
                      required
                      value={newFaqCategory}
                      onChange={(e) => setNewFaqCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="faq-question"
                      className="block text-xs font-semibold text-[#0B2545] mb-1"
                    >
                      Question
                    </label>
                    <input
                      id="faq-question"
                      type="text"
                      required
                      value={newFaqQuestion}
                      onChange={(e) => setNewFaqQuestion(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="faq-answer"
                      className="block text-xs font-semibold text-[#0B2545] mb-1"
                    >
                      Answer
                    </label>
                    <textarea
                      id="faq-answer"
                      rows={4}
                      required
                      value={newFaqAnswer}
                      onChange={(e) => setNewFaqAnswer(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#CBD5E1] text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={savingFaq}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#008CD2] hover:bg-[#0074B3] text-white text-sm font-semibold"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span>{savingFaq ? 'Saving...' : 'Create FAQ'}</span>
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 bg-white border border-[#DCE5EE] rounded-xl p-6">
                <h2 className="text-lg font-bold text-[#0B2545] mb-4">
                  Published &amp; Draft FAQs
                </h2>
                {loadingFaqs ? (
                  <p className="text-sm text-[#52606D]">Loading FAQs...</p>
                ) : (
                  <div className="divide-y divide-[#DCE5EE]">
                    {faqs.map((faq) => (
                      <div key={faq.id} className="py-4 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs text-[#008CD2] font-medium">
                            {faq.category} · {faq.isPublished ? 'Published' : 'Hidden'}
                          </p>
                          <p className="text-sm font-bold text-[#0B2545] mt-0.5">
                            {faq.question}
                          </p>
                          <p className="text-xs text-[#334E68] mt-1">{faq.answer}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => void handleToggleFaqPublish(faq)}
                            className="px-2.5 py-1 rounded border border-[#CBD5E1] text-xs font-medium text-[#0B2545]"
                          >
                            {faq.isPublished ? 'Hide' : 'Publish'}
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete FAQ "${faq.question}"`}
                            onClick={() => void handleDeleteFaq(faq.id)}
                            className="p-1.5 rounded border border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="bg-white border border-[#DCE5EE] rounded-xl overflow-hidden">
              <div className="p-5 border-b border-[#DCE5EE] flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#0B2545]">
                  Administrative Audit Trail
                </h2>
                <button
                  type="button"
                  onClick={() => void loadAudit()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CBD5E1] text-xs font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Refresh</span>
                </button>
              </div>
              {loadingAudit ? (
                <div className="p-8 text-center text-sm text-[#52606D]">
                  Loading audit logs...
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#F5F8FB] border-b border-[#DCE5EE] text-[#52606D]">
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">Action</th>
                        <th className="py-3 px-4">Entity</th>
                        <th className="py-3 px-4">Actor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDF3F8]">
                      {auditLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="py-2.5 px-4 font-mono tabular-nums whitespace-nowrap text-[#52606D]">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-4 font-semibold text-[#0B2545]">
                            {log.action}
                          </td>
                          <td className="py-2.5 px-4 text-[#334E68]">
                            {log.entityType} #{log.entityId}
                          </td>
                          <td className="py-2.5 px-4 text-[#334E68]">
                            {log.actorEmail || 'Public Submission'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
