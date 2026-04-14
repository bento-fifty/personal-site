'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

/**
 * CursorChip — v8 contextual cursor follower.
 *
 * Damped lerp follow (no overshoot). Reads data-cursor attribute from hovered
 * element and shows that text as a chip next to the cursor.
 *
 * Usage: mount once at root. Any element with data-cursor="VIEW · 042" will
 * trigger the chip on hover (pointer: fine devices only).
 */

export default function CursorChip() {
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const x = useSpring(mx, reduce ? { duration: 0 } : { stiffness: 150, damping: 40 });
  const y = useSpring(my, reduce ? { duration: 0 } : { stiffness: 150, damping: 40 });

  useEffect(() => {
    // Skip on touch devices
    if (!window.matchMedia('(pointer: fine)').matches) return;

    function onMove(e: MouseEvent) {
      mx.set(e.clientX + 14);
      my.set(e.clientY + 14);

      const target = e.target as HTMLElement | null;
      if (!target) return;
      const chipTarget = target.closest<HTMLElement>('[data-cursor]');
      if (chipTarget) {
        const text = chipTarget.getAttribute('data-cursor');
        if (text && text !== label) setLabel(text);
        if (!visible) setVisible(true);
      } else if (visible) {
        setVisible(false);
      }
    }

    function onLeave() {
      setVisible(false);
    }

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [label, mx, my, visible]);

  return (
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
            background: 'rgba(10,10,12,0.95)',
            color: '#FAFAF8',
            border: '1px solid #E63E1F',
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
  );
}
