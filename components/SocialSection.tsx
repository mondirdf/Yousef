'use client';

import { motion } from 'framer-motion';
import { Instagram, Music2, Youtube } from 'lucide-react';

const links = [
  { name: 'YouTube', icon: Youtube, href: 'https://www.youtube.com/channel/UCKz8ISvm1sH1iNyo2DPzQoA' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/ramzizrt' },
  { name: 'TikTok', icon: Music2, href: 'https://tiktok.com/@ramzizrt' }
];

export default function SocialSection() {
  return (
    <section id="contact" className="section-spacing border-t border-[#1A1A1A]">
      <div className="section-shell text-center">
        <p className="section-label">Contact</p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="heading-font text-5xl md:text-6xl"
        >
          Connect
        </motion.h2>
        <div className="mt-10 flex items-center justify-center gap-6 md:gap-8">
          {links.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ scale: 1.08 }}
                className="rounded-full border border-[#1A1A1A] p-4 text-[#BFBFBF] transition hover:border-white hover:text-white md:p-5"
                aria-label={link.name}
              >
                <Icon size={30} />
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
