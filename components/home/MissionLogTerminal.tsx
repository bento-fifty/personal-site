'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { CASES } from '@/lib/work-data';

/**
 * MissionLogTerminal — Section 03.
 *
 * Full terminal-emulator UI: title bar with traffic lights, tab row,
 * file-tree sidebar, monospace output viewport, status bar. Displays the
 * 3 featured cases as tactical briefs — `$ cat` style readouts with
 * syntax-coloured prompt / heading / value lines. Tab click or keyboard
 * `1/2/3` switches case.
 *
 * Reference: SynaBun `.nos-term-*` emulator UI + Image #29 terminal log
 * card. Reframed as event-director mission briefing console.
 */

const FEATURED = CASES.slice(0, 3);

export default function MissionLogTerminal() {
  const [active, setActive] = useState(0);
  const c = FEATURED[active];

  // Blinking cursor for the bottom prompt line
  const [cursorOn, setCursorOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setCursorOn((v) => !v), 540);
    return () => clearInterval(id);
  }, []);

  // Keyboard 1/2/3 + ArrowLeft/Right
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === '1') setActive(0);
      else if (e.key === '2') setActive(1);
      else if (e.key === '3') setActive(2);
      else if (e.key === 'ArrowRight') setActive((i) => (i + 1) % FEATURED.length);
      else if (e.key === 'ArrowLeft')
        setActive((i) => (i - 1 + FEATURED.length) % FEATURED.length);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const fileBase = (i: number) => {
    const c = FEATURED[i];
    return `${c.id}_${c.slug.replace(/-/g, '_')}`;
  };

  return (
    <section
      id="mission-log"
      className="relative min-h-[100dvh] flex flex-col justify-center py-20 md:py-24"
    >
      <div className="hud-grid">
        {/* Section header */}
        <div className="col-span-12 mb-8">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="font-label text-[11px] text-[#5CE1FF]/80 mb-5 tracking-[0.28em]"
            style={{ textShadow: '0 0 12px rgba(92,225,255,0.5)' }}
          >
            {'// 03 // MISSION LOG'}
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
            Tactical briefings, archived.
          </motion.h2>
        </div>

        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="col-span-12 relative border border-white/[0.12] bg-[#070707]/85 shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
          style={{
            backdropFilter: 'blur(6px)',
            fontFamily:     'var(--font-mono), ui-monospace, monospace',
          }}
        >
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="block w-2.5 h-2.5 rounded-full bg-[#ff4f5a]/70" />
              <span className="block w-2.5 h-2.5 rounded-full bg-[#ffbf33]/70" />
              <span className="block w-2.5 h-2.5 rounded-full bg-[#3cd66d]/70" />
            </div>
            <span className="text-[10px] text-white/45 tracking-[0.14em]">
              mission_log.term — case_files
            </span>
            <span className="text-[10px] text-white/25 tracking-[0.14em]">
              ⌘K
            </span>
          </div>

          {/* Tab bar */}
          <div className="flex items-stretch border-b border-white/[0.06] overflow-x-auto">
            {FEATURED.map((f, i) => {
              const isActive = i === active;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={
                    'group relative flex items-center gap-3 px-4 py-2 text-[10px] tracking-[0.14em] whitespace-nowrap transition-colors ' +
                    (isActive
                      ? 'text-[#5CE1FF] bg-[#0a0a0a]/80'
                      : 'text-white/35 hover:text-white/65')
                  }
                  style={isActive ? { textShadow: '0 0 8px rgba(92,225,255,0.5)' } : undefined}
                >
                  <span className="font-label">{fileBase(i)}.md</span>
                  <span className="text-white/30 group-hover:text-white/60">
                    ×
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="mission-log-tab-active"
                      aria-hidden
                      className="absolute left-0 right-0 bottom-0 h-[1.5px] bg-[#5CE1FF]"
                      style={{
                        boxShadow:
                          '0 0 8px rgba(92,225,255,0.9), 0 0 2px rgba(92,225,255,1)',
                      }}
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                </button>
              );
            })}
            <div className="flex-1 border-l border-white/[0.05]" />
          </div>

          {/* Body: sidebar + viewport */}
          <div className="grid grid-cols-[180px_1fr] md:grid-cols-[220px_1fr] min-h-[420px]">
            {/* Sidebar — file tree */}
            <aside className="border-r border-white/[0.06] p-4 text-[10px] text-white/45 leading-[1.9]">
              <div className="mb-3 text-white/25 tracking-[0.2em]">
                [ CASE_FILES ]
              </div>
              <div className="text-white/55 mb-2">▾ /archive</div>
              {FEATURED.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className="block w-full text-left pl-3 hover:text-white/80 transition-colors"
                  style={{
                    color: i === active ? '#5CE1FF' : 'rgba(255,255,255,0.45)',
                    textShadow:
                      i === active ? '0 0 6px rgba(92,225,255,0.5)' : 'none',
                  }}
                >
                  {i === active ? '▸ ' : '· '}
                  {fileBase(i).slice(0, 15)}..
                </button>
              ))}
              <div className="text-white/25 mt-3">▸ /draft</div>
              <div className="text-white/25">▸ /pending</div>

              <div className="mt-6 pt-3 border-t border-white/[0.05] text-white/25">
                [ FILTER ]
              </div>
              <div className="text-white/35 mt-1">tag: active</div>
              <div className="text-white/35">year: 2024</div>
            </aside>

            {/* Viewport — monospace output */}
            <div className="relative p-5 md:p-7 text-[12px] md:text-[13px] leading-[1.85] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="text-[#5CE1FF]/85">
                    $ cat archive/{fileBase(active)}/brief.md
                  </div>
                  <div className="h-2" />
                  <MetaLine k="TITLE"  v={c.titleEn} />
                  <MetaLine k="CLIENT" v={c.client} />
                  <MetaLine k="DATE"   v={c.date} />
                  <MetaLine k="TYPE"   v={`[ ${c.type} ]`} />
                  <div className="h-3" />
                  <div className="text-white/80"># OBJECTIVE</div>
                  <div className="text-white/60 max-w-xl">
                    &gt; {c.objective?.en ?? 'Case brief on file — contact for declassified copy.'}
                  </div>
                  <div className="h-3" />
                  <div className="text-white/80"># STATS</div>
                  {c.stats.map((s) => (
                    <div key={s.labelEn} className="text-white/60">
                      &gt;{' '}
                      <span className="text-[#5CE1FF]/90 tabular-nums">
                        [{s.value}]
                      </span>{' '}
                      {s.labelEn.toLowerCase()}
                    </div>
                  ))}
                  <div className="h-4" />
                  <Link
                    href={`/work/${c.slug}`}
                    className="inline-block text-[#5CE1FF]/85 hover:text-[#5CE1FF] transition-colors"
                  >
                    $ open archive/{fileBase(active)}/full-case → [ENTER]
                  </Link>
                  <div className="h-1" />
                  <div className="text-white/50">
                    <span>_</span>
                    <span
                      style={{
                        opacity: cursorOn ? 1 : 0,
                        color:   '#5CE1FF',
                      }}
                    >
                      █
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-1.5 text-[9px] text-white/30 tracking-[0.16em]">
            <div className="flex items-center gap-3">
              <span>
                STATUS:&nbsp;
                <span className="text-[#5CE1FF]/80">READY</span>
              </span>
              <span className="text-white/15">|</span>
              <span>LINE 42</span>
              <span className="text-white/15">|</span>
              <span>UTF-8</span>
              <span className="text-white/15">|</span>
              <span>TPE</span>
            </div>
            <div className="hidden md:block">
              [ 1/2/3 · ← → · TAB TO SWITCH CASE ]
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MetaLine({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-white/80 w-[4.5rem] shrink-0">&gt; {k}:</span>
      <span className="text-white/65">{v}</span>
    </div>
  );
}
