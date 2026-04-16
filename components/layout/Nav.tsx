'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useState, useEffect, useRef, Fragment } from 'react';
import { useNavTheme } from '@/contexts/NavThemeContext';

const NAV_ITEMS = [
  { key: 'about',   href: '/about'   as const },
  { key: 'work',    href: '/work'    as const },
  { key: 'blog',    href: '/blog'    as const },
  // contact integrated into footer — no separate page
] as const;

export default function Nav() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useNavTheme();

  const isDark = theme === 'dark';
  const bg     = isDark ? 'bg-[#0C0C0E]/90' : 'bg-[#FAFAF8]/90';
  const border = isDark ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(20,20,19,0.07)]';
  const text   = isDark ? 'text-[#EAEAE8]' : 'text-[#141413]';
  const textDim = isDark ? 'text-[#EAEAE8]/50' : 'text-[#6B6B67]';

  const navRef = useRef<HTMLElement>(null);
  const isHome = pathname === '/' || pathname === '';

  if (isHome) return null;

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 border-b ${border} ${bg} backdrop-blur-md`}
      onKeyDown={(e) => e.key === 'Escape' && setMenuOpen(false)}
    >
      <div className="relative max-w-[1200px] mx-auto px-6 h-14 grid grid-cols-[1fr_auto_1fr] items-center gap-6">
        {/* Logo */}
        <Link
          href="/"
          className={`justify-self-start text-[13px] font-medium tracking-[0.02em] ${text}`}
          style={{ fontFamily: 'var(--font-geist), var(--font-cjk-sans), sans-serif' }}
        >
          THE LEVEL STUDIO
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8 justify-self-center">
          {NAV_ITEMS.map(({ key, href }) => {
            const isActive = pathname === href;
            return (
              <li key={key} className="relative">
                <Link
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'block px-1 py-1.5 text-[12px] font-medium tracking-[0.04em] transition-colors',
                    isActive ? text : `${textDim} hover:${text}`,
                  ].join(' ')}
                  style={{ fontFamily: 'var(--font-geist), var(--font-cjk-sans), sans-serif' }}
                >
                  {t(key)}
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-1 h-1 rounded-full"
                      style={{ background: 'var(--accent)' }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side */}
        <div className="justify-self-end flex items-center gap-4">
          <LanguageSwitcher isDark={isDark} />

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className={`md:hidden flex flex-col gap-[5px] w-5 ${text}`}
          >
            <span className={`block h-px w-full transition ${isDark ? 'bg-white' : 'bg-[#141413]'} ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
            <span className={`block h-px w-full transition ${isDark ? 'bg-white' : 'bg-[#141413]'} ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px w-full transition ${isDark ? 'bg-white' : 'bg-[#141413]'} ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu — full screen overlay */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className={`md:hidden fixed inset-0 top-14 ${isDark ? 'bg-[#0C0C0E]' : 'bg-[#FAFAF8]'} flex items-center justify-center`}
        >
          <ul className="flex flex-col items-center gap-8">
            {NAV_ITEMS.map(({ key, href }) => {
              const isActive = pathname === href;
              return (
                <li key={key}>
                  <Link
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={[
                      'font-display text-[32px] transition-colors',
                      isActive ? text : `${textDim} hover:${text}`,
                    ].join(' ')}
                  >
                    {t(key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}

function LanguageSwitcher({ isDark }: { isDark: boolean }) {
  const pathname = usePathname();
  const currentLocale = useLocale();
  const locales = ['zh-TW', 'en'] as const;
  const text = isDark ? 'text-[#EAEAE8]' : 'text-[#141413]';
  const textDim = isDark ? 'text-[#EAEAE8]/40' : 'text-[#A8A8A3]';

  return (
    <div className="text-[12px] font-medium flex items-center gap-2" style={{ fontFamily: 'var(--font-geist), sans-serif' }}>
      {locales.map((loc, i) => (
        <Fragment key={loc}>
          {i > 0 && (
            <span className={textDim}>/</span>
          )}
          <Link
            href={pathname}
            locale={loc}
            aria-current={currentLocale === loc ? 'true' : undefined}
            className={[
              'transition-colors',
              currentLocale === loc ? text : `${textDim} hover:${text}`,
            ].join(' ')}
          >
            {loc === 'zh-TW' ? 'ZH' : 'EN'}
          </Link>
        </Fragment>
      ))}
    </div>
  );
}
