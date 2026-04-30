import React from 'react';
import { TimelineItem } from './TimelineItem';
import type { TimelineItem as TimelineItemType } from '../types';

interface TimelineProps {
  items: TimelineItemType[];
}

/**
 * Vertical timeline component displaying a sequence of journey milestones.
 */
export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <div className="relative">
      {/* Continuous Vertical Line with Gradient Fade */}
      <div 
        className="absolute left-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-forest-400 via-forest-300 dark:from-forest-500 dark:via-forest-700 to-transparent opacity-50" 
        aria-hidden="true" 
      />

      {/* Timeline Items */}
      <div className="flex flex-col">
        {items.map((item, index) => (
          <TimelineItem 
            key={item.id} 
            item={item} 
            index={index} 
          />
        ))}
      </div>
    </div>
  );
};
