import * as React from 'react';
import { cn } from '../../utils/cn';

/**
 * Small pill badge component for tags and categories.
 */
export interface TagProps {
  label: string;
  color?: 'forest' | 'earth' | 'stone';
  className?: string;
}

export const Tag: React.FC<TagProps> = ({ label, color = 'forest', className }) => {
  const colors = {
    forest: 'bg-forest-100 text-forest-800 dark:bg-forest-900/50 dark:text-forest-200 border-forest-200/50 dark:border-forest-800',
    earth: 'bg-earth-100 text-earth-800 dark:bg-earth-900/50 dark:text-earth-200 border-earth-200/50 dark:border-earth-800',
    stone: 'bg-stone-100 text-stone-800 dark:bg-stone-900/50 dark:text-stone-200 border-stone-200/50 dark:border-stone-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        colors[color],
        className
      )}
    >
      {label}
    </span>
  );
};
