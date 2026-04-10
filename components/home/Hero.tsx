'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import DataStreams from './DataStreams';
import LoadingIntro from './LoadingIntro';
import ScrollIndicator from './ScrollIndicator';

export default function Hero() {
  const t = useTranslations('home');
  const ref = useRef<HTMLElement>(null);
  const [loaded, setLoaded] = useState(false);

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
      {/* Layer 0: Loading intro — self-contained fixed overlay */}
      <LoadingIntro onComplete={() => setLoaded(true)} />

      {/* Layer 1: CSS data streams + dot grid */}
      <DataStreams />

      {/* Layer 2: Ghost text parallax — blur→focus on reveal */}
      <motion.div
        style={{ y: ghostY, opacity: ghostOpacity }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <motion.span
          className="font-display font-bold text-[22vw] leading-none text-white/[0.035] whitespace-nowrap"
          initial={{ filter: 'blur(48px)' }}
          animate={{ filter: loaded ? 'blur(0px)' : 'blur(48px)' }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          EVENTS
        </motion.span>
      </motion.div>

      {/* Layer 3: Hero content — blur→focus after load */}
      <motion.div
        initial={{ opacity: 0, filter: 'blur(22px)', y: 8 }}
        animate={{
          opacity: loaded ? 1 : 0,
          filter: loaded ? 'blur(0px)' : 'blur(22px)',
          y: loaded ? 0 : 8,
        }}
        transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="relative z-10 text-center px-6 pt-14"
      >
        <p
          className="font-label text-[#5CE1FF] mb-8"
          style={{ textShadow: '0 0 14px rgba(92,225,255,0.5)' }}
        >
          EVAN CHANG
        </p>
        <h1 className="font-display text-white text-[2.75rem] leading-[1.1] md:text-7xl lg:text-[6rem] font-light mb-8 max-w-3xl mx-auto">
          {t('headline')}
        </h1>
        <p className="font-label text-white/35 tracking-[0.2em]">
          {t('subheading')}
        </p>
      </motion.div>

      {/* Layer 4: Scroll indicator — only after reveal */}
      {loaded && <ScrollIndicator />}
    </section>
  );
}
