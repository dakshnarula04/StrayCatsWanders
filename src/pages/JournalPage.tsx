import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, AlertCircle, RefreshCw, LogOut } from 'lucide-react';
import { siteConfig } from '../data/config';
import { journalApi } from '../services/journalApi';
import { Polaroid } from '../components/Polaroid';
import { JournalLightbox } from '../components/JournalLightbox';
import { AddMemoryModal } from '../components/AddMemoryModal';
import { useAuth } from '../context/AuthContext';
import type { JournalEntry } from '../types';

/**
 * JournalPage component featuring a scattered polaroid gallery on a cork board background.
 * Fetches entries from the Express backend API.
 */
const JournalPage: React.FC = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [activeTag, setActiveTag] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
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

  // Fetch entries from API
  const fetchEntries = useCallback(async (tag?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await journalApi.getAll({ tag: tag === 'all' ? undefined : tag, limit: 50 });
      setEntries(data.entries);
      setTotal(data.total);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load memories');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load — fetch entries + tags in parallel
  useEffect(() => {
    Promise.all([
      fetchEntries(),
      journalApi.getTags().then(setAvailableTags).catch(() => {}),
    ]);
  }, [fetchEntries]);

  // Refetch when tag filter changes
  useEffect(() => {
    fetchEntries(activeTag);
  }, [activeTag, fetchEntries]);

  // Tag list for filter row
  const allTags = ['all', ...availableTags];

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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 text-center px-6"
      >
        <motion.h1
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
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
            {total} {total === 1 ? 'memory' : 'memories'}
          </p>
        </nav>
      </motion.header>

      {/* Polaroid Grid */}
      <section className="max-w-[1100px] mx-auto px-6 md:px-12 py-12 relative z-10">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-10 md:gap-y-12 items-start justify-items-center">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse w-full"
                style={{
                  backgroundColor: '#EBE5D5',
                  padding: '10px 10px 48px 10px',
                  boxShadow: '2px 3px 14px rgba(0,0,0,0.1)',
                  transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (1 + i * 0.5)}deg)`,
                }}
              >
                <div className="w-full aspect-square bg-[#DDD7C8] rounded-sm" />
                <div className="mt-3 mx-auto w-3/4 h-3 bg-[#DDD7C8] rounded" />
                <div className="mt-2 mx-auto w-1/2 h-2 bg-[#DDD7C8] rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <AlertCircle size={48} className="text-[#C4B89A] mb-4" />
            <p className="font-['Caveat'] text-2xl text-[#9C8A6E] mb-6">
              couldn't load memories — {error}
            </p>
            <button
              onClick={() => fetchEntries(activeTag)}
              className="flex items-center gap-2 px-5 py-2 bg-[#3A2E1E] text-[#F5F0E8] rounded-full font-sans text-sm hover:bg-[#4A3C28] transition-colors"
            >
              <RefreshCw size={14} />
              try again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && entries.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="text-[#C4B89A] mb-6" aria-hidden="true">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <p className="font-['Caveat'] text-2xl text-[#9C8A6E]">
              {activeTag === 'all' ? 'no memories yet — pin your first one!' : `no moments tagged '${activeTag}' yet`}
            </p>
          </motion.div>
        )}

        {/* Loaded Grid */}
        {!loading && !error && entries.length > 0 && (
          <div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-10 md:gap-y-12 items-start justify-items-center"
          >
            {entries.map((entry, index) => (
              <Polaroid
                key={entry.id}
                entry={entry}
                index={index}
                onClick={() => setSelectedEntry(entry)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Admin Toolbar */}
      {isAdmin && (
        <motion.div
          initial={{ x: 40 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.5 }}
          className="fixed top-24 right-0 z-40 bg-[#3A2E1E] dark:bg-[#C4B89A] rounded-l-lg flex flex-col shadow-[-2px_4px_16px_rgba(0,0,0,0.3)] overflow-hidden"
        >
          <button
            onClick={() => setIsModalOpen(true)}
            title="add memory"
            className="p-[10px_12px] text-[#F5F0E8] dark:text-[#2A2318] hover:bg-white/10 dark:hover:bg-black/10 transition-colors focus:outline-none"
          >
            <Plus size={18} />
          </button>
          <div className="h-[1px] w-full bg-white/10 dark:bg-black/10" />
          <button
            onClick={async () => {
              await logout();
              navigate('/admin/login');
            }}
            title="sign out"
            className="p-[10px_12px] text-[#F5F0E8] dark:text-[#2A2318] hover:bg-white/10 dark:hover:bg-black/10 transition-colors focus:outline-none"
          >
            <LogOut size={18} />
          </button>
        </motion.div>
      )}

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
        onDelete={(id) => {
          setEntries(prev => prev.filter(e => e.id !== id));
          setTotal(prev => prev - 1);
          setSelectedEntry(null);
          showToast('memory removed');
        }}
      />

      <AddMemoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={(entry) => {
          setEntries(prev => [entry, ...prev]);
          setTotal(prev => prev + 1);
          setIsModalOpen(false);
          showToast('memory pinned!');
          // Refresh tags list in case a new tag was used
          journalApi.getTags().then(setAvailableTags).catch(() => {});
        }}
      />
    </div>
  );
};

export default JournalPage;
