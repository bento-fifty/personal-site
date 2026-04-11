'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Right-side fixed navigator. Shows the page structure as a vertical
 * column of dots, one per major section. The active section is highlighted
 * and its label is always visible; hovering any dot reveals its label.
 * Clicking a dot smoothly scrolls to the target section.
 *
 * Also doubles as a scroll progress indicator — the vertical line
 * connecting the dots fills from top to bottom as the page scrolls.
 */

const SECTIONS = [
  { id: 'hero',      label: 'INTRO',         num: '01' },
  { id: 'featured',  label: 'SELECTED WORK', num: '02' },
  { id: 'footprint', label: 'FOOTPRINT',     num: '03' },
  { id: 'contact',   label: 'CONTACT',       num: '04' },
] as const;

export default function SectionNavigator() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping:   30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the viewport center that's intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold:  [0, 0.25, 0.5, 0.75, 1],
      },
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-10 pointer-events-auto"
    >
      {/* Vertical progress track connecting the dots */}
      <div
        aria-hidden
        className="absolute right-[7px] top-3 bottom-3 w-px bg-white/[0.08]"
      />
      <motion.div
        aria-hidden
        className="absolute right-[7px] top-3 w-px bg-[#5CE1FF] origin-top"
        style={{
          scaleY:    smooth,
          height:    'calc(100% - 24px)',
          boxShadow:
            '0 0 10px rgba(92,225,255,0.85), 0 0 2px rgba(92,225,255,1)',
        }}
      />

      {SECTIONS.map(({ id, label, num }) => {
        const isActive = activeId === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => handleClick(id)}
            aria-label={`Jump to ${label}`}
            aria-current={isActive ? 'true' : undefined}
            className="group relative flex items-center justify-end gap-4 h-3.5"
          >
            <span
              className={[
                'font-label text-[0.5625rem] tracking-[0.22em] whitespace-nowrap transition-all duration-300',
                isActive
                  ? 'text-[#5CE1FF] opacity-100 translate-x-0'
                  : 'text-white/45 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0',
              ].join(' ')}
              style={
                isActive
                  ? { textShadow: '0 0 10px rgba(92,225,255,0.6)' }
                  : undefined
              }
            >
              {num}&nbsp;/&nbsp;{label}
            </span>
            <span
              className={[
                'relative inline-block rounded-full transition-all duration-300',
                isActive
                  ? 'w-[14px] h-[14px] bg-[#5CE1FF]'
                  : 'w-[7px] h-[7px] bg-white/35 group-hover:bg-[#5CE1FF]/80 group-hover:scale-125',
              ].join(' ')}
              style={
                isActive
                  ? {
                      boxShadow:
                        '0 0 14px rgba(92,225,255,0.95), 0 0 3px rgba(92,225,255,1)',
                    }
                  : undefined
              }
            />
          </button>
        );
      })}
    </nav>
  );
}
