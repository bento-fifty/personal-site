'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import DataStreams from './DataStreams';
import BootSequence from './BootSequence';
import ScrollIndicator from './ScrollIndicator';

export default function Hero() {
  const t = useTranslations('home');
  const ref = useRef<HTMLElement>(null);
  const [bootComplete, setBootComplete] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const ghostY       = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-screen -mt-14 bg-[#080808] flex items-center justify-center overflow-hidden"
    >
      {/* Layer 1: CSS data streams + dot grid */}
      <DataStreams />

      {/* Layer 2: Ghost text parallax */}
      <motion.div
        style={{ y: ghostY, opacity: ghostOpacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <span className="font-display font-bold text-[22vw] leading-none text-white/[0.025] whitespace-nowrap">
          EVENTS
        </span>
      </motion.div>

      {/* Layer 3: Boot sequence — bottom-left, fades out then triggers hero */}
      <BootSequence onComplete={() => setBootComplete(true)} />

      {/* Layer 4: Hero content — fades in after boot completes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: bootComplete ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center px-6 pt-14"
      >
        <p className="font-label text-[#C8A96E] mb-8">
          EVAN CHANG
        </p>
        <h1 className="font-display text-white text-[2.75rem] leading-[1.1] md:text-7xl lg:text-[6rem] font-light mb-8 max-w-3xl mx-auto">
          {t('headline')}
        </h1>
        <p className="font-label text-white/35 tracking-[0.2em]">
          {t('subheading')}
        </p>
      </motion.div>

      {/* Layer 5: Scroll indicator — only after hero is visible */}
      {bootComplete && <ScrollIndicator />}
    </section>
  );
}
