import React from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, Share2, Copy, Check, MessageCircle } from 'lucide-react';
import { Tag } from './ui/Tag';
import type { TripData } from '../types';

interface TripDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripData | null;
}

export const TripDetailModal: React.FC<TripDetailModalProps> = ({ isOpen, onClose, trip }) => {
  const [showShareOptions, setShowShareOptions] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const shareMenuRef = React.useRef<HTMLDivElement>(null);

  // Reset share options when trip changes or modal closes/opens
  React.useEffect(() => {
    setShowShareOptions(false);
  }, [trip?.id, isOpen]);

  // Handle click outside share menu
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareOptions(false);
      }
    };

    if (showShareOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareOptions]);

  if (!trip) return null;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/trip/${trip.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `Check out this journey: ${trip.title} at ${trip.location} via Stray Cat Wanders`;
  const shareUrl = `${window.location.origin}/trip/${trip.id}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog static open={isOpen} onClose={onClose} className="relative z-[100]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/80 backdrop-blur-md"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4 md:p-8">
            <DialogPanel
              as={motion.div}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-stone-900 w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col md:flex-row items-stretch relative overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-all hover:rotate-90 active:scale-90"
              >
                <X size={18} />
              </button>

              {/* Left Side: Image & Meta */}
              <div className="w-full md:flex-[3] relative bg-[#0A0A0A] flex flex-col min-h-[400px]">
                {/* Image Area */}
                <div className="flex-grow relative flex items-center justify-center overflow-hidden">
                  <img
                    src={trip.imageUrl}
                    alt={trip.imageAlt}
                    className="w-full h-full object-contain"
                  />
                  {trip.featured && (
                    <div className="absolute top-6 left-6 drop-shadow-2xl z-10">
                      <div className="bg-white p-1 rounded-full border-2 border-forest-100 shadow-xl scale-110">
                        <img
                          src="https://res.cloudinary.com/df9fnyyzz/image/upload/q_auto,f_auto,w_80,c_limit/v1777893799/download_3_lexro6.jpg"
                          alt="Featured"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Left Bottom Meta */}
                <div className="p-6 bg-[#111111] border-t border-white/5 flex items-center justify-between shrink-0 relative">
                  <div className="relative">
                    <button
                      onClick={() => setShowShareOptions(!showShareOptions)}
                      className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-xs font-sans font-bold tracking-widest uppercase group"
                    >
                      <Share2 size={16} className="text-forest-500 group-hover:scale-110 transition-transform" />
                      Share Journey
                    </button>

                    {showShareOptions && (
                      <div 
                        ref={shareMenuRef}
                        className="absolute bottom-full left-0 mb-3 w-48 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[60] p-1.5"
                      >
                        <button
                          onClick={handleCopyLink}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-stone-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                          {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-stone-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <MessageCircle size={14} className="text-[#25D366]" />
                          WhatsApp
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-stone-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#1DA1F2] fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                          Twitter / X
                        </a>
                        <a
                          href="https://instagram.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium text-stone-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-[#E4405F] fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                          Instagram
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] text-stone-500 uppercase tracking-[0.3em] font-sans font-medium">
                    © Stray Cat Wanders
                  </div>
                </div>
              </div>

              {/* Right Side: Details */}
              <div className="w-full md:flex-[2] p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col bg-white dark:bg-stone-900">
                <div className="flex gap-2 mb-6">
                  {trip.tags.map(tag => (
                    <Tag key={tag} label={tag} color="forest" />
                  ))}
                </div>

                <h2 className="font-serif text-3xl md:text-5xl text-forest-900 dark:text-linen-100 leading-tight mb-8">
                  {trip.title}
                </h2>

                <div className="space-y-6 mb-10 pb-8 border-b border-forest-100 dark:border-forest-800">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-forest-500 font-sans font-bold">Location</span>
                    <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                      <MapPin size={16} className="text-forest-500" />
                      <span className="font-medium">{trip.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-forest-500 font-sans font-bold">Date of Journey</span>
                    <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                      <Calendar size={16} className="text-forest-500" />
                      <span className="font-medium">{trip.date}</span>
                    </div>
                  </div>
                </div>

                <div className="prose prose-stone dark:prose-invert max-w-none">
                  <div className="text-xl text-stone-600 dark:text-stone-300 leading-relaxed font-serif italic border-l-4 border-forest-200 pl-4 py-1 mb-8">
                    {trip.excerpt}
                  </div>

                  <div className="text-stone-700 dark:text-stone-300 space-y-6 leading-relaxed">
                    <p>
                      The journey through {trip.location} was a true escape into the wild.
                      Taken in {trip.date}, each frame captures a moment where time seemed to slow down,
                      leaving only the sound of the wind and the grandeur of the horizon.
                    </p>
                    <p>
                      Every path explored revealed a new layer of beauty, from the raw textures of the earth
                      to the shifting light across the peaks. This is more than just a destination; it's a memory preserved.
                    </p>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-forest-50 dark:border-forest-900">
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest leading-relaxed">
                    Captured on {trip.date} · Part of the Stray Cat Wanders exploration series.
                  </p>
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
