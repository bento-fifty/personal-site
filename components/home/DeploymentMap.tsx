// components/home/DeploymentMap.tsx
// Taiwan outline SVG + grouped pins (one per LocationKey, sized by case count).
// Side list mirrors the map with links into /work. Cases without `location`
// are excluded (Stage 2 may extend Case.location to array for multi-city runs).
'use client';

import { useMemo } from 'react';
import { TransitionLink as Link } from '@/components/shared/RouteTransition';
import { CASES } from '@/lib/work-data';
import { LOCATIONS, TAIWAN_OUTLINE_PATH, type LocationKey } from '@/lib/locations';

interface Props {
  locale: 'zh-TW' | 'en-US';
}

interface PinGroup {
  key: LocationKey;
  x: number;
  y: number;
  labelZh: string;
  labelEn: string;
  count: number;
}

export default function DeploymentMap({ locale }: Props) {
  const zh = locale === 'zh-TW';

  const groups = useMemo<PinGroup[]>(() => {
    const counts = new Map<LocationKey, number>();
    for (const c of CASES) {
      if (!c.location) continue;
      counts.set(c.location, (counts.get(c.location) ?? 0) + 1);
    }
    const list: PinGroup[] = [];
    for (const [key, count] of counts) {
      const loc = LOCATIONS[key];
      list.push({
        key,
        x: loc.x,
        y: loc.y,
        labelZh: loc.labelZh,
        labelEn: loc.labelEn,
        count,
      });
    }
    return list.sort((a, b) => b.count - a.count);
  }, []);

  const totalPlotted = groups.reduce((s, g) => s + g.count, 0);

  return (
    <section
      aria-label="Deployment map"
      className="px-5 md:px-8 py-20 md:py-24"
      style={{ background: 'transparent' }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header — tight left-grouped, no justify-between */}
        <div className="flex items-baseline flex-wrap gap-3 mb-10">
          <p
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              color: 'rgba(250,250,248,0.45)',
            }}
          >
            § DEPLOYMENT MAP · TW
          </p>
          <span aria-hidden style={{ color: 'rgba(250,250,248,0.2)' }}>/</span>
          <p
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              color: 'rgba(93,211,227,0.7)',
            }}
          >
            {String(totalPlotted).padStart(3, '0')} PINS · {groups.length} CITIES
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-8 md:gap-14 items-start">
          {/* SVG outline + pins */}
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <svg
              viewBox="0 0 400 800"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: '100%', height: 'auto', display: 'block' }}
              aria-hidden
            >
              <path
                d={TAIWAN_OUTLINE_PATH}
                fill="rgba(11,16,38,0.5)"
                stroke="rgba(93,211,227,0.35)"
                strokeWidth={1.5}
              />
              {groups.map((g) => {
                const r = Math.max(6, Math.min(14, 6 + g.count * 2));
                const rMax = Math.max(14, Math.min(32, 14 + g.count * 5));
                return (
                  <g key={g.key}>
                    {/* pulse ring */}
                    <circle
                      cx={g.x}
                      cy={g.y}
                      r={r}
                      fill="none"
                      stroke="#E63E1F"
                      strokeWidth={1}
                    >
                      <animate
                        attributeName="r"
                        from={r}
                        to={rMax}
                        dur="2.4s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        from="0.5"
                        to="0"
                        dur="2.4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    {/* solid pin */}
                    <circle cx={g.x} cy={g.y} r={r} fill="#E63E1F" fillOpacity={0.88} />
                    <text
                      x={g.x + 18}
                      y={g.y + 4}
                      fill="rgba(250,250,248,0.78)"
                      fontSize={14}
                      fontFamily="var(--font-mono), monospace"
                      letterSpacing={0.5}
                    >
                      {zh ? g.labelZh : g.labelEn}
                    </text>
                    <text
                      x={g.x + 18}
                      y={g.y + 22}
                      fill="#5DD3E3"
                      fontSize={10}
                      fontFamily="var(--font-mono), monospace"
                      letterSpacing={1}
                    >
                      × {g.count}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Side list — tight left group, no justify-between */}
          <ul className="flex flex-col gap-1">
            {groups.map((g) => (
              <li key={g.key}>
                <Link
                  href="/work"
                  data-cursor="◀ ARCHIVE"
                  data-cursor-variant="link"
                  className="flex items-baseline gap-3 py-2 px-3 border border-transparent hover:border-[rgba(93,211,227,0.35)] transition-colors"
                  style={{ fontFamily: 'var(--font-mono), monospace' }}
                >
                  <span aria-hidden style={{ color: '#E63E1F' }}>●</span>
                  <span
                    className="text-[12px] tracking-[0.2em] uppercase"
                    style={{ color: 'rgba(250,250,248,0.78)' }}
                  >
                    {zh ? g.labelZh : g.labelEn}
                  </span>
                  <span aria-hidden style={{ color: 'rgba(250,250,248,0.25)' }}>·</span>
                  <span
                    className="text-[10px] tracking-[0.25em]"
                    style={{ color: 'rgba(93,211,227,0.7)' }}
                  >
                    × {g.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
