'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Case, CasePhoto } from '@/lib/work-data';

interface Props {
  caseItem: Case | null;
  locale: 'zh-TW' | 'en-US';
  spawnPos?: { x: number; y: number } | null;
  onClose: () => void;
}

/**
 * PhotoWindow — Ichiki-style floating OS window.
 *
 * No backdrop, no blur — sits above the grid, page stays fully visible.
 * Spawned near the clicked tile with random-ish offset, not centered.
 */
export default function PhotoWindow({ caseItem, locale, spawnPos, onClose }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const winRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveIdx(0);
  }, [caseItem?.id]);

  useEffect(() => {
    if (!caseItem) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setActiveIdx((i) => Math.min(i + 1, (caseItem.photos.length || 1) - 1));
      if (e.key === 'ArrowLeft') setActiveIdx((i) => Math.max(i - 1, 0));
    };
    const onDocClick = (e: MouseEvent) => {
      if (!winRef.current) return;
      if (winRef.current.contains(e.target as Node)) return;
      // Click outside the window → close. Ignore clicks that originated from tiles;
      // ArchivePage re-opens immediately on tile click anyway.
      onClose();
    };
    window.addEventListener('keydown', onKey);
    // Use capture so we see the click before other handlers stop it
    document.addEventListener('mousedown', onDocClick, true);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDocClick, true);
    };
  }, [caseItem, onClose]);

  if (!caseItem) return null;

  const photo: CasePhoto | undefined = caseItem.photos[activeIdx] ?? caseItem.photos[0];
  const winW = Math.min(720, typeof window !== 'undefined' ? window.innerWidth - 48 : 720);

  // Position: if spawnPos given, offset a bit; otherwise near-center slightly up
  const pos = spawnPos
    ? {
        left: Math.max(24, Math.min(spawnPos.x - winW / 2, (typeof window !== 'undefined' ? window.innerWidth : 1440) - winW - 24)),
        top: Math.max(80, spawnPos.y - 120),
      }
    : {
        left: `calc(50vw - ${winW / 2}px)`,
        top: '14vh',
      };

  return (
    <AnimatePresence>
      {caseItem && (
        <motion.div
          key={caseItem.id}
          ref={winRef}
          role="dialog"
          aria-modal="false"
          aria-label={`${caseItem.titleEn} window`}
          className="fixed"
          style={{
            ...pos,
            width: winW,
            zIndex: 80,
            background: '#0B1026',
            border: '1px solid rgba(93,211,227,0.35)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
          }}
          initial={{ opacity: 0, scale: 0.96, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Title bar */}
          <div
            className="flex items-center gap-3 px-3 py-2"
            style={{
              borderBottom: '1px solid rgba(250,250,248,0.1)',
              background: 'rgba(93,211,227,0.06)',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 9,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
            }}
          >
            {/* Traffic lights */}
            <div className="flex gap-1.5 shrink-0">
              <span
                role="button"
                aria-label="Close window"
                onClick={onClose}
                style={{ width: 10, height: 10, borderRadius: '50%', background: '#E63E1F', cursor: 'pointer' }}
              />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(250,250,248,0.2)' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#5DD3E3' }} />
            </div>

            {/* Title */}
            <span
              className="flex-1 truncate text-center"
              style={{ color: 'rgba(250,250,248,0.75)', textTransform: 'none', letterSpacing: '0.05em', fontSize: 11 }}
            >
              {locale === 'zh-TW' ? caseItem.title : caseItem.titleEn}
            </span>

            {/* Filename */}
            <span className="shrink-0" style={{ color: 'rgba(250,250,248,0.35)' }}>
              {caseItem.id}.{String(activeIdx + 1).padStart(2, '0')}.jpg
            </span>
          </div>

          {/* Body: image viewport */}
          <div
            className="relative"
            style={{
              aspectRatio: '4 / 3',
              background: photo
                ? undefined
                : '#06091A',
              overflow: 'hidden',
            }}
          >
            {photo && <PhotoFill photo={photo} caseId={caseItem.id} />}

            {/* Thumbnail strip — only if >1 photo */}
            {caseItem.photos.length > 1 && (
              <div
                className="absolute left-0 right-0 bottom-0 flex gap-1 px-3 py-2"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }}
              >
                {caseItem.photos.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    data-cursor={`⊡ ${String(i + 1).padStart(2, '0')}`}
                    data-cursor-variant="link"
                    style={{
                      width: 44,
                      height: 32,
                      border: `1px solid ${i === activeIdx ? '#5DD3E3' : 'rgba(250,250,248,0.25)'}`,
                      cursor: 'pointer',
                      padding: 0,
                      background: 'transparent',
                      overflow: 'hidden',
                    }}
                    aria-label={`Photo ${i + 1}`}
                  >
                    <PhotoFill photo={p} caseId={caseItem.id} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer: meta strip + CTA */}
          <div
            className="flex items-center justify-between gap-3 px-3 py-2"
            style={{
              borderTop: '1px solid rgba(250,250,248,0.08)',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 9,
              letterSpacing: '0.22em',
              color: 'rgba(250,250,248,0.6)',
              textTransform: 'uppercase',
            }}
          >
            <span>
              <span style={{ color: '#5DD3E3' }}>[ {caseItem.id} ]</span>{' '}
              · {caseItem.client} · {caseItem.year} · {caseItem.types.join(' / ')}
            </span>
            <Link
              href={`/${locale}/work/${caseItem.slug}`}
              data-cursor={`▸ OPEN · ${caseItem.id}`}
              data-cursor-variant="primary"
              style={{
                color: '#E63E1F',
                border: '1px solid #E63E1F',
                padding: '3px 8px',
                fontSize: 9,
                textDecoration: 'none',
                transition: 'background 0ms, color 0ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#E63E1F';
                e.currentTarget.style.color = '#0B1026';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#E63E1F';
              }}
            >
              OPEN CASE ↗
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PhotoFill({ photo, caseId }: { photo: CasePhoto; caseId: string }) {
  const hueMatch = photo.src.match(/\/(\d+)$/);
  const hue = hueMatch ? parseInt(hueMatch[1], 10) : 15;
  const isPlaceholder = photo.src.startsWith('/api/placeholder/');
  if (!isPlaceholder) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photo.src} alt={photo.alt} className="block w-full h-full object-cover" />;
  }
  return (
    <div
      role="img"
      aria-label={photo.alt}
      className="w-full h-full flex items-end p-3"
      style={{
        background: `linear-gradient(135deg, hsl(${hue}, 48%, 22%) 0%, hsl(${hue + 14}, 36%, 10%) 100%)`,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 8,
          letterSpacing: '0.22em',
          color: 'rgba(250,250,248,0.3)',
          textTransform: 'uppercase',
        }}
      >
        {caseId} · {photo.role}
      </span>
    </div>
  );
}
