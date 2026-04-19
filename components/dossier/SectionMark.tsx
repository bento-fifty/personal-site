// components/dossier/SectionMark.tsx
// Large in-page section marker — e.g. `§ 02.3  ·  EXECUTION`.
// Used to head sub-sections inside a page, NOT in the top chrome.

export interface SectionMarkProps {
  /** e.g. "02.3" */
  mark: string;
  /** e.g. "EXECUTION" */
  label: string;
  className?: string;
}

export default function SectionMark({ mark, label, className }: SectionMarkProps) {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: 10,
        fontFamily: 'var(--font-mono), monospace',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
      }}
    >
      <span style={{ fontSize: 13, letterSpacing: '0.15em', color: '#E63E1F' }}>
        § {mark}
      </span>
      <span aria-hidden style={{ color: 'rgba(250,250,248,0.3)', fontSize: 11 }}>·</span>
      <span style={{ fontSize: 10, color: 'rgba(250,250,248,0.78)' }}>{label}</span>
    </div>
  );
}
