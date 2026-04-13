'use client';

import { useEffect, useRef } from 'react';

export type UniversePhase = 'loading' | 'warp' | 'ambient';

interface Props {
  phase: UniversePhase;
}

// ── Simplex noise (inline, no deps) ──
const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;
const grad3 = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
const perm = new Uint8Array(512);
const permMod8 = new Uint8Array(512);
{
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor((i + 1) * (Math.sin(i * 127.1) * 0.5 + 0.5));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) { perm[i] = p[i & 255]; permMod8[i] = perm[i] % 8; }
}
function noise2D(x: number, y: number): number {
  const s = (x + y) * F2;
  const i = Math.floor(x + s), j = Math.floor(y + s);
  const t = (i + j) * G2;
  const x0 = x - (i - t), y0 = y - (j - t);
  const i1 = x0 > y0 ? 1 : 0, j1 = x0 > y0 ? 0 : 1;
  const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2;
  const x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
  const ii = i & 255, jj = j & 255;
  let n0 = 0, n1 = 0, n2 = 0;
  let t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 >= 0) { t0 *= t0; const g = grad3[permMod8[ii + perm[jj]]]; n0 = t0 * t0 * (g[0] * x0 + g[1] * y0); }
  let t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 >= 0) { t1 *= t1; const g = grad3[permMod8[ii + i1 + perm[jj + j1]]]; n1 = t1 * t1 * (g[0] * x1 + g[1] * y1); }
  let t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 >= 0) { t2 *= t2; const g = grad3[permMod8[ii + 1 + perm[jj + 1]]]; n2 = t2 * t2 * (g[0] * x2 + g[1] * y2); }
  return 70 * (n0 + n1 + n2);
}

// ── Dust particle ──
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

// ── Color zones for nebula ──
function getNebulaColor(nx: number, ny: number): [number, number, number] {
  // Map position to color zones
  const angle = Math.atan2(ny - 0.5, nx - 0.5);
  const t = (angle + Math.PI) / (2 * Math.PI); // 0-1

  if (t < 0.2) return [79, 70, 229];      // indigo
  if (t < 0.35) return [60, 140, 170];     // teal
  if (t < 0.5) return [130, 70, 180];      // purple
  if (t < 0.65) return [200, 120, 160];    // rose
  if (t < 0.8) return [120, 100, 210];     // lavender
  return [50, 40, 130];                     // deep blue
}

