'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

/**
 * EditorialMasthead — v8 global top strip, 32px tall, hairline bottom.
 *
 * Left: THE LEVEL STUDIO (always)
 * Center: contextual — varies by route (issue / archive / feature)
 * Right: reference code + MENU
 */

function getContextLabel(pathname: string): string {
  // Strip locale prefix
  const path = pathname.replace(/^\/(zh-TW|en-US)/, '') || '/';
  if (path === '/') return 'ISSUE N°003 · SEASON 2026';
  if (path === '/work') return 'ARCHIVE · 042 ENTRIES';
  if (path.startsWith('/work/')) return 'FEATURE · CASE FILE';
  if (path === '/about') return 'PRINCIPAL · EVAN CHANG';
  if (path === '/contact') return 'CONTACT';
  if (path === '/services') return 'SERVICES';
  return path.toUpperCase().slice(1);
}

function getRefCode(pathname: string): string {
  const path = pathname.replace(/^\/(zh-TW|en-US)/, '') || '/';
  if (path === '/') return 'TLS-COVER';
  if (path === '/work') return 'TLS-ARCH';
  if (path.startsWith('/work/')) return 'TLS-FTR';
  return `TLS-${path.slice(1).slice(0, 4).toUpperCase()}`;
}

export default function EditorialMasthead() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [now, setNow] = useState<string>('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      setNow(`${yyyy}.${mm}.${dd}`);
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  const context = getContextLabel(pathname || '/');
  const ref = getRefCode(pathname || '/');
  const localePrefix = pathname?.startsWith('/en-US') ? '/en-US' : '/zh-TW';

  const NAV = [
    { label: 'HOME', href: `${localePrefix}/` },
    { label: 'WORKS', href: `${localePrefix}/work` },
    { label: 'PROFILE', href: `${localePrefix}/about` },
    { label: 'CONTACT', href: `${localePrefix}/contact` },
  ];

  const normalizedPath = (pathname || '/').replace(/^\/(zh-TW|en-US)/, '') || '/';
  const isActiveRoute = (href: string): boolean => {
    const relative = href.replace(/^\/(zh-TW|en-US)/, '') || '/';
    if (relative === '/') return normalizedPath === '/';
    return normalizedPath === relative || normalizedPath.startsWith(relative + '/');
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[100]"
        style={{
          height: 44,
          background: scrolled ? 'rgba(10,10,12,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: '1px solid rgba(250,250,248,0.08)',
          transition: 'background 200ms ease-out, backdrop-filter 200ms ease-out',
        }}
      >
        <div className="h-full flex items-center justify-between px-5 md:px-8 gap-6">
          {/* Left */}
          <Link
            href={`${localePrefix}/`}
            data-cursor="▸ HOME"
            data-cursor-variant="link"
            className="font-mono text-[10px] tracking-[0.22em] text-[#FAFAF8] hover:text-[#E63E1F] transition-colors shrink-0"
            style={{ fontFamily: 'var(--font-mono), monospace', textTransform: 'uppercase' }}
          >
            THE LEVEL STUDIO
          </Link>

          {/* Center: inline nav (desktop) */}
          <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {NAV.map((item) => {
              const active = isActiveRoute(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-cursor={`▸ ${item.label}`}
                  data-cursor-variant="link"
                  className="font-mono text-[10px] tracking-[0.22em] transition-colors"
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    textTransform: 'uppercase',
                    color: active ? '#FAFAF8' : 'rgba(250,250,248,0.5)',
                    borderBottom: active ? '1px solid #5DD3E3' : '1px solid transparent',
                    paddingBottom: 2,
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-4 shrink-0">
            <span
              className="hidden lg:inline font-mono text-[9px] tracking-[0.22em] text-[rgba(250,250,248,0.3)]"
              style={{ fontFamily: 'var(--font-mono), monospace' }}
            >
              REF. {ref} · {now} · TPE
            </span>
            <span
              className="md:hidden font-mono text-[10px] tracking-[0.22em] text-[rgba(250,250,248,0.55)]"
              style={{ fontFamily: 'var(--font-mono), monospace', textTransform: 'uppercase' }}
            >
              {context}
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              data-cursor={menuOpen ? '× CLOSE' : '▸ MENU'}
              data-cursor-variant="action"
              className="font-mono text-[10px] tracking-[0.22em] text-[#FAFAF8] hover:text-[#E63E1F] transition-colors md:hidden"
              style={{ fontFamily: 'var(--font-mono), monospace', textTransform: 'uppercase' }}
              aria-expanded={menuOpen}
            >
              [ {menuOpen ? 'CLOSE' : 'MENU'} ]
            </button>
          </div>
        </div>
      </header>

      {/* Menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[99] flex items-center justify-center"
          style={{ background: 'rgba(10,10,12,0.97)', backdropFilter: 'blur(20px)' }}
          onClick={() => setMenuOpen(false)}
        >
          <nav className="flex flex-col items-center gap-8" onClick={(e) => e.stopPropagation()}>
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-display-lg text-[#FAFAF8] hover:text-[#E63E1F] transition-colors"
                style={{ fontFamily: 'var(--font-display), serif', fontSize: 'clamp(48px, 8vw, 96px)' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
