'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import DarkNavActivator from '@/components/home/DarkNavActivator';
import HomeAmbientBg from '@/components/home/HomeAmbientBg';
import HudCorners from '@/components/shared/HudCorners';

type ChannelKey = 'email' | 'line' | 'phone' | 'whatsapp';

interface ContactChannel {
  key: ChannelKey;
  handle: string;
  href: string;
  external: boolean;
}

// Data-driven channel list — append a new entry to add a new channel.
// Email is live. Line / phone / WhatsApp are placeholders — swap the
// `handle` and `href` fields below with Evan's real values before launch.
const CHANNELS: ContactChannel[] = [
  {
    key:      'email',
    handle:   'evanchang818@gmail.com',
    href:     'mailto:evanchang818@gmail.com',
    external: false,
  },
  {
    key:      'line',
    handle:   '@evanchang',            // TODO: real Line ID
    href:     'https://line.me/ti/p/~evanchang',
    external: true,
  },
  {
    key:      'phone',
    handle:   '+886 9XX XXX XXX',      // TODO: real phone
    href:     'tel:+8869XXXXXXXX',
    external: false,
  },
  {
    key:      'whatsapp',
    handle:   '+886 9XX XXX XXX',      // TODO: real WhatsApp
    href:     'https://wa.me/8869XXXXXXXX',
    external: true,
  },
];

export default function ContactPage() {
  const t = useTranslations('contact');

  return (
    <>
      <DarkNavActivator />
      <HomeAmbientBg />

      <main className="relative text-white">
        <section
          id="contact-reach"
          className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center overflow-hidden pt-20 md:pt-24 pb-24 px-6 md:px-10"
        >
          <div className="relative z-10 max-w-5xl mx-auto w-full">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              className="font-label text-[11px] text-[#5CE1FF]/80 mb-10 tracking-[0.3em] text-center"
              style={{ textShadow: '0 0 12px rgba(92,225,255,0.5)' }}
            >
              {t('meta_label')}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="text-white text-[33px] md:text-[55px] lg:text-[77px] leading-[1.08] text-center mb-8"
              style={{
                fontFamily:          'var(--font-geist), "Chiron Sung HK WS", sans-serif',
                fontWeight:          500,
                letterSpacing:       '-0.015em',
                WebkitFontSmoothing: 'antialiased',
              }}
            >
              {t('heading_line1')}
              <br />
              {t('heading_line2')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.55 }}
              className="text-white/55 text-[15px] md:text-[17px] leading-[1.7] text-center max-w-xl mx-auto mb-16"
              style={{
                fontFamily:          'var(--font-geist), "Chiron Hei HK WS", sans-serif',
                WebkitFontSmoothing: 'antialiased',
              }}
            >
              {t('subheading')}
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 max-w-3xl mx-auto">
              {CHANNELS.map((channel, i) => (
                <motion.a
                  key={channel.key}
                  href={channel.href}
                  target={channel.external ? '_blank' : undefined}
                  rel={channel.external ? 'noreferrer' : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.65 + i * 0.08 }}
                  className="group relative block p-6 md:p-7 border border-white/[0.08] hover:border-[#5CE1FF]/50 transition-colors"
                >
                  <HudCorners />
                  <span className="font-label text-[11px] text-[#5CE1FF]/80 tracking-[0.28em] uppercase mb-4 inline-block">
                    [ {t(`channel_${channel.key}_label`)} ]
                  </span>
                  <div
                    className="text-white text-[17px] md:text-[20px] leading-[1.3] break-all"
                    style={{
                      fontFamily:          'var(--font-mono), monospace',
                      WebkitFontSmoothing: 'none',
                    }}
                  >
                    {channel.handle}
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between group-hover:border-[#5CE1FF]/25 transition-colors">
                    <span className="font-label text-[11px] text-white/35 tracking-[0.2em] group-hover:text-[#5CE1FF]/80 transition-colors">
                      OPEN&nbsp;→
                    </span>
                    <span
                      aria-hidden
                      className="inline-block w-2 h-2 bg-[#5CE1FF]/50 rounded-full"
                      style={{ boxShadow: '0 0 8px rgba(92,225,255,0.5)' }}
                    />
                  </div>
                </motion.a>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 1.1 }}
              className="mt-12 text-center font-label text-[11px] text-white/40 tracking-[0.22em]"
            >
              {t('reply_note')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 1.3 }}
              className="mt-10 text-center"
            >
              <Link
                href="/"
                className="font-label text-[11px] text-white/40 hover:text-[#5CE1FF] tracking-[0.28em] transition-colors"
              >
                {t('back_to_home')}
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
