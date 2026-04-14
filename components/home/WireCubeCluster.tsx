'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * WireCubeCluster — 3 wireframe cubes acting as identity HUD widgets.
 *
 * Hover a cube → ice tooltip with its facet meaning.
 * Click a cube → enters drag mode (30s), user rotates cluster by drag; release
 * returns to auto-spin.
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
  {
    key: 'issue',
    size: 140,
    x: 0,
    y: 10,
    duration: 22,
    color: '#FAFAF8',
    label: 'ISSUE',
    value: 'N°003 · 2026',
  },
  {
    key: 'roles',
    size: 90,
    x: 180,
    y: 80,
    duration: 16,
    color: '#5DD3E3',
    label: 'ROLES',
    value: 'PRINCIPAL · PRODUCER · CONSULT',
  },
  {
    key: 'location',
    size: 60,
    x: 120,
    y: 160,
    duration: 12,
    color: '#E63E1F',
    label: 'LOCATION',
    value: 'TAIPEI · 25.03°N 121.57°E',
  },
];

interface CubeRenderProps {
  facet: CubeFacet;
  paused: boolean;
  onHover: (key: CubeKey | null) => void;
  onClick: (e: React.MouseEvent) => void;
}

function WireCube({ facet, paused, onHover, onClick }: CubeRenderProps) {
  const { size, x, y, duration, color } = facet;
  const half = size / 2;

  return (
    <div
      onMouseEnter={() => onHover(facet.key)}
      onMouseLeave={() => onHover(null)}
      onMouseDown={onClick}
      data-cursor={`⊡ ${facet.label}`}
      data-cursor-variant="link"
      className="absolute pointer-events-auto cursor-pointer"
      style={{
        width: size,
        height: size,
        left: x,
        bottom: y,
        transformStyle: 'preserve-3d',
        animation: `cube-spin ${duration}s linear infinite`,
        animationPlayState: paused ? 'paused' : 'running',
      }}
    >
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
    </div>
  );
}

export default function WireCubeCluster() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hoverKey, setHoverKey] = useState<CubeKey | null>(null);
  const [dragMode, setDragMode] = useState(false);
  const dragStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const dragTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!ref.current) return;

      if (dragMode && dragStart.current) {
        const dx = (e.clientX - dragStart.current.x) / 4;
        const dy = (e.clientY - dragStart.current.y) / 4;
        setTilt({
          x: Math.max(-45, Math.min(45, dragStart.current.tx - dy)),
          y: Math.max(-60, Math.min(60, dragStart.current.ty + dx)),
        });
        return;
      }

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

    function onUp() {
      dragStart.current = null;
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragMode]);

  const onCubeClick = (e: React.MouseEvent) => {
    setDragMode(true);
    dragStart.current = { x: e.clientX, y: e.clientY, tx: tilt.x, ty: tilt.y };
    if (dragTimer.current) clearTimeout(dragTimer.current);
    dragTimer.current = setTimeout(() => setDragMode(false), 30_000);
  };

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
          transition: dragMode ? 'none' : 'transform 300ms ease-out',
        }}
      >
        {FACETS.map((f) => (
          <WireCube
            key={f.key}
            facet={f}
            paused={dragMode}
            onHover={(k) => setHoverKey(k)}
            onClick={onCubeClick}
          />
        ))}
      </div>

      {/* Tooltip + drag-mode status */}
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
          opacity: currentFacet || dragMode ? 1 : 0,
          transition: 'opacity 200ms ease-out',
          textAlign: 'right',
          maxWidth: 260,
        }}
      >
        {dragMode && (
          <div style={{ color: '#5DD3E3', marginBottom: 6 }}>
            ▸ DRAG MODE · RELEASE TO RESUME
          </div>
        )}
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
