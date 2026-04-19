// components/home/BrandMarquee.tsx
// Manila file conveyor — each client becomes a paper-color file card tilted
// on a horizontal belt. Every 3rd card carries a DECLASSIFIED stamp. Hover
// pauses the belt and dims other cards so the hovered file "presents."
'use client';

import { CASES } from '@/lib/work-data';

interface Props {
  locale: 'zh-TW' | 'en-US';
}

interface BrandEntry {
  client: string;
  count: number;
  /** First case id we saw for this client — used as FILE · nnn header */
  headId: string;
}

function buildEntries(): BrandEntry[] {
  const map = new Map<string, BrandEntry>();
  for (const c of CASES) {
    if (!c.client) continue;
    const existing = map.get(c.client);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(c.client, { client: c.client, count: 1, headId: c.id });
    }
  }
  return Array.from(map.values());
}

/** Deterministic tilt in [-2.5, 2.5] degrees per index — no SSR mismatch. */
function tiltFor(i: number): number {
  const seq = [-2.2, 1.6, -0.8, 2.3, -1.9, 1.1, -2.5, 0.7, 2.0, -1.4];
  return seq[i % seq.length];
}

export default function BrandMarquee(_props: Props) {
  const entries = buildEntries();
  // Duplicate for seamless -50% translateX loop
  const loop = [...entries, ...entries];

  return (
    <section
      aria-label="Client manifest marquee"
      className="py-20"
      style={{ background: 'transparent' }}
    >
      <style>{`
        @keyframes manifest-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .manifest-track { animation: manifest-scroll 90s linear infinite; }
        .manifest-belt:hover .manifest-track { animation-play-state: paused; }
        .manifest-belt:hover .file-card { opacity: 0.35; }
        .manifest-belt .file-card:hover { opacity: 1 !important; transform: var(--tilt) scale(1.03) !important; z-index: 5; }
        @media (prefers-reduced-motion: reduce) {
          .manifest-track { animation: none; }
        }
      `}</style>

      <p
        className="px-5 md:px-8 mb-8 text-[10px] tracking-[0.3em] uppercase"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          color: 'rgba(250,250,248,0.45)',
        }}
      >
        § CLIENT MANIFEST · {entries.length} BRANDS ON FILE
      </p>

      <div
        className="manifest-belt overflow-hidden py-10"
        style={{
          borderTop: '1px solid rgba(250,250,248,0.1)',
          borderBottom: '1px solid rgba(250,250,248,0.1)',
          background:
            'repeating-linear-gradient(90deg, rgba(250,250,248,0.02) 0 2px, transparent 2px 80px)',
        }}
      >
        <div
          className="manifest-track flex"
          style={{ width: 'max-content' }}
          aria-hidden
        >
          {loop.map((e, i) => (
            <FileCard key={`${e.client}-${i}`} entry={e} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FileCard({ entry, index }: { entry: BrandEntry; index: number }) {
  const tilt = tiltFor(index);
  const showStamp = index % 3 === 1;
  const fileNumber = String((index % 42) + 1).padStart(2, '0');

  return (
    <div
      className="file-card shrink-0 relative mr-6"
      style={
        {
          '--tilt': `rotate(${tilt}deg)`,
          width: 260,
          padding: '18px 22px 22px',
          background: '#F0EDE6',
          color: '#0B1026',
          border: '1px solid rgba(11,16,38,0.18)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.28)',
          transform: `rotate(${tilt}deg)`,
          transition: 'opacity 220ms ease-out, transform 260ms ease-out',
          fontFamily: 'var(--font-mono), monospace',
        } as React.CSSProperties
      }
    >
      <div
        className="flex items-baseline gap-2"
        style={{ borderBottom: '1px dashed rgba(11,16,38,0.2)', paddingBottom: 6 }}
      >
        <span style={{ fontSize: 9, letterSpacing: '0.3em', color: '#E63E1F' }}>
          CASE FILE · {fileNumber}
        </span>
        <span aria-hidden style={{ color: 'rgba(11,16,38,0.2)' }}>/</span>
        <span
          style={{ fontSize: 9, letterSpacing: '0.25em', color: 'rgba(11,16,38,0.5)' }}
        >
          {entry.headId}
        </span>
      </div>
      <p
        className="mt-3 text-[18px] leading-tight"
        style={{
          fontFamily: 'var(--font-fraunces), var(--font-noto-serif-tc), serif',
          fontWeight: 500,
          letterSpacing: '-0.01em',
          color: 'rgba(11,16,38,0.92)',
        }}
      >
        {entry.client}
      </p>
      <p
        className="mt-2 text-[10px]"
        style={{
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(11,16,38,0.55)',
        }}
      >
        × {entry.count} {entry.count > 1 ? 'files on record' : 'file on record'}
      </p>
      {showStamp && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            right: -14,
            top: 10,
            display: 'inline-block',
            border: '2px solid #E63E1F',
            color: '#E63E1F',
            padding: '3px 8px',
            fontSize: 8,
            letterSpacing: '0.3em',
            fontWeight: 700,
            textTransform: 'uppercase',
            background: '#F0EDE6',
            transform: `rotate(${tilt > 0 ? -8 : 10}deg)`,
            whiteSpace: 'nowrap',
          }}
        >
          DECLASSIFIED
        </span>
      )}
    </div>
  );
}
