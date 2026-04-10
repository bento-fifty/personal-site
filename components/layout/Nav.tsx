'use client';

import {useTranslations, useLocale} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {useState} from 'react';
import {useNavTheme} from '@/contexts/NavThemeContext';

const NAV_ITEMS = [
  {key: 'about',    href: '/about'},
  {key: 'work',     href: '/work'},
  {key: 'services', href: '/services'},
  {key: 'blog',     href: '/blog'},
  {key: 'contact',  href: '/contact'},
] as const;

export default function Nav() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useNavTheme();

  const isDark = theme === 'dark';
  const borderColor = isDark ? 'border-[rgba(255,255,255,0.08)]' : 'border-[rgba(0,0,0,0.08)]';
  const bgColor    = isDark ? 'bg-[#080808]' : 'bg-[#F7F5F2]';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b ${borderColor} ${bgColor}/90 backdrop-blur-sm`}
      onKeyDown={(e) => e.key === 'Escape' && setMenuOpen(false)}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={`font-label text-xs tracking-widest ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}
        >
          EVAN CHANG
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map(({key, href}) => {
            const isActive = pathname === href;
            return (
              <li key={key}>
                <Link
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'font-label text-xs transition-colors',
                    isActive
                      ? isDark ? 'text-white font-bold' : 'text-[#1A1A1A] font-bold'
                      : isDark ? 'text-white/50 hover:text-white' : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]',
                  ].join(' ')}
                >
                  {t(key)}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-4">
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
        <div id="mobile-nav" className={`md:hidden border-t ${borderColor} ${bgColor} px-6 py-6`}>
          <ul className="flex flex-col gap-6">
            {NAV_ITEMS.map(({key, href}) => {
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
                        : isDark ? 'text-white/50 hover:text-white' : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A]',
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

function LanguageSwitcher({isDark}: {isDark: boolean}) {
  const pathname = usePathname();
  const currentLocale = useLocale();

  return (
    <div className="font-label text-xs flex items-center gap-2">
      {(['zh-TW', 'en'] as const).map((loc, i) => (
        <>
          {i > 0 && (
            <span key={`sep-${loc}`} className={isDark ? 'text-white/20' : 'text-[#1A1A1A]/20'}>
              /
            </span>
          )}
          <Link
            key={loc}
            href={pathname}
            locale={loc}
            aria-current={currentLocale === loc ? 'true' : undefined}
            className={[
              'transition-colors',
              currentLocale === loc
                ? isDark ? 'text-white' : 'text-[#1A1A1A]'
                : isDark ? 'text-white/40 hover:text-white' : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A]',
            ].join(' ')}
          >
            {loc === 'zh-TW' ? 'ZH' : 'EN'}
          </Link>
        </>
      ))}
    </div>
  );
}
