'use client';

import { motion } from 'framer-motion';
import { youtubeVideos } from '@/data/siteData';

export default function YouTubeSection() {
  return (
    <section id="videos" className="section-spacing">
      <div className="section-shell">
        <p className="section-label">YouTube</p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="heading-font text-5xl md:text-6xl"
        >
          Latest Videos
        </motion.h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {youtubeVideos.map((videoId, index) => (
            <motion.div
              key={videoId}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.08, duration: 0.65 }}
              whileHover={{ scale: 1.015 }}
              className="overflow-hidden border border-[#1A1A1A] bg-[#090909]"
            >
              <div className="relative aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`YouTube video ${index + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
