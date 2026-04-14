'use client';

import { useEffect, useState } from 'react';

const EMAIL = 'evanchang818@gmail.com';

export default function EditorialFooter() {
  const year = new Date().getFullYear();
  const [copied, setCopied] = useState(false);

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
      // silently fail on unsupported browsers
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
        className="px-5 md:px-8 py-5 flex items-center justify-between flex-wrap gap-4"
        style={{
          borderTop: '1px solid rgba(250,250,248,0.08)',
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 10,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(250,250,248,0.55)',
        }}
      >
        {/* Left: Available LED + principal + copy email */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2" aria-label="Currently available">
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
          </span>
          <span style={{ color: 'rgba(250,250,248,0.35)' }}>·</span>
          <span className="tracking-[0.22em]">Evan Chang</span>
          <span style={{ color: 'rgba(250,250,248,0.35)' }}>·</span>
          <button
            type="button"
            onClick={copyEmail}
            data-cursor={copied ? '✓ COPIED' : '▸ COPY EMAIL'}
            data-cursor-variant="action"
            className="flex items-center gap-2 group"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 10,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: copied ? '#5DD3E3' : 'rgba(250,250,248,0.85)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'color 120ms ease-out',
            }}
            aria-label={`Copy email ${EMAIL}`}
          >
            <span style={{ textTransform: 'none', letterSpacing: '0.05em', fontSize: 11 }}>
              {EMAIL}
            </span>
            <span
              style={{
                fontSize: 9,
                border: `1px solid ${copied ? '#5DD3E3' : 'rgba(250,250,248,0.35)'}`,
                padding: '2px 6px',
                letterSpacing: '0.2em',
                color: copied ? '#5DD3E3' : 'rgba(250,250,248,0.5)',
                transition: 'border-color 120ms, color 120ms',
              }}
            >
              {copied ? '[ ✓ ]' : '[ COPY ]'}
            </span>
          </button>
        </div>

        {/* Right: Taipei + year */}
        <div className="flex items-center gap-4" style={{ color: 'rgba(250,250,248,0.45)' }}>
          <span>Taipei</span>
          <span style={{ color: 'rgba(250,250,248,0.25)' }}>·</span>
          <span>{year}</span>
        </div>
      </footer>
    </>
  );
}
