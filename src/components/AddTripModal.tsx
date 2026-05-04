import React, { useState, useRef } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Plus, Loader2 } from 'lucide-react';
import { tripApi } from '../services/tripApi';
import { useAuth } from '../context/AuthContext';
import type { TripData } from '../types';

interface AddTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (trip: TripData) => void;
  trip?: TripData | null; // Added for editing
}

const AVAILABLE_TAGS = ['hiking', 'mountains', 'forest', 'lakes', 'winter', 'solo', 'river', 'temple'];

export const AddTripModal: React.FC<AddTripModalProps> = ({ isOpen, onClose, onSuccess, trip }) => {
  const { accessToken } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Initialize with trip data if editing
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [localCustomTags, setLocalCustomTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [featured, setFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with trip prop when it changes
  React.useEffect(() => {
    if (trip) {
      setTitle(trip.title);
      setLocation(trip.location);
      setDate(trip.date);
      setExcerpt(trip.excerpt);
      setSelectedTags(trip.tags);
      setFeatured(trip.featured);
      setPreview(trip.imageUrl);

      // Identify custom tags
      const custom = trip.tags.filter(t => !AVAILABLE_TAGS.includes(t));
      setLocalCustomTags(prev => Array.from(new Set([...prev, ...custom])));
    } else {
      resetForm();
    }
  }, [trip]);

  const handleFileSelect = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    setFieldError(null);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const tag = newTagInput.trim().toLowerCase();
    if (!tag) return;
    
    if (!AVAILABLE_TAGS.includes(tag) && !localCustomTags.includes(tag)) {
      setLocalCustomTags(prev => [...prev, tag]);
    }
    
    if (!selectedTags.includes(tag)) {
      setSelectedTags(prev => [...prev, tag]);
    }
    
    setNewTagInput('');
  };

  const resetForm = () => {
    setPreview(null);
    setImageFile(null);
    setTitle('');
    setLocation('');
    setDate('');
    setExcerpt('');
    setSelectedTags([]);
    setLocalCustomTags([]);
    setNewTagInput('');
    setFeatured(false);
    setFieldError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken) {
      setFieldError('You must be logged in');
      return;
    }
    if (!title.trim() || !location.trim() || !date.trim() || !excerpt.trim()) {
      setFieldError('All fields except tags are required');
      return;
    }

    setSubmitting(true);
    setFieldError(null);

    try {
      if (trip) {
        // Handle Update
        let result;
        if (imageFile) {
          // If new image, must use FormData
          const fd = new FormData();
          fd.append('image', imageFile);
          fd.append('title', title.trim());
          fd.append('location', location.trim());
          fd.append('date', date.trim());
          fd.append('excerpt', excerpt.trim());
          fd.append('tags', JSON.stringify(selectedTags));
          fd.append('featured', String(featured));
          result = await tripApi.update(trip.id, fd, accessToken);
        } else {
          // Pure text update
          const updateData: Partial<TripData> = {
            title: title.trim(),
            location: location.trim(),
            date: date.trim(),
            excerpt: excerpt.trim(),
            tags: selectedTags,
            featured
          };
          result = await tripApi.update(trip.id, updateData, accessToken);
        }
        onSuccess(result);
      } else {
        // Handle Create
        if (!imageFile) {
          setFieldError('Select a photo first');
          setSubmitting(false);
          return;
        }
        const fd = new FormData();
        fd.append('image', imageFile);
        fd.append('title', title.trim());
        fd.append('location', location.trim());
        fd.append('date', date.trim());
        fd.append('excerpt', excerpt.trim());
        fd.append('tags', JSON.stringify(selectedTags));
        fd.append('featured', String(featured));

        const newTrip = await tripApi.create(fd, accessToken);
        onSuccess(newTrip);
      }
      resetForm();
    } catch (e: any) {
      setFieldError(e.message ?? 'Operation failed — try again');
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
        <Dialog static open={isOpen} onClose={handleClose} className="relative z-[100]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
            <DialogPanel
              as={motion.div}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FFFDF7] dark:bg-[#1E1A12] w-full max-w-[480px] max-h-[95vh] overflow-y-auto custom-scrollbar rounded-sm shadow-2xl focus:outline-none"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <DialogTitle className="font-serif text-2xl text-forest-900 dark:text-linen-50">
                    {trip ? 'edit journey' : 'add a journey'}
                  </DialogTitle>
                  <button onClick={handleClose} disabled={submitting} className="text-forest-400 hover:text-forest-900 transition-colors">
                    <X size={20} />
                  </button>
                </div>

                {fieldError && (
                  <div className="mb-4 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded text-xs text-red-600 font-sans">
                    {fieldError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-forest-500 mb-2 font-sans font-bold">
                      journey photo
                    </label>
                    <div
                      onClick={() => !submitting && fileInputRef.current?.click()}
                      className={`h-48 w-full rounded border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group relative ${preview ? 'border-none' : 'border-forest-200 bg-forest-50/30'}`}
                    >
                      {preview ? (
                        <>
                          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera size={24} className="text-white" />
                            <span className="ml-2 text-xs text-white font-sans font-bold">change photo</span>
                          </div>
                        </>
                      ) : (
                        <Camera size={32} className="text-forest-300" />
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }} accept="image/*" className="hidden" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-forest-500 mb-1 font-sans font-bold">title</label>
                      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Journey Title" className="w-full bg-transparent border-b border-forest-200 py-1 font-sans text-sm focus:outline-none focus:border-forest-900 dark:text-linen-100" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-forest-500 mb-1 font-sans font-bold">date</label>
                      <input type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="e.g. June 2024" className="w-full bg-transparent border-b border-forest-200 py-1 font-sans text-sm focus:outline-none focus:border-forest-900 dark:text-linen-100" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-forest-500 mb-1 font-sans font-bold">location</label>
                    <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Where was this?" className="w-full bg-transparent border-b border-forest-200 py-1 font-sans text-sm focus:outline-none focus:border-forest-900 dark:text-linen-100" />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-forest-500 mb-1 font-sans font-bold">excerpt</label>
                    <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="A brief description of the journey..." rows={2} className="w-full bg-transparent border-b border-forest-200 py-1 font-sans text-sm focus:outline-none focus:border-forest-900 dark:text-linen-100 resize-none" />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-forest-500 mb-2 font-sans font-bold">tags</label>
                    <div className="flex flex-wrap gap-2">
                      {[...AVAILABLE_TAGS, ...localCustomTags].map(tag => (
                        <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`px-3 py-1 rounded-full text-[10px] font-sans transition-all ${selectedTags.includes(tag) ? 'bg-forest-900 text-white' : 'bg-forest-100 text-forest-600 hover:bg-forest-200'}`}>
                          {tag}
                        </button>
                      ))}
                      
                      {/* Add Custom Tag Input */}
                      <div className="flex items-center ml-1">
                        <input
                          type="text"
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomTag();
                            }
                          }}
                          placeholder="new tag..."
                          className="w-20 bg-transparent border-b border-forest-200 py-0.5 font-sans text-[10px] text-forest-900 dark:text-linen-100 placeholder:text-forest-300 focus:outline-none focus:border-forest-900 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddCustomTag()}
                          className="ml-1 p-1 text-forest-400 hover:text-forest-900 transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="rounded border-forest-300 text-forest-600 focus:ring-forest-500" />
                    <label htmlFor="featured" className="text-xs text-forest-600 font-sans cursor-pointer">Featured on top</label>
                  </div>

                  <div className="pt-6 flex justify-end gap-4">
                    <button type="button" onClick={handleClose} disabled={submitting} className="text-sm font-sans text-forest-400 hover:text-forest-900">Cancel</button>
                    <button type="submit" disabled={submitting} className="bg-forest-900 text-white px-8 py-2 rounded font-sans text-sm hover:bg-forest-800 transition-all flex items-center gap-2">
                      {submitting ? <Loader2 size={16} className="animate-spin" /> : (trip ? 'Save Changes' : 'Add Journey')}
                    </button>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
