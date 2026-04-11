import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import CopyrightYear from './CopyrightYear';
import BackToTop from './BackToTop';
import FooterWordmark from './FooterWordmark';

const NAV_LINKS = [
  { key: 'about',    href: '/about'    as const },
  { key: 'work',     href: '/work'     as const },
  { key: 'services', href: '/services' as const },
  { key: 'blog',     href: '/blog'     as const },
] as const;

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'LinkedIn',  href: 'https://linkedin.com' },
  { label: 'Behance',   href: 'https://behance.net' },
] as const;

export default async function Footer() {
  const t = await getTranslations('nav');
  return (
    <footer id="contact" className="relative bg-[#080808] text-white border-t border-[rgba(92,225,255,0.12)] overflow-hidden">
      {/* Top-edge glow bar */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#5CE1FF]/60 to-transparent pointer-events-none" />

      {/* Subtle dust grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(92,225,255,0.18) 0.5px, transparent 0.5px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-24 pb-10">
        {/* ── CTA block — stacked tight ───────────────── */}
        <div className="pb-20 border-b border-white/[0.06]">
          <p
            className="font-label text-[0.625rem] text-[#5CE1FF]/70 mb-6 tracking-[0.25em]"
            style={{ textShadow: '0 0 10px rgba(92,225,255,0.45)' }}
          >
            {'// LET\'S WORK TOGETHER'}
          </p>
          <h2 className="font-display text-white text-[33px] md:text-[44px] lg:text-[55px] leading-[1.05] max-w-2xl mb-10">
            Have a project
            <br />
            worth remembering?
          </h2>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-4 font-label text-xs text-white hover:text-[#5CE1FF] border border-white/20 hover:border-[#5CE1FF]/60 px-8 py-5 tracking-[0.22em] transition-colors"
          >
            <span>START A PROJECT</span>
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* ── Middle grid: brand · navigate · social ──── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 py-20">
          {/* Brand + location */}
          <div className="md:col-span-5 lg:col-span-6">
            <FooterWordmark />
            <p className="font-label text-white/55 text-[0.75rem] tracking-[0.2em] uppercase mb-8 max-w-sm">
              Event planner, producer & consultant.
            </p>
            <div className="font-label text-[0.625rem] text-white/30 space-y-2">
              <p>
                [ BASED IN ]{' '}
                <span
                  className="text-[#5CE1FF]"
                  style={{ textShadow: '0 0 10px rgba(92,225,255,0.5)' }}
                >
                  TAIPEI, TAIWAN
                </span>
              </p>
              <p>
                [ STATUS ]{' '}
                <span
                  className="text-[#5CE1FF]"
                  style={{ textShadow: '0 0 10px rgba(92,225,255,0.5)' }}
                >
                  OPEN FOR 2026 Q3 →
                </span>
              </p>
            </div>
          </div>

          {/* Navigate */}
          <div className="md:col-span-3">
            <p className="font-label text-[0.625rem] text-white/30 mb-6">
              [ NAVIGATE ]
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="font-display text-white/75 text-lg hover:text-[#5CE1FF] transition-colors inline-flex items-baseline gap-2 group"
                  >
                    <span>{t(key)}</span>
                    <span className="font-label text-[0.5625rem] text-white/20 group-hover:text-[#5CE1FF]/60 transition-colors">↗</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social + contact */}
          <div className="md:col-span-4 lg:col-span-3">
            <p className="font-label text-[0.625rem] text-white/30 mb-6">
              [ CHANNELS ]
            </p>
            <ul className="space-y-3 mb-8">
              {SOCIAL_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-white/75 text-lg hover:text-[#5CE1FF] transition-colors inline-flex items-baseline gap-2 group"
                  >
                    <span>{label}</span>
                    <span className="font-label text-[0.5625rem] text-white/20 group-hover:text-[#5CE1FF]/60 transition-colors">↗</span>
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="mailto:evanchang818@gmail.com"
              className="font-label text-xs text-[#5CE1FF]/80 hover:text-[#5CE1FF] transition-colors tracking-[0.15em]"
              style={{ textShadow: '0 0 10px rgba(92,225,255,0.4)' }}
            >
              evanchang818@gmail.com&nbsp;&nbsp;→
            </a>
          </div>
        </div>

        {/* ── Meta line ─────────────────────────────────── */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 font-label text-[0.625rem] text-white/30">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>©&nbsp;<CopyrightYear /> EVAN CHANG</span>
            <span className="hidden md:inline text-white/15">/</span>
            <span>ALL RIGHTS RESERVED</span>
            <span className="hidden md:inline text-white/15">/</span>
            <span className="text-[#5CE1FF]/50">SIG_ARCH&nbsp;v1.0</span>
          </div>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
