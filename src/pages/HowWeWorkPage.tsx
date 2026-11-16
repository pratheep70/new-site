import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { PopUpCard, RevealBlock } from '../components/MotionPrimitives';
import { HOW_WE_WORK_STEPS, WHY_WORK_WITH_US } from '../utils/company';

export function HowWeWorkPage() {
  return (
    <>
      <SeoHead
        title="How We Work | Four-Step Visa & PRO Process — SIGN IN DOCUMENTS CLEARING"
        description="See how Sign In Documents Clearing handles consultations, document preparation, authority submission follow-up, and delivery in Abu Dhabi."
        canonicalPath="/how-we-work"
      />

      <section className="bg-[#F5F8FB] border-b border-[#DCE5EE] py-14 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealBlock y={14} className="max-w-3xl">
            <p className="text-sm font-semibold text-[#008CD2] mb-2">
              Our Process
            </p>
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B2545] mb-4"
              style={{ textWrap: 'balance' }}
            >
              One Point of Contact from the First Call to the Final Stamp
            </h1>
            <p className="text-base sm:text-lg text-[#334E68] leading-relaxed">
              We follow a clear four-step workflow designed to eliminate guesswork
              and keep you informed at every stage of your transaction.
            </p>
          </RevealBlock>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-18 border-b border-[#DCE5EE]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
          {HOW_WE_WORK_STEPS.map((step, idx) => (
            <PopUpCard key={step.step} delay={idx * 0.08}>
              <div className="border border-[#DCE5EE] rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-start gap-5 bg-white hover:border-[#008CD2]/60 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-[#EDF6FC] flex items-center justify-center font-mono text-base font-bold text-[#008CD2] shrink-0 tabular-nums">
                  {step.step}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0B2545] mb-2">
                    {step.title}
                  </h2>
                  <p className="text-base text-[#334E68] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </PopUpCard>
          ))}
        </div>
      </section>

      <section className="bg-[#F5F8FB] py-14 lg:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealBlock>
            <h2 className="text-2xl font-bold text-[#0B2545] mb-8">
              Why Businesses &amp; Individuals Work With Us
            </h2>
          </RevealBlock>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {WHY_WORK_WITH_US.map((item, idx) => (
              <PopUpCard key={item.title} delay={idx * 0.06} className="h-full">
                <div className="h-full bg-white border border-[#DCE5EE] rounded-xl p-6">
                  <h3 className="text-lg font-bold text-[#0B2545] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#334E68] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </PopUpCard>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#008CD2] hover:bg-[#0074B3] text-white text-sm font-semibold transition-colors"
            >
              <span>Start Your Consultation</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
