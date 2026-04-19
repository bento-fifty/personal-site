// components/home/LatestTransmission.tsx
// Latest Transmission teaser tile. Hard-coded placeholder signal until /blog
// (§ 03 · TRANSMISSION LOG) is reintroduced.

interface Props {
  locale: 'zh-TW' | 'en-US';
}

const SIGNAL = {
  ts: '2026.04.19 22:40',
  lineZh: 'Stage 1 dossier spine 已部署 — header / footer / chrome 統一',
  lineEn: 'Stage 1 dossier spine deployed — header / footer / chrome unified',
};

export default function LatestTransmission({ locale }: Props) {
  const zh = locale === 'zh-TW';
  return (
    <section
      aria-label="Latest transmission"
      className="px-5 md:px-8 py-16"
      style={{ background: 'transparent' }}
    >
      <div className="max-w-5xl mx-auto">
        <p
          className="mb-6 font-mono text-[10px] tracking-[0.3em] uppercase"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            color: 'rgba(250,250,248,0.45)',
          }}
        >
          § 03 · LATEST TRANSMISSION
        </p>
        <div
          className="flex flex-col md:flex-row md:items-baseline gap-3 md:gap-6 py-6 px-5 md:px-6"
          style={{
            border: '1px solid rgba(250,250,248,0.12)',
            background: 'rgba(11,16,38,0.35)',
          }}
        >
          <span
            className="text-[10px] tracking-[0.28em] uppercase whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              color: '#5DD3E3',
            }}
          >
            TX · {SIGNAL.ts}
          </span>
          <span
            className="flex-1 text-[14px] md:text-[16px]"
            style={{
              fontFamily: 'var(--font-noto-serif-tc), var(--font-fraunces), serif',
              color: 'rgba(250,250,248,0.85)',
              lineHeight: 1.6,
            }}
          >
            {zh ? SIGNAL.lineZh : SIGNAL.lineEn}
          </span>
          <span
            aria-disabled="true"
            title={zh ? '§ 03 TRANSMISSION LOG · 整備中' : '§ 03 TRANSMISSION LOG · Coming soon'}
            className="text-[9px] tracking-[0.3em] uppercase whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              color: 'rgba(250,250,248,0.35)',
              cursor: 'not-allowed',
            }}
          >
            ▸ OPEN LOG
          </span>
        </div>
      </div>
    </section>
  );
}
