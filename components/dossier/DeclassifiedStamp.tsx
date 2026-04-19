// components/dossier/DeclassifiedStamp.tsx
// Tilted flame-outlined stamp — usable in archive rows, case detail headers,
// or stand-alone. Stage 3 will layer a motion entrance.

export interface DeclassifiedStampProps {
  /** 4-digit year, e.g. "2027" */
  year: string;
  /** Optional quarter, e.g. "Q1" */
  quarter?: string;
  /** CSS rotation in degrees; default -4 */
  rotation?: number;
  className?: string;
}

export default function DeclassifiedStamp({
  year,
  quarter,
  rotation = -4,
  className,
}: DeclassifiedStampProps) {
  const label = quarter ? `${year}.${quarter}` : year;
  return (
    <span
      className={className}
      aria-label={`Declassified ${label}`}
      style={{
        display: 'inline-block',
        border: '2px solid #E63E1F',
        color: '#E63E1F',
        padding: '4px 10px',
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 9,
        letterSpacing: '0.3em',
        fontWeight: 700,
        textTransform: 'uppercase',
        transform: `rotate(${rotation}deg)`,
      }}
    >
      Declassified {label}
    </span>
  );
}
