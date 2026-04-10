'use client';

import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {useState} from 'react';

const NAV_ITEMS = [
  {key: 'about', href: '/about'},
  {key: 'work',  href: '/work'},
  {key: 'services', href: '/services'},
  {key: 'blog', href: '/blog'},
  {key: 'contact', href: '/contact'},
] as const;

export default function Nav({theme = 'light'}: {theme?: 'dark' | 'light'}) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white/70 hover:text-white' : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A]';
  const borderColor = isDark ? 'border-white/8' : 'border-black/8';
  const bgColor = isDark ? 'bg-[#080808]' : 'bg-[#F7F5F2]';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b ${borderColor} ${bgColor}/90 backdrop-blur-sm`}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo / Name */}
        <Link href="/" className={`font-label text-xs tracking-widest ${isDark ? 'text-white' : 'text-[#1A1A1A]'}`}>
          EVAN CHANG
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map(({key, href}) => (
            <li key={key}>
              <Link
                href={href}
                className={`font-label text-xs transition-colors ${textColor} ${pathname === href ? (isDark ? 'text-white' : 'text-[#1A1A1A]') : ''}`}
              >
                {t(key)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Language switcher */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher isDark={isDark} />
          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden font-label text-xs ${isDark ? 'text-white/70' : 'text-[#1A1A1A]/60'}`}
            aria-label="Toggle menu"
          >
            {menuOpen ? '[ CLOSE ]' : '[ MENU ]'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={`md:hidden border-t ${borderColor} ${bgColor} px-6 py-6`}>
          <ul className="flex flex-col gap-6">
            {NAV_ITEMS.map(({key, href}) => (
              <li key={key}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`font-label text-xs ${textColor}`}
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

function LanguageSwitcher({isDark}: {isDark: boolean}) {
  const pathname = usePathname();
  const textColor = isDark ? 'text-white/50 hover:text-white' : 'text-[#1A1A1A]/40 hover:text-[#1A1A1A]';

  return (
    <div className={`font-label text-xs flex items-center gap-2 ${textColor}`}>
      <Link href={pathname} locale="zh-TW" className="transition-colors">ZH</Link>
      <span className="opacity-30">/</span>
      <Link href={pathname} locale="en" className="transition-colors">EN</Link>
    </div>
  );
}
