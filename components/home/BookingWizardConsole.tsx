'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';

/**
 * BookingWizardConsole — Section 08.
 *
 * Install-wizard style CTA (Image #31 reference). Left column: big
 * headline, 4-step checklist, primary action button. Right column:
 * mock terminal replaying a 4-step intake session. Visual only — the
 * button links to /contact, where the real intake happens.
 */

const STEPS = [
  { num: '01', title: 'Guided 4-step intake',             desc: 'Tell me what, when, how big, how soon.' },
  { num: '02', title: 'Reply within 2 working days',      desc: 'Via email or Line, whichever works.' },
  { num: '03', title: 'Free 30-minute strategy call',     desc: 'Go deep on the event shape and budget.' },
  { num: '04', title: 'NDA on request',                   desc: 'Signed before any brief is shared.' },
];

// Terminal lines the mock types out in sequence
const TERMINAL_LINES: { kind: 'cmd' | 'out' | 'blank'; text: string }[] = [
  { kind: 'cmd',   text: '$ book --start'                        },
  { kind: 'blank', text: ''                                       },
  { kind: 'out',   text: '> STEP 1 / EVENT TYPE'                  },
  { kind: 'out',   text: '  [x] BRAND'                            },
  { kind: 'out',   text: '  [ ] PRESS'                            },
  { kind: 'out',   text: '  [ ] POP-UP'                           },
  { kind: 'out',   text: '  [ ] LARGE-SCALE'                      },
  { kind: 'blank', text: ''                                       },
  { kind: 'out',   text: '> STEP 2 / DATE RANGE'                  },
  { kind: 'out',   text: '  2026 Q3'                              },
  { kind: 'blank', text: ''                                       },
  { kind: 'out',   text: '> STEP 3 / AUDIENCE'                    },
  { kind: 'out',   text: '  ~500 guests'                          },
  { kind: 'blank', text: ''                                       },
  { kind: 'out',   text: '> STEP 4 / NOTES'                       },
  { kind: 'out',   text: '  brand launch · cocktail + keynote'    },
  { kind: 'blank', text: ''                                       },
  { kind: 'cmd',   text: '$ submit → [ENTER]'                     },
];

export default function BookingWizardConsole() {
  const [cursorOn, setCursorOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setCursorOn((v) => !v), 540);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="console"
      className="relative min-h-[100dvh] flex flex-col justify-center py-24 md:py-28"
    >
      <div className="hud-grid">
        <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* LEFT — headline + steps + CTA */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="font-label text-[11px] text-[#5CE1FF]/80 mb-6 tracking-[0.28em]"
              style={{ textShadow: '0 0 12px rgba(92,225,255,0.5)' }}
            >
              {'// 08 // CONSOLE'}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-white leading-[0.98] text-[44px] md:text-[55px] lg:text-[77px] mb-8"
              style={{
                fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
                fontWeight:          500,
                letterSpacing:       '-0.02em',
                WebkitFontSmoothing: 'antialiased',
                textShadow:          '0 0 24px rgba(5,5,5,0.9)',
              }}
            >
              One brief,
              <br />
              one night,
              <br />
              remembered.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
              className="text-white/55 text-[14px] md:text-[15px] leading-[1.65] max-w-md mb-10"
              style={{
                fontFamily:          'var(--font-geist), "Chiron Hei HK WS", sans-serif',
                WebkitFontSmoothing: 'antialiased',
              }}
            >
              Fill in four fields and I&apos;ll reply within two working days
              with a first read of the event shape + what it costs to do well.
            </motion.p>

            {/* Steps */}
            <ul className="space-y-4 mb-12">
              {STEPS.map((s, i) => (
                <motion.li
                  key={s.num}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.6,
                    ease:     'easeOut',
                    delay:    0.25 + i * 0.08,
                  }}
                  className="flex items-start gap-4"
                >
                  <span
                    className="font-label text-[11px] text-[#5CE1FF] tabular-nums tracking-[0.22em] pt-0.5"
                    style={{ textShadow: '0 0 8px rgba(92,225,255,0.5)' }}
                  >
                    {s.num}
                  </span>
                  <div className="flex-1">
                    <p className="text-white text-[13px] md:text-[14px] leading-[1.4]">
                      {s.title}
                    </p>
                    <p className="text-white/45 text-[11px] md:text-[12px] leading-[1.5] mt-0.5">
                      {s.desc}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.55 }}
            >
              <Link
                href="/contact"
                className="group inline-flex items-center gap-4 px-7 py-4 border border-[#5CE1FF]/50 text-white hover:text-[#5CE1FF] hover:border-[#5CE1FF] transition-colors font-label text-[11px] tracking-[0.28em]"
                style={{ textShadow: '0 0 12px rgba(92,225,255,0.4)' }}
              >
                <span>START INTAKE</span>
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </motion.div>
          </div>

          {/* RIGHT — mock terminal */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            className="relative border border-white/[0.12] bg-[#070707]/85 shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
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
                book.terminal — intake
              </span>
              <span className="text-[10px] text-white/25 tracking-[0.14em]">
                ⌘⏎
              </span>
            </div>

            {/* Body */}
            <div className="p-5 md:p-6 text-[12px] md:text-[13px] leading-[1.9] min-h-[360px]">
              {TERMINAL_LINES.map((line, i) => {
                if (line.kind === 'blank') {
                  return <div key={i} className="h-2" />;
                }
                if (line.kind === 'cmd') {
                  return (
                    <div key={i} className="text-[#5CE1FF]/85">
                      {line.text}
                    </div>
                  );
                }
                // out
                const text = line.text;
                // Highlight [x] as cyan, [ ] as white/40
                const hasChecked = text.includes('[x]');
                const isHeading = text.startsWith('> STEP');
                return (
                  <div
                    key={i}
                    className={
                      isHeading
                        ? 'text-white/80'
                        : hasChecked
                          ? 'text-white/80'
                          : 'text-white/55'
                    }
                  >
                    {text.split(/(\[x\]|\[ \])/).map((part, pi) => {
                      if (part === '[x]')
                        return (
                          <span key={pi} className="text-[#5CE1FF]">
                            [x]
                          </span>
                        );
                      if (part === '[ ]')
                        return (
                          <span key={pi} className="text-white/25">
                            [ ]
                          </span>
                        );
                      return <span key={pi}>{part}</span>;
                    })}
                  </div>
                );
              })}
              <div className="text-white/50 mt-2">
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
            </div>

            {/* Status bar */}
            <div className="border-t border-white/[0.06] px-4 py-1.5 text-[9px] text-white/30 tracking-[0.16em] flex items-center justify-between">
              <span>
                SESSION:&nbsp;<span className="text-[#5CE1FF]/80">READY</span>
              </span>
              <span>bash · 4 FIELDS</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
