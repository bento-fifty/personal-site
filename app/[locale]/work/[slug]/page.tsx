import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { getCaseBySlug, CASES } from '@/lib/work-data';

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) return {};
  return {
    title: `${locale === 'zh-TW' ? c.title : c.titleEn} — Evan Chang`,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) notFound();

  const title = locale === 'zh-TW' ? c.title : c.titleEn;
  const desc  = locale === 'zh-TW' ? c.description : c.descriptionEn;

  return (
    <article className="theme-light min-h-screen">

      {/* ── Hero ────────────────────────────────────── */}
      <div className="relative w-full bg-[#1A1A1A] flex items-end" style={{ minHeight: '55vh' }}>
        {/* Placeholder cover */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-label text-white/10 text-xs">COVER_IMAGE</span>
        </div>
        {/* Overlay info */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-10 pt-32 flex items-end justify-between">
          <div>
            <span className="case-number block mb-3">{c.id} / [ {c.type} ]</span>
            <h1 className="font-display text-white text-4xl md:text-6xl font-light leading-tight max-w-2xl">
              {title}
            </h1>
          </div>
          <span className="hidden md:block font-label text-white/30 text-[0.625rem] self-end">
            {c.date}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">

        {/* ── Client + back link ──────────────────────── */}
        <div className="flex items-center justify-between py-8 border-b border-[rgba(0,0,0,0.07)]">
          <p className="font-label text-[#1A1A1A]/50 text-[0.625rem]">
            CLIENT / {c.client}
          </p>
          <Link
            href="/work"
            className="font-label text-[#1A1A1A]/35 text-[0.625rem] hover:text-[#0891B2] transition-colors"
          >
            ← {locale === 'zh-TW' ? '返回作品集' : 'Back to Work'}
          </Link>
        </div>

        {/* ── Stats ───────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-px bg-[rgba(0,0,0,0.06)] my-16">
          {c.stats.map((s) => (
            <div key={s.label} className="bg-[#F7F5F2] px-8 py-10 text-center">
              <p className="font-display text-[#1A1A1A] text-4xl md:text-5xl font-light mb-3">
                {s.value}
              </p>
              <p className="font-label text-[#1A1A1A]/40 text-[0.5625rem]">
                {locale === 'zh-TW' ? s.label : s.labelEn}
              </p>
            </div>
          ))}
        </div>

        {/* ── Video ───────────────────────────────────── */}
        <div className="mb-16">
          <p className="font-label text-[#1A1A1A]/25 text-[0.625rem] mb-6">
            {'// HIGHLIGHT_REEL'}
          </p>
          {c.videoUrl ? (
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={c.videoUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video w-full bg-[rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.07)] flex items-center justify-center">
              <span className="font-label text-[#1A1A1A]/15 text-[0.625rem]">
                VIDEO_PENDING
              </span>
            </div>
          )}
        </div>

        {/* ── Description ─────────────────────────────── */}
        <div className="mb-20 max-w-2xl">
          <p className="font-label text-[#1A1A1A]/25 text-[0.625rem] mb-6">
            {'// CASE_NOTES'}
          </p>
          <p className="font-body text-[#1A1A1A]/70 text-base leading-relaxed">
            {desc}
          </p>
        </div>

        {/* ── Gallery ─────────────────────────────────── */}
        <div className="mb-24">
          <p className="font-label text-[#1A1A1A]/25 text-[0.625rem] mb-6">
            {'// GALLERY'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[rgba(0,0,0,0.06)]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] bg-[#F7F5F2] flex items-center justify-center"
              >
                <span className="font-label text-[#1A1A1A]/10 text-[0.5rem]">
                  PHOTO_{String(i + 1).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </article>
  );
}
