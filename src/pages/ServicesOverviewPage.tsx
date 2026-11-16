import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { ServiceIcon } from '../components/ServiceIcon';
import { SERVICE_CATALOG, type ServiceDefinition } from '../data/catalog';
import { fetchServices } from '../lib/api';

export function ServicesOverviewPage() {
  const [services, setServices] = useState<ServiceDefinition[]>(SERVICE_CATALOG);

  useEffect(() => {
    fetchServices()
      .then((items) => {
        if (items.length > 0) setServices(items);
      })
      .catch(() => undefined);
  }, []);

  return (
    <>
      <SeoHead
        title="Services | Visa, PRO, Document Clearing & Business Setup — Abu Dhabi"
        description="Explore Visa Services, PRO Services, Document Clearing, Business Setup, Insurance, and Emirates ID services offered by SIGN IN DOCUMENTS CLEARING in Abu Dhabi."
        canonicalPath="/services"
      />

      <section className="bg-[#F5F8FB] border-b border-[#DCE5EE] py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-[#008CD2] mb-2">
              Our Services
            </p>
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B2545] mb-4"
              style={{ textWrap: 'balance' }}
            >
              Complete Corporate &amp; Individual Paperwork Support in Abu Dhabi
            </h1>
            <p className="text-base sm:text-lg text-[#334E68] leading-relaxed">
              Select a service category below to review what is included, who it
              supports, and how our team coordinates your file. All applications,
              fees, and timelines remain subject to the relevant UAE authority.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <article
                key={service.slug}
                className="border border-[#DCE5EE] rounded-xl p-6 sm:p-8 flex flex-col justify-between bg-white hover:border-[#008CD2]/60 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-lg bg-[#EDF6FC] flex items-center justify-center shrink-0">
                      <ServiceIcon
                        slug={service.slug}
                        className="w-5 h-5 text-[#008CD2]"
                      />
                    </div>
                    <h2 className="text-xl font-bold text-[#0B2545]">
                      <Link
                        to={`/services/${service.slug}`}
                        className="hover:text-[#008CD2] transition-colors"
                      >
                        {service.title}
                      </Link>
                    </h2>
                  </div>

                  <p className="text-sm sm:text-base text-[#334E68] leading-relaxed mb-5">
                    {service.shortDescription}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                    {service.subcategories.map((sub) => (
                      <div
                        key={sub.title}
                        className="flex items-start gap-2 text-xs sm:text-sm text-[#334E68]"
                      >
                        <Check
                          className="w-4 h-4 text-[#4A7C10] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{sub.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 border-t border-[#EDF3F8] flex flex-wrap items-center justify-between gap-3">
                  <Link
                    to={`/services/${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#008CD2] hover:text-[#006CA3]"
                  >
                    <span>View {service.title} Details</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                  <Link
                    to={`/contact?service=${encodeURIComponent(service.slug)}`}
                    className="inline-flex items-center px-4 py-2 rounded-lg bg-[#0B2545] hover:bg-[#133866] text-white text-xs font-semibold transition-colors"
                  >
                    Request Consultation
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
