'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutSection() {
  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
      className="section-spacing border-y border-[#1A1A1A]"
    >
      <div className="section-shell grid items-center gap-12 md:grid-cols-2">
        <div className="relative h-[430px] overflow-hidden border border-[#1A1A1A]">
          <Image
            src="https://images.unsplash.com/photo-1503342452485-86ff0a4c4e36?auto=format&fit=crop&w=900&q=80"
            alt="Youcef portrait"
            fill
            className="object-cover grayscale"
          />
        </div>
        <div>
          <p className="section-label">About</p>
          <h2 className="heading-font text-5xl md:text-6xl">About Youcef</h2>
          <p className="mt-6 leading-relaxed text-[#BFBFBF]">
            Youcef is a gaming content creator and streamer focused on gameplay, honest reviews, and audience interaction.
          </p>
          <p className="mt-4 leading-relaxed text-[#BFBFBF]">
            His content blends fun gameplay, practical setup insights, and community-driven streams.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
