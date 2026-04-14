'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Fake case data for the wall
const WALL_CASES = [
  { id: '01', title: 'Brand Launch', sub: '品牌發佈會', tag: 'BRAND', year: '2025' },
  { id: '02', title: 'Music Festival', sub: '音樂祭', tag: 'EVENT', year: '2025' },
  { id: '03', title: 'Corporate Summit', sub: '企業年會', tag: 'CORP', year: '2024' },
  { id: '04', title: 'Pop-Up Experience', sub: '快閃體驗', tag: 'BRAND', year: '2024' },
  { id: '05', title: 'Press Conference', sub: '記者會', tag: 'EVENT', year: '2024' },
  { id: '06', title: 'Product Reveal', sub: '新品發表', tag: 'BRAND', year: '2025' },
  { id: '07', title: 'Charity Gala', sub: '慈善晚宴', tag: 'EVENT', year: '2023' },
  { id: '08', title: 'Tech Conference', sub: '科技論壇', tag: 'CORP', year: '2025' },
];

interface CaseCardProps {
  c: typeof WALL_CASES[0];
  onClick: () => void;
}

function CaseCard({ c, onClick }: CaseCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-[220px] h-[140px] md:w-[280px] md:h-[170px] relative overflow-hidden group cursor-pointer"
      style={{ background: '#0A0A0C', borderRadius: '4px' }}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(135deg, rgba(230,62,31,0.15) 0%, transparent 60%)' }} />

      {/* Content */}
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '8px', letterSpacing: '0.2em', color: 'rgba(250,250,248,0.3)' }}>
            {c.tag}
          </span>
          <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '8px', color: 'rgba(250,250,248,0.2)' }}>
            {c.year}
          </span>
        </div>
        <div>
          <h4 style={{ fontFamily: 'var(--font-heading), Georgia, serif', fontSize: 'clamp(14px, 1.5vw, 20px)', fontWeight: 600, color: '#FAFAF8', lineHeight: 1.2 }}>
            {c.title}
          </h4>
          <p style={{ fontFamily: 'var(--font-noto-serif-tc), serif', fontSize: '11px', color: 'rgba(250,250,248,0.35)', marginTop: 4 }}>
            {c.sub}
          </p>
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute bottom-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ borderRight: '2px solid #E63E1F', borderBottom: '2px solid #E63E1F' }} />
    </button>
  );
}

// Folder modal for expanded case
function CaseFolder({ c, onClose }: { c: typeof WALL_CASES[0]; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0A0A0C]/90 backdrop-blur-sm" />

      {/* Folder card */}
      <motion.div
        className="relative w-[90vw] max-w-[700px] border overflow-hidden"
        style={{ background: '#0A0A0C', borderColor: 'rgba(230,62,31,0.3)', borderRadius: '4px' }}
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Tab */}
        <div className="px-6 py-3 border-b flex justify-between items-center" style={{ borderColor: 'rgba(230,62,31,0.15)' }}>
          <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '9px', letterSpacing: '0.3em', color: '#E63E1F' }}>
            CASE #{c.id}
          </span>
          <button onClick={onClose} style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', color: 'rgba(250,250,248,0.4)', letterSpacing: '0.15em' }}>
            [ CLOSE ]
          </button>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          <h2 style={{ fontFamily: 'var(--font-heading), Georgia, serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 600, color: '#FAFAF8', lineHeight: 1.15 }}>
            {c.title}
          </h2>
          <p style={{ fontFamily: 'var(--font-noto-serif-tc), serif', fontSize: '16px', color: 'rgba(250,250,248,0.4)', marginTop: 8 }}>
            {c.sub}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '8px', letterSpacing: '0.2em', color: 'rgba(250,250,248,0.25)', marginBottom: 4 }}>TYPE</p>
              <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '12px', color: '#E63E1F' }}>{c.tag}</p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '8px', letterSpacing: '0.2em', color: 'rgba(250,250,248,0.25)', marginBottom: 4 }}>YEAR</p>
              <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '12px', color: 'rgba(250,250,248,0.7)' }}>{c.year}</p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '8px', letterSpacing: '0.2em', color: 'rgba(250,250,248,0.25)', marginBottom: 4 }}>CLIENT</p>
              <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '12px', color: 'rgba(250,250,248,0.7)' }}>Confidential</p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '8px', letterSpacing: '0.2em', color: 'rgba(250,250,248,0.25)', marginBottom: 4 }}>LOCATION</p>
              <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '12px', color: 'rgba(250,250,248,0.7)' }}>Taipei, Taiwan</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t" style={{ borderColor: 'rgba(250,250,248,0.06)' }}>
            <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '8px', letterSpacing: '0.2em', color: 'rgba(250,250,248,0.25)', marginBottom: 8 }}>BRIEF</p>
            <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: '14px', color: 'rgba(250,250,248,0.5)', lineHeight: 1.7 }}>
              A comprehensive event experience designed to create lasting impressions. From concept to execution, every detail was meticulously crafted to align with the brand&apos;s vision and audience expectations.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CaseWall() {
  const [selectedCase, setSelectedCase] = useState<typeof WALL_CASES[0] | null>(null);

  // Duplicate cases for seamless loop
  const row1 = [...WALL_CASES, ...WALL_CASES];
  const row2 = [...WALL_CASES.slice(3), ...WALL_CASES.slice(0, 3), ...WALL_CASES.slice(3), ...WALL_CASES.slice(0, 3)];
  const row3 = [...WALL_CASES.slice(5), ...WALL_CASES.slice(0, 5), ...WALL_CASES.slice(5), ...WALL_CASES.slice(0, 5)];

  return (
    <>
      <div className="py-12" style={{ background: '#0A0A0C' }}>
        {/* Section label */}
        <div className="px-8 md:px-16 mb-8">
          <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(93,211,227,0.8)', textTransform: 'uppercase' }}>
            [ 02 ] Case Archive
          </p>
        </div>

        {/* Row 1 — left, fast */}
        <div className="overflow-hidden mb-3">
          <div className="flex gap-3" style={{ animation: 'marquee 30s linear infinite', width: 'max-content' }}>
            {row1.map((c, i) => (
              <CaseCard key={`r1-${i}`} c={c} onClick={() => setSelectedCase(c)} />
            ))}
          </div>
        </div>

        {/* Row 2 — right, slow */}
        <div className="overflow-hidden mb-3">
          <div className="flex gap-3" style={{ animation: 'marquee 50s linear infinite reverse', width: 'max-content' }}>
            {row2.map((c, i) => (
              <CaseCard key={`r2-${i}`} c={c} onClick={() => setSelectedCase(c)} />
            ))}
          </div>
        </div>

        {/* Row 3 — left, medium */}
        <div className="overflow-hidden">
          <div className="flex gap-3" style={{ animation: 'marquee 40s linear infinite', width: 'max-content' }}>
            {row3.map((c, i) => (
              <CaseCard key={`r3-${i}`} c={c} onClick={() => setSelectedCase(c)} />
            ))}
          </div>
        </div>
      </div>

      {/* Folder modal */}
      <AnimatePresence>
        {selectedCase && (
          <CaseFolder c={selectedCase} onClose={() => setSelectedCase(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
