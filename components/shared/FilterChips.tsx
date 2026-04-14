'use client';

import { EventType, YEARS, EVENT_TYPES, countByType, CASES } from '@/lib/work-data';
import { useMemo } from 'react';

interface Props {
  activeType: EventType | 'ALL';
  activeYear: number | 'ALL';
  onTypeChange: (t: EventType | 'ALL') => void;
  onYearChange: (y: number | 'ALL') => void;
}

export default function FilterChips({
  activeType,
  activeYear,
  onTypeChange,
  onYearChange,
}: Props) {
  const typeCounts = useMemo(
    () => EVENT_TYPES.map((t) => ({ ...t, count: countByType(t.value, activeYear) })),
    [activeYear]
  );

  const yearCounts = useMemo(() => {
    return YEARS.map((y) => ({
      value: y,
      label: y === 'ALL' ? 'ALL' : String(y),
      count:
        y === 'ALL'
          ? CASES.filter((c) => activeType === 'ALL' || c.types.includes(activeType)).length
          : CASES.filter(
              (c) => c.year === y && (activeType === 'ALL' || c.types.includes(activeType))
            ).length,
    }));
  }, [activeType]);

  return (
    <div
      className="border-b-[1px]"
      style={{ borderColor: 'rgba(250,250,248,0.08)' }}
    >
      {/* Type row */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 px-5 md:px-8 py-3">
        <span
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 10,
            letterSpacing: '0.3em',
            color: 'rgba(250,250,248,0.4)',
          }}
        >
          TYPE
        </span>
        {typeCounts.map((t) => {
          const active = activeType === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => onTypeChange(t.value)}
              data-cursor="⊙ FILTER"
              data-cursor-variant="action"
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 10,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: active ? '#0A0A0C' : t.count === 0 ? 'rgba(250,250,248,0.25)' : '#FAFAF8',
                background: active ? '#E63E1F' : 'transparent',
                border: active ? '1px solid #E63E1F' : '1px solid rgba(250,250,248,0.15)',
                padding: '3px 10px',
                cursor: t.count === 0 ? 'not-allowed' : 'pointer',
                transition: 'color 0ms, background 0ms, border-color 200ms ease-out',
              }}
              disabled={t.count === 0 && !active}
            >
              {t.labelEn} ({t.count})
            </button>
          );
        })}
      </div>

      {/* Year row */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 px-5 md:px-8 py-3">
        <span
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 10,
            letterSpacing: '0.3em',
            color: 'rgba(250,250,248,0.4)',
          }}
        >
          YEAR
        </span>
        {yearCounts.map((y) => {
          const active = activeYear === y.value;
          return (
            <button
              key={String(y.value)}
              type="button"
              onClick={() => onYearChange(y.value)}
              data-cursor="⊙ FILTER"
              data-cursor-variant="action"
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 10,
                letterSpacing: '0.22em',
                color: active ? '#0A0A0C' : y.count === 0 ? 'rgba(250,250,248,0.25)' : '#FAFAF8',
                background: active ? '#5DD3E3' : 'transparent',
                border: active ? '1px solid #5DD3E3' : '1px solid rgba(250,250,248,0.15)',
                padding: '3px 10px',
                cursor: y.count === 0 ? 'not-allowed' : 'pointer',
                transition: 'color 0ms, background 0ms, border-color 200ms ease-out',
              }}
              disabled={y.count === 0 && !active}
            >
              {y.label} ({y.count})
            </button>
          );
        })}
      </div>
    </div>
  );
}
