'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onEnter: () => void;
}

function HookContent({ mounted, igniting }: { mounted: boolean; igniting: boolean }) {
  return (
    <>
      {/* Solid background */}
      <div className="absolute inset-0" style={{ background: '#0A0A0C' }} />

      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(250,250,248,0.035) 0px, rgba(250,250,248,0.035) 1px, transparent 1px, transparent 60px),
            repeating-linear-gradient(90deg, rgba(250,250,248,0.035) 0px, rgba(250,250,248,0.035) 1px, transparent 1px, transparent 60px)
          `,
        }}
      />

      {/* Grid center brightening — radial mask amplifies grid near 等級 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(250,250,248,0.06) 0px, rgba(250,250,248,0.06) 1px, transparent 1px, transparent 60px),
            repeating-linear-gradient(90deg, rgba(250,250,248,0.06) 0px, rgba(250,250,248,0.06) 1px, transparent 1px, transparent 60px)
          `,
          maskImage: 'radial-gradient(ellipse 35% 40% at 50% 50%, black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 35% 40% at 50% 50%, black 0%, transparent 100%)',
        }}
      />

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 55% 55% at 50% 50%, transparent 0%, rgba(0,0,0,0.6) 100%)' }}
      />

      {/* 等級 + THE LEVEL — bilingual outline, side by side */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none gap-[clamp(24px,5vw,96px)] px-[5vw]"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.92 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1
          aria-label="等級 · THE LEVEL"
          style={{
            fontFamily: 'var(--font-noto-serif-tc), serif',
            fontSize: 'clamp(92px, 22vw, 320px)',
            fontWeight: 700,
            color: igniting ? '#E63E1F' : 'transparent',
            WebkitTextStroke: '2px #E63E1F',
            lineHeight: 0.9,
            letterSpacing: '-0.03em',
            margin: 0,
            transition: 'color 150ms ease-out',
          }}
        >
          等級
        </h1>
        <div
          aria-hidden
          style={{
            fontFamily: 'var(--font-display), serif',
            fontVariationSettings: '"opsz" 144, "wght" 900',
            fontSize: 'clamp(64px, 16vw, 220px)',
            color: igniting ? '#E63E1F' : 'transparent',
            WebkitTextStroke: '2px #E63E1F',
            lineHeight: 0.86,
            letterSpacing: '-0.04em',
            transition: 'color 150ms ease-out',
          }}
        >
          <div>THE</div>
          <div>LEVEL</div>
        </div>
      </motion.div>

      {/* Scattered text */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '9px', letterSpacing: '0.25em', color: 'rgba(250,250,248,0.15)', textTransform: 'uppercase' }}
      >
        <motion.span className="absolute" style={{ top: '22%', left: '8%' }} initial={{ opacity: 0 }} animate={{ opacity: mounted ? 1 : 0 }} transition={{ delay: 0.6, duration: 1 }}>
          Events
        </motion.span>
        <motion.span className="absolute" style={{ top: '18%', left: '38%' }} initial={{ opacity: 0 }} animate={{ opacity: mounted ? 1 : 0 }} transition={{ delay: 0.7, duration: 1 }}>
          of
        </motion.span>
        <motion.span className="absolute" style={{ top: '22%', right: '12%' }} initial={{ opacity: 0 }} animate={{ opacity: mounted ? 1 : 0 }} transition={{ delay: 0.8, duration: 1 }}>
          Tomorrow
        </motion.span>
        <motion.span className="absolute" style={{ top: '72%', left: '6%' }} initial={{ opacity: 0 }} animate={{ opacity: mounted ? 1 : 0 }} transition={{ delay: 0.9, duration: 1 }}>
          Crafted
        </motion.span>
        <motion.span className="absolute" style={{ top: '68%', left: '32%' }} initial={{ opacity: 0 }} animate={{ opacity: mounted ? 1 : 0 }} transition={{ delay: 1.0, duration: 1 }}>
          to be
        </motion.span>
        <motion.span className="absolute" style={{ top: '72%', right: '8%' }} initial={{ opacity: 0 }} animate={{ opacity: mounted ? 1 : 0 }} transition={{ delay: 1.1, duration: 1 }}>
          Remembered
        </motion.span>
        <motion.span className="absolute" style={{ top: '50%', left: '10%', transform: 'translateY(-50%)' }} initial={{ opacity: 0 }} animate={{ opacity: mounted ? 1 : 0 }} transition={{ delay: 0.8, duration: 1 }}>
          The Level
        </motion.span>
        <motion.span className="absolute" style={{ top: '50%', right: '10%', transform: 'translateY(-50%)' }} initial={{ opacity: 0 }} animate={{ opacity: mounted ? 1 : 0 }} transition={{ delay: 0.9, duration: 1 }}>
          Studio
        </motion.span>
      </div>

      {/* Top bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex justify-between items-center px-8 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(250,250,248,0.15)' }}>
          25.03°N 121.57°E
        </p>
        <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(250,250,248,0.15)', textTransform: 'uppercase' }}>
          The Level Studio
        </p>
      </motion.div>

      {/* ENTER — bottom center */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <motion.span
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '13px',
            letterSpacing: '0.5em',
            color: 'rgba(250,250,248,0.6)',
            textTransform: 'uppercase',
          }}
          animate={{ opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Enter
        </motion.span>
        <motion.div
          className="bg-[rgba(250,250,248,0.2)]"
          style={{ width: '2px' }}
          animate={{ height: ['16px', '28px', '16px'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="w-2 h-2 rounded-full"
          style={{ background: '#E63E1F' }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6],
            boxShadow: ['0 0 0px rgba(230,62,31,0)', '0 0 24px rgba(230,62,31,0.5)', '0 0 0px rgba(230,62,31,0)'],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Bottom marquee */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-[rgba(250,250,248,0.12)] py-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <div className="flex whitespace-nowrap" style={{ animation: 'marquee 25s linear infinite' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="inline-block"
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: 'rgba(250,250,248,0.25)',
                textTransform: 'uppercase',
                paddingRight: '3rem',
              }}
            >
              · Events crafted to be remembered · Brand experience consulting · THE LEVEL STUDIO · 品牌沈浸體驗 · Evan Chang · Taipei ·
            </span>
          ))}
        </div>
      </motion.div>

    </>
  );
}

