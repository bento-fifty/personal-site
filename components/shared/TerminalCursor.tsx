'use client';

import { useEffect, useRef } from 'react';

/**
 * TerminalCursor — tactical reticle + live coord + contextual action label.
 *
 * Polish pass: on hover of interactive elements the reticle doesn't just
 * glow cyan, it also shows a bracketed action hint next to the coord
 * readout — `[CLICK]`, `[OPEN]`, `[OPEN CASE]`, `[TYPE]`, `[SELECT]` —
 * and the reticle scales up with a pulse ring. Gives the cursor real
 * interactive feedback instead of being a decorative halo.
 *
 * - Touch devices: hidden entirely
 * - Respects prefers-reduced-motion (static at last mouse pos)
 * - Writes transform + textContent directly to avoid React renders
 */
export default function TerminalCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLSpanElement>(null);
  const linesRef = useRef<HTMLSpanElement[]>([]);
  const cornersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const label = labelRef.current;
    const pulse = pulseRef.current;
    if (!wrap || !label || !pulse) return;

    if (window.matchMedia('(pointer: coarse)').matches) {
      wrap.style.display = 'none';
      return;
    }

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const COLOR_IDLE = 'rgba(255, 255, 255, 0.62)';
    const COLOR_HOT  = '#5CE1FF';
    const SHADOW_IDLE = '0 0 4px rgba(0,0,0,0.75)';
    const SHADOW_HOT  = '0 0 10px rgba(92,225,255,0.95)';

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let visible = false;
    let hot = false;
    let hotAction: string | null = null;
    let rafId = 0;
    let lastLabelTs = 0;

    function setHot(v: boolean) {
      if (v === hot) return;
      hot = v;
      const color  = v ? COLOR_HOT  : COLOR_IDLE;
      const shadow = v ? SHADOW_HOT : SHADOW_IDLE;
      for (const s of linesRef.current) {
        if (!s) continue;
        s.style.background = color;
        s.style.boxShadow  = shadow;
      }
      for (const c of cornersRef.current) {
        if (!c) continue;
        c.style.borderColor = color;
        c.style.boxShadow   = shadow;
      }
      if (pulse) {
        pulse.style.opacity   = v ? '1' : '0';
        pulse.style.transform = v ? 'scale(1.4)' : 'scale(0.5)';
      }
      if (label) {
        label.style.color = v ? '#5CE1FF' : 'rgba(255,255,255,0.55)';
      }
    }

    function resolveAction(interactive: HTMLElement): string {
      const tag = interactive.tagName.toLowerCase();
      if (tag === 'a') {
        const href = (interactive as HTMLAnchorElement).getAttribute('href') || '';
        if (href.includes('/work/')) return 'OPEN CASE';
        if (href.includes('/contact')) return 'CONTACT';
        if (href.startsWith('mailto:')) return 'EMAIL';
        if (href.startsWith('tel:'))    return 'CALL';
        return 'OPEN';
      }
      if (tag === 'button') return 'CLICK';
      if (tag === 'input' || tag === 'textarea') return 'TYPE';
      return 'SELECT';
    }

    function onMove(e: MouseEvent) {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        visible = true;
        wrap!.style.opacity = '1';
      }
    }
    function onLeave() {
      visible = false;
      wrap!.style.opacity = '0';
    }
    function onOver(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest?.(
        'a, button, [role="button"], input, textarea, select',
      ) as HTMLElement | null;
      const scanTarget = target?.closest?.(
        '[data-scan-target="true"]',
      ) as HTMLElement | null;
      if (interactive) {
        hotAction = resolveAction(interactive);
        setHot(true);
      } else if (scanTarget) {
        // Hovering the hero headline — reticle enters SCAN mode
        hotAction = 'SCAN TEXT';
        setHot(true);
      } else {
        hotAction = null;
        setHot(false);
      }
    }

    function frame(ts: number) {
      if (prefersReduced) {
        x = tx;
        y = ty;
      } else {
        x += (tx - x) * 0.28;
        y += (ty - y) * 0.28;
      }
      wrap!.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      if (ts - lastLabelTs > 55) {
        const coord = `X:${Math.round(x).toString().padStart(4, '0')}  Y:${Math.round(y).toString().padStart(4, '0')}`;
        label!.textContent = hot && hotAction
          ? `[ ${hotAction} ]  ${coord}`
          : coord;
        lastLabelTs = ts;
      }
      rafId = requestAnimationFrame(frame);
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseover', onOver, { passive: true });
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseover', onOver);
    };
  }, []);

  const lineBase: React.CSSProperties = {
    position:   'absolute',
    background: 'rgba(255,255,255,0.62)',
    boxShadow:  '0 0 4px rgba(0,0,0,0.75)',
    transition: 'background 180ms linear, box-shadow 180ms linear',
  };
  const cornerOffset = 22;
  const cornerSize = 5;

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[60] opacity-0 transition-opacity duration-200"
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Pulse ring (appears on hot) */}
      <span
        ref={pulseRef}
        aria-hidden
        style={{
          position:     'absolute',
          width:        '56px',
          height:       '56px',
          left:         '-28px',
          top:          '-28px',
          borderRadius: '50%',
          border:       '1px solid rgba(92,225,255,0.4)',
          boxShadow:    '0 0 14px rgba(92,225,255,0.35), inset 0 0 10px rgba(92,225,255,0.2)',
          opacity:      0,
          transform:    'scale(0.5)',
          transition:   'opacity 220ms linear, transform 220ms cubic-bezier(0.22,1,0.36,1)',
        }}
      />

      {/* Horizontal crosshair — 2 dashes */}
      <span
        ref={(el) => {
          if (el) linesRef.current[0] = el;
        }}
        style={{ ...lineBase, width: '14px', height: '1px', left: '-20px', top: '-0.5px' }}
      />
      <span
        ref={(el) => {
          if (el) linesRef.current[1] = el;
        }}
        style={{ ...lineBase, width: '14px', height: '1px', left: '6px', top: '-0.5px' }}
      />
      {/* Vertical crosshair */}
      <span
        ref={(el) => {
          if (el) linesRef.current[2] = el;
        }}
        style={{ ...lineBase, width: '1px', height: '14px', left: '-0.5px', top: '-20px' }}
      />
      <span
        ref={(el) => {
          if (el) linesRef.current[3] = el;
        }}
        style={{ ...lineBase, width: '1px', height: '14px', left: '-0.5px', top: '6px' }}
      />
      {/* Corner brackets */}
      {(['tl', 'tr', 'bl', 'br'] as const).map((corner, i) => {
        const style: React.CSSProperties = {
          position:    'absolute',
          width:       `${cornerSize}px`,
          height:      `${cornerSize}px`,
          borderColor: 'rgba(255,255,255,0.62)',
          boxShadow:   '0 0 4px rgba(0,0,0,0.75)',
          transition:  'border-color 180ms linear, box-shadow 180ms linear',
        };
        if (corner.includes('t')) {
          style.top = `-${cornerOffset}px`;
          style.borderTopWidth = '1px';
          style.borderTopStyle = 'solid';
        } else {
          style.bottom = `-${cornerOffset}px`;
          style.borderBottomWidth = '1px';
          style.borderBottomStyle = 'solid';
        }
        if (corner.includes('l')) {
          style.left = `-${cornerOffset}px`;
          style.borderLeftWidth = '1px';
          style.borderLeftStyle = 'solid';
        } else {
          style.right = `-${cornerOffset}px`;
          style.borderRightWidth = '1px';
          style.borderRightStyle = 'solid';
        }
        return (
          <span
            key={corner}
            ref={(el) => {
              if (el) cornersRef.current[i] = el;
            }}
            style={style}
          />
        );
      })}
      {/* Coord + action label */}
      <div
        ref={labelRef}
        className="font-label absolute text-white/55 whitespace-nowrap tabular-nums"
        style={{
          left:          '24px',
          top:           '18px',
          fontSize:      '9px',
          letterSpacing: '0.14em',
          textShadow:    '0 0 6px rgba(0,0,0,0.85)',
          transition:    'color 180ms linear',
        }}
      >
        X:0000  Y:0000
      </div>
    </div>
  );
}
