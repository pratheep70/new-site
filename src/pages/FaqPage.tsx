import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { FaqAccordion } from '../components/FaqAccordion';
import { FAQ_CATALOG, type FaqDefinition } from '../data/catalog';
import { fetchFaqs } from '../lib/api';

export function FaqPage() {
  const [faqs, setFaqs] = useState<FaqDefinition[]>(FAQ_CATALOG);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFaqs()
      .then((items) => {
        if (items.length > 0) setFaqs(items);
      })
      .catch(() => undefined);
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(faqs.map((f) => f.category)));
    return ['All', ...unique];
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((item) => {
      const matchesCat =
        selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [faqs, selectedCategory, searchTerm]);

  return (
    <>
      <SeoHead
        title="FAQs | Visa, PRO & Document Clearing Questions — SIGN IN DOCUMENTS CLEARING"
        description="Answers to common questions about UAE visa services, PRO support, document clearing, business setup, insurance, and Emirates ID coordination in Abu Dhabi."
        canonicalPath="/faq"
      />

      <section className="bg-[#F5F8FB] border-b border-[#DCE5EE] py-14 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-sm font-semibold text-[#008CD2] mb-2">
            Frequently Asked Questions
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B2545] mb-4"
            style={{ textWrap: 'balance' }}
          >
            Clarity on Our Process &amp; Services
          </h1>
          <p className="text-base text-[#334E68] leading-relaxed">
            Because document checklists, government fees, and processing durations
            depend on each specific case and authority, please contact our team to
            confirm details for your file.
          </p>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="space-y-4">
            <div className="relative">
              <Search
                className="w-4 h-4 text-[#52606D] absolute left-3.5 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <label htmlFor="faq-search" className="sr-only">
                Search frequently asked questions
              </label>
              <input
                id="faq-search"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions (e.g. employment visa, attestation, PRO)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#CBD5E1] text-sm text-[#0B2545] placeholder:text-slate-400 focus:border-[#008CD2] focus:outline-none"
              />
            </div>

            <div
              role="group"
              aria-label="Filter questions by service category"
              className="flex flex-wrap gap-1.5 p-1 bg-[#F5F8FB] border border-[#DCE5EE] rounded-lg"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-white text-[#008CD2] shadow-sm border border-[#DCE5EE]'
                      : 'text-[#334E68] hover:text-[#0B2545]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="border border-[#DCE5EE] rounded-xl p-8 text-center">
              <p className="text-base font-semibold text-[#0B2545] mb-1">
                No matching questions found
              </p>
              <p className="text-sm text-[#52606D] mb-4">
                Try clearing your search or ask our Abu Dhabi team directly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 rounded-lg border border-[#CBD5E1] text-sm font-semibold text-[#0B2545] hover:bg-[#F5F8FB]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <FaqAccordion items={filteredFaqs} />
          )}

          <div className="bg-[#F5F8FB] border border-[#DCE5EE] rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#0B2545]">
                Have a Specific Case Question?
              </h2>
              <p className="text-sm text-[#334E68] mt-1">
                Share your requirement with our Najda Street office for tailored
                guidance.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#008CD2] hover:bg-[#0074B3] text-white text-sm font-semibold whitespace-nowrap shrink-0 transition-colors"
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
