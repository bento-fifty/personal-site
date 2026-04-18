'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ToolRow = {
  id: string;
  code: string;
  title: string;
  spec: string;
  dest: string;
  gate: string;
  dep: string;
  status: 'ON TIME' | 'BOARDING' | 'DELAYED' | 'GATE OPEN';
  stickers: string[];
  kit: string[];
  hex: string;
};

const TOOLS: ToolRow[] = [
  {
    id: '01',
    code: 'BRAND',
    title: '品牌體驗',
    spec: '8–16 週 · 2–4 人',
    dest: 'IMMERSIVE',
    gate: 'A-03',
    dep: '08:15',
    status: 'BOARDING',
    stickers: ['FRAGILE', 'TLS ✈'],
    kit: ['concept', 'touchpoints', 'ritual', 'tracking'],
    hex: '#E63E1F',
  },
  {
    id: '02',
    code: 'CONFERENCE',
    title: '會議／高峰會',
    spec: '6–10 週 · 3–6 人',
    dest: 'SUMMIT',
    gate: 'B-12',
    dep: '09:40',
    status: 'ON TIME',
    stickers: ['HEAVY', 'THIS SIDE UP'],
    kit: ['stage', 'keynote', 'cue', 'crew'],
    hex: '#5DD3E3',
  },
  {
    id: '03',
    code: 'POPUP',
    title: '快閃／限時',
    spec: '3–6 週 · 2–3 人',
    dest: 'STREET',
    gate: 'C-07',
    dep: '10:05',
    status: 'GATE OPEN',
    stickers: ['RUSH', 'KEEP UPRIGHT'],
    kit: ['scout', 'build', 'permit', 'takedown'],
    hex: '#F5B93A',
  },
  {
    id: '04',
    code: 'LAUNCH',
    title: '產品上市',
    spec: '4–8 週 · 3–5 人',
    dest: 'REVEAL',
    gate: 'D-04',
    dep: '11:30',
    status: 'DELAYED',
    stickers: ['DO NOT DROP', 'TLS ⚡'],
    kit: ['script', 'media', 'KOL', 'd-day'],
    hex: '#9F5EFF',
  },
];

