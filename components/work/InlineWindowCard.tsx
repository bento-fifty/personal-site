'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Case } from '@/lib/work-data';
import PhotoCluster from './PhotoCluster';

interface Props {
  caseItem: Case;
  locale: 'zh-TW' | 'en-US';
  onClose: () => void;
}

export default function InlineWindowCard({ caseItem: c, locale, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="relative"
      style={{
        background: '#060608',
        borderTop: '1px solid rgba(250,250,248,0.08)',
        borderBottom: '1px solid rgba(250,250,248,0.08)',
        padding: '32px 20px',
        overflow: 'hidden',
      }}
      role="region"
      aria-label={`Preview of ${c.titleEn}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-5"
        data-cursor="CLOSE"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 10,
          letterSpacing: '0.22em',
          color: 'rgba(250,250,248,0.55)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        [ × CLOSE ]
      </button>

      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
        <div className="md:col-span-4 flex flex-col gap-3">
          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 10,
              letterSpacing: '0.3em',
              color: '#E63E1F',
            }}
          >
            [ PREVIEW · {c.id} ]
          </span>
          <h3
            className="font-display"
            style={{
              fontFamily: 'var(--font-display), serif',
              fontVariationSettings: '"opsz" 36, "wght" 600',
              fontSize: 'clamp(24px, 2.2vw, 36px)',
              lineHeight: 1.1,
              color: '#FAFAF8',
              letterSpacing: '-0.015em',
            }}
          >
            {locale === 'zh-TW' ? c.title : c.titleEn}
          </h3>
          {c.lead && (
            <p
              style={{
                fontFamily: 'var(--font-display), serif',
                fontVariationSettings: '"opsz" 16, "wght" 400',
                fontStyle: 'italic',
                fontSize: 14,
                lineHeight: 1.5,
                color: 'rgba(250,250,248,0.75)',
              }}
            >
              {locale === 'zh-TW' ? c.lead.zh : c.lead.en}
            </p>
          )}

          {/* Stats — ice Fraunces (v8 color strategy: ice for data) */}
          {c.stats && c.stats.length > 0 && (
            <dl
              className="grid grid-cols-3 gap-4 mt-2"
              style={{ borderTop: '1px solid rgba(250,250,248,0.08)', paddingTop: 12 }}
            >
              {c.stats.slice(0, 3).map((s, i) => (
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
                    }}
                  >
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <Link
            href={`/${locale}/work/${c.slug}`}
            data-cursor={`▸ OPEN · ${c.id}`}
            data-cursor-variant="primary"
            className="self-start mt-2"
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
        <div className="md:col-span-8">
          <PhotoCluster photos={c.photos} layout={c.clusterLayout} caseId={c.id} />
        </div>
      </div>
    </div>
  );
}
