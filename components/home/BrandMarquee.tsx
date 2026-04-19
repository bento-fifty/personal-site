// components/home/BrandMarquee.tsx
// Editorial marquee — no cards. Giant Fraunces serif client names run
// horizontally on an infinite belt, separated by small flame glyphs.
// Hovering the belt pauses it; hovering a single name dims siblings so the
// focused name "presents." Same pattern as a magazine contributors wall.
'use client';

import { CASES } from '@/lib/work-data';

interface Props {
  locale: 'zh-TW' | 'en-US';
}

function buildEntries(): string[] {
  const seen = new Set<string>();
  const list: string[] = [];
  for (const c of CASES) {
    if (c.client && !seen.has(c.client)) {
      seen.add(c.client);
      list.push(c.client);
    }
  }
  return list;
}

export default function BrandMarquee({ locale }: Props) {
  const zh = locale === 'zh-TW';
  const entries = buildEntries();
  const loop = [...entries, ...entries];

  return (
    <section
      aria-label="Client manifest"
      className="relative"
      style={{
        minHeight: '72vh',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: '10vh',
        paddingBottom: '10vh',
      }}
    >
      <style>{`
        @keyframes manifest-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .manifest-track { animation: manifest-scroll 60s linear infinite; }
        .manifest-belt:hover .manifest-track { animation-play-state: paused; }
        .manifest-belt:hover .brand-name { opacity: 0.25; }
        .manifest-belt .brand-name:hover { opacity: 1 !important; color: #E63E1F !important; }
        @media (prefers-reduced-motion: reduce) {
          .manifest-track { animation: none; }
        }
      `}</style>

      {/* Section heading */}
      <div
        className="px-6 md:px-16 mb-12 md:mb-16 flex items-baseline gap-4 flex-wrap"
        style={{ fontFamily: 'var(--font-mono), monospace' }}
      >
        <span
          className="text-[10px] tracking-[0.4em] uppercase"
          style={{ color: '#5DD3E3' }}
        >
          § 04 · CLIENT MANIFEST
        </span>
        <span aria-hidden style={{ color: 'rgba(250,250,248,0.2)' }}>/</span>
        <span
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{ color: 'rgba(250,250,248,0.5)' }}
        >
          {entries.length} {zh ? '個品牌在檔' : 'brands on record'}
        </span>
      </div>

      {/* Editorial ticker — giant names, separators. No cards. */}
      <div
        className="manifest-belt overflow-hidden"
        style={{
          borderTop: '1px solid rgba(250,250,248,0.08)',
          borderBottom: '1px solid rgba(250,250,248,0.08)',
          paddingTop: '24px',
          paddingBottom: '24px',
        }}
      >
        <div
          className="manifest-track flex items-center"
          style={{ width: 'max-content' }}
          aria-hidden
        >
          {loop.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="brand-name inline-flex items-center"
              style={{
                paddingInline: 'clamp(32px, 5vw, 80px)',
                fontFamily:
                  'var(--font-fraunces), var(--font-noto-serif-tc), serif',
                fontWeight: 400,
                fontSize: 'clamp(48px, 7vw, 112px)',
                letterSpacing: '-0.02em',
                lineHeight: 1,
                color: 'rgba(250,250,248,0.88)',
                whiteSpace: 'nowrap',
                transition: 'opacity 240ms ease-out, color 200ms ease-out',
                cursor: 'default',
              }}
            >
              {name}
              <span
                aria-hidden
                style={{
                  marginLeft: 'clamp(32px, 5vw, 80px)',
                  color: '#E63E1F',
                  fontSize: 'clamp(20px, 3vw, 40px)',
                  fontFamily: 'var(--font-mono), monospace',
                  letterSpacing: 0,
                  verticalAlign: 'middle',
                }}
              >
                ✱
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Footer caption */}
      <p
        className="px-6 md:px-16 mt-12 text-[11px] tracking-[0.25em] uppercase max-w-[540px]"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          color: 'rgba(250,250,248,0.55)',
          lineHeight: 1.7,
        }}
      >
        {zh
          ? '— 獨立接案、從頭到尾同一組人。客戶名單未經包裝，僅列已結案者。'
          : '— Solo-led, end-to-end. Only closed files listed, no embellishment.'}
      </p>
    </section>
  );
}
