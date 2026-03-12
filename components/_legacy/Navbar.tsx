'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '#home', label: 'Home' },
  { href: '#content-style', label: 'Style' },
  { href: '#videos', label: 'Videos' },
  { href: '#journey', label: 'Journey' },
  { href: '#contact', label: 'Contact' }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };

    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className={`fixed top-0 z-50 w-full border-b transition-all duration-500 ${
          scrolled ? 'border-[#1A1A1A] bg-black/90 backdrop-blur-lg' : 'border-transparent bg-black/25'
        }`}
      >
        <div className="section-shell flex h-16 items-center justify-between">
          <a href="#home" className="heading-font text-2xl text-white">
            RAMZI ZRT
          </a>

          <div className="hidden items-center gap-8 text-xs uppercase tracking-[0.22em] text-[#BFBFBF] md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-[#EAEAEA]">
                {item.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden"
            aria-label="Toggle menu"
            type="button"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <motion.div className="h-[2px] bg-white" style={{ width: `${progress}%` }} />
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 z-40 border-b border-[#1A1A1A] bg-black/95 p-6 md:hidden"
          >
            <div className="flex flex-col gap-5 text-xs uppercase tracking-[0.25em] text-[#BFBFBF]">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
