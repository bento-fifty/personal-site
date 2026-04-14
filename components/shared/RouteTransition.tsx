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

/**
 * RouteTransition — hybrid ice splatter + ice-deep grid + flame ticker.
 *
 * Sequence (~820ms total):
 *   0ms      splat blooms from origin + grid cells stagger in
 *   160ms    flame ticker slides in (direction per scenario)
 *   380ms    page swapped under cover
 *   420ms    splat starts shrinking (exits first)
 *   500ms    grid fades out
 *   620ms    ticker slides out (last to leave — wraps up)
 *   860ms    cleanup
 *
 * Scenarios detected from from/to paths:
 *   forward  (list → detail)       splat from click, ticker L→R out right
 *   back     (detail → list)       splat from center, ticker R→L out left
 *   lateral  (section ↔ section)   splat from corner, ticker T→B vertical
 *   home     (anything → /)        splat from 4 corners centripetal, ticker L→R
 */

type Phase = 'idle' | 'active';
type Scenario = 'forward' | 'back' | 'lateral' | 'home';

const T = {
  splatBloom: 320,
  splatStag: 32,
  tickerInAt: 160,
  tickerIn: 260,
  pageSwapAt: 380,
  splatExitAt: 420,
  splatExit: 220,
  gridFadeAt: 500,
  tickerOutAt: 620,
  tickerOut: 240,
  cleanup: 900,
};

const SPLAT_PATHS = [
  'M250 40 C310 30 380 80 420 140 C460 200 480 260 460 320 C440 380 380 430 320 440 C260 450 200 430 160 390 C120 350 90 300 80 240 C70 180 100 120 140 80 C170 55 210 45 250 40 Z M430 360 L460 420 L450 460 L430 440 Z M90 420 L60 460 L100 470 Z',
  'M260 50 L310 30 L360 70 L410 60 L440 110 L460 170 L480 220 L460 280 L490 340 L440 380 L420 440 L360 430 L320 460 L270 450 L220 470 L180 430 L130 440 L110 390 L70 350 L90 290 L60 240 L80 190 L60 140 L110 110 L130 60 L190 80 L230 50 Z',
  'M256 30 C330 40 400 90 440 160 C480 230 490 310 450 380 C410 450 330 480 250 470 C170 460 100 410 70 340 C40 270 50 180 100 120 C150 60 210 25 256 30 Z M440 90 L490 60 L475 100 Z M50 390 L20 430 L70 425 Z',
  'M240 50 C300 40 380 70 420 140 C450 200 460 270 430 330 C430 380 430 440 410 470 C400 480 380 470 370 440 C360 420 360 390 350 370 C340 370 320 410 290 440 C260 460 220 450 180 430 C120 400 80 330 70 260 C60 180 110 100 180 70 C200 55 220 50 240 50 Z',
  'M256 40 C340 40 410 100 450 180 C490 260 470 360 400 420 C330 480 220 490 150 430 C80 370 50 270 80 180 C110 90 200 40 256 40 Z M430 380 L460 420 L420 440 L400 410 Z',
  'M100 220 L50 240 L80 280 L40 320 L120 360 L200 400 L280 430 L360 420 L440 380 L480 320 L460 260 L490 200 L430 160 L360 110 L270 90 L180 110 L110 150 Z',
  'M256 60 C320 50 390 90 430 160 C470 230 460 320 400 380 C340 440 240 450 170 400 C100 350 70 260 100 180 C130 100 200 55 256 60 Z M440 130 L480 100 L470 150 Z',
];

const SPLAT_COLORS = ['#5DD3E3', '#9FEFF7', '#2E8FA0'];

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

function tickerTextFor(scn: Scenario, toPath: string): string {
  const to = stripLocale(toPath);
  const slug = to.match(/^\/work\/([^/]+)$/)?.[1] ?? '';
  const section = to.split('/')[1] || 'HOME';
  if (scn === 'forward') {
    return `▸ OPENING · ${slug.toUpperCase().replace(/-/g, ' ')} · TLS-CASE`;
  }
  if (scn === 'back') {
    return '◀ RETURN · ARCHIVE · N°003 · TPE';
  }
  if (scn === 'home') {
    return '⌂ HOME · THE LEVEL STUDIO · N°003';
  }
  return `SECTION · ${section.toUpperCase()} · TLS-${section.slice(0, 3).toUpperCase()}`;
}

