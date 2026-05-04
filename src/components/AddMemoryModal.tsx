import React, { useState, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Loader2 } from 'lucide-react';
import { journalApi } from '../services/journalApi';
import { useAuth } from '../context/AuthContext';
import type { JournalEntry } from '../types';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (entry: JournalEntry) => void;
}

const AVAILABLE_TAGS = ['mountains', 'forest', 'water', 'golden hour', 'snow', 'solo', 'straylife', 'slowtravel', 'rainvibes', 'silentmoments', 'rawmoments', 'dawn'];

export const AddMemoryModal: React.FC<AddMemoryModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { accessToken } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [dateLabel, setDateLabel] = useState(
    new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  );
  const [story, setStory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    setFieldError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const resetForm = () => {
    setPreview(null);
    setImageFile(null);
    setCaption('');
    setLocation('');
    setDateLabel(new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
    setStory('');
    setSelectedTags([]);
    setFieldError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      setFieldError('Select a photo first');
      return;
    }
    if (!accessToken) {
      setFieldError('You must be logged in to upload');
      return;
    }
    if (!caption.trim()) {
      setFieldError('Add a caption');
      return;
    }
    if (!location.trim()) {
      setFieldError('Add a location');
      return;
    }

    setSubmitting(true);
    setFieldError(null);

    try {
      const fd = new FormData();
      fd.append('image',      imageFile);
      fd.append('caption',    caption.trim());
      fd.append('location',   location.trim());
      fd.append('date_label', dateLabel.trim());
      fd.append('story',      story.trim());
      fd.append('tags',       JSON.stringify(selectedTags));
      fd.append('rotation',   String((Math.random() * 8 - 4).toFixed(2)));

      const newEntry = await journalApi.create(fd, accessToken);
      resetForm();
      onSuccess(newEntry);
    } catch (e: any) {
      setFieldError(e.message ?? 'Upload failed — try again');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      resetForm();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          static
          open={isOpen}
          onClose={handleClose}
          className="relative z-[100]"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
            <Dialog.Panel
              as={motion.div}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FFFDF7] dark:bg-[#1E1A12] w-full max-w-[420px] max-h-[95vh] overflow-y-auto custom-scrollbar rounded-sm shadow-[4px_12px_40px_rgba(0,0,0,0.4)] focus:outline-none"
            >
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="font-['Caveat'] text-2xl text-[#3A2E1E] dark:text-[#EDE5D0]">
                    add a memory
                  </Dialog.Title>
                  <button onClick={handleClose} disabled={submitting} className="text-[#9C8A6E] hover:text-[#3A2E1E] dark:hover:text-[#EDE5D0] transition-colors disabled:opacity-50">
                    <X size={20} />
                  </button>
                </div>

                {/* Error Banner */}
                {fieldError && (
                  <div className="mb-3 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs text-red-600 dark:text-red-400 font-sans">
                    {fieldError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Photo Upload */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#9C8A6E] mb-1.5 font-sans font-medium">
                      the moment
                    </label>
                    <div 
                      onClick={() => !submitting && fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files[0];
                        if (file) handleFileSelect(file);
                      }}
                      className={`
                        h-40 sm:h-44 w-full rounded-sm border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-200
                        ${isDragging ? 'border-[#9C8A6E] bg-[#F0EBE0]' : 'border-[#C4B89A] bg-[#F5F0E8] dark:bg-[#2A261F]'}
                        ${preview ? 'border-none' : ''}
                        ${submitting ? 'pointer-events-none opacity-60' : ''}
                      `}
                    >
                      {preview ? (
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Camera size={32} className="text-[#C4B89A] mb-2" />
                          <span className="text-xs text-[#9C8A6E] font-sans">drop a photo</span>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>

                  {/* Caption */}
                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <label className="text-[10px] uppercase tracking-wider text-[#9C8A6E] font-sans font-medium">
                        caption
                      </label>
                      <span className="text-[10px] text-[#C4B89A] font-sans">{caption.length}/40</span>
                    </div>
                    <input 
                      type="text"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value.slice(0, 40))}
                      placeholder="a short poetic note..."
                      disabled={submitting}
                      className="w-full bg-transparent border-b border-[#C4B89A] py-1.5 font-['Caveat'] text-lg text-[#2C2416] dark:text-[#EDE5D0] placeholder:text-[#C4B89A]/60 focus:outline-none focus:border-[#3A2E1E] dark:focus:border-[#EDE5D0] transition-colors disabled:opacity-50"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#9C8A6E] mb-1 font-sans font-medium">
                      location
                    </label>
                    <input 
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="where were you?"
                      disabled={submitting}
                      className="w-full bg-transparent border-b border-[#C4B89A] py-1 font-sans text-sm text-[#2C2416] dark:text-[#EDE5D0] placeholder:text-[#C4B89A]/60 focus:outline-none focus:border-[#3A2E1E] dark:focus:border-[#EDE5D0] transition-colors disabled:opacity-50"
                    />
                  </div>

                  {/* Date Label */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#9C8A6E] mb-1 font-sans font-medium">
                      when
                    </label>
                    <input 
                      type="text"
                      value={dateLabel}
                      onChange={(e) => setDateLabel(e.target.value)}
                      placeholder="e.g. Dec 2023"
                      disabled={submitting}
                      className="w-full bg-transparent border-b border-[#C4B89A] py-1 font-sans text-sm text-[#2C2416] dark:text-[#EDE5D0] placeholder:text-[#C4B89A]/60 focus:outline-none focus:border-[#3A2E1E] dark:focus:border-[#EDE5D0] transition-colors disabled:opacity-50"
                    />
                  </div>

                  {/* Story (optional) */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#9C8A6E] mb-1 font-sans font-medium">
                      story <span className="normal-case opacity-60">(optional)</span>
                    </label>
                    <textarea 
                      value={story}
                      onChange={(e) => setStory(e.target.value)}
                      placeholder="the longer memory behind this moment..."
                      disabled={submitting}
                      rows={2}
                      className="w-full bg-transparent border-b border-[#C4B89A] py-1 font-sans text-sm text-[#2C2416] dark:text-[#EDE5D0] placeholder:text-[#C4B89A]/60 focus:outline-none focus:border-[#3A2E1E] dark:focus:border-[#EDE5D0] transition-colors resize-none disabled:opacity-50"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#9C8A6E] mb-2 font-sans font-medium">
                      tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_TAGS.map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          disabled={submitting}
                          className={`
                            px-3 py-1 rounded-full text-[10px] font-sans transition-all duration-200
                            ${selectedTags.includes(tag) 
                              ? 'bg-[#3A2E1E] dark:bg-[#C4B89A] text-[#F2EDE0] dark:text-[#2A2318]' 
                              : 'bg-[#F0EBE0] dark:bg-[#2A261F] text-[#6B5A3E] dark:text-[#C4B89A] hover:bg-[#EBE5D5] dark:hover:bg-[#3A352B]'}
                            disabled:opacity-50
                          `}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footer Strip */}
                  <div className="pt-6 flex justify-end gap-3 mt-2 -mx-5 px-5">
                    <button 
                      type="button"
                      onClick={handleClose}
                      disabled={submitting}
                      className="px-5 py-2 text-xs font-sans text-[#9C8A6E] hover:text-[#3A2E1E] dark:hover:text-[#EDE5D0] transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={!preview || !caption || submitting}
                      className="bg-[#3A2E1E] dark:bg-[#C4B89A] text-[#F5F0E8] dark:text-[#2A2318] px-6 py-2 rounded-[4px] font-['Caveat'] text-lg hover:bg-[#4A3C28] dark:hover:bg-[#D5C9A9] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          pinning...
                        </>
                      ) : (
                        'pin it'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
