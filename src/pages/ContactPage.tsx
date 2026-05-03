import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Loader2, CheckCircle2, Camera, Briefcase, type LucideIcon } from 'lucide-react';
import { siteConfig } from '../data/config';
import { Button } from '../components/ui/Button';
import { FormField } from '../components/ui/FormField';
import type { ContactFormData } from '../types';

// Social Icon Map
const IconMap: Record<string, LucideIcon> = {
  Instagram: Camera,
  Linkedin: Briefcase,
};

// Zod Validation Schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(15, 'Message must be at least 15 characters'),
});

/**
 * ContactPage component with a validated form, social links, and submission handling.
 */
export const ContactPage: React.FC = () => {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  React.useEffect(() => {
    document.title = `Contact · ${siteConfig.ownerName}`;
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitError(null);
    try {
      const formId = import.meta.env.VITE_FORMSPREE_ID;
      if (!formId) {
        throw new Error('Formspree ID not configured');
      }

      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Something went wrong. Please try again later.');
      }

      console.log('Form Submitted Successfully:', data);
      setIsSubmitSuccess(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred.');
    }
  };

  const handleReset = () => {
    reset();
    setIsSubmitSuccess(false);
  };

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-2xl mx-auto flex flex-col w-full">
      <header className="flex flex-col">
        <h1 className="font-serif text-4xl md:text-5xl text-forest-900 dark:text-linen-50 leading-tight">
          Say hello
        </h1>
        <p className="text-stone-600 dark:text-stone-300 mt-4 leading-relaxed text-base md:text-lg">
          Based in the hills of Dehradun. Always happy to connect — whether it's about mountains or a potential collaboration.
        </p>

        <div className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400 mt-3 font-medium">
          <MapPin size={16} className="text-forest-500" />
          <span>Dehradun, Uttarakhand • Usually responds within 48 hours</span>
        </div>

        {/* Social Links Row */}
        <div className="mt-8 flex gap-6">
          {siteConfig.socials.map((link) => {
            const Icon = IconMap[link.icon];
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit my ${link.label}`}
                className="flex items-center gap-2 text-forest-700 dark:text-forest-300 hover:text-forest-500 dark:hover:text-forest-400 transition-colors group focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:outline-none rounded-lg p-1"
              >
                {Icon && <Icon size={20} className="group-hover:scale-110 transition-transform" />}
                <span className="text-sm font-medium">{link.label}</span>
              </a>
            );
          })}
        </div>
      </header>

      <div
        className="mt-6 mb-12 border-t border-forest-200 dark:border-forest-800/50 w-full"
        aria-hidden="true"
      />

      <AnimatePresence mode="wait">
        {!isSubmitSuccess ? (
          <motion.form
            key="contact-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            aria-label="Contact form"
            className="flex flex-col gap-6"
          >
            <FormField
              label="Full Name"
              id="name"
              placeholder="John Doe"
              error={errors.name?.message}
              {...register('name')}
            />

            <FormField
              label="Email Address"
              id="email"
              type="email"
              placeholder="john@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <FormField
              as="textarea"
              label="Message"
              id="message"
              rows={5}
              placeholder="Tell me about your project or just say hi..."
              error={errors.message?.message}
              className="resize-none"
              {...register('message')}
            />

            {submitError && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                {submitError}
              </div>
            )}

            <div className="mt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="w-full md:w-auto min-w-[160px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </Button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="success-card"
            role="status"
            aria-live="polite"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="flex flex-col items-center text-center py-12 px-8 bg-forest-50 dark:bg-forest-900/30 rounded-3xl border border-forest-100 dark:border-forest-800"
          >
            <div className="w-16 h-16 bg-forest-100 dark:bg-forest-800 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={32} className="text-forest-600 dark:text-forest-400" />
            </div>
            <h2 className="font-serif text-2xl text-forest-900 dark:text-linen-50">
              Message sent!
            </h2>
            <p className="mt-3 text-stone-600 dark:text-stone-400 max-w-sm leading-relaxed">
              Thanks for reaching out. I've received your message and will get back to you soon.
            </p>
            <Button
              variant="outline"
              size="md"
              onClick={handleReset}
              className="mt-8 rounded-full border-forest-300 dark:border-forest-700"
            >
              Send another message
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
