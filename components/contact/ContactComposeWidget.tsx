'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useContactCompose } from './ContactComposeContext';
import ContactForm from './ContactForm';

interface Props {
  locale: 'zh-TW' | 'en-US';
}

const Z_BASE = 10000;

function useIsMobile(breakpoint = 767) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const h = () => setM(mq.matches);
    h();
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, [breakpoint]);
  return m;
}

function useCanDrag() {
  const [can, setCan] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const h = () => setCan(mq.matches);
    h();
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return can;
}

export default function ContactComposeWidget({ locale }: Props) {
  const { state, suppressed, minimize, expand, restore } = useContactCompose();
  const isMobile = useIsMobile();
  const canDrag = useCanDrag();

  // ESC anywhere non-min → collapse to pill
  useEffect(() => {
    if (state === 'min') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') minimize();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state, minimize]);

  if (suppressed) return null;

  if (isMobile) {
    if (state === 'min') return <MinPill onOpen={restore} locale={locale} />;
    return <FullscreenMobile locale={locale} onClose={minimize} />;
  }

  if (state === 'min') {
    return <MinPill onOpen={restore} locale={locale} />;
  }

  if (state === 'expanded') {
    return (
      <ExpandedDesktop
        locale={locale}
        onClose={minimize}
        onRestore={restore}
      />
    );
  }

  return (
    <NormalDesktop
      locale={locale}
      canDrag={canDrag}
      onClose={minimize}
      onExpand={expand}
    />
  );
}

/* ─────────────────────────────────────────── MIN PILL ─── */

function MinPill({
  onOpen,
  locale: _locale,
}: {
  onOpen: () => void;
  locale: 'zh-TW' | 'en-US';
}) {
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    const i = setInterval(() => setBlink((v) => !v), 500);
    return () => clearInterval(i);
  }, []);

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label="Open compose"
      data-cursor="▸ CONSULT"
      data-cursor-variant="primary"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="fixed"
      style={{
        right: 24,
        bottom: 24,
        zIndex: Z_BASE,
        background: '#0B1026',
        border: '1px solid rgba(93,211,227,0.35)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 16px',
        cursor: 'pointer',
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 10,
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        color: '#FAFAF8',
        transition: 'border-color 140ms, color 140ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#5DD3E3';
        e.currentTarget.style.color = '#5DD3E3';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(93,211,227,0.35)';
        e.currentTarget.style.color = '#FAFAF8';
      }}
    >
      <span style={{ color: '#E63E1F', fontSize: 9 }}>▲</span>
      <span>CONSULT</span>
      <span
        aria-hidden
        style={{ color: '#5DD3E3', opacity: blink ? 1 : 0, transition: 'opacity 100ms' }}
      >
        _
      </span>
    </motion.button>
  );
}

/* ──────────────────────────────────────── NORMAL DRAG ─── */

