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
    // Trigger entrance animations after mount
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const handleEnter = useCallback(() => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => onEnter(), 900);
  }, [onEnter, exiting]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center cursor-pointer select-none"
      // justify-center → manual padding to match Hero's mainY = H * 0.44
      onClick={handleEnter}
      style={{
        background: '#0A0A0C',
        clipPath: exiting ? 'circle(0% at 50% 50%)' : 'circle(150% at 50% 50%)',
        transition: exiting ? 'clip-path 0.85s cubic-bezier(0.65, 0, 0.35, 1)' : 'none',
      }}
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Corner marks */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute top-7 left-7 w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1">
          <path d="M0 12 L0 0 L12 0" />
        </svg>
        <svg className="absolute top-7 right-7 w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1">
          <path d="M8 0 L20 0 L20 12" />
        </svg>
        <svg className="absolute bottom-7 left-7 w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1">
          <path d="M0 8 L0 20 L12 20" />
        </svg>
        <svg className="absolute bottom-7 right-7 w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1">
          <path d="M8 20 L20 20 L20 8" />
        </svg>
      </div>

      {/* Coordinate — top left */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute top-9 left-9"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '9px',
          letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.15)',
        }}
      >
        25.03°N 121.57°E
      </motion.p>

      {/* Brand — top right */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ delay: 0.7, duration: 1 }}
        className="absolute top-9 right-9"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '9px',
          letterSpacing: '0.25em',
          color: 'rgba(255,255,255,0.15)',
          textTransform: 'uppercase',
        }}
      >
        The Level Studio
      </motion.p>

      {/* ── Central hook ── */}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 24 }}
        transition={{ delay: 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-center px-8 max-w-[780px] pt-[38vh]"
        style={{
          fontFamily: 'var(--font-heading), Georgia, serif',
          fontSize: 'clamp(26px, 4.5vw, 54px)',
          fontWeight: 400,
          fontStyle: 'italic',
          color: 'rgba(255,255,255,0.88)',
          letterSpacing: '-0.01em',
          lineHeight: 1.25,
        }}
      >
        Where moments become monuments.
      </motion.h2>

      {/* ── ENTER — clearly visible ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5"
      >
        {/* ENTER text */}
        <motion.span
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '13px',
            letterSpacing: '0.6em',
            color: 'rgba(255,255,255,0.7)',
            textTransform: 'uppercase',
          }}
          animate={{ opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Enter
        </motion.span>

        {/* Vertical breathing line */}
        <motion.div
          className="w-px bg-[rgba(255,255,255,0.15)]"
          animate={{ height: ['20px', '32px', '20px'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Deep red pulse dot */}
        <motion.div
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: 'rgba(155,44,44,0.7)' }}
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.5, 1, 0.5],
            boxShadow: [
              '0 0 0px rgba(155,44,44,0)',
              '0 0 16px rgba(155,44,44,0.4)',
              '0 0 0px rgba(155,44,44,0)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Evan Chang — bottom right */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        transition={{ delay: 0.9, duration: 1 }}
        className="absolute bottom-9 right-9"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: '9px',
          letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.12)',
          textTransform: 'uppercase',
        }}
      >
        Evan Chang
      </motion.p>
    </div>
  );
}
