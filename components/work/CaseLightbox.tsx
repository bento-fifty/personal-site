'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Case } from '@/lib/work-data';
import PhotoCluster from './PhotoCluster';

interface Props {
  caseItem: Case | null;
  locale: 'zh-TW' | 'en-US';
  onClose: () => void;
}

/**
 * CaseLightbox — centered modal peek for a Case.
 *
 * Ichiki-style floating overlay, never pushes layout.
 * Close on ESC / backdrop click / × button.
 * Body scroll-lock while open.
 */
export default function CaseLightbox({ caseItem, locale, onClose }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!caseItem) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    // Focus the close button after mount
    const t = setTimeout(() => closeBtnRef.current?.focus(), 50);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [caseItem, onClose]);

  return (
    <AnimatePresence>
      {caseItem && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Preview of ${caseItem.titleEn}`}
          className="fixed inset-0 flex items-center justify-center px-4 md:px-8"
          style={{ zIndex: 200 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Backdrop */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: 'rgba(6,9,26,0.85)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            onClick={onClose}
          />

          {/* Card */}
          <motion.div
            className="relative w-full"
            style={{
              maxWidth: 1040,
              maxHeight: '85vh',
              background: '#0B1026',
              border: '1px solid rgba(93,211,227,0.3)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Top bar */}
            <div
              className="flex items-center justify-between px-5 md:px-7 py-3 shrink-0"
              style={{
                borderBottom: '1px solid rgba(250,250,248,0.08)',
                background: 'rgba(93,211,227,0.04)',
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 10,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
              }}
            >
              <span className="flex items-center gap-3 truncate">
                <span style={{ color: '#5DD3E3' }}>[ PREVIEW · {caseItem.id} ]</span>
                <span style={{ color: 'rgba(250,250,248,0.35)' }}>—</span>
                <span
                  style={{
                    color: 'rgba(250,250,248,0.85)',
                    textTransform: 'none',
                    letterSpacing: '0.06em',
                  }}
                  className="truncate"
                >
                  {caseItem.titleEn}
                </span>
              </span>
              <button
                type="button"
                ref={closeBtnRef}
                onClick={onClose}
                data-cursor="× CLOSE"
                data-cursor-variant="action"
                aria-label="Close preview"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  color: 'rgba(250,250,248,0.7)',
                  background: 'transparent',
                  border: '1px solid rgba(250,250,248,0.2)',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  transition: 'color 120ms, border-color 120ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#5DD3E3';
                  e.currentTarget.style.borderColor = '#5DD3E3';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(250,250,248,0.7)';
                  e.currentTarget.style.borderColor = 'rgba(250,250,248,0.2)';
                }}
              >
                [ × CLOSE ]
              </button>
            </div>

            {/* Scrollable body */}
            <div
              className="overflow-y-auto px-5 md:px-8 py-6 md:py-8"
              style={{ flex: 1 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                {/* Left: meta */}
                <div className="md:col-span-5 flex flex-col gap-3">
                  <h3
                    style={{
                      fontFamily: 'var(--font-display), serif',
                      fontVariationSettings: '"opsz" 36, "wght" 600',
                      fontSize: 'clamp(24px, 2.4vw, 36px)',
                      lineHeight: 1.05,
                      color: '#FAFAF8',
                      letterSpacing: '-0.015em',
                      margin: 0,
                    }}
                  >
                    {locale === 'zh-TW' ? caseItem.title : caseItem.titleEn}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: 10,
                      letterSpacing: '0.22em',
                      color: 'rgba(250,250,248,0.45)',
                    }}
                  >
                    {caseItem.client} · {caseItem.year} · {caseItem.scale}
                  </p>

                  {caseItem.lead && (
                    <p
                      style={{
                        fontFamily: 'var(--font-display), serif',
                        fontVariationSettings: '"opsz" 16, "wght" 400',
                        fontStyle: 'italic',
                        fontSize: 15,
                        lineHeight: 1.55,
                        color: 'rgba(250,250,248,0.8)',
                        marginTop: 4,
                      }}
                    >
                      {locale === 'zh-TW' ? caseItem.lead.zh : caseItem.lead.en}
                    </p>
                  )}

                  {caseItem.stats && caseItem.stats.length > 0 && (
                    <dl
                      className="grid grid-cols-3 gap-4 mt-3"
                      style={{
                        borderTop: '1px solid rgba(250,250,248,0.08)',
                        paddingTop: 14,
                      }}
                    >
                      {caseItem.stats.slice(0, 3).map((s, i) => (
                        <div key={i}>
                          <dt
                            style={{
                              fontFamily: 'var(--font-mono), monospace',
                              fontSize: 9,
                              letterSpacing: '0.3em',
                              color: 'rgba(93,211,227,0.55)',
                              textTransform: 'uppercase',
                              marginBottom: 4,
                            }}
                          >
                            {s.labelEn}
                          </dt>
                          <dd
                            style={{
                              fontFamily: 'var(--font-display), serif',
                              fontVariationSettings: '"opsz" 48, "wght" 700',
                              fontSize: 'clamp(22px, 2vw, 32px)',
                              color: '#5DD3E3',
                              lineHeight: 1,
                              letterSpacing: '-0.02em',
                              margin: 0,
                            }}
                          >
                            {s.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  <Link
                    href={`/${locale}/work/${caseItem.slug}`}
                    data-cursor={`▸ OPEN · ${caseItem.id}`}
                    data-cursor-variant="primary"
                    className="self-start mt-4"
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: 10,
                      letterSpacing: '0.28em',
                      color: '#E63E1F',
                      border: '1px solid #E63E1F',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      transition: 'transform 200ms ease-out, background 0ms, color 0ms',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#E63E1F';
                      e.currentTarget.style.color = '#0B1026';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#E63E1F';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    [ OPEN FULL CASE → ]
                  </Link>
                </div>

                {/* Right: photo cluster */}
                <div className="md:col-span-7">
                  <PhotoCluster
                    photos={caseItem.photos}
                    layout={caseItem.clusterLayout}
                    caseId={caseItem.id}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
