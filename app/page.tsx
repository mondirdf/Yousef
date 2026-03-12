'use client';

import { Instagram, Mail, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

type YouTubeData = {
  subscriberCount: string;
  latestVideoId: string;
  latestVideoTitle: string;
  latestVideoThumbnail: string;
  channelUrl: string;
};

type SocialLink = {
  label: string;
  href: string;
  icon: 'youtube' | 'instagram' | 'tiktok' | 'discord' | 'kick' | 'email';
};

const defaultData: YouTubeData = {
  subscriberCount: '--',
  latestVideoId: 'DWcJFNfaw9c',
  latestVideoTitle: 'Latest upload from Ramzi ZRT',
  latestVideoThumbnail: 'https://i.ytimg.com/vi/DWcJFNfaw9c/maxresdefault.jpg',
  channelUrl: 'https://www.youtube.com/channel/UCKz8ISvm1sH1iNyo2DPzQoA'
};

const socialLinks: SocialLink[] = [
  { label: 'Watch on YouTube', href: 'https://www.youtube.com/channel/UCKz8ISvm1sH1iNyo2DPzQoA', icon: 'youtube' },
  { label: 'Instagram', href: 'https://www.instagram.com/ramzi.zrt/', icon: 'instagram' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@ramzizrt', icon: 'tiktok' },
  { label: 'Discord', href: 'https://discord.gg/EyGmfqBP7d', icon: 'discord' },
  { label: 'Kick', href: 'https://kick.com/ramzi-zrt', icon: 'kick' },
  { label: 'Email', href: 'mailto:ramzizaratpro@gmail.com', icon: 'email' }
];

const whatIDoContent = [
  {
    icon: '🎥',
    title: 'YouTube Content',
    description: 'Entertaining videos, challenges and real-life stories.'
  },
  {
    icon: '📸',
    title: 'Photography',
    description: 'Capturing cinematic moments and visual storytelling.'
  },
  {
    icon: '🎬',
    title: 'Video Editing',
    description: 'Creative edits and storytelling for social media.'
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 }
};

function PlatformIcon({ icon }: { icon: SocialLink['icon'] }) {
  if (icon === 'youtube') return <Youtube className="h-5 w-5" aria-hidden="true" />;
  if (icon === 'instagram') return <Instagram className="h-5 w-5" aria-hidden="true" />;
  if (icon === 'email') return <Mail className="h-5 w-5" aria-hidden="true" />;

  if (icon === 'tiktok') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.231h-3.4v13.715a2.9 2.9 0 1 1-2.9-2.9c.233 0 .46.028.678.08V9.89a6.35 6.35 0 1 0 6.222 6.35V9.228a8.165 8.165 0 0 0 4.784 1.525V7.4a4.83 4.83 0 0 1-1.614-.714Z" />
      </svg>
    );
  }

  if (icon === 'discord') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M20.317 4.369A19.791 19.791 0 0 0 15.885 3c-.191.328-.403.77-.55 1.116a18.264 18.264 0 0 0-5.35 0A12.64 12.64 0 0 0 9.435 3a19.736 19.736 0 0 0-4.433 1.37C2.2 8.602 1.44 12.728 1.8 16.798a19.9 19.9 0 0 0 5.42 2.759c.438-.604.83-1.24 1.17-1.904-.643-.242-1.257-.54-1.84-.885.154-.113.305-.23.451-.349 3.55 1.668 7.404 1.668 10.912 0 .147.12.298.236.451.35-.582.344-1.197.642-1.841.884.341.663.732 1.3 1.171 1.903a19.857 19.857 0 0 0 5.421-2.758c.423-4.717-.722-8.805-3.2-12.43ZM8.02 14.315c-1.065 0-1.94-.975-1.94-2.17 0-1.196.858-2.17 1.94-2.17 1.09 0 1.958.984 1.94 2.17 0 1.195-.858 2.17-1.94 2.17Zm7.96 0c-1.066 0-1.94-.975-1.94-2.17 0-1.196.857-2.17 1.94-2.17 1.09 0 1.957.984 1.94 2.17 0 1.195-.85 2.17-1.94 2.17Z" />
      </svg>
    );
  }

  if (icon === 'kick') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
        <path d="M3 3h8v5H9V6H5v12h4v-2h2v5H3V3Z" />
        <path d="M12 3h9v5.5A3.5 3.5 0 0 1 17.5 12H16l5 9h-6l-4-8h1.5A2.5 2.5 0 0 0 15 10.5V8h-3V3Z" />
      </svg>
    );
  }

  return null;
}

