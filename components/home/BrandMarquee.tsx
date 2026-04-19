// components/home/BrandMarquee.tsx
// Mono client-name horizontal ticker. No logo images — text only.
'use client';

import { CASES } from '@/lib/work-data';

interface Props {
  locale: 'zh-TW' | 'en-US';
}

export default function BrandMarquee(_props: Props) {
  const seen = new Set<string>();
  const clients: string[] = [];
  for (const c of CASES) {
    if (c.client && !seen.has(c.client)) {
      seen.add(c.client);
      clients.push(c.client);
    }
  }
  // Duplicate for seamless 50% translate loop.
  const loop = [...clients, ...clients];

  return (
    <section
      aria-label="Client manifest marquee"
      className="py-16"
      style={{ background: 'transparent' }}
    >
      <style>{`
        @keyframes brand-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
      <p
        className="px-5 md:px-8 mb-8 text-[10px] tracking-[0.3em] uppercase"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          color: 'rgba(250,250,248,0.45)',
        }}
      >
        § CLIENT MANIFEST · {clients.length} BRANDS ON FILE
      </p>
      <div
        className="overflow-hidden"
        style={{
          borderTop: '1px solid rgba(250,250,248,0.1)',
          borderBottom: '1px solid rgba(250,250,248,0.1)',
        }}
      >
        <div
          aria-hidden
          className="flex whitespace-nowrap"
          style={{
            animation: 'brand-scroll 60s linear infinite',
            width: 'max-content',
          }}
        >
          {loop.map((c, i) => (
            <span
              key={`${c}-${i}`}
              className="inline-flex items-center px-8 py-5 text-[12px] md:text-[14px] tracking-[0.25em] uppercase"
              style={{
                fontFamily: 'var(--font-mono), monospace',
                color: 'rgba(250,250,248,0.78)',
              }}
            >
              <span aria-hidden className="mr-3" style={{ color: '#E63E1F' }}>◆</span>
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
