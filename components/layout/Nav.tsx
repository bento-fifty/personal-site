'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useState, Fragment } from 'react';
import { motion } from 'framer-motion';
import { useNavTheme } from '@/contexts/NavThemeContext';
import GlitchText from '@/components/shared/GlitchText';

const NAV_ITEMS = [
  { key: 'about',    href: '/about'    as const },
  { key: 'work',     href: '/work'     as const },
  { key: 'services', href: '/services' as const },
  { key: 'blog',     href: '/blog'     as const },
  { key: 'contact',  href: '/contact'  as const },
] as const;

export default function Nav() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [logoHoverCount, setLogoHoverCount] = useState(0);
  const { theme } = useNavTheme();

  const isDark     = theme === 'dark';
  const borderCol  = isDark ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.08)]';
  const bgCol      = isDark ? 'bg-[#080808]' : 'bg-[#F7F5F2]';
  const textBase   = isDark ? 'text-white' : 'text-[#1A1A1A]';

  const activeItem = NAV_ITEMS.find((item) => pathname === item.href);
  const activeKey  = activeItem?.key;

  // Which item gets the underline? Hover wins over active route.
  const targetKey = hoveredKey ?? activeKey ?? null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b ${borderCol} ${bgCol}/90 backdrop-blur-sm`}
      onKeyDown={(e) => e.key === 'Escape' && setMenuOpen(false)}
    >
      <div className="relative max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo — pulsing dot + blinking terminal cursor + hover scramble */}
        <Link
          href="/"
          className={`group inline-flex items-center gap-2.5 font-label text-xs tracking-widest ${textBase}`}
          onMouseEnter={() => setLogoHoverCount((n) => n + 1)}
        >
          {/* Pulsing status dot — sharper contrast */}
          <motion.span
            aria-hidden
            className="relative inline-block w-1.5 h-1.5 rounded-full"
            style={{
              background: isDark ? '#5CE1FF' : '#0891B2',
              boxShadow:  isDark
                ? '0 0 10px rgba(92,225,255,1), 0 0 2px rgba(92,225,255,1)'
                : '0 0 6px rgba(8,145,178,0.7)',
            }}
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <GlitchText
            key={`logo-${logoHoverCount}`}
            text="EVAN CHANG"
            trigger={logoHoverCount}
            speed={26}
          />
        </Link>

        {/* Desktop nav with sliding underline */}
        <ul
          className="hidden md:flex items-center gap-10"
          onMouseLeave={() => setHoveredKey(null)}
        >
          {NAV_ITEMS.map(({ key, href }) => {
            const isActive = pathname === href;
            const isTarget = targetKey === key;
            return (
              <li
                key={key}
                className="relative"
                onMouseEnter={() => setHoveredKey(key)}
              >
                <Link
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'relative block px-1 pt-1.5 pb-2 font-label text-xs transition-colors',
                    isActive
                      ? isDark ? 'text-white' : 'text-[#1A1A1A]'
                      : isDark
                        ? 'text-white/55 hover:text-white'
                        : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]',
                  ].join(' ')}
                >
                  {t(key)}
                </Link>
                {/* Sliding underline */}
                {isTarget && isDark && (
                  <motion.span
                    layoutId="nav-underline"
                    aria-hidden
                    className="absolute left-0 right-0 -bottom-px h-px bg-[#5CE1FF]"
                    style={{
                      boxShadow: '0 0 10px rgba(92,225,255,0.95), 0 0 2px rgba(92,225,255,1)',
                    }}
                    transition={{
                      type:      'spring',
                      stiffness: 420,
                      damping:   34,
                      mass:      0.6,
                    }}
                  />
                )}
              </li>
            );
          })}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-5">
          {/* Desktop HUD readout — static, no blinking */}
          {isDark && (
            <div
              className="hidden lg:flex items-center font-label text-[0.5625rem] tracking-[0.22em] text-[#5CE1FF]"
              style={{ textShadow: '0 0 10px rgba(92,225,255,0.6)' }}
            >
              <span>LIVE</span>
              <span className="mx-2 text-[#5CE1FF]/50">·</span>
              <span>TAIPEI</span>
            </div>
          )}

          <LanguageSwitcher isDark={isDark} />

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className={`md:hidden font-label text-xs ${isDark ? 'text-white/70' : 'text-[#1A1A1A]/60'}`}
          >
            {menuOpen ? '[ CLOSE ]' : '[ MENU ]'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div id="mobile-nav" className={`md:hidden border-t ${borderCol} ${bgCol} px-6 py-6`}>
          <ul className="flex flex-col gap-6">
            {NAV_ITEMS.map(({ key, href }) => {
              const isActive = pathname === href;
              return (
                <li key={key}>
                  <Link
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={[
                      'font-label text-xs transition-colors',
                      isActive
                        ? isDark ? 'text-white font-bold' : 'text-[#1A1A1A] font-bold'
                        : isDark
                          ? 'text-white/50 hover:text-white'
                          : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]',
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

  return (
    <div className="font-label text-xs flex items-center gap-2">
      {locales.map((loc, i) => (
        <Fragment key={loc}>
          {i > 0 && (
            <span className={isDark ? 'text-white/20' : 'text-[#1A1A1A]/20'}>/</span>
          )}
          <Link
            href={pathname}
            locale={loc}
            aria-current={currentLocale === loc ? 'true' : undefined}
            className={[
              'transition-colors',
              currentLocale === loc
                ? isDark ? 'text-white' : 'text-[#1A1A1A]'
                : isDark
                  ? 'text-white/40 hover:text-white'
                  : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A]',
            ].join(' ')}
          >
            {loc === 'zh-TW' ? 'ZH' : 'EN'}
          </Link>
        </Fragment>
      ))}
    </div>
  );
}
