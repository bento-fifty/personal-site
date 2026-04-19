// components/dossier/CaseBadge.tsx
// Small chip shown on case cards / case links in the archive.

export interface CaseBadgeProps {
  caseId: string;
  /** "declassified" = flame dot, paper-side styling (default);
   *  "active" = ice dot, used for in-progress cases */
  status?: 'declassified' | 'active';
  className?: string;
}

export default function CaseBadge({
  caseId,
  status = 'declassified',
  className,
}: CaseBadgeProps) {
  const isActive = status === 'active';
  return (
    <span
      className={className}
      aria-label={`Case ${caseId}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 9,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: isActive ? '#5DD3E3' : 'rgba(250,250,248,0.72)',
        border: `1px solid ${isActive ? 'rgba(93,211,227,0.4)' : 'rgba(250,250,248,0.15)'}`,
        padding: '2px 7px',
      }}
    >
      <span aria-hidden style={{ color: isActive ? '#5DD3E3' : '#E63E1F' }}>●</span>
      CASE · {caseId}
    </span>
  );
}
