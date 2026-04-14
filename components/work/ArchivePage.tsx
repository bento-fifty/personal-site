'use client';

import { useMemo, useState } from 'react';
import { CASES, EventType, countByType } from '@/lib/work-data';
import FilterChips from '@/components/shared/FilterChips';
import EventBentoRow from './EventBentoRow';
import ArchiveMarquee from './ArchiveMarquee';

interface Props {
  locale: 'zh-TW' | 'en-US';
}

export default function ArchivePage({ locale }: Props) {
  const [activeType, setActiveType] = useState<EventType | 'ALL'>('ALL');
  const [activeYear, setActiveYear] = useState<number | 'ALL'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return CASES.filter((c) => {
      const typeMatch = activeType === 'ALL' || c.types.includes(activeType);
      const yearMatch = activeYear === 'ALL' || c.year === activeYear;
      return typeMatch && yearMatch;
    });
  }, [activeType, activeYear]);

  const totalCount = countByType('ALL');

  const toggleExpand = (id: string) => {
    setExpandedId((curr) => (curr === id ? null : id));
  };

  return (
    <>
      {/* Archive hero band */}
      <section
        className="relative px-5 md:px-8 pt-16 md:pt-24 pb-10"
        style={{
          borderBottom: '4px solid rgba(250,250,248,0.08)',
        }}
      >
        <div className="max-w-[1280px] mx-auto lg:pr-[240px]">
          <p
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 10,
              letterSpacing: '0.3em',
              color: 'rgba(250,250,248,0.4)',
              marginBottom: 16,
            }}
          >
            [ ISSUE N°003 · SECTION 02 ]
          </p>
          <h1
            className="font-display"
            style={{
              fontFamily: 'var(--font-display), serif',
              fontVariationSettings: '"opsz" 144, "wght" 800',
              fontSize: 'clamp(72px, 12vw, 200px)',
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              color: '#E63E1F',
              margin: 0,
            }}
          >
            Archive.
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 11,
              letterSpacing: '0.25em',
              color: 'rgba(250,250,248,0.55)',
              marginTop: 24,
            }}
          >
            {String(totalCount).padStart(3, '0')} ENTRIES LOGGED · {filtered.length} MATCH
          </p>
        </div>
      </section>

      {/* Filter strip */}
      <div className="lg:pr-[240px]">
        <FilterChips
          activeType={activeType}
          activeYear={activeYear}
          onTypeChange={(t) => {
            setActiveType(t);
            setExpandedId(null);
          }}
          onYearChange={(y) => {
            setActiveYear(y);
            setExpandedId(null);
          }}
        />
      </div>

      {/* Bento rows */}
      <main className="lg:pr-[240px]">
        {filtered.length === 0 ? (
          <div
            className="max-w-[1280px] mx-auto px-5 md:px-8 py-24 text-center"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 12,
              letterSpacing: '0.25em',
              color: 'rgba(250,250,248,0.4)',
            }}
          >
            NO RESULTS. RESET A FILTER.
          </div>
        ) : (
          filtered.map((c, idx) => (
            <div
              key={c.id}
              style={{
                borderBottom:
                  idx === filtered.length - 1
                    ? '4px solid rgba(250,250,248,0.08)'
                    : '1px solid rgba(250,250,248,0.06)',
              }}
            >
              <EventBentoRow
                caseItem={c}
                locale={locale}
                expanded={expandedId === c.id}
                onToggle={() => toggleExpand(c.id)}
              />
            </div>
          ))
        )}

        <div
          className="max-w-[1280px] mx-auto px-5 md:px-8 py-16 text-center"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 10,
            letterSpacing: '0.3em',
            color: 'rgba(250,250,248,0.35)',
          }}
        >
          [ END OF ARCHIVE · BACK TO TOP ↑ ]
        </div>
      </main>

      <ArchiveMarquee locale={locale} />
    </>
  );
}
