'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransitionLink as Link } from '@/components/shared/RouteTransition';
import { SERVICES, type Service } from '@/lib/services-data';
import ContactTrigger from '@/components/contact/ContactTrigger';

type RigStatus = 'BOOKED' | 'READY' | 'OPEN' | 'STANDBY';

interface RigMeta {
  tag: string;
  deployed: string;
  cycleShort: string;
  status: RigStatus;
  rigNo: string;
}

const RIG_META: Record<string, RigMeta> = {
  'event-production':    { rigNo: '§01', tag: 'BRD', deployed: 'LIVE ARENA',    cycleShort: '6–10w',  status: 'BOOKED'  },
  'brand-experience':    { rigNo: '§02', tag: 'EXP', deployed: 'BRAND STACK',   cycleShort: '8–16w',  status: 'READY'   },
  'creative-direction':  { rigNo: '§03', tag: 'DIR', deployed: 'TONE SYSTEM',   cycleShort: 'ongoing',status: 'OPEN'    },
  'launch-strategy':     { rigNo: '§04', tag: 'LNC', deployed: 'REVEAL WEEK',   cycleShort: '12–20w', status: 'STANDBY' },
};

const FLAP_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -·';

function Flap({ char, delay = 0 }: { char: string; delay?: number }) {
  const [shown, setShown] = useState(' ');
  const [cycling, setCycling] = useState(true);
  useEffect(() => {
    setCycling(true);
    let stop = false;
    const targetIndex = FLAP_CHARS.indexOf(char.toUpperCase());
    const t = setTimeout(() => {
      let i = 0;
      const total = Math.max(6, targetIndex === -1 ? 8 : targetIndex);
      const tick = () => {
        if (stop) return;
        i += 1;
        if (i >= total) {
          setShown(char);
          setCycling(false);
          return;
        }
        setShown(FLAP_CHARS[(i * 3) % FLAP_CHARS.length]);
        setTimeout(tick, 34);
      };
      tick();
    }, delay);
    return () => {
      stop = true;
      clearTimeout(t);
    };
  }, [char, delay]);
  return (
    <span
      style={{
        display: 'inline-block',
        minWidth: '0.7em',
        textAlign: 'center',
        fontFamily: 'var(--font-mono), monospace',
        fontVariantNumeric: 'tabular-nums',
        background: 'rgba(0,0,0,0.5)',
        borderTop: '1px solid rgba(93,211,227,0.12)',
        borderBottom: '1px solid rgba(93,211,227,0.12)',
        padding: '2px 1px',
        margin: '0 1px',
        color: cycling ? 'rgba(93,211,227,0.55)' : '#FAFAF8',
        transition: 'color 60ms',
      }}
    >
      {shown}
    </span>
  );
}

function FlapText({ text, trigger }: { text: string; trigger: string | number }) {
  const chars = text.toUpperCase().split('');
  return (
    <span key={`flap-${trigger}`} className="inline-flex">
      {chars.map((c, i) => (
        <Flap key={i} char={c} delay={i * 40} />
      ))}
    </span>
  );
}

function statusColor(s: RigStatus): string {
  if (s === 'BOOKED') return '#F5B93A';   // amber — 滿檔
  if (s === 'OPEN') return '#5DD3E3';     // ice — 開放諮詢
  if (s === 'STANDBY') return '#E63E1F';  // flame — 需排隊
  return 'rgba(250,250,248,0.85)';        // ready — white
}

interface Props {
  locale: 'zh-TW' | 'en-US';
}

