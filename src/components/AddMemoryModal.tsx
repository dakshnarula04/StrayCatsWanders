import React, { useState, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X } from 'lucide-react';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}

const AVAILABLE_TAGS = ['mountains', 'forest', 'water', 'golden hour', 'snow', 'solo'];

export const AddMemoryModal: React.FC<AddMemoryModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      id: Date.now().toString(),
      imageUrl: preview || '',
      caption,
      location,
      tags: selectedTags,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      rotation: (Math.random() * 8) - 4
    };
    console.log('Form Data:', formData);
    onAdd(formData);
    // Reset state
    setPreview(null);
    setCaption('');
    setLocation('');
    setSelectedTags([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          static
          open={isOpen}
          onClose={onClose}
          className="relative z-[100]"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel
              as={motion.div}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FFFDF7] dark:bg-[#1E1A12] w-full max-w-[420px] rounded-sm shadow-[4px_12px_40px_rgba(0,0,0,0.4)] overflow-hidden focus:outline-none"
            >
              <div className="p-5 pb-0">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="font-['Caveat'] text-2xl text-[#3A2E1E] dark:text-[#EDE5D0]">
                    add a memory
                  </Dialog.Title>
                  <button onClick={onClose} className="text-[#9C8A6E] hover:text-[#3A2E1E] dark:hover:text-[#EDE5D0] transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Photo Upload */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#9C8A6E] mb-1.5 font-sans font-medium">
                      the moment
                    </label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setPreview(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className={`
                        aspect-square w-full rounded-sm border-2 border-dashed flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all duration-200
                        ${isDragging ? 'border-[#9C8A6E] bg-[#F0EBE0]' : 'border-[#C4B89A] bg-[#F5F0E8] dark:bg-[#2A261F]'}
                        ${preview ? 'border-none' : ''}
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
                      className="w-full bg-transparent border-b border-[#C4B89A] py-1.5 font-['Caveat'] text-lg text-[#2C2416] dark:text-[#EDE5D0] placeholder:text-[#C4B89A]/60 focus:outline-none focus:border-[#3A2E1E] dark:focus:border-[#EDE5D0] transition-colors"
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
                      className="w-full bg-transparent border-b border-[#C4B89A] py-1 font-sans text-sm text-[#2C2416] dark:text-[#EDE5D0] placeholder:text-[#C4B89A]/60 focus:outline-none focus:border-[#3A2E1E] dark:focus:border-[#EDE5D0] transition-colors"
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
                          className={`
                            px-3 py-1 rounded-full text-[10px] font-sans transition-all duration-200
                            ${selectedTags.includes(tag) 
                              ? 'bg-[#3A2E1E] dark:bg-[#C4B89A] text-[#F2EDE0] dark:text-[#2A2318]' 
                              : 'bg-[#F0EBE0] dark:bg-[#2A261F] text-[#6B5A3E] dark:text-[#C4B89A] hover:bg-[#EBE5D5] dark:hover:bg-[#3A352B]'}
                          `}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Footer Strip */}
                  <div className="pt-8 pb-5 flex justify-end gap-3 border-t border-[#EBE5D5] mt-6 -mx-5 px-5">
                    <button 
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2 text-xs font-sans text-[#9C8A6E] hover:text-[#3A2E1E] dark:hover:text-[#EDE5D0] transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={!preview || !caption}
                      className="bg-[#3A2E1E] dark:bg-[#C4B89A] text-[#F5F0E8] dark:text-[#2A2318] px-6 py-2 rounded-[4px] font-['Caveat'] text-lg hover:bg-[#4A3C28] dark:hover:bg-[#D5C9A9] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      pin it
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
