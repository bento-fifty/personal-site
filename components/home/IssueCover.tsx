'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import FeaturedMarquee from './FeaturedMarquee';

/**
 * IssueCover — v8 home. Single viewport, no scroll.
 *
 * Single anchor: stacked THE / LEVEL monogram in flame Fraunces.
 * Supporting actors: top-right issue meta, bottom-right tagline, bottom-left CTA.
 */

interface Props {
  locale: 'zh-TW' | 'en-US';
}

const TAGLINES = {
  'zh-TW': 'Events crafted to be remembered.',
  'en-US': 'Events crafted to be remembered.',
};

export default function IssueCover({ locale }: Props) {
  const [monoHover, setMonoHover] = useState(false);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: 'calc(100dvh - 44px)', background: '#0A0A0C' }}
      aria-label="Issue Cover"
    >
      {/* Perspective grid — Ichiki-style wireframe floor (stronger than before) */}
      <div
        aria-hidden
        className="hidden md:block absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: '65%',
          backgroundImage: `
            linear-gradient(rgba(93,211,227,0.22) 1px, transparent 1px),
            linear-gradient(90deg, rgba(93,211,227,0.22) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          transform: 'perspective(520px) rotateX(64deg)',
          transformOrigin: 'bottom center',
          maskImage: 'linear-gradient(to top, black 15%, transparent 95%)',
          WebkitMaskImage: 'linear-gradient(to top, black 15%, transparent 95%)',
          zIndex: 0,
        }}
      />
      {/* Thin horizon line at wireframe origin */}
      <div
        aria-hidden
        className="hidden md:block absolute inset-x-0 pointer-events-none"
        style={{
          bottom: '35%',
          height: 1,
          background: 'rgba(93,211,227,0.3)',
          zIndex: 0,
        }}
      />

      {/* Top-right issue meta */}
      <motion.div
        className="absolute top-6 right-5 md:top-10 md:right-10 text-right"
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

      {/* Monogram — the single hero */}
      <div
        className="absolute left-5 md:left-10 flex flex-col"
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


      {/* Bottom-left CTA — single anchor for action */}
      <motion.div
        className="absolute left-5 md:left-10 bottom-6 md:bottom-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 1.0 }}
      >
        <Link
          href={`/${locale}/work`}
          data-cursor="▸ ENTER"
          data-cursor-variant="primary"
          className="inline-block transition-colors duration-200"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 11,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#E63E1F',
            padding: '10px 14px',
            border: '1px solid #E63E1F',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#E63E1F';
            e.currentTarget.style.color = '#0A0A0C';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#E63E1F';
          }}
        >
          [ ENTER ARCHIVE → ]
        </Link>
      </motion.div>

      {/* Bottom-right page indicator (minimal) */}
      <motion.div
        className="absolute right-5 md:right-10 bottom-6 md:bottom-8"
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
