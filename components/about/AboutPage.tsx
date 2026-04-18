'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResumeQRWindow from './ResumeQRWindow';
import FitCheckWindow from './FitCheckWindow';
import TaipeiLiveWindow from './TaipeiLiveWindow';
import { TRANSMISSIONS, type TxStatus } from '@/lib/blog-data';
import { CASES } from '@/lib/work-data';
import { TransitionLink as Link } from '@/components/shared/RouteTransition';

interface Props {
  locale: 'zh-TW' | 'en-US';
}

type Chapter = 'profile' | 'field-kit' | 'transmissions';

const CHAPTERS: { id: Chapter; n: string; label: string; zhLabel: string }[] = [
  { id: 'profile',       n: '01', label: 'PROFILE',       zhLabel: '個人檔案' },
  { id: 'field-kit',     n: '02', label: 'FIELD KIT',     zhLabel: '隨身裝備' },
  { id: 'transmissions', n: '03', label: 'TRANSMISSIONS', zhLabel: '訊號紀錄' },
];

const BIO = {
  'zh-TW': {
    role: '活動策劃 / 品牌體驗顧問',
    lines: [
      'Evan Chang — 台北獨立活動製作人。',
      '專注品牌沈浸體驗、大型活動、KOL 合作。',
      '從概念、場地、動線、到現場統籌全包辦。',
      '回覆時間 24 小時內。',
    ],
    aboutLabel: '(about)',
    linksLabel: '(links)',
    historyLabel: '(history)',
    pickupLabel: '(pickup works)',
    seeAll: '看全部作品 →',
    meta: 'TAIPEI · TAIWAN · SINCE 2019 · 中文 / ENGLISH',
    credit: 'FREELANCE / PRINCIPAL',
  },
  'en-US': {
    role: 'Event Planner / Brand Experience Consultant',
    lines: [
      'Evan Chang — independent event producer, Taipei.',
      'Focused on immersive brand experiences, large-scale productions, KOL partnerships.',
      'Concept to floor plan to on-site management, all in-house.',
      'Typical reply within 24 hours.',
    ],
    aboutLabel: '(about)',
    linksLabel: '(links)',
    historyLabel: '(history)',
    pickupLabel: '(pickup works)',
    seeAll: 'See all works →',
    meta: 'TAIPEI · TAIWAN · SINCE 2019 · 中文 / ENGLISH',
    credit: 'FREELANCE / PRINCIPAL',
  },
};

const LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/', handle: '@evanchang' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/evan-chang', handle: 'evan-chang' },
  { label: 'Email', href: 'mailto:evanchang818@gmail.com', handle: 'evanchang818@gmail.com' },
];

const STATUS_TINT: Record<TxStatus, string> = {
  LIVE: '#5DD3E3',
  ARCHIVED: '#F0EDE6',
  CLASSIFIED: '#E63E1F',
  DRAFT: '#9FEFF7',
};

