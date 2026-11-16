import { Link } from 'react-router-dom';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { COMPANY } from '../utils/company';
import { SERVICE_CATALOG } from '../data/catalog';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0B2545] text-slate-300 border-t border-[#163760]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="inline-block bg-white rounded-lg px-3 py-1.5 border border-white/20 mb-4">
              <img
                src={COMPANY.assets.logo}
                alt={COMPANY.brandName}
                className="h-9 w-auto object-contain"
                loading="lazy"
                width={150}
                height={36}
              />
            </div>
            <p className="text-sm font-semibold text-white mb-1">
              {COMPANY.brandName}
            </p>
            <p className="text-xs text-slate-400 mb-3">{COMPANY.legalName}</p>
            <p className="text-sm text-slate-300 leading-relaxed mb-5">
              {COMPANY.tagline}. Assisting companies, investors, families, and
              professionals in Abu Dhabi with structured paperwork and follow-up.
            </p>
            <div className="flex items-center gap-4 text-xs font-medium">
              <a
                href={COMPANY.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-[#84C325] transition-colors"
              >
                Instagram
              </a>
              <span aria-hidden="true" className="text-slate-600">
                /
              </span>
              <a
                href={COMPANY.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-[#84C325] transition-colors"
              >
                TikTok
              </a>
              <span aria-hidden="true" className="text-slate-600">
                /
              </span>
              <a
                href={COMPANY.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-[#84C325] transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white mb-4">
              Our Services
            </h2>
            <ul className="space-y-2.5 text-sm">
              {SERVICE_CATALOG.map((service) => (
                <li key={service.slug}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white mb-4">
              Company & Resources
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="text-slate-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/how-we-work"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  How We Work
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-300 hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Request a Consultation
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Privacy Policy (Draft)
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Terms & Conditions (Draft)
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Staff Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white mb-4">
              Abu Dhabi Office
            </h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#84C325] mt-0.5 shrink-0" aria-hidden="true" />
                <span>{COMPANY.location}</span>
              </li>
              <li>
                <a
                  href={COMPANY.phoneHref}
                  className="inline-flex items-center gap-2.5 hover:text-white transition-colors tabular-nums"
                >
                  <Phone className="w-4 h-4 text-[#008CD2] shrink-0" aria-hidden="true" />
                  <span>{COMPANY.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a
                  href={COMPANY.emailHref}
                  className="inline-flex items-center gap-2.5 hover:text-white transition-colors break-all"
                >
                  <Mail className="w-4 h-4 text-[#008CD2] shrink-0" aria-hidden="true" />
                  <span>{COMPANY.email}</span>
                </a>
              </li>
              <li className="pt-1">
                <a
                  href={COMPANY.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#4A7C10] hover:bg-[#3E6E0B] text-white text-xs font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Message on WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {year} {COMPANY.legalName}. All rights reserved.
          </p>
          <p className="max-w-2xl leading-relaxed">
            Independent corporate services provider. Not a UAE government
            department. Final approvals, fees, and processing durations are
            determined by the relevant authorities.
          </p>
        </div>
      </div>
    </footer>
  );
}
