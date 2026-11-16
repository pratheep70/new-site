import type { FaqDefinition, ServiceDefinition } from '../data/catalog';
import type { EnquiryFormInput, EnquiryStatus } from '../utils/validation';

export interface ApiService extends ServiceDefinition {
  id: number;
  isPublished: boolean;
  updatedAt: string;
  faqs?: ApiFaq[];
}

export interface ApiFaq extends FaqDefinition {
  id: number;
  isPublished: boolean;
  updatedAt: string;
}

export interface EnquirySubmissionResponse {
  enquiry: {
    id: number;
    referenceCode: string;
    serviceTitle: string;
    status: string;
    createdAt: string;
    notificationStatus: string;
  };
  message: string;
}

export interface AdminEnquiryItem {
  id: number;
  referenceCode: string;
  fullName: string;
  phone: string;
  email: string;
  companyName: string | null;
  serviceSlug: string;
  serviceTitle: string;
  message: string;
  consentAccepted: boolean;
  status: EnquiryStatus;
  internalNotes: string | null;
  sourcePage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminEnquiryDetail extends AdminEnquiryItem {
  statusHistory: Array<{
    id: number;
    fromStatus: string | null;
    toStatus: string;
    note: string | null;
    changedByEmail: string | null;
    createdAt: string;
  }>;
  notifications: Array<{
    id: number;
    channel: string;
    recipient: string;
    subject: string;
    status: string;
    detail: string | null;
    createdAt: string;
  }>;
}

export interface AuditLogItem {
  id: number;
  actorUid: string | null;
  actorEmail: string | null;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
}

export async function fetchServices(): Promise<ApiService[]> {
  const res = await fetch('/api/v1/services');
  if (!res.ok) throw new Error('Failed to load services');
  const data = await res.json();
  return data.items;
}

export async function fetchServiceBySlug(slug: string): Promise<ApiService> {
  const res = await fetch(`/api/v1/services/${encodeURIComponent(slug)}`);
  if (!res.ok) {
    throw new Error(res.status === 404 ? 'Service not found' : 'Failed to load service');
  }
  const data = await res.json();
  return data.item;
}

export async function fetchFaqs(serviceSlug?: string): Promise<ApiFaq[]> {
  const query = serviceSlug ? `?serviceSlug=${encodeURIComponent(serviceSlug)}` : '';
  const res = await fetch(`/api/v1/faqs${query}`);
  if (!res.ok) throw new Error('Failed to load FAQs');
  const data = await res.json();
  return data.items;
}

export async function submitEnquiry(
  payload: EnquiryFormInput,
): Promise<EnquirySubmissionResponse> {
  const res = await fetch('/api/v1/enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(
      data.message || 'Unable to submit your enquiry. Please check your entries.',
    ) as Error & { fields?: Record<string, string> };
    err.fields = data.fields;
    throw err;
  }
  return data;
}

export async function adminFetchEnquiries(
  token: string,
  params: { search?: string; status?: string; serviceSlug?: string; page?: number },
): Promise<{
  items: AdminEnquiryItem[];
  total: number;
  page: number;
  limit: number;
  statusCounts: Record<string, number>;
}> {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.serviceSlug) searchParams.set('serviceSlug', params.serviceSlug);
  if (params.page) searchParams.set('page', String(params.page));

  const res = await fetch(`/api/v1/admin/enquiries?${searchParams.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Unable to load enquiries');
  return data;
}

export async function adminFetchEnquiryDetail(
  token: string,
  id: number,
): Promise<AdminEnquiryDetail> {
  const res = await fetch(`/api/v1/admin/enquiries/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Unable to load enquiry detail');
  return data.item;
}

export async function adminUpdateEnquiryStatus(
  token: string,
  id: number,
  payload: { status: EnquiryStatus; internalNotes?: string; note?: string },
): Promise<AdminEnquiryItem> {
  const res = await fetch(`/api/v1/admin/enquiries/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Unable to update enquiry');
  return data.item;
}

export async function adminFetchFaqs(token: string): Promise<ApiFaq[]> {
  const res = await fetch('/api/v1/admin/faqs', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Unable to load FAQs');
  return data.items;
}

export async function adminCreateFaq(
  token: string,
  payload: {
    serviceSlug: string;
    category: string;
    question: string;
    answer: string;
  },
): Promise<ApiFaq> {
  const res = await fetch('/api/v1/admin/faqs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Unable to create FAQ');
  return data.item;
}

export async function adminUpdateFaq(
  token: string,
  id: number,
  payload: { isPublished?: boolean; question?: string; answer?: string },
): Promise<ApiFaq> {
  const res = await fetch(`/api/v1/admin/faqs/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Unable to update FAQ');
  return data.item;
}

export async function adminDeleteFaq(token: string, id: number): Promise<void> {
  const res = await fetch(`/api/v1/admin/faqs/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Unable to delete FAQ');
}

export async function adminFetchAuditLogs(token: string): Promise<AuditLogItem[]> {
  const res = await fetch('/api/v1/admin/audit-logs', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Unable to load audit logs');
  return data.items;
}
