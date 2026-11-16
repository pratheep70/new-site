import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ArrowRight, Check, Info } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { ServiceIcon } from '../components/ServiceIcon';
import { FaqAccordion } from '../components/FaqAccordion';
import {
  FAQ_CATALOG,
  SERVICE_CATALOG,
  type FaqDefinition,
  type ServiceDefinition,
} from '../data/catalog';
import { fetchServiceBySlug } from '../lib/api';

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const fallbackService = SERVICE_CATALOG.find((s) => s.slug === slug) || null;
  const fallbackFaqs = FAQ_CATALOG.filter((f) => f.serviceSlug === slug);

  const [service, setService] = useState<ServiceDefinition | null>(fallbackService);
  const [faqs, setFaqs] = useState<FaqDefinition[]>(fallbackFaqs);
  const [notFound, setNotFound] = useState(!fallbackService);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      return;
    }

    const localMatch = SERVICE_CATALOG.find((s) => s.slug === slug) || null;
    setService(localMatch);
    setFaqs(FAQ_CATALOG.filter((f) => f.serviceSlug === slug));
    setNotFound(!localMatch);

    fetchServiceBySlug(slug)
      .then((item) => {
        setService(item);
        if (item.faqs) setFaqs(item.faqs);
        setNotFound(false);
      })
      .catch(() => {
        if (!localMatch) setNotFound(true);
      });
  }, [slug]);

  if (notFound || !service) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <AlertCircle className="w-10 h-10 text-[#008CD2] mx-auto mb-4" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-[#0B2545] mb-2">
          Service Page Not Found
        </h1>
        <p className="text-sm text-[#334E68] mb-6">
          The requested service could not be found. Browse our six core service
          areas below.
        </p>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#008CD2] text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to All Services</span>
        </Link>
      </section>
    );
  }

  const relatedServices = SERVICE_CATALOG.filter((s) => s.slug !== service.slug).slice(
    0,
    3,
  );

  return (
    <>
      <SeoHead
        title={`${service.title} in Abu Dhabi | SIGN IN DOCUMENTS CLEARING`}
        description={service.shortDescription}
        canonicalPath={`/services/${service.slug}`}
      />

      <section className="bg-[#F5F8FB] border-b border-[#DCE5EE] py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-5">
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#008CD2] hover:text-[#006CA3]"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>All Services</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-lg bg-white border border-[#DCE5EE] flex items-center justify-center">
                  <ServiceIcon slug={service.slug} className="w-6 h-6 text-[#008CD2]" />
                </div>
                <span className="text-sm font-semibold text-[#008CD2]">
                  Abu Dhabi Service Guide
                </span>
              </div>
              <h1
                className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B2545] mb-4"
                style={{ textWrap: 'balance' }}
              >
                {service.title}
              </h1>
              <p className="text-base sm:text-lg text-[#334E68] leading-relaxed">
                {service.fullDescription}
              </p>
            </div>

            <div className="lg:col-span-4 bg-white border border-[#DCE5EE] rounded-xl p-6">
              <h2 className="text-base font-bold text-[#0B2545] mb-2">
                Need {service.title} Support?
              </h2>
              <p className="text-sm text-[#334E68] leading-relaxed mb-5">
                Speak with our Najda Street team to review the requirements
                applicable to your case.
              </p>
              <Link
                to={`/contact?service=${encodeURIComponent(service.slug)}`}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#008CD2] hover:bg-[#0074B3] text-white text-sm font-semibold transition-colors"
              >
                <span>Enquire About {service.title}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-16 border-b border-[#DCE5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-[#0B2545] mb-6">
              What Is Included
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {service.subcategories.map((sub) => (
                <div
                  key={sub.title}
                  className="border border-[#DCE5EE] rounded-xl p-6 bg-[#F5F8FB]/50"
                >
                  <h3 className="text-lg font-bold text-[#0B2545] mb-2">
                    {sub.title}
                  </h3>
                  <p className="text-sm text-[#334E68] leading-relaxed mb-4">
                    {sub.description}
                  </p>
                  <ul className="space-y-2 text-sm text-[#334E68]">
                    {sub.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check
                          className="w-4 h-4 text-[#4A7C10] shrink-0 mt-0.5"
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-[#DCE5EE]">
            <div className="lg:col-span-5">
              <h2 className="text-xl font-bold text-[#0B2545] mb-3">
                Who This Service Is For
              </h2>
              <ul className="space-y-2.5 text-sm text-[#334E68]">
                {service.audience.map((aud) => (
                  <li key={aud} className="flex items-center gap-2.5">
                    <Check
                      className="w-4 h-4 text-[#008CD2] shrink-0"
                      aria-hidden="true"
                    />
                    <span className="font-medium text-[#0B2545]">{aud}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7">
              <h2 className="text-xl font-bold text-[#0B2545] mb-3">
                How We Help
              </h2>
              <ol className="space-y-3 text-sm sm:text-base text-[#334E68]">
                {service.howWeHelp.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="font-mono text-xs font-semibold text-[#008CD2] bg-[#EDF6FC] px-2 py-1 rounded tabular-nums shrink-0 mt-0.5">
                      0{i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="border border-[#DCE5EE] bg-[#F5F8FB] rounded-xl p-5 flex items-start gap-3 text-sm text-[#334E68]">
            <Info className="w-5 h-5 text-[#008CD2] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold text-[#0B2545] mb-1">
                Important Notice on Requirements, Fees &amp; Approvals
              </p>
              <p className="leading-relaxed">{service.disclaimer}</p>
            </div>
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="bg-[#F5F8FB] py-14 border-b border-[#DCE5EE]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-[#0B2545] mb-6">
              {service.title} — Frequently Asked Questions
            </h2>
            <FaqAccordion items={faqs} />
          </div>
        </section>
      )}

      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl font-bold text-[#0B2545] mb-6">
            Related Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedServices.map((rel) => (
              <Link
                key={rel.slug}
                to={`/services/${rel.slug}`}
                className="border border-[#DCE5EE] rounded-xl p-5 hover:border-[#008CD2] transition-colors block"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <ServiceIcon slug={rel.slug} className="w-4 h-4 text-[#008CD2]" />
                  <h3 className="text-base font-bold text-[#0B2545]">
                    {rel.title}
                  </h3>
                </div>
                <p className="text-sm text-[#334E68] line-clamp-2">
                  {rel.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
