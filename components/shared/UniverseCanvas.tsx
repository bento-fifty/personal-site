'use client';

import { useEffect, useRef } from 'react';

export type UniversePhase = 'loading' | 'warp' | 'ambient';

interface Props {
  phase: UniversePhase;
}

interface Dust {
  x: number; y: number;
  size: number; opacity: number;
  vx: number; vy: number;
  homeX: number; homeY: number;
  pushX: number; pushY: number;
}

function seededRand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

export default function UniverseCanvas({ phase }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef<UniversePhase>(phase);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  phaseRef.current = phase;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0, dpr = 1, rafId = 0, running = true;
    let time = 0;

    const DUST_COUNT = 1200;
    const particles: Dust[] = [];
    const CURSOR_RADIUS = 140;
    const CURSOR_FORCE = 50;

    // Nebula clouds — concentrated, high alpha, multi-color
    const nebulaClouds = [
      { x: 0.15, y: 0.25, r: 0.12, color: [79, 70, 229],  a: 0.45 },   // indigo
      { x: 0.82, y: 0.15, r: 0.10, color: [120, 100, 210], a: 0.38 },  // lavender
      { x: 0.08, y: 0.75, r: 0.09, color: [50, 40, 130],   a: 0.35 },  // deep blue
      { x: 0.75, y: 0.70, r: 0.11, color: [200, 120, 160], a: 0.35 },  // rose
      { x: 0.35, y: 0.85, r: 0.08, color: [180, 100, 140], a: 0.30 },  // dusty rose
      { x: 0.55, y: 0.20, r: 0.09, color: [60, 160, 180],  a: 0.30 },  // teal
      { x: 0.90, y: 0.45, r: 0.07, color: [70, 140, 170],  a: 0.35 },  // cyan
      { x: 0.40, y: 0.60, r: 0.10, color: [130, 70, 180],  a: 0.38 },  // vivid purple
      { x: 0.65, y: 0.90, r: 0.08, color: [100, 60, 160],  a: 0.35 },  // grape
    ];

    function spawnDust(i: number): Dust {
      const roll = seededRand(i * 7 + 31);
      let size: number, opacity: number;

      if (roll < 0.72) {
        size = 0.3 + seededRand(i * 13 + 7) * 1.2;
        opacity = 0.05 + seededRand(i * 17 + 3) * 0.18;
      } else if (roll < 0.93) {
        size = 1.5 + seededRand(i * 19 + 11) * 2.5;
        opacity = 0.03 + seededRand(i * 23 + 5) * 0.08;
      } else {
        size = 3 + seededRand(i * 29 + 13) * 2;
        opacity = 0.03 + seededRand(i * 31 + 17) * 0.04;
      }

      const x = seededRand(i * 61 + 29);
      const y = seededRand(i * 67 + 31);

      return {
        x, y, size, opacity,
        vx: (seededRand(i * 71 + 37) - 0.5) * 0.00006,
        vy: (seededRand(i * 73 + 41) - 0.5) * 0.00006,
        homeX: x, homeY: y, pushX: 0, pushY: 0,
      };
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas!.clientWidth;
      H = canvas!.clientHeight;
      canvas!.width = Math.floor(W * dpr);
      canvas!.height = Math.floor(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener('mousemove', onMouseMove);

    resize();
    for (let i = 0; i < DUST_COUNT; i++) particles.push(spawnDust(i));

    function draw() {
      if (!running) return;
      time += 16;
      const p = phaseRef.current;

      // White background
      ctx!.fillStyle = '#FAFAF8';
      ctx!.fillRect(0, 0, W, H);

      if (p === 'ambient' || (p === 'warp')) {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;

        // ── Nebula clouds (irregular shape + cursor interactive) ──
        const NEBULA_CURSOR_RADIUS = 200;
        const NEBULA_CURSOR_PUSH = 60;

        for (const c of nebulaClouds) {
          let basePx = c.x * W;
          let basePy = c.y * H;
          const radius = c.r * Math.max(W, H);

          // Organic drift
          const drift = Math.sin(time * 0.00015 + c.x * 10) * 20;
          const driftY = Math.cos(time * 0.0001 + c.y * 8) * 12;
          basePx += drift;
          basePy += driftY;

          // Cursor repulsion on nebula
          const ndx = basePx - mx;
          const ndy = basePy - my;
          const ndist = Math.sqrt(ndx * ndx + ndy * ndy);
          if (ndist < NEBULA_CURSOR_RADIUS && ndist > 0) {
            const nforce = (1 - ndist / NEBULA_CURSOR_RADIUS) * NEBULA_CURSOR_PUSH;
            basePx += (ndx / ndist) * nforce;
            basePy += (ndy / ndist) * nforce;
          }

          // Irregular shape: 3 overlapping offset blobs instead of 1 circle
          const offsets = [
            { ox: 0, oy: 0, scale: 1 },
            { ox: radius * 0.3, oy: -radius * 0.2, scale: 0.7 },
            { ox: -radius * 0.25, oy: radius * 0.3, scale: 0.6 },
          ];

          for (const off of offsets) {
            const cx2 = basePx + off.ox;
            const cy2 = basePy + off.oy;
            const r2 = radius * off.scale;
            const grad = ctx!.createRadialGradient(cx2, cy2, 0, cx2, cy2, r2);
            const a = c.a * off.scale;
            grad.addColorStop(0, `rgba(${c.color[0]},${c.color[1]},${c.color[2]},${a})`);
            grad.addColorStop(0.3, `rgba(${c.color[0]},${c.color[1]},${c.color[2]},${a * 0.75})`);
            grad.addColorStop(0.6, `rgba(${c.color[0]},${c.color[1]},${c.color[2]},${a * 0.35})`);
            grad.addColorStop(1, 'transparent');
            ctx!.fillStyle = grad;
            ctx!.fillRect(cx2 - r2, cy2 - r2, r2 * 2, r2 * 2);
          }
        }

        // ── Star dust particles ──
        for (const pt of particles) {
          pt.homeX += pt.vx;
          pt.homeY += pt.vy;
          if (pt.homeX < -0.03) pt.homeX = 1.03;
          if (pt.homeX > 1.03) pt.homeX = -0.03;
          if (pt.homeY < -0.03) pt.homeY = 1.03;
          if (pt.homeY > 1.03) pt.homeY = -0.03;

          const px = pt.homeX * W + pt.pushX;
          const py = pt.homeY * H + pt.pushY;
          const dx = px - mx;
          const dy = py - my;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CURSOR_RADIUS && dist > 0) {
            const force = (1 - dist / CURSOR_RADIUS) * CURSOR_FORCE;
            pt.pushX += (dx / dist) * force * 0.15;
            pt.pushY += (dy / dist) * force * 0.15;
          }
          pt.pushX *= 0.92;
          pt.pushY *= 0.92;

          const finalX = pt.homeX * W + pt.pushX;
          const finalY = pt.homeY * H + pt.pushY;
          const alpha = pt.opacity;
          if (alpha < 0.003) continue;

          ctx!.beginPath();
          ctx!.arc(finalX, finalY, Math.max(0.3, pt.size), 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(20,20,25,${alpha})`;
          ctx!.fill();

          if (pt.size > 4 && alpha > 0.02) {
            const sLen = pt.size * 2;
            ctx!.strokeStyle = `rgba(79,70,229,${alpha * 0.4})`;
            ctx!.lineWidth = 0.4;
            ctx!.beginPath();
            ctx!.moveTo(finalX - sLen, finalY);
            ctx!.lineTo(finalX + sLen, finalY);
            ctx!.moveTo(finalX, finalY - sLen);
            ctx!.lineTo(finalX, finalY + sLen);
            ctx!.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);

    const onVis = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(rafId); }
      else { running = true; rafId = requestAnimationFrame(draw); }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden className="fixed inset-0 w-full h-full pointer-events-none" style={{ display: 'block', zIndex: -1 }} />
  );
}
