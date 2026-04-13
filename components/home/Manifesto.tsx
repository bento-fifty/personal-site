'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [60, -40]);
  const kanjiOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.06, 0.06, 0]);
  const kanjiScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 1.05]);

  return (
    <section ref={ref} className="relative min-h-[80vh] flex flex-col justify-center overflow-hidden" style={{ background: 'transparent' }}>

      {/* 策劃 — giant background kanji (like Utopia's 東京) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ opacity: kanjiOpacity, scale: kanjiScale }}
      >
        <span
          style={{
            fontFamily: 'var(--font-noto-serif-tc), serif',
            fontSize: 'clamp(200px, 30vw, 500px)',
            fontWeight: 900,
            color: '#141413',
            lineHeight: 1,
            letterSpacing: '-0.05em',
          }}
        >
          策劃
        </span>
      </motion.div>

      {/* Content layer */}
      <motion.div
        className="relative z-10 max-w-[900px] mx-auto px-8 md:px-16"
        style={{ y: textY }}
      >
        {/* Section label */}
        <p
          className="mb-8"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '9px',
            letterSpacing: '0.3em',
            color: 'rgba(79,70,229,0.4)',
            textTransform: 'uppercase',
          }}
        >
          [ Philosophy ]
        </p>

        {/* English manifesto — large serif */}
        <h2
          style={{
            fontFamily: 'var(--font-heading), Georgia, serif',
            fontSize: 'clamp(24px, 3.5vw, 48px)',
            fontWeight: 400,
            color: '#141413',
            lineHeight: 1.35,
            letterSpacing: '-0.01em',
          }}
        >
          We don&apos;t plan events.
          <br />
          We architect moments that reshape
          <br />
          how people{' '}
          <em style={{ color: '#9B2C2C' }}>feel</em>,{' '}
          <em style={{ color: '#4F46E5' }}>think</em>,{' '}
          and <em>remember</em>.
        </h2>

        {/* Chinese subtitle */}
        <p
          className="mt-6"
          style={{
            fontFamily: 'var(--font-noto-serif-tc), serif',
            fontSize: 'clamp(14px, 1.8vw, 20px)',
            color: 'rgba(20,20,19,0.4)',
            lineHeight: 1.6,
          }}
        >
          我們不只是策劃活動。我們建構改變人們感受、思考與記憶方式的時刻。
        </p>
      </motion.div>

      {/* ── Marquee ticker ── */}
      <div className="mt-20 overflow-hidden border-y" style={{ borderColor: 'rgba(79,70,229,0.08)' }}>
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="inline-block py-3"
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: '10px',
                letterSpacing: '0.25em',
                color: 'rgba(79,70,229,0.3)',
                textTransform: 'uppercase',
                paddingRight: '4rem',
              }}
            >
              Events crafted to be remembered · Brand experience consulting · THE LEVEL STUDIO · 品牌沈浸體驗 · Evan Chang · Taipei ·{' '}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