type Phase = 'idle' | 'igniting' | 'flashing' | 'tearing';

export default function HookScreen({ onEnter }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const handleEnter = useCallback(() => {
    if (phase !== 'idle') return;
    setPhase('igniting');
    // T+150: flash
    setTimeout(() => setPhase('flashing'), 150);
    // T+230: tear
    setTimeout(() => setPhase('tearing'), 230);
    // T+1330: unmount
    setTimeout(() => onEnter(), 1330);
  }, [onEnter, phase]);

  const igniting = phase !== 'idle';
  const tearing = phase === 'tearing';
  const flashing = phase === 'flashing' || phase === 'tearing';

  return (
    <div
      className="fixed inset-0 z-[100] cursor-pointer select-none overflow-hidden"
      onClick={handleEnter}
    >
      {/* Left tear panel */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: 'inset(0 50% 0 0)',
          transform: tearing ? 'translateX(-105%) rotate(-2deg)' : 'none',
          transition: tearing ? 'transform 1.1s cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
        }}
      >
        <HookContent mounted={mounted} igniting={igniting} />
      </div>

      {/* Right tear panel */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: 'inset(0 0 0 50%)',
          transform: tearing ? 'translateX(105%) rotate(2deg)' : 'none',
          transition: tearing ? 'transform 1.1s cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
        }}
      >
        <HookContent mounted={mounted} igniting={igniting} />
      </div>

      {/* Pre-tear orange flash overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: '#E63E1F',
          opacity: flashing && !tearing ? 1 : 0,
          transition: 'opacity 60ms linear',
          zIndex: 50,
        }}
      />
    </div>
  );
}