function originFor(
  scn: Scenario,
  clickPos: { x: number; y: number } | null,
  W: number,
  H: number,
): { x: number; y: number; origins?: Array<{ x: number; y: number }> } {
  if (scn === 'forward' && clickPos) return { x: clickPos.x, y: clickPos.y };
  if (scn === 'center' as Scenario) return { x: W / 2, y: H / 2 };
  if (scn === 'back') return { x: W / 2, y: H / 2 };
  if (scn === 'lateral') return { x: W - 120, y: 120 };
  if (scn === 'home') {
    return {
      x: W / 2,
      y: H / 2,
      origins: [
        { x: 120, y: 120 },
        { x: W - 120, y: 120 },
        { x: 120, y: H - 120 },
        { x: W - 120, y: H - 120 },
        { x: W / 2, y: H / 2 },
      ],
    };
  }
  return { x: W / 2, y: H / 2 };
}

interface Splat {
  key: number;
  x: number;
  y: number;
  size: number;
  rot: number;
  color: string;
  shape: string;
  delayIn: number;
  delayOut: number;
}

function buildSplats(
  scn: Scenario,
  clickPos: { x: number; y: number } | null,
  W: number,
  H: number,
): Splat[] {
  const origin = originFor(scn, clickPos, W, H);
  const origins = origin.origins ?? [{ x: origin.x, y: origin.y }];
  const splats: Splat[] = [];
  let keyIdx = 0;

  const push = (x: number, y: number, size: number, colorIdx: number) => {
    splats.push({
      key: keyIdx++,
      x,
      y,
      size,
      rot: Math.random() * 360,
      color: SPLAT_COLORS[colorIdx % SPLAT_COLORS.length],
      shape: SPLAT_PATHS[Math.floor(Math.random() * SPLAT_PATHS.length)],
      delayIn: Math.round(splats.length * T.splatStag * 0.55 + Math.random() * T.splatStag * 0.5),
      delayOut: Math.round(splats.length * T.splatStag * 0.35),
    });
  };

  // 1. Anchor splats at each origin — big dominant blobs
  origins.forEach((o, oi) => {
    push(o.x, o.y, 520 + Math.random() * 120, oi);
    // tight cluster around origin
    const clusterCount = origins.length > 1 ? 2 : 4;
    for (let i = 0; i < clusterCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = 120 + Math.random() * 220;
      push(o.x + Math.cos(a) * d, o.y + Math.sin(a) * d, 280 + Math.random() * 220, i + 1);
    }
  });

  // 2. Scatter splats across the full viewport — ensures coverage spread
  const scatterCount = 10;
  for (let i = 0; i < scatterCount; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    const size = 200 + Math.random() * 260;
    push(x, y, size, i);
  }

  // 3. Smaller filler dots in random edge/corner voids
  const fillerCount = 6;
  for (let i = 0; i < fillerCount; i++) {
    const x = Math.random() * W;
    const y = Math.random() * H;
    push(x, y, 120 + Math.random() * 120, i + 2);
  }

  return splats;
}

