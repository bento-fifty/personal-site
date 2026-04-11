'use client';

import { useMemo } from 'react';

// mulberry32 seeded PRNG — pure integer math, identical output on server & client
function mulberry32(seed: number) {
  let s = seed;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CHARS = [
  '0','1','2','3','4','5','6','7','8','9',
  '/',':', '-','·','|',
  'EVT','001','[ ]','──','2025','>','<','#',
];

const LANE_SPACING  = 22;  // px between lanes
const CHARS_PER_LANE = 40; // single copy; doubled inside for seamless loop
const LANE_COUNT    = 80;  // 80 × 22 = 1760 px — covers 1440px screens

interface Lane {
  id: number;
  duration: number;
  delay: number;
  opacity: number;
  fontSize: number;
  lineHeight: number;
  chars: string[];
}

export default function DataStreams() {
  const lanes = useMemo<Lane[]>(() => {
    const rand = mulberry32(4211);
    return Array.from({ length: LANE_COUNT }, (_, i) => {
      const fontSize   = 10 + Math.floor(rand() * 4);   // 10–13 px
      const lineHeight = Math.round(fontSize * 1.55);    // natural spacing
      // Double the chars: single copy fills viewport height, double enables seamless loop
      const chars = Array.from(
        { length: CHARS_PER_LANE * 2 },
        () => CHARS[Math.floor(rand() * CHARS.length)],
      );
      return {
        id:         i,
        duration:   6 + rand() * 10,        // 6–16 s
        delay:      -(rand() * 10),          // negative = already mid-stream on load
        opacity:    0.02 + rand() * 0.12,   // 0.02–0.14
        fontSize,
        lineHeight,
        chars,
      };
    });
  }, []);

  return (
    <>
    <style>{`
      @keyframes dataFall {
        from { transform: translateY(0); }
        to   { transform: translateY(-50%); }
      }
    `}</style>
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      style={{
        // PCB dot grid: ultra-faint gold dots
        backgroundImage:
          'radial-gradient(circle, rgba(92,225,255,0.07) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {lanes.map((lane) => (
        <div
          key={lane.id}
          className="absolute top-0 overflow-hidden"
          style={{
            left:    lane.id * LANE_SPACING,
            width:   LANE_SPACING,
            height:  '100%',
            opacity: lane.opacity,
          }}
        >
          {/*
            Inner div height = CHARS_PER_LANE * 2 * lineHeight (natural).
            translateY(-50%) scrolls exactly one copy upward — seamless infinite loop.
          */}
          <div
            style={{
              display:        'flex',
              flexDirection:  'column',
              fontSize:       lane.fontSize,
              fontFamily:     'var(--font-mono), monospace',
              lineHeight:     `${lane.lineHeight}px`,
              color:          '#ffffff',
              textAlign:      'center',
              animationName:  'dataFall',
              animationDuration:        `${lane.duration}s`,
              animationDelay:           `${lane.delay}s`,
              animationTimingFunction:  'linear',
              animationIterationCount:  'infinite',
              willChange:     'transform',
            }}
          >
            {lane.chars.map((char, j) => (
              <span key={j}>{char}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
    </>
  );
}
