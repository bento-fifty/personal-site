'use client';

import { Case, CasePhoto } from '@/lib/work-data';

interface Props {
  cases: Case[];
  activeId: string | null;
  onSelect: (id: string, tileCenter: { x: number; y: number }) => void;
}

/**
 * PhotoGridView — visual browsing mode (Ichiki works page).
 *
 * 3-4 col responsive grid of hero photos. No inline expand — click opens a
 * PhotoWindow at the parent level, anchored near the clicked tile.
 */
export default function PhotoGridView({ cases, activeId, onSelect }: Props) {
  return (
    <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-10">
      <div
        className="grid gap-3 md:gap-4"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))',
        }}
      >
        {cases.map((c) => {
          const hero: CasePhoto =
            c.photos.find((p) => p.role === 'hero') ?? c.photos[0];
          const hueMatch = hero?.src.match(/\/(\d+)$/);
          const hue = hueMatch ? parseInt(hueMatch[1], 10) : 15;
          const isActive = activeId === c.id;

          return (
            <button
              key={c.id}
              type="button"
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                onSelect(c.id, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
              }}
              data-cursor={`↗ VIEW · ${c.id}`}
              data-cursor-variant="link"
              aria-label={`View ${c.titleEn}`}
              className="group relative block text-left overflow-hidden"
              style={{
                aspectRatio: '4 / 3',
                background: `linear-gradient(135deg, hsl(${hue}, 48%, 22%) 0%, hsl(${hue + 14}, 36%, 10%) 100%)`,
                border: isActive ? '1px solid #5DD3E3' : '1px solid rgba(250,250,248,0.08)',
                padding: 0,
                cursor: 'pointer',
                transition: 'border-color 160ms ease-out, transform 200ms ease-out, filter 200ms ease-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#5DD3E3';
                e.currentTarget.style.filter = 'brightness(1.12)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.borderColor = 'rgba(250,250,248,0.08)';
                e.currentTarget.style.filter = 'brightness(1)';
              }}
            >
              {hero && !hero.src.startsWith('/api/placeholder/') && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={hero.src} alt={hero.alt} className="absolute inset-0 w-full h-full object-cover" />
              )}

              {/* Gradient overlay for text legibility */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(6,9,26,0.85) 0%, rgba(6,9,26,0) 55%)',
                }}
              />

              {/* Top-right VIEW chip */}
              <span
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 8,
                  letterSpacing: '0.22em',
                  color: '#5DD3E3',
                  border: '1px solid #5DD3E3',
                  padding: '2px 6px',
                  background: 'rgba(11,16,38,0.7)',
                  textTransform: 'uppercase',
                  transition: 'opacity 160ms ease-out',
                }}
              >
                ↗ VIEW
              </span>

              {/* Bottom meta */}
              <div
                className="absolute left-0 right-0 bottom-0 px-3 py-2 flex items-baseline gap-2"
                style={{ textTransform: 'uppercase' }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 9,
                    letterSpacing: '0.28em',
                    color: '#5DD3E3',
                  }}
                >
                  {c.id}
                </span>
                <span
                  className="flex-1 truncate"
                  style={{
                    fontFamily: 'var(--font-display), serif',
                    fontVariationSettings: '"opsz" 18, "wght" 500',
                    fontSize: 14,
                    letterSpacing: '-0.005em',
                    color: '#FAFAF8',
                    textTransform: 'none',
                  }}
                >
                  {c.titleEn}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
