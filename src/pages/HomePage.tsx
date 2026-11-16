import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { ServiceIcon } from '../components/ServiceIcon';
import { FaqAccordion } from '../components/FaqAccordion';
import { EnquiryForm } from '../components/EnquiryForm';
import { FAQ_CATALOG, SERVICE_CATALOG, type ServiceDefinition, type FaqDefinition } from '../data/catalog';
import { fetchFaqs, fetchServices } from '../lib/api';
import {
  COMPANY,
  HOW_WE_WORK_STEPS,
  WHO_WE_SERVE,
  WHY_WORK_WITH_US,
} from '../utils/company';

export function HomePage() {
  const [services, setServices] = useState<ServiceDefinition[]>(SERVICE_CATALOG);
  const [faqs, setFaqs] = useState<FaqDefinition[]>(FAQ_CATALOG.slice(0, 5));

  useEffect(() => {
    fetchServices()
      .then((items) => {
        if (items.length > 0) setServices(items);
      })
      .catch(() => undefined);

    fetchFaqs()
      .then((items) => {
        if (items.length > 0) setFaqs(items.slice(0, 5));
      })
      .catch(() => undefined);
  }, []);

  return (
    <>
      <SeoHead
        title="SIGN IN DOCUMENTS CLEARING | Visa & PRO Services in Abu Dhabi"
        description="Sign In Transactions Follow Up Services LLC on Najda Street, Abu Dhabi provides UAE visa processing, PRO services, document clearing, business setup, insurance, and Emirates ID coordination."
        canonicalPath="/"
      />

      {/* 1. Hero Section */}
      <section className="bg-white border-b border-[#DCE5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-12 lg:pt-14 lg:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs sm:text-sm font-medium text-[#008CD2] mb-3">
                Najda Street, Abu Dhabi · Visa · PRO · Document Clearing
              </p>
              <h1
                className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#0B2545] leading-[1.14] mb-5"
                style={{ textWrap: 'balance' }}
              >
                Your UAE Visa &amp; PRO Paperwork, Handled with Care.
              </h1>
              <p className="text-base sm:text-lg text-[#334E68] leading-relaxed max-w-xl mb-7">
                From visa processing and PRO transactions to document clearing and
                business setup, SIGN IN DOCUMENTS CLEARING helps individuals and
                companies manage essential paperwork in Abu Dhabi.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 mb-7">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#008CD2] hover:bg-[#0074B3] text-white text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  <span>Talk to Our Team</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F5F8FB] text-[#0B2545] text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  Explore Our Services
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#334E68] pt-4 border-t border-[#DCE5EE]">
                <a
                  href={COMPANY.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-medium text-[#3E6E0B] hover:text-[#0B2545] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#84C325]" aria-hidden="true" />
                  <span>Message on WhatsApp</span>
                </a>
                <a
                  href={COMPANY.phoneHref}
                  className="inline-flex items-center gap-2 font-medium hover:text-[#008CD2] transition-colors tabular-nums"
                >
                  <Phone className="w-4 h-4 text-[#008CD2]" aria-hidden="true" />
                  <span>Call {COMPANY.phoneDisplay}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative h-full min-h-[280px] sm:min-h-[340px] lg:min-h-[420px] rounded-2xl overflow-hidden border border-[#DCE5EE] bg-gradient-to-br from-[#EDF3F8] to-[#DCE8F2]">
                <img
                  src={COMPANY.assets.heroOffice}
                  alt="Corporate business consultant reviewing visa and PRO documents with a client in an Abu Dhabi office"
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                  width={1280}
                  height={720}
                />
              </div>
            </div>
          </div>

          {/* Grounded scope strip below split */}
          <div className="mt-10 pt-8 border-t border-[#DCE5EE] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div>
              <p className="font-semibold text-[#0B2545]">Single Point of Contact</p>
              <p className="text-[#52606D] mt-1">
                One point of contact from the first call to the final stamp.
              </p>
            </div>
            <div>
              <p className="font-semibold text-[#0B2545]">Companies &amp; Individuals</p>
              <p className="text-[#52606D] mt-1">
                Supporting SMEs, investors, families, and freelancers in the UAE.
              </p>
            </div>
            <div>
              <p className="font-semibold text-[#0B2545]">End-to-End Follow-Up</p>
              <p className="text-[#52606D] mt-1">
                Preparation, submission coordination, and clear status updates.
              </p>
            </div>
            <div>
              <p className="font-semibold text-[#0B2545]">Abu Dhabi Office</p>
              <p className="text-[#52606D] mt-1">
                Conveniently located on Najda Street, Abu Dhabi, UAE.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Six Core Service Categories */}
      <section className="bg-[#F5F8FB] py-16 lg:py-20 border-b border-[#DCE5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-[#008CD2] mb-2">
                Core Services
              </p>
              <h2
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B2545]"
                style={{ textWrap: 'balance' }}
              >
                Visa, PRO, and Documentation Under One Roof
              </h2>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#008CD2] hover:text-[#006CA3] whitespace-nowrap shrink-0"
            >
              <span>View All Service Details</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <article
                key={service.slug}
                className="bg-white border border-[#DCE5EE] rounded-xl p-6 flex flex-col justify-between hover:border-[#008CD2]/60 transition-colors duration-150"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#EDF6FC] flex items-center justify-center mb-4">
                    <ServiceIcon slug={service.slug} className="w-5 h-5 text-[#008CD2]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0B2545] mb-2">
                    <Link
                      to={`/services/${service.slug}`}
                      className="hover:text-[#008CD2] transition-colors"
                    >
                      {service.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-[#334E68] leading-relaxed mb-5">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EDF3F8] flex items-center justify-between gap-3 text-sm">
                  <Link
                    to={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1.5 font-semibold text-[#008CD2] hover:text-[#006CA3]"
                  >
                    <span>Explore {service.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                  <Link
                    to={`/contact?service=${encodeURIComponent(service.slug)}`}
                    className="font-medium text-[#3E6E0B] hover:text-[#0B2545]"
                  >
                    Enquire
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Company Introduction */}
      <section className="bg-white py-16 lg:py-20 border-b border-[#DCE5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden border border-[#DCE5EE] bg-[#F5F8FB] aspect-[4/3]">
                <img
                  src={COMPANY.assets.consultationDesk}
                  alt="Prepared business documents and folders ready for submission at an Abu Dhabi consultancy desk"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  width={800}
                  height={600}
                />
              </div>
            </div>

            <div className="lg:col-span-7">
              <p className="text-sm font-semibold text-[#008CD2] mb-2">
                About {COMPANY.brandName}
              </p>
              <h2
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B2545] mb-4"
                style={{ textWrap: 'balance' }}
              >
                Practical Paperwork &amp; Government Follow-Up in Abu Dhabi
              </h2>
              <p className="text-base text-[#334E68] leading-relaxed mb-4">
                {COMPANY.legalName} is an Abu Dhabi-based partner for companies
                and individuals who need visa, PRO, and document-clearing work
                handled properly.
              </p>
              <p className="text-base text-[#334E68] leading-relaxed mb-6">
                We take over the paperwork preparation and authority follow-up so
                your team and family can stay focused on your business and daily
                priorities. Requirements, fees, and approval decisions remain
                subject to the relevant UAE authorities.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm font-semibold text-[#0B2545] hover:bg-[#F5F8FB] transition-colors"
                >
                  <span>More About Our Approach</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/how-we-work"
                  className="text-sm font-semibold text-[#008CD2] hover:text-[#006CA3]"
                >
                  See Our 4-Step Process
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Who We Serve */}
      <section className="bg-[#F5F8FB] py-16 lg:py-20 border-b border-[#DCE5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-sm font-semibold text-[#008CD2] mb-2">
              Who We Serve
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B2545]"
              style={{ textWrap: 'balance' }}
            >
              Structured Support for Businesses, Investors, Families &amp; Professionals
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHO_WE_SERVE.map((group) => (
              <div
                key={group.id}
                className="bg-white border border-[#DCE5EE] rounded-xl p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold text-[#0B2545] mb-2.5">
                    {group.title}
                  </h3>
                  <p className="text-sm text-[#334E68] leading-relaxed mb-4">
                    {group.summary}
                  </p>
                </div>
                <ul className="space-y-2 pt-4 border-t border-[#EDF3F8] text-xs text-[#334E68]">
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

      {/* 5. How We Work (4-Step Process) */}
      <section className="bg-white py-16 lg:py-20 border-b border-[#DCE5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-[#008CD2] mb-2">
                How We Work
              </p>
              <h2
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B2545]"
                style={{ textWrap: 'balance' }}
              >
                A Clear Four-Step Workflow from Consultation to Delivery
              </h2>
            </div>
            <p className="text-sm font-medium text-[#3E6E0B]">
              “One point of contact from the first call to the final stamp.”
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_WE_WORK_STEPS.map((item) => (
              <div
                key={item.step}
                className="border border-[#DCE5EE] rounded-xl p-6 bg-[#F5F8FB]/60"
              >
                <span className="font-mono text-sm font-semibold text-[#008CD2] tabular-nums">
                  {item.step}
                </span>
                <h3 className="text-lg font-bold text-[#0B2545] mt-2 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-[#334E68] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Work With Us + Consultation Banner */}
      <section className="bg-[#0B2545] text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <p className="text-sm font-semibold text-[#84C325] mb-2">
                Why Work With Us
              </p>
              <h2
                className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-8"
                style={{ textWrap: 'balance' }}
              >
                Organized Coordination for Essential UAE Documentation
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {WHY_WORK_WITH_US.map((reason) => (
                  <div
                    key={reason.title}
                    className="border border-white/15 rounded-xl p-5 bg-white/5"
                  >
                    <h3 className="text-base font-bold text-white mb-2">
                      {reason.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden border border-white/15 bg-[#102F57]">
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={COMPANY.assets.abuDhabiDistrict}
                    alt="Modern commercial towers along a palm-lined avenue in Abu Dhabi"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    width={960}
                    height={540}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Need Assistance with a Visa, PRO, or Clearing File?
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-5">
                    Speak directly with our Najda Street team to confirm the
                    applicable requirements for your case.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#008CD2] hover:bg-[#0074B3] text-white text-sm font-semibold transition-colors"
                    >
                      <span>Request a Consultation</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                    <a
                      href={COMPANY.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#4A7C10] hover:bg-[#3E6E0B] text-white text-sm font-semibold transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Preview */}
      <section className="bg-white py-16 lg:py-20 border-b border-[#DCE5EE]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-sm font-semibold text-[#008CD2] mb-2">
                Common Questions
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B2545]">
                Frequently Asked Questions
              </h2>
            </div>
            <Link
              to="/faq"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#008CD2] hover:text-[#006CA3] whitespace-nowrap"
            >
              <span>View All FAQs</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <FaqAccordion items={faqs} />
        </div>
      </section>

      {/* 8. Contact & Consultation Form */}
      <section className="bg-[#F5F8FB] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div>
                <p className="text-sm font-semibold text-[#008CD2] mb-2">
                  Contact Us
                </p>
                <h2
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B2545] mb-3"
                  style={{ textWrap: 'balance' }}
                >
                  Speak with {COMPANY.brandName}
                </h2>
                <p className="text-sm sm:text-base text-[#334E68] leading-relaxed">
                  Send us your enquiry below, call our office, or start a
                  WhatsApp conversation. We will review your request and guide you
                  on the next steps.
                </p>
              </div>

              <div className="bg-white border border-[#DCE5EE] rounded-xl p-6 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#84C325] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-[#0B2545]">Office Location</p>
                    <p className="text-[#334E68]">{COMPANY.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#008CD2] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-[#0B2545]">Telephone</p>
                    <a
                      href={COMPANY.phoneHref}
                      className="text-[#008CD2] font-medium hover:underline tabular-nums"
                    >
                      {COMPANY.phoneDisplay}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#008CD2] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-[#0B2545]">Email</p>
                    <a
                      href={COMPANY.emailHref}
                      className="text-[#008CD2] font-medium hover:underline break-all"
                    >
                      {COMPANY.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white border border-[#DCE5EE] rounded-xl p-6 sm:p-8">
              <h3 className="text-xl font-bold text-[#0B2545] mb-5">
                Request a Consultation
              </h3>
              <EnquiryForm compact sourcePage="/" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
