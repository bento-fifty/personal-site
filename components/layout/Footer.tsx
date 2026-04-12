import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import CopyrightYear from './CopyrightYear';
import BackToTop from './BackToTop';

const NAV_LINKS = [
  { key: 'about', href: '/about' as const },
  { key: 'work',  href: '/work'  as const },
  { key: 'blog',  href: '/blog'  as const },
] as const;

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'LinkedIn',  href: 'https://linkedin.com' },
] as const;

export default async function Footer() {
  const t = await getTranslations('nav');
  return (
    <footer className="bg-[#0C0C0E] text-[#EAEAE8] overflow-hidden">
      {/* ── CTA hero block ──────────────────────────── */}
      <div className="relative max-w-[1200px] mx-auto px-6 md:px-10 pt-28 pb-24">
        {/* Large decorative brand watermark */}
        <p
          aria-hidden
          className="absolute top-8 left-6 md:left-10 text-[clamp(80px,14vw,180px)] font-bold leading-none select-none pointer-events-none"
          style={{
            fontFamily: 'var(--font-playfair), serif',
            color: 'rgba(255,255,255,0.03)',
          }}
        >
          TLS
        </p>

        <p
          className="text-[10px] tracking-[0.3em] uppercase mb-6"
          style={{ color: '#888886', fontFamily: 'var(--font-departure-mono), monospace' }}
        >
          Let&apos;s connect
        </p>

        <h2
          className="text-[clamp(32px,6vw,56px)] leading-[1.1] mb-4"
          style={{
            fontFamily: 'var(--font-playfair), var(--font-noto-serif-tc), serif',
            fontWeight: 500,
          }}
        >
          Have a project<br />worth remembering?
        </h2>

        <p
          className="text-[15px] max-w-md mb-10"
          style={{ color: '#888886', fontFamily: 'var(--font-geist), sans-serif', lineHeight: 1.65 }}
        >
          Fill in a brief and I&apos;ll reply within 2 working days.
          Free 30-min strategy call included.
        </p>

        <a
          href="mailto:evanchang818@gmail.com"
          className="inline-flex items-center gap-3 group"
        >
          <span
            className="text-[13px] font-medium tracking-[0.08em] border-b border-[rgba(255,255,255,0.25)] pb-1 group-hover:border-[#818CF8] group-hover:text-[#818CF8] transition-colors"
            style={{ fontFamily: 'var(--font-geist), sans-serif' }}
          >
            evanchang818@gmail.com
          </span>
          <span className="text-[#888886] group-hover:text-[#818CF8] group-hover:translate-x-1 transition-all">&rarr;</span>
        </a>
      </div>

      {/* ── Divider ─────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="h-px bg-[rgba(255,255,255,0.06)]" />
      </div>

      {/* ── Footer grid ─────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-10 md:gap-16">
          {/* Brand */}
          <div>
            <p
              className="text-[14px] font-medium tracking-[0.12em] uppercase mb-3"
              style={{ fontFamily: 'var(--font-geist), sans-serif' }}
            >
              The Level Studio
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: '#6B6B67' }}>
              Event planning, production<br />
              &amp; brand experience consulting.<br />
              Based in Taipei.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <p
              className="text-[10px] tracking-[0.2em] uppercase mb-4"
              style={{ color: '#6B6B67', fontFamily: 'var(--font-departure-mono), monospace' }}
            >
              Navigate
            </p>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-[14px] text-[#888886] hover:text-[#EAEAE8] transition-colors"
                    style={{ fontFamily: 'var(--font-geist), sans-serif' }}
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p
              className="text-[10px] tracking-[0.2em] uppercase mb-4"
              style={{ color: '#6B6B67', fontFamily: 'var(--font-departure-mono), monospace' }}
            >
              Channels
            </p>
            <ul className="flex flex-col gap-3">
              {SOCIAL_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] text-[#888886] hover:text-[#EAEAE8] transition-colors"
                    style={{ fontFamily: 'var(--font-geist), sans-serif' }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 pb-8">
        <div className="h-px bg-[rgba(255,255,255,0.06)] mb-6" />
        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px]"
          style={{ color: '#6B6B67', fontFamily: 'var(--font-geist), sans-serif' }}
        >
          <span>&copy;&nbsp;<CopyrightYear />&nbsp;The Level Studio. All rights reserved.</span>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
