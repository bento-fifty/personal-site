'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * /about PROFILE_ page — v8 ichiki-style ID card.
 *
 * Layout:
 *   - PROFILE_ giant Fraunces title + blinking _ cursor
 *   - Barcode strip decoration (allowed only here, acts as ID card chrome)
 *   - Bio copy (locale-aware, no i18n dependency)
 *   - Meta inventory (freelance / Taipei / years / languages)
 *   - Floating "profile.NN.jpg" windows — ichiki reference
 *   - (LINKS) external section with Instagram / LinkedIn ↗
 */

interface Props {
  locale: 'zh-TW' | 'en-US';
}

const BIO = {
  'zh-TW': {
    role: '活動策劃 / 品牌體驗顧問',
    intro:
      'Evan Chang — 獨立活動策劃人，專注品牌沈浸體驗、大型活動製作與 KOL 合作。從概念、場地、動線、到現場統籌全包辦。合作預約透過下方 email，一般回覆時間 24 小時內。',
    based: 'TAIPEI · TAIWAN',
    languages: '中文 · ENGLISH',
    years: 'SINCE 2019',
    credit: 'FREELANCE / PRINCIPAL',
  },
  'en-US': {
    role: 'Event Planner / Brand Experience Consultant',
    intro:
      'Evan Chang — independent event planner focused on immersive brand experiences, large-scale productions, and KOL partnerships. Concept to floor plan to on-site management, all in-house. Inquiries via email below, typical reply within 24 hours.',
    based: 'TAIPEI · TAIWAN',
    languages: '中文 · ENGLISH',
    years: 'SINCE 2019',
    credit: 'FREELANCE / PRINCIPAL',
  },
};

const LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/', handle: '@evanchang' },
  { label: 'LinkedIn', href: 'https://linkedin.com/', handle: 'evan-chang' },
  { label: 'Email', href: 'mailto:evanchang818@gmail.com', handle: 'evanchang818@gmail.com' },
];

function Barcode() {
  // Simple SVG bars pattern — decorative
  const bars = [2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 2, 1, 4, 2, 1, 3, 2, 1, 2, 3, 1, 4, 1, 2, 3, 1, 2, 1];
  let x = 0;
  return (
    <svg
      width="100%"
      height="56"
      viewBox="0 0 300 56"
      preserveAspectRatio="none"
      aria-hidden
      style={{ display: 'block' }}
    >
      {bars.map((w, i) => {
        const rect = <rect key={i} x={x} y={8} width={w} height={40} fill="#FAFAF8" />;
        x += w + 1;
        return rect;
      })}
      <text
        x="0"
        y="56"
        fill="rgba(250,250,248,0.55)"
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 8,
          letterSpacing: '0.22em',
        }}
      >
        TLS · PRFL · 042
      </text>
    </svg>
  );
}

function ProfileWindow({
  index,
  style,
  hue,
}: {
  index: string;
  style: React.CSSProperties;
  hue: number;
}) {
  return (
    <div
      className="absolute hidden md:block"
      style={{
        ...style,
        border: '1px solid rgba(93,211,227,0.4)',
        background: '#0B1026',
      }}
    >
      <div
        className="flex items-center justify-between px-2 py-1"
        style={{
          borderBottom: '1px solid rgba(250,250,248,0.08)',
          background: 'rgba(93,211,227,0.06)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 8,
            letterSpacing: '0.22em',
            color: 'rgba(250,250,248,0.55)',
          }}
        >
          profile.{index}.jpg
        </span>
        <div className="flex gap-1">
          <span style={{ width: 5, height: 5, background: '#5DD3E3' }} />
          <span style={{ width: 5, height: 5, background: '#E63E1F' }} />
        </div>
      </div>
      <div
        style={{
          width: '100%',
          aspectRatio: '3/4',
          background: `linear-gradient(135deg, hsl(${hue},45%,22%) 0%, hsl(${hue + 15},35%,12%) 100%)`,
        }}
      />
    </div>
  );
}

