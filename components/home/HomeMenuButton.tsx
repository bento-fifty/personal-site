'use client';

import { useState, useEffect, useRef } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

const NAV_ITEMS = [
  { key: 'about' as const, href: '/about' as const },
  { key: 'work' as const, href: '/work' as const },
  { key: 'blog' as const, href: '/blog' as const },
];

export default function HomeMenuButton() {
  const t = useTranslations('nav');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    window.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      window.removeEventListener('keydown', keyHandler);
    };
  }, [open]);

  return (
    <div ref={ref} className="fixed top-5 right-5 z-[110]">
      {/* Trigger — plain text, no bg */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="px-3 py-2 transition-colors duration-200"
        style={{
          fontFamily: 'var(--font-departure-mono), monospace',
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: open ? '#E63E1F' : 'rgba(10,10,12,0.55)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {open ? '[ CLOSE ]' : '[ MENU ]'}
      </button>

      {/* Dropdown — frosted glass */}
      <div
        className="absolute top-full right-0 mt-1"
        style={{
          width: '140px',
          background: 'rgba(250,250,248,0.45)',
          backdropFilter: 'blur(32px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(32px) saturate(1.6)',
          borderRadius: '6px',
          border: '1px solid rgba(250,250,248,0.5)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(-6px)',
          transition: 'opacity 0.2s, transform 0.2s cubic-bezier(0.32, 0.72, 0, 1)',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <div className="py-3 px-2">
          {NAV_ITEMS.map(({ key, href }, i) => (
            <Link
              key={key}
              href={href}
              onClick={() => setOpen(false)}
              className="group block py-2 text-center transition duration-200"
              style={{
                opacity: open ? 1 : 0,
                transform: open ? 'translateY(0)' : 'translateY(-4px)',
                transition: `opacity 0.2s ${0.08 + i * 0.06}s, transform 0.25s ${0.08 + i * 0.06}s`,
              }}
            >
              <span
                className="block transition duration-200 group-hover:tracking-[0.2em] group-hover:scale-[1.05]"
                style={{
                  fontFamily: 'var(--font-heading), Georgia, serif',
                  fontSize: '15px',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  color: 'rgba(10,10,12,0.55)',
                  letterSpacing: '0.06em',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#E63E1F'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(10,10,12,0.55)'; }}
              >
                {t(key)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
