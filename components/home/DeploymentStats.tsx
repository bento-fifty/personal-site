// components/home/DeploymentStats.tsx
// Deployment Stats — 3-col mono big-number tile below IssueCover.
// Pure CASES derivation; server component.

import { CASES } from '@/lib/work-data';
import type { LocationKey } from '@/lib/locations';

interface Props {
  locale: 'zh-TW' | 'en-US';
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

  const stats = [
    { value: String(files).padStart(3, '0'), labelZh: '已結案檔', labelEn: 'Files' },
    { value: `${yearMin}–${yearMax}`,          labelZh: '服役年度', labelEn: 'Years' },
    { value: String(cities).padStart(2, '0'), labelZh: '佈署城市', labelEn: 'Cities' },
  ];

  return (
    <section
      aria-label="Deployment stats"
      className="px-5 md:px-8 py-20 md:py-24"
      style={{ background: 'transparent' }}
    >
      <div className="max-w-5xl mx-auto">
        <p
          className="mb-10 font-mono text-[10px] tracking-[0.3em] uppercase"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            color: 'rgba(250,250,248,0.45)',
          }}
        >
          § DEPLOYMENT STATS · {zh ? '整體部署' : 'Aggregate deployment'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {stats.map((s) => (
            <div key={s.labelEn}>
              <p
                className="leading-none mb-4 tabular-nums"
                style={{
                  color: '#E63E1F',
                  fontFamily: 'var(--font-fraunces), serif',
                  fontWeight: 500,
                  fontSize: 'clamp(48px, 8vw, 88px)',
                  letterSpacing: '-0.03em',
                }}
              >
                {s.value}
              </p>
              <p
                className="font-mono text-[10px] tracking-[0.28em] uppercase"
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
