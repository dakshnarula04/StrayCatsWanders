import * as React from 'react';
import { cn } from '../../utils/cn';

/**
 * Reusable Button component with multiple variants and sizes.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-forest-700 text-white hover:bg-forest-800 dark:bg-forest-600 dark:hover:bg-forest-700 shadow-sm',
      outline: 'border border-forest-500 text-forest-700 dark:text-forest-300 hover:bg-forest-50 dark:hover:bg-forest-900/50',
      ghost: 'text-forest-700 dark:text-forest-300 hover:bg-forest-100 dark:hover:bg-forest-800/50',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-8 py-3.5 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest-400 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
