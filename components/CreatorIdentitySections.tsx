'use client';

import { motion } from 'framer-motion';
import { behindTheScenesPhotos, contentStyles, journeyMilestones, popularVideos } from '@/data/siteData';

export default function CreatorIdentitySections() {
  return (
    <>
      <section id="content-style" className="section-spacing">
        <div className="section-shell">
          <p className="section-label">Creator Identity</p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="heading-font text-5xl md:text-6xl"
          >
            CONTENT STYLE
          </motion.h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {contentStyles.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden border border-[#1A1A1A]"
              >
                <div
                  className="h-72 bg-cover bg-center transition duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent transition duration-500 group-hover:from-black/95" />
                <h3 className="absolute bottom-5 left-5 heading-font text-3xl leading-none tracking-[0.12em]">
                  {item.title}
                </h3>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="videos" className="section-spacing border-y border-[#101010] bg-[#050505]">
        <div className="section-shell">
          <p className="section-label">YouTube Highlights</p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="heading-font text-5xl md:text-6xl"
          >
            POPULAR VIDEOS
          </motion.h2>
          <p className="mt-4 max-w-2xl text-sm uppercase tracking-[0.15em] text-[#9F9F9F]">
            The most engaging stories from the channel.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {popularVideos.map((video, index) => (
              <motion.a
                key={video.title}
                href={video.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.08 }}
                className="group relative overflow-hidden border border-[#1A1A1A]"
              >
                <div
                  className="aspect-video bg-cover bg-center transition duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${video.thumbnail}')` }}
                />
                <div className="absolute inset-0 bg-black/35 transition duration-500 group-hover:bg-black/55" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="heading-font text-3xl leading-none tracking-[0.1em]">{video.title}</h3>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section id="behind-the-scenes" className="section-spacing">
        <div className="section-shell">
          <p className="section-label">Raw Frames</p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="heading-font text-5xl md:text-6xl"
          >
            BEHIND THE SCENES
          </motion.h2>

          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-2">
            {behindTheScenesPhotos.map((photo, index) => (
              <motion.figure
                key={photo.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.06 }}
                className={`group relative overflow-hidden border border-[#1A1A1A] ${photo.layout}`}
              >
                <div
                  className="h-full min-h-44 w-full bg-cover bg-center transition duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${photo.image}')` }}
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent px-4 pb-4 pt-10 text-xs uppercase tracking-[0.2em] text-[#D4D4D4]">
                  {photo.title}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      <section id="journey" className="section-spacing border-y border-[#101010] bg-[#050505]">
        <div className="section-shell">
          <p className="section-label">Milestones</p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="heading-font text-5xl md:text-6xl"
          >
            THE JOURNEY
          </motion.h2>

          <div className="relative mt-10 pl-8">
            <div className="absolute bottom-0 left-2 top-0 w-px bg-white/25" />
            <div className="space-y-9">
              {journeyMilestones.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.08 }}
                  className="relative"
                >
                  <span className="absolute -left-[1.95rem] top-1 h-3 w-3 rounded-full border border-white bg-black" />
                  <h3 className="heading-font text-3xl tracking-[0.1em]">{item.title}</h3>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#B9B9B9]">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="section-shell text-center">
          <p className="section-label">Signature</p>
          <blockquote className="mx-auto max-w-4xl heading-font text-4xl leading-tight tracking-[0.08em] text-[#F2F2F2] sm:text-5xl md:text-6xl">
            “I create content that feels real, raw, and cinematic.”
          </blockquote>
        </div>
      </section>
    </>
  );
}
