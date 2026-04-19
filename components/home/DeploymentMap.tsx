// components/home/DeploymentMap.tsx
// Editorial-minimal Taiwan deployment map. No side-panel cards, no chrome
// noise. Giant Fraunces section title. Map on the left, dossier-list of
// cities on the right with REDACTED labels that decrypt on hover via
// GlitchText. Clicking a city swaps the right panel for that city's case
// list — no fold-down card wrapper, just a clean editorial block swap.
'use client';

import { useMemo, useState } from 'react';
import { TransitionLink as Link } from '@/components/shared/RouteTransition';
import GlitchText from '@/components/shared/GlitchText';
import { CASES, type Case } from '@/lib/work-data';
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
  cases: Case[];
}

export default function DeploymentMap({ locale }: Props) {
  const zh = locale === 'zh-TW';
  const [hoveredKey, setHoveredKey] = useState<LocationKey | null>(null);
  const [activeKey, setActiveKey] = useState<LocationKey | null>(null);

  const groups = useMemo<PinGroup[]>(() => {
    const bucket = new Map<LocationKey, Case[]>();
    for (const c of CASES) {
      if (!c.location) continue;
      const arr = bucket.get(c.location) ?? [];
      arr.push(c);
      bucket.set(c.location, arr);
    }
    const list: PinGroup[] = [];
    for (const [key, cases] of bucket) {
      const loc = LOCATIONS[key];
      list.push({
        key,
        x: loc.x,
        y: loc.y,
        labelZh: loc.labelZh,
        labelEn: loc.labelEn,
        count: cases.length,
        cases,
      });
    }
    return list.sort((a, b) => b.count - a.count);
  }, []);

  const activeGroup = groups.find((g) => g.key === activeKey) ?? null;
  const totalPlotted = groups.reduce((s, g) => s + g.count, 0);

  return (
    <section
      aria-label="Deployment map"
      className="relative px-6 md:px-16"
      style={{
        minHeight: '100vh',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: '10vh',
        paddingBottom: '10vh',
      }}
    >
      <div className="w-full max-w-[1400px] mx-auto">
        {/* Section meta row */}
        <div
          className="flex items-baseline gap-4 flex-wrap mb-10"
          style={{ fontFamily: 'var(--font-mono), monospace' }}
        >
          <span
            className="text-[10px] tracking-[0.4em] uppercase"
            style={{ color: '#5DD3E3' }}
          >
            § 05 · DEPLOYMENT MAP
          </span>
          <span aria-hidden style={{ color: 'rgba(250,250,248,0.2)' }}>/</span>
          <span
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{ color: 'rgba(250,250,248,0.5)' }}
          >
            TPE · TW
          </span>
          <span aria-hidden style={{ color: 'rgba(250,250,248,0.2)' }}>/</span>
          <span
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{ color: 'rgba(250,250,248,0.35)' }}
          >
            {String(totalPlotted).padStart(3, '0')} pins · {groups.length} cities
          </span>
        </div>

        {/* Editorial title */}
        <h2
          className="max-w-[18ch] mb-16 md:mb-20"
          style={{
            fontFamily: 'var(--font-fraunces), var(--font-noto-serif-tc), serif',
            color: '#FAFAF8',
            fontWeight: 400,
            fontSize: 'clamp(48px, 7vw, 120px)',
            letterSpacing: '-0.035em',
            lineHeight: 0.95,
          }}
        >
          {zh ? (
            <>
              我們降落過的
              <br />
              每一個座標。
            </>
          ) : (
            <>
              Every coordinate we’ve
              <br />
              actually touched down on.
            </>
          )}
        </h2>

        {/* Map + Content */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(280px,380px)_1fr] gap-12 md:gap-20 items-start">
          {/* Map — larger, editorial */}
          <div
            className="relative w-full"
            style={{ aspectRatio: '400 / 800', maxWidth: 380 }}
          >
            <svg
              viewBox="0 0 400 800"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0 w-full h-full"
              aria-hidden
            >
              <path
                d={TAIWAN_OUTLINE_PATH}
                fill="rgba(250,250,248,0.03)"
                stroke="rgba(250,250,248,0.4)"
                strokeWidth={1}
              />
              {groups.map((g) => {
                const r = Math.max(6, Math.min(12, 6 + g.count * 1.6));
                const rMax = Math.max(18, Math.min(36, 16 + g.count * 4));
                const active = g.key === activeKey;
                const dim = !!activeKey && !active;
                return (
                  <g key={g.key} style={{ opacity: dim ? 0.3 : 1, transition: 'opacity 240ms' }}>
                    <circle cx={g.x} cy={g.y} r={r} fill="none" stroke="#E63E1F" strokeWidth={1}>
                      <animate attributeName="r" from={r} to={rMax} dur="2.4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.5" to="0" dur="2.4s" repeatCount="indefinite" />
                    </circle>
                    <circle
                      cx={g.x}
                      cy={g.y}
                      r={r}
                      fill={active ? '#5DD3E3' : '#E63E1F'}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Right panel — list or active city detail */}
          <div>
            {activeGroup ? (
              <CityDetail
                group={activeGroup}
                zh={zh}
                onClose={() => setActiveKey(null)}
              />
            ) : (
              <CityList
                groups={groups}
                zh={zh}
                hoveredKey={hoveredKey}
                onHover={setHoveredKey}
                onSelect={(k) => setActiveKey(k)}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function CityList({
  groups,
  zh,
  hoveredKey,
  onHover,
  onSelect,
}: {
  groups: PinGroup[];
  zh: boolean;
  hoveredKey: LocationKey | null;
  onHover: (k: LocationKey | null) => void;
  onSelect: (k: LocationKey) => void;
}) {
  return (
    <div>
      <p
        className="mb-8 text-[10px] tracking-[0.4em] uppercase"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          color: 'rgba(250,250,248,0.5)',
        }}
      >
        [ REDACTED UNTIL HOVERED ]
      </p>
      <ul className="flex flex-col">
        {groups.map((g, i) => {
          const isHovered = g.key === hoveredKey;
          const label = zh ? g.labelZh : g.labelEn;
          return (
            <li
              key={g.key}
              className="group"
              onMouseEnter={() => onHover(g.key)}
              onMouseLeave={() => onHover(null)}
            >
              <button
                type="button"
                onClick={() => onSelect(g.key)}
                data-cursor="▸ OPEN FILES"
                data-cursor-variant="action"
                className="w-full flex items-baseline gap-6 py-5"
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderTop:
                    i === 0
                      ? '1px solid rgba(250,250,248,0.12)'
                      : '1px solid transparent',
                  borderBottom: '1px solid rgba(250,250,248,0.12)',
                  cursor: 'pointer',
                  padding: '20px 0',
                  textAlign: 'left',
                  color: 'inherit',
                  transition: 'background 200ms ease-out',
                }}
              >
                <span
                  className="text-[11px] tracking-[0.3em] uppercase w-[52px] shrink-0"
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    color: isHovered ? '#E63E1F' : 'rgba(250,250,248,0.4)',
                    transition: 'color 200ms',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="flex-1"
                  style={{
                    fontFamily:
                      'var(--font-fraunces), var(--font-noto-serif-tc), serif',
                    fontSize: 'clamp(28px, 3.5vw, 48px)',
                    fontWeight: 400,
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    color: isHovered ? '#FAFAF8' : 'rgba(250,250,248,0.2)',
                    transition: 'color 220ms ease-out',
                    textTransform: 'none',
                  }}
                >
                  {isHovered ? (
                    <GlitchText text={label} trigger={g.key} speed={20} />
                  ) : (
                    '\u2588'.repeat(Math.max(6, label.length * 2))
                  )}
                </span>
                <span
                  className="text-[11px] tracking-[0.3em] uppercase shrink-0"
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    color: isHovered ? '#5DD3E3' : 'rgba(250,250,248,0.35)',
                    transition: 'color 200ms',
                  }}
                >
                  × {String(g.count).padStart(2, '0')}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CityDetail({
  group,
  zh,
  onClose,
}: {
  group: PinGroup;
  zh: boolean;
  onClose: () => void;
}) {
  return (
    <div>
      <div
        className="flex items-baseline flex-wrap gap-4 mb-8"
        style={{ fontFamily: 'var(--font-mono), monospace' }}
      >
        <button
          type="button"
          onClick={onClose}
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            color: 'rgba(250,250,248,0.5)',
          }}
          aria-label="Back to all cities"
        >
          ← BACK
        </button>
        <span aria-hidden style={{ color: 'rgba(250,250,248,0.2)' }}>/</span>
        <span
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{ color: '#5DD3E3' }}
        >
          {group.count} FILES ON SITE
        </span>
      </div>

      <h3
        className="mb-10"
        style={{
          fontFamily: 'var(--font-fraunces), var(--font-noto-serif-tc), serif',
          color: '#FAFAF8',
          fontWeight: 400,
          fontSize: 'clamp(56px, 7vw, 104px)',
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        <GlitchText
          text={zh ? group.labelZh : group.labelEn}
          trigger={`${group.key}-active`}
          speed={22}
        />
      </h3>

      <ul className="flex flex-col">
        {group.cases.map((c, i) => (
          <li key={c.slug}>
            <Link
              href={`/work/${c.slug}`}
              data-cursor="▸ OPEN FILE"
              data-cursor-variant="action"
              className="block py-5"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                borderTop:
                  i === 0
                    ? '1px solid rgba(250,250,248,0.12)'
                    : 'none',
                borderBottom: '1px solid rgba(250,250,248,0.12)',
              }}
            >
              <div
                className="flex items-baseline gap-4 mb-2"
                style={{ fontFamily: 'var(--font-mono), monospace' }}
              >
                <span
                  className="text-[10px] tracking-[0.3em] uppercase"
                  style={{ color: '#E63E1F' }}
                >
                  CASE · {c.id}
                </span>
                <span aria-hidden style={{ color: 'rgba(250,250,248,0.2)' }}>/</span>
                <span
                  className="text-[10px] tracking-[0.3em] uppercase"
                  style={{ color: 'rgba(250,250,248,0.45)' }}
                >
                  {c.year}
                </span>
                <span aria-hidden style={{ color: 'rgba(250,250,248,0.2)' }}>/</span>
                <span
                  className="text-[10px] tracking-[0.3em] uppercase"
                  style={{ color: 'rgba(250,250,248,0.45)' }}
                >
                  {c.client}
                </span>
              </div>
              <p
                className="text-[20px] md:text-[24px] leading-tight max-w-[42ch]"
                style={{
                  fontFamily:
                    'var(--font-fraunces), var(--font-noto-serif-tc), serif',
                  color: 'rgba(250,250,248,0.9)',
                  fontWeight: 400,
                  letterSpacing: '-0.01em',
                }}
              >
                {zh ? c.title : c.titleEn}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
