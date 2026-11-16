import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FaqDefinition } from '../data/catalog';

export function FaqAccordion({ items }: { items: FaqDefinition[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[#DCE5EE] border-y border-[#DCE5EE]">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        const panelId = `faq-panel-${item.id ?? idx}`;
        return (
          <div key={`${item.question}-${idx}`} className="py-4">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full flex items-start justify-between gap-4 text-left py-1 group"
            >
              <div>
                <p className="text-xs font-medium text-[#008CD2] mb-1">
                  {item.category}
                </p>
                <span className="text-base font-semibold text-[#0B2545] group-hover:text-[#008CD2] transition-colors">
                  {item.question}
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-[#52606D] shrink-0 mt-1 transition-transform duration-150 ${
                  isOpen ? 'rotate-180 text-[#008CD2]' : ''
                }`}
                aria-hidden="true"
              />
            </button>
            {isOpen && (
              <div
                id={panelId}
                className="mt-3 text-sm text-[#334E68] leading-relaxed pr-8"
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
