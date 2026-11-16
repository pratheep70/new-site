export const ENQUIRY_STATUSES = [
  'NEW',
  'IN_REVIEW',
  'CONTACTED',
  'QUOTED',
  'CLOSED',
] as const;

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export interface EnquiryFormInput {
  fullName: string;
  phone: string;
  email: string;
  companyName?: string;
  serviceSlug: string;
  message: string;
  consentAccepted: boolean;
  sourcePage?: string;
}

export interface ValidationResult<T> {
  valid: boolean;
  errors: Record<string, string>;
  data?: T;
}

export function sanitizeText(value: unknown, maxLength = 2000): string {
  if (typeof value !== 'string') {
    return '';
  }
  return value
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function normalizePhoneDigits(raw: string): string {
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return '';
  return hasPlus ? `+${digits}` : digits;
}

export function isValidPhone(raw: string): boolean {
  const digitsOnly = raw.replace(/\D/g, '');
  return digitsOnly.length >= 8 && digitsOnly.length <= 15;
}

export function isValidEmail(raw: string): boolean {
  const email = raw.trim();
  if (email.length < 5 || email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export function formatWhatsAppUrl(localOrIntlPhone: string, prefillText?: string): string {
  let digits = localOrIntlPhone.replace(/\D/g, '');
  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  } else if (digits.startsWith('0') && digits.length === 10) {
    // UAE local mobile format e.g. 0501022663 -> 971501022663
    digits = `971${digits.slice(1)}`;
  }
  const base = `https://wa.me/${digits}`;
  if (prefillText && prefillText.trim().length > 0) {
    return `${base}?text=${encodeURIComponent(prefillText.trim())}`;
  }
  return base;
}

export function validateEnquiryInput(
  input: Partial<EnquiryFormInput>,
  allowedServiceSlugs: readonly string[],
): ValidationResult<EnquiryFormInput> {
  const errors: Record<string, string> = {};

  const fullName = sanitizeText(input.fullName, 120);
  const phone = normalizePhoneDigits(sanitizeText(input.phone, 30));
  const email = sanitizeText(input.email, 254).toLowerCase();
  const companyName = sanitizeText(input.companyName ?? '', 140);
  const serviceSlug = sanitizeText(input.serviceSlug, 80);
  const message = sanitizeText(input.message, 2000);
  const consentAccepted = Boolean(input.consentAccepted);
  const sourcePage = sanitizeText(input.sourcePage ?? '', 160);

  if (fullName.length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  }

  if (!isValidPhone(phone)) {
    errors.phone = 'Please enter a valid UAE or international phone number.';
  }

  if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!serviceSlug || !allowedServiceSlugs.includes(serviceSlug)) {
    errors.serviceSlug = 'Please choose a service from the list.';
  }

  if (message.length < 10) {
    errors.message = 'Please briefly describe what you need (at least 10 characters).';
  }

  if (!consentAccepted) {
    errors.consentAccepted =
      'Please confirm that we may contact you regarding this enquiry.';
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: {},
    data: {
      fullName,
      phone,
      email,
      companyName: companyName || undefined,
      serviceSlug,
      message,
      consentAccepted,
      sourcePage: sourcePage || undefined,
    },
  };
}

export function isAllowedEnquiryStatus(status: string): status is EnquiryStatus {
  return (ENQUIRY_STATUSES as readonly string[]).includes(status);
}

export function generateReferenceCode(date = new Date(), randomHex?: string): string {
  const year = date.getUTCFullYear();
  const suffix = (randomHex ?? Math.floor(100000 + Math.random() * 900000).toString())
    .toUpperCase()
    .slice(0, 6);
  return `SIGN-${year}-${suffix}`;
}
