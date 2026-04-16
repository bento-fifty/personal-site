import type { Metadata } from 'next';
import { TRANSMISSIONS, type TxStatus } from '@/lib/blog-data';

export const metadata: Metadata = {
  title: 'Transmissions — The Level Studio',
};

const STATUS_TINT: Record<TxStatus, string> = {
  LIVE: '#5DD3E3',
  ARCHIVED: '#F0EDE6',
  CLASSIFIED: '#E63E1F',
  DRAFT: '#9FEFF7',
};

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const zh = locale === 'zh-TW';

  return (
    <article className="min-h-screen text-[#F0EDE6]">
      {/* ── Hero band: Transmission log header ─────── */}
      <section
        className="relative px-5 md:px-8 pt-16 md:pt-24 pb-8"
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
            [ TRANSMISSION LOG · ISSUE N°003 · FIELD RADIO ]
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
            Field.
          </h1>

          {/* Frequency dial — decorative */}
          <div className="mt-8 flex items-end justify-between flex-wrap gap-4">
            <p
              className="max-w-2xl text-[#F0EDE6]/70 text-[14px] md:text-[15px] leading-[1.75]"
              style={{ fontFamily: 'var(--font-noto-serif-tc), var(--font-fraunces), serif' }}
            >
              {zh
                ? '從現場傳回來的紀錄與想法。訊號有強有弱，但都在。'
                : 'Reports and thoughts from the field. Some transmissions are stronger than others — all of them are here.'}
            </p>
            <FrequencyDial />
          </div>
        </div>
      </section>

      {/* ── Log entries ──────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-12 md:py-16">
        {/* Column header strip */}
        <div
          className="hidden md:grid grid-cols-[90px_80px_1fr_140px_90px_90px_110px] gap-5 items-center py-3 mb-2 font-mono text-[9px] tracking-[0.3em] text-[#F0EDE6]/35"
          style={{
            fontFamily: 'var(--font-mono), monospace',
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

        <ul>
          {TRANSMISSIONS.map((t) => (
            <li
              key={t.id}
              className="group grid grid-cols-[auto_1fr] md:grid-cols-[90px_80px_1fr_140px_90px_90px_110px] gap-x-5 gap-y-3 items-start md:items-center py-5 md:py-4"
              style={{ borderBottom: '1px solid rgba(93,211,227,0.08)' }}
            >
              {/* ID */}
              <div
                className="font-mono text-[11px] tracking-[0.26em] text-[#5DD3E3] row-span-2 md:row-span-1"
                style={{ fontFamily: 'var(--font-mono), monospace' }}
              >
                {t.id}
              </div>

              {/* Freq — desktop only */}
              <div
                className="hidden md:block font-mono text-[10px] tracking-[0.22em] text-[#F0EDE6]/55"
                style={{ fontFamily: 'var(--font-mono), monospace' }}
              >
                {t.freq}
              </div>

              {/* Topic + lede */}
              <div>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <p
                    className="font-mono text-[9px] tracking-[0.3em]"
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      color: '#E63E1F',
                    }}
                  >
                    // {t.tag}
                  </p>
                  <p
                    className="md:hidden font-mono text-[9px] tracking-[0.22em] text-[#F0EDE6]/45"
                    style={{ fontFamily: 'var(--font-mono), monospace' }}
                  >
                    {t.freq}
                  </p>
                </div>
                <h2
                  className="mt-1 text-[#F0EDE6] text-[22px] md:text-[24px] leading-[1.2]"
                  style={{
                    fontFamily: 'var(--font-fraunces), "Noto Serif TC", serif',
                    fontWeight: 500,
                    letterSpacing: '-0.015em',
                  }}
                >
                  {zh ? t.topic.zh : t.topic.en}
                </h2>
                <p
                  className="mt-2 text-[#F0EDE6]/60 text-[13px] leading-[1.65] max-w-xl"
                  style={{
                    fontFamily: 'var(--font-noto-serif-tc), var(--font-fraunces), serif',
                  }}
                >
                  {zh ? t.lede.zh : t.lede.en}
                </p>
              </div>

              {/* Location — desktop only */}
              <div
                className="hidden md:block font-mono text-[10px] tracking-[0.22em] text-[#F0EDE6]/55"
                style={{ fontFamily: 'var(--font-mono), monospace' }}
              >
                {t.location}
              </div>

              {/* Duration — desktop only */}
              <div
                className="hidden md:block font-mono text-[10px] tracking-[0.2em] text-[#F0EDE6]/55 tabular-nums"
                style={{ fontFamily: 'var(--font-mono), monospace' }}
              >
                {t.duration}
              </div>

              {/* Signal strength */}
              <div className="hidden md:flex items-end gap-[3px] h-5">
                <SignalBars strength={t.signalBars} />
              </div>

              {/* Status pill */}
              <div className="hidden md:flex justify-end">
                <StatusPill status={t.status} />
              </div>

              {/* mobile meta strip (second row) */}
              <div
                className="md:hidden col-start-2 col-span-1 flex items-center gap-4 font-mono text-[9px] tracking-[0.22em] text-[#F0EDE6]/45"
                style={{ fontFamily: 'var(--font-mono), monospace' }}
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
            </li>
          ))}
        </ul>
      </div>

      {/* ── Scanning footer ticker ─────────────── */}
      <div
        className="relative overflow-hidden whitespace-nowrap mt-8 mb-16 py-4"
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

      <div className="max-w-[1280px] mx-auto px-5 md:px-8 pb-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-4">
        <p
          className="font-mono text-[10px] tracking-[0.28em] text-[#F0EDE6]/45 max-w-md"
          style={{ fontFamily: 'var(--font-mono), monospace' }}
        >
          {zh
            ? '// 想收到第一則上線的訊號？到 CONTACT 頁留下頻道。'
            : '// Want the first signal when it goes live? Leave your channel on CONTACT.'}
        </p>
        <a
          href={`/${locale}/contact`}
          className="back-link-lg inline-flex items-center"
          data-cursor="▸ TUNE IN"
          data-cursor-variant="link"
        >
          {zh ? '留下頻道 →' : 'Leave channel →'}
        </a>
      </div>
    </article>
  );
}

// ── Frequency dial — decorative tick marks ──
function FrequencyDial() {
  return (
    <div
      className="hidden md:flex flex-col items-end gap-1 font-mono text-[9px] tracking-[0.25em] text-[#F0EDE6]/45"
      style={{ fontFamily: 'var(--font-mono), monospace' }}
    >
      <div className="flex items-end gap-[2px] h-5" aria-hidden>
        {Array.from({ length: 36 }).map((_, i) => {
          const isMajor = i % 9 === 0;
          const isActive = i === 14 || i === 22; // faux-tuned markers
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
      <span className="text-[#F0EDE6]/55">88 — 108 MHz · FM</span>
    </div>
  );
}

// ── Signal bars ──
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
            background:
              i < strength ? 'rgba(93,211,227,0.85)' : 'rgba(93,211,227,0.18)',
          }}
        />
      ))}
    </span>
  );
}

// ── Status pill ──
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
