'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import LetterIconSwap from './LetterIconSwap';

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function getScatter(index: number) {
  return {
    x: (seededRandom(index * 7 + 1) - 0.5) * 320,
    y: (seededRandom(index * 7 + 2) - 0.5) * 200,
    rotate: (seededRandom(index * 7 + 3) - 0.5) * 20,
  };
}

// Words as units — each word scatters and assembles together
const WORDS = [
  { text: 'THE', iconAt: -1, icons: [] },
  { text: 'LEVEL', iconAt: 0, icons: ['◆', '✦', '◈', '⬥'] },   // L → icon
  { text: 'STUDIO', iconAt: 2, icons: ['★', '●', '✧', '◉'] },  // U → icon
];

export default function Hero() {
  const scatterData = useMemo(
    () => WORDS.map((_, i) => getScatter(i)),
    []
  );

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] -mt-14 flex items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {/* Background handled by UniverseCanvas */}

      {/* ── Brand name — words scatter → assemble (after load) ── */}
      <div className="relative z-10 w-full max-w-[1200px] px-6 md:px-10">
        {(<>
        <h1
          className="flex flex-wrap justify-center gap-x-[0.3em]"
          style={{
            fontSize: 'clamp(40px, 7vw, 100px)',
            fontWeight: 600,
            fontFamily: 'var(--font-playfair), var(--font-noto-serif-tc), serif',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: '#141413',
          }}
        >
          {WORDS.map((word, wi) => (
            <motion.span
              key={wi}
              className="inline-flex whitespace-nowrap"
              initial={{
                x: scatterData[wi].x,
                y: scatterData[wi].y,
                rotate: scatterData[wi].rotate,
                opacity: 0,
              }}
              animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 80,
                damping: 16,
                delay: 0.4 + wi * 0.2,
              }}
            >
              {word.text.split('').map((char, ci) => {
                if (ci === word.iconAt) {
                  return (
                    <LetterIconSwap
                      key={ci}
                      icons={word.icons}
                      interval={3800 + wi * 400}
                    />
                  );
                }
                return <span key={ci}>{char}</span>;
              })}
            </motion.span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mt-6 md:mt-8"
          style={{
            fontSize: '15px',
            color: '#6B6B67',
            fontFamily: 'var(--font-geist), var(--font-noto-sans-tc), sans-serif',
            letterSpacing: '0.04em',
          }}
        >
          Events crafted to be remembered.
        </motion.p>
        </>
        )}
      </div>

      {/* ── Evan Chang — bottom right ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.6 }}
        className="absolute bottom-8 right-6 md:right-10"
        style={{
          fontSize: '10px',
          letterSpacing: '0.25em',
          color: '#A8A8A3',
          fontFamily: 'var(--font-departure-mono), monospace',
          textTransform: 'uppercase',
        }}
      >
        Evan Chang
      </motion.p>

      {/* ── Scroll to descend ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span
          style={{
            fontSize: '9px',
            letterSpacing: '0.3em',
            color: '#A8A8A3',
            fontFamily: 'var(--font-departure-mono), monospace',
            textTransform: 'uppercase',
          }}
        >
          Scroll to descend
        </span>
        <motion.span className="block w-px h-6" style={{ background: '#A8A8A3', opacity: 0.5 }} />
        <motion.span
          className="block w-1 h-1 rounded-full"
          style={{ background: '#A8A8A3' }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