export default function AboutPage({ locale }: Props) {
  const bio = BIO[locale];
  const zh = locale === 'zh-TW';

  const [chapter, setChapter] = useState<Chapter>('profile');
  const [cursorBlink, setCursorBlink] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setCursorBlink((v) => !v), 500);
    return () => clearInterval(id);
  }, []);

  // Sync to URL hash so deep links work
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.replace('#', '');
      if (h === 'profile' || h === 'field-kit' || h === 'transmissions') {
        setChapter(h);
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const go = (c: Chapter) => {
    setChapter(c);
    if (typeof window !== 'undefined') {
      history.replaceState(null, '', `#${c}`);
    }
  };

  return (
    <section
      className="relative"
      style={{ minHeight: 'calc(100dvh - 44px - 80px)' }}
    >
      <div
        className="max-w-[1400px] mx-auto relative"
        style={{ display: 'grid', gridTemplateColumns: '56px 1fr' }}
      >
        {/* ── Spine (left) ─────────────────────── */}
        <aside
          className="sticky top-0 self-start"
          style={{
            borderRight: '1px solid rgba(250,250,248,0.08)',
            minHeight: 'calc(100dvh - 44px)',
            background: 'rgba(0,0,0,0.2)',
          }}
        >
          <div className="flex flex-col h-full pt-12 pb-12">
            {CHAPTERS.map((c) => {
              const on = chapter === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => go(c.id)}
                  data-cursor={`▸ ${c.label}`}
                  data-cursor-variant="action"
                  className="flex-1 relative"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(250,250,248,0.06)',
                    cursor: 'pointer',
                    padding: '20px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 18,
                    transition: 'background 160ms',
                  }}
                  onMouseEnter={(e) => {
                    if (!on) e.currentTarget.style.background = 'rgba(93,211,227,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    if (!on) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {on && (
                    <motion.span
                      layoutId="spine-marker"
                      style={{
                        position: 'absolute',
                        right: -1,
                        top: 0,
                        bottom: 0,
                        width: 2,
                        background: '#E63E1F',
                        boxShadow: '0 0 12px rgba(230,62,31,0.8)',
                      }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                  <span
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: 10,
                      letterSpacing: '0.3em',
                      color: on ? '#E63E1F' : 'rgba(250,250,248,0.4)',
                      transition: 'color 160ms',
                    }}
                  >
                    {c.n}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: 10,
                      letterSpacing: '0.32em',
                      color: on ? '#E63E1F' : 'rgba(250,250,248,0.6)',
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      transition: 'color 160ms',
                    }}
                  >
                    {c.label}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── Chapter body (right) ─────────────── */}
        <div className="px-5 md:px-10 pt-14 md:pt-20 pb-24 relative min-w-0">
          <div className="mb-10 flex items-center gap-4 flex-wrap" style={topStrip()}>
            <span>[ PROFILE · TLS-PRFL-042 ]</span>
            <span style={{ color: '#5DD3E3' }}>●</span>
            <span>{bio.credit}</span>
            <span style={{ color: 'rgba(250,250,248,0.25)' }}>//</span>
            <span style={{ color: '#5DD3E3' }}>
              CH.{CHAPTERS.find((c) => c.id === chapter)?.n} · {zh ? CHAPTERS.find((c) => c.id === chapter)?.zhLabel : CHAPTERS.find((c) => c.id === chapter)?.label}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {chapter === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <ChapterProfile bio={bio} cursorBlink={cursorBlink} locale={locale} />
              </motion.div>
            )}

            {chapter === 'field-kit' && (
              <motion.div
                key="field-kit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <ChapterFieldKit cursorBlink={cursorBlink} zh={zh} />
              </motion.div>
            )}

            {chapter === 'transmissions' && (
              <motion.div
                key="transmissions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <ChapterTransmissions zh={zh} cursorBlink={cursorBlink} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════ CHAPTER 01 ══ */

function ChapterProfile({
  bio,
  cursorBlink,
  locale,
}: {
  bio: (typeof BIO)['zh-TW'];
  cursorBlink: boolean;
  locale: 'zh-TW' | 'en-US';
}) {
  const pickup = CASES.filter((c) => c.featured).slice(0, 5);
  const historyItems = CASES.filter((c) => c.featured)
    .map((c) => ({
      year: c.year,
      title: locale === 'zh-TW' ? c.title : c.titleEn,
      venue: c.venue,
    }))
    .sort((a, b) => b.year - a.year);

  return (
    <>
      <h1
        className="flex items-baseline"
        style={{
          fontFamily: 'var(--font-display), serif',
          fontVariationSettings: '"opsz" 144, "wght" 900',
          fontSize: 'clamp(64px, 11vw, 180px)',
          lineHeight: 0.9,
          letterSpacing: '-0.035em',
          color: '#E63E1F',
          margin: 0,
        }}
      >
        PROFILE
        <span
          aria-hidden
          style={{
            color: '#5DD3E3',
            marginLeft: '0.08em',
            opacity: cursorBlink ? 1 : 0,
            transition: 'opacity 100ms',
          }}
        >
          _
        </span>
      </h1>

      <p className="mt-4" style={roleTag()}>
        {bio.role}
      </p>

      {/* About + Links — two-col */}
      <div
        className="mt-14 grid gap-10 md:gap-16"
        style={{
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          ...panelStyle(),
        }}
      >
        <section>
          <p style={sectionTag()}>{bio.aboutLabel}</p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {bio.lines.map((line, i) => (
              <li
                key={i}
                style={{
                  fontFamily: 'var(--font-noto-serif-tc), var(--font-fraunces), serif',
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: 'rgba(240,237,230,0.85)',
                }}
              >
                {line}
              </li>
            ))}
          </ul>
          <p
            className="mt-6"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 10,
              letterSpacing: '0.28em',
              color: 'rgba(93,211,227,0.7)',
              textTransform: 'uppercase',
            }}
          >
            {bio.meta}
          </p>
        </section>

        <section>
          <p style={sectionTag()}>{bio.linksLabel}</p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {LINKS.map((l) => {
              const external = !l.href.startsWith('mailto');
              return (
                <li
                  key={l.label}
                  style={{ borderBottom: '1px solid rgba(250,250,248,0.08)' }}
                >
                  <a
                    href={l.href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noreferrer' : undefined}
                    data-cursor={external ? '↗ EXTERNAL' : '▸ EMAIL'}
                    data-cursor-variant="link"
                    className="flex items-center justify-between py-3"
                    style={{
                      textDecoration: 'none',
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: 11,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: 'rgba(250,250,248,0.82)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#5DD3E3')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(250,250,248,0.82)')}
                  >
                    <span>{l.label}</span>
                    <span
                      style={{
                        color: 'rgba(250,250,248,0.5)',
                        textTransform: 'none',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {l.handle}
                    </span>
                    <span style={{ color: '#5DD3E3', fontSize: 13 }}>
                      {external ? '↗' : '▸'}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* History */}
      <section className="mt-14" style={panelStyle()}>
        <p style={sectionTag()}>{bio.historyLabel}</p>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {historyItems.map((h, i) => (
            <li
              key={i}
              className="grid items-baseline py-3"
              style={{
                gridTemplateColumns: '80px 1fr auto',
                gap: 16,
                borderBottom: '1px solid rgba(250,250,248,0.06)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 11,
                  letterSpacing: '0.22em',
                  color: '#E63E1F',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {h.year}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-noto-serif-tc), var(--font-fraunces), serif',
                  fontSize: 16,
                  color: '#F0EDE6',
                  letterSpacing: '-0.005em',
                }}
              >
                {h.title}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  color: 'rgba(240,237,230,0.45)',
                  textTransform: 'uppercase',
                }}
              >
                {h.venue}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Pickup works */}
      <section className="mt-14" style={panelStyle()}>
        <div className="flex items-baseline justify-between mb-6">
          <p style={sectionTag()}>{bio.pickupLabel}</p>
          <Link
            href={`/${locale}/work`}
            data-cursor="▸ ALL WORKS"
            data-cursor-variant="link"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 10,
              letterSpacing: '0.28em',
              color: '#5DD3E3',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            {bio.seeAll}
          </Link>
        </div>
        <ul
          className="grid gap-5"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          {pickup.map((c) => (
            <li key={c.id}>
              <Link
                href={`/${locale}/work/${c.slug}`}
                data-cursor="▸ OPEN"
                data-cursor-variant="link"
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <div
                  style={{
                    aspectRatio: '4 / 3',
                    background: `linear-gradient(135deg, hsl(${(Number(c.id) * 37) % 360},48%,22%) 0%, hsl(${(Number(c.id) * 37 + 14) % 360},36%,10%) 100%)`,
                    border: '1px solid rgba(93,211,227,0.2)',
                    position: 'relative',
                    transition: 'border-color 160ms',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#5DD3E3')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(93,211,227,0.2)')}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 12,
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: 9,
                      letterSpacing: '0.3em',
                      color: 'rgba(250,250,248,0.6)',
                    }}
                  >
                    #{c.id}
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      left: 12,
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: 9,
                      letterSpacing: '0.28em',
                      color: '#5DD3E3',
                    }}
                  >
                    {c.types[0]}
                  </span>
                </div>
                <div className="mt-3">
                  <h3
                    style={{
                      fontFamily: 'var(--font-noto-serif-tc), var(--font-fraunces), serif',
                      fontSize: 15,
                      lineHeight: 1.3,
                      color: '#F0EDE6',
                      margin: 0,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {locale === 'zh-TW' ? c.title : c.titleEn}
                  </h3>
                  <p
                    className="mt-1"
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: 9,
                      letterSpacing: '0.28em',
                      color: 'rgba(240,237,230,0.45)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {c.year} · {c.venue}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function panelStyle(): React.CSSProperties {
  return {
    backdropFilter: 'blur(14px) saturate(110%)',
    WebkitBackdropFilter: 'blur(14px) saturate(110%)',
    padding: '28px 32px',
  };
}

function sectionTag(): React.CSSProperties {
  return {
    fontFamily: 'var(--font-mono), monospace',
    fontSize: 10,
    letterSpacing: '0.3em',
    color: 'rgba(93,211,227,0.7)',
    textTransform: 'lowercase',
    marginBottom: 18,
    margin: '0 0 18px 0',
  };
}

function roleTag(): React.CSSProperties {
  return {
    fontFamily: 'var(--font-mono), monospace',
    fontSize: 11,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: '#5DD3E3',
  };
}

/* ══════════════════════════════════════════ CHAPTER 02 ══ */

function ChapterFieldKit({ cursorBlink, zh }: { cursorBlink: boolean; zh: boolean }) {
  return (
    <>
      <h1
        className="flex items-baseline"
        style={{
          fontFamily: 'var(--font-display), serif',
          fontVariationSettings: '"opsz" 144, "wght" 900',
          fontSize: 'clamp(64px, 11vw, 180px)',
          lineHeight: 0.9,
          letterSpacing: '-0.035em',
          color: '#E63E1F',
          margin: 0,
        }}
      >
        FIELD<span style={{ color: 'rgba(250,250,248,0.3)' }}>·</span>KIT
        <span
          aria-hidden
          style={{
            color: '#5DD3E3',
            marginLeft: '0.1em',
            opacity: cursorBlink ? 1 : 0,
            transition: 'opacity 100ms',
          }}
        >
          _
        </span>
      </h1>

      <p className="mt-8 max-w-xl" style={prose()}>
        {zh
          ? '幾個帶在身上、每次案子都用得上的小工具。可以拖拉、試用、收走。'
          : 'A few tools I keep on me. Each case gets one or more. Drag them around, poke them.'}
      </p>

      {/* Desktop: workspace for draggable widgets */}
      <div
        aria-hidden={false}
        className="hidden md:block relative mt-12"
        style={{ width: '100%', height: 620 }}
      >
        <ResumeQRWindow initialX={20} initialY={0} rotate={-2} />
        <FitCheckWindow initialX={360} initialY={40} rotate={1.5} />
        <TaipeiLiveWindow initialX={180} initialY={340} rotate={-1} />
      </div>

      {/* Mobile: stacked */}
      <div className="md:hidden mt-10 relative space-y-4" style={{ minHeight: 400 }}>
        <ResumeQRWindow initialX={0} initialY={0} />
        <FitCheckWindow initialX={0} initialY={260} />
        <TaipeiLiveWindow initialX={0} initialY={600} />
      </div>
    </>
  );
}

/* ══════════════════════════════════════════ CHAPTER 03 ══ */

function ChapterTransmissions({ zh, cursorBlink }: { zh: boolean; cursorBlink: boolean }) {
  return (
    <>
      <div className="flex items-end justify-between flex-wrap gap-6">
        <h1
          className="flex items-baseline"
          style={{
            fontFamily: 'var(--font-display), serif',
            fontVariationSettings: '"opsz" 144, "wght" 900',
            fontSize: 'clamp(64px, 11vw, 180px)',
            lineHeight: 0.9,
            letterSpacing: '-0.035em',
            color: '#E63E1F',
            margin: 0,
          }}
        >
          FIELD
          <span
            aria-hidden
            style={{
              color: '#5DD3E3',
              marginLeft: '0.08em',
              opacity: cursorBlink ? 1 : 0,
              transition: 'opacity 100ms',
            }}
          >
            .
          </span>
        </h1>
        <FrequencyDial />
      </div>

      <p className="mt-6 max-w-xl" style={prose()}>
        {zh
          ? '從現場傳回來的紀錄與想法。訊號有強有弱，但都在。'
          : 'Reports and thoughts from the field. Some transmissions are stronger than others — all of them are here.'}
      </p>

      <div className="mt-10" style={panelStyle()}>
      {/* Column header */}
      <div
        className="hidden md:grid gap-5 items-center py-3 mb-2"
        style={{
          gridTemplateColumns: '80px 80px 1fr 130px 80px 80px 100px',
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 9,
          letterSpacing: '0.3em',
          color: 'rgba(250,250,248,0.35)',
          borderBottom: '1px solid rgba(93,211,227,0.15)',
        }}
      >
        <div>ID</div>
        <div>FREQ</div>
        <div>TOPIC</div>
        <div>LOCATION</div>
        <div>LEN</div>
        <div>SIGNAL</div>
        <div className="text-right">STATUS</div>
      </div>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {TRANSMISSIONS.map((t) => (
          <li
            key={t.id}
            className="grid items-start md:items-center py-5 md:py-4"
            style={{
              gridTemplateColumns: 'auto 1fr',
              borderBottom: '1px solid rgba(93,211,227,0.08)',
            }}
          >
            {/* Desktop: 7 col */}
            <div
              className="hidden md:grid col-span-2 gap-5 items-center w-full"
              style={{ gridTemplateColumns: '80px 80px 1fr 130px 80px 80px 100px' }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 11,
                  letterSpacing: '0.26em',
                  color: '#5DD3E3',
                }}
              >
                {t.id}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  color: 'rgba(240,237,230,0.55)',
                }}
              >
                {t.freq}
              </div>
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 9,
                    letterSpacing: '0.3em',
                    color: '#E63E1F',
                  }}
                >
                  // {t.tag}
                </p>
                <h2
                  className="mt-1"
                  style={{
                    fontFamily: 'var(--font-fraunces), "Noto Serif TC", serif',
                    fontWeight: 500,
                    fontSize: 22,
                    letterSpacing: '-0.015em',
                    lineHeight: 1.25,
                    color: '#F0EDE6',
                  }}
                >
                  {zh ? t.topic.zh : t.topic.en}
                </h2>
                <p
                  className="mt-2 max-w-xl"
                  style={{
                    fontFamily: 'var(--font-noto-serif-tc), var(--font-fraunces), serif',
                    fontSize: 13,
                    lineHeight: 1.7,
                    color: 'rgba(240,237,230,0.6)',
                  }}
                >
                  {zh ? t.lede.zh : t.lede.en}
                </p>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  color: 'rgba(240,237,230,0.55)',
                }}
              >
                {t.location}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  color: 'rgba(240,237,230,0.55)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {t.duration}
              </div>
              <div className="flex items-end gap-[3px] h-5">
                <SignalBars strength={t.signalBars} />
              </div>
              <div className="flex justify-end">
                <StatusPill status={t.status} />
              </div>
            </div>

            {/* Mobile: compact */}
            <div className="md:hidden col-span-2 w-full">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 11,
                    letterSpacing: '0.26em',
                    color: '#5DD3E3',
                  }}
                >
                  {t.id}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 9,
                    letterSpacing: '0.3em',
                    color: '#E63E1F',
                  }}
                >
                  // {t.tag}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 9,
                    letterSpacing: '0.22em',
                    color: 'rgba(240,237,230,0.45)',
                  }}
                >
                  {t.freq}
                </span>
              </div>
              <h2
                className="mt-2"
                style={{
                  fontFamily: 'var(--font-fraunces), "Noto Serif TC", serif',
                  fontWeight: 500,
                  fontSize: 20,
                  letterSpacing: '-0.015em',
                  lineHeight: 1.25,
                  color: '#F0EDE6',
                }}
              >
                {zh ? t.topic.zh : t.topic.en}
              </h2>
              <p
                className="mt-2"
                style={{
                  fontFamily: 'var(--font-noto-serif-tc), var(--font-fraunces), serif',
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: 'rgba(240,237,230,0.6)',
                }}
              >
                {zh ? t.lede.zh : t.lede.en}
              </p>
              <div
                className="mt-3 flex items-center gap-4 flex-wrap"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 9,
                  letterSpacing: '0.22em',
                  color: 'rgba(240,237,230,0.45)',
                }}
              >
                <span>{t.location}</span>
                <span>·</span>
                <span>{t.duration}</span>
                <span>·</span>
                <SignalBars strength={t.signalBars} small />
                <span className="ml-auto">
                  <StatusPill status={t.status} compact />
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      </div>

      {/* Scan marquee */}
      <div
        className="relative overflow-hidden whitespace-nowrap mt-10 py-4"
        style={{
          borderTop: '1px solid rgba(93,211,227,0.15)',
          borderBottom: '1px solid rgba(93,211,227,0.15)',
        }}
      >
        <div
          className="inline-block"
          style={{
            animation: 'marquee 38s linear infinite',
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 11,
            letterSpacing: '0.3em',
            color: 'rgba(93,211,227,0.55)',
            paddingLeft: '100%',
          }}
        >
          {'· · · SCANNING FREQUENCIES · 下一則訊號傳輸中 · NEXT TRANSMISSION INCOMING · '.repeat(4)}
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════ helpers ══ */

