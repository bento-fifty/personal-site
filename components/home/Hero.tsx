'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import ScrollIndicator from './ScrollIndicator';

export default function Hero() {
  const t = useTranslations('home');
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Ghost text 往上漂移，製造 parallax
  const ghostY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-screen -mt-14 bg-[#080808] flex items-center justify-center overflow-hidden"
    >
      {/* Ghost text — parallax background */}
      <motion.div
        style={{ y: ghostY, opacity: ghostOpacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <span className="font-display font-bold text-[22vw] leading-none text-white/[0.03] whitespace-nowrap">
          EVENTS
        </span>
      </motion.div>

      {/* Centre content */}
      <div className="relative z-10 text-center px-6 pt-14">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="font-label text-[#C8A96E] mb-8"
        >
          EVAN CHANG
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
          className="font-display text-white text-[2.75rem] leading-[1.1] md:text-7xl lg:text-[6rem] font-light mb-8 max-w-3xl mx-auto"
        >
          {t('headline')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7, ease: 'easeOut' }}
          className="font-label text-white/35 tracking-[0.2em]"
        >
          {t('subheading')}
        </motion.p>
      </div>

      <ScrollIndicator />
    </section>
  );
}
