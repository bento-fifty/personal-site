'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onEnter: () => void;
}

export default function HookScreen({ onEnter }: Props) {
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const handleEnter = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => onEnter(), 1000);
  }, [onEnter, exiting]);

  return (
    <div
      className="fixed inset-0 z-[100] cursor-pointer select-none overflow-hidden"
      onClick={handleEnter}
      style={{
        background: '#0A0A0C',
        clipPath: exiting ? 'circle(0% at 50% 50%)' : 'circle(150% at 50% 50%)',
        transition: exiting ? 'clip-path 0.95s cubic-bezier(0.65, 0, 0.35, 1)' : 'none',
      }}
    >
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 55% 55% at 50% 50%, transparent 0%, rgba(0,0,0,0.6) 100%)' }} />

      {/* ── 等級 — monumental center ── */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: mounted ? 1 : 0, scale: mounted ? 1 : 0.92 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-noto-serif-tc), serif',
            fontSize: 'clamp(120px, 28vw, 420px)',
            fontWeight: 900,
            color: '#C23B22',
            lineHeight: 0.9,
            letterSpacing: '-0.03em',
            textAlign: 'center',
          }}
        >
          等級
        </h1>
      </motion.div>

      {/* ── Scattered text — Utopia-style ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '9px', letterSpacing: '0.25em', color: 'rgba(250,250,248,0.2)', textTransform: 'uppercase' }}>
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

      {/* ── Top bar ── */}
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

      {/* ── ENTER — bottom center ── */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <motion.span
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '11px',
            letterSpacing: '0.5em',
            color: 'rgba(250,250,248,0.5)',
            textTransform: 'uppercase',
          }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Enter
        </motion.span>
        <motion.div
          className="w-px bg-[rgba(250,250,248,0.15)]"
          animate={{ height: ['16px', '28px', '16px'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: '#C23B22' }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
            boxShadow: ['0 0 0px rgba(194,59,34,0)', '0 0 16px rgba(194,59,34,0.4)', '0 0 0px rgba(194,59,34,0)'],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* ── Bottom marquee — Utopia style ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-[rgba(250,250,248,0.06)] py-2"
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
                fontSize: '8px',
                letterSpacing: '0.2em',
                color: 'rgba(250,250,248,0.12)',
                textTransform: 'uppercase',
                paddingRight: '3rem',
              }}
            >
              · Events crafted to be remembered · Brand experience consulting · THE LEVEL STUDIO · 品牌沈浸體驗 · Evan Chang · Taipei ·
            </span>
          ))}
        </div>
      </motion.div>

      {/* ── Corner: 等級 small — like Utopia's 東京 corner ── */}
      <motion.div
        className="absolute bottom-8 right-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ delay: 1.0, duration: 1 }}
      >
        <span
          style={{
            fontFamily: 'var(--font-noto-serif-tc), serif',
            fontSize: '16px',
            fontWeight: 700,
            color: '#C23B22',
          }}
        >
          等級
        </span>
      </motion.div>
    </div>
  );
}
