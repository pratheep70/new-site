import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';

export function NotFoundPage() {
  return (
    <>
      <SeoHead
        title="Page Not Found | SIGN IN DOCUMENTS CLEARING"
        description="The requested page could not be found."
      />
      <section className="bg-white py-24 px-4">
        <div className="max-w-xl mx-auto text-center">
          <p className="font-mono text-sm font-semibold text-[#008CD2] mb-2">
            404
          </p>
          <h1 className="text-3xl font-bold text-[#0B2545] mb-3">
            Page Not Found
          </h1>
          <p className="text-base text-[#334E68] mb-8">
            The page you are looking for may have moved or does not exist. Use the
            links below to explore our Abu Dhabi services or contact our team.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#008CD2] hover:bg-[#0074B3] text-white text-sm font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/services"
              className="px-5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm font-semibold text-[#0B2545] hover:bg-[#F5F8FB] transition-colors"
            >
              View Services
            </Link>
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-lg border border-[#CBD5E1] text-sm font-semibold text-[#0B2545] hover:bg-[#F5F8FB] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
