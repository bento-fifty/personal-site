'use client';

import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';

/**
 * GridRevealRow — true grid-cell decode reveal.
 *
 * Cover layer is an 8×4 grid of 32 ink cells overlaid on content.
 * Cells fade out in pseudo-random order, each cell 120ms fade, 20ms stagger.
 * Total ~700ms. Respects prefers-reduced-motion.
 */

interface Props {
  children: ReactNode;
  className?: string;
  cols?: number;
  rows?: number;
  cellFadeMs?: number;
  staggerMs?: number;
}

function seededShuffle(length: number, seed: number): number[] {
  const arr = Array.from({ length }, (_, i) => i);
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function GridRevealRow({
  children,
  className = '',
  cols = 8,
  rows = 4,
  cellFadeMs = 120,
  staggerMs = 20,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [reduce, setReduce] = useState(false);

  const cellCount = cols * rows;
  const order = useMemo(
    () => seededShuffle(cellCount, (cols * 31 + rows * 17) % 1000),
    [cellCount, cols, rows]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    if (reduce) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {children}
      {!reduce && (
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            zIndex: 10,
          }}
        >
          {Array.from({ length: cellCount }).map((_, i) => (
            <div
              key={i}
              style={{
                background: '#0B1026',
                opacity: revealed ? 0 : 1,
                transition: `opacity ${cellFadeMs}ms ease-out ${order[i] * staggerMs}ms`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