export default function Home() {
  const [youtubeData, setYoutubeData] = useState(defaultData);
  const [cursor, setCursor] = useState({ x: -200, y: -200 });

  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: `${(i * 19) % 100}%`,
        delay: `${(i % 7) * 0.6}s`,
        duration: `${7 + (i % 5)}s`
      })),
    []
  );

  useEffect(() => {
    const loadYouTubeData = async () => {
      try {
        const response = await fetch('/api/youtube');
        if (!response.ok) return;
        const payload = (await response.json()) as YouTubeData;
        setYoutubeData(payload);
      } catch {
        // fallback remains visible
      }
    };

    const onMove = (event: MouseEvent) => {
      setCursor({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', onMove);
    void loadYouTubeData();

    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <main className="relative z-10 mx-auto min-h-screen w-full max-w-md overflow-hidden px-5 pb-16 pt-8 sm:px-6">
      <div
        className="pointer-events-none fixed z-0 h-44 w-44 rounded-full bg-white/20 blur-3xl transition-transform duration-300"
        style={{ transform: `translate(${cursor.x - 88}px, ${cursor.y - 88}px)` }}
      />

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="absolute block h-1.5 w-1.5 rounded-full bg-white/30"
            style={{
              left: particle.left,
              bottom: '-10%',
              animation: `floatParticle ${particle.duration} linear infinite`,
              animationDelay: particle.delay
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes floatParticle {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          15% { opacity: 0.65; }
          100% { transform: translateY(-120vh) scale(1.1); opacity: 0; }
        }
      `}</style>

      <motion.section
        className="glass-card floating mb-8 px-6 py-8 text-center"
        variants={fadeUp}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto h-[118px] w-[118px] rounded-full border border-white/20 p-[6px] [animation:ringPulse_3s_ease-in-out_infinite]">
          <div className="h-full w-full rounded-full border border-white/15 p-[4px] shadow-[0_0_28px_rgba(255,255,255,0.2)]">
            <img
              src="/ramzi-logo.svg"
              alt="Ramzi ZRT profile"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </div>
        <h1 className="heading-font mt-5 text-5xl uppercase leading-none">RAMZI ZRT</h1>
        <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[#BFBFBF]">Content Creator</p>
        <p className="mt-4 text-sm leading-relaxed text-[#BFBFBF]">
          Creating cinematic YouTube videos, challenges and real-life stories.
        </p>
        <div className="mx-auto mt-5 w-fit rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          Subscribers: <span className="font-semibold">{youtubeData.subscriberCount}</span>
        </div>
      </motion.section>

      <motion.section
        className="mb-8 flex flex-col gap-3"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
      >
        {socialLinks.map((link) => (
          <motion.a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.99 }}
            className="glass-card group relative flex h-[60px] items-center justify-center overflow-hidden text-sm font-medium"
          >
            <span className="absolute -left-1/2 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition duration-700 group-hover:left-[120%] group-hover:opacity-100" />
            <span className="relative z-10 flex items-center gap-2.5">
              <PlatformIcon icon={link.icon} />
              <span>{link.label}</span>
            </span>
          </motion.a>
        ))}
      </motion.section>

      <motion.section
        className="mb-8"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55 }}
      >
        <h2 className="heading-font mb-4 text-3xl uppercase">Latest Video</h2>
        <motion.a
          href={`https://www.youtube.com/watch?v=${youtubeData.latestVideoId}`}
          target="_blank"
          rel="noreferrer"
          whileHover={{ y: -4, scale: 1.01 }}
          className="glass-card soft-glow block overflow-hidden"
        >
          <img src={youtubeData.latestVideoThumbnail} alt={youtubeData.latestVideoTitle} className="w-full" />
          <div className="border-t border-white/15 p-4">
            <p className="text-sm text-[#BFBFBF]">{youtubeData.latestVideoTitle}</p>
          </div>
        </motion.a>
      </motion.section>

      <motion.section
        className="mb-8"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55 }}
      >
        <h2 className="heading-font mb-4 text-3xl uppercase">WHAT I DO</h2>
        <div className="flex flex-col gap-4">
          {whatIDoContent.map((item) => (
            <motion.article
              key={item.title}
              whileHover={{
                scale: 1.03,
                boxShadow:
                  '0 0 0 1px rgba(255,255,255,0.2), 0 18px 38px rgba(0,0,0,0.55), 0 0 30px rgba(255,255,255,0.2)'
              }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="glass-card group relative overflow-hidden p-5"
            >
              <div className="absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),transparent_55%)]" />
              <div className="relative z-10">
                <div className="text-3xl" aria-hidden="true">
                  {item.icon}
                </div>
                <h3 className="heading-font mt-4 text-2xl uppercase leading-none">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#C9C9C9]">{item.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="glass-card soft-glow px-6 py-10 text-center"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
      >
        <p className="heading-font text-3xl uppercase leading-tight">Join the community on YouTube.</p>
        <motion.a
          href={youtubeData.channelUrl}
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 inline-flex h-[56px] items-center justify-center rounded-2xl border border-white/35 bg-white/10 px-8 text-sm font-semibold uppercase tracking-[0.12em]"
        >
          Subscribe
        </motion.a>
      </motion.section>
    </main>
  );
}
