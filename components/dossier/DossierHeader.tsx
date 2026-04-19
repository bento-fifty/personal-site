// components/dossier/DossierHeader.tsx
'use client';

import { usePathname } from '@/i18n/navigation';
import { CASES } from '@/lib/work-data';
import { resolveDossierMeta } from './pageConfig';

export default function DossierHeader() {
  const pathname = usePathname();
  const meta = resolveDossierMeta(pathname);
  const caseTotal = String(CASES.length).padStart(3, '0');

  return (
    <header
      aria-label="Dossier header"
      data-dossier-section={meta.sectionIndex}
      className="px-5 md:px-8 py-3"
      style={{
        borderBottom: '1px solid rgba(250,250,248,0.08)',
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 10,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'rgba(250,250,248,0.55)',
      }}
    >
      {/* Row 1 — studio · CASE */}
      <div className="flex items-center gap-3 flex-wrap">
        <span style={{ color: 'rgba(250,250,248,0.78)' }}>
          The Level Studio · TPE
        </span>
        <span aria-hidden style={{ color: 'rgba(250,250,248,0.25)' }}>/</span>
        <span>CASE · {meta.caseId} / {caseTotal}</span>
      </div>
      {/* Row 2 — § section · CLEARANCE */}
      <div className="flex items-center gap-3 flex-wrap mt-1.5">
        <span>§ {meta.sectionIndex} · {meta.sectionName}</span>
        <span aria-hidden style={{ color: 'rgba(250,250,248,0.25)' }}>/</span>
        <span>
          Clearance · <span style={{ color: '#E63E1F' }}>A</span>
        </span>
      </div>
    </header>
  );
}
