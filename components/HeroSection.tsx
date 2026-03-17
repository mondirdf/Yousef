'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=2100&q=80')"
        }}
      />
      <div className="cinematic-overlay absolute inset-0" />

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        className="section-shell relative z-10 text-center"
      >
        <p className="section-label">Youcef RDBK • Creator World</p>
        <h1 className="heading-font text-7xl leading-[0.9] sm:text-8xl md:text-9xl">YOUCEF RDBK</h1>

        <p className="mt-5 text-sm uppercase tracking-[0.3em] text-[#BFBFBF] md:text-base">Gaming Content Creator 🎮</p>

        <p
          dir="rtl"
          className="arabic-slogan mx-auto mb-[10px] mt-[8px] max-w-2xl text-xl leading-relaxed text-[rgba(255,255,255,0.8)] sm:text-2xl md:text-3xl"
        >
          الهدف هو نرجع يوتيوب الجزائر أفضل
        </p>

        <p className="mt-6 text-sm uppercase tracking-[0.3em] text-[#BFBFBF] md:text-base">
          Gaming • Reviews • Live Streams
        </p>

        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[#BFBFBF] md:text-base">
          Gaming content creator & streamer. I review and play games, share setups and insights.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#videos"
            className="border border-white px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition hover:bg-white hover:text-black"
          >
            Watch Videos
          </a>
          <a
            href="#portfolio"
            className="border border-[#1A1A1A] bg-white/5 px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition hover:border-white hover:bg-white hover:text-black"
          >
            Explore Portfolio
          </a>
        </div>
      </motion.div>
    </section>
  );
}
