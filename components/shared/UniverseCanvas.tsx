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
  const scrollRef = useRef(0);
  phaseRef.current = phase;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0, dpr = 1, rafId = 0, running = true;

    const DUST_COUNT = 1400;
    const particles: Dust[] = [];
    const CURSOR_RADIUS = 140;
    const CURSOR_FORCE = 50;

    function spawnDust(i: number): Dust {
      const roll = seededRand(i * 7 + 31);
      let size: number, opacity: number;
      if (roll < 0.72) {
        size = 0.3 + seededRand(i * 13 + 7) * 1.2;
        opacity = 0.06 + seededRand(i * 17 + 3) * 0.22;
      } else if (roll < 0.93) {
        size = 1.5 + seededRand(i * 19 + 11) * 2.5;
        opacity = 0.04 + seededRand(i * 23 + 5) * 0.10;
      } else {
        size = 3 + seededRand(i * 29 + 13) * 2;
        opacity = 0.03 + seededRand(i * 31 + 17) * 0.05;
      }
      const x = seededRand(i * 61 + 29);
      const y = seededRand(i * 67 + 31);
      return { x, y, size, opacity, vx: (seededRand(i * 71 + 37) - 0.5) * 0.00006, vy: (seededRand(i * 73 + 41) - 0.5) * 0.00006, homeX: x, homeY: y, pushX: 0, pushY: 0 };
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

    const scrollContainer = canvas.closest('.overflow-y-auto') as HTMLElement | null;

    function onScroll() {
      scrollRef.current = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
    }

    window.addEventListener('mousemove', onMouseMove);
    const scrollTarget = scrollContainer || window;
    scrollTarget.addEventListener('scroll', onScroll, { passive: true });

    resize();
    for (let i = 0; i < DUST_COUNT; i++) particles.push(spawnDust(i));

    function draw() {
      if (!running) return;
      ctx!.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const scroll = scrollRef.current;

      // White zone heuristic: Showcase is ~section 3
      const scrollMid = scroll + H / 2;
      const whiteZoneStart = H * 2.2;
      const whiteZoneEnd = H * 3.3;
      const inWhiteZone = scrollMid > whiteZoneStart && scrollMid < whiteZoneEnd;

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
        ctx!.fillStyle = inWhiteZone
          ? `rgba(10,10,12,${Math.min(1, alpha * 1.4)})`
          : `rgba(250,250,248,${Math.min(1, alpha * 1.8)})`;
        ctx!.fill();
      }

      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);
    const ro = new ResizeObserver(() => { resize(); });
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
      scrollTarget.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden className="fixed inset-0 w-full h-full pointer-events-none" style={{ display: 'block', zIndex: 15 }} />
  );
}