function topStrip(): React.CSSProperties {
  return {
    fontFamily: 'var(--font-mono), monospace',
    fontSize: 10,
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color: 'rgba(250,250,248,0.45)',
  };
}

function prose(): React.CSSProperties {
  return {
    fontFamily: 'var(--font-noto-serif-tc), var(--font-fraunces), serif',
    fontSize: 15,
    lineHeight: 1.7,
    color: 'rgba(240,237,230,0.7)',
  };
}

function FrequencyDial() {
  return (
    <div
      className="hidden md:flex flex-col items-end gap-1"
      style={{
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 9,
        letterSpacing: '0.25em',
        color: 'rgba(240,237,230,0.45)',
      }}
    >
      <div className="flex items-end gap-[2px] h-5" aria-hidden>
        {Array.from({ length: 36 }).map((_, i) => {
          const isMajor = i % 9 === 0;
          const isActive = i === 14 || i === 22;
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                width: 2,
                height: isMajor ? 18 : isActive ? 14 : 8,
                background: isActive ? '#E63E1F' : isMajor ? 'rgba(93,211,227,0.7)' : 'rgba(240,237,230,0.25)',
              }}
            />
          );
        })}
      </div>
      <span style={{ color: 'rgba(240,237,230,0.55)' }}>88 — 108 MHz · FM</span>
    </div>
  );
}

function SignalBars({ strength, small }: { strength: number; small?: boolean }) {
  const h = small ? [5, 8, 11, 14] : [7, 11, 15, 19];
  return (
    <span className="inline-flex items-end gap-[2px]" aria-label={`signal ${strength}/4`}>
      {h.map((height, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            width: small ? 2 : 3,
            height,
            background: i < strength ? 'rgba(93,211,227,0.85)' : 'rgba(93,211,227,0.18)',
          }}
        />
      ))}
    </span>
  );
}

function StatusPill({ status, compact }: { status: TxStatus; compact?: boolean }) {
  return (
    <span
      className="font-mono tracking-[0.28em] uppercase inline-flex items-center gap-2"
      style={{
        fontFamily: 'var(--font-mono), monospace',
        fontSize: compact ? 9 : 10,
        border: `1px solid ${STATUS_TINT[status]}55`,
        color: STATUS_TINT[status],
        padding: compact ? '2px 6px' : '4px 10px',
      }}
    >
      <span
        aria-hidden
        style={{
          display: 'inline-block',
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: STATUS_TINT[status],
          boxShadow: status === 'LIVE' ? `0 0 8px ${STATUS_TINT[status]}` : 'none',
        }}
      />
      {status}
    </span>
  );
}
