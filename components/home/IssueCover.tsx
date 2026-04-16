'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import FeaturedMarquee from './FeaturedMarquee';
import WireCubeCluster from './WireCubeCluster';

/**
 * IssueCover — v8 home. Single viewport, no scroll.
 *
 * Main anchor: THE / LEVEL monogram (flame Fraunces, left).
 * Supports: top-right issue meta, bottom-right cubes cluster, right featured rail, wireframe floor.
 */

interface Props {
  locale: 'zh-TW' | 'en-US';
}

export default function IssueCover({ locale }: Props) {
  const [monoHover, setMonoHover] = useState(false);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: 'calc(100dvh - 44px)', background: 'transparent' }}
      aria-label="Issue Cover"
    >
      {/* Wireframe floor — white lines (stronger, ichiki direction) */}
      <div
        aria-hidden
        className="hidden md:block absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '60%',
          backgroundImage: `
            linear-gradient(rgba(250,250,248,0.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(250,250,248,0.35) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          transform: 'perspective(480px) rotateX(66deg)',
          transformOrigin: 'bottom center',
          maskImage: 'linear-gradient(to top, black 5%, transparent 92%)',
          WebkitMaskImage: 'linear-gradient(to top, black 5%, transparent 92%)',
          zIndex: 0,
        }}
      />

      {/* 3D wireframe cubes cluster (bottom-right) */}
      <WireCubeCluster />

      {/* Top-right issue meta */}
      <motion.div
        className="absolute top-6 right-5 md:top-10 md:right-[240px] text-right z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 10,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(250,250,248,0.55)',
          lineHeight: 1.8,
        }}
      >
        <div>Spring Collection</div>
        <div>Vol. 003 / 042</div>
      </motion.div>

      {/* Monogram — single hero */}
      <div
        className="absolute left-5 md:left-10 flex flex-col z-10"
        style={{ bottom: 'clamp(84px, 14vh, 160px)' }}
      >
        {['THE', 'LEVEL'].map((word, i) => (
          <motion.span
            key={word}
            className="font-display-xl"
            onMouseEnter={() => setMonoHover(true)}
            onMouseLeave={() => setMonoHover(false)}
            initial={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
            animate={{ clipPath: 'inset(0% 0 0 0)', opacity: 1 }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.3 + i * 0.12,
            }}
            style={{
              color: '#E63E1F',
              fontFamily: 'var(--font-display), serif',
              fontSize: 'clamp(120px, 18vw, 320px)',
              fontVariationSettings: monoHover
                ? '"opsz" 144, "wght" 900, "SOFT" 100'
                : '"opsz" 144, "wght" 900, "SOFT" 0',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 0.85,
              transition: 'font-variation-settings 400ms ease-out',
              display: 'block',
              cursor: 'default',
            }}
          >
            {word}
          </motion.span>
        ))}
      </div>

      {/* Bottom-right page indicator (moves left to avoid featured rail) */}
      <motion.div
        className="absolute right-5 md:right-[240px] bottom-6 md:bottom-8 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 1.1 }}
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 10,
          letterSpacing: '0.22em',
          color: 'rgba(250,250,248,0.35)',
        }}
      >
        01 / 01
      </motion.div>

      {/* Featured rail (desktop only) */}
      <FeaturedMarquee locale={locale} />
    </section>
  );
}
