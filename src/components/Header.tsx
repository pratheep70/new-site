import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Mail, MapPin, Menu, MessageCircle, Phone, X } from 'lucide-react';
import { COMPANY } from '../utils/company';
import { SERVICE_CATALOG } from '../data/catalog';
import { EASE_EDITORIAL } from './MotionPrimitives';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setServicesOpen(false);
        setMobileOpen(false);
      }
    }
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 py-1 border-b-2 ${
      isActive
        ? 'text-[#008CD2] border-[#008CD2]'
        : 'text-[#334E68] border-transparent hover:text-[#0B2545] hover:border-[#008CD2]/40'
    }`;

  return (
    <>
      <div className="hidden md:block bg-[#0B2545] text-slate-200 text-xs border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5 min-w-0">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <MapPin className="w-3.5 h-3.5 text-[#84C325] shrink-0" aria-hidden="true" />
              <span>{COMPANY.location}</span>
            </span>
            <a
              href={COMPANY.phoneHref}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap tabular-nums"
            >
              <Phone className="w-3.5 h-3.5 text-[#008CD2] shrink-0" aria-hidden="true" />
              <span>{COMPANY.phoneDisplay}</span>
            </a>
            <a
              href={COMPANY.emailHref}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap"
            >
              <Mail className="w-3.5 h-3.5 text-[#008CD2] shrink-0" aria-hidden="true" />
              <span>{COMPANY.email}</span>
            </a>
          </div>
          <a
            href={COMPANY.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#84C325] hover:text-white font-medium transition-colors whitespace-nowrap shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>WhatsApp Desk</span>
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-[#DCE5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-[72px] flex items-center justify-between gap-8">
          <Link
            to="/"
            className="shrink-0 flex items-center focus-visible:rounded"
            aria-label={`${COMPANY.brandName} — Home`}
          >
            <img
              src="/assets/aistudio/signin-header-logo.png"
              alt={COMPANY.brandName}
              className="h-10 md:h-11 w-auto object-contain"
              width={2048}
              height={652}
            />
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden min-[900px]:flex items-center gap-4"
          >
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                aria-expanded={servicesOpen}
                aria-haspopup="true"
                onClick={() => setServicesOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 py-1 border-b-2 ${
                  location.pathname.startsWith('/services')
                    ? 'text-[#008CD2] border-[#008CD2]'
                    : 'text-[#334E68] border-transparent hover:text-[#0B2545] hover:border-[#008CD2]/40'
                }`}
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-150 ${
                    servicesOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.16, ease: EASE_EDITORIAL }}
                    role="menu"
                    aria-label="Services menu"
                    className="absolute left-0 top-full mt-3 w-72 bg-white border border-[#DCE5EE] rounded-xl shadow-lg py-2 z-50 origin-top-left"
                  >
                    <Link
                      role="menuitem"
                      to="/services"
                      className="block px-4 py-2.5 text-sm font-semibold text-[#0B2545] hover:bg-[#F5F8FB] border-b border-[#DCE5EE]"
                    >
                      All Services Overview
                    </Link>
                    {SERVICE_CATALOG.map((service) => (
                      <Link
                        key={service.slug}
                        role="menuitem"
                        to={`/services/${service.slug}`}
                        className="block px-4 py-2 text-sm text-[#334E68] hover:bg-[#F5F8FB] hover:text-[#008CD2] transition-colors"
                      >
                        {service.title}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink to="/how-we-work" className={navLinkClass}>
              How It Works
            </NavLink>
            <NavLink to="/faq" className={navLinkClass}>
              FAQs
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-[#008CD2] hover:bg-[#0074B3] text-white text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0"
            >
              Request a Consultation
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="min-[900px]:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#DCE5EE] text-[#0B2545] hover:bg-[#F5F8FB] transition-colors"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: EASE_EDITORIAL }}
              id="mobile-nav-drawer"
              aria-label="Mobile navigation"
              className="min-[900px]:hidden bg-white border-t border-[#DCE5EE] px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto"
            >
            <NavLink
              to="/"
              end
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#0B2545] hover:bg-[#F5F8FB]"
            >
              Home
            </NavLink>
            <div className="py-1">
              <NavLink
                to="/services"
                className="block px-3 py-2.5 rounded-lg text-base font-semibold text-[#008CD2] hover:bg-[#F5F8FB]"
              >
                All Services
              </NavLink>
              <div className="pl-4 mt-1 space-y-1 border-l border-[#DCE5EE] ml-3">
                {SERVICE_CATALOG.map((svc) => (
                  <NavLink
                    key={svc.slug}
                    to={`/services/${svc.slug}`}
                    className="block px-3 py-2 rounded-lg text-sm text-[#334E68] hover:bg-[#F5F8FB]"
                  >
                    {svc.title}
                  </NavLink>
                ))}
              </div>
            </div>
            <NavLink
              to="/how-we-work"
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#0B2545] hover:bg-[#F5F8FB]"
            >
              How It Works
            </NavLink>
            <NavLink
              to="/faq"
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#0B2545] hover:bg-[#F5F8FB]"
            >
              FAQs
            </NavLink>
            <NavLink
              to="/contact"
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#0B2545] hover:bg-[#F5F8FB]"
            >
              Contact
            </NavLink>
            <NavLink
              to="/about"
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#0B2545] hover:bg-[#F5F8FB]"
            >
              About
            </NavLink>

            <div className="pt-3 mt-3 border-t border-[#DCE5EE] space-y-2.5">
              <Link
                to="/contact"
                className="block w-full text-center px-4 py-3 rounded-lg bg-[#008CD2] text-white text-sm font-semibold"
              >
                Request a Consultation
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={COMPANY.phoneHref}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-[#DCE5EE] text-sm font-medium text-[#0B2545]"
                >
                  <Phone className="w-4 h-4 text-[#008CD2]" aria-hidden="true" />
                  <span>{COMPANY.phoneDisplay}</span>
                </a>
                <a
                  href={COMPANY.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-[#4A7C10] text-white text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
