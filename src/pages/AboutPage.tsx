import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import {
  COMPANY,
  HOW_WE_WORK_STEPS,
  WHO_WE_SERVE,
  WHY_WORK_WITH_US,
} from '../utils/company';

export function AboutPage() {
  return (
    <>
      <SeoHead
        title="About Us | SIGN IN DOCUMENTS CLEARING — Abu Dhabi"
        description="Learn about Sign In Transactions Follow Up Services LLC in Abu Dhabi — our service philosophy, client groups, and structured approach to visa, PRO, and document clearing."
        canonicalPath="/about"
      />

      <section className="bg-[#F5F8FB] border-b border-[#DCE5EE] py-14 lg:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-[#008CD2] mb-2">
              About {COMPANY.brandName}
            </p>
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B2545] mb-5"
              style={{ textWrap: 'balance' }}
            >
              Your Abu Dhabi Partner for Organized Visa, PRO &amp; Documentation Work
            </h1>
            <p className="text-base sm:text-lg text-[#334E68] leading-relaxed">
              {COMPANY.legalName} (publicly operating as {COMPANY.brandName}) is
              an Abu Dhabi-based business and documentation services provider
              supporting companies, investors, families, and independent
              professionals across the UAE.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-18 border-b border-[#DCE5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-2xl font-bold text-[#0B2545]">
              Our Service Philosophy
            </h2>
            <p className="text-base text-[#334E68] leading-relaxed">
              Essential visa, labour, licensing, and attestation procedures
              require careful document review and steady administrative
              follow-up. Our role is to take over the paperwork preparation and
              authority follow-up so your team can remain focused on running your
              business.
            </p>
            <p className="text-base text-[#334E68] leading-relaxed">
              From our office on {COMPANY.location}, we provide one point of
              contact for each file, clear communication on progress, and
              support across six core service areas under one roof.
            </p>
            <div className="pt-2 border-t border-[#DCE5EE] text-xs text-[#52606D] leading-relaxed">
              Note: {COMPANY.legalName} is an independent private corporate
              services provider, not a UAE government entity. Requirements,
              fees, and final approvals depend on the relevant authorities.
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="rounded-xl overflow-hidden border border-[#DCE5EE] aspect-[4/3]">
              <img
                src={COMPANY.assets.consultationDesk}
                alt="Document preparation and review at SIGN IN DOCUMENTS CLEARING in Abu Dhabi"
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F8FB] py-14 lg:py-18 border-b border-[#DCE5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#0B2545] mb-8">
            Who We Serve
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHO_WE_SERVE.map((group) => (
              <div
                key={group.id}
                className="bg-white border border-[#DCE5EE] rounded-xl p-6"
              >
                <h3 className="text-lg font-bold text-[#0B2545] mb-2">
                  {group.title}
                </h3>
                <p className="text-sm text-[#334E68] leading-relaxed mb-4">
                  {group.summary}
                </p>
                <ul className="space-y-2 text-xs text-[#334E68]">
                  {group.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check
                        className="w-3.5 h-3.5 text-[#4A7C10] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-18 border-b border-[#DCE5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-[#0B2545] mb-8">
            How We Work &amp; Why Clients Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {HOW_WE_WORK_STEPS.map((step) => (
              <div
                key={step.step}
                className="border border-[#DCE5EE] rounded-xl p-6 bg-[#F5F8FB]/60"
              >
                <span className="font-mono text-sm font-semibold text-[#008CD2] tabular-nums">
                  {step.step}
                </span>
                <h3 className="text-lg font-bold text-[#0B2545] mt-2 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[#334E68] leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {WHY_WORK_WITH_US.map((item) => (
              <div
                key={item.title}
                className="border border-[#DCE5EE] rounded-xl p-6"
              >
                <h3 className="text-base font-bold text-[#0B2545] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#334E68] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[#0B2545] text-white rounded-xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-1">
                Ready to Discuss Your Requirements?
              </h3>
              <p className="text-sm text-slate-300">
                Contact our Abu Dhabi office on Najda Street or submit a
                consultation request online.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#008CD2] hover:bg-[#0074B3] text-white text-sm font-semibold whitespace-nowrap shrink-0 transition-colors"
            >
              <span>Request a Consultation</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
