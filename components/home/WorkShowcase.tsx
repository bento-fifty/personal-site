'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { CASES } from '@/lib/work-data';

const FEATURED = CASES.filter(c => c.featured);

export default function WorkShowcase() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Horizontal scroll driven by vertical scroll
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${(FEATURED.length - 1) * 100}%`]);

  return (
    <section ref={containerRef} className="relative" style={{ height: `${FEATURED.length * 100}vh`, background: 'transparent' }}>

      {/* Section label — fixed during scroll */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Header */}
        <div className="absolute top-8 left-8 md:left-16 z-20">
          <p
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '9px',
              letterSpacing: '0.3em',
              color: 'rgba(79,70,229,0.4)',
              textTransform: 'uppercase',
            }}
          >
            [ 01 ] Work
          </p>
        </div>

        {/* Counter */}
        <div className="absolute top-8 right-8 md:right-16 z-20">
          <p
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '9px',
              letterSpacing: '0.2em',
              color: 'rgba(20,20,19,0.2)',
            }}
          >
            {FEATURED.length} Projects
          </p>
        </div>

        {/* Horizontal scroll container */}
        <motion.div
          className="flex h-full"
          style={{ x, width: `${FEATURED.length * 100}%` }}
        >
          {FEATURED.map((work, i) => (
            <Link
              key={work.id}
              href={`/work/${work.slug}`}
              className="relative flex-shrink-0 h-full flex items-end group"
              style={{ width: `${100 / FEATURED.length}%` }}
            >
              {/* Background gradient placeholder (replace with actual images when available) */}
              <div
                className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                style={{
                  background: [
                    'linear-gradient(135deg, rgba(79,70,229,0.08) 0%, rgba(155,44,44,0.05) 100%)',
                    'linear-gradient(135deg, rgba(155,44,44,0.08) 0%, rgba(79,70,229,0.05) 100%)',
                    'linear-gradient(135deg, rgba(60,140,170,0.08) 0%, rgba(79,70,229,0.05) 100%)',
                  ][i % 3],
                }}
              />

              {/* Divider line */}
              {i > 0 && (
                <div className="absolute left-0 top-[10%] bottom-[10%] w-px" style={{ background: 'rgba(79,70,229,0.08)' }} />
              )}

              {/* Content overlay — bottom */}
              <div className="relative z-10 w-full p-8 md:p-16 pb-12 md:pb-20">
                {/* Index */}
                <p
                  className="mb-3"
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '10px',
                    letterSpacing: '0.2em',
                    color: 'rgba(79,70,229,0.35)',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </p>

                {/* Title — bilingual */}
                <h3
                  style={{
                    fontFamily: 'var(--font-heading), Georgia, serif',
                    fontSize: 'clamp(28px, 4vw, 56px)',
                    fontWeight: 600,
                    color: '#141413',
                    lineHeight: 1.15,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {work.titleEn}
                </h3>
                <p
                  className="mt-2"
                  style={{
                    fontFamily: 'var(--font-noto-serif-tc), serif',
                    fontSize: 'clamp(14px, 1.5vw, 20px)',
                    color: 'rgba(20,20,19,0.4)',
                  }}
                >
                  {work.title}
                </p>

                {/* Tags */}
                <div className="flex gap-3 mt-4">
                  <span
                    className="px-2 py-0.5 border rounded-sm"
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '8px',
                      letterSpacing: '0.15em',
                      color: 'rgba(79,70,229,0.5)',
                      borderColor: 'rgba(79,70,229,0.12)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {work.type}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '8px',
                      letterSpacing: '0.1em',
                      color: 'rgba(20,20,19,0.2)',
                    }}
                  >
                    {work.date}
                  </span>
                </div>

                {/* View arrow — appears on hover */}
                <div
                  className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2"
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '9px',
                    letterSpacing: '0.2em',
                    color: '#9B2C2C',
                    textTransform: 'uppercase',
                  }}
                >
                  View Project →
                </div>
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Scroll progress indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {FEATURED.map((_, i) => (
            <motion.div
              key={i}
              className="h-px rounded-full"
              style={{
                width: 40,
                background: 'rgba(79,70,229,0.15)',
              }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: '#4F46E5',
                  scaleX: useTransform(
                    scrollYProgress,
                    [i / FEATURED.length, (i + 1) / FEATURED.length],
                    [0, 1]
                  ),
                  transformOrigin: 'left',
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