export default function AboutPage({ locale }: Props) {
  const bio = BIO[locale];
  const [cursorBlink, setCursorBlink] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setCursorBlink((v) => !v), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <section
        className="relative overflow-hidden"
        style={{ minHeight: 'calc(100dvh - 44px - 80px)' }}
      >
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-14 md:pt-20 pb-24 relative">
          {/* Floating windows (desktop) */}
          <ProfileWindow
            index="01"
            hue={220}
            style={{ top: 80, right: '6%', width: 220, zIndex: 2, transform: 'rotate(-2deg)' }}
          />
          <ProfileWindow
            index="02"
            hue={15}
            style={{ top: 320, right: '2%', width: 180, zIndex: 3, transform: 'rotate(3deg)' }}
          />
          <ProfileWindow
            index="03"
            hue={180}
            style={{ top: 200, right: '22%', width: 160, zIndex: 1, transform: 'rotate(-4deg)' }}
          />

          {/* Top meta strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-12"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 10,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(250,250,248,0.45)',
            }}
          >
            <span>[ PROFILE · REF. TLS-PRFL-042 ]</span>
            <span style={{ color: '#5DD3E3' }}>●</span>
            <span>{bio.credit}</span>
          </motion.div>

          {/* PROFILE_ title with blinking cursor */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-baseline relative z-10"
            style={{
              fontFamily: 'var(--font-display), serif',
              fontVariationSettings: '"opsz" 144, "wght" 900',
              fontSize: 'clamp(72px, 14vw, 240px)',
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
                marginLeft: '0.1em',
                opacity: cursorBlink ? 1 : 0,
                transition: 'opacity 100ms',
              }}
            >
              _
            </span>
          </motion.h1>

          {/* Barcode */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 max-w-[320px] relative z-10"
          >
            <Barcode />
          </motion.div>

          {/* Bio block */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 max-w-2xl relative z-10"
          >
            <p
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 10,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#5DD3E3',
                marginBottom: 18,
              }}
            >
              {bio.role}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-display), serif',
                fontVariationSettings: '"opsz" 24, "wght" 400',
                fontStyle: 'italic',
                fontSize: 'clamp(18px, 1.6vw, 24px)',
                lineHeight: 1.55,
                color: 'rgba(250,250,248,0.85)',
              }}
            >
              {bio.intro}
            </p>
          </motion.div>

          {/* Meta inventory */}
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 max-w-xl relative z-10"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 10,
              letterSpacing: '0.22em',
              borderTop: '1px solid rgba(250,250,248,0.1)',
              borderBottom: '1px solid rgba(250,250,248,0.1)',
              padding: '18px 0',
            }}
          >
            {[
              ['BASED', bio.based],
              ['LANG.', bio.languages],
              ['SINCE', bio.years],
              ['TYPE', bio.credit.split(' / ')[0]],
            ].map(([k, v]) => (
              <div key={k}>
                <dt style={{ color: 'rgba(93,211,227,0.65)', marginBottom: 4 }}>{k}</dt>
                <dd style={{ color: 'rgba(250,250,248,0.85)' }}>{v}</dd>
              </div>
            ))}
          </motion.dl>

          {/* LINKS */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-20 relative z-10"
          >
            <p
              style={{
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 10,
                letterSpacing: '0.3em',
                color: 'rgba(250,250,248,0.45)',
                textTransform: 'uppercase',
                marginBottom: 20,
              }}
            >
              ( LINKS )
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {LINKS.map((l) => {
                const external = !l.href.startsWith('mailto');
                return (
                  <li
                    key={l.label}
                    style={{
                      borderTop: '1px solid rgba(250,250,248,0.08)',
                    }}
                  >
                    <a
                      href={l.href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noreferrer' : undefined}
                      data-cursor={external ? '↗ EXTERNAL' : '▸ EMAIL'}
                      data-cursor-variant="link"
                      className="flex items-center justify-between py-4"
                      style={{
                        textDecoration: 'none',
                        fontFamily: 'var(--font-mono), monospace',
                        fontSize: 11,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'rgba(250,250,248,0.85)',
                        transition: 'color 0ms',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#5DD3E3')}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = 'rgba(250,250,248,0.85)')
                      }
                    >
                      <span>{l.label}</span>
                      <span style={{ color: 'rgba(250,250,248,0.55)', textTransform: 'none', letterSpacing: '0.06em' }}>
                        {l.handle}
                      </span>
                      <span style={{ color: '#5DD3E3', fontSize: 13 }}>{external ? '↗' : '▸'}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.section>
        </div>
      </section>
    </>
  );
}
