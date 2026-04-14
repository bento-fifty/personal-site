'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * WireCubeCluster — pure CSS 3D wireframe cubes.
 *
 * Three hollow cubes made of 12 edges each (stroke-only).
 * Slow Y-axis auto-rotation + cursor-driven parallax tilt (±8°).
 * Sits in the bottom-right corner of IssueCover above the wireframe floor.
 */

interface CubeProps {
  size: number;
  x: number;
  y: number;
  duration: number;
  color: string;
}

function WireCube({ size, x, y, duration, color }: CubeProps) {
  // Build 12 edges of a cube using absolute divs on a 3D transform stage
  const half = size / 2;
  const edges: { rot: string; len: number }[] = [
    // Top face 4 edges (z = +half)
    { rot: `translate3d(${-half}px, ${-half}px, ${half}px) rotateY(90deg)`, len: size }, // left
    { rot: `translate3d(${-half}px, ${-half}px, ${half}px)`, len: size }, // top
    { rot: `translate3d(${half}px, ${-half}px, ${half}px) rotateY(90deg)`, len: size }, // right
    { rot: `translate3d(${-half}px, ${half}px, ${half}px)`, len: size }, // bottom
  ];

  return (
    <div
      className="absolute"
      style={{
        width: size,
        height: size,
        left: x,
        bottom: y,
        transformStyle: 'preserve-3d',
        animation: `cube-spin ${duration}s linear infinite`,
      }}
    >
      {/* Cube = 6 faces rendered as stroked rectangles */}
      {[
        { tf: `translateZ(${half}px)` },                        // front
        { tf: `translateZ(${-half}px) rotateY(180deg)` },       // back
        { tf: `rotateY(-90deg) translateZ(${half}px)` },        // left
        { tf: `rotateY(90deg) translateZ(${half}px)` },         // right
        { tf: `rotateX(90deg) translateZ(${half}px)` },         // top
        { tf: `rotateX(-90deg) translateZ(${half}px)` },        // bottom
      ].map((f, i) => (
        <div
          key={i}
          className="absolute"
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

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / window.innerWidth;
      const dy = (e.clientY - cy) / window.innerHeight;
      // Max tilt ±8°
      setTilt({ x: Math.max(-8, Math.min(8, dy * 16)), y: Math.max(-8, Math.min(8, dx * 16)) });
    }
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

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
        aria-hidden
        className="hidden lg:block absolute pointer-events-none z-[2]"
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
        <WireCube size={140} x={0}   y={10}  duration={22} color="#FAFAF8" />
        <WireCube size={90}  x={180} y={80}  duration={16} color="#5DD3E3" />
        <WireCube size={60}  x={120} y={160} duration={12} color="#E63E1F" />
      </div>
    </>
  );
}
