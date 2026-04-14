import { CasePhoto, ClusterLayout } from '@/lib/work-data';

interface Props {
  photos: CasePhoto[];
  layout: ClusterLayout;
  caseId: string;
}

function PlaceholderPhoto({ photo, caseId }: { photo: CasePhoto; caseId: string }) {
  // Parse hue from src URL pattern /api/placeholder/{id}/{aspect}/{hue}
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

export default function PhotoCluster({ photos, layout, caseId }: Props) {
  // 4 layout grammars
  const gridClasses: Record<ClusterLayout, string> = {
    a: 'grid grid-cols-3 grid-rows-2 gap-1 aspect-[3/2]', // wide + 2 small
    b: 'grid grid-cols-2 grid-rows-1 gap-1 aspect-[2/1]', // 2 big side-by-side
    c: 'grid grid-cols-4 grid-rows-2 gap-1 aspect-[4/2]', // portrait + grid detail
    d: 'grid grid-cols-3 grid-rows-1 gap-1 aspect-[3/1]', // triptych
  };

  // Span templates per layout (tailwind doesn't purge dynamic classes, so inline style)
  const spanStyle = (layout: ClusterLayout, idx: number): React.CSSProperties => {
    if (layout === 'a') {
      if (idx === 0) return { gridColumn: '1 / 3', gridRow: '1 / 3' };
      if (idx === 1) return { gridColumn: '3 / 4', gridRow: '1 / 2' };
      if (idx === 2) return { gridColumn: '3 / 4', gridRow: '2 / 3' };
    }
    if (layout === 'b') {
      return {};
    }
    if (layout === 'c') {
      if (idx === 0) return { gridColumn: '1 / 2', gridRow: '1 / 3' };
      if (idx === 1) return { gridColumn: '2 / 4', gridRow: '1 / 2' };
      if (idx === 2) return { gridColumn: '4 / 5', gridRow: '1 / 2' };
      if (idx === 3) return { gridColumn: '2 / 5', gridRow: '2 / 3' };
    }
    if (layout === 'd') {
      return {};
    }
    return {};
  };

  // Cap photos by layout capacity
  const caps: Record<ClusterLayout, number> = { a: 3, b: 2, c: 4, d: 3 };
  const shown = photos.slice(0, caps[layout]);

  return (
    <div className={gridClasses[layout]}>
      {shown.map((p, i) => (
        <div key={`${p.src}-${i}`} style={spanStyle(layout, i)} className="overflow-hidden">
          <PlaceholderPhoto photo={p} caseId={caseId} />
        </div>
      ))}
    </div>
  );
}
