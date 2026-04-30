import * as React from 'react';
import { cn } from '../../utils/cn';

/**
 * Standard section heading component with title and optional subtitle.
 */
export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  align = 'left',
  className,
}) => {
  return (
    <div className={cn(
      'flex flex-col mb-8',
      align === 'center' ? 'items-center text-center' : 'items-start text-left',
      className
    )}>
      <h2 className="font-serif text-2xl md:text-3xl font-medium text-forest-900 dark:text-linen-50 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-stone-500 dark:text-stone-400 text-base md:text-lg max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};
