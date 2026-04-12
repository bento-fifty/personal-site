'use client';

import { useEffect, useRef } from 'react';

// ── Inline simplex noise (no external deps) ──
// Adapted from Stefan Gustavson's simplex noise implementation
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
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const t = (i + j) * G2;
  const X0 = i - t, Y0 = j - t;
  const x0 = x - X0, y0 = y - Y0;
  const i1 = x0 > y0 ? 1 : 0;
  const j1 = x0 > y0 ? 0 : 1;
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
  return 70 * (n0 + n1 + n2); // -1 to 1
}

// ── Star particle ──
interface Star {
  x: number; y: number; z: number;
  vx: number; vy: number;
  size: number;
  baseAlpha: number;
  phase: number;
  flashTimer: number;
}

export type UniversePhase = 'loading' | 'warp' | 'ambient';

interface Props {
  phase: UniversePhase;
}

export default function UniverseCanvas({ phase }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef<UniversePhase>(phase);
  phaseRef.current = phase;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0, dpr = 1, rafId = 0, running = true;
    let time = 0;
    let warpStartTime = 0;

    const STAR_COUNT = 350;
    const stars: Star[] = [];
    let noiseOffsetX = 0;
    let noiseOffsetY = 0;

    // Track phase transitions internally
    let bgBrightness = 6; // 0-250 (dark → white)
    let targetBgBrightness = 6;
    let warpSpeed = 0;

    function spawnStar(): Star {
      return {
        x: Math.random(),
        y: Math.random(),
        z: 0.5 + Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 0.0003,
        vy: (Math.random() - 0.5) * 0.0003,
        size: 0.6 + Math.random() * 1.4,
        baseAlpha: 0.05 + Math.random() * 0.12,
        phase: Math.random() * Math.PI * 2,
        flashTimer: 2000 + Math.random() * 5000,
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

    function init() {
      resize();
      for (let i = 0; i < STAR_COUNT; i++) stars.push(spawnStar());
    }

    function draw() {
      if (!running) return;
      time += 16;
      const p = phaseRef.current;

      // ── Phase-driven parameters ──
      if (p === 'loading') {
        targetBgBrightness = 6;
        warpSpeed = 0;
      } else if (p === 'warp') {
        if (warpStartTime === 0) warpStartTime = time;
        const warpProgress = Math.min(1, (time - warpStartTime) / 1500);
        // Background transitions from dark to white
        targetBgBrightness = 6 + warpProgress * 244;
        // Stars accelerate then decelerate
        warpSpeed = warpProgress < 0.6
          ? warpProgress / 0.6 * 0.04
          : 0.04 * (1 - (warpProgress - 0.6) / 0.4 * 0.8);
      } else {
        targetBgBrightness = 250;
        warpSpeed *= 0.95; // decay to 0
      }

      // Lerp bg
      bgBrightness += (targetBgBrightness - bgBrightness) * 0.04;

      const bgR = Math.round(bgBrightness);
      const bgG = Math.round(bgBrightness);
      const bgB = Math.round(Math.min(255, bgBrightness + 2));

      // ── Clear ──
      ctx!.fillStyle = `rgb(${bgR},${bgG},${bgB})`;
      ctx!.fillRect(0, 0, W, H);

      const isDark = bgBrightness < 128;
      const cx = W / 2;
      const cy = H / 2;

      // ── Stars / particles ──
      const fov = Math.max(W, H) * 0.5;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        if (warpSpeed > 0.001) {
          // Warp mode: z-axis movement toward viewer
          s.z -= warpSpeed;
          if (s.z <= 0.05) {
            s.x = Math.random();
            s.y = Math.random();
            s.z = 1.5 + Math.random() * 0.5;
            continue;
          }
          const scale = fov / s.z;
          const sx = cx + (s.x - 0.5) * 2 * scale;
          const sy = cy + (s.y - 0.5) * 2 * scale;
          const prevScale = fov / (s.z + warpSpeed);
          const psx = cx + (s.x - 0.5) * 2 * prevScale;
          const psy = cy + (s.y - 0.5) * 2 * prevScale;

          if (sx < -30 || sx > W + 30 || sy < -30 || sy > H + 30) {
            s.x = Math.random(); s.y = Math.random(); s.z = 1.5 + Math.random() * 0.5;
            continue;
          }

          const brightness = Math.min(1, (1 - s.z / 2) * 1.5);
          const lineW = Math.max(0.4, brightness * 2);

          // Color adapts to background brightness
          const starBright = isDark ? 255 : Math.max(20, 180 - bgBrightness * 0.6);
          ctx!.strokeStyle = `rgba(${starBright},${starBright},${Math.min(255, starBright + 10)},${brightness * 0.7})`;
          ctx!.lineWidth = lineW;
          ctx!.beginPath();
          ctx!.moveTo(psx, psy);
          ctx!.lineTo(sx, sy);
          ctx!.stroke();
        } else {
          // Ambient / loading mode: gentle drift
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < -0.01) s.x = 1.01;
          if (s.x > 1.01) s.x = -0.01;
          if (s.y < -0.01) s.y = 1.01;
          if (s.y > 1.01) s.y = -0.01;

          const twinkle = Math.sin(time * 0.001 + s.phase) * 0.5 + 0.5;
          let alpha = s.baseAlpha + twinkle * 0.04;

          // Flash
          s.flashTimer -= 16;
          if (s.flashTimer <= 0) {
            alpha = 0.3;
            s.flashTimer = 2000 + Math.random() * 6000;
          } else if (s.flashTimer < 200) {
            alpha = Math.max(alpha, 0.3 * (s.flashTimer / 200));
          }

          // In ambient mode, reduce particle count visually (only show subset)
          if (p === 'ambient' && i > 100) continue;

          const px = s.x * W;
          const py = s.y * H;
          const starBright = isDark ? 255 : 20;
          ctx!.beginPath();
          ctx!.arc(px, py, s.size * (isDark ? 1 : 0.7), 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${starBright},${starBright},${Math.min(255, starBright + 5)},${alpha})`;
          ctx!.fill();
        }
      }

      // ── Perlin noise nebula (ambient phase only) ──
      if (p === 'ambient' || (p === 'warp' && bgBrightness > 200)) {
        const nebulaAlpha = p === 'ambient' ? 1 : Math.min(1, (bgBrightness - 200) / 50);
        noiseOffsetX += 0.0006;
        noiseOffsetY += 0.0004;

        const gridCols = 20;
        const gridRows = Math.ceil(gridCols * (H / W));
        const cellW = W / gridCols;
        const cellH = H / gridRows;
        const noiseScale = 0.018;

        for (let gy = 0; gy < gridRows; gy++) {
          for (let gx = 0; gx < gridCols; gx++) {
            const nx = gx * noiseScale + noiseOffsetX;
            const ny = gy * noiseScale + noiseOffsetY;
            const val = noise2D(nx, ny); // -1 to 1
            const density = (val + 1) * 0.5; // 0 to 1

            if (density > 0.45) {
              const intensity = (density - 0.45) / 0.55; // 0-1
              const pcx = gx * cellW + cellW / 2;
              const pcy = gy * cellH + cellH / 2;
              const radius = cellW * 2.2;

              // Alternate between warm and cool nebula colors
              const isWarm = (gx + gy) % 3 === 0;
              const r = isWarm ? 200 : 79;
              const g = isWarm ? 190 : 70;
              const b = isWarm ? 175 : 229;
              const a = intensity * 0.16 * nebulaAlpha;

              const grad = ctx!.createRadialGradient(pcx, pcy, 0, pcx, pcy, radius);
              grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
              grad.addColorStop(1, 'transparent');
              ctx!.fillStyle = grad;
              ctx!.fillRect(pcx - radius, pcy - radius, radius * 2, radius * 2);
            }
          }
        }
      }

      // ── Scanlines during loading ──
      if (p === 'loading' || (p === 'warp' && bgBrightness < 100)) {
        const scanAlpha = Math.min(0.05, (100 - bgBrightness) / 100 * 0.05);
        if (scanAlpha > 0.005) {
          ctx!.fillStyle = `rgba(0,0,0,${scanAlpha})`;
          for (let sy = 0; sy < H; sy += 3) ctx!.fillRect(0, sy, W, 1);
        }
      }

      rafId = requestAnimationFrame(draw);
    }

    init();
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
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ display: 'block', zIndex: -1 }}
    />
  );
}
