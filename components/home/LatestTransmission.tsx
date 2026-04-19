// components/home/LatestTransmission.tsx
// Typewriter reveal + spring-in DECLASSIFIED stamp on scroll intersect.
// Flame caret blinks while typing; stamp overshoots then settles at -6deg.
'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  locale: 'zh-TW' | 'en-US';
}

const SIGNAL = {
  ts: '2026.04.19 22:40',
  lineZh: 'Stage 1 dossier spine 已部署 — header / footer / chrome 統一',
  lineEn: 'Stage 1 dossier spine deployed — header / footer / chrome unified',
};

export default function LatestTransmission({ locale }: Props) {
  const zh = locale === 'zh-TW';
  const fullLine = zh ? SIGNAL.lineZh : SIGNAL.lineEn;

  const [typed, setTyped] = useState('');
  const [stamped, setStamped] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const startedRef = useRef(false);
  const doneTypingRef = useRef(false);

  useEffect(() => {
    const reducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTyped(fullLine);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStamped(true);
      return;
    }
    if (!ref.current) return;
    const el = ref.current;
    let typeId: ReturnType<typeof setInterval> | null = null;
    let stampTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          let i = 0;
          typeId = setInterval(() => {
            i += 1;
            setTyped(fullLine.slice(0, i));
            if (i >= fullLine.length) {
              if (typeId) clearInterval(typeId);
              doneTypingRef.current = true;
              stampTimeoutId = setTimeout(() => setStamped(true), 180);
            }
          }, 38);
          io.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (typeId) clearInterval(typeId);
      if (stampTimeoutId) clearTimeout(stampTimeoutId);
    };
  }, [fullLine]);

  const showCaret = typed.length < fullLine.length;

  return (
    <section
      ref={ref}
      aria-label="Latest transmission"
      className="px-5 md:px-8 py-16"
      style={{ background: 'transparent' }}
    >
      <style>{`
        @keyframes tx-caret-blink {
          0%, 55% { opacity: 1; }
          56%, 100% { opacity: 0; }
        }
        @keyframes stamp-press {
          0%   { transform: rotate(-6deg) scale(1); }
          50%  { transform: rotate(-6deg) scale(0.93); }
          100% { transform: rotate(-6deg) scale(1); }
        }
      `}</style>
      <div className="max-w-5xl mx-auto">
        <p
          className="mb-6 text-[10px] tracking-[0.3em] uppercase"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            color: 'rgba(250,250,248,0.45)',
          }}
        >
          § 03 · LATEST TRANSMISSION
        </p>
        <div
          className="relative flex flex-col md:flex-row md:items-baseline gap-3 md:gap-6 py-6 px-5 md:px-6 group"
          style={{
            border: '1px solid rgba(250,250,248,0.12)',
            background: 'rgba(11,16,38,0.35)',
          }}
        >
          <span
            className="text-[10px] tracking-[0.28em] uppercase whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              color: '#5DD3E3',
            }}
          >
            TX · {SIGNAL.ts}
          </span>

          <span
            className="flex-1 text-[14px] md:text-[16px]"
            style={{
              fontFamily: 'var(--font-noto-serif-tc), var(--font-fraunces), serif',
              color: 'rgba(250,250,248,0.88)',
              lineHeight: 1.6,
              minHeight: '1.6em',
            }}
            aria-label={fullLine}
          >
            {typed}
            {showCaret && (
              <span
                aria-hidden
                style={{
                  display: 'inline-block',
                  width: '0.55em',
                  height: '1em',
                  background: '#E63E1F',
                  marginLeft: 2,
                  verticalAlign: 'text-bottom',
                  animation: 'tx-caret-blink 0.85s steps(1) infinite',
                }}
              />
            )}
          </span>

          <span
            aria-label="DECLASSIFIED 2027.Q1"
            className="group-hover:animate-[stamp-press_0.35s_ease-out]"
            style={{
              display: 'inline-block',
              border: '1.5px solid #E63E1F',
              color: '#E63E1F',
              padding: '3px 9px',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 9,
              letterSpacing: '0.3em',
              fontWeight: 700,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              transform: stamped
                ? 'rotate(-6deg) scale(1)'
                : 'rotate(-22deg) scale(0.3)',
              opacity: stamped ? 1 : 0,
              transition:
                'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.28s ease-out',
            }}
          >
            Declassified 2027.Q1
          </span>
        </div>
      </div>
    </section>
  );
}
