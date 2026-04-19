import type {Metadata} from 'next';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {getMessages} from 'next-intl/server';
import {Geist, Fraunces, Noto_Serif_TC, Noto_Sans_TC} from 'next/font/google';
import localFont from 'next/font/local';
import EditorialMasthead from '@/components/shared/EditorialMasthead';
import DossierFooter from '@/components/dossier/DossierFooter';
import DossierHeader from '@/components/dossier/DossierHeader';
import CursorChip from '@/components/shared/CursorChip';
import RouteTransition from '@/components/shared/RouteTransition';
import GlobalAmbientBg from '@/components/shared/GlobalAmbientBg';
import { ContactComposeProvider } from '@/components/contact/ContactComposeContext';
import ContactComposeWidget from '@/components/contact/ContactComposeWidget';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '../globals.css';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
  display: 'swap',
});

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  axes: ['opsz', 'SOFT', 'WONK'],
  display: 'swap',
});

const departureMono = localFont({
  src: '../../public/fonts/DepartureMono-Regular.woff2',
  variable: '--font-departure-mono',
  weight: '400',
  style: 'normal',
  display: 'swap',
});

const notoSerifTC = Noto_Serif_TC({
  variable: '--font-noto-serif-tc',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const notoSansTC = Noto_Sans_TC({
  variable: '--font-noto-sans-tc',
  weight: ['400', '500', '700'],
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  return {
    title: 'The Level Studio',
    description:
      locale === 'zh-TW'
        ? '活動企劃 · 品牌體驗顧問'
        : 'Event Planning & Brand Experience Consulting',
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geist.variable} ${fraunces.variable} ${departureMono.variable} ${notoSerifTC.variable} ${notoSansTC.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ background: '#0B1026', color: '#FAFAF8' }}>
        <NextIntlClientProvider messages={messages}>
          <GlobalAmbientBg />
          <RouteTransition>
            <ContactComposeProvider>
              <EditorialMasthead />
              <main className="flex-1 pt-11">
                <DossierHeader />
                {children}
              </main>
              <DossierFooter />
              <CursorChip />
              <ContactComposeWidget locale={locale as 'zh-TW' | 'en-US'} />
            </ContactComposeProvider>
          </RouteTransition>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
