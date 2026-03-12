'use client';

import { motion } from 'framer-motion';
import { skills } from '@/data/siteData';

export default function SkillsSection() {
  return (
    <section className="section-spacing">
      <div className="section-shell max-w-4xl">
        <p className="section-label">Capabilities</p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="heading-font text-5xl md:text-6xl"
        >
          Skills
        </motion.h2>

        <div className="mt-10 space-y-7">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#BFBFBF]">
                <span>{skill.name}</span>
                <span>{skill.value}%</span>
              </div>
              <div className="h-2 w-full bg-[#101010]">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-white"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