function NormalDesktop({
  locale,
  canDrag,
  onClose,
  onExpand,
}: {
  locale: 'zh-TW' | 'en-US';
  canDrag: boolean;
  onClose: () => void;
  onExpand: () => void;
}) {
  // Default position: bottom-right with 24px inset
  const WIDTH = 420;
  const HEIGHT = 560;

  const [pos, setPos] = useState(() => {
    if (typeof window === 'undefined') return { x: 800, y: 200 };
    return {
      x: Math.max(24, window.innerWidth - WIDTH - 24),
      y: Math.max(60, window.innerHeight - HEIGHT - 24),
    };
  });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ sx: number; sy: number; px: number; py: number } | null>(null);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.sx;
      const dy = e.clientY - dragRef.current.sy;
      const nx = dragRef.current.px + dx;
      const ny = dragRef.current.py + dy;
      setPos({
        x: Math.max(8, Math.min(window.innerWidth - WIDTH - 8, nx)),
        y: Math.max(8, Math.min(window.innerHeight - 48, ny)),
      });
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

  const startDrag = (e: React.MouseEvent) => {
    if (!canDrag) return;
    e.preventDefault();
    dragRef.current = { sx: e.clientX, sy: e.clientY, px: pos.x, py: pos.y };
    setDragging(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="fixed"
      style={{
        left: pos.x,
        top: pos.y,
        width: WIDTH,
        maxHeight: HEIGHT,
        zIndex: Z_BASE,
        background: '#0B1026',
        border: '1px solid rgba(93,211,227,0.3)',
        boxShadow: dragging
          ? '0 30px 70px rgba(0,0,0,0.65)'
          : '0 16px 48px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ComposeHeader
        onMouseDown={startDrag}
        canDrag={canDrag}
        dragging={dragging}
        onClose={onClose}
        onExpand={onExpand}
        isExpanded={false}
      />
      <div style={{ overflowY: 'auto', flex: 1 }}>
        <ContactForm locale={locale} variant="compact" />
      </div>
    </motion.div>
  );
}

/* ───────────────────────────────────── EXPANDED DESKTOP ─── */

function ExpandedDesktop({
  locale,
  onClose,
  onRestore,
}: {
  locale: 'zh-TW' | 'en-US';
  onClose: () => void;
  onRestore: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onRestore}
      className="fixed inset-0 grid place-items-center"
      style={{
        zIndex: Z_BASE,
        background: 'rgba(11,16,38,0.6)',
        backdropFilter: 'blur(6px)',
        cursor: 'zoom-out',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(92vw, 960px)',
          height: 'min(88vh, 780px)',
          background: '#0B1026',
          border: '1px solid rgba(93,211,227,0.35)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'default',
        }}
      >
        <ComposeHeader
          canDrag={false}
          dragging={false}
          onClose={onClose}
          onExpand={onRestore}
          isExpanded
        />
        <div style={{ overflowY: 'auto', flex: 1 }}>
          <ContactForm locale={locale} variant="wide" />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ──────────────────────────────────── FULLSCREEN MOBILE ─── */

function FullscreenMobile({
  locale,
  onClose,
}: {
  locale: 'zh-TW' | 'en-US';
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0"
      style={{ zIndex: Z_BASE, background: '#0B1026', display: 'flex', flexDirection: 'column' }}
    >
      <ComposeHeader
        canDrag={false}
        dragging={false}
        onClose={onClose}
        onExpand={onClose}
        isExpanded={false}
        mobile
      />
      <div style={{ overflowY: 'auto', flex: 1 }}>
        <ContactForm locale={locale} variant="compact" />
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────── HEADER ─── */

function ComposeHeader({
  onMouseDown,
  canDrag,
  dragging,
  onClose,
  onExpand,
  isExpanded,
  mobile = false,
}: {
  onMouseDown?: (e: React.MouseEvent) => void;
  canDrag: boolean;
  dragging: boolean;
  onClose: () => void;
  onExpand: () => void;
  isExpanded: boolean;
  mobile?: boolean;
}) {
  return (
    <div
      onMouseDown={onMouseDown}
      data-cursor={canDrag && !mobile ? (dragging ? '⊡ DRAGGING' : '⊡ DRAG') : undefined}
      data-cursor-variant="link"
      className="flex items-center gap-2 select-none"
      style={{
        padding: '8px 10px',
        borderBottom: '1px solid rgba(250,250,248,0.08)',
        background: 'rgba(93,211,227,0.06)',
        cursor: canDrag && !mobile ? (dragging ? 'grabbing' : 'grab') : 'default',
        fontFamily: 'var(--font-mono), monospace',
        fontSize: 9,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
      }}
    >
      {/* Traffic lights (left) — collapse / expand */}
      <div className="flex items-center gap-1.5 shrink-0">
        <HeaderBtn
          color="#F5B93A"
          onClick={onClose}
          aria-label={mobile ? 'Close' : 'Collapse to pill'}
          glyph="−"
        />
        {!mobile && (
          <HeaderBtn
            color="#5DD3E3"
            onClick={onExpand}
            aria-label={isExpanded ? 'Restore' : 'Expand'}
            glyph={isExpanded ? '▢' : '⛶'}
          />
        )}
      </div>

      {/* Title */}
      <span
        className="flex-1 truncate text-center"
        style={{
          color: 'rgba(250,250,248,0.72)',
          textTransform: 'none',
          letterSpacing: '0.04em',
          fontSize: 11,
        }}
      >
        CONSULT_COMPOSE
      </span>

      {/* Filename (right) */}
      <span
        className="shrink-0 hidden sm:inline"
        style={{ color: 'rgba(250,250,248,0.3)', fontSize: 9 }}
      >
        [ TLS-CNSL-042 ]
      </span>
    </div>
  );
}

function HeaderBtn({
  color,
  onClick,
  glyph,
  'aria-label': ariaLabel,
}: {
  color: string;
  onClick: () => void;
  glyph: string;
  'aria-label': string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={ariaLabel}
      title={ariaLabel}
      data-cursor={`▸ ${ariaLabel.toUpperCase()}`}
      data-cursor-variant="action"
      style={{
        width: 13,
        height: 13,
        borderRadius: '50%',
        background: color,
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        display: 'grid',
        placeItems: 'center',
        fontSize: 10,
        lineHeight: 1,
        color: 'rgba(11,16,38,0.72)',
        fontFamily: 'var(--font-mono), monospace',
        fontWeight: 700,
      }}
    >
      {glyph}
    </button>
  );
}
