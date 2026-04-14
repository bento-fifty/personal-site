'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

/**
 * CursorChip — v8 contextual cursor follower, Level 2.
 *
 * Follows cursor with damped lerp (no overshoot). Reads two attributes:
 * - data-cursor="..." → label text
 * - data-cursor-variant="primary | link | action" → border color
 *   - primary → flame (CTA, monogram click zones)
 *   - link    → ice   (archive tiles, external links, menu nav)
 *   - action  → paper (toggles: close, expand, peek)
 *   - default → ice
 *
 * Hidden on touch devices (pointer: coarse).
 * Honors prefers-reduced-motion (instant teleport, no spring).
 */

type Variant = 'primary' | 'link' | 'action';

const BORDER: Record<Variant, string> = {
  primary: '#E63E1F',
  link: '#5DD3E3',
  action: '#FAFAF8',
};

export default function CursorChip() {
  const [label, setLabel] = useState<string | null>(null);
  const [variant, setVariant] = useState<Variant>('link');
  const [visible, setVisible] = useState(false);
  const [crosshairVisible, setCrosshairVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  // Raw cursor position for crosshair (instant, no spring)
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Chip position (damped)
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const x = useSpring(mx, reduce ? { duration: 0 } : { stiffness: 150, damping: 40 });
  const y = useSpring(my, reduce ? { duration: 0 } : { stiffness: 150, damping: 40 });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    function onMove(e: MouseEvent) {
      mx.set(e.clientX + 14);
      my.set(e.clientY + 14);
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      setCoords({ x: e.clientX, y: e.clientY });
      if (!crosshairVisible) setCrosshairVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;
      const chipTarget = target.closest<HTMLElement>('[data-cursor]');
      if (chipTarget) {
        const text = chipTarget.getAttribute('data-cursor');
        const v = (chipTarget.getAttribute('data-cursor-variant') as Variant | null) || 'link';
        if (text && text !== label) setLabel(text);
        if (v !== variant) setVariant(v);
        if (!visible) setVisible(true);
      } else if (visible) {
        setVisible(false);
      }
    }

    function onLeave() {
      setVisible(false);
      setCrosshairVisible(false);
    }

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [label, variant, mx, my, rawX, rawY, visible, crosshairVisible]);

  return (
    <>
      {/* Crosshair — horizontal + vertical guide lines at cursor */}
      <div
        aria-hidden
        className="fixed pointer-events-none z-[190] hidden md:block"
        style={{
          left: 0,
          top: coords.y,
          width: '100vw',
          height: 1,
          background: 'rgba(93,211,227,0.18)',
          opacity: crosshairVisible ? 1 : 0,
          transition: 'opacity 200ms ease-out',
          transform: 'translateZ(0)',
        }}
      />
      <div
        aria-hidden
        className="fixed pointer-events-none z-[190] hidden md:block"
        style={{
          left: coords.x,
          top: 0,
          width: 1,
          height: '100vh',
          background: 'rgba(93,211,227,0.18)',
          opacity: crosshairVisible ? 1 : 0,
          transition: 'opacity 200ms ease-out',
          transform: 'translateZ(0)',
        }}
      />
      {/* Chip */}
      <motion.div
        aria-hidden
        className="fixed pointer-events-none z-[200] hidden md:block"
        style={{
          left: 0,
          top: 0,
          x,
          y,
          opacity: visible ? 1 : 0,
          transition: 'opacity 200ms ease-out',
        }}
      >
        {label && (
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(11,16,38,0.95)',
              color: '#FAFAF8',
              border: `1px solid ${BORDER[variant]}`,
              padding: '4px 8px',
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </span>
        )}
      </motion.div>
    </>
  );
}
