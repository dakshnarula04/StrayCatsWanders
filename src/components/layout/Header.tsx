import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Disclosure } from '@headlessui/react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Sun, Moon, Menu, X, User } from 'lucide-react';
import { siteConfig } from '../../data/config';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Journal', path: '/journal' },
  { name: 'Contact', path: '/contact' },
];

export const Header: React.FC = () => {
  const { pathname } = useLocation();
  const { dark, toggle } = useTheme();
  const { isAdmin, admin } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  return (
    <Disclosure as="nav" aria-label="Main navigation" className="fixed top-0 left-0 w-full z-50">
      {({ open }) => (
        <>
          {/* Decorative Top Accent Bar */}
          <div className="h-0.5 w-full bg-gradient-to-r from-forest-500 via-earth-600 to-forest-500" aria-hidden="true" />
          
          <div className="bg-linen-50/90 dark:bg-forest-950/90 backdrop-blur-sm border-b border-forest-300/40 dark:border-forest-700/40 px-6 md:px-12 py-4">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
              {/* Logo */}
              <Link 
                to="/" 
                className="font-serif text-xl md:text-2xl text-forest-900 dark:text-linen-50 hover:opacity-80 transition-opacity focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:outline-none rounded-lg"
              >
                {siteConfig.ownerName}
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    aria-current={pathname === link.path ? 'page' : undefined}
                    className={cn(
                      "text-sm tracking-wide transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:outline-none rounded-md px-2 py-1",
                      pathname === link.path
                        ? "text-forest-700 dark:text-forest-400 font-medium"
                        : "text-stone-500 hover:text-forest-700 dark:text-stone-400 dark:hover:text-forest-300"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <span 
                    className="hidden md:inline-block"
                    style={{
                      fontSize: '11px',
                      fontFamily: 'DM Sans',
                      color: '#9C8A6E',
                      padding: '2px 8px',
                      border: '1px solid #C4B89A',
                      borderRadius: '20px',
                    }}
                  >
                    {admin?.name}
                  </span>
                )}

                <button
                  onClick={toggle}
                  aria-label="Toggle dark mode"
                  className="p-2 rounded-full hover:bg-forest-100 dark:hover:bg-forest-900 text-forest-700 dark:text-forest-300 transition-colors focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:outline-none"
                >
                  {dark ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <Link
                  to="/admin/login"
                  aria-label="Admin login"
                  className="p-2 rounded-full hover:bg-forest-100 dark:hover:bg-forest-900 text-forest-700 dark:text-forest-300 transition-colors focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:outline-none"
                >
                  <User size={20} />
                </Link>

                {/* Mobile Menu Button */}
                <Disclosure.Button 
                  aria-label={open ? "Close menu" : "Open menu"}
                  className="md:hidden p-2 rounded-lg text-forest-700 dark:text-forest-300 hover:bg-forest-100 dark:hover:bg-forest-900 transition-colors focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:outline-none"
                >
                  {open ? <X size={24} /> : <Menu size={24} />}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {open && (
              <Disclosure.Panel static className="md:hidden">
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden bg-linen-50 dark:bg-forest-950 border-b border-forest-300/40 dark:border-forest-700/40"
                >
                  <div className="flex flex-col py-4 px-6 gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        aria-current={pathname === link.path ? 'page' : undefined}
                        className={cn(
                          "text-lg font-medium transition-colors py-3 px-2 flex items-center min-h-[44px] focus-visible:ring-2 focus-visible:ring-forest-400 focus-visible:outline-none rounded-lg",
                          pathname === link.path
                            ? "text-forest-700 dark:text-forest-400"
                            : "text-stone-500 dark:text-stone-400"
                        )}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </Disclosure.Panel>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  );
};
