'use client';

import { useRef, useEffect } from 'react';
import { CasePhoto, ClusterLayout } from '@/lib/work-data';

interface Props {
  photos: CasePhoto[];
  layout: ClusterLayout;
  caseId: string;
}

function PlaceholderPhoto({ photo, caseId }: { photo: CasePhoto; caseId: string }) {
  const hueMatch = photo.src.match(/\/(\d+)$/);
  const hue = hueMatch ? parseInt(hueMatch[1], 10) : 15;
  const isPlaceholder = photo.src.startsWith('/api/placeholder/');

  if (!isPlaceholder) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo.src}
        alt={photo.alt}
        className="block w-full h-full object-cover"
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={photo.alt}
      className="w-full h-full relative overflow-hidden flex items-end justify-start p-3"
      style={{
        background: `linear-gradient(135deg, hsl(${hue}, 45%, 18%) 0%, hsl(${hue + 10}, 35%, 10%) 100%)`,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono), monospace',
          fontSize: 9,
          letterSpacing: '0.22em',
          color: 'rgba(250,250,248,0.35)',
          textTransform: 'uppercase',
        }}
      >
        {caseId} · {photo.role}
      </span>
    </div>
  );
}

// Depth per role — used for parallax Magnet-B.
// Higher = moves more with cursor (feels "closer to viewer").
const ROLE_DEPTH: Record<CasePhoto['role'], number> = {
  hero: 1.0,
  detail: 0.55,
  bts: 0.3,
};

export default function PhotoCluster({ photos, layout, caseId }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mq = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
    if (!mq.matches) return;

    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2); // -1..1
      const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      targetRef.current = {
        x: Math.max(-1, Math.min(1, nx)),
        y: Math.max(-1, Math.min(1, ny)),
      };
      if (rafRef.current == null) loop();
    };

    const onLeave = () => {
      targetRef.current = { x: 0, y: 0 };
      if (rafRef.current == null) loop();
    };

    const loop = () => {
      // Damped lerp
      const cx = currentRef.current.x + (targetRef.current.x - currentRef.current.x) * 0.12;
      const cy = currentRef.current.y + (targetRef.current.y - currentRef.current.y) * 0.12;
      currentRef.current = { x: cx, y: cy };

      const MAX_PX = 14;
      cellRefs.current.forEach((el, i) => {
        if (!el) return;
        const depth = ROLE_DEPTH[photos[i]?.role ?? 'detail'] ?? 0.5;
        const tx = -cx * MAX_PX * depth;
        const ty = -cy * MAX_PX * depth;
        el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
      });

      // Continue if not settled
      if (Math.abs(targetRef.current.x - cx) > 0.001 || Math.abs(targetRef.current.y - cy) > 0.001) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        rafRef.current = null;
      }
    };

    root.addEventListener('mousemove', onMove);
    root.addEventListener('mouseleave', onLeave);
    return () => {
      root.removeEventListener('mousemove', onMove);
      root.removeEventListener('mouseleave', onLeave);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [photos]);

  // 4 layout grammars
  const gridClasses: Record<ClusterLayout, string> = {
    a: 'grid grid-cols-3 grid-rows-2 gap-1 aspect-[3/2]',
    b: 'grid grid-cols-2 grid-rows-1 gap-1 aspect-[2/1]',
    c: 'grid grid-cols-4 grid-rows-2 gap-1 aspect-[4/2]',
    d: 'grid grid-cols-3 grid-rows-1 gap-1 aspect-[3/1]',
  };

  const spanStyle = (layout: ClusterLayout, idx: number): React.CSSProperties => {
    if (layout === 'a') {
      if (idx === 0) return { gridColumn: '1 / 3', gridRow: '1 / 3' };
      if (idx === 1) return { gridColumn: '3 / 4', gridRow: '1 / 2' };
      if (idx === 2) return { gridColumn: '3 / 4', gridRow: '2 / 3' };
    }
    if (layout === 'c') {
      if (idx === 0) return { gridColumn: '1 / 2', gridRow: '1 / 3' };
      if (idx === 1) return { gridColumn: '2 / 4', gridRow: '1 / 2' };
      if (idx === 2) return { gridColumn: '4 / 5', gridRow: '1 / 2' };
      if (idx === 3) return { gridColumn: '2 / 5', gridRow: '2 / 3' };
    }
    return {};
  };

  const caps: Record<ClusterLayout, number> = { a: 3, b: 2, c: 4, d: 3 };
  const shown = photos.slice(0, caps[layout]);

  return (
    <div ref={rootRef} className={gridClasses[layout]} style={{ perspective: 800 }}>
      {shown.map((p, i) => (
        <div
          key={`${p.src}-${i}`}
          style={{ ...spanStyle(layout, i), overflow: 'hidden', willChange: 'transform' }}
        >
          <div
            ref={(el) => {
              cellRefs.current[i] = el;
            }}
            className="w-full h-full"
            style={{ transition: 'transform 120ms ease-out', willChange: 'transform' }}
          >
            <PlaceholderPhoto photo={p} caseId={caseId} />
          </div>
        </div>
      ))}
    </div>
  );
}
