'use client';

import { useState, useEffect, useRef, type CSSProperties } from 'react';
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
const ENTER_DURATION  = 1000;
const LOAD_DURATION   = 2400;
const HOLD_DURATION   = 380;
const EXPAND_DURATION = 820;

type Phase = 'entering' | 'loading' | 'expanding' | 'done';
type Corner = 'tl' | 'tr' | 'bl' | 'br';

interface Props {
  onComplete: () => void;
}

export default function LoadingIntro({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>('entering');
  const [progress, setProgress] = useState(0);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setPhase('loading'), ENTER_DURATION);
    return () => clearTimeout(t);
  }, []);

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

  useEffect(() => {
    if (phase === 'loading' && progress >= 1) {
      const t = setTimeout(() => setPhase('expanding'), HOLD_DURATION);
      return () => clearTimeout(t);
    }
  }, [phase, progress]);

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

          {/* Star dust */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(92,225,255,0.22) 0.5px, transparent 0.5px)',
              backgroundSize: '88px 88px',
            }}
          />

          {/* Full-screen scan line sweep */}
          <motion.div
            aria-hidden
            className="absolute left-0 right-0 h-px pointer-events-none z-40"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(92,225,255,0.25) 15%, #5CE1FF 50%, rgba(92,225,255,0.25) 85%, transparent)',
              boxShadow: '0 0 20px rgba(92,225,255,0.75), 0 0 2px rgba(92,225,255,1)',
            }}
            initial={{ top: '0%' }}
            animate={{ top: ['0%', '100%'] }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              ease: 'linear',
              delay: 0.8,
            }}
          />

          {/* Horizontal thin crosshair line through center */}
          <div
            aria-hidden
            className="absolute top-1/2 left-0 right-0 h-px bg-[#5CE1FF]/[0.06] pointer-events-none"
          />
          {/* Vertical thin crosshair line through center */}
          <div
            aria-hidden
            className="absolute left-1/2 top-0 bottom-0 w-px bg-[#5CE1FF]/[0.06] pointer-events-none"
          />

          {/* Center viewport frame + radar */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width:  'min(560px, 72vw)',
              height: 'min(340px, 44vw)',
            }}
            animate={{ scale: expanding ? 1.22 : 1 }}
            transition={{ duration: EXPAND_DURATION / 1000, ease: [0.65, 0, 0.35, 1] }}
          >
            {/* Radar conic sweep inside frame */}
            <motion.div
              aria-hidden
              className="absolute inset-0 rounded-[1px] overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55, rotate: 360 }}
              transition={{
                opacity: { duration: 1, delay: 0.9, ease: 'easeOut' },
                rotate:  { duration: 5, repeat: Infinity, ease: 'linear', delay: 0.9 },
              }}
              style={{
                background:
                  'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(92,225,255,0.00) 30deg, rgba(92,225,255,0.22) 85deg, transparent 95deg)',
              }}
            />

            {/* Concentric range rings */}
            <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[0.3, 0.55, 0.82].map((s, i) => (
                <motion.div
                  key={s}
                  className="absolute rounded-full border border-[#5CE1FF]/10"
                  style={{ width: `${s * 100}%`, height: `${s * 100}%` }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.7 + i * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              ))}
            </div>

            {/* Four corner brackets */}
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

            {/* Center crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-3 h-3">
                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#5CE1FF]/50" />
                <div className="absolute top-1/2 left-0 w-full h-px -translate-y-1/2 bg-[#5CE1FF]/50" />
              </div>
            </div>
          </motion.div>

          {/* Wordmark + progress */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 text-center z-20"
            style={{
              top:   'calc(50% + min(210px, 27vw))',
              width: 'min(420px, 72vw)',
            }}
            initial={{ opacity: 0, filter: 'blur(16px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.55, ease: 'easeOut' }}
          >
            <p
              className="text-[#5CE1FF] mb-6 uppercase"
              style={{
                fontFamily:    'var(--font-mono), monospace',
                fontSize:      'clamp(1rem, 1.5vw, 1.375rem)',
                letterSpacing: '0.4em',
                textShadow:    '0 0 18px rgba(92,225,255,0.6), 0 0 4px rgba(92,225,255,0.9)',
              }}
            >
              EVAN&nbsp;&nbsp;·&nbsp;&nbsp;CHANG
            </p>

            <div className="relative h-px w-full bg-white/[0.06] overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-[#5CE1FF]"
                style={{
                  width:      `${progress * 100}%`,
                  boxShadow:  '0 0 12px rgba(92,225,255,0.9), 0 0 3px rgba(92,225,255,1)',
                  transition: 'width 60ms linear',
                }}
              />
            </div>

            <div className="flex justify-between mt-3 font-label text-[0.5rem]">
              <span className="text-white/30">[ LOADING SIGNAL ]</span>
              <span className="text-[#5CE1FF]/70 tabular-nums">
                {String(Math.round(progress * 100)).padStart(3, '0')} / 100
              </span>
            </div>
          </motion.div>

          {/* Boot log with glitch text — right bottom */}
          <div className="absolute bottom-10 right-10 text-right max-w-[60vw] z-30">
            <p className="font-label text-[0.5rem] text-white/20 mb-3">
              [ BOOT_LOG ]
            </p>
            <div className="space-y-[0.35rem] font-label text-[0.625rem]">
              {BOOT_LINES.slice(0, visibleLines).map((line, i) => {
                const isActive = i === visibleLines - 1 && progress < 1;
                return (
                  <BootLine
                    key={i}
                    text={line}
                    active={isActive}
                  />
                );
              })}
            </div>
          </div>

          {/* ── HUD corner readouts (static) ─────────── */}
          <div className="absolute top-8 left-8 font-label text-[0.5rem] text-white/35 leading-[1.7] z-30">
            <p>[ SYS ]&nbsp;&nbsp;SIG_ARCH v1.0</p>
            <p>[ NODE ] TPE / UTC+8</p>
            <p>[ LAT ]&nbsp;&nbsp;25.0330°N</p>
            <p>[ LNG ]&nbsp;&nbsp;121.5654°E</p>
          </div>

          <div className="absolute top-8 right-8 text-right font-label text-[0.5rem] text-white/35 leading-[1.7] z-30">
            <p>CONN&nbsp;&nbsp;&nbsp;[ <span className="text-[#5CE1FF]/80">ACTIVE</span> ]</p>
            <p>CASES&nbsp;&nbsp;<span className="text-[#5CE1FF]/80">50+</span></p>
            <p>REACH&nbsp;&nbsp;<span className="text-[#5CE1FF]/80">100K+</span></p>
            <p>LOCAL&nbsp;&nbsp;<LocalClock /></p>
          </div>

          <div className="absolute bottom-10 left-10 font-label text-[0.5rem] leading-[1.7] z-30">
            <p className="text-white/25">[ CHANNEL 01 ]</p>
            <p className="text-[#5CE1FF]/60 mt-1">{phase.toUpperCase()}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Boot log line with glitch-decode reveal ─────────────
function BootLine({ text, active }: { text: string; active: boolean }) {
  const [display, setDisplay] = useState(text);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    const chars = '!<>-_\\/[]{}—=+*^?#$%&';
    let step = 0;
    const total = Math.min(text.length, 20);
    const id = setInterval(() => {
      step += 1;
      const out = text
        .split('')
        .map((ch, idx) => {
          if (ch === ' ') return ' ';
          if (idx < step) return ch;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      setDisplay(out);
      if (step >= total) {
        clearInterval(id);
        setDisplay(text);
        done.current = true;
      }
    }, 22);
    return () => clearInterval(id);
  }, [text]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={active ? 'text-white' : 'text-white/40'}
    >
      {display}
      {active && (
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
}

// ── Real local time HH:MM:SS (updates every second) ────
function LocalClock() {
  const [now, setNow] = useState<string>('');
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      const hh = d.getHours().toString().padStart(2, '0');
      const mm = d.getMinutes().toString().padStart(2, '0');
      const ss = d.getSeconds().toString().padStart(2, '0');
      return `${hh}:${mm}:${ss}`;
    };
    setNow(fmt());
    const id = setInterval(() => setNow(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="text-[#5CE1FF]/80 tabular-nums">{now || '--:--:--'}</span>;
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
