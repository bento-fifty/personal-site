'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import NextLink from 'next/link';
import TransitionShaderCanvas from '@/components/lab/TransitionShaderCanvas';
import { ditherGrid } from '@/components/lab/transitionShaders';

/**
 * RouteTransition — shader-driven dither expand overlay.
 *
 * Uses a WebGL fragment shader with u_progress (0→1→0 sine) and u_origin (uv).
 * Origin mapping by scenario:
 *   forward (list → detail)     click position
 *   back    (detail → list)     viewport center
 *   lateral (section ↔ section) top-right corner
 *   home    (→ /)               viewport center
 */

type Scenario = 'forward' | 'back' | 'lateral' | 'home';

const DURATION = 440; // ms, peak coverage at ~DURATION/2
const SWAP_AT = 0.5; // swap page at peak coverage

interface Ctx {
  navigate: (href: string, origin?: { x: number; y: number }) => void;
  active: boolean;
}
const RouteTransitionCtx = createContext<Ctx>({ navigate: () => {}, active: false });
export const useRouteTransition = () => useContext(RouteTransitionCtx);

export function TransitionLink(props: ComponentProps<typeof NextLink>) {
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
        navigate(hrefStr, { x: e.clientX, y: e.clientY });
      }}
    />
  );
}

function stripLocale(p: string) {
  return p.replace(/^\/[^/]+/, '') || '/';
}

function detectScenario(fromPath: string | null, toPath: string): Scenario {
  const from = fromPath ? stripLocale(fromPath) : '/';
  const to = stripLocale(toPath);
  if (to === '/') return 'home';
  if (/^\/work$/.test(from) && /^\/work\/[^/]+$/.test(to)) return 'forward';
  if (/^\/work\/[^/]+$/.test(from) && /^\/work$/.test(to)) return 'back';
  return 'lateral';
}

// Map scenario to shader origin in uv space (0..1, y flipped for WebGL)
function originFor(
  scn: Scenario,
  clickPos: { x: number; y: number } | null,
  W: number,
  H: number,
): [number, number] {
  if (scn === 'forward' && clickPos) {
    return [clickPos.x / W, 1 - clickPos.y / H];
  }
  if (scn === 'lateral') {
    return [0.88, 0.88]; // top-right (uv y flipped)
  }
  // back, home
  return [0.5, 0.5];
}

export default function RouteTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [origin, setOrigin] = useState<[number, number]>([0.5, 0.5]);

  const pendingHrefRef = useRef<string | null>(null);
  const rafRef = useRef<number | null>(null);
  const swappedRef = useRef(false);

  const navigate = useCallback(
    (href: string, clickPos?: { x: number; y: number }) => {
      if (active) return;
      if (typeof window === 'undefined') {
        router.push(href);
        return;
      }

      const W = window.innerWidth;
      const H = window.innerHeight;
      const scn = detectScenario(pathname, href);
      const uvOrigin = originFor(scn, clickPos ?? null, W, H);

      pendingHrefRef.current = href;
      swappedRef.current = false;
      setOrigin(uvOrigin);
      setProgress(0);
      setActive(true);

      const start = performance.now();
      const tick = () => {
        const t = (performance.now() - start) / DURATION;
        if (t >= 1) {
          setProgress(0);
          setActive(false);
          pendingHrefRef.current = null;
          return;
        }
        // sine curve: 0 → 1 → 0, peak at t=0.5
        const p = Math.sin(t * Math.PI);
        setProgress(p);
        // page swap at peak coverage
        if (!swappedRef.current && t >= SWAP_AT && pendingHrefRef.current) {
          swappedRef.current = true;
          router.push(pendingHrefRef.current);
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [active, pathname, router],
  );

  // Global anchor click interceptor — fallback for any plain <a> or <Link>
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
      navigate(url.pathname + url.search, { x: e.clientX, y: e.clientY });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [navigate]);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <RouteTransitionCtx.Provider value={{ navigate, active }}>
      {children}
      {active && (
        <div
          aria-hidden
          style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}
        >
          <TransitionShaderCanvas
            frag={ditherGrid}
            progress={progress}
            origin={origin}
            className="h-full w-full"
          />
        </div>
      )}
    </RouteTransitionCtx.Provider>
  );
}
