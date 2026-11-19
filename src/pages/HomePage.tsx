import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
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
import {
  EASE_EDITORIAL,
  PopUpCard,
  RevealBlock,
} from '../components/MotionPrimitives';
import { QuickConsultModal } from '../components/QuickConsultModal';
import {
  FAQ_CATALOG,
  SERVICE_CATALOG,
  type FaqDefinition,
  type ServiceDefinition,
} from '../data/catalog';
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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalService, setModalService] = useState('visa-services');

  const heroSectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroSectionRef,
    offset: ['start start', 'end start'],
  });
  const heroImageY = useTransform(heroScrollProgress, [0, 1], [0, 32]);
  const heroImageScale = useTransform(heroScrollProgress, [0, 1], [1, 1.04]);

  useEffect(() => {
    fetchServices()
      .then((items) => {
        if (items.length > 0) {
          const returnedSlugs = new Set(items.map((item) => item.slug));
          const missingServices = SERVICE_CATALOG.filter(
            (item) => !returnedSlugs.has(item.slug),
          );
          setServices([...items, ...missingServices]);
        }
      })
      .catch(() => undefined);

    fetchFaqs()
      .then((items) => {
        if (items.length > 0) setFaqs(items.slice(0, 5));
      })
      .catch(() => undefined);
  }, []);

  function openQuickConsult(serviceSlug = 'visa-services') {
    setModalService(serviceSlug);
    setModalOpen(true);
  }

  return (
    <>
      <SeoHead
        title="SIGN IN DOCUMENTS CLEARING | Visa & PRO Services in Abu Dhabi"
        description="Sign In Transactions Follow Up Services LLC on Najda Street, Abu Dhabi provides UAE visa processing, PRO services, document clearing, business setup, insurance, and Emirates ID coordination."
        canonicalPath="/"
      />

      <QuickConsultModal
        open={modalOpen}
        defaultServiceSlug={modalService}
        onClose={() => setModalOpen(false)}
      />

      {/* 1. Hero Section */}
      <section
        ref={heroSectionRef}
        className="bg-white border-b border-[#DCE5EE] overflow-hidden"
      >
        <div className="relative w-full min-h-[460px] sm:min-h-[500px] lg:min-h-[560px] flex items-center justify-center overflow-hidden bg-[#0B2545]">
          <motion.img
            style={{ y: heroImageY, scale: heroImageScale }}
            src={COMPANY.assets.heroBanner}
            alt="UAE skyline, sunrise horizon, passport, and visa card representing SIGN IN DOCUMENTS CLEARING services"
            className="absolute inset-0 w-full h-full object-cover object-center will-change-transform"
            referrerPolicy="no-referrer"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,24,46,0.78)_0%,rgba(6,24,46,0.52)_54%,rgba(6,24,46,0.28)_100%)]"
          />

          <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-16 text-center text-white">
            <motion.h1
              initial={{ y: 8 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.4, ease: EASE_EDITORIAL }}
              className="text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-tight text-white leading-[1.15] drop-shadow-md mb-5"
              style={{ textWrap: 'balance' }}
            >
              “Your Trusted Partners for All Typing and PRO Services”
            </motion.h1>

            <motion.p
              initial={{ y: 8 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.4, delay: 0.04, ease: EASE_EDITORIAL }}
              className="text-base sm:text-lg text-white/95 leading-relaxed max-w-2xl mx-auto drop-shadow-sm mb-8"
            >
              From visa processing and PRO transactions to document clearing and
              business setup, {COMPANY.legalName} manages your essential
              paperwork across Abu Dhabi and the UAE.
            </motion.p>

            <motion.div
              initial={{ y: 6 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.38, delay: 0.08, ease: EASE_EDITORIAL }}
              className="flex flex-wrap items-center justify-center gap-3.5 mb-6"
            >
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#008CD2] hover:bg-[#0074B3] active:scale-[0.99] text-white text-sm font-semibold shadow-lg shadow-black/25 transition-all duration-150 whitespace-nowrap shrink-0"
              >
                <span>Talk to Our Team</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg border border-white/45 bg-[#0B2545]/70 hover:bg-[#0B2545]/90 backdrop-blur-sm active:scale-[0.99] text-white text-sm font-semibold transition-all duration-150 whitespace-nowrap shrink-0"
              >
                Explore Our Services
              </Link>
            </motion.div>

          </div>
        </div>

        {/* Grounded scope strip below banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            {[
              {
                title: 'Single Point of Contact',
                text: 'One point of contact from the first call to the final stamp.',
              },
              {
                title: 'Companies & Individuals',
                text: 'Supporting SMEs, investors, families, and freelancers in the UAE.',
              },
              {
                title: 'End-to-End Follow-Up',
                text: 'Preparation, submission coordination, and clear status updates.',
              },
              {
                title: 'Abu Dhabi Office',
                text: 'Conveniently located on Najda Street, Abu Dhabi, UAE.',
              },
            ].map((item, idx) => (
              <RevealBlock key={item.title} delay={idx * 0.05} y={12}>
                <p className="font-semibold text-[#0B2545]">{item.title}</p>
                <p className="text-[#52606D] mt-1">{item.text}</p>
              </RevealBlock>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Six Core Service Categories */}
      <section className="bg-[#F5F8FB] py-16 lg:py-20 border-b border-[#DCE5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealBlock className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
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
          </RevealBlock>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <PopUpCard
                key={service.slug}
                delay={idx * 0.06}
                className="h-full"
              >
                <article className="h-full bg-white border border-[#DCE5EE] rounded-xl p-6 flex flex-col justify-between hover:border-[#008CD2]/60 hover:shadow-md transition-all duration-200 group">
                  <div>
                    <div className="w-10 h-10 rounded-lg bg-[#EDF6FC] flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-105">
                      <ServiceIcon
                        slug={service.slug}
                        className="w-5 h-5 text-[#008CD2]"
                      />
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
                      <ArrowRight
                        className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                    <button
                      type="button"
                      onClick={() => openQuickConsult(service.slug)}
                      className="font-semibold text-[#3E6E0B] hover:text-[#0B2545] transition-colors"
                    >
                      Quick Enquire
                    </button>
                  </div>
                </article>
              </PopUpCard>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Company Introduction */}
      <section className="bg-white py-16 lg:py-20 border-b border-[#DCE5EE] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <motion.div
              initial={{ opacity: 0.25, x: -14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 'some', margin: '160px 0px' }}
              transition={{ duration: 0.38, ease: EASE_EDITORIAL }}
              className="lg:col-span-5"
            >
              <div className="rounded-xl overflow-hidden border border-[#DCE5EE] bg-[#F5F8FB] aspect-[4/3]">
                <img
                  src={COMPANY.assets.consultationDesk}
                  alt="Prepared business documents and folders ready for submission at an Abu Dhabi consultancy desk"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                  referrerPolicy="no-referrer"
                  width={800}
                  height={600}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0.25, x: 14 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 'some', margin: '160px 0px' }}
              transition={{ duration: 0.38, delay: 0.05, ease: EASE_EDITORIAL }}
              className="lg:col-span-7"
            >
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Who We Serve */}
      <section className="bg-[#F5F8FB] py-16 lg:py-20 border-b border-[#DCE5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealBlock className="max-w-2xl mb-10">
            <p className="text-sm font-semibold text-[#008CD2] mb-2">
              Who We Serve
            </p>
            <h2
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B2545]"
              style={{ textWrap: 'balance' }}
            >
              Structured Support for Businesses, Investors, Families &amp; Professionals
            </h2>
          </RevealBlock>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHO_WE_SERVE.map((group, idx) => (
              <PopUpCard key={group.id} delay={idx * 0.06} className="h-full">
                <div className="h-full bg-white border border-[#DCE5EE] rounded-xl p-6 flex flex-col justify-between hover:border-[#008CD2]/50 hover:shadow-sm transition-all duration-200">
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
              </PopUpCard>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How We Work (4-Step Process) */}
      <section className="bg-white py-16 lg:py-20 border-b border-[#DCE5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealBlock className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
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
          </RevealBlock>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_WE_WORK_STEPS.map((item, idx) => (
              <PopUpCard key={item.step} delay={idx * 0.08} className="h-full">
                <div className="h-full border border-[#DCE5EE] rounded-xl p-6 bg-[#F5F8FB]/60 hover:bg-white hover:border-[#008CD2]/50 transition-colors duration-200">
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
              </PopUpCard>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Work With Us + Consultation Banner */}
      <section className="bg-[#0B2545] text-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <RevealBlock>
                <p className="text-sm font-semibold text-[#84C325] mb-2">
                  Why Work With Us
                </p>
                <h2
                  className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-8"
                  style={{ textWrap: 'balance' }}
                >
                  Organized Coordination for Essential UAE Documentation
                </h2>
              </RevealBlock>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {WHY_WORK_WITH_US.map((reason, idx) => (
                  <PopUpCard key={reason.title} delay={idx * 0.07}>
                    <div className="h-full border border-white/15 rounded-xl p-5 bg-white/5 hover:bg-white/10 transition-colors duration-200">
                      <h3 className="text-base font-bold text-white mb-2">
                        {reason.title}
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {reason.description}
                      </p>
                    </div>
                  </PopUpCard>
                ))}
              </div>
            </div>

            <PopUpCard delay={0.12} className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden border border-white/15 bg-[#102F57]">
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={COMPANY.assets.abuDhabiDistrict}
                    alt="Modern commercial towers along a palm-lined avenue in Abu Dhabi"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
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
                    <button
                      type="button"
                      onClick={() => openQuickConsult('visa-services')}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#008CD2] hover:bg-[#0074B3] text-white text-sm font-semibold transition-colors"
                    >
                      <span>Request a Consultation</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
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
            </PopUpCard>
          </div>
        </div>
      </section>

      {/* 7. FAQ Preview */}
      <section className="bg-white py-16 lg:py-20 border-b border-[#DCE5EE]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <RevealBlock className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
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
          </RevealBlock>

          <RevealBlock delay={0.08}>
            <FaqAccordion items={faqs} />
          </RevealBlock>
        </div>
      </section>

      {/* 8. Contact & Consultation Form */}
      <section className="bg-[#F5F8FB] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <RevealBlock className="lg:col-span-5 space-y-6">
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
            </RevealBlock>

            <RevealBlock
              delay={0.08}
              className="lg:col-span-7 bg-white border border-[#DCE5EE] rounded-xl p-6 sm:p-8"
            >
              <h3 className="text-xl font-bold text-[#0B2545] mb-5">
                Request a Consultation
              </h3>
              <EnquiryForm compact sourcePage="/" />
            </RevealBlock>
          </div>
        </div>
      </section>
    </>
  );
}
