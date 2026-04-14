'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  filename?: string;
  initialX: number;
  initialY: number;
  width: number;
  rotate?: number;
  accent?: string;
  zBase?: number;
  children: ReactNode;
}

/**
 * DraggableWindow — macOS-style floating window with drag-by-header.
 *
 * Ichiki profile-widget primitive. Honors pointer: coarse → locks static.
 * Click-to-focus raises z-index above siblings.
 */
export default function DraggableWindow({
  title,
  filename,
  initialX,
  initialY,
  width,
  rotate = 0,
  accent = '#5DD3E3',
  zBase = 10,
  children,
}: Props) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [z, setZ] = useState(zBase);
  const [hidden, setHidden] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; px: number; py: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [canDrag, setCanDrag] = useState(true);

  useEffect(() => {
    // Disable drag on coarse pointers (touch)
    const mq = window.matchMedia('(pointer: fine)');
    setCanDrag(mq.matches);
    const h = () => setCanDrag(mq.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPos({ x: dragRef.current.px + dx, y: dragRef.current.py + dy });
    };
    const onUp = () => {
      setDragging(false);
      dragRef.current = null;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging]);

  if (hidden) return null;

  const startDrag = (e: React.MouseEvent) => {
    if (!canDrag) return;
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startY: e.clientY, px: pos.x, py: pos.y };
    setDragging(true);
    setZ(zBase + 100);
  };

  return (
    <motion.div
      className="absolute"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        left: pos.x,
        top: pos.y,
        width,
        zIndex: z,
        transform: `rotate(${rotate}deg)`,
        background: '#0B1026',
        border: `1px solid rgba(93,211,227,0.3)`,
        boxShadow: dragging
          ? '0 24px 60px rgba(0,0,0,0.6)'
          : '0 12px 40px rgba(0,0,0,0.45)',
        cursor: dragging ? 'grabbing' : 'default',
      }}
      onMouseDown={() => setZ(zBase + 50)}
    >
      {/* Title bar */}
      <div
        onMouseDown={startDrag}
        data-cursor={canDrag ? '⊡ DRAG' : '⊡ WINDOW'}
        data-cursor-variant="link"
        className="flex items-center gap-2 px-2.5 py-1.5 select-none"
        style={{
          borderBottom: '1px solid rgba(250,250,248,0.08)',
          background: 'rgba(93,211,227,0.06)',
          cursor: canDrag ? 'grab' : 'default',
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 9,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
        }}
      >
        {/* Traffic lights */}
        <div className="flex gap-1 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setHidden(true);
            }}
            aria-label="Close window"
            style={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: '#E63E1F',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          />
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(250,250,248,0.2)' }} />
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: accent }} />
        </div>
        <span
          className="flex-1 truncate text-center"
          style={{ color: 'rgba(250,250,248,0.7)', textTransform: 'none', letterSpacing: '0.04em', fontSize: 11 }}
        >
          {title}
        </span>
        {filename && (
          <span className="shrink-0" style={{ color: 'rgba(250,250,248,0.3)' }}>
            {filename}
          </span>
        )}
      </div>

      {/* Body */}
      <div>{children}</div>
    </motion.div>
  );
}
