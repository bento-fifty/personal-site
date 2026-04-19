// components/dossier/DossierFooter.tsx
// Merges legacy EditorialFooter (copy-email button, available pulse) with
// new dossier chrome row (— End of Section — / DECLASSIFIED stamp / PG x/07).
// Self-resolves meta via usePathname like DossierHeader.
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from '@/i18n/navigation';
import { resolveDossierMeta, DOSSIER_SECTION_TOTAL } from './pageConfig';

const EMAIL = 'evanchang818@gmail.com';
const AVAIL_CONTEXT = 'Q2·Q3 2026';

export default function DossierFooter() {
  const pathname = usePathname();
  const meta = resolveDossierMeta(pathname);
  const year = new Date().getFullYear();
  const declass = `${year + 1}.Q1`;

  const [copied, setCopied] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [txNow, setTxNow] = useState('');

  useEffect(() => {
    // Compute TX timestamp on client only to avoid SSR/hydration mismatch.
    const iso = new Date()
      .toISOString()
      .replace('T', ' ')
      .slice(0, 19);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTxNow(iso);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
    } catch {
      /* noop */
    }
  };

  return (
    <>
      <style>{`
        @keyframes available-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(93,211,227,0.55); opacity: 1; }
          50%      { box-shadow: 0 0 0 6px rgba(93,211,227,0); opacity: 0.6; }
        }
      `}</style>
      <footer
        aria-label="Dossier footer"
        className="px-5 md:px-8 py-4"
        style={{
          borderTop: '1px solid rgba(250,250,248,0.08)',
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 10,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(250,250,248,0.55)',
        }}
      >
        {/* Row 1 — dossier chrome */}
        <div
          className="flex items-center gap-3 flex-wrap pb-3"
          style={{ borderBottom: '1px dashed rgba(250,250,248,0.08)' }}
        >
          <span>— End of Section —</span>
          <span aria-hidden style={{ color: 'rgba(250,250,248,0.2)' }}>·</span>
          <span
            style={{
              display: 'inline-block',
              border: '1px solid #E63E1F',
              color: '#E63E1F',
              padding: '2px 7px',
              fontSize: 9,
              letterSpacing: '0.3em',
              fontWeight: 700,
              transform: 'rotate(-4deg)',
            }}
          >
            Declassified {declass}
          </span>
          <span aria-hidden style={{ color: 'rgba(250,250,248,0.2)' }}>·</span>
          <span>
            PG {meta.footerSectionIndex} / {String(DOSSIER_SECTION_TOTAL).padStart(2, '0')}
          </span>
        </div>

        {/* Row 2 — available · email · TX · year */}
        <div className="flex items-center gap-3 flex-wrap pt-3">
          <span
            aria-hidden
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              background: '#5DD3E3',
              animation: 'available-pulse 2.4s ease-in-out infinite',
            }}
          />
          <span style={{ color: '#5DD3E3' }}>Available</span>
          <span style={{ color: 'rgba(250,250,248,0.3)' }}>for</span>
          <span style={{ color: 'rgba(250,250,248,0.75)' }}>{AVAIL_CONTEXT}</span>
          <span aria-hidden style={{ color: 'rgba(250,250,248,0.2)' }}>·</span>
          <button
            type="button"
            onClick={copyEmail}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            data-cursor={copied ? '✓ COPIED' : '▸ COPY EMAIL'}
            data-cursor-variant="action"
            aria-label={`Copy email ${EMAIL}`}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'inherit',
              fontSize: 11,
              letterSpacing: '0.22em',
              color: copied ? '#5DD3E3' : 'rgba(250,250,248,0.85)',
              transition: 'color 140ms ease-out',
              textTransform: 'none',
            }}
          >
            {EMAIL}
          </button>
          {(copied || hovering) && (
            <span style={{ color: '#5DD3E3', fontSize: 9, letterSpacing: '0.28em' }}>
              {copied ? '[ ✓ COPIED ]' : '[ ▸ COPY ]'}
            </span>
          )}
          <span aria-hidden style={{ color: 'rgba(250,250,248,0.2)' }}>·</span>
          <span style={{ color: 'rgba(250,250,248,0.35)' }}>TX · {txNow || '—'}</span>
          <span aria-hidden style={{ color: 'rgba(250,250,248,0.2)' }}>·</span>
          <span style={{ color: 'rgba(250,250,248,0.35)' }}>TPE · {year}</span>
        </div>
      </footer>
    </>
  );
}
