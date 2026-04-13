'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UniversePhase } from '@/components/shared/UniverseCanvas';

// ── Cockpit starfield + warp ──
function CockpitCanvas({ phase }: { phase: 'boot' | 'ready' | 'warp' | 'done' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0, dpr = 1, rafId = 0, running = true;
    const STAR_COUNT = 1400;
    interface Star {
      x: number; y: number; z: number;
      size: number; brightness: number;
      twinklePhase: number; twinkleSpeed: number;
      vx: number; vy: number;
    }
    const stars: Star[] = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas!.clientWidth;
      H = canvas!.clientHeight;
      canvas!.width = Math.floor(W * dpr);
      canvas!.height = Math.floor(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn(farOnly = false): Star {
      return {
        x: Math.random(), y: Math.random(),
        z: farOnly ? (1.2 + Math.random() * 0.8) : (0.15 + Math.random() * 1.85),
        size: Math.random() < 0.05 ? (2.5 + Math.random() * 3) : (0.3 + Math.random() * 1.8),
        brightness: 0.1 + Math.random() * 0.9,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.001 + Math.random() * 0.005,
        vx: (Math.random() - 0.5) * 0.0001,
        vy: (Math.random() - 0.5) * 0.0001,
      };
    }

    resize();
    for (let i = 0; i < STAR_COUNT; i++) stars.push(spawn());

    let time = 0;
    let warpStartTime = 0;

    function draw() {
      if (!running) return;
      time += 16;
      const p = phaseRef.current;
      const isWarping = p === 'warp';

      ctx!.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      const fov = Math.max(W, H) * 0.55;

      // ── Nebula clouds — vivid, multi-color ──
      if (!isWarping) {
        const clouds = [
          { x: 0.25, y: 0.35, r: 0.18, color: [79, 70, 229], a: 0.22 },
          { x: 0.7, y: 0.25, r: 0.15, color: [60, 150, 170], a: 0.18 },
          { x: 0.85, y: 0.65, r: 0.16, color: [180, 100, 150], a: 0.18 },
          { x: 0.4, y: 0.75, r: 0.18, color: [120, 60, 170], a: 0.15 },
          { x: 0.12, y: 0.55, r: 0.12, color: [100, 90, 200], a: 0.15 },
        ];
        for (const c of clouds) {
          const px = c.x * W, py = c.y * H;
          const radius = c.r * Math.max(W, H);
          const drift = Math.sin(time * 0.0002 + c.x * 10) * 15;
          const grad = ctx!.createRadialGradient(px + drift, py, 0, px + drift, py, radius);
          grad.addColorStop(0, `rgba(${c.color[0]},${c.color[1]},${c.color[2]},${c.a})`);
          grad.addColorStop(0.3, `rgba(${c.color[0]},${c.color[1]},${c.color[2]},${c.a * 0.7})`);
          grad.addColorStop(0.7, `rgba(${c.color[0]},${c.color[1]},${c.color[2]},${c.a * 0.2})`);
          grad.addColorStop(1, 'transparent');
          ctx!.fillStyle = grad;
          ctx!.fillRect(0, 0, W, H);
        }

        // ── Planet — warm tones, pulsing glow ──
        const p1x = W * 0.68, p1y = H * 0.52;
        const p1r = Math.min(W, H) * 0.07;
        const pulse = 0.85 + Math.sin(time * 0.0008) * 0.15;

        // Outer glow halo (pulsing)
        const haloR = p1r * (2.5 + Math.sin(time * 0.001) * 0.5);
        const haloGrad = ctx!.createRadialGradient(p1x, p1y, p1r * 0.8, p1x, p1y, haloR);
        haloGrad.addColorStop(0, `rgba(180,130,200,${0.06 * pulse})`);
        haloGrad.addColorStop(0.5, `rgba(140,100,180,${0.03 * pulse})`);
        haloGrad.addColorStop(1, 'transparent');
        ctx!.fillStyle = haloGrad;
        ctx!.fillRect(p1x - haloR, p1y - haloR, haloR * 2, haloR * 2);

        // Body — warm gradient (amber → purple)
        const bodyGrad = ctx!.createRadialGradient(p1x - p1r * 0.35, p1y - p1r * 0.35, 0, p1x, p1y, p1r);
        bodyGrad.addColorStop(0, `rgba(200,170,220,${0.35 * pulse})`);
        bodyGrad.addColorStop(0.4, `rgba(160,120,190,${0.25 * pulse})`);
        bodyGrad.addColorStop(0.75, `rgba(100,70,160,${0.2 * pulse})`);
        bodyGrad.addColorStop(1, `rgba(60,40,120,${0.1 * pulse})`);
        ctx!.fillStyle = bodyGrad;
        ctx!.beginPath();
        ctx!.arc(p1x, p1y, p1r, 0, Math.PI * 2);
        ctx!.fill();
        // Edge
        ctx!.strokeStyle = 'rgba(79,70,229,0.15)';
        ctx!.lineWidth = 1;
        ctx!.stroke();
        // Surface bands
        ctx!.save();
        ctx!.beginPath();
        ctx!.arc(p1x, p1y, p1r - 1, 0, Math.PI * 2);
        ctx!.clip();
        const rot = time * 0.00003;
        for (let b = -3; b <= 3; b++) {
          const by = p1y + b * p1r * 0.22;
          ctx!.strokeStyle = `rgba(79,70,229,${0.04 + Math.abs(b) * 0.008})`;
          ctx!.lineWidth = p1r * 0.06;
          ctx!.beginPath();
          ctx!.moveTo(p1x - p1r, by + Math.sin(rot + b) * 2);
          ctx!.lineTo(p1x + p1r, by + Math.sin(rot + b + 1) * 2);
          ctx!.stroke();
        }
        ctx!.restore();
        // Rings
        ctx!.save();
        ctx!.translate(p1x, p1y);
        ctx!.rotate(0.15); // slight tilt
        ctx!.scale(1, 0.28);
        for (let ring = 0; ring < 3; ring++) {
          const rr = p1r * (1.35 + ring * 0.18);
          ctx!.strokeStyle = `rgba(130,120,200,${0.08 - ring * 0.02})`;
          ctx!.lineWidth = p1r * 0.05;
          ctx!.beginPath();
          ctx!.arc(0, 0, rr, 0, Math.PI * 2);
          ctx!.stroke();
        }
        ctx!.restore();

        // Small planet
        const p2x = W * 0.3, p2y = H * 0.75, p2r = Math.min(W, H) * 0.04;
        const p2g = ctx!.createRadialGradient(p2x - p2r * 0.3, p2y - p2r * 0.3, 0, p2x, p2y, p2r);
        p2g.addColorStop(0, 'rgba(140,130,200,0.25)');
        p2g.addColorStop(0.7, 'rgba(100,90,170,0.12)');
        p2g.addColorStop(1, 'rgba(60,50,120,0.04)');
        ctx!.fillStyle = p2g;
        ctx!.beginPath();
        ctx!.arc(p2x, p2y, p2r, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.strokeStyle = 'rgba(79,70,229,0.1)';
        ctx!.lineWidth = 0.5;
        ctx!.stroke();
        // Halo
        const p2h = ctx!.createRadialGradient(p2x, p2y, p2r, p2x, p2y, p2r * 3);
        p2h.addColorStop(0, 'rgba(120,110,200,0.05)');
        p2h.addColorStop(1, 'transparent');
        ctx!.fillStyle = p2h;
        ctx!.fillRect(p2x - p2r * 3, p2y - p2r * 3, p2r * 6, p2r * 6);

        // Pulsing star
        const stPulse = 0.6 + Math.sin(time * 0.002) * 0.4;
        const stX = W * 0.55, stY = H * 0.3, stR = 2 * stPulse;
        ctx!.beginPath();
        ctx!.arc(stX, stY, stR, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(200,190,255,${0.3 * stPulse})`;
        ctx!.fill();
        const fl = 12 * stPulse;
        ctx!.strokeStyle = `rgba(160,150,230,${0.12 * stPulse})`;
        ctx!.lineWidth = 0.8;
        ctx!.beginPath();
        ctx!.moveTo(stX - fl, stY); ctx!.lineTo(stX + fl, stY);
        ctx!.moveTo(stX, stY - fl); ctx!.lineTo(stX, stY + fl);
        ctx!.stroke();
      }

      // ── Warp ──
      let warpProgress = 0, warpSpeed = 0;
      if (isWarping) {
        if (warpStartTime === 0) warpStartTime = time;
        warpProgress = Math.min(1, (time - warpStartTime) / 1600);
        if (warpProgress < 0.25) warpSpeed = (warpProgress / 0.25) * 0.09;
        else if (warpProgress < 0.65) warpSpeed = 0.09;
        else warpSpeed = 0.09 * (1 - (warpProgress - 0.65) / 0.35 * 0.5);
      }

      // ── Stars ──
      for (const s of stars) {
        if (isWarping) {
          s.z -= warpSpeed;
          if (s.z <= 0.02) { Object.assign(s, spawn(true)); continue; }
          const scale = fov / s.z;
          const sx = cx + (s.x - 0.5) * 2 * scale;
          const sy = cy + (s.y - 0.5) * 2 * scale;
          const trailLen = Math.min(warpSpeed * 4, s.z);
          const prevScale = fov / (s.z + trailLen);
          const psx = cx + (s.x - 0.5) * 2 * prevScale;
          const psy = cy + (s.y - 0.5) * 2 * prevScale;
          if (sx < -100 || sx > W + 100 || sy < -100 || sy > H + 100) {
            Object.assign(s, spawn(true)); continue;
          }
          const depth = Math.min(1, (1 - s.z / 2) * 1.8);
          const alpha = depth * s.brightness * (0.5 + (1 - warpProgress) * 0.4);
          ctx!.strokeStyle = `rgba(20,20,30,${alpha})`;
          ctx!.lineWidth = Math.max(0.5, depth * s.size * 2);
          ctx!.beginPath();
          ctx!.moveTo(psx, psy);
          ctx!.lineTo(sx, sy);
          ctx!.stroke();
          if (s.size > 3 && depth > 0.4) {
            ctx!.beginPath();
            ctx!.arc(sx, sy, ctx!.lineWidth * 1.8, 0, Math.PI * 2);
            ctx!.fillStyle = `rgba(79,70,229,${alpha * 0.4})`;
            ctx!.fill();
          }
        } else {
          s.x += s.vx; s.y += s.vy;
          if (s.x < -0.02) s.x = 1.02; if (s.x > 1.02) s.x = -0.02;
          if (s.y < -0.02) s.y = 1.02; if (s.y > 1.02) s.y = -0.02;
          const tw = Math.sin(time * s.twinkleSpeed + s.twinklePhase);
          const alpha = s.brightness * (0.12 + tw * 0.12);
          if (alpha < 0.01) continue;
          const px = s.x * W, py = s.y * H;
          ctx!.beginPath();
          ctx!.arc(px, py, Math.max(0.3, s.size * (0.85 + tw * 0.15)), 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(30,30,40,${alpha})`;
          ctx!.fill();
          if (s.size > 3.5 && alpha > 0.12) {
            const sl = s.size * 3;
            ctx!.strokeStyle = `rgba(79,70,229,${alpha * 0.3})`;
            ctx!.lineWidth = 0.4;
            ctx!.beginPath();
            ctx!.moveTo(px - sl, py); ctx!.lineTo(px + sl, py);
            ctx!.moveTo(px, py - sl); ctx!.lineTo(px, py + sl);
            ctx!.stroke();
          }
        }
      }

      // ── Warp white flash at end ──
      if (isWarping && warpProgress > 0.7) {
        const flashAlpha = Math.min(1, (warpProgress - 0.7) / 0.3);
        ctx!.fillStyle = `rgba(250,250,248,${flashAlpha})`;
        ctx!.fillRect(0, 0, W, H);
      }

      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
    return () => { running = false; cancelAnimationFrame(rafId); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />;
}

// ── Boot lines ──
const BOOT_LINES = [
  { text: 'WELCOME, PILOT', style: 'header' as const },
  { text: 'SYNCING PORTFOLIO DATA ....... OK', style: 'line' as const },
  { text: 'LOADING MISSION ARCHIVES ..... OK', style: 'line' as const },
  { text: 'MAPPING COORDINATES .......... LOCK', style: 'line' as const },
  { text: 'ESTABLISHING SECURE LINK ..... OK', style: 'line' as const },
  { text: 'MISSION PARAMETERS SET', style: 'line' as const },
];

const MODULES = [
  { id: 'WORK', label: 'Portfolio' },
  { id: 'ABOUT', label: 'Profile' },
  { id: 'CONTACT', label: 'Comms' },
  { id: 'BLOG', label: 'Intel' },
  { id: 'SVC', label: 'Services' },
];

// Colors: solid panels, indigo accent
const C = {
  accent: 'rgba(79,70,229,',
  text: 'rgba(30,30,40,',
  border: 'rgba(79,70,229,0.2)',
  panelBg: 'rgba(240,238,245,1)',
  ok: 'rgba(34,197,94,',
};

interface Props {
  onPhaseChange: (phase: UniversePhase) => void;
  onComplete: () => void;
}

export default function LoadingOverlay({ onPhaseChange, onComplete }: Props) {
  const [visible, setVisible] = useState(true);
  const [bootIdx, setBootIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'boot' | 'ready' | 'warp' | 'done'>('boot');
  const [exploding, setExploding] = useState(false);

  useEffect(() => {
    onPhaseChange('loading');
    const timers = [
      setTimeout(() => setPhase('ready'), 3600),
      setTimeout(() => setExploding(true), 4000),     // text explodes
      setTimeout(() => { setPhase('warp'); onPhaseChange('warp'); }, 4600), // warp after explosion
      setTimeout(() => { setPhase('done'); setVisible(false); onPhaseChange('ambient'); onComplete(); }, 6200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onPhaseChange, onComplete]);

  useEffect(() => {
    if (phase === 'done' || bootIdx >= BOOT_LINES.length) return;
    const delay = bootIdx === 0 ? 600 : 420;
    const timer = setTimeout(() => setBootIdx((i) => i + 1), delay);
    return () => clearTimeout(timer);
  }, [phase, bootIdx]);

  useEffect(() => {
    if (phase === 'done') return;
    const target = phase === 'ready' || phase === 'warp' ? 100 : Math.min((bootIdx / BOOT_LINES.length) * 80, 80);
    const timer = setInterval(() => {
      setProgress((p) => {
        const step = phase === 'ready' || phase === 'warp' ? 4 : 1.5;
        return p >= target ? target : Math.min(p + step, target);
      });
    }, 30);
    return () => clearInterval(timer);
  }, [phase, bootIdx]);

  const isWarp = phase === 'warp';
  const mono = 'var(--font-departure-mono), monospace';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[60] overflow-hidden"
          style={{ backgroundColor: '#FAFAF8' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <CockpitCanvas phase={phase} />

          {/* CRT filter */}
          {!isWarp && <CrtOverlay />}

          {/* ── LOGIN — screen center, above everything ── */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 15, pointerEvents: 'none' }}>
            <LoginText progress={progress} exploding={exploding} mono={mono} accent={C.accent} />
          </div>

          {/* ── HUD panels — slide out on warp ── */}
          <div className="absolute inset-0 flex flex-col" style={{ zIndex: 2 }}>
            <div className="flex-1 flex">
              {/* Left panel — slides left */}
              <motion.div
                className="w-[18%] p-2 md:p-3 flex flex-col gap-2"
                animate={isWarp ? { x: '-100%', opacity: 0 } : { x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex-1 border rounded-sm p-3 flex flex-col items-center justify-center" style={{ borderColor: C.border, background: C.panelBg }}>
                  <GaugeCircle value={progress / 100 * 0.78} />
                  <p style={{ fontFamily: mono, fontSize: '7px', color: `${C.accent}0.6)`, marginTop: 4, letterSpacing: '0.15em' }}>NAV</p>
                  <p style={{ fontFamily: mono, fontSize: '6px', color: `${C.text}0.3)`, marginTop: 2 }}>DEST: WHITE GALAXY</p>
                </div>
                <div className="flex-1 border rounded-sm p-3 flex flex-col items-center justify-center" style={{ borderColor: C.border, background: C.panelBg }}>
                  <GaugeCircle value={progress / 100 * 0.65} size="sm" />
                  <p style={{ fontFamily: mono, fontSize: '7px', color: `${C.accent}0.6)`, marginTop: 4, letterSpacing: '0.15em' }}>SIG</p>
                  <p style={{ fontFamily: mono, fontSize: '6px', color: `${C.text}0.3)`, marginTop: 2 }}>PORTFOLIO SYNC</p>
                </div>
              </motion.div>

              {/* Center windshield */}
              <motion.div
                className="flex-1 p-2 md:p-3 flex flex-col"
                animate={isWarp ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="h-full border rounded-sm relative overflow-hidden flex flex-col" style={{ borderColor: C.border }}>
                  <CornerBrackets />
                  <div className="px-4 py-2 flex justify-between items-start" style={{ background: C.panelBg }}>
                    <div>
                      <p style={{ fontFamily: mono, fontSize: 'clamp(10px,1.1vw,13px)', color: `${C.accent}0.85)`, fontWeight: 'bold' }}>
                        THE LEVEL STUDIO
                      </p>
                      <p style={{ fontFamily: mono, fontSize: '8px', color: `${C.text}0.25)` }}>
                        COCKPIT INTERFACE // v3.0
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontFamily: mono, fontSize: '8px', color: `${C.text}0.3)` }}>SESSION</p>
                      <p style={{ fontFamily: mono, fontSize: '9px', color: `${C.accent}0.5)`, fontVariantNumeric: 'tabular-nums' }}>
                        {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 p-4 md:p-6">
                    {BOOT_LINES.slice(0, bootIdx).map((line, i) => {
                      const isLast = i === bootIdx - 1;
                      const isHeader = line.style === 'header';
                      const hasOK = line.text.includes('OK') || line.text.includes('LOCK');
                      if (isHeader) {
                        return (
                          <motion.p key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-4"
                            style={{ fontFamily: mono, fontSize: 'clamp(14px,1.8vw,22px)', color: `${C.accent}0.9)`, letterSpacing: '0.15em' }}>
                            {line.text}
                          </motion.p>
                        );
                      }
                      return (
                        <motion.p key={i} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }} className="mb-1"
                          style={{ fontFamily: mono, fontSize: 'clamp(9px,1vw,12px)', color: isLast ? `${C.accent}0.8)` : `${C.text}0.25)` }}>
                          {hasOK ? (<>{line.text.replace(/OK|LOCK/, '')}<span style={{ color: `${C.ok}0.85)` }}>{line.text.includes('LOCK') ? 'LOCK' : 'OK'}</span></>) : line.text}
                        </motion.p>
                      );
                    })}
                    {bootIdx < BOOT_LINES.length && bootIdx > 0 && (
                      <motion.span className="inline-block" style={{ width: 6, height: 10, background: `${C.accent}0.6)` }}
                        animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.6, repeat: Infinity }} />
                    )}
                    {phase === 'ready' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                        <p style={{ fontFamily: mono, fontSize: 'clamp(10px,1.1vw,13px)', color: `${C.accent}1)`, letterSpacing: '0.2em' }}>
                          [ LAUNCH SEQUENCE INITIATED ]
                        </p>
                        <p style={{ fontFamily: mono, fontSize: '8px', color: `${C.text}0.3)`, marginTop: 4 }}>
                          DESTINATION: WHITE GALAXY // ETA: WARP JUMP
                        </p>
                      </motion.div>
                    )}
                  </div>

                  <div className="px-4 py-2 flex items-center gap-3" style={{ background: C.panelBg }}>
                    <span style={{ fontFamily: mono, fontSize: '7px', color: `${C.text}0.3)`, letterSpacing: '0.1em' }}>MISSION SYNC</span>
                    <div className="flex-1 flex gap-[2px]">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <div key={i} className="flex-1 h-[5px]" style={{
                          background: i < Math.floor(progress / 100 * 30) ? `${C.accent}0.5)` : `${C.accent}0.06)`,
                        }} />
                      ))}
                    </div>
                    <span style={{ fontFamily: mono, fontSize: '8px', color: `${C.accent}0.5)`, fontVariantNumeric: 'tabular-nums', minWidth: 28, textAlign: 'right' }}>
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Right panel — slides right */}
              <motion.div
                className="w-[18%] p-2 md:p-3 flex flex-col gap-2"
                animate={isWarp ? { x: '100%', opacity: 0 } : { x: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex-1 border rounded-sm p-3" style={{ borderColor: C.border, background: C.panelBg }}>
                  <p style={{ fontFamily: mono, fontSize: '9px', color: `${C.text}0.35)`, marginBottom: 8, letterSpacing: '0.15em' }}>MODULES</p>
                  {MODULES.map((mod, i) => {
                    const active = progress > (i + 1) * 16;
                    return (
                      <div key={mod.id} className="flex items-center gap-2.5 mb-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{
                          background: active ? `${C.ok}0.85)` : `${C.accent}0.08)`,
                          boxShadow: active ? `0 0 6px ${C.ok}0.4)` : 'none',
                        }} />
                        <div>
                          <p style={{ fontFamily: mono, fontSize: '9px', color: active ? `${C.accent}0.7)` : `${C.text}0.2)` }}>{mod.id}</p>
                          <p style={{ fontFamily: mono, fontSize: '7px', color: `${C.text}0.2)` }}>{mod.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            <div className="px-4 md:px-6 pb-2 flex justify-between" style={{ fontFamily: mono, fontSize: '8px', color: `${C.text}0.15)`, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              <span>The Level Studio // Taipei</span>
              <span>25.03°N 121.57°E</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── LOGIN with scramble + floating idle + ENTER GALAXY typewriter + explosion ──
function LoginText({ progress, exploding, mono, accent }: { progress: number; exploding: boolean; mono: string; accent: string }) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
  const [loginText, setLoginText] = useState(() =>
    'LOGIN'.split('').map(() => chars[Math.floor(Math.random() * chars.length)]).join('')
  );
  const [showEnter, setShowEnter] = useState(false);
  const [enterReveal, setEnterReveal] = useState(0); // how many chars of ENTER GALAXY revealed
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Phase 1: scramble-in to "LOGIN"
  useEffect(() => {
    let iter = 0;
    intervalRef.current = setInterval(() => {
      setLoginText(
        'LOGIN'.split('').map((ch, i) => i < iter ? ch : chars[Math.floor(Math.random() * chars.length)]).join('')
      );
      iter += 0.4;
      if (iter >= 5) clearInterval(intervalRef.current);
    }, 60);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Phase 2: when progress=100, fade LOGIN → show ENTER GALAXY typewriter
  useEffect(() => {
    if (progress < 100 || showEnter) return;
    setShowEnter(true);
    let charIdx = 0;
    const enterText = 'ENTER GALAXY';
    const timer = setInterval(() => {
      charIdx++;
      setEnterReveal(charIdx);
      if (charIdx >= enterText.length) clearInterval(timer);
    }, 80); // slow typewriter
    return () => clearInterval(timer);
  }, [progress >= 100, showEnter]);

  const isReady = progress >= 100;
  const enterText = 'ENTER GALAXY';

  return (
    <div className="flex flex-col items-center gap-4">
      {/* LOGIN — with floating idle animation per letter */}
      {!showEnter && (
        <div className="flex justify-center" style={{ gap: '0.05em' }}>
          {loginText.split('').map((ch, i) => (
            <motion.span
              key={i}
              style={{
                fontFamily: mono,
                fontSize: 'clamp(40px, 7vw, 90px)',
                fontWeight: 'bold',
                letterSpacing: '0.35em',
                color: `${accent}0.3)`,
                display: 'inline-block',
              }}
              animate={{
                y: [0, -4, 0, 3, 0],
                opacity: [0.25, 0.35, 0.25],
              }}
              transition={{
                y: { duration: 3 + i * 0.3, repeat: Infinity, ease: 'easeInOut' },
                opacity: { duration: 2 + i * 0.2, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              {ch}
            </motion.span>
          ))}
        </div>
      )}

      {/* ENTER GALAXY — typewriter reveal + explosion */}
      {showEnter && (
        <div className="flex justify-center" style={{ gap: '0.05em' }}>
          {enterText.split('').map((ch, i) => (
            <motion.span
              key={i}
              style={{
                fontFamily: mono,
                fontSize: 'clamp(32px, 5vw, 70px)',
                fontWeight: 'bold',
                letterSpacing: '0.25em',
                color: `${accent}1)`,
                display: 'inline-block',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={exploding ? {
                x: (i - enterText.length / 2) * 50 + (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 600,
                opacity: 0,
                scale: 0.1,
                rotate: (Math.random() - 0.5) * 360,
              } : i < enterReveal ? {
                opacity: 1,
                y: 0,
              } : { opacity: 0, y: 10 }}
              transition={exploding
                ? { duration: 0.6, delay: i * 0.02, ease: 'easeIn' }
                : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
              }
            >
              {ch === ' ' ? '\u00A0' : ch}
            </motion.span>
          ))}
        </div>
      )}

      {/* Underline when ENTER GALAXY fully revealed */}
      {showEnter && enterReveal >= enterText.length && !exploding && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="h-px origin-center"
          style={{ width: 'clamp(120px, 20vw, 300px)', background: `${accent}0.3)` }}
        />
      )}
    </div>
  );
}

// ── CRT overlay ──
function CrtOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 3 }}>
      <div className="absolute inset-0" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(79,70,229,0.015) 2px, rgba(79,70,229,0.015) 4px)',
        mixBlendMode: 'multiply',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 50%, rgba(30,25,60,0.08) 100%)',
      }} />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,255,255,0.04) 0%, transparent 70%)',
      }} />
    </div>
  );
}

function CornerBrackets() {
  const s = { position: 'absolute' as const, width: 14, height: 14, borderColor: 'rgba(79,70,229,0.2)', borderStyle: 'solid' as const, borderWidth: 0 };
  return (<>
    <div style={{ ...s, top: 4, left: 4, borderTopWidth: 1, borderLeftWidth: 1 }} />
    <div style={{ ...s, top: 4, right: 4, borderTopWidth: 1, borderRightWidth: 1 }} />
    <div style={{ ...s, bottom: 4, left: 4, borderBottomWidth: 1, borderLeftWidth: 1 }} />
    <div style={{ ...s, bottom: 4, right: 4, borderBottomWidth: 1, borderRightWidth: 1 }} />
  </>);
}

function GaugeCircle({ value, size = 'md' }: { value: number; size?: 'sm' | 'md' }) {
  const r = size === 'sm' ? 24 : 30;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value * 0.75);
  return (
    <svg width={r * 2 + 8} height={r * 2 + 8} className="transform -rotate-[135deg]">
      <circle cx={r + 4} cy={r + 4} r={r} fill="none" stroke="rgba(79,70,229,0.08)" strokeWidth="2" strokeDasharray={`${circ * 0.75} ${circ * 0.25}`} />
      <circle cx={r + 4} cy={r + 4} r={r} fill="none" stroke="rgba(79,70,229,0.4)" strokeWidth="2" strokeDasharray={`${circ * 0.75} ${circ * 0.25}`} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
    </svg>
  );
}
