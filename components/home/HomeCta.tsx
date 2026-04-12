'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import HudCorners from '@/components/shared/HudCorners';

/**
 * Home CTA section. Sits between LocationsMap (#footprint) and Footer,
 * owns the `#cta` anchor for SectionNavigator. Uses HUD-framed container
 * with corner brackets so it reads as the closing beat of the home flow.
 */
export default function HomeCta() {
  const t = useTranslations('home');

  return (
    <section
      id="cta"
      className="relative py-32 md:py-44 px-6 md:px-10 bg-transparent"
    >
      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative px-8 md:px-16 py-16 md:py-24 border border-white/[0.08] text-center"
        >
          <HudCorners />

          <p
            className="font-label text-[11px] text-[#5CE1FF]/80 mb-8 tracking-[0.3em] uppercase"
            style={{ textShadow: '0 0 12px rgba(92,225,255,0.5)' }}
          >
            {t('cta_label')}
          </p>

          <h2
            className="text-white text-[33px] md:text-[55px] lg:text-[77px] leading-[1.05] mb-10"
            style={{
              fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
              fontWeight:          500,
              letterSpacing:       '-0.015em',
              WebkitFontSmoothing: 'antialiased',
              textShadow:          '0 0 24px rgba(8,8,8,0.85)',
            }}
          >
            {t('cta_heading')}
          </h2>

          <div className="flex flex-col items-center gap-6">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-4 px-8 py-4 border border-[#5CE1FF]/50 text-white hover:text-[#5CE1FF] hover:border-[#5CE1FF] transition-colors font-label text-[11px] tracking-[0.28em]"
              style={{ textShadow: '0 0 12px rgba(92,225,255,0.4)' }}
            >
              <span>{t('cta_button')}</span>
              <span className="inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
            <p
              className="text-white/45 text-[14px] max-w-md"
              style={{
                fontFamily:          'var(--font-geist), "Chiron Hei HK WS", sans-serif',
                WebkitFontSmoothing: 'antialiased',
              }}
            >
              {t('cta_desc')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
