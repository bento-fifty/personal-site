'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import HudCorners from '@/components/shared/HudCorners';
import { RESULTS, rotationFromId, type ResultItem } from '@/lib/results-data';

/**
 * TelemetryWall — Section 07.
 *
 * Scattered whiteboard wall of media mentions / press / awards
 * (Image #28 reference). Each card has a deterministic pseudo-random
 * rotation (−4..+4°) seeded from its id so the layout is stable across
 * SSR/CSR. Hover a card → rotates to 0, scales up 1.05, other cards
 * dim. Wall as social proof instead of a logo grid (which Evan can't
 * deliver yet).
 */

export default function TelemetryWall() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section
      id="telemetry"
      className="relative min-h-[100dvh] flex flex-col justify-center py-24 md:py-28"
    >
      <div className="hud-grid">
        <div className="col-span-12 mb-12 md:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="font-label text-[11px] text-[#5CE1FF]/80 mb-5 tracking-[0.28em]"
            style={{ textShadow: '0 0 12px rgba(92,225,255,0.5)' }}
          >
            {'// 07 // TELEMETRY'}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-white text-[33px] md:text-[44px] lg:text-[55px] leading-[1.05] max-w-3xl"
            style={{
              fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
              fontWeight:          500,
              letterSpacing:       '-0.015em',
              WebkitFontSmoothing: 'antialiased',
              textShadow:          '0 0 22px rgba(5,5,5,0.9)',
            }}
          >
            Signal returns.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
            className="mt-4 font-label text-[11px] text-white/40 tracking-[0.22em] max-w-lg"
          >
            [ {RESULTS.length} INTERCEPTS / EARNED MEDIA + AWARDS ]
          </motion.p>
        </div>

        <div className="col-span-12">
          <div className="relative flex flex-wrap gap-6 md:gap-8 justify-center">
            {RESULTS.map((r, i) => (
              <TelemetryCard
                key={r.id}
                item={r}
                index={i}
                dimmed={hoveredId !== null && hoveredId !== r.id}
                onHoverStart={() => setHoveredId(r.id)}
                onHoverEnd={() => setHoveredId(null)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TelemetryCard({
  item,
  index,
  dimmed,
  onHoverStart,
  onHoverEnd,
}: {
  item:         ResultItem;
  index:        number;
  dimmed:       boolean;
  onHoverStart: () => void;
  onHoverEnd:   () => void;
}) {
  const baseRotate = rotationFromId(item.id);

  return (
    <motion.a
      href={item.url ?? '#'}
      target={item.url && item.url !== '#' ? '_blank' : undefined}
      rel={item.url && item.url !== '#' ? 'noreferrer' : undefined}
      initial={{ opacity: 0, y: 20, rotate: baseRotate }}
      whileInView={{ opacity: 1, y: 0, rotate: baseRotate }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        ease:     [0.22, 1, 0.36, 1],
        delay:    0.05 + index * 0.05,
      }}
      whileHover={{ rotate: 0, scale: 1.05, zIndex: 30 }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      style={{ opacity: dimmed ? 0.35 : 1, transition: 'opacity 200ms linear' }}
      className="group relative block w-[240px] md:w-[260px] border border-white/[0.08] bg-[#070707]/80 p-5 hover:border-[#5CE1FF]/45 transition-colors"
    >
      <HudCorners />

      {/* Top row — id + type chip */}
      <div className="flex items-center justify-between mb-4">
        <span
          className="font-label text-[10px] text-[#5CE1FF] tracking-[0.22em]"
          style={{ textShadow: '0 0 8px rgba(92,225,255,0.5)' }}
        >
          #{item.id}
        </span>
        <span className="font-label text-[9px] text-white/40 tracking-[0.22em]">
          [ {item.type} ]
        </span>
      </div>

      {/* Source */}
      <p className="font-label text-[10px] text-white/55 tracking-[0.2em] mb-3">
        {item.source.toUpperCase()}
      </p>

      {/* Headline */}
      <h3
        className="text-white text-[14px] md:text-[15px] leading-[1.35] mb-5 line-clamp-3"
        style={{
          fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
          fontWeight:          500,
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {item.headline}
      </h3>

      {/* Bottom row — date + arrow */}
      <div className="pt-3 border-t border-white/[0.06] group-hover:border-[#5CE1FF]/25 transition-colors flex items-center justify-between">
        <span className="font-label text-[9px] text-white/35 tabular-nums tracking-[0.2em]">
          {item.date}
        </span>
        <span className="font-label text-[10px] text-white/40 group-hover:text-[#5CE1FF] transition-colors">
          READ →
        </span>
      </div>
    </motion.a>
  );
}