export default function RouteTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>('idle');
  const [scenario, setScenario] = useState<Scenario>('forward');
  const [splats, setSplats] = useState<Splat[]>([]);
  const [tickerText, setTickerText] = useState('');
  const [subphase, setSubphase] = useState<'bloom' | 'exit'>('bloom');
  const [tickerState, setTickerState] = useState<'out' | 'in' | 'gone'>('out');

  const pendingHrefRef = useRef<string | null>(null);
  const startPathRef = useRef<string | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const schedule = (fn: () => void, ms: number) => {
    timersRef.current.push(setTimeout(fn, ms));
  };

  const navigate = useCallback(
    (href: string, origin?: { x: number; y: number }) => {
      if (phase !== 'idle') return;
      if (typeof window === 'undefined') {
        router.push(href);
        return;
      }

      const W = window.innerWidth;
      const H = window.innerHeight;
      const scn = detectScenario(pathname, href);
      const newSplats = buildSplats(scn, origin ?? null, W, H);
      const text = tickerTextFor(scn, href);

      pendingHrefRef.current = href;
      startPathRef.current = pathname;

      setScenario(scn);
      setSplats(newSplats);
      setTickerText(text);
      setSubphase('bloom');
      setTickerState('out');
      setPhase('active');

      clearTimers();

      // Ticker slides in
      schedule(() => setTickerState('in'), T.tickerInAt);

      // Page swap under cover
      schedule(() => {
        if (pendingHrefRef.current) router.push(pendingHrefRef.current);
      }, T.pageSwapAt);

      // Splat exits first
      schedule(() => setSubphase('exit'), T.splatExitAt);

      // Ticker out (last to leave)
      schedule(() => setTickerState('gone'), T.tickerOutAt);

      // Cleanup
      schedule(() => {
        setPhase('idle');
        setSplats([]);
        pendingHrefRef.current = null;
        startPathRef.current = null;
      }, T.cleanup);
    },
    [phase, pathname, router],
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

  useEffect(() => () => clearTimers(), []);

  const active = phase !== 'idle';
  const tickerOrient: 'horiz' | 'vert' = scenario === 'lateral' ? 'vert' : 'horiz';
  const tickerExitDir: 'right' | 'left' | 'down' | 'up' =
    scenario === 'back' ? 'left' :
    scenario === 'lateral' ? 'down' :
    'right';
  const tickerEnterReverse = scenario === 'back';

  return (
    <RouteTransitionCtx.Provider value={{ navigate, active }}>
      {children}
      {active && (
        <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}>
          {/* SPLATTER (no grid — splats own the coverage) */}
          <div style={{ position: 'absolute', inset: 0 }}>
            {splats.map((s) => (
              <div
                key={s.key}
                style={{
                  position: 'absolute',
                  left: s.x,
                  top: s.y,
                  width: s.size,
                  height: s.size,
                  transform: `translate(-50%, -50%) scale(${subphase === 'bloom' ? 1 : 0})`,
                  transformOrigin: 'center',
                  transition: `transform ${
                    subphase === 'bloom' ? T.splatBloom : T.splatExit
                  }ms cubic-bezier(${
                    subphase === 'bloom' ? '0.34, 1.45, 0.64, 1' : '0.6, 0, 0.4, 1'
                  }) ${subphase === 'bloom' ? s.delayIn : s.delayOut}ms`,
                  willChange: 'transform',
                }}
              >
                <svg
                  viewBox="0 0 512 512"
                  style={{
                    transform: `rotate(${s.rot}deg)`,
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <path d={s.shape} fill={s.color} />
                  {Array.from({ length: 5 }).map((_, i) => {
                    const dx = 0.1 + (Math.sin((s.key + 1) * (i + 1)) * 0.5 + 0.5) * 0.8;
                    const dy = 0.1 + (Math.cos((s.key + 1) * (i + 1)) * 0.5 + 0.5) * 0.8;
                    const r = 3 + (Math.sin((s.key + 1) * i * 7) * 0.5 + 0.5) * 8;
                    return <circle key={i} cx={dx * 512} cy={dy * 512} r={r} fill={s.color} />;
                  })}
                </svg>
              </div>
            ))}
          </div>

          {/* TICKER (top layer, flame bar) */}
          {tickerOrient === 'horiz' ? (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: tickerState === 'gone'
                  ? (tickerExitDir === 'right' ? '110%' : '-110%')
                  : tickerState === 'in'
                  ? '0%'
                  : tickerEnterReverse ? '110%' : '-110%',
                width: '200%',
                height: 44,
                transform: 'translateY(-50%)',
                background: '#E63E1F',
                color: '#0B1026',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 12,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                fontWeight: 600,
                transition: `left ${
                  tickerState === 'in' ? T.tickerIn : T.tickerOut
                }ms cubic-bezier(0.7,0,0.3,1)`,
              }}
            >
              <span style={{ whiteSpace: 'nowrap', padding: '0 32px' }}>
                {tickerText} · {tickerText}
              </span>
            </div>
          ) : (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: tickerState === 'gone'
                  ? (tickerExitDir === 'down' ? '110%' : '-110%')
                  : tickerState === 'in'
                  ? '0%'
                  : '-110%',
                width: 44,
                height: '200%',
                transform: 'translateX(-50%)',
                background: '#E63E1F',
                color: '#0B1026',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 12,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                fontWeight: 600,
                writingMode: 'vertical-rl',
                transition: `top ${
                  tickerState === 'in' ? T.tickerIn : T.tickerOut
                }ms cubic-bezier(0.7,0,0.3,1)`,
              }}
            >
              <span style={{ whiteSpace: 'nowrap', padding: '32px 0' }}>
                {tickerText} · {tickerText}
              </span>
            </div>
          )}
        </div>
      )}
    </RouteTransitionCtx.Provider>
  );
}
