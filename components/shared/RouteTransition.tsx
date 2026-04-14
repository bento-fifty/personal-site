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
import { motion, AnimatePresence } from 'framer-motion';
import NextLink from 'next/link';
import type { ComponentProps } from 'react';

/**
 * RouteTransition — grid-cell overlay for internal route changes.
 *
 * Flow: covering (cells fade in staggered) → push route → revealing (cells fade out).
 * Intercepts same-origin anchor clicks globally. Honors prefers-reduced-motion
 * and bypasses modifier-keyed clicks / target=_blank / external hrefs.
 *
 * Why framer-motion: raw CSS transitions don't fire on initial mount because
 * React commits the overlay + cells already at target opacity. framer's
 * `initial` + `animate` guarantees cells start at 0 and animate to 1 on mount.
 */

type Phase = 'idle' | 'covering' | 'covered' | 'revealing';

const COLS = 8;
const ROWS = 5;
const CELL_COUNT = COLS * ROWS;
const CELL_FADE_S = 0.08;
const STAGGER_S = 0.007;
const COVER_HOLD_MS = CELL_COUNT * STAGGER_S * 1000 + CELL_FADE_S * 1000; // ~360ms
const MIN_COVERED_MS = 80;
const REVEAL_SAFETY_MS = 800;

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

/**
 * TransitionLink — drop-in <Link> replacement that runs through RouteTransition.
 *
 * Why: document-level click interception races <Link>'s React-delegated onClick
 * in some scenarios. Explicit onClick preventDefault + navigate() removes the
 * race entirely. Use this wherever you want a grid transition.
 */
export function TransitionLink(
  props: ComponentProps<typeof NextLink>,
) {
  const { navigate } = useRouteTransition();
  const { href, onClick, ...rest } = props;
  return (
    <NextLink
      href={href}
      {...rest}
      onClick={(e) => {
        if (onClick) onClick(e);
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const hrefStr = typeof href === 'string' ? href : null;
        if (!hrefStr) return;
        if (
          hrefStr.startsWith('#') ||
          hrefStr.startsWith('mailto:') ||
          hrefStr.startsWith('tel:') ||
          /^https?:\/\//i.test(hrefStr)
        ) return;
        e.preventDefault();
        navigate(hrefStr);
      }}
    />
  );
}

export default function RouteTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>('idle');
  const pendingHrefRef = useRef<string | null>(null);
  const startPathRef = useRef<string | null>(null);
  const prefersReduced = useRef(false);

  // Per-cell order (stable across renders)
  const cellDelays = useMemo(() => {
    const order = seededShuffle(42);
    const delays = new Array(CELL_COUNT);
    for (let cellIdx = 0; cellIdx < CELL_COUNT; cellIdx++) {
      delays[cellIdx] = order.indexOf(cellIdx) * STAGGER_S;
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
      // NOTE: intentionally NOT bypassing for prefers-reduced-motion.
      // A 1.5s cream cover → reveal is not seizure-risk motion. Users on
      // reduced-motion get the same transition, it just feels like a fade.
      pendingHrefRef.current = href;
      startPathRef.current = pathname;
      setPhase('covering');
    },
    [phase, pathname],
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

  // covered → revealing: wait for both (pathname changed) AND (min hold elapsed)
  useEffect(() => {
    if (phase !== 'covered') return;

    const pathChanged = pathname && pathname !== startPathRef.current;

    if (pathChanged) {
      const t = setTimeout(() => setPhase('revealing'), MIN_COVERED_MS);
      return () => clearTimeout(t);
    }

    const fb = setTimeout(() => setPhase('revealing'), REVEAL_SAFETY_MS);
    return () => clearTimeout(fb);
  }, [phase, pathname]);

  // revealing → idle
  useEffect(() => {
    if (phase !== 'revealing') return;
    const t = setTimeout(() => {
      setPhase('idle');
      pendingHrefRef.current = null;
      startPathRef.current = null;
    }, COVER_HOLD_MS);
    return () => clearTimeout(t);
  }, [phase]);

  // Global anchor click interceptor — CAPTURE phase to beat Link's React onClick
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
      ) return;

      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      e.preventDefault();
      e.stopPropagation();
      navigate(url.pathname + url.search);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [navigate]);

  const active = phase !== 'idle';
  const showFilled = phase === 'covering' || phase === 'covered';

  return (
    <RouteTransitionCtx.Provider value={{ navigate, active }}>
      {children}
      <AnimatePresence>
        {active && (
          <motion.div
            key="route-transition"
            aria-hidden
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 9999,
              display: 'grid',
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            {Array.from({ length: CELL_COUNT }).map((_, i) => (
              <motion.div
                key={i}
                style={{
                  background: '#F0EDE6',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: showFilled ? 1 : 0 }}
                transition={{
                  duration: CELL_FADE_S,
                  delay: cellDelays[i],
                  ease: [0.7, 0, 0.3, 1],
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </RouteTransitionCtx.Provider>
  );
}
