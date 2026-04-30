import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { JournalEntry } from '../types';

interface PolaroidProps {
  entry: JournalEntry;
  onClick: () => void;
  index?: number;
}

/**
 * A physical-style Polaroid component with handwriting and decorative attachments.
 */
export const Polaroid: React.FC<PolaroidProps & { isDimmed?: boolean }> = ({ entry, onClick, index = 0, isDimmed = false }) => {
  const shouldReduceMotion = useReducedMotion();
  
  // Simple hash for pseudo-random decorative decisions
  const idHash = entry.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const isTape = idHash % 2 === 0;
  const tapeRotation = (idHash % 7) - 3; // -3 to 3 deg
  const pinColors = ['#C0392B', '#2980B9', '#8E44AD', '#27AE60'];
  const pinColor = pinColors[idHash % pinColors.length];

  // Responsive rotation: 50% on mobile (roughly detected via CSS or JS, but let's use a CSS variable or class)
  // We'll use a CSS variable for the rotation to make it easier to scale in media queries if needed,
  // but for now we'll just use a small calculation.
  
  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, rotate: (entry.rotation - 2) }}
      animate={{ 
        opacity: isDimmed ? 0.2 : 1, 
        y: 0, 
        rotate: entry.rotation,
        scale: 1
      }}
      transition={{ 
        duration: 0.5, 
        ease: 'easeOut', 
        delay: index * 0.07 
      }}
      whileHover={shouldReduceMotion || isDimmed ? {} : { 
        rotate: entry.rotation * 0.3, 
        y: -6, 
        scale: 1.04,
        zIndex: 20,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
      onClick={!isDimmed ? onClick : undefined}
      className={`inline-block relative cursor-pointer will-change-transform group transition-opacity duration-500 ${isDimmed ? 'cursor-default pointer-events-none' : ''}`}
      style={{
        backgroundColor: 'var(--polaroid-bg, #FFFDF7)',
        padding: '10px 10px 48px 10px',
        boxShadow: '2px 3px 14px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.12)',
      }}
    >
      {/* CSS Variable for Dark Mode Surface */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root { --polaroid-bg: #FFFDF7; --polaroid-text: #2C2416; --polaroid-meta: #9C8A6E; }
        .dark { --polaroid-bg: #1E1A12; --polaroid-text: #EDE5D0; --polaroid-meta: #8C7A5E; }
        
        .polaroid-wrapper { 
          transform: rotate(var(--rot)); 
        }
        @media (max-width: 768px) {
          .polaroid-wrapper { 
            transform: rotate(calc(var(--rot) * 0.5)); 
          }
        }
      `}} />

      {/* Decorative Attachment */}
      {isTape ? (
        // Type A - Washi Tape
        <div 
          className="absolute top-[-10px] left-1/2 -translate-x-1/2 h-5 w-[52px]"
          style={{
            backgroundColor: 'rgba(240, 218, 160, 0.45)',
            border: '1px solid rgba(200, 175, 110, 0.3)',
            transform: `translateX(-50%) rotate(${tapeRotation}deg)`,
            zIndex: 10
          }}
          aria-hidden="true"
        />
      ) : (
        // Type B - Push Pin
        <div 
          className="absolute top-[-9px] left-1/2 -translate-x-1/2 w-[13px] h-[13px] rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.35)]"
          style={{
            backgroundColor: pinColor,
            zIndex: 10
          }}
          aria-hidden="true"
        />
      )}

      {/* Photo Area */}
      <div 
        className="w-full aspect-square overflow-hidden bg-[#E8E4DA] dark:bg-[#2A261F]"
      >
        <img 
          src={entry.imageUrl} 
          alt={entry.imageAlt} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Caption Area */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-12 px-2 pb-2 pt-1 flex flex-col items-center justify-center text-center"
      >
        <p 
          className="font-['Caveat'] text-[13px] font-normal leading-tight max-h-[2.6em] overflow-hidden line-clamp-2"
          style={{ color: 'var(--polaroid-text)' }}
        >
          {entry.caption}
        </p>
        <p 
          className="text-[10px] font-sans mt-0.5"
          style={{ color: 'var(--polaroid-meta)' }}
        >
          {entry.location} · {entry.date}
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .group:not(.dimmed):hover {
          box-shadow: 4px 10px 30px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.15) !important;
        }
      `}} />
    </motion.div>
  );
};
