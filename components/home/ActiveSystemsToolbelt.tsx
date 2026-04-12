'use client';

import { motion } from 'framer-motion';
import HudCorners from '@/components/shared/HudCorners';

/**
 * ActiveSystemsToolbelt — Section 02.
 *
 * Metaphor: starship weapons bay. 8 service-domain chips laid out in a
 * 2×4 (desktop) / 2×2 scroll (mobile) bento grid, each with a terminal
 * code label, short description and `[ ACTIVE ]` status readout. Mirrors
 * SynaBun's tool chip feed (Image #25) but reframed for event production.
 *
 * Scope: hover highlight only — no click-through. The chips are a
 * capabilities showcase, not a nav surface.
 */

interface System {
  code:  string;
  title: string;
  desc:  string;
  tag:   string;
}

const SYSTEMS: System[] = [
  {
    code:  'EVT-01',
    title: 'Event Planning',
    desc:  'From brief to concept — theme, flow, visual system, budget book.',
    tag:   'PLAN',
  },
  {
    code:  'PRS-02',
    title: 'Press Conference',
    desc:  'Media-first show control, embargo handling, guest choreography.',
    tag:   'PRESS',
  },
  {
    code:  'POP-03',
    title: 'Pop-Up Activation',
    desc:  'Brand immersive environments built for shareability, not symmetry.',
    tag:   'BRAND',
  },
  {
    code:  'LRG-04',
    title: 'Large-Scale',
    desc:  'Outdoor events, stage, safety, crowd flow up to 3,500+ guests.',
    tag:   'SCALE',
  },
  {
    code:  'BRD-05',
    title: 'Brand Retainer',
    desc:  'Year-round strategy threading events, PR, and culture programs.',
    tag:   'CORP',
  },
  {
    code:  'ART-06',
    title: 'Art Direction',
    desc:  'Theme, visual system, identity — co-created with designers.',
    tag:   'CREATIVE',
  },
  {
    code:  'GST-07',
    title: 'Guest Experience',
    desc:  'Invite, onboarding, wayfinding, memento, follow-up design.',
    tag:   'UX',
  },
  {
    code:  'KOL-08',
    title: 'KOL Activation',
    desc:  'KOL briefing, on-site coordination, synced content capture.',
    tag:   'SOCIAL',
  },
];

export default function ActiveSystemsToolbelt() {
  return (
    <section
      id="toolbelt"
      className="relative min-h-[100dvh] flex flex-col justify-center py-24 md:py-28"
    >
      <div className="hud-grid">
        {/* Section header */}
        <div className="col-span-12 mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="font-label text-[11px] text-[#5CE1FF]/80 mb-6 tracking-[0.28em]"
            style={{ textShadow: '0 0 12px rgba(92,225,255,0.5)' }}
          >
            {'// 02 // ACTIVE SYSTEMS'}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-white text-[33px] md:text-[55px] lg:text-[66px] leading-[1.05] max-w-3xl"
            style={{
              fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
              fontWeight:          500,
              letterSpacing:       '-0.015em',
              WebkitFontSmoothing: 'antialiased',
              textShadow:          '0 0 22px rgba(5,5,5,0.9)',
            }}
          >
            What I can deploy.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="mt-5 font-label text-[11px] text-white/40 tracking-[0.22em] max-w-xl"
          >
            [ 8 SERVICE MODULES / ALL SYSTEMS NOMINAL ]
          </motion.p>
        </div>

        {/* Chip grid */}
        <div className="col-span-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {SYSTEMS.map((s, i) => (
            <motion.div
              key={s.code}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.7,
                ease:     [0.22, 1, 0.36, 1],
                delay:    0.1 + i * 0.06,
              }}
              className="relative border border-white/[0.08] bg-[#050505]/40 p-5 hover:border-[#5CE1FF]/45 transition-colors group"
              style={{ backdropFilter: 'blur(2px)' }}
            >
              <HudCorners />

              {/* Top row — code label + tag chip */}
              <div className="flex items-center justify-between mb-6">
                <span
                  className="font-label text-[10px] text-[#5CE1FF] tracking-[0.22em]"
                  style={{ textShadow: '0 0 8px rgba(92,225,255,0.55)' }}
                >
                  {s.code}
                </span>
                <span className="font-label text-[9px] text-white/35 tracking-[0.22em]">
                  [ {s.tag} ]
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-white text-[17px] md:text-[19px] leading-[1.1] mb-3"
                style={{
                  fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
                  fontWeight:          500,
                  letterSpacing:       '-0.015em',
                  WebkitFontSmoothing: 'antialiased',
                }}
              >
                {s.title}
              </h3>

              {/* Desc */}
              <p
                className="text-white/55 text-[12px] leading-[1.55] mb-6"
                style={{
                  fontFamily:          'var(--font-geist), "Chiron Hei HK WS", sans-serif',
                  WebkitFontSmoothing: 'antialiased',
                }}
              >
                {s.desc}
              </p>

              {/* Bottom status line */}
              <div className="pt-4 border-t border-white/[0.06] group-hover:border-[#5CE1FF]/25 transition-colors flex items-center justify-between">
                <span className="font-label text-[9px] text-[#5CE1FF]/80 tracking-[0.22em]">
                  [ ACTIVE ]
                </span>
                <span
                  aria-hidden
                  className="inline-block w-1.5 h-1.5 rounded-full bg-[#5CE1FF]/70"
                  style={{ boxShadow: '0 0 8px rgba(92,225,255,0.7)' }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
