import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { getCaseBySlug, CASES, type LocalizedText } from '@/lib/work-data';

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

  const zh    = locale === 'zh-TW';
  const title = zh ? c.title : c.titleEn;
  const pick  = (field?: LocalizedText) => (field ? (zh ? field.zh : field.en) : null);
  const pending = zh ? '[ 案例內容持續更新中 ]' : '[ Case copy coming soon ]';

  const sections = [
    {
      num:     '01',
      label:   'OBJECTIVE',
      heading: zh ? '客戶要解決什麼？' : 'What we set out to solve.',
      body:    pick(c.objective),
    },
    {
      num:     '02',
      label:   'STRATEGY',
      heading: zh ? '我們怎麼切進來？' : 'How we approached it.',
      body:    pick(c.strategy),
    },
    {
      num:     '03',
      label:   'EXECUTION',
      heading: zh ? '現場怎麼跑起來？' : 'How it came to life.',
      body:    pick(c.execution),
    },
  ];

  return (
    <article className="theme-light min-h-screen">
      {/* ── Hero cover ──────────────────────────────── */}
      <div
        className="relative w-full bg-[#1A1A1A] flex items-end overflow-hidden"
        style={{ minHeight: '55vh' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-label text-white/10 text-xs">COVER_IMAGE</span>
        </div>
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-10 pb-12 pt-32 flex items-end justify-between">
          <div className="max-w-3xl">
            <span className="case-number block mb-4">
              {c.id} / [ {c.type} ]
            </span>
            <h1
              className="text-white text-4xl md:text-6xl leading-[1.05]"
              style={{
                fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
                fontWeight:          500,
                letterSpacing:       '-0.015em',
                WebkitFontSmoothing: 'antialiased',
              }}
            >
              {title}
            </h1>
          </div>
          <span className="hidden md:block font-label text-white/30 text-[0.625rem] self-end">
            {c.date}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10">
        {/* ── Client + back link ──────────────────────── */}
        <div className="flex items-center justify-between py-8 border-b border-[rgba(0,0,0,0.07)]">
          <p className="font-label text-[#1A1A1A]/50 text-[0.625rem] tracking-[0.2em] uppercase">
            CLIENT / {c.client}
          </p>
          <Link
            href="/work"
            className="font-label text-[#1A1A1A]/35 text-[0.625rem] hover:text-[#0891B2] transition-colors tracking-[0.2em] uppercase"
          >
            ← {zh ? '返回作品集' : 'Back to work'}
          </Link>
        </div>

        {/* ── OSER: Objective → Strategy → Execution ──── */}
        <div className="py-20 md:py-28 space-y-20 md:space-y-28">
          {sections.map((s) => (
            <OSERSection
              key={s.num}
              num={s.num}
              label={s.label}
              heading={s.heading}
              body={s.body ?? pending}
              isPending={!s.body}
            />
          ))}

          {/* ── Result — stats live inside this section ── */}
          <OSERSection
            num="04"
            label="RESULT"
            heading={zh ? '最後留下什麼？' : 'What we walked away with.'}
            body={pick(c.result) ?? pending}
            isPending={!c.result}
          >
            {c.stats.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(0,0,0,0.06)] mt-12">
                {c.stats.map((stat) => (
                  <div key={stat.label} className="bg-[#F7F5F2] px-8 py-12 text-center">
                    <p
                      className="text-[#1A1A1A] text-[44px] md:text-[66px] lg:text-[77px] leading-none mb-4 tabular-nums"
                      style={{
                        fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
                        fontWeight:          500,
                        letterSpacing:       '-0.02em',
                        WebkitFontSmoothing: 'antialiased',
                      }}
                    >
                      {stat.value}
                    </p>
                    <p className="font-label text-[#1A1A1A]/40 text-[0.625rem] tracking-[0.25em] uppercase">
                      {zh ? stat.label : stat.labelEn}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </OSERSection>
        </div>

        {/* ── Highlight reel (optional) ───────────────── */}
        {c.videoUrl && (
          <div className="mb-16">
            <p className="font-label text-[#1A1A1A]/25 text-[0.625rem] mb-6 tracking-[0.2em]">
              {'// HIGHLIGHT_REEL'}
            </p>
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={c.videoUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* ── Gallery placeholder ─────────────────────── */}
        <div className="mb-24">
          <p className="font-label text-[#1A1A1A]/25 text-[0.625rem] mb-6 tracking-[0.2em]">
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

        {/* ── Footer back link ────────────────────────── */}
        <div className="pb-24 flex justify-center">
          <Link
            href="/work"
            className="font-label text-[#1A1A1A]/45 text-[11px] hover:text-[#0891B2] tracking-[0.28em] uppercase transition-colors"
          >
            ← {zh ? '看其他案例' : 'Explore more work'}
          </Link>
        </div>
      </div>
    </article>
  );
}

// ── OSER Section — one Objective / Strategy / Execution / Result block ──
function OSERSection({
  num,
  label,
  heading,
  body,
  isPending,
  children,
}: {
  num:        string;
  label:      string;
  heading:    string;
  body:       string;
  isPending?: boolean;
  children?:  ReactNode;
}) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-16">
      <div>
        <p
          className="font-label text-[#0891B2] text-[11px] tracking-[0.28em] uppercase mb-2"
          style={{ textShadow: '0 0 0 transparent' }}
        >
          [ {num} // {label} ]
        </p>
        <span
          aria-hidden
          className="block w-10 h-px bg-[#0891B2]/40 mt-3"
        />
      </div>
      <div>
        <h2
          className="text-[#1A1A1A] text-[28px] md:text-[44px] lg:text-[55px] leading-[1.1] mb-8 max-w-3xl"
          style={{
            fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
            fontWeight:          500,
            letterSpacing:       '-0.015em',
            WebkitFontSmoothing: 'antialiased',
          }}
        >
          {heading}
        </h2>
        <p
          className={
            'text-[15px] md:text-[17px] leading-[1.8] max-w-2xl whitespace-pre-line ' +
            (isPending ? 'text-[#1A1A1A]/30 italic' : 'text-[#1A1A1A]/70')
          }
          style={{
            fontFamily:          'var(--font-geist), "Chiron Hei HK WS", sans-serif',
            WebkitFontSmoothing: 'antialiased',
          }}
        >
          {body}
        </p>
        {children}
      </div>
    </section>
  );
}
