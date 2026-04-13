'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface TextParticle {
  tx: number; ty: number;
  x: number; y: number;
  vx: number; vy: number;
  size: number;
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0, dpr = 1, rafId = 0, running = true;
    let particles: TextParticle[] = [];

    // Text layout values (set during sampleText, used in drawSolidText)
    let mainSize = 0, mainY = 0;
    let subSize = 0, subY = 0;
    let creditSize = 0, creditY = 0;

    const CURSOR_RADIUS = 80;
    const CURSOR_FORCE = 25;
    const GAP = 2; // relaxed — particles only shown near cursor

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas!.clientWidth;
      H = canvas!.clientHeight;
      canvas!.width = Math.floor(W * dpr);
      canvas!.height = Math.floor(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function sampleText() {
      // Compute text layout
      mainSize = Math.min(100, Math.max(40, W * 0.07));
      mainY = H * 0.44;
      subSize = Math.min(15, Math.max(12, W * 0.012));
      subY = mainY + mainSize * 0.55 + 24;
      creditSize = Math.max(10, subSize * 0.75);
      creditY = subY + subSize + 20;

      // Offscreen canvas to sample pixel positions for particles
      const offCanvas = document.createElement('canvas');
      offCanvas.width = Math.floor(W * dpr);
      offCanvas.height = Math.floor(H * dpr);
      const offCtx = offCanvas.getContext('2d')!;
      offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      offCtx.font = `600 ${mainSize}px "Playfair Display", "Georgia", serif`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillStyle = '#000';
      offCtx.fillText('THE LEVEL STUDIO', W / 2, mainY);

      offCtx.font = `500 ${subSize}px "Geist", "Helvetica Neue", "Arial", sans-serif`;
      offCtx.fillText('Events crafted to be remembered.', W / 2, subY);

      offCtx.font = `400 ${creditSize}px "Geist", "Helvetica Neue", "Arial", sans-serif`;
      offCtx.fillStyle = '#888';
      offCtx.fillText('Evan Chang', W / 2, creditY);

      const imgData = offCtx.getImageData(0, 0, Math.floor(W * dpr), Math.floor(H * dpr));
      const data = imgData.data;
      const canvasW = Math.floor(W * dpr);

      particles = [];
      for (let y = 0; y < H; y += GAP) {
        for (let x = 0; x < W; x += GAP) {
          const px = Math.floor(x * dpr);
          const py = Math.floor(y * dpr);
          const i = (py * canvasW + px) * 4;
          if (data[i + 3] > 60) {
            particles.push({
              tx: x, ty: y,
              x, y, // start at home (no scatter — text is solid from start)
              vx: 0, vy: 0,
              size: 0.8 + Math.random() * 0.4,
            });
          }
        }
      }

      setReady(true);
    }

    function drawSolidText() {
      // Title
      ctx!.font = `600 ${mainSize}px "Playfair Display", "Georgia", serif`;
      ctx!.textAlign = 'center';
      ctx!.textBaseline = 'middle';
      ctx!.fillStyle = '#000';
      ctx!.fillText('THE LEVEL STUDIO', W / 2, mainY);

      // Subtitle
      ctx!.font = `500 ${subSize}px "Geist", "Helvetica Neue", "Arial", sans-serif`;
      ctx!.fillStyle = '#000';
      ctx!.fillText('Events crafted to be remembered.', W / 2, subY);

      // Credit
      ctx!.font = `400 ${creditSize}px "Geist", "Helvetica Neue", "Arial", sans-serif`;
      ctx!.fillStyle = '#888';
      ctx!.fillText('Evan Chang', W / 2, creditY);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function draw() {
      if (!running) return;
      ctx!.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // ── Pass 1: solid text ──
      drawSolidText();

      // ── Pass 2: erase circular zone around cursor ──
      const onScreen = mx > -100 && mx < W + 100 && my > -100 && my < H + 100;
      if (onScreen) {
        ctx!.globalCompositeOperation = 'destination-out';
        const eraseGrad = ctx!.createRadialGradient(mx, my, 0, mx, my, CURSOR_RADIUS);
        eraseGrad.addColorStop(0, 'rgba(0,0,0,1)');
        eraseGrad.addColorStop(0.75, 'rgba(0,0,0,1)');
        eraseGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx!.fillStyle = eraseGrad;
        ctx!.beginPath();
        ctx!.arc(mx, my, CURSOR_RADIUS, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.globalCompositeOperation = 'source-over';
      }

      // ── Pass 3: particles near cursor only ──
      const threshold = CURSOR_RADIUS * 1.5;
      for (const p of particles) {
        // Only process particles near cursor
        const dtx = p.tx - mx;
        const dty = p.ty - my;
        const distToTarget = Math.sqrt(dtx * dtx + dty * dty);
        if (distToTarget > threshold) {
          // Reset far-away particles to home instantly
          p.x = p.tx;
          p.y = p.ty;
          p.vx = 0;
          p.vy = 0;
          continue;
        }

        // Cursor repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CURSOR_RADIUS && dist > 0) {
          const force = (1 - dist / CURSOR_RADIUS) * CURSOR_FORCE;
          p.vx += (dx / dist) * force * 0.1;
          p.vy += (dy / dist) * force * 0.1;
        }

        // Spring back to target
        p.vx += (p.tx - p.x) * 0.06;
        p.vy += (p.ty - p.y) * 0.06;
        p.vx *= 0.82;
        p.vy *= 0.82;
        p.x += p.vx;
        p.y += p.vy;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = '#000';
        ctx!.fill();
      }

      rafId = requestAnimationFrame(draw);
    }

    resize();
    document.fonts.ready.then(() => {
      sampleText();
      canvas!.addEventListener('mousemove', onMouseMove);
      rafId = requestAnimationFrame(draw);
    });

    const ro = new ResizeObserver(() => {
      resize();
      document.fonts.ready.then(() => sampleText());
    });
    ro.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('mousemove', onMouseMove);
      ro.disconnect();
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] -mt-14 flex items-center justify-center overflow-hidden"
      style={{ background: 'transparent' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 10 }} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 2.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
      >
        <span style={{ fontSize: '9px', letterSpacing: '0.3em', color: '#A8A8A3', fontFamily: 'var(--font-departure-mono), monospace', textTransform: 'uppercase' }}>
          Scroll to descend
        </span>
        <motion.span className="block w-px h-6" style={{ background: '#A8A8A3', opacity: 0.5 }} />
        <motion.span className="block w-1 h-1 rounded-full" style={{ background: '#A8A8A3' }} animate={{ y: [0, 8, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} />
      </motion.div>
    </section>
  );
}
