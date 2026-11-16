import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, MessageCircle, Phone } from 'lucide-react';
import { ENQUIRY_SERVICE_OPTIONS } from '../data/catalog';
import { submitEnquiry } from '../lib/api';
import { COMPANY } from '../utils/company';
import { validateEnquiryInput } from '../utils/validation';

interface EnquiryFormProps {
  defaultServiceSlug?: string;
  sourcePage?: string;
  compact?: boolean;
}

export function EnquiryForm({
  defaultServiceSlug = 'visa-services',
  sourcePage,
  compact = false,
}: EnquiryFormProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [serviceSlug, setServiceSlug] = useState(defaultServiceSlug);
  const [message, setMessage] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{
    referenceCode: string;
    serviceTitle: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (defaultServiceSlug) {
      setServiceSlug(defaultServiceSlug);
    }
  }, [defaultServiceSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const allowedSlugs = ENQUIRY_SERVICE_OPTIONS.map((o) => o.slug);
    const validation = validateEnquiryInput(
      {
        fullName,
        phone,
        email,
        companyName,
        serviceSlug,
        message,
        consentAccepted,
        sourcePage: sourcePage || window.location.pathname,
      },
      allowedSlugs,
    );

    if (!validation.valid || !validation.data) {
      setFieldErrors(validation.errors);
      requestAnimationFrame(() => {
        const firstInvalid = document.querySelector<HTMLElement>(
          '[aria-invalid="true"]',
        );
        firstInvalid?.focus();
      });
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    try {
      const response = await submitEnquiry(validation.data);
      setSubmittedResult({
        referenceCode: response.enquiry.referenceCode,
        serviceTitle: response.enquiry.serviceTitle,
        message: response.message,
      });
      setFullName('');
      setPhone('');
      setEmail('');
      setCompanyName('');
      setMessage('');
      setConsentAccepted(false);
    } catch (error) {
      const err = error as Error & { fields?: Record<string, string> };
      if (err.fields) {
        setFieldErrors(err.fields);
      }
      setSubmitError(
        err.message ||
          'Unable to submit your enquiry right now. Please try again or call 0501022663.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedResult) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-[#F2F9E6] border border-[#84C325]/50 rounded-xl p-6 sm:p-8"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-[#4A7C10] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-[#0B2545]">
              Consultation Request Received
            </h3>
            <p className="text-sm text-[#334E68] leading-relaxed">
              {submittedResult.message}
            </p>
            <div className="bg-white border border-[#DCE5EE] rounded-lg px-4 py-3 text-sm flex flex-wrap items-center gap-x-6 gap-y-2">
              <div>
                <span className="text-[#52606D]">Reference: </span>
                <span className="font-mono font-semibold text-[#0B2545] tabular-nums">
                  {submittedResult.referenceCode}
                </span>
              </div>
              <div>
                <span className="text-[#52606D]">Service: </span>
                <span className="font-semibold text-[#0B2545]">
                  {submittedResult.serviceTitle}
                </span>
              </div>
            </div>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setSubmittedResult(null)}
                className="px-4 py-2 rounded-lg border border-[#DCE5EE] bg-white text-sm font-semibold text-[#0B2545] hover:bg-[#F5F8FB] transition-colors"
              >
                Send Another Enquiry
              </button>
              <a
                href={COMPANY.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4A7C10] hover:bg-[#3E6E0B] text-white text-sm font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {submitError && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-900 text-sm"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold">Submission could not be completed</p>
            <p className="mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

      <div className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-2' : 'md:grid-cols-2'} gap-4`}>
        <div>
          <label
            htmlFor="enquiry-full-name"
            className="block text-sm font-semibold text-[#0B2545] mb-1.5"
          >
            Full Name <span className="text-red-600">*</span>
          </label>
          <input
            id="enquiry-full-name"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (fieldErrors.fullName) {
                setFieldErrors((prev) => ({ ...prev, fullName: '' }));
              }
            }}
            aria-invalid={Boolean(fieldErrors.fullName)}
            aria-describedby={fieldErrors.fullName ? 'err-full-name' : undefined}
            placeholder="Your full name"
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0B2545] text-sm placeholder:text-slate-400 focus:border-[#008CD2] focus:outline-none"
          />
          {fieldErrors.fullName && (
            <p id="err-full-name" className="mt-1 text-xs text-red-600">
              {fieldErrors.fullName}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="enquiry-phone"
            className="block text-sm font-semibold text-[#0B2545] mb-1.5"
          >
            Phone / Mobile Number <span className="text-red-600">*</span>
          </label>
          <input
            id="enquiry-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (fieldErrors.phone) {
                setFieldErrors((prev) => ({ ...prev, phone: '' }));
              }
            }}
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? 'err-phone' : undefined}
            placeholder="050 123 4567"
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0B2545] text-sm placeholder:text-slate-400 focus:border-[#008CD2] focus:outline-none"
          />
          {fieldErrors.phone && (
            <p id="err-phone" className="mt-1 text-xs text-red-600">
              {fieldErrors.phone}
            </p>
          )}
        </div>
      </div>

      <div className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-2' : 'md:grid-cols-2'} gap-4`}>
        <div>
          <label
            htmlFor="enquiry-email"
            className="block text-sm font-semibold text-[#0B2545] mb-1.5"
          >
            Email Address <span className="text-red-600">*</span>
          </label>
          <input
            id="enquiry-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email) {
                setFieldErrors((prev) => ({ ...prev, email: '' }));
              }
            }}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'err-email' : undefined}
            placeholder="name@company.ae"
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0B2545] text-sm placeholder:text-slate-400 focus:border-[#008CD2] focus:outline-none"
          />
          {fieldErrors.email && (
            <p id="err-email" className="mt-1 text-xs text-red-600">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="enquiry-company"
            className="block text-sm font-semibold text-[#0B2545] mb-1.5"
          >
            Company Name <span className="text-xs font-normal text-[#52606D]">(Optional)</span>
          </label>
          <input
            id="enquiry-company"
            name="companyName"
            type="text"
            autoComplete="organization"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company or individual"
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0B2545] text-sm placeholder:text-slate-400 focus:border-[#008CD2] focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="enquiry-service"
          className="block text-sm font-semibold text-[#0B2545] mb-1.5"
        >
          Service Required <span className="text-red-600">*</span>
        </label>
        <select
          id="enquiry-service"
          name="serviceSlug"
          required
          value={serviceSlug}
          onChange={(e) => {
            setServiceSlug(e.target.value);
            if (fieldErrors.serviceSlug) {
              setFieldErrors((prev) => ({ ...prev, serviceSlug: '' }));
            }
          }}
          aria-invalid={Boolean(fieldErrors.serviceSlug)}
          aria-describedby={fieldErrors.serviceSlug ? 'err-service' : undefined}
          className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0B2545] text-sm focus:border-[#008CD2] focus:outline-none"
        >
          {ENQUIRY_SERVICE_OPTIONS.map((option) => (
            <option key={option.slug} value={option.slug}>
              {option.title}
            </option>
          ))}
        </select>
        {fieldErrors.serviceSlug && (
          <p id="err-service" className="mt-1 text-xs text-red-600">
            {fieldErrors.serviceSlug}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="enquiry-message"
          className="block text-sm font-semibold text-[#0B2545] mb-1.5"
        >
          How Can We Help? <span className="text-red-600">*</span>
        </label>
        <p className="text-xs text-[#52606D] mb-2">
          For your privacy, please do not enter passport numbers, Emirates ID
          numbers, or sensitive document details in this initial enquiry.
        </p>
        <textarea
          id="enquiry-message"
          name="message"
          required
          rows={compact ? 3 : 4}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (fieldErrors.message) {
              setFieldErrors((prev) => ({ ...prev, message: '' }));
            }
          }}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? 'err-message' : undefined}
          placeholder="Tell us which visa, PRO, attestation, licence, or Emirates ID service you require."
          className="w-full px-3.5 py-2.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0B2545] text-sm placeholder:text-slate-400 focus:border-[#008CD2] focus:outline-none"
        />
        {fieldErrors.message && (
          <p id="err-message" className="mt-1 text-xs text-red-600">
            {fieldErrors.message}
          </p>
        )}
      </div>

      <div>
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            id="enquiry-consent"
            name="consentAccepted"
            type="checkbox"
            checked={consentAccepted}
            onChange={(e) => {
              setConsentAccepted(e.target.checked);
              if (fieldErrors.consentAccepted) {
                setFieldErrors((prev) => ({ ...prev, consentAccepted: '' }));
              }
            }}
            aria-invalid={Boolean(fieldErrors.consentAccepted)}
            aria-describedby={fieldErrors.consentAccepted ? 'err-consent' : undefined}
            className="mt-1 h-4 w-4 rounded border-[#CBD5E1] text-[#008CD2] focus:ring-[#008CD2]"
          />
          <span className="text-xs text-[#334E68] leading-relaxed">
            I consent to {COMPANY.legalName} storing my enquiry details in order
            to contact me regarding this consultation request. Submitting this
            form does not initiate a government application.
          </span>
        </label>
        {fieldErrors.consentAccepted && (
          <p id="err-consent" className="mt-1 text-xs text-red-600">
            {fieldErrors.consentAccepted}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#008CD2] hover:bg-[#0074B3] disabled:opacity-60 text-white text-sm font-semibold transition-colors duration-150"
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
          <span>{submitting ? 'Submitting Request...' : 'Submit Consultation Request'}</span>
        </button>

        <a
          href={COMPANY.phoneHref}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#334E68] hover:text-[#008CD2]"
        >
          <Phone className="w-3.5 h-3.5 text-[#008CD2]" aria-hidden="true" />
          <span>Or call {COMPANY.phoneDisplay}</span>
        </a>
      </div>
    </form>
  );
}
