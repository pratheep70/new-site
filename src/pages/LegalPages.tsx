import { AlertTriangle } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { COMPANY } from '../utils/company';

function DraftLegalNotice() {
  return (
    <div className="mb-8 border border-amber-300 bg-amber-50 rounded-xl p-4 flex items-start gap-3 text-sm text-amber-950">
      <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
      <div>
        <p className="font-bold">
          Draft Legal Template — Pending Company &amp; Legal Counsel Review
        </p>
        <p className="mt-1 text-xs leading-relaxed">
          This document is a starter template prepared for {COMPANY.legalName}.
          Trade licence details, data-retention schedules, and applicable UAE
          legal terms must be reviewed and approved by the company’s management
          and qualified legal advisers before live publication.
        </p>
      </div>
    </div>
  );
}

export function PrivacyPolicyPage() {
  return (
    <>
      <SeoHead
        title="Privacy Policy (Draft) | SIGN IN DOCUMENTS CLEARING"
        description="Draft privacy notice explaining how consultation enquiry details are collected and used by Sign In Transactions Follow Up Services LLC."
        canonicalPath="/privacy-policy"
      />

      <section className="bg-[#F5F8FB] border-b border-[#DCE5EE] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-sm font-semibold text-[#008CD2] mb-2">Legal</p>
          <h1 className="text-3xl font-bold text-[#0B2545]">
            Privacy Policy (Draft Template)
          </h1>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 prose-sm space-y-6 text-sm text-[#334E68] leading-relaxed">
          <DraftLegalNotice />

          <div>
            <h2 className="text-lg font-bold text-[#0B2545] mb-2">
              1. Who We Are
            </h2>
            <p>
              This website is operated for {COMPANY.legalName} (publicly trading
              as {COMPANY.brandName}), located at {COMPANY.location}. Contact
              email: {COMPANY.email}; telephone: {COMPANY.phoneDisplay}.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#0B2545] mb-2">
              2. Information Collected via Website Enquiries
            </h2>
            <p>
              When you submit a consultation enquiry through this website, we
              collect only the contact details you provide: your name, phone
              number, email address, optional company name, selected service
              category, and enquiry message. Please do not submit passport
              copies, Emirates ID images, or confidential records through the
              public enquiry form.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#0B2545] mb-2">
              3. Purpose of Processing
            </h2>
            <p>
              Enquiry details are used to respond to your consultation request,
              clarify service requirements, and coordinate requested follow-up.
              Authorized company staff review submissions through a protected
              administrative portal.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#0B2545] mb-2">
              4. Data Retention &amp; Contact Rights
            </h2>
            <p>
              [Company confirmation required: insert approved retention duration
              and data protection officer contact details in accordance with
              applicable UAE data protection regulations.] To request access,
              correction, or deletion of your enquiry details, contact{' '}
              {COMPANY.email}.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export function TermsPage() {
  return (
    <>
      <SeoHead
        title="Terms & Conditions (Draft) | SIGN IN DOCUMENTS CLEARING"
        description="Draft website terms and conditions for Sign In Transactions Follow Up Services LLC (Abu Dhabi, UAE)."
        canonicalPath="/terms-and-conditions"
      />

      <section className="bg-[#F5F8FB] border-b border-[#DCE5EE] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-sm font-semibold text-[#008CD2] mb-2">Legal</p>
          <h1 className="text-3xl font-bold text-[#0B2545]">
            Terms &amp; Conditions (Draft Template)
          </h1>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6 text-sm text-[#334E68] leading-relaxed">
          <DraftLegalNotice />

          <div>
            <h2 className="text-lg font-bold text-[#0B2545] mb-2">
              1. Informational Purpose &amp; Independent Status
            </h2>
            <p>
              This website provides general information about the visa, PRO,
              document clearing, business setup, insurance coordination, and
              Emirates ID administrative support services offered by{' '}
              {COMPANY.legalName}. We are an independent private business
              services provider and are not affiliated with or acting as a UAE
              government authority.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#0B2545] mb-2">
              2. No Guarantee of Government Approvals or Timelines
            </h2>
            <p>
              Submitting an enquiry on this website does not constitute a
              government application, formal engagement, or guarantee of service
              eligibility. All visa approvals, attestations, licences, insurance
              underwriting, and processing timelines are determined exclusively by
              the competent UAE authorities or licensed third-party providers.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#0B2545] mb-2">
              3. Fees &amp; Scope Confirmation
            </h2>
            <p>
              Applicable service charges, official government fees, and required
              documents vary depending on the transaction and must be confirmed in
              writing during consultation prior to commencing work.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#0B2545] mb-2">
              4. Company Licensing &amp; Governing Law Placeholder
            </h2>
            <p>
              [Company confirmation required: insert verified Abu Dhabi trade
              licence reference, formal dispute resolution clause, and governing
              law wording as approved by legal counsel.]
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
