import type { Metadata } from 'next';
import { TransitionLink as Link } from '@/components/shared/RouteTransition';
import { SERVICES } from '@/lib/services-data';

export const metadata: Metadata = {
  title: 'Services — The Level Studio',
};

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const zh = locale === 'zh-TW';

  return (
    <article className="min-h-screen text-[#F0EDE6]">
      {/* ── Field Manual hero band ─────────────── */}
      <section
        className="relative px-5 md:px-8 pt-16 md:pt-24 pb-10"
        style={{ borderBottom: '4px solid rgba(250,250,248,0.08)' }}
      >
        <div className="max-w-[1280px] mx-auto">
          <p
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 10,
              letterSpacing: '0.3em',
              color: 'rgba(250,250,248,0.4)',
              marginBottom: 16,
            }}
          >
            [ FIELD MANUAL · ISSUE N°003 · TOOLS ]
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-fraunces), serif',
              fontVariationSettings: '"opsz" 144, "wght" 800',
              fontSize: 'clamp(72px, 12vw, 200px)',
              lineHeight: 0.9,
              letterSpacing: '-0.04em',
              color: '#E63E1F',
              margin: 0,
            }}
          >
            Tools.
          </h1>
          <div className="mt-6 flex items-end justify-between flex-wrap gap-4">
            <p
              className="max-w-2xl text-[#F0EDE6]/70 text-[14px] md:text-[15px] leading-[1.75]"
              style={{ fontFamily: 'var(--font-noto-serif-tc), var(--font-fraunces), serif' }}
            >
              {zh
                ? '我們帶進案子的四組裝備。每一組都有合適的情境、一份清單、和過去踩過的坑。'
                : 'Four rigs we bring to a project. Each has a deployment window, a kit list, and the mistakes we have already made.'}
            </p>
            <div
              className="font-mono text-[10px] tracking-[0.28em] text-[#F0EDE6]/40 flex gap-5"
              style={{ fontFamily: 'var(--font-mono), monospace' }}
            >
              <span>{SERVICES.length.toString().padStart(2, '0')} TOOLS</span>
              <span>·</span>
              <span>{zh ? '一對一配置' : 'ONE-ON-ONE'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tools list ──────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-16 md:py-24 space-y-16 md:space-y-24">
        {SERVICES.map((s, i) => (
          <ToolEntry key={s.id} s={s} zh={zh} locale={locale} isFirst={i === 0} />
        ))}
      </div>

      {/* ── Footer CTA band ─────────────────────── */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-8 pb-24">
        <div
          className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center pt-10"
          style={{ borderTop: '1px solid rgba(93,211,227,0.2)' }}
        >
          <p
            className="max-w-2xl text-[#F0EDE6]/75 text-[15px] md:text-[17px] leading-[1.8]"
            style={{ fontFamily: 'var(--font-noto-serif-tc), var(--font-fraunces), serif' }}
          >
            {zh
              ? '覺得某個裝備適合你的案子？寄一份 brief 給我，48 小時內會收到回覆 — 不管接不接。'
              : 'Think one of these rigs fits your project? Send a brief — you get a reply within 48 hours, whether we take it or not.'}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="back-link-lg inline-flex items-center whitespace-nowrap"
            data-cursor="▸ BRIEF"
            data-cursor-variant="link"
          >
            {zh ? '寄一份 BRIEF →' : 'Send a brief →'}
          </Link>
        </div>
      </section>
    </article>
  );
}

