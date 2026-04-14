'use client';

import { useState } from 'react';
import { TransitionLink as Link } from '@/components/shared/RouteTransition';
import { CASES } from '@/lib/work-data';

interface Props {
  locale: 'zh-TW' | 'en-US';
}

/**
 * ArchiveMarquee — Corentin-style right rail.
 *
 * Vertical infinite marquee of all case titles. Hover to pause.
 * Each row acts as link to /work/[slug].
 */
export default function ArchiveMarquee({ locale }: Props) {
  const [paused, setPaused] = useState(false);
  // Duplicate list so marquee loops seamlessly
  const items = [...CASES, ...CASES];

  return (
    <>
      <style>{`
        @keyframes archive-marquee-y {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
      `}</style>
      <aside
        aria-hidden="true"
        className="hidden lg:block fixed right-0 top-8 bottom-0 w-[220px] pointer-events-none z-[40]"
        style={{
          borderLeft: '1px solid rgba(250,250,248,0.08)',
          background: 'linear-gradient(to bottom, rgba(10,10,12,0.95) 0%, rgba(10,10,12,0.6) 8%, rgba(10,10,12,0.6) 92%, rgba(10,10,12,0.95) 100%)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      >
        <div className="relative h-full overflow-hidden pointer-events-auto">
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{
              animation: 'archive-marquee-y 60s linear infinite',
              animationPlayState: paused ? 'paused' : 'running',
              willChange: 'transform',
            }}
          >
            {items.map((c, i) => (
              <Link
                key={`${c.id}-${i}`}
                href={`/${locale}/work/${c.slug}`}
                data-cursor={`VIEW · ${c.id}`}
                style={{
                  display: 'block',
                  padding: '14px 16px',
                  borderBottom: '1px solid rgba(250,250,248,0.06)',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 11,
                  letterSpacing: '0.12em',
                  color: 'rgba(250,250,248,0.65)',
                  textDecoration: 'none',
                  transition: 'color 0ms, background 0ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#E63E1F';
                  e.currentTarget.style.background = 'rgba(230,62,31,0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(250,250,248,0.65)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ fontSize: 9, letterSpacing: '0.3em', color: 'rgba(250,250,248,0.3)', marginBottom: 4 }}>
                  NO. {c.id}
                </div>
                <div>{c.titleEn}</div>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
