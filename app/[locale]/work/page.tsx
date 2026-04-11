import type { Metadata } from 'next';
import { Suspense } from 'react';
import CaseList from '@/components/work/CaseList';
import { CASES } from '@/lib/work-data';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'zh-TW' ? '作品集 — Evan Chang' : 'Work — Evan Chang',
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="theme-light min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-20">
        {/* Page header */}
        <div className="flex items-baseline justify-between mb-16 pb-8 border-b border-[rgba(0,0,0,0.08)]">
          <h1 className="font-display text-[#1A1A1A] text-5xl md:text-6xl font-light">
            {locale === 'zh-TW' ? '作品集' : 'Work'}
          </h1>
          <span className="font-label text-[#1A1A1A]/25 text-[0.625rem]">
            {String(CASES.length).padStart(2, '0')} / PROJECTS
          </span>
        </div>

        <Suspense fallback={null}>
          <CaseList locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
