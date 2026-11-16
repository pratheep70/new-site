import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { EnquiryForm } from './EnquiryForm';
import { EASE_EDITORIAL } from './MotionPrimitives';

interface QuickConsultModalProps {
  open: boolean;
  defaultServiceSlug?: string;
  onClose: () => void;
}

export function QuickConsultModal({
  open,
  defaultServiceSlug = 'visa-services',
  onClose,
}: QuickConsultModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-consult-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0B2545]/55 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.24, ease: EASE_EDITORIAL }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-[#DCE5EE] rounded-2xl shadow-2xl p-6 sm:p-8 z-10"
          >
            <div className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-[#DCE5EE]">
              <div>
                <p className="text-xs font-semibold text-[#008CD2] mb-1">
                  SIGN IN DOCUMENTS CLEARING · Abu Dhabi
                </p>
                <h2
                  id="quick-consult-title"
                  className="text-xl sm:text-2xl font-bold text-[#0B2545]"
                >
                  Request a Consultation
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close consultation pop-up"
                className="w-10 h-10 rounded-lg border border-[#DCE5EE] flex items-center justify-center text-[#334E68] hover:text-[#0B2545] hover:bg-[#F5F8FB] transition-colors shrink-0"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <EnquiryForm
              compact
              defaultServiceSlug={defaultServiceSlug}
              sourcePage={`${window.location.pathname}#quick-modal`}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
