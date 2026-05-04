import React from 'react';
import { MapPin, Calendar, Trash2, Pencil } from 'lucide-react';
import { Tag } from './ui/Tag';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { cn } from '../utils/cn';
import type { TripData } from '../types';
import { useReducedMotion } from 'framer-motion';

interface TravelCardProps {
  trip: TripData;
  index: number;
  onDelete?: () => void;
  onEdit?: () => void;
}

/**
 * Individual travel card with image, tags, and trip details.
 */
export const TravelCard: React.FC<TravelCardProps> = ({ trip, index, onDelete, onEdit }) => {
  const { ref, isVisible } = useScrollReveal(0.15);
  const shouldReduceMotion = useReducedMotion();

  return (
    <article
      ref={ref}
      style={{ 
        transitionDelay: shouldReduceMotion ? '0s' : `${index * 0.08}s`,
        transform: isVisible ? 'translateY(0)' : (shouldReduceMotion ? 'translateY(0)' : 'translateY(16px)'),
        opacity: isVisible ? 1 : (shouldReduceMotion ? 1 : 0)
      }}
      className={cn(
        "group rounded-2xl bg-white dark:bg-forest-900 shadow-sm border border-forest-200/60 dark:border-forest-700/40 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-md relative"
      )}
    >
      {/* Featured Badge (Overlapping) */}
      {trip.featured && (
        <div className="absolute -top-3 -left-3 z-30 pointer-events-none drop-shadow-lg scale-110">
          <div className="bg-white p-1 rounded-full border-2 border-forest-100 dark:border-forest-800">
            <img 
              src="https://res.cloudinary.com/df9fnyyzz/image/upload/q_auto,f_auto,w_80,c_limit/v1777893799/download_3_lexro6.jpg"
              alt="Featured"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Image Container */}
      <div className="aspect-[4/3] overflow-hidden relative rounded-t-2xl">
        <img
          src={trip.imageUrl}
          alt={trip.imageAlt}
          loading="lazy"
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Subtle Bottom Gradient */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-forest-950/30 to-transparent" 
          aria-hidden="true" 
        />

        {/* Admin Controls */}
        {(onDelete || onEdit) && (
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-2 bg-white/90 dark:bg-forest-900/90 text-forest-600 dark:text-linen-100 rounded-full shadow-lg backdrop-blur-sm hover:bg-forest-50 dark:hover:bg-forest-800 transition-all active:scale-90"
                title="Edit journey"
              >
                <Pencil size={14} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-2 bg-white/90 dark:bg-forest-900/90 text-red-500 rounded-full shadow-lg backdrop-blur-sm hover:bg-red-50 dark:hover:bg-red-900/30 transition-all active:scale-90"
                title="Remove journey"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col h-full">
        <div className="flex gap-2 flex-wrap">
          {trip.tags.slice(0, 2).map((tag) => (
            <Tag key={tag} label={tag} color="forest" />
          ))}
        </div>

        <h3 className="font-serif text-lg md:text-xl mt-3 text-forest-900 dark:text-linen-100 group-hover:text-forest-700 dark:group-hover:text-forest-400 transition-colors">
          {trip.title}
        </h3>

        <div className="mt-2 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-stone-500 dark:text-stone-400">
            <MapPin size={14} className="text-forest-500" />
            <span>{trip.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-stone-500 dark:text-stone-400">
            <Calendar size={14} className="text-forest-500" />
            <span>{trip.date}</span>
          </div>
        </div>

        <p className="mt-3 text-sm text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
          {trip.excerpt}
        </p>
      </div>
    </article>
  );
};
