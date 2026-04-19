// components/home/LatestTransmission.tsx
// Editorial-minimal transmission. Full-viewport, one giant Fraunces serif line
// as hero statement, small mono TX timestamp + label floating in upper-left.
// No card wrapper, no box — just typography in negative space.
'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  locale: 'zh-TW' | 'en-US';
}

const SIGNAL = {
  ts: '2026.04.19 22:40',
  // Deliberately editorial — same cadence as dialect/ichiki heroes.
  lineZh: '做一場活動的意義，在結案後還被人記得多久。',
  lineEn: 'An event is only worth what people remember of it a year later.',
  sourceZh: '— TRANSMISSION Nº 17 · EDITOR’S SIGNAL',
  sourceEn: '— Transmission №17 · Editor’s signal',
};

export default function LatestTransmission({ locale }: Props) {
  const zh = locale === 'zh-TW';
  const fullLine = zh ? SIGNAL.lineZh : SIGNAL.lineEn;
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const reducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRevealed(true);
      return;
    }
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Split into words; each word fades up with a stagger.
  const words = fullLine.split(/(\s+)/);

  return (
    <section
      ref={ref}
      aria-label="Latest transmission"
      className="relative px-6 md:px-16"
      style={{
        minHeight: '88vh',
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="w-full max-w-[1200px] mx-auto">
        {/* Top meta — absolute corner floating */}
        <div
          className="flex items-baseline gap-3 mb-10 md:mb-14"
          style={{ fontFamily: 'var(--font-mono), monospace' }}
        >
          <span
            className="text-[10px] tracking-[0.4em] uppercase"
            style={{ color: '#5DD3E3' }}
          >
            § 03 · TRANSMISSION
          </span>
          <span aria-hidden style={{ color: 'rgba(250,250,248,0.2)' }}>/</span>
          <span
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{ color: 'rgba(250,250,248,0.55)' }}
          >
            TX · {SIGNAL.ts}
          </span>
        </div>

        {/* Giant serif statement */}
        <p
          className="max-w-[22ch]"
          style={{
            fontFamily: 'var(--font-fraunces), var(--font-noto-serif-tc), serif',
            color: '#FAFAF8',
            fontWeight: 400,
            fontSize: 'clamp(40px, 6.5vw, 104px)',
            letterSpacing: '-0.025em',
            lineHeight: 1.02,
          }}
        >
          {words.map((w, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 40}ms, transform 800ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 40}ms`,
                whiteSpace: 'pre',
              }}
            >
              {w}
            </span>
          ))}
        </p>

        {/* Signature */}
        <p
          className="mt-14 text-[10px] tracking-[0.3em] uppercase"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            color: '#E63E1F',
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(12px)',
            transition:
              'opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) 800ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) 800ms',
          }}
        >
          {zh ? SIGNAL.sourceZh : SIGNAL.sourceEn}
        </p>
      </div>
    </section>
  );
}