export default function ServiceConceptsLab() {
  return (
    <div style={{ color: '#FAFAF8' }}>
      <div className="max-w-[1400px] mx-auto px-8 py-20">
        <header className="mb-16 border-b pb-8" style={{ borderColor: 'rgba(93,211,227,0.2)' }}>
          <p style={lab()}>[ LAB · SERVICE RE-DESIGN · 4 CONCEPTS ]</p>
          <h1
            style={{
              fontFamily: 'var(--font-fraunces), serif',
              fontVariationSettings: '"opsz" 144, "wght" 800',
              fontSize: 72,
              lineHeight: 1,
              letterSpacing: '-0.035em',
              color: '#E63E1F',
              margin: 0,
            }}
          >
            Pick your favorite.
          </h1>
          <p
            className="mt-4 max-w-2xl"
            style={{
              fontFamily: 'var(--font-noto-serif-tc), serif',
              fontSize: 15,
              color: 'rgba(250,250,248,0.7)',
              lineHeight: 1.7,
            }}
          >
            E / F 是替掉 A B 的新方向。C / D 照舊。滑滑看、點點看。
          </p>
        </header>
        <OptionE />
        <OptionF />
        <OptionC />
        <OptionD />
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════ E · DEPARTURES BOARD ═══ */

const FLAP_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -·';

function Flap({ char, delay = 0 }: { char: string; delay?: number }) {
  const [shown, setShown] = useState(' ');
  const [cycling, setCycling] = useState(true);
  useEffect(() => {
    setCycling(true);
    let stop = false;
    const targetIndex = FLAP_CHARS.indexOf(char.toUpperCase());
    let t = setTimeout(() => {
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

function OptionE() {
  const [selected, setSelected] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 12000);
    return () => clearInterval(id);
  }, []);

  const active = TOOLS.find((t) => t.id === selected);

  return (
    <Section
      n="E"
      title="DEPARTURES BOARD · 航班看板"
      desc="機場離境看板 + split-flap 翻牌。每個 tool 是一班航班。點 row → 翻牌切至登機資訊。hospitality / 計時 / 旅程感。"
    >
      <div
        className="border"
        style={{
          borderColor: 'rgba(93,211,227,0.3)',
          background: 'linear-gradient(180deg, rgba(5,8,22,0.95) 0%, rgba(0,0,0,0.95) 100%)',
        }}
      >
        {/* Top marquee */}
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
            {'· · · NEXT DEPARTURE: BRAND · GATE A-03 · BOARDING IN T-14:00 · ALL PASSENGERS KINDLY PROCEED · · · '.repeat(
              3,
            )}
          </span>
        </div>

        {/* header row */}
        <div
          className="grid items-center px-5 py-3"
          style={{
            gridTemplateColumns: '70px 1.2fr 1fr 80px 80px 130px 40px',
            gap: 16,
            borderBottom: '1px solid rgba(93,211,227,0.25)',
            background: 'rgba(0,0,0,0.5)',
          }}
        >
          {['TOOL', 'DESTINATION', 'GATE', 'DEP.', 'TIME', 'STATUS', '→'].map((h, i) => (
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

        {/* rows */}
        {TOOLS.map((t) => {
          const isSel = selected === t.id;
          const statusColor =
            t.status === 'BOARDING'
              ? '#F5B93A'
              : t.status === 'GATE OPEN'
                ? '#5DD3E3'
                : t.status === 'DELAYED'
                  ? '#E63E1F'
                  : 'rgba(250,250,248,0.7)';
          return (
            <div key={t.id}>
              <button
                onClick={() => setSelected(isSel ? null : t.id)}
                className="grid items-center px-5 py-4 w-full text-left"
                style={{
                  gridTemplateColumns: '70px 1.2fr 1fr 80px 80px 130px 40px',
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
                  TLS{t.id}
                </span>
                <FlapText text={t.dest} trigger={`${t.id}-${tick}`} />
                <FlapText text={t.code} trigger={`${t.id}-c-${tick}`} />
                <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 11, letterSpacing: '0.2em', color: 'rgba(250,250,248,0.85)', fontVariantNumeric: 'tabular-nums' }}>
                  {t.gate}
                </span>
                <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 11, letterSpacing: '0.2em', color: 'rgba(250,250,248,0.85)', fontVariantNumeric: 'tabular-nums' }}>
                  {t.dep}
                </span>
                <span
                  className="inline-flex items-center gap-2"
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 9,
                    letterSpacing: '0.3em',
                    color: statusColor,
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: statusColor,
                      boxShadow: `0 0 6px ${statusColor}`,
                    }}
                  />
                  {t.status}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 11,
                    letterSpacing: '0.2em',
                    color: isSel ? '#E63E1F' : '#5DD3E3',
                  }}
                >
                  {isSel ? '×' : '▸'}
                </span>
              </button>

              {/* boarding info panel */}
              <AnimatePresence>
                {isSel && active && active.id === t.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                    style={{ borderBottom: '1px solid rgba(93,211,227,0.08)' }}
                  >
                    <div
                      className="grid gap-6 px-5 py-6"
                      style={{
                        gridTemplateColumns: '1fr 1fr 1fr',
                        background: 'rgba(5,8,22,0.95)',
                      }}
                    >
                      <BoardingBlock label="BOARDING PASS" value={`TLS-${active.id} · ${active.code}`} mono />
                      <BoardingBlock label="DURATION" value={active.spec} mono />
                      <BoardingBlock label="CARRIER" value="THE LEVEL STUDIO" mono />
                      <BoardingBlock label="DESTINATION" value={active.title} serif wide />
                      <BoardingBlock label="GATE OPENS" value={`T-15:00 · ${active.dep}`} mono />
                      <BoardingBlock label="SEAT" value="ONE-ON-ONE" mono />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* footer: LED status strip */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: '1px solid rgba(93,211,227,0.2)', background: 'rgba(0,0,0,0.5)' }}
        >
          <div className="flex items-center gap-3">
            {TOOLS.map((t) => {
              const color =
                t.status === 'BOARDING'
                  ? '#F5B93A'
                  : t.status === 'GATE OPEN'
                    ? '#5DD3E3'
                    : t.status === 'DELAYED'
                      ? '#E63E1F'
                      : 'rgba(250,250,248,0.5)';
              return (
                <span key={t.id} className="inline-flex items-center gap-1.5">
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: color,
                      boxShadow: `0 0 6px ${color}`,
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
                    {t.id}
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
            TLS TERMINAL · TPE · LIVE BOARD
          </span>
        </div>
      </div>
    </Section>
  );
}

function BoardingBlock({
  label,
  value,
  mono,
  serif,
  wide,
}: {
  label: string;
  value: string;
  mono?: boolean;
  serif?: boolean;
  wide?: boolean;
}) {
  return (
    <div style={{ gridColumn: wide ? 'span 3' : undefined }}>
      <p
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 9,
          letterSpacing: '0.3em',
          color: 'rgba(93,211,227,0.55)',
          textTransform: 'uppercase',
          margin: 0,
        }}
      >
        {label}
      </p>
      <p
        className="mt-1.5"
        style={{
          fontFamily: serif
            ? 'var(--font-noto-serif-tc), var(--font-fraunces), serif'
            : 'var(--font-mono), monospace',
          fontSize: serif ? 26 : mono ? 12 : 14,
          letterSpacing: serif ? '-0.015em' : '0.16em',
          color: '#FAFAF8',
          margin: 0,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </p>
    </div>
  );
}

/* ═════════════════════════════════════════ F · PELICAN FLIGHT CASE ═══ */

function OptionF() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Section
      n="F"
      title="PELICAN FLIGHT CASE · 器材防水箱"
      desc="touring 的 Pelican case 並排。hover 蓋子掀 12°、點蓋全開 105°，內部泡棉格子露出 kit。真實 event tech 質感。"
    >
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {TOOLS.map((t) => {
          const isOpen = open === t.id;
          return (
            <FlightCase
              key={t.id}
              tool={t}
              isOpen={isOpen}
              onToggle={() => setOpen(isOpen ? null : t.id)}
            />
          );
        })}
      </div>
    </Section>
  );
}

function FlightCase({
  tool,
  isOpen,
  onToggle,
}: {
  tool: ToolRow;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [hover, setHover] = useState(false);
  const rotateX = isOpen ? -105 : hover ? -12 : 0;

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative text-left"
      style={{
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        perspective: 1200,
        aspectRatio: '5 / 3',
      }}
    >
      {/* Case body (foam interior when open) */}
      <div
        className="absolute inset-0 flex flex-col p-5"
        style={{
          background:
            'repeating-linear-gradient(135deg, #18181c 0px, #18181c 3px, #0f0f13 3px, #0f0f13 6px)',
          border: '2px solid #2a2d32',
          boxShadow: 'inset 0 0 0 1px rgba(250,250,248,0.05)',
        }}
      >
        {/* foam cutout pattern */}
        <div
          aria-hidden
          className="absolute inset-4"
          style={{
            background:
              'radial-gradient(circle at 20% 30%, rgba(0,0,0,0.6) 0%, transparent 30%), radial-gradient(circle at 70% 40%, rgba(0,0,0,0.5) 0%, transparent 28%), radial-gradient(circle at 40% 75%, rgba(0,0,0,0.55) 0%, transparent 32%), radial-gradient(circle at 82% 80%, rgba(0,0,0,0.5) 0%, transparent 26%)',
            borderRadius: 4,
            filter: 'blur(0.5px)',
          }}
        />

        {/* Kit list overlay */}
        <div className="relative z-10 flex-1 flex flex-col">
          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 9,
              letterSpacing: '0.3em',
              color: 'rgba(93,211,227,0.7)',
            }}
          >
            FOAM · KIT INVENTORY
          </span>
          <div
            className="mt-3 grid flex-1 gap-3"
            style={{ gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(2, 1fr)' }}
          >
            {tool.kit.map((k, i) => (
              <div
                key={k}
                className="flex items-center justify-center"
                style={{
                  background: 'rgba(0,0,0,0.55)',
                  border: '1px dashed rgba(93,211,227,0.2)',
                  boxShadow: 'inset 0 8px 24px rgba(0,0,0,0.7)',
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 10,
                  letterSpacing: '0.22em',
                  color: 'rgba(250,250,248,0.7)',
                  textTransform: 'uppercase',
                }}
              >
                <span style={{ color: '#5DD3E3', marginRight: 8, fontSize: 9 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {k}
              </div>
            ))}
          </div>
          <p
            className="mt-3"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 9,
              letterSpacing: '0.26em',
              color: 'rgba(250,250,248,0.45)',
            }}
          >
            {tool.spec}
          </p>
        </div>
      </div>

      {/* Lid */}
      <div
        className="flex flex-col p-5"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          transformOrigin: 'top center',
          transform: `rotateX(${rotateX}deg)`,
          transition: 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)',
          boxShadow: isOpen ? '0 -40px 60px rgba(0,0,0,0.6)' : 'none',
          background: 'linear-gradient(180deg, #232327 0%, #121216 100%)',
          border: '2px solid #3a3d44',
          opacity: isOpen ? 0 : 1,
          pointerEvents: isOpen ? 'none' : 'auto',
        }}
      >
        {/* corner aluminum edges */}
        {([['tl', 0, 0], ['tr', 'auto', 0], ['bl', 0, 'auto'], ['br', 'auto', 'auto']] as const).map(
            ([k, l, t2]) => (
              <span
                key={k}
                aria-hidden
                style={{
                  position: 'absolute',
                  left: l === 0 ? 0 : undefined,
                  right: l !== 0 ? 0 : undefined,
                  top: t2 === 0 ? 0 : undefined,
                  bottom: t2 !== 0 ? 0 : undefined,
                  width: 26,
                  height: 26,
                  background:
                    'linear-gradient(135deg, rgba(180,180,195,0.45) 0%, rgba(90,92,105,0.5) 100%)',
                  clipPath:
                    k === 'tl'
                      ? 'polygon(0 0, 100% 0, 0 100%)'
                      : k === 'tr'
                        ? 'polygon(0 0, 100% 0, 100% 100%)'
                        : k === 'bl'
                          ? 'polygon(0 0, 100% 100%, 0 100%)'
                          : 'polygon(100% 0, 100% 100%, 0 100%)',
                }}
              />
            ),
          )}

          {/* latches */}
          <span
            aria-hidden
            style={{
              position: 'absolute',
              left: '50%',
              top: -5,
              transform: 'translateX(-50%)',
              width: 44,
              height: 14,
              background: 'linear-gradient(180deg, #3a3d44 0%, #1a1a1e 100%)',
              border: '1px solid #555',
              borderRadius: 2,
            }}
          />

          {/* ID plate */}
          <div className="flex items-start justify-between">
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 9,
                  letterSpacing: '0.3em',
                  color: 'rgba(93,211,227,0.6)',
                }}
              >
                CASE {tool.id}
              </p>
              <p
                className="mt-1"
                style={{
                  fontFamily: 'var(--font-display), serif',
                  fontVariationSettings: '"opsz" 144, "wght" 700',
                  fontSize: 52,
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  color: tool.hex,
                  margin: 0,
                }}
              >
                {tool.code}
              </p>
              <p
                className="mt-2"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: 10,
                  letterSpacing: '0.24em',
                  color: 'rgba(250,250,248,0.55)',
                }}
              >
                → {tool.dest} · GATE {tool.gate}
              </p>
            </div>

            {/* hex chip */}
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 9,
                letterSpacing: '0.22em',
                color: tool.hex,
                border: `1px solid ${tool.hex}66`,
                padding: '3px 7px',
                background: 'rgba(0,0,0,0.4)',
              }}
            >
              {tool.hex}
            </span>
          </div>

          {/* stickers row */}
          <div className="mt-auto flex items-end justify-between">
            <div className="flex gap-2 flex-wrap">
              {tool.stickers.map((s) => (
                <span
                  key={s}
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 8,
                    letterSpacing: '0.28em',
                    color: '#0B1026',
                    background: '#F5B93A',
                    padding: '3px 6px',
                    transform: `rotate(${(s.charCodeAt(0) % 5) - 2}deg)`,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
            <span
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 9,
                letterSpacing: '0.3em',
                color: isOpen ? '#E63E1F' : '#5DD3E3',
              }}
            >
              {isOpen ? '[ ✕ CLOSE ]' : hover ? '[ ▸ UNLOCK ]' : '[ ▸ ]'}
            </span>
          </div>
      </div>
    </button>
  );
}

