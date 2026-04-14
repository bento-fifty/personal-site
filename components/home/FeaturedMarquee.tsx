'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CASES } from '@/lib/work-data';

interface Props {
  locale: 'zh-TW' | 'en-US';
}

/**
 * FeaturedMarquee — v8 IssueCover right rail.
 *
 * Shows featured cases only, infinite vertical scroll, pause on hover.
 * NO. prefix uses ice (blue) — v8 color strategy for data/metadata.
 */
export default function FeaturedMarquee({ locale }: Props) {
  const [paused, setPaused] = useState(false);
  const featured = CASES.filter((c) => c.featured);
  const items = [...featured, ...featured]; // duplicate for seamless loop

  return (
    <>
      <style>{`
        @keyframes featured-marquee-y {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
      `}</style>
      <aside
        className="hidden lg:block absolute top-0 bottom-0 right-0 w-[200px] pointer-events-none"
        aria-label="Featured works"
        style={{
          borderLeft: '1px solid rgba(250,250,248,0.08)',
        }}
      >
        <div
          className="relative h-full overflow-hidden pointer-events-auto"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
        >
          <div
            className="py-8"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{
              animation: 'featured-marquee-y 45s linear infinite',
              animationPlayState: paused ? 'paused' : 'running',
              willChange: 'transform',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 9,
                letterSpacing: '0.3em',
                color: 'rgba(250,250,248,0.35)',
                textTransform: 'uppercase',
                padding: '0 16px 12px',
              }}
            >
              [ FEATURED · {featured.length} ]
            </div>
            {items.map((c, i) => (
              <Link
                key={`${c.id}-${i}`}
                href={`/${locale}/work/${c.slug}`}
                data-cursor={`▸ VIEW · ${c.id}`}
                data-cursor-variant="link"
                style={{
                  display: 'block',
                  padding: '12px 16px',
                  borderBottom: '1px solid rgba(250,250,248,0.06)',
                  textDecoration: 'none',
                  transition: 'color 0ms, background 0ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(93,211,227,0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 9,
                    letterSpacing: '0.3em',
                    color: '#5DD3E3',
                    marginBottom: 4,
                  }}
                >
                  NO. {c.id}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-display), serif',
                    fontVariationSettings: '"opsz" 14, "wght" 500',
                    fontSize: 13,
                    lineHeight: 1.25,
                    color: 'rgba(250,250,248,0.85)',
                  }}
                >
                  {c.titleEn}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