export default function ServicesPage({ locale }: Props) {
  const zh = locale === 'zh-TW';
  const [selected, setSelected] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [clock, setClock] = useState('');

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 18000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const update = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const ss = String(d.getSeconds()).padStart(2, '0');
      setClock(`${hh}:${mm}:${ss}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <article className="min-h-screen text-[#F0EDE6]">
      {/* ── Field inventory hero band ─────────────── */}
      <section className="relative px-5 md:px-8 pt-14 md:pt-20 pb-8">
        <div className="max-w-[1280px] mx-auto">
          <div
            className="flex items-center gap-4 flex-wrap mb-6"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 10,
              letterSpacing: '0.3em',
              color: 'rgba(250,250,248,0.45)',
              textTransform: 'uppercase',
            }}
          >
            <span>[ TLS FIELD INVENTORY · ISSUE N°003 · RIGS ]</span>
            <span style={{ color: '#5DD3E3' }}>●</span>
            <span style={{ color: '#5DD3E3' }}>LIVE</span>
            <span style={{ color: 'rgba(250,250,248,0.3)' }}>//</span>
            <span style={{ color: 'rgba(250,250,248,0.6)' }} className="tabular-nums">
              TPE {clock}
            </span>
          </div>

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
            Rigs.
          </h1>

          <div className="mt-6 flex items-end justify-between flex-wrap gap-4">
            <p
              className="max-w-2xl text-[#F0EDE6]/70 text-[14px] md:text-[15px] leading-[1.75]"
              style={{ fontFamily: 'var(--font-noto-serif-tc), var(--font-fraunces), serif' }}
            >
              {zh
                ? '四組裝備。每組有自己的適用現場、配方、踩坑筆記。點某一行 → 展開 RIG SPEC、裝備清單、操作員備註。'
                : 'Four rigs. Each has a deploy window, a kit list, and operator field notes. Click a row → RIG SPEC, kit inventory, operator note.'}
            </p>
            <div
              className="font-mono text-[10px] tracking-[0.28em] text-[#F0EDE6]/40 flex gap-5"
              style={{ fontFamily: 'var(--font-mono), monospace' }}
            >
              <span>{SERVICES.length.toString().padStart(2, '0')} RIGS</span>
              <span>·</span>
              <span>{zh ? '一對一配置' : 'ONE-ON-ONE'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Inventory board ─────────────────── */}
      <section className="px-5 md:px-8 pb-12">
        <div
          className="max-w-[1280px] mx-auto border"
          style={{
            borderColor: 'rgba(93,211,227,0.3)',
            background: 'linear-gradient(180deg, rgba(5,8,22,0.95) 0%, rgba(0,0,0,0.95) 100%)',
          }}
        >
          {/* Marquee */}
          <div
            className="overflow-hidden whitespace-nowrap"
            style={{
              borderBottom: '1px solid rgba(93,211,227,0.2)',
              padding: '8px 0',
              background: 'rgba(93,211,227,0.04)',
            }}
          >
            <span
              className="inline-block"
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 10,
                letterSpacing: '0.3em',
                color: 'rgba(245,185,58,0.85)',
                animation: 'marquee 32s linear infinite',
                paddingLeft: '100%',
              }}
            >
              {(zh
                ? '· · · ACTIVE RIG · §01 BRAND · 滿檔至 Q3 · §02 READY · §03 OPEN · · · '
                : '· · · ACTIVE RIG · §01 BRAND · BOOKED TILL Q3 · §02 READY · §03 OPEN · · · '
              ).repeat(3)}
            </span>
          </div>

          {/* Column header */}
          <div
            className="hidden md:grid items-center px-5 py-3"
            style={{
              gridTemplateColumns: '70px 1.1fr 1.4fr 70px 90px 120px 40px',
              gap: 16,
              borderBottom: '1px solid rgba(93,211,227,0.25)',
              background: 'rgba(0,0,0,0.5)',
            }}
          >
            {['RIG', 'DEPLOYED IN', 'TITLE', 'TAG', 'CYCLE', 'STATUS', '→'].map((h, i) => (
              <span
                key={i}
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 9,
                  letterSpacing: '0.32em',
                  color: 'rgba(93,211,227,0.55)',
                }}
              >
                {h}
              </span>
            ))}
          </div>

          {SERVICES.map((s) => {
            const m = RIG_META[s.id];
            if (!m) return null;
            const isSel = selected === s.id;
            return (
              <div key={s.id}>
                {/* Desktop row */}
                <button
                  onClick={() => setSelected(isSel ? null : s.id)}
                  className="hidden md:grid items-center px-5 py-4 w-full text-left"
                  style={{
                    gridTemplateColumns: '70px 1.1fr 1.4fr 70px 90px 120px 40px',
                    gap: 16,
                    background: isSel ? 'rgba(230,62,31,0.06)' : 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(93,211,227,0.08)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSel) e.currentTarget.style.background = 'rgba(93,211,227,0.03)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSel) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 10, letterSpacing: '0.24em', color: '#E63E1F' }}>
                    {m.rigNo}
                  </span>
                  <FlapText text={m.deployed} trigger={`${s.id}-d-${tick}`} />
                  <span style={{ fontFamily: 'var(--font-noto-serif-tc), serif', fontSize: 16, color: '#F0EDE6', letterSpacing: '-0.005em' }}>
                    {zh ? s.title.zh : s.title.en}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: 9,
                      letterSpacing: '0.22em',
                      color: '#5DD3E3',
                      border: '1px solid rgba(93,211,227,0.4)',
                      padding: '3px 0',
                      textAlign: 'center',
                    }}
                  >
                    {m.tag}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 10, letterSpacing: '0.18em', color: 'rgba(250,250,248,0.75)', fontVariantNumeric: 'tabular-nums' }}>
                    {m.cycleShort}
                  </span>
                  <span
                    className="inline-flex items-center gap-2"
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: 9,
                      letterSpacing: '0.3em',
                      color: statusColor(m.status),
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: statusColor(m.status),
                        boxShadow: `0 0 6px ${statusColor(m.status)}`,
                      }}
                    />
                    {m.status}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 11, letterSpacing: '0.2em', color: isSel ? '#E63E1F' : '#5DD3E3' }}>
                    {isSel ? '×' : '▸'}
                  </span>
                </button>

                {/* Mobile row */}
                <button
                  onClick={() => setSelected(isSel ? null : s.id)}
                  className="md:hidden block w-full text-left px-4 py-4"
                  style={{
                    background: isSel ? 'rgba(230,62,31,0.06)' : 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(93,211,227,0.08)',
                    cursor: 'pointer',
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 9, letterSpacing: '0.26em', color: '#E63E1F' }}>
                      {m.rigNo}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: 9,
                        letterSpacing: '0.22em',
                        color: '#5DD3E3',
                        border: '1px solid rgba(93,211,227,0.4)',
                        padding: '1px 6px',
                      }}
                    >
                      {m.tag}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 9, letterSpacing: '0.2em', color: 'rgba(250,250,248,0.5)' }}>
                      {m.cycleShort}
                    </span>
                    <span
                      className="ml-auto inline-flex items-center gap-1.5"
                      style={{
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: 8,
                        letterSpacing: '0.3em',
                        color: statusColor(m.status),
                      }}
                    >
                      <span
                        aria-hidden
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          background: statusColor(m.status),
                        }}
                      />
                      {m.status}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 10, letterSpacing: '0.22em', color: 'rgba(93,211,227,0.7)', marginBottom: 4 }}>
                    → {m.deployed}
                  </div>
                  <div style={{ fontFamily: 'var(--font-noto-serif-tc), serif', fontSize: 18, color: '#F0EDE6' }}>
                    {zh ? s.title.zh : s.title.en}
                  </div>
                </button>

                {/* Expanded rig spec */}
                <AnimatePresence>
                  {isSel && (
                    <motion.div
                      key={`detail-${s.id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                      style={{ borderBottom: '1px solid rgba(93,211,227,0.15)', background: 'rgba(5,8,22,0.98)' }}
                    >
                      <div className="px-5 md:px-8 py-10">
                        <RigSpec s={s} meta={m} zh={zh} locale={locale} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Footer LED strip */}
          <div
            className="flex items-center justify-between px-5 py-3 flex-wrap gap-3"
            style={{ borderTop: '1px solid rgba(93,211,227,0.2)', background: 'rgba(0,0,0,0.5)' }}
          >
            <div className="flex items-center gap-4">
              {SERVICES.map((s) => {
                const m = RIG_META[s.id];
                if (!m) return null;
                return (
                  <span key={s.id} className="inline-flex items-center gap-1.5">
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: statusColor(m.status),
                        boxShadow: `0 0 6px ${statusColor(m.status)}`,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: 9,
                        letterSpacing: '0.26em',
                        color: 'rgba(250,250,248,0.55)',
                      }}
                    >
                      {m.rigNo}
                    </span>
                  </span>
                );
              })}
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 9,
                letterSpacing: '0.3em',
                color: 'rgba(93,211,227,0.55)',
              }}
            >
              TLS FIELD INVENTORY · TPE · LIVE
            </span>
          </div>
        </div>
      </section>

      {/* ── Footer CTA ─────────────────── */}
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
              ? '覺得某組裝備適合你的案子？寄一份 brief 給我，48 小時內會收到回覆 — 不管接不接。'
              : 'Think one of these rigs fits your project? Send a brief — reply within 48 hours, whether we take it or not.'}
          </p>
          <ContactTrigger
            className="back-link-lg inline-flex items-center whitespace-nowrap"
            data-cursor="▸ BRIEF"
            data-cursor-variant="link"
          >
            {zh ? '寄一份 BRIEF →' : 'Send a brief →'}
          </ContactTrigger>
        </div>
      </section>
    </article>
  );
}

