import React from 'react';
import { MapPin } from 'lucide-react';
import { Tag } from './ui/Tag';
import { useScrollReveal } from '../hooks/useScrollReveal';
import type { TimelineItem as TimelineItemType } from '../types';
import { useReducedMotion } from 'framer-motion';

interface TimelineItemProps {
  item: TimelineItemType;
  index: number;
}

/**
 * Individual item within the journey timeline.
 * Animates into view with a staggered slide-in from the left.
 */
export const TimelineItem: React.FC<TimelineItemProps> = ({ item, index }) => {
  const { ref, isVisible } = useScrollReveal(0.15);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: shouldReduceMotion ? '0s' : `${index * 0.1}s`,
        transform: isVisible ? 'translateX(0)' : (shouldReduceMotion ? 'translateX(0)' : 'translateX(-20px)'),
        opacity: isVisible ? 1 : (shouldReduceMotion ? 1 : 0)
      }}
      className="flex gap-4 md:gap-6 pl-0 md:pl-2 mb-10 transition-all duration-500 ease-out"
    >
      {/* Year Circle Dot */}
      <div className="relative z-10 w-10 h-10 rounded-full flex-shrink-0 bg-forest-50 dark:bg-forest-900 border-2 border-forest-400 dark:border-forest-500 flex items-center justify-center shadow-sm">
        <span className="text-[10px] font-bold text-forest-700 dark:text-forest-300">
          {item.year}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 pt-1.5">
        <h3 className="font-serif text-lg text-forest-900 dark:text-linen-50 leading-none">
          {item.title}
        </h3>
        
        {item.location && (
          <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 mt-1">
            <MapPin size={12} className="text-forest-500" />
            <span>{item.location}</span>
          </div>
        )}

        <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed mt-2">
          {item.description}
        </p>

        {item.tags && item.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mt-3">
            {item.tags.map((tag) => (
              <Tag key={tag} label={tag} color="stone" className="opacity-80" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
