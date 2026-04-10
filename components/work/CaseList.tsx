'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { CASES, EVENT_TYPES, type EventType, type Case } from '@/lib/work-data';

interface Props {
  locale: string;
}

export default function CaseList({ locale }: Props) {
  const [activeType, setActiveType] = useState<EventType | 'ALL'>('ALL');

  const filtered =
    activeType === 'ALL' ? CASES : CASES.filter((c) => c.type === activeType);

  return (
    <div>
      {/* Filter bar */}
      <div className="flex gap-8 mb-12 pb-6 border-b border-[rgba(0,0,0,0.07)]">
        {EVENT_TYPES.map((et) => (
          <button
            key={et.value}
            onClick={() => setActiveType(et.value)}
            className={[
              'font-label text-[0.625rem] transition-colors',
              activeType === et.value
                ? 'text-[#1A1A1A]'
                : 'text-[#1A1A1A]/30 hover:text-[#1A1A1A]/60',
            ].join(' ')}
          >
            {locale === 'zh-TW' ? et.labelZh : et.labelEn}
          </button>
        ))}
      </div>

      {/* Case rows */}
      <div className="divide-y divide-[rgba(0,0,0,0.06)]">
        {filtered.map((c) => (
          <CaseRow key={c.slug} c={c} locale={locale} />
        ))}
      </div>
    </div>
  );
}

function CaseRow({ c, locale }: { c: Case; locale: string }) {
  const title = locale === 'zh-TW' ? c.title : c.titleEn;
  const desc  = locale === 'zh-TW' ? c.desc  : c.descEn;

  return (
    <Link
      href={`/work/${c.slug}`}
      className="group flex items-center gap-8 py-10 transition-colors hover:bg-[rgba(0,0,0,0.015)] -mx-6 px-6"
    >
      {/* Left: id + type */}
      <div className="w-28 flex-shrink-0">
        <span className="case-number block mb-1.5">{c.id} /</span>
        <span className="font-label text-[#1A1A1A]/25 text-[0.5625rem]">
          [ {c.type} ]
        </span>
      </div>

      {/* Middle: title + desc */}
      <div className="flex-1 min-w-0">
        <h2 className="font-display text-[#1A1A1A] text-[1.75rem] md:text-3xl font-light leading-snug mb-2 group-hover:text-[#C8A96E] transition-colors">
          {title}
        </h2>
        <p className="font-label text-[#1A1A1A]/35 text-[0.625rem]">{desc}</p>
      </div>

      {/* Right: date + thumbnail */}
      <div className="hidden md:flex flex-col items-end gap-3 flex-shrink-0">
        <span className="font-label text-[#1A1A1A]/25 text-[0.5625rem]">
          {c.date}
        </span>
        <div className="w-36 aspect-[4/3] bg-[rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.06)] overflow-hidden flex items-center justify-center group-hover:border-[rgba(200,169,110,0.35)] transition-colors">
          <span className="font-label text-[#1A1A1A]/10 text-[0.5rem]">
            IMG_{c.id}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <span className="font-label text-[#1A1A1A]/20 text-xs group-hover:text-[#C8A96E] group-hover:translate-x-1 transition-all">
        →
      </span>
    </Link>
  );
}
