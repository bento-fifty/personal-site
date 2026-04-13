'use client';

import { motion } from 'framer-motion';

/**
 * ActiveSystemsToolbelt — Section 02.
 *
 * 8 service-domain cards in a bento grid. Hover: translateY lift + red scan
 * line + shadow + border brightening. Color: #C23B22 accent throughout.
 */

interface System {
  code:  string;
  title: string;
  desc:  string;
  tag:   string;
}

const SYSTEMS: System[] = [
  { code: 'EVT-01', title: 'Event Planning',     desc: 'From brief to concept — theme, flow, visual system, budget book.',                tag: 'PLAN' },
  { code: 'PRS-02', title: 'Press Conference',    desc: 'Media-first show control, embargo handling, guest choreography.',                tag: 'PRESS' },
  { code: 'POP-03', title: 'Pop-Up Activation',   desc: 'Brand immersive environments built for shareability, not symmetry.',             tag: 'BRAND' },
  { code: 'LRG-04', title: 'Large-Scale',         desc: 'Outdoor events, stage, safety, crowd flow up to 3,500+ guests.',                tag: 'SCALE' },
  { code: 'BRD-05', title: 'Brand Retainer',      desc: 'Year-round strategy threading events, PR, and culture programs.',                tag: 'CORP' },
  { code: 'ART-06', title: 'Art Direction',        desc: 'Theme, visual system, identity — co-created with designers.',                    tag: 'CREATIVE' },
  { code: 'GST-07', title: 'Guest Experience',    desc: 'Invite, onboarding, wayfinding, memento, follow-up design.',                    tag: 'UX' },
  { code: 'KOL-08', title: 'KOL Activation',      desc: 'KOL briefing, on-site coordination, synced content capture.',                    tag: 'SOCIAL' },
];

export default function ActiveSystemsToolbelt() {
  return (
    <section
      id="toolbelt"
      className="relative min-h-[100dvh] flex flex-col justify-center py-24 md:py-28 px-6 md:px-12 lg:px-20"
    >
      {/* Section header */}
      <div className="mb-12 md:mb-16 max-w-[1200px] mx-auto w-full">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '9px',
            letterSpacing: '0.3em',
            color: 'rgba(194,59,34,0.5)',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          [ 01 ] Active Systems
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: 'var(--font-heading), Georgia, serif',
            fontSize: 'clamp(28px, 5vw, 55px)',
            fontWeight: 400,
            color: '#FAFAF8',
            lineHeight: 1.1,
            letterSpacing: '-0.015em',
            maxWidth: '600px',
          }}
        >
          What I can deploy.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '10px',
            letterSpacing: '0.2em',
            color: 'rgba(250,250,248,0.3)',
            marginTop: 16,
          }}
        >
          [ 8 SERVICE MODULES / ALL SYSTEMS NOMINAL ]
        </motion.p>
      </div>

      {/* Card grid */}
      <div className="max-w-[1200px] mx-auto w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {SYSTEMS.map((s, i) => (
          <motion.div
            key={s.code}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.1 + i * 0.06,
            }}
          >
            <div
              className="relative p-5 group overflow-hidden transition-all duration-[250ms] ease-out hover:-translate-y-2"
              style={{
                background: 'rgba(10,10,12,0.6)',
                backdropFilter: 'blur(2px)',
                borderRadius: '2px',
                border: '1px solid rgba(250,250,248,0.08)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.border = '2px solid #C23B22';
                el.style.padding = '19px';
                el.style.background = 'rgba(194,59,34,0.2)';
                el.style.boxShadow = '0 0 12px rgba(194,59,34,0.4), 0 0 30px rgba(194,59,34,0.2), 0 8px 24px rgba(0,0,0,0.3)';
                // Text → dark
                const title = el.querySelector('[data-title]') as HTMLElement;
                const desc = el.querySelector('[data-desc]') as HTMLElement;
                const tag = el.querySelector('[data-tag]') as HTMLElement;
                const status = el.querySelector('[data-status]') as HTMLElement;
                if (title) title.style.color = '#0A0A0C';
                if (desc) desc.style.color = 'rgba(10,10,12,0.6)';
                if (tag) tag.style.color = 'rgba(10,10,12,0.4)';
                if (status) status.style.color = '#0A0A0C';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.border = '1px solid rgba(250,250,248,0.08)';
                el.style.padding = '20px';
                el.style.background = 'rgba(10,10,12,0.6)';
                el.style.boxShadow = 'none';
                const title = el.querySelector('[data-title]') as HTMLElement;
                const desc = el.querySelector('[data-desc]') as HTMLElement;
                const tag = el.querySelector('[data-tag]') as HTMLElement;
                const status = el.querySelector('[data-status]') as HTMLElement;
                if (title) title.style.color = '#FAFAF8';
                if (desc) desc.style.color = 'rgba(250,250,248,0.45)';
                if (tag) tag.style.color = 'rgba(250,250,248,0.25)';
                if (status) status.style.color = 'rgba(194,59,34,0.4)';
              }}
            >
              {/* Top row — code (scales up on hover) + tag */}
              <div className="flex items-center justify-between mb-6">
                <span
                  className="transition-all duration-[250ms] group-hover:scale-[1.15] origin-left"
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '10px',
                    letterSpacing: '0.22em',
                    color: '#C23B22',
                  }}
                >
                  {s.code}
                </span>
                <span
                  data-tag
                  className="transition-colors duration-[250ms]"
                  style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '9px',
                  letterSpacing: '0.22em',
                  color: 'rgba(250,250,248,0.25)',
                }}>
                  [ {s.tag} ]
                </span>
              </div>

              {/* Title — white→dark on hover */}
              <h3
                data-title
                className="transition-all duration-[250ms]"
                style={{
                  fontFamily: 'var(--font-heading), Georgia, serif',
                  fontSize: 'clamp(16px, 1.5vw, 19px)',
                  fontWeight: 500,
                  color: '#FAFAF8',
                  lineHeight: 1.1,
                  letterSpacing: '-0.01em',
                  marginBottom: 10,
                }}
              >
                {s.title}
              </h3>

              {/* Desc */}
              <p
                data-desc
                className="transition-colors duration-[250ms]"
                style={{
                  fontFamily: 'var(--font-body), sans-serif',
                  fontSize: '12px',
                  lineHeight: 1.55,
                  color: 'rgba(250,250,248,0.45)',
                  marginBottom: 20,
                }}
              >
                {s.desc}
              </p>

              {/* Bottom status — dot becomes red bar on hover */}
              <div
                className="pt-4 flex items-center justify-between transition-all duration-[250ms] group-hover:border-[rgba(194,59,34,0.3)]"
                style={{ borderTop: '1px solid rgba(250,250,248,0.06)' }}
              >
                <span
                  data-status
                className="transition-colors duration-[250ms]"
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '9px',
                    letterSpacing: '0.22em',
                    color: 'rgba(194,59,34,0.4)',
                  }}
                >
                  [ ACTIVE ]
                </span>
                {/* Dot → bar on hover */}
                <span
                  aria-hidden
                  className="inline-block rounded-full transition-all duration-[250ms] group-hover:w-6 group-hover:h-[2px] group-hover:rounded-none"
                  style={{
                    width: '6px',
                    height: '6px',
                    background: 'rgba(194,59,34,0.5)',
                    boxShadow: '0 0 6px rgba(194,59,34,0.3)',
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
