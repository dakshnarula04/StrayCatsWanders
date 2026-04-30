import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import type { JournalEntry } from '../types';

interface JournalLightboxProps {
  entry: JournalEntry | null;
  onClose: () => void;
}

/**
 * An accessible modal lightbox for viewing a single journal entry in detail.
 */
export const JournalLightbox: React.FC<JournalLightboxProps> = ({ entry, onClose }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {entry && (
        <Dialog
          static
          open={!!entry}
          onClose={onClose}
          className="relative z-[100]"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#140E04]/85 backdrop-blur-[4px]"
            aria-hidden="true"
          />

          {/* Centered Content Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.88, opacity: 0 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.92, opacity: 0 }}
              transition={{ 
                type: 'spring', 
                stiffness: 280, 
                damping: 24 
              }}
              className="w-full max-w-[340px]"
            >
              <Dialog.Panel
                className="relative w-full bg-[#FFFDF7] p-4 pb-0 shadow-[6px_12px_48px_rgba(0,0,0,0.5)] focus:outline-none"
              >
              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close photo"
                className="absolute top-[10px] right-3 w-7 h-7 bg-black/45 hover:bg-black/65 text-white rounded-full flex items-center justify-center transition-colors z-10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus:outline-none"
              >
                <X size={14} />
              </button>

              {/* Photo */}
              <div className="w-full aspect-square overflow-hidden bg-[#E8E4DA]">
                <img
                  src={entry.imageUrl}
                  alt={entry.imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom Section */}
              <div className="py-4 px-3 flex flex-col items-center">
                <Dialog.Title
                  className="font-['Caveat'] text-xl font-semibold leading-tight text-[#2C2416] text-center"
                >
                  {entry.caption}
                </Dialog.Title>

                <p className="text-[12px] text-[#9C8A6E] font-sans mt-1 text-center">
                  {entry.location} · {entry.date}
                </p>

                {/* Optional Story */}
                {entry.story && (
                  <div className="mt-3 pt-3 border-t border-[#EBE5D5] w-full">
                    <p className="font-sans text-[13px] text-[#5C4E36] leading-relaxed italic text-center px-2">
                      {entry.story}
                    </p>
                  </div>
                )}

                {/* Tags */}
                <div className="mt-4 flex flex-wrap justify-center gap-1">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-sans px-2.5 py-0.5 rounded-full bg-[#F0EBE0] text-[#6B5A3E] border border-[#D8CFBB]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Spacing padding at the very bottom */}
              <div className="h-4" aria-hidden="true" />
            </Dialog.Panel>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
