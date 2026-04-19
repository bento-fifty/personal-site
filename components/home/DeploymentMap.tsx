// components/home/DeploymentMap.tsx
// Taiwan map w/ REDACTED pin labels. Hover decrypts city name (GlitchText).
// Click a pin → fold-down folder card on the side panel listing that city's
// cases, paper-color manila file aesthetic. Pulsing flame pin rings.
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
  const revealed = (k: LocationKey) => k === hoveredKey || k === activeKey;

  return (
    <section
      aria-label="Deployment map"
      className="px-5 md:px-8 py-20 md:py-24"
      style={{ background: 'transparent' }}
    >
      <div className="max-w-5xl mx-auto">
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
          <span aria-hidden style={{ color: 'rgba(250,250,248,0.2)' }}>/</span>
          <p
            className="text-[10px] tracking-[0.3em] uppercase"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              color: 'rgba(250,250,248,0.35)',
            }}
          >
            {zh ? '懸停 · 解密 · 點擊 · 開檔' : 'Hover decrypt · Click open'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-10 md:gap-14 items-start">
          {/* Map container — SVG + HTML pin-label overlay */}
          <div
            className="relative mx-auto w-full"
            style={{ aspectRatio: '400 / 800', maxWidth: 420 }}
          >
            <svg
              viewBox="0 0 400 800"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0 w-full h-full"
              aria-hidden
            >
              <path
                d={TAIWAN_OUTLINE_PATH}
                fill="rgba(11,16,38,0.5)"
                stroke="rgba(93,211,227,0.35)"
                strokeWidth={1.5}
              />
              {groups.map((g) => {
                const r = Math.max(5, Math.min(10, 5 + g.count * 1.4));
                const rMax = Math.max(14, Math.min(28, 12 + g.count * 3));
                const active = g.key === activeKey;
                return (
                  <g key={g.key}>
                    <circle cx={g.x} cy={g.y} r={r} fill="none" stroke="#E63E1F" strokeWidth={1}>
                      <animate attributeName="r" from={r} to={rMax} dur="2.4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.55" to="0" dur="2.4s" repeatCount="indefinite" />
                    </circle>
                    <circle
                      cx={g.x}
                      cy={g.y}
                      r={r}
                      fill={active ? '#5DD3E3' : '#E63E1F'}
                      fillOpacity={0.9}
                    />
                    <rect
                      x={g.x - r - 4}
                      y={g.y - r - 4}
                      width={(r + 4) * 2}
                      height={(r + 4) * 2}
                      fill="none"
                      stroke={active ? '#5DD3E3' : 'rgba(230,62,31,0.35)'}
                      strokeWidth={1}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Interactive HTML pin labels positioned via viewBox percent */}
            {groups.map((g) => {
              const isRevealed = revealed(g.key);
              const isActive = g.key === activeKey;
              const label = zh ? g.labelZh : g.labelEn;
              return (
                <button
                  key={g.key}
                  type="button"
                  onMouseEnter={() => setHoveredKey(g.key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  onClick={() => setActiveKey((k) => (k === g.key ? null : g.key))}
                  data-cursor={isActive ? '✕ CLOSE' : '▸ OPEN FILES'}
                  data-cursor-variant="action"
                  aria-label={`${g.labelEn} · ${g.count} files`}
                  className="absolute flex items-center gap-2"
                  style={{
                    left: `${(g.x / 400) * 100}%`,
                    top: `${(g.y / 800) * 100}%`,
                    transform: 'translate(4%, -50%)',
                    fontFamily: 'var(--font-mono), monospace',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: isRevealed ? 'rgba(250,250,248,0.92)' : 'transparent',
                      background: isRevealed ? 'transparent' : '#0B1026',
                      padding: '1px 6px',
                      transition: 'color 120ms, background 120ms',
                      borderBottom: isActive ? '1px solid #5DD3E3' : '1px solid transparent',
                    }}
                  >
                    {isRevealed ? (
                      <GlitchText
                        text={label}
                        trigger={g.key + (isActive ? '-a' : '-h')}
                        speed={18}
                      />
                    ) : (
                      '\u2588'.repeat(Math.max(5, label.length))
                    )}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      letterSpacing: '0.28em',
                      color: isRevealed ? '#5DD3E3' : 'rgba(93,211,227,0.4)',
                    }}
                  >
                    × {g.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Side panel — fold folder card on active city */}
          <div className="min-h-[200px]">
            {activeGroup ? (
              <FoldCard
                key={activeGroup.key}
                group={activeGroup}
                zh={zh}
                onClose={() => setActiveKey(null)}
              />
            ) : (
              <div
                className="text-[10px] tracking-[0.25em] uppercase"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  color: 'rgba(250,250,248,0.35)',
                  lineHeight: 1.8,
                }}
              >
                [ WAITING FOR TARGET ]
                <br />
                {zh
                  ? '點擊地圖上任一城市以解密檔案'
                  : 'Click any city to decrypt files.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function FoldCard({
  group,
  zh,
  onClose,
}: {
  group: PinGroup;
  zh: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <style>{`
        @keyframes fold-down {
          0%   { transform: scaleY(0.02); opacity: 0; }
          60%  { opacity: 1; }
          100% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
      <div
        className="relative overflow-hidden"
        style={{
          animation: 'fold-down 0.55s cubic-bezier(0.22, 1, 0.36, 1) both',
          transformOrigin: 'top',
          background: '#F0EDE6',
          color: '#0B1026',
          border: '1px solid rgba(230,62,31,0.4)',
          boxShadow: '0 14px 40px rgba(0,0,0,0.4)',
        }}
      >
        <div
          className="flex items-baseline gap-3 flex-wrap px-5 py-3"
          style={{
            background: 'rgba(230,62,31,0.08)',
            borderBottom: '1px dashed rgba(230,62,31,0.35)',
            fontFamily: 'var(--font-mono), monospace',
          }}
        >
          <span style={{ fontSize: 9, letterSpacing: '0.3em', color: '#E63E1F' }}>
            FOLDER · {group.labelEn.toUpperCase()}
          </span>
          <span aria-hidden style={{ color: 'rgba(11,16,38,0.25)' }}>·</span>
          <span
            style={{
              fontSize: 9,
              letterSpacing: '0.28em',
              color: 'rgba(11,16,38,0.6)',
            }}
          >
            {group.count} FILES
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close folder"
            className="ml-auto"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              fontSize: 9,
              letterSpacing: '0.28em',
              color: 'rgba(11,16,38,0.55)',
            }}
          >
            [ ✕ ]
          </button>
        </div>
        <ul className="px-5 py-4 flex flex-col">
          {group.cases.map((c, i) => (
            <li key={c.slug}>
              <Link
                href={`/work/${c.slug}`}
                data-cursor="▸ OPEN FILE"
                data-cursor-variant="action"
                className="block py-2.5 px-1 hover:bg-[rgba(230,62,31,0.06)] transition-colors"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  className="flex items-baseline gap-2"
                  style={{ fontFamily: 'var(--font-mono), monospace' }}
                >
                  <span style={{ fontSize: 9, letterSpacing: '0.3em', color: '#E63E1F' }}>
                    CASE · {c.id}
                  </span>
                  <span aria-hidden style={{ color: 'rgba(11,16,38,0.2)' }}>/</span>
                  <span
                    style={{
                      fontSize: 9,
                      letterSpacing: '0.25em',
                      color: 'rgba(11,16,38,0.55)',
                    }}
                  >
                    {c.year}
                  </span>
                </div>
                <p
                  className="mt-1 text-[14px] leading-tight"
                  style={{
                    fontFamily: 'var(--font-fraunces), var(--font-noto-serif-tc), serif',
                    color: 'rgba(11,16,38,0.9)',
                  }}
                >
                  {zh ? c.title : c.titleEn}
                </p>
              </Link>
              {i < group.cases.length - 1 && (
                <hr
                  style={{
                    border: 'none',
                    borderTop: '1px dashed rgba(11,16,38,0.12)',
                    margin: '2px 0',
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
