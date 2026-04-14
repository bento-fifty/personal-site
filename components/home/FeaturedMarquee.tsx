'use client';

import { useState } from 'react';
import { TransitionLink as Link } from '@/components/shared/RouteTransition';
import { CASES, Case } from '@/lib/work-data';
import PhotoCluster from '@/components/work/PhotoCluster';

interface Props {
  locale: 'zh-TW' | 'en-US';
}

/**
 * FeaturedMarquee — v8 IssueCover right rail (static list, Corentin FW style).
 *
 * Fixed vertical list of featured case titles, no animation.
 * Hovering an item reveals a floating preview card (Ichiki-style small window).
 */
export default function FeaturedMarquee({ locale }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoverY, setHoverY] = useState(0);
  const featured = CASES.filter((c) => c.featured);
  const hovered: Case | undefined = featured.find((c) => c.id === hoveredId);

  return (
    <>
      <aside
        className="hidden lg:block absolute top-0 bottom-0 right-0 w-[220px] pointer-events-none z-[5]"
        aria-label="Featured works"
        style={{
          borderLeft: '1px solid rgba(250,250,248,0.08)',
        }}
      >
        <div className="relative h-full overflow-hidden pointer-events-auto py-10">
          <div
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 9,
              letterSpacing: '0.3em',
              color: '#5DD3E3',
              textTransform: 'uppercase',
              padding: '0 16px 16px',
            }}
          >
            [ FEATURED WORKS · ARCHIVE · ABOUT ]
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {featured.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/${locale}/work/${c.slug}`}
                  data-cursor={`▸ VIEW · ${c.id}`}
                  data-cursor-variant="link"
                  onMouseEnter={(e) => {
                    setHoveredId(c.id);
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoverY(rect.top);
                    e.currentTarget.style.color = '#5DD3E3';
                  }}
                  onMouseLeave={(e) => {
                    setHoveredId(null);
                    e.currentTarget.style.color = 'rgba(250,250,248,0.78)';
                  }}
                  style={{
                    display: 'block',
                    padding: '8px 16px',
                    textDecoration: 'none',
                    color: 'rgba(250,250,248,0.78)',
                    fontFamily: 'var(--font-display), serif',
                    fontVariationSettings: '"opsz" 14, "wght" 500',
                    fontSize: 14,
                    lineHeight: 1.3,
                    transition: 'color 0ms',
                  }}
                >
                  {c.titleEn}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Floating preview card — Ichiki-style mini window */}
      {hovered && (
        <div
          aria-hidden
          className="hidden lg:block fixed pointer-events-none z-[80]"
          style={{
            right: 260,
            top: Math.max(90, Math.min(hoverY - 40, window.innerHeight - 320)),
            width: 320,
            background: '#0B1026',
            border: '1px solid rgba(93,211,227,0.4)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          }}
        >
          {/* Title bar */}
          <div
            className="flex items-center justify-between px-3 py-2"
            style={{
              borderBottom: '1px solid rgba(250,250,248,0.08)',
              background: 'rgba(93,211,227,0.06)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 9,
                letterSpacing: '0.22em',
                color: 'rgba(250,250,248,0.65)',
                textTransform: 'uppercase',
              }}
            >
              {hovered.id}.preview
            </span>
            <div className="flex gap-1">
              <span style={{ width: 6, height: 6, background: '#5DD3E3' }} />
              <span style={{ width: 6, height: 6, background: '#E63E1F' }} />
            </div>
          </div>
          {/* Content */}
          <div className="p-3">
            <div style={{ aspectRatio: '4/3', overflow: 'hidden', marginBottom: 10 }}>
              <PhotoCluster photos={hovered.photos.slice(0, 1)} layout="b" caseId={hovered.id} />
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 9,
                letterSpacing: '0.3em',
                color: '#E63E1F',
                marginBottom: 4,
                textTransform: 'uppercase',
              }}
            >
              NO. {hovered.id}
            </div>
            <h4
              style={{
                fontFamily: 'var(--font-display), serif',
                fontVariationSettings: '"opsz" 22, "wght" 600',
                fontSize: 18,
                lineHeight: 1.15,
                color: '#FAFAF8',
                letterSpacing: '-0.015em',
                marginBottom: 8,
              }}
            >
              {hovered.titleEn}
            </h4>
            <div
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 9,
                letterSpacing: '0.18em',
                color: 'rgba(93,211,227,0.75)',
                textTransform: 'uppercase',
              }}
            >
              {hovered.year} · {hovered.scale}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
