'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ResumeQRWindow from './ResumeQRWindow';
import FitCheckWindow from './FitCheckWindow';
import TaipeiLiveWindow from './TaipeiLiveWindow';

/**
 * /about PROFILE_ — Ichiki-style ID page with draggable interactive widgets.
 *
 * Left: PROFILE_ Fraunces monogram + bio + meta inventory + external links.
 * Right: 3 interactive draggable windows (resume QR, fit-check calculator,
 * live Taipei time). Desktop only; mobile stacks the widgets below meta.
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
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/evan-chang', handle: 'evan-chang' },
  { label: 'Email', href: 'mailto:evanchang818@gmail.com', handle: 'evanchang818@gmail.com' },
];

export default function AboutPage({ locale }: Props) {
  const bio = BIO[locale];
  const [cursorBlink, setCursorBlink] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setCursorBlink((v) => !v), 500);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: 'calc(100dvh - 44px - 80px)' }}
    >
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-14 md:pt-20 pb-24 relative">
        {/* Desktop: floating draggable widgets in right-side workspace */}
        <div
          aria-hidden={false}
          className="hidden md:block absolute"
          style={{ top: 100, right: 24, width: 480, height: 600, zIndex: 5 }}
        >
          <ResumeQRWindow initialX={200} initialY={0} rotate={-2} />
          <FitCheckWindow initialX={0} initialY={220} rotate={1.5} />
          <TaipeiLiveWindow initialX={220} initialY={320} rotate={-1} />
        </div>

        {/* Top meta strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-12 relative z-10"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 10,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(250,250,248,0.45)',
          }}
        >
          <span>[ PROFILE · TLS-PRFL-042 ]</span>
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

        {/* Bio block */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 max-w-xl relative z-10"
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
              fontSize: 'clamp(17px, 1.4vw, 22px)',
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
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 max-w-xl relative z-10"
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
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16 max-w-xl relative z-10"
        >
          <p
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 10,
              letterSpacing: '0.3em',
              color: 'rgba(250,250,248,0.45)',
              textTransform: 'uppercase',
              marginBottom: 16,
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
                  style={{ borderTop: '1px solid rgba(250,250,248,0.08)' }}
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
                      color: 'rgba(250,250,248,0.85)',
                      transition: 'color 0ms',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#5DD3E3')}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = 'rgba(250,250,248,0.85)')
                    }
                  >
                    <span>{l.label}</span>
                    <span
                      style={{
                        color: 'rgba(250,250,248,0.55)',
                        textTransform: 'none',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {l.handle}
                    </span>
                    <span style={{ color: '#5DD3E3', fontSize: 13 }}>{external ? '↗' : '▸'}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </motion.section>

        {/* Mobile: stacked widgets below links */}
        <div className="md:hidden mt-16 relative space-y-4" style={{ minHeight: 400 }}>
          <ResumeQRWindow initialX={16} initialY={0} />
          <FitCheckWindow initialX={16} initialY={260} />
          <TaipeiLiveWindow initialX={16} initialY={600} />
        </div>
      </div>
    </section>
  );
}