/* ════════════════════════════════════ RIG SPEC ═══ */

function RigSpec({
  s,
  meta,
  zh,
  locale,
}: {
  s: Service;
  meta: RigMeta;
  zh: boolean;
  locale: 'zh-TW' | 'en-US';
}) {
  return (
    <div className="grid gap-10 md:grid-cols-[300px_1fr]">
      {/* ── Left: rig spec sheet ── */}
      <aside className="space-y-5">
        <div>
          <p style={sectionLabel('#5DD3E3')}>
            [ RIG SPEC · {meta.rigNo} · {meta.tag} ]
          </p>
          <p className="mt-2" style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 10, letterSpacing: '0.26em', color: 'rgba(250,250,248,0.55)' }}>
            → {meta.deployed}
          </p>
        </div>

        <dl
          className="space-y-3 pt-3"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 10,
            letterSpacing: '0.24em',
            color: 'rgba(240,237,230,0.55)',
            borderTop: '1px solid rgba(93,211,227,0.18)',
          }}
        >
          <SpecRow k={zh ? '週期' : 'CYCLE'} v={s.specs.cycle} />
          <SpecRow k={zh ? '團隊' : 'TEAM'} v={s.specs.team} />
          <SpecRow k={zh ? '量級' : 'SCALE'} v={s.specs.budget} />
          <SpecRow k={zh ? '標籤' : 'TAG'} v={meta.tag} />
          <SpecRow k={zh ? '狀態' : 'STATUS'} v={meta.status} />
        </dl>

        {s.caseRefs.length > 0 && (
          <div className="pt-3" style={{ borderTop: '1px solid rgba(93,211,227,0.18)' }}>
            <p style={sectionLabel()}>{zh ? '// 曾派案例' : '// DEPLOYED CASES'}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {s.caseRefs.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${locale}/work/${r.slug}`}
                  data-cursor="▸ OPEN"
                  data-cursor-variant="link"
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 10,
                    letterSpacing: '0.24em',
                    border: '1px solid rgba(93,211,227,0.4)',
                    color: '#5DD3E3',
                    padding: '6px 10px',
                    textDecoration: 'none',
                  }}
                >
                  → {r.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* ── Right: manual ── */}
      <div>
        <h2
          style={{
            fontFamily: 'var(--font-fraunces), "Noto Serif TC", serif',
            fontWeight: 500,
            fontSize: 'clamp(30px, 4vw, 52px)',
            letterSpacing: '-0.02em',
            color: '#F0EDE6',
            margin: 0,
            marginBottom: 28,
            lineHeight: 1.05,
          }}
        >
          {zh ? s.title.zh : s.title.en}
        </h2>

        <Block label={zh ? '// 出勤時機' : '// DEPLOY WINDOW'}>
          <p
            className="text-[#F0EDE6]/75 text-[15px] md:text-[16px] leading-[1.85] max-w-2xl"
            style={{ fontFamily: 'var(--font-noto-serif-tc), var(--font-fraunces), serif' }}
          >
            {zh ? s.whenToDeploy.zh : s.whenToDeploy.en}
          </p>
        </Block>

        <Block label={zh ? '// 裝備清單' : '// IN THE KIT'}>
          <ul className="space-y-2 max-w-2xl">
            {(zh ? s.kitContents.zh : s.kitContents.en).map((k, i) => (
              <li
                key={k}
                className="flex items-baseline gap-4 text-[#F0EDE6]/75 text-[14px] md:text-[15px]"
                style={{ fontFamily: 'var(--font-noto-serif-tc), var(--font-fraunces), serif' }}
              >
                <span
                  className="shrink-0 w-7 tabular-nums"
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    color: '#5DD3E3',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                {k}
              </li>
            ))}
          </ul>
        </Block>

        <Block label={zh ? '// 現場筆記' : '// FIELD NOTES'} warning>
          <ul className="space-y-2 max-w-2xl">
            {(zh ? s.commonMistakes.zh : s.commonMistakes.en).map((m) => (
              <li
                key={m}
                className="flex items-baseline gap-4 text-[#F0EDE6]/65 text-[14px] md:text-[15px]"
                style={{ fontFamily: 'var(--font-noto-serif-tc), var(--font-fraunces), serif' }}
              >
                <span
                  className="shrink-0"
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 11,
                    color: '#E63E1F',
                  }}
                >
                  ✕
                </span>
                {m}
              </li>
            ))}
          </ul>
        </Block>

        {/* Operator note */}
        <div
          className="mt-10 max-w-2xl pl-5"
          style={{ borderLeft: '2px solid rgba(230,62,31,0.5)' }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 9,
              letterSpacing: '0.3em',
              color: '#E63E1F',
              marginBottom: 10,
            }}
          >
            {zh ? '// 操作員備註' : '// OPERATOR NOTE'}
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
    </div>
  );
}

function Block({
  label: text,
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
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 9,
          letterSpacing: '0.3em',
          color: warning ? 'rgba(230,62,31,0.75)' : 'rgba(93,211,227,0.75)',
          marginBottom: 14,
        }}
      >
        {text}
      </p>
      {children}
    </div>
  );
}

function SpecRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt style={{ color: 'rgba(240,237,230,0.45)' }}>{k}</dt>
      <dd style={{ color: 'rgba(240,237,230,0.85)' }}>{v}</dd>
    </div>
  );
}

function sectionLabel(color = 'rgba(93,211,227,0.7)'): React.CSSProperties {
  return {
    fontFamily: 'var(--font-mono), monospace',
    fontSize: 10,
    letterSpacing: '0.3em',
    color,
    margin: 0,
    textTransform: 'uppercase',
  };
}