// ── Tool Entry ─────────────────────────────────
function ToolEntry({
  s,
  zh,
  locale,
  isFirst,
}: {
  s: (typeof SERVICES)[number];
  zh: boolean;
  locale: string;
  isFirst: boolean;
}) {
  return (
    <section
      className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 md:gap-14"
      style={{
        paddingTop: isFirst ? 0 : 16,
        borderTop: isFirst ? 'none' : '1px solid rgba(93,211,227,0.12)',
      }}
    >
      {/* ─ Left column: identification ─ */}
      <aside className="space-y-5">
        <div>
          <p
            className="font-mono text-[10px] tracking-[0.28em]"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              color: '#E63E1F',
            }}
          >
            TOOL {s.num}
          </p>
          <p
            className="mt-1 font-mono text-[11px] tracking-[0.3em] text-[#5DD3E3]"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            {s.codename}
          </p>
        </div>

        {/* ISO-like spec sheet */}
        <dl
          className="space-y-2 font-mono text-[10px] tracking-[0.24em] text-[#F0EDE6]/55 pt-3"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            borderTop: '1px solid rgba(93,211,227,0.15)',
          }}
        >
          <SpecRow k={zh ? '週期' : 'CYCLE'} v={s.specs.cycle} />
          <SpecRow k={zh ? '團隊' : 'TEAM'} v={s.specs.team} />
          <SpecRow k={zh ? '量級' : 'SCALE'} v={s.specs.budget} />
        </dl>
      </aside>

      {/* ─ Right column: manual page ─ */}
      <div>
        <h2
          className="text-[#F0EDE6] text-[34px] md:text-[52px] lg:text-[64px] leading-[1.05] mb-10"
          style={{
            fontFamily: 'var(--font-fraunces), "Noto Serif TC", serif',
            fontWeight: 500,
            letterSpacing: '-0.025em',
          }}
        >
          {zh ? s.title.zh : s.title.en}
        </h2>

        {/* When to deploy */}
        <Block label={zh ? '適用情境' : 'WHEN TO DEPLOY'}>
          <p
            className="text-[#F0EDE6]/75 text-[15px] md:text-[16px] leading-[1.85] max-w-2xl"
            style={{ fontFamily: 'var(--font-noto-serif-tc), var(--font-fraunces), serif' }}
          >
            {zh ? s.whenToDeploy.zh : s.whenToDeploy.en}
          </p>
        </Block>

        {/* Kit contents */}
        <Block label={zh ? '裝備清單' : 'WHAT\'S IN THE KIT'}>
          <ul className="space-y-2.5 max-w-2xl">
            {(zh ? s.kitContents.zh : s.kitContents.en).map((k, i) => (
              <li
                key={k}
                className="flex items-baseline gap-4 text-[#F0EDE6]/75 text-[14px] md:text-[15px]"
                style={{ fontFamily: 'var(--font-noto-serif-tc), var(--font-fraunces), serif' }}
              >
                <span
                  className="font-mono text-[10px] text-[#5DD3E3]/80 tabular-nums w-6 shrink-0"
                  style={{ fontFamily: 'var(--font-mono), monospace' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                {k}
              </li>
            ))}
          </ul>
        </Block>

        {/* Common mistakes — set apart with warning tint */}
        <Block label={zh ? '常見踩坑' : 'COMMON MISTAKES'} warning>
          <ul className="space-y-2.5 max-w-2xl">
            {(zh ? s.commonMistakes.zh : s.commonMistakes.en).map((m) => (
              <li
                key={m}
                className="flex items-baseline gap-4 text-[#F0EDE6]/65 text-[14px] md:text-[15px]"
                style={{ fontFamily: 'var(--font-noto-serif-tc), var(--font-fraunces), serif' }}
              >
                <span
                  className="font-mono text-[11px] text-[#E63E1F] shrink-0"
                  style={{ fontFamily: 'var(--font-mono), monospace' }}
                >
                  ✕
                </span>
                {m}
              </li>
            ))}
          </ul>
        </Block>

        {/* Case file cross-reference */}
        {s.caseRefs.length > 0 && (
          <Block label={zh ? '相關案例' : 'CASE FILES'}>
            <div className="flex flex-wrap gap-2">
              {s.caseRefs.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${locale}/work/${r.slug}`}
                  data-cursor="▸ OPEN"
                  data-cursor-variant="link"
                  className="group font-mono text-[10px] tracking-[0.26em] px-3 py-2 inline-flex items-center gap-2 transition-colors"
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    border: '1px solid rgba(93,211,227,0.4)',
                    color: '#5DD3E3',
                  }}
                >
                  <span>→</span>
                  <span>{r.label}</span>
                </Link>
              ))}
            </div>
          </Block>
        )}

        {/* Chef's note — italic pull quote */}
        <div
          className="mt-10 md:mt-14 max-w-2xl pl-5"
          style={{ borderLeft: '2px solid rgba(230,62,31,0.5)' }}
        >
          <p
            className="font-mono text-[9px] tracking-[0.3em] text-[#E63E1F] mb-3"
            style={{ fontFamily: 'var(--font-mono), monospace' }}
          >
            // CHEF&apos;S NOTE
          </p>
          <p
            className="text-[#F0EDE6]/80 text-[15px] md:text-[17px] leading-[1.75] italic"
            style={{
              fontFamily: 'var(--font-fraunces), "Noto Serif TC", serif',
              fontWeight: 400,
            }}
          >
            {zh ? s.chefsNote.zh : s.chefsNote.en}
          </p>
        </div>
      </div>
    </section>
  );
}

function Block({
  label,
  children,
  warning,
}: {
  label: string;
  children: React.ReactNode;
  warning?: boolean;
}) {
  return (
    <div className="mb-8 md:mb-10">
      <p
        className="font-mono text-[9px] tracking-[0.3em] mb-3"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          color: warning ? 'rgba(230,62,31,0.75)' : 'rgba(93,211,227,0.75)',
        }}
      >
        // {label}
      </p>
      {children}
    </div>
  );
}

function SpecRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-[#F0EDE6]/45">{k}</dt>
      <dd className="text-[#F0EDE6]/80">{v}</dd>
    </div>
  );
}
