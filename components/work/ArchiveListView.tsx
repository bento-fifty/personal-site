'use client';

import { useState } from 'react';
import { Case } from '@/lib/work-data';

interface Props {
  cases: Case[];
  expandedId: string | null;
  onToggle: (id: string) => void;
}

/**
 * ArchiveListView — Corentin-style list overview.
 *
 * Each row: NO. / TITLE / TYPE / YEAR as a single line with hairline dividers.
 * Right side: giant Fraunces letter (first letter of currently displayed archive).
 * Click row → triggers CaseLightbox at parent level.
 */
export default function ArchiveListView({ cases, expandedId, onToggle }: Props) {
  const [hoverLetter, setHoverLetter] = useState<string | null>(null);

  // Compute the big letter: first letter of current filter's title
  const bigLetter = hoverLetter || (cases[0]?.titleEn?.[0]?.toUpperCase() ?? 'A');

  return (
    <div className="relative">
      {/* Giant corner letter (desktop) */}
      <div
        aria-hidden
        className="hidden lg:block fixed right-0 bottom-0 pointer-events-none"
        style={{
          fontFamily: 'var(--font-display), serif',
          fontVariationSettings: '"opsz" 144, "wght" 800',
          fontSize: 'clamp(280px, 32vw, 500px)',
          lineHeight: 0.82,
          color: 'rgba(230,62,31,0.08)',
          letterSpacing: '-0.05em',
          padding: '0 4vw 4vh 0',
          transition: 'color 200ms ease-out',
          zIndex: 0,
        }}
      >
        {bigLetter}
      </div>

      {/* List */}
      <ul
        className="max-w-[1100px] relative z-10"
        style={{ margin: 0, padding: 0, listStyle: 'none' }}
      >
        {cases.map((c, idx) => {
          const expanded = expandedId === c.id;
          return (
            <li key={c.id} style={{ borderBottom: '1px solid rgba(250,250,248,0.08)' }}>
              <button
                type="button"
                onClick={() => onToggle(c.id)}
                onMouseEnter={() => setHoverLetter(c.titleEn[0]?.toUpperCase() ?? null)}
                onMouseLeave={() => setHoverLetter(null)}
                data-cursor={expanded ? '× CLOSE' : `⊡ PEEK · ${c.id}`}
                data-cursor-variant={expanded ? 'action' : 'link'}
                className="group w-full text-left px-5 md:px-8 py-5 flex items-center gap-4 md:gap-8 transition-colors"
                style={{
                  background: expanded ? 'rgba(93,211,227,0.04)' : 'transparent',
                }}
                aria-expanded={expanded}
              >
                {/* NO. */}
                <span
                  className="shrink-0"
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 10,
                    letterSpacing: '0.28em',
                    color: '#5DD3E3',
                    width: 48,
                  }}
                >
                  {c.id}
                </span>
                {/* Title */}
                <span
                  className="flex-1 truncate"
                  style={{
                    fontFamily: 'var(--font-display), serif',
                    fontVariationSettings: '"opsz" 20, "wght" 500',
                    fontSize: 'clamp(15px, 1.3vw, 20px)',
                    color: expanded ? '#5DD3E3' : '#FAFAF8',
                    letterSpacing: '-0.005em',
                    transition: 'color 0ms',
                  }}
                >
                  {c.titleEn}
                </span>
                {/* Type */}
                <span
                  className="hidden md:inline-block shrink-0 text-right"
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 10,
                    letterSpacing: '0.22em',
                    color: 'rgba(250,250,248,0.55)',
                    width: 220,
                  }}
                >
                  {c.types.join(' · ')}
                </span>
                {/* Year */}
                <span
                  className="shrink-0 text-right"
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 10,
                    letterSpacing: '0.22em',
                    color: '#5DD3E3',
                    width: 48,
                  }}
                >
                  {c.year}
                </span>
                {/* Arrow */}
                <span
                  className="shrink-0"
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 12,
                    color: expanded ? '#5DD3E3' : 'rgba(250,250,248,0.3)',
                    width: 16,
                    textAlign: 'right',
                  }}
                >
                  {expanded ? '×' : '→'}
                </span>
              </button>

            </li>
          );
        })}
      </ul>
    </div>
  );
}
