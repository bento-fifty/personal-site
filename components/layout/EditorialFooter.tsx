'use client';

import { useEffect, useState } from 'react';

const EMAIL = 'evanchang818@gmail.com';
const AVAIL_CONTEXT = 'Q2·Q3 2026';

export default function EditorialFooter() {
  const year = new Date().getFullYear();
  const [copied, setCopied] = useState(false);
  const [hovering, setHovering] = useState(false);

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
        {/* Left: status + context */}
        <div className="flex items-center gap-3">
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
        </div>

        {/* Right: clickable email (click = copy) */}
        <button
          type="button"
          onClick={copyEmail}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          data-cursor={copied ? '✓ COPIED' : '▸ COPY EMAIL'}
          data-cursor-variant="action"
          className="group flex items-center gap-3"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 11,
            letterSpacing: '0.22em',
            color: copied ? '#5DD3E3' : 'rgba(250,250,248,0.85)',
            transition: 'color 140ms ease-out',
          }}
          aria-label={`Copy email ${EMAIL}`}
        >
          <span style={{ textTransform: 'none', letterSpacing: '0.05em' }}>
            {EMAIL}
          </span>
          <span
            aria-hidden
            style={{
              fontSize: 9,
              letterSpacing: '0.28em',
              color: copied ? '#5DD3E3' : '#5DD3E3',
              opacity: copied || hovering ? 1 : 0,
              transition: 'opacity 160ms ease-out',
              minWidth: 72,
              textAlign: 'left',
            }}
          >
            {copied ? '[ ✓ COPIED ]' : '[ ▸ COPY ]'}
          </span>
          <span
            aria-hidden
            style={{ color: 'rgba(250,250,248,0.25)' }}
          >
            ·
          </span>
          <span style={{ color: 'rgba(250,250,248,0.35)' }}>TPE · {year}</span>
        </button>
      </footer>
    </>
  );
}
