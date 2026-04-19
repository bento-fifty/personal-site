// components/home/DeploymentStats.tsx
// Odometer reel — each digit spins 0→target on scroll into view. Stagger by
// stat index + within-stat digit index. Respects prefers-reduced-motion
// (renders final value directly).
'use client';

import { useEffect, useRef, useState } from 'react';
import { CASES } from '@/lib/work-data';
import type { LocationKey } from '@/lib/locations';

interface Props {
  locale: 'zh-TW' | 'en-US';
}

/** A single character slot. Digits spin; anything else renders static. */
function DigitReel({
  targetChar,
  animate,
  delay,
}: {
  targetChar: string;
  animate: boolean;
  delay: number;
}) {
  const isDigit = /[0-9]/.test(targetChar);
  if (!isDigit) {
    return (
      <span style={{ display: 'inline-block', verticalAlign: 'top', lineHeight: 1 }}>
        {targetChar}
      </span>
    );
  }
  const n = parseInt(targetChar, 10);
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-block',
        verticalAlign: 'top',
        height: '1em',
        lineHeight: 1,
        overflow: 'hidden',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      <span
        style={{
          display: 'block',
          transform: animate ? `translateY(-${n}em)` : 'translateY(0)',
          transition: animate
            ? `transform 1.8s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`
            : 'none',
        }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            style={{ display: 'block', height: '1em', lineHeight: 1 }}
          >
            {i}
          </span>
        ))}
      </span>
    </span>
  );
}

function StatReel({
  value,
  animate,
  statIndex,
}: {
  value: string;
  animate: boolean;
  statIndex: number;
}) {
  return (
    <span
      role="text"
      aria-label={value}
      style={{ display: 'inline-flex', alignItems: 'baseline' }}
    >
      {value.split('').map((ch, i) => (
        <DigitReel
          key={`${ch}-${i}`}
          targetChar={ch}
          animate={animate}
          delay={statIndex * 220 + i * 80}
        />
      ))}
    </span>
  );
}

export default function DeploymentStats({ locale }: Props) {
  const zh = locale === 'zh-TW';
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const reducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnimate(true);
      return;
    }
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const files = CASES.length;
  const years = CASES.map((c) => c.year).filter(
    (y): y is number => typeof y === 'number',
  );
  const yearMin = years.length ? Math.min(...years) : 0;
  const yearMax = years.length ? Math.max(...years) : 0;
  const cities = new Set(
    CASES.map((c) => c.location).filter((l): l is LocationKey => Boolean(l)),
  ).size;

  const stats = [
    { value: String(files).padStart(3, '0'), labelZh: '已結案檔', labelEn: 'Files' },
    { value: `${yearMin}–${yearMax}`,          labelZh: '服役年度', labelEn: 'Years' },
    { value: String(cities).padStart(2, '0'), labelZh: '佈署城市', labelEn: 'Cities' },
  ];

  return (
    <section
      ref={ref}
      aria-label="Deployment stats"
      className="px-5 md:px-8 py-20 md:py-24"
      style={{ background: 'transparent' }}
    >
      <div className="max-w-5xl mx-auto">
        <p
          className="mb-10 text-[10px] tracking-[0.3em] uppercase"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            color: 'rgba(250,250,248,0.45)',
          }}
        >
          § DEPLOYMENT STATS · {zh ? '整體部署' : 'Aggregate deployment'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {stats.map((s, idx) => (
            <div key={s.labelEn}>
              <div
                className="mb-4 tabular-nums"
                style={{
                  color: '#E63E1F',
                  fontFamily: 'var(--font-fraunces), serif',
                  fontWeight: 500,
                  fontSize: 'clamp(48px, 8vw, 88px)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}
              >
                <StatReel value={s.value} animate={animate} statIndex={idx} />
              </div>
              <p
                className="text-[10px] tracking-[0.28em] uppercase"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  color: 'rgba(93,211,227,0.7)',
                }}
              >
                {zh ? s.labelZh : s.labelEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
