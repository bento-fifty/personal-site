'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * RouteTransition — grid-cell overlay for internal route changes.
 *
 * Flow: covering (cells fade in staggered) → push route → revealing (cells fade out).
 * Intercepts same-origin anchor clicks globally. Honors prefers-reduced-motion
 * and bypasses modifier-keyed clicks / target=_blank / external hrefs.
 */

type Phase = 'idle' | 'covering' | 'covered' | 'revealing';

const COLS = 12;
const ROWS = 8;
const CELL_COUNT = COLS * ROWS;
const CELL_FADE_MS = 60;
const STAGGER_MS = 5;
const COVER_HOLD_MS = CELL_COUNT * STAGGER_MS + CELL_FADE_MS; // ~762ms

function seededShuffle(seed: number): number[] {
  const arr = Array.from({ length: CELL_COUNT }, (_, i) => i);
  let state = seed;
  const rand = () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface Ctx {
  navigate: (href: string) => void;
  active: boolean;
}
const RouteTransitionCtx = createContext<Ctx>({ navigate: () => {}, active: false });
export const useRouteTransition = () => useContext(RouteTransitionCtx);

export default function RouteTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>('idle');
  const pendingHrefRef = useRef<string | null>(null);
  const prefersReduced = useRef(false);

  // Per-cell order (stable across renders)
  const cellDelays = useMemo(() => {
    const order = seededShuffle(42);
    // order[cellIndex] = fireSlot → delay = fireSlot * STAGGER_MS
    const delays = new Array(CELL_COUNT);
    for (let cellIdx = 0; cellIdx < CELL_COUNT; cellIdx++) {
      delays[cellIdx] = order.indexOf(cellIdx) * STAGGER_MS;
    }
    return delays;
  }, []);

  useEffect(() => {
    prefersReduced.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const navigate = useCallback(
    (href: string) => {
      if (phase !== 'idle') return;
      if (prefersReduced.current) {
        router.push(href);
        return;
      }
      pendingHrefRef.current = href;
      setPhase('covering');
    },
    [phase, router],
  );

  // covering → covered (all cells in) → push route
  useEffect(() => {
    if (phase !== 'covering') return;
    const t = setTimeout(() => {
      setPhase('covered');
      if (pendingHrefRef.current) router.push(pendingHrefRef.current);
    }, COVER_HOLD_MS);
    return () => clearTimeout(t);
  }, [phase, router]);

  // covered → revealing once pathname catches up
  useEffect(() => {
    if (phase !== 'covered') return;
    if (!pendingHrefRef.current) return;
    // pathname contains locale prefix; check suffix match
    if (pathname && pendingHrefRef.current.endsWith(pathname.replace(/^\/[^/]+/, ''))) {
      // matched target route — reveal
      const rid = requestAnimationFrame(() => setPhase('revealing'));
      return () => cancelAnimationFrame(rid);
    }
    // fallback: reveal after a short timeout even if pathname doesn't match exactly
    const fallback = setTimeout(() => setPhase('revealing'), 300);
    return () => clearTimeout(fallback);
  }, [phase, pathname]);

  // revealing → idle
  useEffect(() => {
    if (phase !== 'revealing') return;
    const t = setTimeout(() => {
      setPhase('idle');
      pendingHrefRef.current = null;
    }, COVER_HOLD_MS);
    return () => clearTimeout(t);
  }, [phase]);

  // Global anchor click interceptor
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      let node = e.target as HTMLElement | null;
      while (node && node.tagName !== 'A') node = node.parentElement;
      if (!node) return;

      const a = node as HTMLAnchorElement;
      if (a.target && a.target !== '' && a.target !== '_self') return;
      if (a.hasAttribute('download')) return;

      const raw = a.getAttribute('href');
      if (!raw) return;
      if (
        raw.startsWith('#') ||
        raw.startsWith('mailto:') ||
        raw.startsWith('tel:') ||
        /^https?:\/\//i.test(raw)
      ) {
        return;
      }

      // Resolve to pathname
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      e.preventDefault();
      navigate(url.pathname + url.search);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);

  const active = phase !== 'idle';
  const showFilled = phase === 'covering' || phase === 'covered';

  return (
    <RouteTransitionCtx.Provider value={{ navigate, active }}>
      {children}
      {active && (
        <div
          aria-hidden
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 9999,
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          }}
        >
          {Array.from({ length: CELL_COUNT }).map((_, i) => (
            <div
              key={i}
              style={{
                background: '#000',
                borderRight: '1px solid rgba(93,211,227,0.18)',
                borderBottom: '1px solid rgba(93,211,227,0.18)',
                opacity: showFilled ? 1 : 0,
                transition: `opacity ${CELL_FADE_MS}ms linear ${cellDelays[i]}ms`,
              }}
            />
          ))}
        </div>
      )}
    </RouteTransitionCtx.Provider>
  );
}