/* ═════════════════════════════════════════ C · CUE SHEET ═══ */

function OptionC() {
  const [openCue, setOpenCue] = useState<string | null>(null);
  const CUES = [
    { id: '01', tc: 'T−4w · +0',   tool: TOOLS[0], action: '概念起 · moodboard · venue scout', dur: '4 weeks' },
    { id: '02', tc: 'T−2w · +14',  tool: TOOLS[1], action: '程序打樣 · 跑台走位 · cue 初排',    dur: '2 weeks' },
    { id: '03', tc: 'T−1w · +21',  tool: TOOLS[2], action: '場佈施工 · 設備進場 · 彩排',       dur: '5 days' },
    { id: '04', tc: 'T−0  · +28',  tool: TOOLS[3], action: '現場啟動 · show call · 即時調度',   dur: 'D-DAY' },
  ];
  return (
    <Section
      n="C"
      title="CUE SHEET / SHOW CALL"
      desc="劇場式直列 cue 表。每個 tool 是一行 cue，帶 timecode + 動作 + 時長。點 cue → 展開細節，像真的在排 show。"
    >
      <div className="border" style={{ borderColor: 'rgba(93,211,227,0.25)', background: 'rgba(0,0,0,0.3)' }}>
        <div
          className="grid items-center px-5 py-3"
          style={{
            gridTemplateColumns: '60px 140px 1fr 90px 40px',
            gap: 16,
            borderBottom: '1px solid rgba(93,211,227,0.3)',
            background: 'rgba(93,211,227,0.04)',
          }}
        >
          {['CUE', 'TIMECODE', 'DEPLOY', 'DUR.', 'GO'].map((h) => (
            <span key={h} style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 9, letterSpacing: '0.3em', color: 'rgba(93,211,227,0.7)' }}>
              {h}
            </span>
          ))}
        </div>
        {CUES.map((c) => {
          const open = openCue === c.id;
          return (
            <div key={c.id}>
              <button
                onClick={() => setOpenCue(open ? null : c.id)}
                className="grid items-center px-5 py-4 w-full text-left"
                style={{
                  gridTemplateColumns: '60px 140px 1fr 90px 40px',
                  gap: 16,
                  background: open ? 'rgba(230,62,31,0.06)' : 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(250,250,248,0.06)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { if (!open) e.currentTarget.style.background = 'rgba(93,211,227,0.04)'; }}
                onMouseLeave={(e) => { if (!open) e.currentTarget.style.background = 'transparent'; }}
              >
                <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 11, letterSpacing: '0.22em', color: '#E63E1F' }}>
                  {c.id}
                </span>
                <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 10, letterSpacing: '0.2em', color: 'rgba(250,250,248,0.65)', fontVariantNumeric: 'tabular-nums' }}>
                  {c.tc}
                </span>
                <span>
                  <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 9, letterSpacing: '0.3em', color: '#5DD3E3' }}>
                    ▸ {c.tool.code}
                  </span>
                  <span className="ml-3" style={{ fontFamily: 'var(--font-noto-serif-tc), serif', fontSize: 15, color: '#FAFAF8' }}>
                    {c.action}
                  </span>
                </span>
                <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 9, letterSpacing: '0.22em', color: c.dur === 'D-DAY' ? '#E63E1F' : 'rgba(250,250,248,0.55)' }}>
                  {c.dur}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 9,
                    letterSpacing: '0.3em',
                    color: open ? '#0B1026' : '#5DD3E3',
                    background: open ? '#5DD3E3' : 'transparent',
                    border: '1px solid #5DD3E3',
                    padding: '3px 6px',
                    textAlign: 'center',
                  }}
                >
                  {open ? 'GO' : '▸'}
                </span>
              </button>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 py-5" style={{ borderBottom: '1px solid rgba(250,250,248,0.06)', background: 'rgba(11,16,38,0.4)' }}>
                      <h3 style={{ fontFamily: 'var(--font-noto-serif-tc), serif', fontSize: 20, color: '#FAFAF8', margin: 0 }}>
                        {c.tool.title}
                      </h3>
                      <p className="mt-2" style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 10, letterSpacing: '0.2em', color: 'rgba(250,250,248,0.55)' }}>
                        {c.tool.spec}
                      </p>
                      <p className="mt-4" style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 9, letterSpacing: '0.3em', color: '#5DD3E3' }}>
                        [ ▸ READ FULL MANUAL ]
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ═════════════════════════════════════════ D · LOCKER GRID ═══ */

