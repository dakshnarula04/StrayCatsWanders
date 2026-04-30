import * as React from 'react';
import { cn } from '../../utils/cn';

/**
 * Reusable form field component supporting input and textarea with error states.
 * Designed to work seamlessly with react-hook-form.
 */
export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  id: string;
  error?: string;
  as?: 'input' | 'textarea';
  rows?: number;
}

export const FormField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  ({ label, id, error, as = 'input', className, ...props }, ref) => {
    const Component = as;
    
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label
          htmlFor={id}
          className="text-sm font-medium text-forest-800 dark:text-linen-100"
        >
          {label}
        </label>
        <Component
          id={id}
          ref={ref as any}
          className={cn(
            'w-full rounded-lg px-4 py-2.5 bg-white dark:bg-forest-950/50 border border-forest-300 dark:border-forest-700 text-forest-900 dark:text-linen-50 transition-all focus:ring-2 focus:ring-forest-400/50 focus:border-forest-400 outline-none placeholder:text-stone-400',
            error && 'border-red-400 focus:ring-red-400/50 focus:border-red-400',
            className
          )}
          {...(props as any)}
        />
        {error && (
          <p className="text-sm text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
