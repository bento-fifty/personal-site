// components/dossier/RedactionBar.tsx
// Inline redaction block — hover (optional) to reveal sensitive value.
// Stage 3 will swap the reveal animation for GlitchText decrypt; Stage 1
// uses a simple instant swap so the component stabilizes first.
'use client';

import { useState } from 'react';

export interface RedactionBarProps {
  /** Small label shown before the bar (e.g. "CLIENT"). */
  label: string;
  /** The sensitive value. */
  value: string;
  /** If true (default), hovering reveals the value. */
  revealOnHover?: boolean;
  className?: string;
}

export default function RedactionBar({
  label,
  value,
  revealOnHover = true,
  className,
}: RedactionBarProps) {
  const [revealed, setRevealed] = useState(false);
  const showValue = revealed && revealOnHover;
  const barLen = Math.max(4, value.length);

  return (
    <span
      className={className}
      onMouseEnter={() => revealOnHover && setRevealed(true)}
      onMouseLeave={() => revealOnHover && setRevealed(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 11,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        cursor: revealOnHover ? 'help' : 'default',
      }}
    >
      <span style={{ color: 'rgba(250,250,248,0.55)' }}>{label} ·</span>
      {showValue ? (
        <span style={{ color: '#5DD3E3', transition: 'color 160ms ease-out' }}>
          {value}
        </span>
      ) : (
        <span
          aria-label="redacted"
          style={{
            display: 'inline-block',
            background: '#0B1026',
            color: 'transparent',
            padding: '0 6px',
            minWidth: 60,
            userSelect: 'none',
            letterSpacing: 0,
          }}
        >
          {'\u2588'.repeat(barLen)}
        </span>
      )}
    </span>
  );
}
