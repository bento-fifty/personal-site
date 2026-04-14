'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { CASES } from '@/lib/work-data';

/**
 * CaseShowcase3D — Section 05.
 *
 * 3D carousel. Center card anchors to the viewport midpoint (not offset
 * margin math — that's what made v1 lean left). Left/right side cards
 * rotateY ±38°, translated back in z-space. Clicking a side card cycles
 * it to center; clicking the center card opens a focused detail modal
 * that overlays the whole section.
 *
 * Layout anchor: `left-1/2 top-1/2 -translate-1/2` on each card wrapper
 * so the card's own centre always lines up with the stage centre, then
 * framer-motion `animate` controls the outward transform delta.
 */

const FEATURED = CASES.slice(0, 3);

export default function CaseShowcase3D() {
  const [active, setActive] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // Close modal on escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setModalOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const getPosition = (i: number): 'center' | 'left' | 'right' => {
    const diff = (i - active + FEATURED.length) % FEATURED.length;
    if (diff === 0) return 'center';
    if (diff === 1) return 'right';
    return 'left';
  };

  const go = (dir: -1 | 1) =>
    setActive((i) => (i + dir + FEATURED.length) % FEATURED.length);

  const openModal = () => setModalOpen(true);

  const activeCase = FEATURED[active];

  return (
    <section
      id="showcase"
      className="relative min-h-[100dvh] flex flex-col py-14 md:py-16"
      style={{ background: '#FAFAF8' }}
    >
      <div className="hud-grid shrink-0">
        <div className="col-span-12 text-center pt-2">
          <p className="font-label text-[10px] tracking-[0.22em]" style={{ color: 'rgba(10,10,12,0.4)' }}>
            [ CLICK CENTER CARD TO OPEN DETAIL ]
          </p>
        </div>
      </div>

      {/* 3D Stage — grows to fill remaining space between header and nav */}
      <div
        className="relative flex-1 flex items-center justify-center min-h-0"
        style={{ perspective: '1400px', perspectiveOrigin: '50% 45%' }}
      >
        <div
          className="relative w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {FEATURED.map((c, i) => {
              const pos = getPosition(i);
              const anim =
                pos === 'center'
                  ? { x: 0,    rotateY: 0,    z: 0,    scale: 1,    opacity: 1    }
                  : pos === 'left'
                    ? { x: -440, rotateY: 40,  z: -240, scale: 0.78, opacity: 0.42 }
                    : { x: 440,  rotateY: -40, z: -240, scale: 0.78, opacity: 0.42 };
              const isCenter = pos === 'center';

              return (
                <motion.button
                  key={c.id}
                  type="button"
                  onClick={() => (isCenter ? openModal() : setActive(i))}
                  aria-label={isCenter ? `Open ${c.titleEn}` : `Show ${c.titleEn}`}
                  className="absolute left-1/2 top-1/2 text-left group"
                  initial={false}
                  animate={{
                    x:          anim.x,
                    rotateY:    anim.rotateY,
                    translateZ: anim.z,
                    scale:      anim.scale,
                    opacity:    anim.opacity,
                  }}
                  whileHover={!isCenter ? {
                    x: pos === 'left' ? anim.x + 40 : anim.x - 40,
                    opacity: 0.75,
                    scale: 0.84,
                    rotateY: pos === 'left' ? 28 : -28,
                  } : undefined}
                  transition={{ type: 'spring', stiffness: 180, damping: 26 }}
                  style={{
                    width:          '480px',
                    height:         '340px',
                    marginLeft:     '-240px',
                    marginTop:      '-170px',
                    transformStyle: 'preserve-3d',
                    zIndex:         isCenter ? 30 : 15,
                    cursor:         'pointer',
                    pointerEvents:  'auto',
                  }}
                >
                  <CaseCard c={c} isCenter={isCenter} position={pos} />
                </motion.button>
              );
            })}
        </div>
      </div>

      {/* Nav — outside flex-1 stage so it's always pinned in viewport */}
      <div className="hud-grid shrink-0 mt-4">
        <div className="col-span-12 flex items-center justify-center gap-8">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous case"
            className="font-label text-[11px] tracking-[0.22em] transition-colors flex items-center gap-2 hover:text-[#E63E1F]"
            style={{ color: 'rgba(10,10,12,0.5)' }}
          >
            <span>◁</span>
            <span>PREV</span>
          </button>
          <div className="flex items-center gap-3">
            {FEATURED.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Go to ${c.titleEn}`}
                className="group inline-flex items-center justify-center w-4 h-4"
              >
                <span
                  className="inline-block rounded-full transition-all"
                  style={{
                    width:      i === active ? '10px' : '5px',
                    height:     i === active ? '10px' : '5px',
                    background: i === active ? '#E63E1F' : 'rgba(10,10,12,0.3)',
                    boxShadow:
                      i === active
                        ? '0 0 10px rgba(230,62,31,0.9), 0 0 2px rgba(230,62,31,1)'
                        : 'none',
                  }}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next case"
            className="font-label text-[11px] tracking-[0.22em] transition-colors flex items-center gap-2 hover:text-[#E63E1F]"
            style={{ color: 'rgba(10,10,12,0.5)' }}
          >
            <span>NEXT</span>
            <span>▷</span>
          </button>
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-6 md:p-10"
            style={{ backdropFilter: 'blur(12px)' }}
            onClick={() => setModalOpen(false)}
          >
            <div
              aria-hidden
              className="absolute inset-0 bg-[#050505]/85"
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{    opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl border border-[#E63E1F]/30 bg-[#050505]/95 p-7 md:p-10 max-h-[85vh] overflow-y-auto"
              data-allow-scroll="true"
              style={{
                boxShadow: '0 40px 120px rgba(0,0,0,0.7), 0 0 60px rgba(230,62,31,0.08)',
              }}
            >
              {/* Close */}
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close detail"
                className="absolute top-4 right-4 font-label text-[11px] text-white/40 hover:text-[#E63E1F] tracking-[0.22em] transition-colors"
              >
                [ ESC · CLOSE ]
              </button>

              <p
                className="font-label text-[11px] text-[#E63E1F] tracking-[0.22em] mb-6"
                style={{ textShadow: '0 0 10px rgba(230,62,31,0.55)' }}
              >
                [ CASE FILE // {activeCase.id} / {activeCase.type} ]
              </p>
              <h3
                className="text-white leading-[1.02] text-[33px] md:text-[55px] mb-3"
                style={{
                  fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
                  fontWeight:          500,
                  letterSpacing:       '-0.018em',
                  WebkitFontSmoothing: 'antialiased',
                }}
              >
                {activeCase.title}
              </h3>
              <p className="font-label text-white/45 text-[11px] tracking-[0.22em] uppercase mb-8">
                {activeCase.titleEn}
              </p>

              {/* Meta grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                <Meta k="CLIENT" v={activeCase.client} />
                <Meta k="DATE"   v={activeCase.date} />
                <Meta k="TYPE"   v={activeCase.type} />
                <Meta k="STATUS" v="DELIVERED" />
              </div>

              <div className="h-px bg-white/[0.1] mb-8" />

              {/* Stats */}
              <div className="grid grid-cols-3 gap-5 md:gap-8 mb-10">
                {activeCase.stats.map((s, i) => (
                  <div key={i}>
                    <p className="font-label text-[9px] text-white/25 mb-2 tracking-[0.22em]">
                      [ 0{i + 1} ]
                    </p>
                    <p
                      className="text-[#E63E1F] text-[26px] md:text-[36px] leading-none mb-2 tabular-nums"
                      style={{
                        fontFamily:
                          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
                        fontWeight:          500,
                        letterSpacing:       '-0.02em',
                        WebkitFontSmoothing: 'antialiased',
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

              {/* Desc */}
              <p
                className="text-white/65 text-[13px] md:text-[14px] leading-[1.7] mb-8"
                style={{
                  fontFamily:          'var(--font-geist), "Chiron Hei HK WS", sans-serif',
                  WebkitFontSmoothing: 'antialiased',
                }}
              >
                {activeCase.descEn}
              </p>

              {/* CTA */}
              <Link
                href={`/work/${activeCase.slug}`}
                className="group inline-flex items-center gap-4 px-6 py-3 border border-[#E63E1F]/50 text-white hover:text-[#E63E1F] hover:border-[#E63E1F] transition-colors font-label text-[11px] tracking-[0.28em]"
                style={{ textShadow: '0 0 12px rgba(230,62,31,0.4)' }}
              >
                <span>OPEN FULL CASE FILE</span>
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function CaseCard({
  c,
  isCenter,
  position,
}: {
  c:        (typeof CASES)[number];
  isCenter: boolean;
  position: 'center' | 'left' | 'right';
}) {
  return (
    <div
      className={
        'relative w-full h-full overflow-hidden transition-all duration-300 ' +
        (isCenter
          ? 'border border-white/[0.12] bg-[#050505]/85'
          : 'border border-white/[0.06] bg-[#050505]/70 hover:border-[rgba(230,62,31,0.3)]')
      }
      style={{
        backdropFilter: 'blur(4px)',
        boxShadow: isCenter
          ? '0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(230,62,31,0.07)'
          : '0 15px 40px rgba(0,0,0,0.5)',
      }}
    >
      {/* Direction arrow — only on side cards, visible on hover */}
      {!isCenter && (
        <div
          className="absolute top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0"
          style={{
            ...(position === 'left' ? { right: '12px', transform: 'translateY(-50%) translateX(8px)' } : { left: '12px', transform: 'translateY(-50%) translateX(-8px)' }),
            fontFamily: 'var(--font-departure-mono), monospace',
            fontSize: '16px',
            color: '#E63E1F',
            textShadow: '0 0 12px rgba(230,62,31,0.6)',
          }}
        >
          {position === 'left' ? '→' : '←'}
        </div>
      )}
      {/* Cover mock — top 55% */}
      <div
        className="absolute top-0 left-0 right-0 h-[55%] overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, rgba(230,62,31,0.05) 0%, rgba(5,5,5,0.92) 70%), #0a0a0a',
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'linear-gradient(rgba(230,62,31,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(230,62,31,0.15) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="font-label text-[8px] text-white/20 tracking-[0.28em] mb-1">
              [ COVER ]
            </div>
            <div
              className="text-[#E63E1F]/55 text-[42px] md:text-[66px] leading-none tabular-nums"
              style={{
                fontFamily:
                  'var(--font-geist), "Chiron Sung HK WS", sans-serif',
                fontWeight:          500,
                WebkitFontSmoothing: 'antialiased',
                textShadow:          '0 0 24px rgba(230,62,31,0.3)',
              }}
            >
              {c.id}
            </div>
          </div>
        </div>
        {(['tl', 'tr', 'bl', 'br'] as const).map((cr) => {
          const style: React.CSSProperties = {
            position: 'absolute',
            width:    '12px',
            height:   '12px',
          };
          if (cr.includes('t')) {
            style.top = '10px';
            style.borderTop = '1px solid rgba(230,62,31,0.5)';
          } else {
            style.bottom = '10px';
            style.borderBottom = '1px solid rgba(230,62,31,0.5)';
          }
          if (cr.includes('l')) {
            style.left = '10px';
            style.borderLeft = '1px solid rgba(230,62,31,0.5)';
          } else {
            style.right = '10px';
            style.borderRight = '1px solid rgba(230,62,31,0.5)';
          }
          return <span key={cr} aria-hidden style={style} />;
        })}
      </div>

      {/* Text zone — bottom 45% */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%] p-5 md:p-6 flex flex-col justify-between border-t border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span
              className="font-label text-[10px] text-[#E63E1F] tracking-[0.22em]"
              style={{ textShadow: '0 0 8px rgba(230,62,31,0.5)' }}
            >
              [ {c.type} ]
            </span>
            <span className="font-label text-[9px] text-white/35 tracking-[0.22em]">
              {c.date}
            </span>
          </div>
          <h3
            className="text-white text-[20px] md:text-[26px] leading-[1.15] mb-1"
            style={{
              fontFamily:
                'var(--font-geist), "Chiron Sung HK WS", sans-serif',
              fontWeight:          500,
              letterSpacing:       '-0.015em',
              WebkitFontSmoothing: 'antialiased',
            }}
          >
            {c.titleEn}
          </h3>
          <p className="font-label text-[10px] text-white/35 tracking-[0.18em] uppercase">
            {c.title}
          </p>
        </div>
        {isCenter && (
          <span className="self-start inline-flex items-center gap-2 font-label text-[10px] text-[#E63E1F]/80 tracking-[0.22em]">
            <span>[ CLICK TO OPEN ]</span>
          </span>
        )}
      </div>
    </div>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="font-label text-[9px] text-white/25 mb-1 tracking-[0.22em]">
        [ {k} ]
      </p>
      <p className="font-label text-[11px] text-white/70 tracking-[0.14em]">
        {v}
      </p>
    </div>
  );
}
