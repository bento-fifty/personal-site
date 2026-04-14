'use client';

import { Case } from '@/lib/work-data';
import PhotoCluster from './PhotoCluster';
import GridRevealRow from '@/components/shared/GridRevealRow';
import InlineWindowCard from './InlineWindowCard';
import Link from 'next/link';

interface Props {
  caseItem: Case;
  locale: 'zh-TW' | 'en-US';
  expanded: boolean;
  onToggle: () => void;
}

export default function EventBentoRow({ caseItem: c, locale, expanded, onToggle }: Props) {
  return (
    <GridRevealRow cols={10} rows={4}>
      <div
        className="max-w-[1280px] mx-auto px-5 md:px-8 py-10 md:py-14 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start"
      >
        {/* Left: metadata */}
        <div className="md:col-span-4 flex flex-col">
          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 11,
              letterSpacing: '0.3em',
              color: '#5DD3E3',
              marginBottom: 12,
            }}
          >
            [ {c.id} ]
          </span>
          <h3
            className="font-display"
            style={{
              fontFamily: 'var(--font-display), serif',
              fontVariationSettings: '"opsz" 48, "wght" 700',
              fontSize: 'clamp(28px, 3vw, 44px)',
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              color: '#FAFAF8',
              marginBottom: 4,
            }}
          >
            {c.titleEn}
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 10,
              letterSpacing: '0.22em',
              color: 'rgba(250,250,248,0.45)',
              marginBottom: 20,
            }}
          >
            {c.title}
          </p>

          <div
            style={{
              borderTop: '1px solid rgba(250,250,248,0.08)',
              paddingTop: 12,
              marginBottom: 20,
            }}
          >
            <dl
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 10,
                letterSpacing: '0.18em',
                color: 'rgba(250,250,248,0.7)',
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                rowGap: 6,
              }}
            >
              <dt style={{ color: 'rgba(93,211,227,0.65)', fontSize: 9, letterSpacing: '0.3em' }}>CLIENT</dt>
              <dd>{c.client}</dd>
              <dt style={{ color: 'rgba(93,211,227,0.65)', fontSize: 9, letterSpacing: '0.3em' }}>YEAR</dt>
              <dd>{c.year}</dd>
              <dt style={{ color: 'rgba(93,211,227,0.65)', fontSize: 9, letterSpacing: '0.3em' }}>SCALE</dt>
              <dd>{c.scale}</dd>
              <dt style={{ color: 'rgba(93,211,227,0.65)', fontSize: 9, letterSpacing: '0.3em' }}>TYPE</dt>
              <dd>{c.types.join(' / ')}</dd>
              <dt style={{ color: 'rgba(93,211,227,0.65)', fontSize: 9, letterSpacing: '0.3em' }}>ROLE</dt>
              <dd>{c.roles.join(' · ')}</dd>
              <dt style={{ color: 'rgba(93,211,227,0.65)', fontSize: 9, letterSpacing: '0.3em' }}>VENUE</dt>
              <dd>{c.venue}</dd>
            </dl>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={onToggle}
              data-cursor={expanded ? '× CLOSE' : `⊡ PEEK · ${c.id}`}
              data-cursor-variant="link"
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 10,
                letterSpacing: '0.28em',
                color: '#5DD3E3',
                border: '1px solid #5DD3E3',
                padding: '8px 12px',
                background: 'transparent',
                cursor: 'pointer',
                transition: 'transform 200ms ease-out, background 0ms, color 0ms, border-color 0ms',
              }}
              aria-expanded={expanded}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#5DD3E3';
                e.currentTarget.style.color = '#0A0A0C';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#5DD3E3';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              [ {expanded ? '× CLOSE PEEK' : 'PEEK →'} ]
            </button>
            <Link
              href={`/${locale}/work/${c.slug}`}
              data-cursor={`▸ OPEN · ${c.id}`}
              data-cursor-variant="primary"
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
                e.currentTarget.style.color = '#0A0A0C';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#E63E1F';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              [ OPEN CASE FILE → ]
            </Link>
          </div>
        </div>

        {/* Right: photo cluster */}
        <div className="md:col-span-8">
          <PhotoCluster photos={c.photos} layout={c.clusterLayout} caseId={c.id} />
        </div>
      </div>

      {expanded && <InlineWindowCard caseItem={c} locale={locale} onClose={onToggle} />}
    </GridRevealRow>
  );
}
