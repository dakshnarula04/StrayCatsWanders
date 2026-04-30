import { motion, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/Button';
import { Link } from 'react-router-dom';

export interface HeroSectionProps {
  headline: string;
  subtext: string;
  imageUrl: string;
  ctaLabel?: string;
  ctaHref?: string;
}

/**
 * High-impact Hero section with background image, gradient overlay, and animations.
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  headline,
  subtext,
  imageUrl,
  ctaLabel,
  ctaHref,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const animationProps = {
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30 },
    animate: shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 },
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-forest-950">
      {/* Background Image Layer */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={imageUrl}
          alt=""
          className="object-cover w-full h-full opacity-60"
          // @ts-ignore - fetchpriority is a new attribute
          fetchpriority="high"
        />
      </div>

      {/* Overlay Layer */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-forest-950/70 dark:from-forest-950/80 via-forest-950/40 to-forest-950/80" 
        aria-hidden="true" 
      />

      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
        aria-hidden="true"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <motion.h1
          {...animationProps}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.45, 0.32, 0.9] }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight"
        >
          {headline}
        </motion.h1>

        <motion.p
          {...animationProps}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.21, 0.45, 0.32, 0.9] }}
          className="mt-6 text-linen-100/80 text-base sm:text-lg md:text-2xl font-light leading-relaxed max-w-2xl mx-auto"
        >
          {subtext}
        </motion.p>

        {ctaLabel && ctaHref && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10"
          >
            <Link to={ctaHref} className="inline-block rounded-full focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:outline-none">
              <Button variant="primary" size="lg" className="rounded-full px-10 border-forest-400">
                {ctaLabel}
              </Button>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={32} strokeWidth={1} />
        </motion.div>
      </motion.div>
    </section>
  );
};
