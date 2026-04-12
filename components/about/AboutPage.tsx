'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import DarkNavActivator from '@/components/home/DarkNavActivator';
import HomeAmbientBg from '@/components/home/HomeAmbientBg';
import HudCorners from '@/components/shared/HudCorners';

/**
 * /about page. Keeps the home aesthetic (pixel-first typography, cyber-HUD,
 * dark ambient bg) so the inner page feels like a continuation of the
 * marketing surface, not a different site.
 *
 * Sections:
 *   hero quote  →  bio  →  services  →  process  →  CTA
 *
 * Section IDs match a future /about SectionNavigator if we add one.
 */
export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <>
      <DarkNavActivator />
      <HomeAmbientBg />

      <main className="relative text-white">
        <HeroQuote t={t} />
        <BioSection t={t} />
        <ServicesSection t={t} />
        <ProcessSection t={t} />
        <CtaSection t={t} />
      </main>
    </>
  );
}

type T = ReturnType<typeof useTranslations<'about'>>;

// ── Section 1 · Hero quote ──────────────────────────────
function HeroQuote({ t }: { t: T }) {
  return (
    <section
      id="about-hero"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-14 px-6 md:px-10"
    >
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
          className="font-label text-[11px] text-[#5CE1FF]/80 mb-10 tracking-[0.3em]"
          style={{ textShadow: '0 0 12px rgba(92,225,255,0.5)' }}
        >
          {t('meta_label')}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          className="text-white text-[33px] md:text-[55px] lg:text-[77px] leading-[1.08]"
          style={{
            fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
            fontWeight:          500,
            letterSpacing:       '-0.015em',
            WebkitFontSmoothing: 'antialiased',
          }}
        >
          {t('hero_h1_line1')}
          <br />
          {t('hero_h1_line2')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.85 }}
          className="mt-8 text-white/40 text-[22px] md:text-[33px]"
          style={{
            fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
            fontWeight:          400,
            letterSpacing:       '-0.01em',
            WebkitFontSmoothing: 'antialiased',
          }}
        >
          {t('hero_h1_en')}
        </motion.p>
      </div>
    </section>
  );
}

