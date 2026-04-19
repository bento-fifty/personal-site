// components/home/DeploymentStats.tsx
// Editorial big-number stats. Each stat is a full-viewport "spread":
// one giant display figure left-aligned, tiny mono tag + definition below.
// Scroll-driven count-up on entering each spread; uses requestAnimationFrame
// for smoothness, no digit reels (those read as broken mid-transition).
'use client';

import { useEffect, useRef, useState } from 'react';
import { CASES } from '@/lib/work-data';
import type { LocationKey } from '@/lib/locations';

interface Props {
  locale: 'zh-TW' | 'en-US';
}

interface Stat {
  tag: string;           // § MARK — uppercase mono
  display: (v: number) => string;   // how to render current/target
  final: number;         // the target value
  tagLabel: string;      // e.g. "files on record"
  tagLabelEn: string;
  caption: string;       // one-line editorial caption
  captionEn: string;
  unit?: string;         // suffix (optional)
}

export default function DeploymentStats({ locale }: Props) {
  const zh = locale === 'zh-TW';

  const files = CASES.length;
  const years = CASES.map((c) => c.year).filter(
    (y): y is number => typeof y === 'number',
  );
  const yearMin = years.length ? Math.min(...years) : 0;
  const yearMax = years.length ? Math.max(...years) : 0;
  const cities = new Set(
    CASES.map((c) => c.location).filter((l): l is LocationKey => Boolean(l)),
  ).size;

  const stats: Stat[] = [
    {
      tag: '§ 02.A · FILES',
      final: files,
      display: (v) => String(v).padStart(3, '0'),
      tagLabel: '已結案檔',
      tagLabelEn: 'Files on record',
      caption: `從 ${yearMin} 年第一場活動至今，親手做完的每一場案子都在這。`,
      captionEn: `Every project I personally ran, from ${yearMin} to today.`,
    },
    {
      tag: '§ 02.B · SPAN',
      final: yearMax - yearMin,
      display: () => `${yearMin}–${yearMax}`,
      tagLabel: '服役年度',
      tagLabelEn: 'Years in service',
      caption: '不接的標比接的多。這個跨度是過濾後的結果。',
      captionEn: `Turned down more briefs than we took. ${yearMax - yearMin} years is the filtered result.`,
    },
    {
      tag: '§ 02.C · SITES',
      final: cities,
      display: (v) => String(v).padStart(2, '0'),
      tagLabel: '佈署城市',
      tagLabelEn: 'Cities deployed',
      caption: '每個城市都親自落地，不外派執行單位。',
      captionEn: 'Every city, on the ground. Never outsourced.',
    },
  ];

  return (
    <>
      {stats.map((s, i) => (
        <StatSpread key={s.tag} stat={s} zh={zh} index={i} />
      ))}
    </>
  );
}

function StatSpread({ stat, zh, index }: { stat: Stat; zh: boolean; index: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [animated, setAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reducedMotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayValue(stat.final);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnimated(true);
      return;
    }
    if (!sectionRef.current) return;
    const el = sectionRef.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animated) return;
        setAnimated(true);
        const duration = 1400;
        const start = performance.now();
        const from = 0;
        const to = stat.final;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          // ease-out-quart
          const eased = 1 - Math.pow(1 - t, 4);
          setDisplayValue(Math.round(from + (to - from) * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [stat.final, animated]);

  return (
    <section
      ref={sectionRef}
      aria-label={`Deployment stat ${index + 1}`}
      className="relative px-6 md:px-16"
      style={{
        minHeight: '88vh',
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="w-full max-w-[1200px] mx-auto">
        <p
          className="mb-8 text-[10px] tracking-[0.4em] uppercase"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            color: '#5DD3E3',
          }}
        >
          {stat.tag}
        </p>
        <div
          className="tabular-nums"
          style={{
            color: '#FAFAF8',
            fontFamily: 'var(--font-fraunces), serif',
            fontWeight: 500,
            fontSize: 'clamp(120px, 22vw, 320px)',
            letterSpacing: '-0.055em',
            lineHeight: 0.85,
            marginBottom: '0.12em',
          }}
        >
          {stat.display(displayValue)}
        </div>
        <div className="flex items-baseline flex-wrap gap-x-6 gap-y-2 mt-10 max-w-[780px]">
          <p
            className="text-[11px] tracking-[0.3em] uppercase"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              color: '#E63E1F',
            }}
          >
            {zh ? stat.tagLabel : stat.tagLabelEn}
          </p>
          <span aria-hidden style={{ color: 'rgba(250,250,248,0.25)' }}>·</span>
          <p
            className="text-[15px] md:text-[17px] flex-1 min-w-[260px]"
            style={{
              fontFamily: 'var(--font-noto-serif-tc), var(--font-fraunces), serif',
              color: 'rgba(250,250,248,0.72)',
              lineHeight: 1.55,
            }}
          >
            {zh ? stat.caption : stat.captionEn}
          </p>
        </div>
      </div>
    </section>
  );
}
