'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { portfolioItems } from '@/data/siteData';

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="section-spacing border-y border-[#1A1A1A]">
      <div className="section-shell">
        <p className="section-label">Portfolio</p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="heading-font text-5xl md:text-6xl"
        >
          Selected Work
        </motion.h2>

        <div className="grid-masonry mt-10">
          {portfolioItems.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.04 }}
              whileHover={{ scale: 1.01 }}
              className="group relative mb-4 block overflow-hidden border border-[#1A1A1A]"
            >
              <div className="relative h-72 md:h-80">
                <Image src={item.image} alt={item.title} fill className="object-cover grayscale" />
              </div>
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/95 to-transparent p-5 opacity-0 transition duration-500 group-hover:opacity-100">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#BFBFBF]">{item.category}</p>
                  <h3 className="heading-font text-2xl leading-none">{item.title}</h3>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