// ── Section 2 · Bio ─────────────────────────────────────
function BioSection({ t }: { t: T }) {
  return (
    <section id="about-bio" className="relative py-28 md:py-36 px-6 md:px-10">
      <div className="relative max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="font-label text-[11px] text-[#5CE1FF]/75 mb-6 tracking-[0.28em]"
          style={{ textShadow: '0 0 12px rgba(92,225,255,0.45)' }}
        >
          {t('bio_label')}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 md:gap-20 items-start">
          {/* Copy column */}
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-white text-[33px] md:text-[44px] lg:text-[55px] leading-[1.05] mb-10"
              style={{
                fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
                fontWeight:          500,
                letterSpacing:       '-0.015em',
                WebkitFontSmoothing: 'antialiased',
              }}
            >
              {t('bio_heading')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.12 }}
              className="text-white/70 text-[15px] md:text-[17px] leading-[1.75] max-w-prose"
              style={{
                fontFamily:          'var(--font-geist), "Chiron Hei HK WS", sans-serif',
                WebkitFontSmoothing: 'antialiased',
              }}
            >
              {t('bio_paragraph')}
            </motion.p>
          </div>

          {/* Portrait placeholder — empty HUD frame until a real photo is added */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="relative w-full md:w-[260px] aspect-[3/4] flex-shrink-0"
          >
            <HudCorners />
            <div className="absolute inset-0 border border-white/[0.08] bg-white/[0.02]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-label text-[9px] text-white/25 tracking-[0.25em]">
                [ PORTRAIT // TBD ]
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Section 3 · Services ────────────────────────────────
function ServicesSection({ t }: { t: T }) {
  const services = [
    {
      tag:   t('service_brand_tag'),
      title: t('service_brand_title'),
      desc:  t('service_brand_desc'),
      stat:  t('service_brand_stat'),
    },
    {
      tag:   t('service_event_tag'),
      title: t('service_event_title'),
      desc:  t('service_event_desc'),
      stat:  t('service_event_stat'),
    },
    {
      tag:   t('service_corp_tag'),
      title: t('service_corp_title'),
      desc:  t('service_corp_desc'),
      stat:  t('service_corp_stat'),
    },
  ];

  return (
    <section id="about-services" className="relative py-28 md:py-36 px-6 md:px-10">
      <div className="relative max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="font-label text-[11px] text-[#5CE1FF]/75 mb-6 tracking-[0.28em]"
          style={{ textShadow: '0 0 12px rgba(92,225,255,0.45)' }}
        >
          {t('services_label')}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-white text-[33px] md:text-[44px] lg:text-[55px] leading-[1.05] mb-16 max-w-3xl"
          style={{
            fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
            fontWeight:          500,
            letterSpacing:       '-0.015em',
            WebkitFontSmoothing: 'antialiased',
          }}
        >
          {t('services_heading')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {services.map((s, i) => (
            <motion.div
              key={s.tag}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
              className="relative p-6 md:p-7 border border-white/[0.08] hover:border-[#5CE1FF]/40 transition-colors group"
            >
              <HudCorners />
              <span className="font-label text-[11px] text-[#5CE1FF]/80 tracking-[0.28em] mb-6 inline-block">
                [ {s.tag} ]
              </span>
              <h3
                className="text-white text-[22px] md:text-[33px] leading-[1.1] mb-4"
                style={{
                  fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
                  fontWeight:          500,
                  letterSpacing:       '-0.015em',
                  WebkitFontSmoothing: 'antialiased',
                }}
              >
                {s.title}
              </h3>
              <p
                className="text-white/60 text-[14px] leading-[1.7] mb-8"
                style={{
                  fontFamily:          'var(--font-geist), "Chiron Hei HK WS", sans-serif',
                  WebkitFontSmoothing: 'antialiased',
                }}
              >
                {s.desc}
              </p>
              <div className="pt-5 border-t border-white/[0.06] group-hover:border-[#5CE1FF]/25 transition-colors">
                <span className="font-label text-[11px] text-[#5CE1FF]/70 tracking-[0.2em]">
                  {s.stat}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 4 · Process ─────────────────────────────────
function ProcessSection({ t }: { t: T }) {
  const steps = [
    { num: t('step_1_num'), title: t('step_1_title'), zh: t('step_1_zh'), desc: t('step_1_desc') },
    { num: t('step_2_num'), title: t('step_2_title'), zh: t('step_2_zh'), desc: t('step_2_desc') },
    { num: t('step_3_num'), title: t('step_3_title'), zh: t('step_3_zh'), desc: t('step_3_desc') },
  ];

  return (
    <section id="about-process" className="relative py-28 md:py-36 px-6 md:px-10">
      <div className="relative max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="font-label text-[11px] text-[#5CE1FF]/75 mb-6 tracking-[0.28em]"
          style={{ textShadow: '0 0 12px rgba(92,225,255,0.45)' }}
        >
          {t('process_label')}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-white text-[33px] md:text-[44px] lg:text-[55px] leading-[1.05] mb-16 max-w-3xl"
          style={{
            fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
            fontWeight:          500,
            letterSpacing:       '-0.015em',
            WebkitFontSmoothing: 'antialiased',
          }}
        >
          {t('process_heading')}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 relative">
          {/* Connecting line between steps (desktop only) */}
          <div
            aria-hidden
            className="hidden md:block absolute top-[77px] left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-[#5CE1FF]/25 to-transparent pointer-events-none"
          />
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
              className="relative"
            >
              <p
                className="text-[#5CE1FF] text-[44px] md:text-[66px] leading-none mb-4 tabular-nums"
                style={{
                  fontFamily:          'var(--font-mono), monospace',
                  textShadow:          '0 0 18px rgba(92,225,255,0.4)',
                  WebkitFontSmoothing: 'none',
                }}
              >
                {step.num}
              </p>
              <h3
                className="text-white text-[22px] md:text-[33px] leading-[1.1] mb-2"
                style={{
                  fontFamily:          'var(--font-geist), sans-serif',
                  fontWeight:          500,
                  letterSpacing:       '-0.015em',
                  WebkitFontSmoothing: 'antialiased',
                }}
              >
                {step.title}
              </h3>
              <p className="font-label text-[11px] text-white/40 tracking-[0.22em] mb-5">
                {step.zh}
              </p>
              <p
                className="text-white/60 text-[14px] leading-[1.7] max-w-sm"
                style={{
                  fontFamily:          'var(--font-geist), "Chiron Hei HK WS", sans-serif',
                  WebkitFontSmoothing: 'antialiased',
                }}
              >
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 5 · CTA ─────────────────────────────────────
function CtaSection({ t }: { t: T }) {
  return (
    <section id="about-cta" className="relative py-32 md:py-40 px-6 md:px-10">
      <div className="relative max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="font-label text-[11px] text-[#5CE1FF]/80 mb-8 tracking-[0.3em]"
          style={{ textShadow: '0 0 12px rgba(92,225,255,0.5)' }}
        >
          {t('cta_label')}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-white text-[33px] md:text-[55px] lg:text-[77px] leading-[1.05] mb-10"
          style={{
            fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
            fontWeight:          500,
            letterSpacing:       '-0.015em',
            WebkitFontSmoothing: 'antialiased',
          }}
        >
          {t('cta_heading')}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
          className="flex flex-col items-center gap-5"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-4 px-7 py-4 border border-[#5CE1FF]/50 text-white hover:text-[#5CE1FF] hover:border-[#5CE1FF] transition-colors font-label text-[11px] tracking-[0.28em]"
            style={{ textShadow: '0 0 12px rgba(92,225,255,0.4)' }}
          >
            <span>{t('cta_button')}</span>
            <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <p
            className="text-white/45 text-[14px] max-w-sm"
            style={{
              fontFamily:          'var(--font-geist), "Chiron Hei HK WS", sans-serif',
              WebkitFontSmoothing: 'antialiased',
            }}
          >
            {t('cta_desc')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

