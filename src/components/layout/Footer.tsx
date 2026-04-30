import React from 'react';
import { Heart, ArrowUp, Code, Camera, Briefcase, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { siteConfig } from '../../data/config';

// Map icon strings to available Lucide components
const IconMap: Record<string, LucideIcon> = {
  Github: Code,
  Instagram: Camera,
  Linkedin: Briefcase,
};

/**
 * Global Footer component with branding, social links, and copyright info.
 */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [showScroll, setShowScroll] = React.useState(false);

  React.useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    };

    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScroll]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-forest-900 dark:bg-forest-950 text-linen-100 py-16 px-6 md:px-12 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-3 gap-12 items-center">
        {/* Left: Branding */}
        <div className="flex flex-col gap-1 text-center md:text-left">
          <span className="font-serif text-lg md:text-2xl font-medium tracking-tight">
            {siteConfig.ownerName}
          </span>
          <p className="text-xs md:text-sm text-linen-100/60 font-light max-w-xs mx-auto md:mx-0 leading-relaxed">
            {siteConfig.tagline}
          </p>
        </div>

        {/* Center: Social Icons */}
        <div className="flex justify-center gap-10">
          {siteConfig.socials.map((link) => {
            const Icon = IconMap[link.icon];
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-linen-100/80 hover:text-forest-300 transition-all duration-300 transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:outline-none rounded-lg p-1.5"
              >
                {Icon ? <Icon size={24} strokeWidth={1.5} /> : <span className="text-sm">{link.label}</span>}
              </a>
            );
          })}
        </div>

        {/* Right: Copyright */}
        <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
          <p className="text-sm text-linen-100/70 font-light tracking-wide">
            © {currentYear} • {siteConfig.ownerName}
          </p>
          <div className="text-[10px] uppercase tracking-[0.2em] text-linen-100/40 flex items-center gap-2">
            Made with <Heart size={10} className="fill-forest-400 text-forest-400 animate-pulse" /> in the hills
          </div>
          
          <Link
            to="/admin/login"
            style={{ fontSize: '10px', color: '#9C8A6E', opacity: 0 }}
            className="hover:opacity-100 transition-opacity duration-300 mt-2"
            aria-label="Admin login"
          >
            admin
          </Link>
        </div>
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showScroll && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollTop}
            aria-label="Back to top"
            className="fixed bottom-8 right-8 p-3 rounded-full bg-forest-600 text-white shadow-xl hover:bg-forest-500 transition-colors z-[60] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-forest-400 focus-visible:outline-none"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};
