'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

/**
 * WireCubeCluster — 3 wireframe cubes, hover tooltip + click to fly away.
 *
 * Click a cube → it flies out of the viewport with a rotation, pauses offscreen,
 * then flies back in from the opposite side and settles. Other cubes keep
 * auto-spinning unaffected.
 */

type CubeKey = 'issue' | 'roles' | 'location';

interface CubeFacet {
  key: CubeKey;
  size: number;
  x: number;
  y: number;
  duration: number;
  color: string;
  label: string;
  value: string;
}

const FACETS: CubeFacet[] = [
  { key: 'issue',    size: 140, x: 0,   y: 10,  duration: 22, color: '#FAFAF8', label: 'ISSUE',    value: 'N°003 · 2026' },
  { key: 'roles',    size: 90,  x: 180, y: 80,  duration: 16, color: '#5DD3E3', label: 'ROLES',    value: 'PRINCIPAL · PRODUCER · CONSULT' },
  { key: 'location', size: 60,  x: 120, y: 160, duration: 12, color: '#E63E1F', label: 'LOCATION', value: 'TAIPEI · 25.03°N 121.57°E' },
];

function CubeFaces({ size, color }: { size: number; color: string }) {
  const half = size / 2;
  return (
    <>
      {[
        { tf: `translateZ(${half}px)` },
        { tf: `translateZ(${-half}px) rotateY(180deg)` },
        { tf: `rotateY(-90deg) translateZ(${half}px)` },
        { tf: `rotateY(90deg) translateZ(${half}px)` },
        { tf: `rotateX(90deg) translateZ(${half}px)` },
        { tf: `rotateX(-90deg) translateZ(${half}px)` },
      ].map((f, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            width: size,
            height: size,
            left: 0,
            top: 0,
            border: `1px solid ${color}`,
            transform: f.tf,
            boxSizing: 'border-box',
          }}
        />
      ))}
    </>
  );
}

function WireCube({
  facet,
  onHover,
}: {
  facet: CubeFacet;
  onHover: (k: CubeKey | null) => void;
}) {
  const { size, x, y, duration, color } = facet;
  const [flying, setFlying] = useState(false);
  const controls = useAnimation();

  const launch = async () => {
    if (flying) return;
    setFlying(true);

    // Knocked-around: stays in viewport. Random direction, moderate travel,
    // overshoot tumble, then spring home.
    const dirX = Math.random() > 0.5 ? 1 : -1;
    const dirY = Math.random() > 0.5 ? 1 : -1;
    const dx = dirX * (90 + Math.random() * 70);   // 90–160px
    const dy = dirY * (60 + Math.random() * 50);   // 60–110px
    const rot = (Math.random() > 0.5 ? 1 : -1) * (540 + Math.random() * 360); // 540–900°

    // Kick out — overshoot + tumble
    await controls.start({
      x: dx,
      y: dy,
      rotate: rot,
      scale: 1.08,
      transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }, // back.out
    });

    // Spring back to origin with continued spin
    await controls.start({
      x: 0,
      y: 0,
      rotate: rot + 180,
      scale: 1,
      transition: { type: 'spring', stiffness: 120, damping: 11, mass: 0.9 },
    });

    // Reset rotation baseline silently for next launch
    controls.set({ rotate: 0 });
    setFlying(false);
  };

  return (
    <motion.div
      className="absolute pointer-events-auto cursor-pointer"
      style={{
        width: size,
        height: size,
        left: x,
        bottom: y,
      }}
      initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
      animate={controls}
      onMouseEnter={() => onHover(facet.key)}
      onMouseLeave={() => onHover(null)}
      onClick={launch}
      data-cursor={flying ? '↗ WHEE' : `⊡ ${facet.label}`}
      data-cursor-variant="link"
    >
      {/* Inner: CSS spin (unaffected by outer fly transform) */}
      <div
        style={{
          width: size,
          height: size,
          transformStyle: 'preserve-3d',
          animation: `cube-spin ${duration}s linear infinite`,
          animationPlayState: flying ? 'paused' : 'running',
        }}
      >
        <CubeFaces size={size} color={color} />
      </div>
    </motion.div>
  );
}

export default function WireCubeCluster() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hoverKey, setHoverKey] = useState<CubeKey | null>(null);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / window.innerWidth;
      const dy = (e.clientY - cy) / window.innerHeight;
      setTilt({
        x: Math.max(-8, Math.min(8, dy * 16)),
        y: Math.max(-8, Math.min(8, dx * 16)),
      });
    }
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const currentFacet = hoverKey ? FACETS.find((f) => f.key === hoverKey) : null;

  return (
    <>
      <style>{`
        @keyframes cube-spin {
          from { transform: rotateY(0) rotateX(-12deg); }
          to   { transform: rotateY(360deg) rotateX(-12deg); }
        }
      `}</style>
      <div
        ref={ref}
        className="hidden lg:block absolute z-[2]"
        style={{
          right: 260,
          bottom: 80,
          width: 360,
          height: 260,
          perspective: '900px',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 300ms ease-out',
        }}
      >
        {FACETS.map((f) => (
          <WireCube key={f.key} facet={f} onHover={setHoverKey} />
        ))}
      </div>

      {/* Tooltip */}
      <div
        aria-live="polite"
        className="hidden lg:block fixed pointer-events-none z-[3]"
        style={{
          right: 32,
          bottom: 96,
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 9,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: 'rgba(250,250,248,0.6)',
          opacity: currentFacet ? 1 : 0,
          transition: 'opacity 200ms ease-out',
          textAlign: 'right',
          maxWidth: 260,
        }}
      >
        {currentFacet && (
          <div>
            <span style={{ color: '#5DD3E3' }}>[ {currentFacet.label} ]</span>{' '}
            <span style={{ color: 'rgba(250,250,248,0.85)' }}>{currentFacet.value}</span>
          </div>
        )}
      </div>
    </>
  );
}
