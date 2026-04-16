import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { TransitionLink as Link } from '@/components/shared/RouteTransition';
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

  const zh = locale === 'zh-TW';
  const title = zh ? c.title : c.titleEn;
  const pick = (field?: LocalizedText) => (field ? (zh ? field.zh : field.en) : null);
  const pending = zh ? '[ 案例內容持續更新中 ]' : '[ Case copy coming soon ]';

  const sections = [
    {
      num: '01',
      label: 'OBJECTIVE',
      heading: zh ? '客戶要解決什麼？' : 'What we set out to solve.',
      body: pick(c.objective),
    },
    {
      num: '02',
      label: 'STRATEGY',
      heading: zh ? '我們怎麼切進來？' : 'How we approached it.',
      body: pick(c.strategy),
    },
    {
      num: '03',
      label: 'EXECUTION',
      heading: zh ? '現場怎麼跑起來？' : 'How it came to life.',
      body: pick(c.execution),
    },
  ];

  return (
    <article className="min-h-screen text-[#F0EDE6]">
      {/* ── Hero cover — transparent so ambient INK POOL shows ───── */}
      <div
        className="relative w-full flex items-end overflow-hidden"
        style={{ minHeight: '55vh' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-mono text-[10px] tracking-[0.3em] text-[#F0EDE6]/15"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            COVER_IMAGE
          </span>
        </div>
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-10 pb-12 pt-32 flex items-end justify-between">
          <div className="max-w-3xl">
            <span
              className="block mb-5 font-mono text-[10px] tracking-[0.3em] text-[#5DD3E3]"
              style={{ fontFamily: 'var(--font-mono), monospace' }}
            >
              {c.id} / [ {c.type} ]
            </span>
            <h1
              className="text-[#F0EDE6] text-4xl md:text-6xl lg:text-7xl leading-[1.02]"
              style={{
                fontFamily: 'var(--font-fraunces), "Noto Serif TC", serif',
                fontWeight: 500,
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </h1>
          </div>
          <span
            className="hidden md:block font-mono text-[10px] tracking-[0.28em] text-[#F0EDE6]/35 self-end"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            {c.date}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10">
        {/* ── Client + back link ──────────────────────── */}
        <div className="flex items-center justify-between py-8 border-b border-[rgba(93,211,227,0.15)]">
          <p
            className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#5DD3E3]/70"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            CLIENT / {c.client}
          </p>
          <Link
            href="/work"
            data-cursor="◀ ARCHIVE"
            data-cursor-variant="link"
            className="back-link-sm inline-flex items-center"
          >
            ← {zh ? '返回作品集' : 'Back to work'}
          </Link>
        </div>

        {/* ── OSER ────────────────────────────────────── */}
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

          {/* ── Result + stats ─────────────────────────── */}
          <OSERSection
            num="04"
            label="RESULT"
            heading={zh ? '最後留下什麼？' : 'What we walked away with.'}
            body={pick(c.result) ?? pending}
            isPending={!c.result}
          >
            {c.stats.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(93,211,227,0.12)] mt-14">
                {c.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="px-8 py-14 text-center"
                    style={{ background: 'rgba(11, 16, 38, 0.5)' }}
                  >
                    <p
                      className="text-[#E63E1F] text-[52px] md:text-[72px] lg:text-[88px] leading-none mb-5 tabular-nums"
                      style={{
                        fontFamily: 'var(--font-fraunces), serif',
                        fontWeight: 500,
                        letterSpacing: '-0.03em',
                      }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className="font-mono text-[10px] tracking-[0.28em] uppercase text-[#5DD3E3]/70"
                      style={{ fontFamily: 'var(--font-mono), monospace' }}
                    >
                      {zh ? stat.label : stat.labelEn}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </OSERSection>
        </div>

        {/* ── Highlight reel ───────────────────────────── */}
        {c.videoUrl && (
          <div className="mb-16">
            <p
              className="font-mono text-[10px] mb-6 tracking-[0.28em] text-[#5DD3E3]/70"
              style={{ fontFamily: 'var(--font-mono), monospace' }}
            >
              // HIGHLIGHT_REEL
            </p>
            <div
              className="relative aspect-video w-full"
              style={{ background: 'rgba(0,0,0,0.6)' }}
            >
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
          <p
            className="font-mono text-[10px] mb-6 tracking-[0.28em] text-[#5DD3E3]/70"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            // GALLERY
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[rgba(93,211,227,0.12)]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] flex items-center justify-center"
                style={{ background: 'rgba(11, 16, 38, 0.5)' }}
              >
                <span
                  className="font-mono text-[9px] tracking-[0.28em] text-[#F0EDE6]/15"
                  style={{ fontFamily: 'var(--font-mono), monospace' }}
                >
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
            data-cursor="◀ ARCHIVE"
            data-cursor-variant="link"
            className="back-link-lg"
          >
            ← {zh ? '看其他案例' : 'Explore more work'}
          </Link>
        </div>
      </div>
    </article>
  );
}

function OSERSection({
  num,
  label,
  heading,
  body,
  isPending,
  children,
}: {
  num: string;
  label: string;
  heading: string;
  body: string;
  isPending?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 md:gap-16">
      <div>
        <p
          className="font-mono text-[10px] tracking-[0.28em] uppercase"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            color: '#E63E1F',
          }}
        >
          [ {num} // {label} ]
        </p>
        <span
          aria-hidden
          className="block w-10 h-px mt-3"
          style={{ background: 'rgba(93, 211, 227, 0.5)' }}
        />
      </div>
      <div>
        <h2
          className="text-[#F0EDE6] text-[28px] md:text-[44px] lg:text-[52px] leading-[1.08] mb-8 max-w-3xl"
          style={{
            fontFamily: 'var(--font-fraunces), "Noto Serif TC", serif',
            fontWeight: 500,
            letterSpacing: '-0.02em',
          }}
        >
          {heading}
        </h2>
        <p
          className={
            'text-[15px] md:text-[17px] leading-[1.85] max-w-2xl whitespace-pre-line ' +
            (isPending ? 'italic text-[#F0EDE6]/35' : 'text-[#F0EDE6]/75')
          }
          style={{
            fontFamily: 'var(--font-noto-serif-tc), var(--font-fraunces), serif',
          }}
        >
          {body}
        </p>
        {children}
      </div>
    </section>
  );
}
