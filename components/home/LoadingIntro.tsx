'use client';

import { useState, useEffect, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_LINES = [
  '> INIT EVAN_CHANG.SYS',
  '> LOADING EVENTS_DB ............. OK',
  '> PROJECTS ...................... 50+',
  '> AUDIENCE .............. 100,000+',
  '> BRAND_PARTNERS .... ACTIVE',
  '> SIGNAL_ARCHITECTURE ........ RUN',
];

// Phase timing (ms)
const ENTER_DURATION  = 1000;  // brackets + wordmark fade-in window
const LOAD_DURATION   = 2400;  // progress bar fill window
const HOLD_DURATION   = 380;   // pause at 100% before expand
const EXPAND_DURATION = 820;   // overlay fade-out / frame scale-up

type Phase = 'entering' | 'loading' | 'expanding' | 'done';
type Corner = 'tl' | 'tr' | 'bl' | 'br';

interface Props {
  onComplete: () => void;
}

export default function LoadingIntro({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('entering');
  const [progress, setProgress] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);

  // entering → loading
  useEffect(() => {
    const t = setTimeout(() => setPhase('loading'), ENTER_DURATION);
    return () => clearTimeout(t);
  }, []);

  // loading: progress bar + boot log, driven by a single rAF-style interval
  useEffect(() => {
    if (phase !== 'loading') return;

    const start = Date.now();
    const lineCount = BOOT_LINES.length;

    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / LOAD_DURATION, 1);
      setProgress(p);
      setVisibleLines(Math.min(Math.floor(p * lineCount) + 1, lineCount));
      if (p >= 1) clearInterval(id);
    }, 16);

    return () => clearInterval(id);
  }, [phase]);

  // loading → expanding
  useEffect(() => {
    if (phase === 'loading' && progress >= 1) {
      const t = setTimeout(() => setPhase('expanding'), HOLD_DURATION);
      return () => clearTimeout(t);
    }
  }, [phase, progress]);

  // expanding → done
  useEffect(() => {
    if (phase !== 'expanding') return;
    const t = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, EXPAND_DURATION);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  const expanding = phase === 'expanding';

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="loading-intro"
          className="fixed inset-0 z-[60] bg-[#080808] overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: expanding ? 0 : 1 }}
          transition={{ duration: EXPAND_DURATION / 1000, ease: [0.65, 0, 0.35, 1] }}
        >
          {/* Top glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_0%,rgba(92,225,255,0.14),transparent_60%)]" />

          {/* Faint star dust */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(92,225,255,0.22) 0.5px, transparent 0.5px)',
              backgroundSize: '88px 88px',
            }}
          />

          {/* Center viewport frame (four corner brackets) */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: 'min(560px, 72vw)',
              height: 'min(340px, 44vw)',
            }}
            animate={{ scale: expanding ? 1.22 : 1 }}
            transition={{ duration: EXPAND_DURATION / 1000, ease: [0.65, 0, 0.35, 1] }}
          >
            {(['tl', 'tr', 'bl', 'br'] as const).map((pos, i) => (
              <motion.div
                key={pos}
                className="absolute w-11 h-11"
                style={cornerPos(pos)}
                initial={{ opacity: 0, scale: 0.4, ...cornerOffset(pos) }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                transition={{
                  duration: 0.65,
                  delay: 0.15 + i * 0.09,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                <div
                  className="absolute w-full h-px bg-[#5CE1FF]"
                  style={{
                    ...(pos.includes('t') ? { top: 0 } : { bottom: 0 }),
                    boxShadow:
                      '0 0 10px rgba(92,225,255,0.7), 0 0 2px rgba(92,225,255,1)',
                  }}
                />
                <div
                  className="absolute w-px h-full bg-[#5CE1FF]"
                  style={{
                    ...(pos.includes('l') ? { left: 0 } : { right: 0 }),
                    boxShadow:
                      '0 0 10px rgba(92,225,255,0.7), 0 0 2px rgba(92,225,255,1)',
                  }}
                />
              </motion.div>
            ))}

            {/* Center hairline crosshair — a small, confident detail */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-3 h-3">
                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#5CE1FF]/30" />
                <div className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2 bg-[#5CE1FF]/30" />
              </div>
            </div>
          </motion.div>

          {/* Wordmark + progress below frame */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 text-center"
            style={{
              top: 'calc(50% + min(210px, 27vw))',
              width: 'min(420px, 72vw)',
            }}
            initial={{ opacity: 0, filter: 'blur(16px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.55, ease: 'easeOut' }}
          >
            <p
              className="font-label text-[#5CE1FF] text-[0.6875rem] mb-5"
              style={{
                textShadow: '0 0 14px rgba(92,225,255,0.55)',
                letterSpacing: '0.38em',
              }}
            >
              EVAN&nbsp;&nbsp;·&nbsp;&nbsp;CHANG
            </p>

            {/* Progress bar */}
            <div className="relative h-px w-full bg-white/[0.06] overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-[#5CE1FF]"
                style={{
                  width: `${progress * 100}%`,
                  boxShadow:
                    '0 0 12px rgba(92,225,255,0.9), 0 0 3px rgba(92,225,255,1)',
                  transition: 'width 60ms linear',
                }}
              />
            </div>

            {/* Progress labels */}
            <div className="flex justify-between mt-3 font-label text-[0.5rem]">
              <span className="text-white/30">[ LOADING SIGNAL ]</span>
              <span className="text-[#5CE1FF]/70 tabular-nums">
                {String(Math.round(progress * 100)).padStart(3, '0')} / 100
              </span>
            </div>
          </motion.div>

          {/* Boot log — right bottom */}
          <div className="absolute bottom-10 right-10 text-right max-w-[60vw]">
            <p className="font-label text-[0.5rem] text-white/20 mb-3">
              [ BOOT_LOG ]
            </p>
            <div className="space-y-[0.35rem] font-label text-[0.625rem]">
              {BOOT_LINES.slice(0, visibleLines).map((line, i) => {
                const isActive = i === visibleLines - 1 && progress < 1;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className={isActive ? 'text-white' : 'text-white/40'}
                  >
                    {line}
                    {isActive && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className="ml-1 text-[#5CE1FF]"
                      >
                        █
                      </motion.span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Sys status — left bottom */}
          <div className="absolute bottom-10 left-10 font-label text-[0.5rem] leading-relaxed">
            <p className="text-white/25">[ SIG_ARCH v1.0 ]</p>
            <p className="text-[#5CE1FF]/60 mt-1">{phase.toUpperCase()}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── helpers ────────────────────────────────────────────
function cornerPos(pos: Corner): CSSProperties {
  return {
    ...(pos.includes('t') ? { top: 0 } : { bottom: 0 }),
    ...(pos.includes('l') ? { left: 0 } : { right: 0 }),
  };
}

function cornerOffset(pos: Corner): { x: number; y: number } {
  const d = 18;
  return {
    x: pos.includes('l') ? -d : d,
    y: pos.includes('t') ? -d : d,
  };
}