function OptionD() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Section
      n="D"
      title="LOCKER GRID"
      desc="金屬置物櫃 4 格。hover 櫃子傾斜開啟、露出內容；點 → 整格展開成 full panel。情報員 / 工具箱 / 寄物櫃隱喻。"
    >
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {TOOLS.map((t) => {
          const isOpen = open === t.id;
          return (
            <Locker
              key={t.id}
              tool={t}
              isOpen={isOpen}
              onToggle={() => setOpen(isOpen ? null : t.id)}
            />
          );
        })}
      </div>
    </Section>
  );
}

function Locker({
  tool,
  isOpen,
  onToggle,
}: {
  tool: ToolRow;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [hover, setHover] = useState(false);
  const rotate = isOpen ? -18 : hover ? -5 : 0;
  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative text-left"
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        aspectRatio: '3 / 4',
        perspective: 900,
      }}
    >
      <div
        className="absolute inset-0 p-4 flex flex-col"
        style={{
          background: 'rgba(11,16,38,0.8)',
          border: '1px solid rgba(93,211,227,0.3)',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 9, letterSpacing: '0.28em', color: '#5DD3E3' }}>
          #{tool.id} · {tool.code}
        </span>
        <h3 className="mt-2" style={{ fontFamily: 'var(--font-noto-serif-tc), serif', fontSize: 20, color: '#FAFAF8', margin: 0, lineHeight: 1.2 }}>
          {tool.title}
        </h3>
        <p className="mt-3" style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 9, letterSpacing: '0.22em', color: 'rgba(250,250,248,0.5)', lineHeight: 1.6 }}>
          {tool.spec}
        </p>
        <div className="mt-auto pt-3" style={{ borderTop: '1px dashed rgba(93,211,227,0.25)' }}>
          <p style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 8, letterSpacing: '0.3em', color: 'rgba(250,250,248,0.45)', textTransform: 'uppercase' }}>
            {'> KIT (sample)'}
          </p>
          <ul className="mt-1 space-y-0.5" style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 9, color: 'rgba(250,250,248,0.7)' }}>
            {tool.kit.slice(0, 3).map((k, i) => (
              <li key={k}>{String(i + 1).padStart(2, '0')} {k}</li>
            ))}
          </ul>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(145deg, hsl(${(Number(tool.id) * 51) % 360},22%,18%) 0%, hsl(${(Number(tool.id) * 51 + 14) % 360},24%,9%) 100%)`,
          border: '1px solid rgba(93,211,227,0.3)',
          transformOrigin: 'left center',
          transform: `rotateY(${rotate}deg)`,
          transition: 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1)',
          boxShadow: isOpen ? '-20px 0 40px rgba(0,0,0,0.5)' : 'none',
          padding: 14,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <span aria-hidden style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: 'rgba(93,211,227,0.15)' }} />
        <span aria-hidden style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 6, height: 40, background: 'rgba(93,211,227,0.4)' }} />
        <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 9, letterSpacing: '0.28em', color: 'rgba(93,211,227,0.6)' }}>
          LOCKER
        </span>
        <span className="mt-1" style={{ fontFamily: 'var(--font-display), serif', fontVariationSettings: '"opsz" 144, "wght" 700', fontSize: 56, color: '#E63E1F', lineHeight: 1 }}>
          {tool.id}
        </span>
        <span className="mt-auto" style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 9, letterSpacing: '0.3em', color: 'rgba(250,250,248,0.7)' }}>
          {tool.code}
        </span>
        <span
          className="absolute bottom-3 right-3"
          style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 8, letterSpacing: '0.3em', color: '#5DD3E3' }}
        >
          {isOpen ? '[ ✕ CLOSE ]' : hover ? '[ ▸ OPEN ]' : '[ ▸ ]'}
        </span>
      </div>
    </button>
  );
}

/* ═════════════════════════════════════════ helpers ═══ */

function Section({ n, title, desc, children }: { n: string; title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="mb-24">
      <div className="mb-8 flex items-baseline gap-6">
        <span
          style={{
            fontFamily: 'var(--font-fraunces), serif',
            fontVariationSettings: '"opsz" 144, "wght" 800',
            fontSize: 64,
            color: '#E63E1F',
            lineHeight: 1,
            letterSpacing: '-0.03em',
          }}
        >
          {n}
        </span>
        <div>
          <h2 style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 14, letterSpacing: '0.28em', color: '#FAFAF8', margin: 0 }}>
            {title}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-noto-serif-tc), serif',
              fontSize: 13,
              color: 'rgba(250,250,248,0.55)',
              marginTop: 6,
              lineHeight: 1.7,
              maxWidth: 780,
            }}
          >
            {desc}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

function lab(): React.CSSProperties {
  return {
    fontFamily: 'var(--font-mono), monospace',
    fontSize: 10,
    letterSpacing: '0.3em',
    color: 'rgba(93,211,227,0.7)',
    marginBottom: 12,
    textTransform: 'uppercase',
  };
}
