'use client';

import { useEffect, useRef } from 'react';

/**
 * HyperspaceField — Round 2.1 v2 background.
 *
 * Metaphor: **starship hyperspace jump**, not crowd flow. Particles travel
 * from far z (1.0–2.0) toward the viewer (z → 0) then respawn at the far
 * edge with new random (x, y). Each frame draws a short line segment from
 * the previous projected position to the current one, producing radial
 * motion lines that appear to streak from a central vanishing point.
 *
 * Replaces FlowField (Perlin flow curves) which read as organic / bio.
 */

interface Particle {
  x: number;       // world −1..1
  y: number;       // world −1..1
  z: number;       // depth 2.0 (far) → 0.0 (near)
  prevZ: number;
  accent: boolean; // 8% cyan, rest white
}

export default function HyperspaceField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const particleCount = prefersReduced ? 90 : isMobile ? 220 : 460;

    let width = 0;
    let height = 0;
    let cx = 0;
    let cy = 0;
    let fov = 0;
    let particles: Particle[] = [];
    let rafId = 0;
    let running = true;

    function spawn(p?: Particle): Particle {
      const pt: Particle = p ?? { x: 0, y: 0, z: 0, prevZ: 0, accent: false };
      // Avoid dead center — pick a direction angle then random radius
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.15 + Math.random() * 0.85;
      pt.x = Math.cos(angle) * radius;
      pt.y = Math.sin(angle) * radius;
      pt.z = 1.0 + Math.random() * 1.0; // 1.0..2.0
      pt.prevZ = pt.z;
      pt.accent = Math.random() < 0.08;
      return pt;
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) particles.push(spawn());
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = width / 2;
      cy = height / 2;
      fov = Math.max(width, height) * 0.55;
      // Reset dark wash so trails don't bleed on resize
      ctx!.fillStyle = '#050505';
      ctx!.fillRect(0, 0, width, height);
    }

    function drawFrame() {
      if (!running) return;

      // Trail fade — every frame writes a low-alpha dark rect over
      // everything, so old streaks decay but fresh ones stay readable
      ctx!.fillStyle = 'rgba(5, 5, 5, 0.14)';
      ctx!.fillRect(0, 0, width, height);

      const zSpeed = prefersReduced ? 0.0018 : 0.0085;

      ctx!.lineCap = 'round';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.prevZ = p.z;
        p.z -= zSpeed;

        if (p.z <= 0.05) {
          spawn(p);
          continue;
        }

        const scale = 1 / p.z;
        const sx = cx + p.x * fov * scale;
        const sy = cy + p.y * fov * scale;

        const prevScale = 1 / p.prevZ;
        const psx = cx + p.x * fov * prevScale;
        const psy = cy + p.y * fov * prevScale;

        // Out of viewport bounds → respawn at far
        if (sx < -40 || sx > width + 40 || sy < -40 || sy > height + 40) {
          spawn(p);
          continue;
        }

        // Brightness ramps as particle approaches (near = bright)
        const brightness = Math.min(1, (1 - p.z / 2.0) * 1.35);
        const lineWidth = Math.max(0.5, brightness * 1.8);

        ctx!.lineWidth = lineWidth;
        ctx!.strokeStyle = p.accent
          ? `rgba(92, 225, 255, ${brightness * 0.55})`
          : `rgba(255, 255, 255, ${brightness * 0.7})`;
        ctx!.beginPath();
        ctx!.moveTo(psx, psy);
        ctx!.lineTo(sx, sy);
        ctx!.stroke();
      }

      rafId = requestAnimationFrame(drawFrame);
    }

    function pause() {
      if (!running) return;
      running = false;
      cancelAnimationFrame(rafId);
    }

    function resume() {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(drawFrame);
    }

    function onVis() {
      if (document.hidden) pause();
      else resume();
    }

    const ro = new ResizeObserver(() => {
      resize();
      initParticles();
    });
    ro.observe(canvas);

    resize();
    initParticles();
    rafId = requestAnimationFrame(drawFrame);
    document.addEventListener('visibilitychange', onVis);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ display: 'block' }}
    />
  );
}
