import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Trash2, Edit, Loader2 } from 'lucide-react';
import { journalApi } from '../services/journalApi';
import { useAuth } from '../context/AuthContext';
import type { JournalEntry } from '../types';

interface JournalLightboxProps {
  entry: JournalEntry | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onEdit: (entry: JournalEntry) => void; // Added for editing
}

/**
 * An accessible modal lightbox for viewing a single journal entry in detail.
 * Includes a delete action with confirmation.
 */
export const JournalLightbox: React.FC<JournalLightboxProps> = ({ entry, onClose, onDelete, onEdit }) => {
  const shouldReduceMotion = useReducedMotion();
  const { isAdmin, accessToken } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    if (!entry || !accessToken) return;
    setDeleting(true);
    try {
      await journalApi.delete(entry.id, accessToken);
      onDelete(entry.id);
    } catch (e: any) {
      console.error('Delete failed:', e.message);
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleClose = () => {
    setConfirmDelete(false);
    setDeleting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {entry && (
        <Dialog
          static
          open={!!entry}
          onClose={handleClose}
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
              <DialogPanel
                className="relative w-full bg-[#FFFDF7] dark:bg-[#1E1A12] p-4 pb-0 shadow-[6px_12px_48px_rgba(0,0,0,0.5)] focus:outline-none"
              >
              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close photo"
                className="absolute top-[10px] right-3 w-7 h-7 bg-black/45 hover:bg-black/65 text-white rounded-full flex items-center justify-center transition-colors z-10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus:outline-none"
              >
                <X size={14} />
              </button>

              {/* Photo */}
              <div className="w-full aspect-square overflow-hidden bg-[#E8E4DA] dark:bg-[#2A261F]">
                <img
                  src={entry.imageUrl}
                  alt={entry.imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom Section */}
              <div className="py-4 px-3 flex flex-col items-center">
                <DialogTitle
                  className="font-['Caveat'] text-xl font-semibold leading-tight text-[#2C2416] dark:text-[#EDE5D0] text-center"
                >
                  {entry.caption}
                </DialogTitle>

                <p className="text-[12px] text-[#9C8A6E] font-sans mt-1 text-center">
                  {entry.location} · {entry.date}
                </p>

                {/* Optional Story */}
                {entry.story && (
                  <div className="mt-3 pt-3 border-t border-[#EBE5D5] dark:border-[#3A352B] w-full">
                    <p className="font-sans text-[13px] text-[#5C4E36] dark:text-[#C4B89A] leading-relaxed italic text-center px-2">
                      {entry.story}
                    </p>
                  </div>
                )}

                {/* Tags */}
                <div className="mt-4 flex flex-wrap justify-center gap-1">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-sans px-2.5 py-0.5 rounded-full bg-[#F0EBE0] dark:bg-[#2A261F] text-[#6B5A3E] dark:text-[#C4B89A] border border-[#D8CFBB] dark:border-[#3A352B]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Delete Action */}
                {isAdmin && (
                  <div className="mt-4 pt-3 border-t border-[#EBE5D5] dark:border-[#3A352B] w-full flex justify-center gap-6">
                    {!confirmDelete ? (
                      <>
                        <button
                          type="button"
                          onClick={() => entry && onEdit(entry)}
                          className="flex items-center gap-1.5 text-[11px] font-sans text-[#C4B89A] hover:text-[#3A2E1E] dark:hover:text-[#EDE5D0] transition-colors"
                        >
                          <Edit size={12} />
                          edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(true)}
                          className="flex items-center gap-1.5 text-[11px] font-sans text-[#C4B89A] hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={12} />
                          remove
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-sans text-red-500">delete this memory?</span>
                        <button
                          type="button"
                          onClick={handleDelete}
                          disabled={deleting}
                          className="text-[11px] font-sans font-medium text-red-600 hover:text-red-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          {deleting ? <Loader2 size={10} className="animate-spin" /> : null}
                          {deleting ? 'deleting...' : 'yes'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(false)}
                          disabled={deleting}
                          className="text-[11px] font-sans text-[#9C8A6E] hover:text-[#3A2E1E] dark:hover:text-[#EDE5D0] transition-colors disabled:opacity-50"
                        >
                          no
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Spacing padding at the very bottom */}
              <div className="h-4" aria-hidden="true" />
            </DialogPanel>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
