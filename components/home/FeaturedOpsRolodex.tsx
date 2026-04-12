'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { CASES } from '@/lib/work-data';
import HudCorners from '@/components/shared/HudCorners';

/**
 * FeaturedOpsRolodex — Section 04.
 *
 * True absolute stack rolodex (SynaBun .fc-stack-0/1/2 pattern).
 * 3 case cards all live in the same DOM slot; transform/opacity decide
 * which is "on top". Left index rail clicks set active. Spring
 * transitions feel like shuffling physical case files.
 *
 * Keyboard: ArrowDown/Up + j/k.
 */

const FEATURED = CASES.slice(0, 3);

export default function FeaturedOpsRolodex() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        setActive((i) => (i + 1) % FEATURED.length);
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        setActive((i) => (i - 1 + FEATURED.length) % FEATURED.length);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Stack depth: 0 = top active, 1 = first back, 2 = second back
  const stackIdx = (i: number) => (i - active + FEATURED.length) % FEATURED.length;

  return (
    <section
      id="featured-ops"
      className="relative min-h-[100dvh] flex flex-col justify-center py-24 md:py-28"
    >
      <div className="hud-grid">
        <div className="col-span-12 mb-12 md:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="font-label text-[11px] text-[#5CE1FF]/80 mb-5 tracking-[0.28em]"
            style={{ textShadow: '0 0 12px rgba(92,225,255,0.5)' }}
          >
            {'// 04 // FEATURED OPS'}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-white text-[33px] md:text-[44px] lg:text-[55px] leading-[1.05] max-w-3xl"
            style={{
              fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
              fontWeight:          500,
              letterSpacing:       '-0.015em',
              WebkitFontSmoothing: 'antialiased',
              textShadow:          '0 0 22px rgba(5,5,5,0.9)',
            }}
          >
            Case files on rotation.
          </motion.h2>
        </div>

        {/* Grid: left rail | stack */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[260px_1fr] gap-10 lg:gap-16">
          {/* Index rail */}
          <nav aria-label="Case rotation" className="flex md:flex-col gap-2">
            <p className="hidden md:block font-label text-[10px] text-white/25 tracking-[0.22em] mb-4 pl-5">
              [ ROTATION ]
            </p>
            {FEATURED.map((c, i) => {
              const isActive = i === active;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className="group relative text-left pl-5 pr-3 py-3 md:py-4 flex-shrink-0"
                >
                  {isActive && (
                    <motion.span
                      layoutId="featured-ops-active"
                      aria-hidden
                      className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#5CE1FF]"
                      style={{
                        boxShadow:
                          '0 0 10px rgba(92,225,255,0.9), 0 0 2px rgba(92,225,255,1)',
                      }}
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <div className="flex items-baseline gap-3">
                    <span
                      className="font-label text-[11px] tabular-nums"
                      style={{
                        color: isActive ? '#5CE1FF' : 'rgba(255,255,255,0.3)',
                        textShadow: isActive
                          ? '0 0 10px rgba(92,225,255,0.55)'
                          : 'none',
                      }}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className="text-[13px] md:text-[14px] leading-tight"
                      style={{
                        fontFamily:
                          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
                        fontWeight:          500,
                        color:               isActive
                          ? '#ffffff'
                          : 'rgba(255,255,255,0.38)',
                        WebkitFontSmoothing: 'antialiased',
                      }}
                    >
                      {c.titleEn}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Stack — 3 cards absolute-layered */}
          <div className="relative min-h-[520px]" style={{ perspective: '1200px' }}>
            {FEATURED.map((c, i) => {
              const depth = stackIdx(i);
              const stackStyle: { opacity: number; scale: number; y: number; filter: string; zIndex: number } =
                depth === 0
                  ? { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', zIndex: 30 }
                  : depth === 1
                    ? { opacity: 0.4, scale: 0.97, y: 18, filter: 'blur(3px)', zIndex: 20 }
                    : { opacity: 0.18, scale: 0.94, y: 36, filter: 'blur(5px)', zIndex: 10 };
              return (
                <motion.div
                  key={c.id}
                  animate={stackStyle}
                  transition={{ type: 'spring', stiffness: 220, damping: 28 }}
                  className="absolute inset-0"
                  style={{ zIndex: stackStyle.zIndex }}
                >
                  <div
                    className="relative h-full border border-white/[0.1] bg-[#050505]/70 p-7 md:p-10"
                    style={{ backdropFilter: 'blur(6px)' }}
                  >
                    <HudCorners />

                    {/* Meta */}
                    <div className="flex items-center gap-4 mb-6">
                      <span
                        className="font-label text-[11px] text-[#5CE1FF] tracking-[0.22em]"
                        style={{ textShadow: '0 0 10px rgba(92,225,255,0.5)' }}
                      >
                        {c.id}&nbsp;/&nbsp;[ {c.type} ]
                      </span>
                      <span className="font-label text-[10px] text-white/40 tracking-[0.22em]">
                        ·&nbsp;&nbsp;{c.date.slice(0, 4)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-white leading-[0.98] text-[33px] md:text-[55px] lg:text-[77px] mb-4 max-w-[14ch]"
                      style={{
                        fontFamily:
                          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
                        fontWeight:          500,
                        letterSpacing:       '-0.018em',
                        WebkitFontSmoothing: 'antialiased',
                        textShadow:          '0 0 24px rgba(5,5,5,0.85)',
                      }}
                    >
                      {c.title}
                    </h3>
                    <p className="font-label text-white/45 text-[11px] tracking-[0.22em] uppercase mb-8">
                      {c.titleEn}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 md:gap-8 mb-10 max-w-xl">
                      {c.stats.map((s, si) => (
                        <div key={si} className="flex flex-col">
                          <span className="font-label text-[9px] text-white/25 mb-2 tracking-[0.22em]">
                            [ 0{si + 1} ]
                          </span>
                          <p
                            className="text-[#5CE1FF] text-[26px] md:text-[38px] leading-none mb-2 tabular-nums"
                            style={{
                              fontFamily:
                                'var(--font-geist), "Chiron Sung HK WS", sans-serif',
                              fontWeight:          500,
                              letterSpacing:       '-0.02em',
                              WebkitFontSmoothing: 'antialiased',
                              textShadow:          '0 0 16px rgba(92,225,255,0.35)',
                            }}
                          >
                            {s.value}
                          </p>
                          <p className="font-label text-[10px] text-white/45 tracking-[0.15em]">
                            {s.labelEn}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Desc + CTA */}
                    <p
                      className="text-white/60 text-[13px] leading-[1.7] max-w-lg mb-6"
                      style={{
                        fontFamily:
                          'var(--font-geist), "Chiron Hei HK WS", sans-serif',
                        WebkitFontSmoothing: 'antialiased',
                      }}
                    >
                      {c.descEn}
                    </p>
                    <Link
                      href={`/work/${c.slug}`}
                      className="group inline-flex items-center gap-3 font-label text-[11px] text-white hover:text-[#5CE1FF] border-b border-white/25 hover:border-[#5CE1FF]/70 pb-2 tracking-[0.22em] transition-colors"
                    >
                      <span>READ CASE</span>
                      <span className="inline-block transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
