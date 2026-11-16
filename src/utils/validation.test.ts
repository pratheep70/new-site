import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatWhatsAppUrl,
  generateReferenceCode,
  isAllowedEnquiryStatus,
  isValidEmail,
  isValidPhone,
  sanitizeText,
  validateEnquiryInput,
} from './validation';

const ALLOWED_SLUGS = [
  'visa-services',
  'pro-services',
  'document-clearing',
  'business-setup',
  'insurance',
  'emirates-id',
  'general-consultation',
];

test('sanitizeText strips angle brackets, control characters, and collapses whitespace', () => {
  assert.equal(sanitizeText('  <script>Hello</script>\n\tWorld  '), 'scriptHello/script World');
  assert.equal(sanitizeText(null), '');
});

test('phone and email validation handle UAE and international formats', () => {
  assert.equal(isValidPhone('0501022663'), true);
  assert.equal(isValidPhone('+971 50 102 2663'), true);
  assert.equal(isValidPhone('12345'), false);

  assert.equal(isValidEmail('client@company.ae'), true);
  assert.equal(isValidEmail('invalid-email'), false);
});

test('formatWhatsAppUrl converts local UAE number 0501022663 to international wa.me link', () => {
  assert.equal(formatWhatsAppUrl('0501022663'), 'https://wa.me/971501022663');
  assert.equal(
    formatWhatsAppUrl('0501022663', 'Hello Sign In team'),
    'https://wa.me/971501022663?text=Hello%20Sign%20In%20team',
  );
});

test('validateEnquiryInput rejects incomplete or invalid fields and accepts valid submissions', () => {
  const invalid = validateEnquiryInput(
    {
      fullName: 'A',
      phone: '123',
      email: 'bad',
      serviceSlug: 'unknown',
      message: 'short',
      consentAccepted: false,
    },
    ALLOWED_SLUGS,
  );
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.serviceSlug);
  assert.ok(invalid.errors.message);
  assert.ok(invalid.errors.consentAccepted);

  const valid = validateEnquiryInput(
    {
      fullName: 'Amira Al Mansoori',
      phone: '0501022663',
      email: 'amira@example.ae',
      companyName: 'Al Noor Trading LLC',
      serviceSlug: 'pro-services',
      message: 'We need ongoing PRO support and employment visa renewals in Abu Dhabi.',
      consentAccepted: true,
    },
    ALLOWED_SLUGS,
  );
  assert.equal(valid.valid, true);
  assert.equal(valid.data?.email, 'amira@example.ae');
  assert.equal(valid.data?.serviceSlug, 'pro-services');
});

test('status validation and reference code generation follow expected contract', () => {
  assert.equal(isAllowedEnquiryStatus('NEW'), true);
  assert.equal(isAllowedEnquiryStatus('IN_REVIEW'), true);
  assert.equal(isAllowedEnquiryStatus('APPROVED_GOVERNMENT'), false);

  assert.equal(
    generateReferenceCode(new Date('2026-06-15T00:00:00Z'), 'ab12cd'),
    'SIGN-2026-AB12CD',
  );
});
