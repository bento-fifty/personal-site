'use client';

import { useMemo, useState } from 'react';
import DraggableWindow from '@/components/shared/DraggableWindow';

type Budget = 'under-1m' | '1-3m' | '3-10m' | '10m-plus';
type Scale = 'under-500' | '500-2000' | '2000-plus';
type Kind = 'BRAND' | 'CONFERENCE' | 'POPUP' | 'LAUNCH' | 'GALA' | 'CORPORATE';

const BUDGETS: { key: Budget; label: string }[] = [
  { key: 'under-1m', label: '< 1M' },
  { key: '1-3m', label: '1–3M' },
  { key: '3-10m', label: '3–10M' },
  { key: '10m-plus', label: '10M+' },
];
const SCALES: { key: Scale; label: string }[] = [
  { key: 'under-500', label: '< 500' },
  { key: '500-2000', label: '500–2000' },
  { key: '2000-plus', label: '2000+' },
];
const KINDS: Kind[] = ['BRAND', 'CONFERENCE', 'POPUP', 'LAUNCH', 'GALA', 'CORPORATE'];

type Verdict = 'FIT' | 'LETS_TALK' | 'OUT_OF_SCOPE' | null;

function verdictOf(b: Budget | null, s: Scale | null, k: Kind | null): Verdict {
  if (!b || !s || !k) return null;
  // Out of scope: tiny budget + big scale
  if (b === 'under-1m' && s === '2000-plus') return 'OUT_OF_SCOPE';
  // Clear fit: solid budget + matched scale
  if ((b === '3-10m' || b === '10m-plus') && s !== 'under-500') return 'FIT';
  if (b === '1-3m' && s === '500-2000') return 'FIT';
  return 'LETS_TALK';
}

const VERDICT_COPY: Record<NonNullable<Verdict>, { label: string; color: string; note: string }> = {
  FIT: {
    label: 'FIT',
    color: '#5DD3E3',
    note: 'Budget + scale aligned. Drop an email, we move fast.',
  },
  LETS_TALK: {
    label: "LET'S TALK",
    color: '#E63E1F',
    note: 'Workable with scope trim or upscale. Let\'s compare notes.',
  },
  OUT_OF_SCOPE: {
    label: 'OUT OF SCOPE',
    color: 'rgba(250,250,248,0.45)',
    note: 'Scale/budget mismatch. I can refer a partner who fits.',
  },
};

export default function FitCheckWindow({
  initialX,
  initialY,
  rotate,
}: {
  initialX: number;
  initialY: number;
  rotate?: number;
}) {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [scale, setScale] = useState<Scale | null>(null);
  const [kind, setKind] = useState<Kind | null>(null);

  const verdict = useMemo(() => verdictOf(budget, scale, kind), [budget, scale, kind]);
  const copy = verdict ? VERDICT_COPY[verdict] : null;

  return (
    <DraggableWindow
      title="fit-check.app"
      filename="calc.042"
      initialX={initialX}
      initialY={initialY}
      width={300}
      rotate={rotate}
      accent="#E63E1F"
    >
      <div
        className="p-4 space-y-3"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 9,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
        }}
      >
        {/* Budget */}
        <Section label="Budget NTD">
          {BUDGETS.map((b) => (
            <PillBtn key={b.key} active={budget === b.key} onClick={() => setBudget(b.key)}>
              {b.label}
            </PillBtn>
          ))}
        </Section>

        {/* Scale */}
        <Section label="Scale">
          {SCALES.map((s) => (
            <PillBtn key={s.key} active={scale === s.key} onClick={() => setScale(s.key)}>
              {s.label}
            </PillBtn>
          ))}
        </Section>

        {/* Kind */}
        <Section label="Type">
          {KINDS.map((k) => (
            <PillBtn key={k} active={kind === k} onClick={() => setKind(k)}>
              {k}
            </PillBtn>
          ))}
        </Section>

        {/* Verdict */}
        <div
          style={{
            borderTop: '1px solid rgba(250,250,248,0.08)',
            paddingTop: 12,
            minHeight: 64,
          }}
        >
          {copy ? (
            <>
              <div
                style={{
                  fontFamily: 'var(--font-display), serif',
                  fontVariationSettings: '"opsz" 48, "wght" 700',
                  fontSize: 22,
                  color: copy.color,
                  letterSpacing: '-0.01em',
                  textTransform: 'uppercase',
                  marginBottom: 4,
                  lineHeight: 1,
                }}
              >
                → {copy.label}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 10,
                  letterSpacing: '0.02em',
                  textTransform: 'none',
                  color: 'rgba(250,250,248,0.7)',
                  lineHeight: 1.4,
                }}
              >
                {copy.note}
              </div>
            </>
          ) : (
            <div style={{ color: 'rgba(250,250,248,0.35)' }}>[ AWAITING INPUT ]</div>
          )}
        </div>
      </div>
    </DraggableWindow>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ color: 'rgba(93,211,227,0.65)', marginBottom: 6, fontSize: 8 }}>
        &gt; {label}
      </div>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  );
}

function PillBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="⊙ SELECT"
      data-cursor-variant="action"
      style={{
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 9,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        padding: '3px 7px',
        border: `1px solid ${active ? '#E63E1F' : 'rgba(250,250,248,0.18)'}`,
        background: active ? '#E63E1F' : 'transparent',
        color: active ? '#0B1026' : '#FAFAF8',
        cursor: 'pointer',
        transition: 'background 0ms, color 0ms, border-color 120ms',
      }}
    >
      {children}
    </button>
  );
}