export default function UniverseCanvas({ phase }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef<UniversePhase>(phase);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const scrollRef = useRef(0);
  // Cursor trail
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  phaseRef.current = phase;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0, dpr = 1, rafId = 0, running = true;
    let time = 0;
    let noiseOffX = 0, noiseOffY = 100;

    const DUST_COUNT = 1200;
    const particles: Dust[] = [];
    const CURSOR_RADIUS = 140;
    const CURSOR_FORCE = 50;
    const TRAIL_LENGTH = 25;

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
      const trail = trailRef.current;
      trail.push({ x: e.clientX, y: e.clientY });
      if (trail.length > TRAIL_LENGTH) trail.shift();
    }

    function onScroll() {
      scrollRef.current = window.scrollY;
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll, { passive: true });

    resize();
    for (let i = 0; i < DUST_COUNT; i++) particles.push(spawnDust(i));

    // Nebula noise grid settings — coarse grid + large overlap for smooth blending
    const NOISE_COLS = 18;
    const NOISE_SCALE = 0.04;
    const NEBULA_THRESHOLD = 0.48;
    const NEBULA_CURSOR_RADIUS = 180;

    function draw() {
      if (!running) return;
      time += 16;
      const p = phaseRef.current;

      ctx!.fillStyle = '#FAFAF8';
      ctx!.fillRect(0, 0, W, H);

      if (p === 'ambient' || p === 'warp') {
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const scroll = scrollRef.current;

        // Scroll-based fade: full at 0, fades after 1vh
        const scrollFade = Math.max(0, 1 - scroll / (H * 1.2));

        // ── Perlin noise nebula field ──
        if (scrollFade > 0.01) {
          noiseOffX += 0.0004;
          noiseOffY += 0.0003;

          const noiseRows = Math.ceil(NOISE_COLS * (H / W));
          const cellW = W / NOISE_COLS;
          const cellH = H / noiseRows;

          for (let gy = 0; gy < noiseRows; gy++) {
            for (let gx = 0; gx < NOISE_COLS; gx++) {
              const nx = gx * NOISE_SCALE + noiseOffX;
              const ny = gy * NOISE_SCALE + noiseOffY;

              // Multi-octave noise for more organic shapes
              const v1 = noise2D(nx, ny);
              const v2 = noise2D(nx * 2.1 + 5.3, ny * 2.1 + 3.7) * 0.5;
              const val = (v1 + v2) / 1.5; // -1 to 1
              const density = (val + 1) * 0.5; // 0 to 1

              if (density < NEBULA_THRESHOLD) continue;

              const pcx = gx * cellW + cellW / 2;
              const pcy = gy * cellH + cellH / 2;

              // Cursor repulsion: raise threshold near cursor (push clouds away)
              const cdx = pcx - mx;
              const cdy = pcy - my;
              const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
              if (cdist < NEBULA_CURSOR_RADIUS) {
                const pushFactor = (1 - cdist / NEBULA_CURSOR_RADIUS);
                const raisedThreshold = NEBULA_THRESHOLD + pushFactor * 0.4;
                if (density < raisedThreshold) continue;
              }

              const intensity = Math.min(1, (density - NEBULA_THRESHOLD) / 0.25);
              const [r, g, b] = getNebulaColor(gx / NOISE_COLS, gy / noiseRows);
              const alpha = intensity * 0.25 * scrollFade;

              const radius = cellW * 3; // large overlap for smooth blending
              const grad = ctx!.createRadialGradient(pcx, pcy, 0, pcx, pcy, radius);
              grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
              grad.addColorStop(0.3, `rgba(${r},${g},${b},${alpha * 0.7})`);
              grad.addColorStop(0.6, `rgba(${r},${g},${b},${alpha * 0.3})`);
              grad.addColorStop(1, 'transparent');
              ctx!.fillStyle = grad;
              ctx!.fillRect(pcx - radius, pcy - radius, radius * 2, radius * 2);
            }
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
          const alpha = pt.opacity * scrollFade;
          if (alpha < 0.003) continue;

          ctx!.beginPath();
          ctx!.arc(finalX, finalY, Math.max(0.3, pt.size), 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(20,20,25,${alpha})`;
          ctx!.fill();
        }

        // ── Cursor trail (light line) ──
        const trail = trailRef.current;
        if (trail.length > 2) {
          ctx!.beginPath();
          ctx!.moveTo(trail[0].x, trail[0].y);
          for (let i = 1; i < trail.length; i++) {
            ctx!.lineTo(trail[i].x, trail[i].y);
          }
          ctx!.strokeStyle = 'rgba(79,70,229,0.12)';
          ctx!.lineWidth = 1.5;
          ctx!.lineCap = 'round';
          ctx!.lineJoin = 'round';
          ctx!.stroke();

          // Gradient fade: draw again with decreasing opacity segments
          for (let i = 1; i < trail.length; i++) {
            const t = i / trail.length;
            ctx!.beginPath();
            ctx!.moveTo(trail[i - 1].x, trail[i - 1].y);
            ctx!.lineTo(trail[i].x, trail[i].y);
            ctx!.strokeStyle = `rgba(79,70,229,${t * 0.15})`;
            ctx!.lineWidth = 1 + t * 1;
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
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden className="fixed inset-0 w-full h-full pointer-events-none" style={{ display: 'block', zIndex: -1 }} />
  );
}
