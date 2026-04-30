import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { journalEntries } from '../data/journal';
import { siteConfig } from '../data/config';
import { Polaroid } from '../components/Polaroid';
import { JournalLightbox } from '../components/JournalLightbox';
import { AddMemoryModal } from '../components/AddMemoryModal';
import type { JournalEntry } from '../types';

/**
 * JournalPage component featuring a scattered polaroid gallery on a cork board background.
 */
const JournalPage: React.FC = () => {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [activeTag, setActiveTag] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    document.title = `Journal · ${siteConfig.ownerName}`;
  }, []);

  // Show toast
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  // Derived data
  const allTags = ['all', ...Array.from(new Set(journalEntries.flatMap(e => e.tags)))];
  
  // Tag count for the current filter
  const matchingCount = activeTag === 'all' 
    ? journalEntries.length 
    : journalEntries.filter(e => e.tags.includes(activeTag)).length;

  return (
    <div className="min-h-screen bg-[#F2EDE0] dark:bg-[#2A2318] pt-32 pb-24 relative overflow-x-hidden transition-colors duration-500">
      {/* Cork Board Texture Layer */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25 dark:opacity-10" 
        style={{ 
          backgroundImage: 'radial-gradient(circle, #C4B89A 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} 
        aria-hidden="true" 
      />

      {/* Page Header */}
      <motion.header 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 text-center px-6"
      >
        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-['Caveat'] text-5xl md:text-6xl lg:text-7xl text-[#3A2E1E] dark:text-[#EDE5D0] leading-none"
        >
          Field Notes
        </motion.h1>
        
        <div className="flex justify-center mt-4 mb-2" aria-hidden="true">
          <svg width="120" height="12" viewBox="0 0 120 12">
            <path 
              d="M0 6 Q15 0 30 6 Q45 12 60 6 Q75 0 90 6 Q105 12 120 6"
              fill="none" 
              stroke="currentColor" 
              className="text-[#C4B89A] dark:text-[#5C4E36]"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        <p className="font-sans text-sm md:text-base text-[#9C8A6E] dark:text-[#8C7A5E] tracking-[0.05em] uppercase font-medium">
          moments collected along the way
        </p>

        {/* Filter Row */}
        <nav className="mt-10 flex flex-col items-center gap-4 max-w-2xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`
                  relative px-5 py-1.5 rounded-full text-xs md:text-sm font-sans tracking-wide transition-all duration-300
                  ${activeTag === tag 
                    ? 'text-[#F2EDE0] dark:text-[#2A2318]' 
                    : 'text-[#6B5A3E] dark:text-[#C4B89A] border border-[#C4B89A] dark:border-[#5C4E36] hover:bg-[#EBE5D5] dark:hover:bg-[#3A352B]'
                  }
                `}
              >
                {activeTag === tag && (
                  <motion.div
                    layoutId="filter-pill"
                    className="absolute inset-0 bg-[#3A2E1E] dark:bg-[#C4B89A] rounded-full -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="capitalize">{tag}</span>
              </button>
            ))}
          </div>
          
          <p className="font-['Caveat'] text-lg text-[#9C8A6E] dark:text-[#8C7A5E]">
            {matchingCount} memories
          </p>
        </nav>
      </motion.header>

      {/* Polaroid Grid */}
      <section className="max-w-[1100px] mx-auto px-6 md:px-12 py-12 relative z-10">
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-10 md:gap-y-12 items-start justify-items-center"
        >
          {journalEntries.map((entry, index) => (
            <Polaroid
              key={entry.id}
              entry={entry}
              index={index}
              isDimmed={activeTag !== 'all' && !entry.tags.includes(activeTag)}
              onClick={() => setSelectedEntry(entry)}
            />
          ))}
        </motion.div>
      </section>

      {/* FAB */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 1 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-7 right-7 md:bottom-8 md:right-8 z-40 bg-[#3A2E1E] dark:bg-[#C4B89A] text-[#F5F0E8] dark:text-[#2A2318] rounded-full px-5 py-3 shadow-[2px_4px_16px_rgba(0,0,0,0.3)] hover:bg-[#4A3C28] dark:hover:bg-[#D5C9A9] transition-all hover:-translate-y-0.5 flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3A2E1E] dark:focus:ring-[#C4B89A]"
      >
        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
        <span className="hidden md:inline font-sans text-[13px] font-medium tracking-wide">add memory</span>
      </motion.button>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[110] bg-[#3A2E1E] text-[#F5F0E8] px-6 py-2 rounded-full shadow-xl font-['Caveat'] text-lg pointer-events-none"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <JournalLightbox 
        entry={selectedEntry} 
        onClose={() => setSelectedEntry(null)} 
      />

      <AddMemoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={() => {
          setIsModalOpen(false);
          showToast('memory pinned!');
          // In a real app, we would add to state or database here
        }}
      />
    </div>
  );
};

export default JournalPage;
