'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Corner = 'tl' | 'tr' | 'bl' | 'br';

interface HeroCornerHudProps {
  position: Corner;
  label:    string;
  delay?:   number;
  children: ReactNode;
}

/**
 * HeroCornerHud — small HUD block that sits in a viewport corner of the
 * Hero section. Holds terminal-style readouts (boot sequence / live clock
 * / role list / scroll hint). Purely decorative — always `pointer-events:
 * none` so it never interferes with interactive content in the hero
 * centre.
 *
 * Round 2.1 v2 replaces the v1 single-column Hero stack (6 centred
 * elements) with a center headline + 4 corner HUDs so the page breathes.
 */
export default function HeroCornerHud({
  position,
  label,
  delay = 0,
  children,
}: HeroCornerHudProps) {
  const posClass: Record<Corner, string> = {
    tl: 'top-20 left-6 md:top-24 md:left-12',
    tr: 'top-20 right-6 md:top-24 md:right-12',
    bl: 'bottom-16 left-6 md:bottom-20 md:left-12',
    br: 'bottom-16 right-6 md:bottom-20 md:right-12',
  };

  const alignClass = position.includes('r') ? 'text-right' : 'text-left';

  return (
    <motion.div
      initial={{ opacity: 0, y: position.includes('t') ? -8 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={
        `absolute ${posClass[position]} z-20 w-[180px] md:w-[210px] ${alignClass} ` +
        'hidden sm:block pointer-events-none select-none'
      }
    >
      <div
        className="relative border border-[#5CE1FF]/20 px-3 py-3 bg-[#050505]/40"
        style={{ backdropFilter: 'blur(4px)' }}
      >
        {/* HUD corner brackets (4 corners of the block itself) */}
        {(['tl', 'tr', 'bl', 'br'] as const).map((c) => {
          const style: React.CSSProperties = {
            position:       'absolute',
            width:          '6px',
            height:         '6px',
            pointerEvents:  'none',
          };
          style[c.includes('t') ? 'top' : 'bottom'] = '-1px';
          style[c.includes('l') ? 'left' : 'right'] = '-1px';
          return (
            <span key={c} aria-hidden style={style}>
              <span
                style={{
                  position:  'absolute',
                  width:     '100%',
                  height:    '1px',
                  background:'rgba(92,225,255,0.55)',
                  [c.includes('t') ? 'top' : 'bottom']: 0,
                }}
              />
              <span
                style={{
                  position:  'absolute',
                  width:     '1px',
                  height:    '100%',
                  background:'rgba(92,225,255,0.55)',
                  [c.includes('l') ? 'left' : 'right']: 0,
                }}
              />
            </span>
          );
        })}

        <div
          className="font-label text-[9px] text-[#5CE1FF]/80 mb-2 tracking-[0.28em]"
          style={{ textShadow: '0 0 8px rgba(92,225,255,0.55)' }}
        >
          [ {label} ]
        </div>
        <div
          className="font-label text-[10px] text-white/60 tracking-[0.08em] leading-[1.55] whitespace-nowrap"
          style={{ textShadow: '0 0 8px rgba(5,5,5,0.9)' }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}
