'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * Footer editorial wordmark with three effects:
 *   1. One-time "signature draw" on viewport enter — each letter staggers in
 *      with y/blur/opacity like a signature being put down
 *   2. Continuous slow period pulse — the trailing "." keeps a heartbeat
 *   3. Periodic letter glitch — every ~7s one random letter briefly becomes
 *      a scrambled character for ~120ms, then resolves. Visible ambient
 *      motion without being constant.
 */

const GLITCH_CHARS = '!<>/#@%*&'.split('');
const LINE_ONE = 'Evan'.split('');
const LINE_TWO = 'Chang'.split('');
const TOTAL_LETTERS = LINE_ONE.length + LINE_TWO.length;

export default function FooterWordmark() {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  const perLetter = 0.07;
  const introDelay = 0.1;
  const periodDelay =
    introDelay + TOTAL_LETTERS * perLetter + 0.15;

  // ── Periodic letter glitch scramble ───────────────
  const [glitch, setGlitch] = useState<{ idx: number; char: string } | null>(null);
  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    let nextTimer: ReturnType<typeof setTimeout>;
    let resetTimer: ReturnType<typeof setTimeout>;

    const fire = () => {
      if (cancelled) return;
      const idx  = Math.floor(Math.random() * TOTAL_LETTERS);
      const char = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      setGlitch({ idx, char });
      resetTimer = setTimeout(() => !cancelled && setGlitch(null), 120);
      nextTimer  = setTimeout(fire, 2800 + Math.random() * 2200);
    };

    // Wait for intro to finish before starting
    const kickoff = setTimeout(fire, (periodDelay + 1) * 1000);

    return () => {
      cancelled = true;
      clearTimeout(kickoff);
      clearTimeout(nextTimer);
      clearTimeout(resetTimer);
    };
  }, [inView, periodDelay]);

  const resolveChar = (globalIdx: number, original: string) =>
    glitch?.idx === globalIdx ? glitch.char : original;

  return (
    <h3
      ref={ref}
      className="text-white leading-[0.92] mb-6"
      style={{
        fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
        fontWeight:          500,
        fontSize:            'clamp(2.5rem, 5vw, 4rem)',
        letterSpacing:       '-0.01em',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {/* Evan */}
      <span className="block">
        {LINE_ONE.map((ch, i) => (
          <LetterSpan
            key={`l1-${i}`}
            ch={resolveChar(i, ch)}
            isGlitched={glitch?.idx === i}
            inView={inView}
            delay={introDelay + i * perLetter}
          />
        ))}
      </span>

      {/* Chang. */}
      <span className="block">
        {LINE_TWO.map((ch, i) => {
          const globalIdx = LINE_ONE.length + i;
          return (
            <LetterSpan
              key={`l2-${i}`}
              ch={resolveChar(globalIdx, ch)}
              isGlitched={glitch?.idx === globalIdx}
              inView={inView}
              delay={introDelay + globalIdx * perLetter}
            />
          );
        })}
        {/* Period — continuous slow pulse */}
        <motion.span
          aria-hidden
          className="inline-block text-[#5CE1FF]"
          style={{
            textShadow:
              '0 0 20px rgba(92,225,255,0.85), 0 0 4px rgba(92,225,255,1)',
          }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: [0.45, 1, 0.45] } : {}}
          transition={{
            duration: 3.2,
            delay:    periodDelay,
            repeat:   Infinity,
            ease:     'easeInOut',
          }}
        >
          .
        </motion.span>
      </span>
    </h3>
  );
}

function LetterSpan({
  ch,
  isGlitched,
  inView,
  delay,
}: {
  ch: string;
  isGlitched: boolean;
  inView: boolean;
  delay: number;
}) {
  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{
        duration: 0.85,
        ease:     [0.22, 1, 0.36, 1],
        delay,
      }}
      style={{
        color:      isGlitched ? '#5CE1FF' : undefined,
        textShadow: isGlitched
          ? '0 0 18px rgba(92,225,255,0.9), 0 0 4px rgba(92,225,255,1)'
          : undefined,
      }}
    >
      {ch}
    </motion.span>
  );
}
