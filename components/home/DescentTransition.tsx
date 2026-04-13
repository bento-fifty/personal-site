'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion';

export default function DescentTransition() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Background color
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.15, 0.4, 0.7, 1],
    ['transparent', 'transparent', 'transparent', 'transparent', 'transparent']
  );

  // Readout values
  const altitude = useTransform(scrollYProgress, [0.2, 0.9], [120000, 0]);
  const velocity = useTransform(scrollYProgress, [0.2, 0.5, 0.9], [0, 3400, 200]);

  // Element visibility
  const hudOpacity = useTransform(scrollYProgress, [0.1, 0.25], [0, 1]);
  const readoutOpacity = useTransform(scrollYProgress, [0.25, 0.4], [0, 1]);
  const landedOpacity = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]);
  const descendingOpacity = useTransform(scrollYProgress, [0.25, 0.4, 0.85, 0.95], [0, 1, 1, 0]);
  const horizonScale = useTransform(scrollYProgress, [0.8, 1], [0, 1]);
  const horizonOpacity = useTransform(scrollYProgress, [0.75, 0.85], [0, 1]);

  // Light band parallax
  const band1Y = useTransform(scrollYProgress, [0, 1], [100, -600]);
  const band2Y = useTransform(scrollYProgress, [0, 1], [200, -500]);
  const band3Y = useTransform(scrollYProgress, [0, 1], [50, -700]);
  const bandOpacity = useTransform(scrollYProgress, [0.05, 0.2, 0.8, 0.95], [0, 1, 0.6, 0]);

  return (
    <section
      id="descent"
      ref={ref}
      className="relative"
      style={{ height: '250vh' }}
    >
      {/* Sticky viewport — stays in view while scrolling through 250vh */}
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {/* Dynamic background */}
        <motion.div className="absolute inset-0" style={{ backgroundColor: bgColor }} />

        {/* ── Parallax light bands ── */}
        <motion.div
          className="absolute left-0 right-0 h-[2px] pointer-events-none"
          style={{
            y: band1Y,
            opacity: bandOpacity,
            background: 'linear-gradient(90deg, transparent 5%, rgba(79,70,229,0.15) 30%, rgba(79,70,229,0.2) 50%, rgba(79,70,229,0.15) 70%, transparent 95%)',
          }}
          aria-hidden
        />
        <motion.div
          className="absolute left-[10%] right-[10%] h-[1px] pointer-events-none"
          style={{
            y: band2Y,
            opacity: bandOpacity,
            background: 'linear-gradient(90deg, transparent 10%, rgba(79,70,229,0.1) 40%, rgba(79,70,229,0.15) 50%, rgba(79,70,229,0.1) 60%, transparent 90%)',
          }}
          aria-hidden
        />
        <motion.div
          className="absolute left-[20%] right-[20%] h-[1px] pointer-events-none"
          style={{
            y: band3Y,
            opacity: bandOpacity,
            background: 'linear-gradient(90deg, transparent 15%, rgba(79,70,229,0.08) 45%, rgba(79,70,229,0.12) 50%, rgba(79,70,229,0.08) 55%, transparent 85%)',
          }}
          aria-hidden
        />

        {/* ── HUD viewport frame ── */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: hudOpacity }}
          aria-hidden
        >
          {/* Left vertical */}
          <div className="absolute left-8 md:left-14 top-[8%] bottom-[8%] w-px bg-black/10" />
          {/* Right vertical */}
          <div className="absolute right-8 md:right-14 top-[8%] bottom-[8%] w-px bg-black/10" />

          {/* TL corner */}
          <div className="absolute left-8 md:left-14 top-[8%]">
            <div className="w-8 h-px bg-black/15" />
            <div className="w-px h-8 bg-black/15" />
          </div>
          {/* TR corner */}
          <div className="absolute right-8 md:right-14 top-[8%]">
            <div className="w-8 h-px bg-black/15 ml-auto" />
            <div className="w-px h-8 bg-black/15 ml-auto" />
          </div>
          {/* BL corner */}
          <div className="absolute left-8 md:left-14 bottom-[8%]">
            <div className="w-px h-8 bg-black/15" />
            <div className="w-8 h-px bg-black/15" />
          </div>
          {/* BR corner */}
          <div className="absolute right-8 md:right-14 bottom-[8%]">
            <div className="w-px h-8 bg-black/15 ml-auto" />
            <div className="w-8 h-px bg-black/15 ml-auto" />
          </div>
        </motion.div>

        {/* ── Terminal readout ── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: readoutOpacity }}
        >
          <div
            className="relative px-10 py-8 md:px-16 md:py-12"
            style={{
              fontFamily: 'var(--font-departure-mono), monospace',
              fontSize: '12px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            {/* Inner brackets */}
            <span className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/30" />
            <span className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/30" />
            <span className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/30" />
            <span className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/30" />

            <div className="flex flex-col gap-3">
              <p className="text-black/30 text-[11px] mb-2">
                &gt; Initiating descent sequence
              </p>

              <ReadoutLine label="Altitude" value={altitude} suffix="m" />
              <ReadoutLine label="Velocity" value={velocity} suffix="m/s" />

              <p>
                <span className="text-black/30">&gt; Coord{'    '}</span>
                <span className="text-black/50 tabular-nums">25.03°N 121.57°E</span>
              </p>
              <p>
                <span className="text-black/30">&gt; Target{'   '}</span>
                <span className="text-black/50">Taipei, Taiwan</span>
              </p>

              <div className="mt-3 pt-3 border-t border-white/10 relative">
                <motion.p style={{ opacity: descendingOpacity }}>
                  <span className="text-black/30">&gt; Status{'   '}</span>
                  <span className="text-black/50">Descending...</span>
                </motion.p>
                <motion.p className="absolute top-3 pt-3 left-0" style={{ opacity: landedOpacity }}>
                  <span className="text-black/30">&gt; Status{'   '}</span>
                  <span className="text-[#4F46E5]">Touchdown Confirmed</span>
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Horizon line ── */}
        <motion.div
          className="absolute bottom-[10%] left-0 right-0 flex justify-center pointer-events-none"
          style={{ opacity: horizonOpacity }}
          aria-hidden
        >
          <motion.div
            style={{
              width: '75%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(79,70,229,0.3) 25%, rgba(79,70,229,0.5) 50%, rgba(79,70,229,0.3) 75%, transparent 100%)',
              scaleX: horizonScale,
              transformOrigin: 'center',
              boxShadow: '0 0 30px rgba(79,70,229,0.3), 0 0 80px rgba(79,70,229,0.1)',
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}

function ReadoutLine({
  label,
  value,
  suffix,
}: {
  label: string;
  value: MotionValue<number>;
  suffix: string;
}) {
  const [display, setDisplay] = useState('0');
  useMotionValueEvent(value, 'change', (v) => {
    setDisplay(Math.round(v).toLocaleString());
  });

  return (
    <p>
      <span className="text-black/30">&gt; {label.padEnd(9, ' ')}</span>
      <span className="text-white/80 tabular-nums">{display}</span>
      <span className="text-black/30"> {suffix}</span>
    </p>
  );
}
