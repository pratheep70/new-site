import { useSearchParams } from 'react-router-dom';
import { ExternalLink, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { EnquiryForm } from '../components/EnquiryForm';
import { RevealBlock } from '../components/MotionPrimitives';
import { ENQUIRY_SERVICE_OPTIONS } from '../data/catalog';
import { COMPANY } from '../utils/company';

export function ContactPage() {
  const [searchParams] = useSearchParams();
  const requestedService = searchParams.get('service') || 'visa-services';
  const validService = ENQUIRY_SERVICE_OPTIONS.some(
    (s) => s.slug === requestedService,
  )
    ? requestedService
    : 'visa-services';

  const mapsEmbedUrl = (import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL || '').trim();
  const directionsUrl =
    (import.meta.env.VITE_DIRECTIONS_URL || '').trim() ||
    'https://www.google.com/maps/search/?api=1&query=Najda+Street+Abu+Dhabi+UAE';

  return (
    <>
      <SeoHead
        title="Contact Us | SIGN IN DOCUMENTS CLEARING — Najda Street, Abu Dhabi"
        description="Call 0501022663, message on WhatsApp, email signinofficial446@gmail.com, or submit a consultation request to SIGN IN DOCUMENTS CLEARING on Najda Street, Abu Dhabi."
        canonicalPath="/contact"
      />

      <section className="bg-[#F5F8FB] border-b border-[#DCE5EE] py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-[#008CD2] mb-2">
              Contact &amp; Consultation
            </p>
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B2545] mb-4"
              style={{ textWrap: 'balance' }}
            >
              Talk to Our Abu Dhabi Team
            </h1>
            <p className="text-base sm:text-lg text-[#334E68] leading-relaxed">
              We would be pleased to assist your company or family with visa, PRO,
              document clearing, business setup, insurance, or Emirates ID
              requirements.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <RevealBlock className="lg:col-span-5 space-y-6">
              <div className="border border-[#DCE5EE] rounded-xl p-6 space-y-5">
                <h2 className="text-xl font-bold text-[#0B2545]">
                  Direct Contact Details
                </h2>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#EDF6FC] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#008CD2]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#52606D]">Phone</p>
                    <a
                      href={COMPANY.phoneHref}
                      className="text-base font-bold text-[#0B2545] hover:text-[#008CD2] tabular-nums"
                    >
                      {COMPANY.phoneDisplay}
                    </a>
                    <p className="text-xs text-[#52606D] mt-0.5">
                      Tap to call our Abu Dhabi desk directly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#F2F9E6] flex items-center justify-center shrink-0">
                    <MessageCircle
                      className="w-5 h-5 text-[#4A7C10]"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#52606D]">WhatsApp</p>
                    <a
                      href={COMPANY.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-base font-bold text-[#3E6E0B] hover:underline"
                    >
                      <span>Chat on WhatsApp ({COMPANY.phoneDisplay})</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                    <p className="text-xs text-[#52606D] mt-0.5">
                      International format: +971 50 102 2663
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#EDF6FC] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#008CD2]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#52606D]">Email</p>
                    <a
                      href={COMPANY.emailHref}
                      className="text-base font-bold text-[#0B2545] hover:text-[#008CD2] break-all"
                    >
                      {COMPANY.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-[#F5F8FB] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#0B2545]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#52606D]">Office Address</p>
                    <p className="text-base font-bold text-[#0B2545]">
                      {COMPANY.location}
                    </p>
                    <p className="text-xs text-[#52606D] mt-0.5">
                      {COMPANY.legalName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-[#DCE5EE] rounded-xl overflow-hidden bg-[#F5F8FB]">
                {mapsEmbedUrl ? (
                  <iframe
                    title="SIGN IN DOCUMENTS CLEARING Abu Dhabi Office Location"
                    src={mapsEmbedUrl}
                    className="w-full h-64 border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="p-6 space-y-3">
                    <p className="text-sm font-bold text-[#0B2545]">
                      Visiting Our Najda Street Office
                    </p>
                    <p className="text-xs text-[#334E68] leading-relaxed">
                      Our office is located on Najda Street in Abu Dhabi, UAE.
                      Please call {COMPANY.phoneDisplay} prior to visiting if you
                      would like directions to our exact building entrance.
                    </p>
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#EDF3F8] text-xs font-semibold text-[#0B2545] transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#008CD2]" aria-hidden="true" />
                      <span>Get Directions on Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </div>
                )}
              </div>
            </RevealBlock>

            <RevealBlock
              delay={0.08}
              className="lg:col-span-7 border border-[#DCE5EE] rounded-xl p-6 sm:p-8 bg-white"
            >
              <h2 className="text-2xl font-bold text-[#0B2545] mb-2">
                Request a Consultation
              </h2>
              <p className="text-sm text-[#334E68] mb-6">
                Complete the form below and a representative from{' '}
                {COMPANY.brandName} will follow up with you.
              </p>
              <EnquiryForm
                defaultServiceSlug={validService}
                sourcePage="/contact"
              />
            </RevealBlock>
          </div>
        </div>
      </section>
    </>
  );
}
