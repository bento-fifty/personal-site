import type {Metadata} from 'next';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import {getMessages} from 'next-intl/server';
import {Geist, Noto_Serif_TC, Noto_Sans_TC} from 'next/font/google';
import localFont from 'next/font/local';
import Nav from '@/components/layout/Nav';
import Footer from '@/components/layout/Footer';
import TerminalCursor from '@/components/shared/TerminalCursor';
import { NavThemeProvider } from '@/contexts/NavThemeContext';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '../globals.css';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
  display: 'swap',
});

const departureMono = localFont({
  src: '../../public/fonts/DepartureMono-Regular.woff2',
  variable: '--font-departure-mono',
  weight: '400',
  style: 'normal',
  display: 'swap',
});

const cubic11 = localFont({
  src: '../../public/fonts/Cubic_11.woff2',
  variable: '--font-cubic-11',
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
    title: 'Evan Chang',
    description:
      locale === 'zh-TW'
        ? '活動企劃 · 品牌體驗顧問'
        : 'Event Planner & Brand Experience Consultant',
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
      className={`${geist.variable} ${departureMono.variable} ${cubic11.variable} ${notoSerifTC.variable} ${notoSansTC.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <NavThemeProvider>
            <Nav />
            <main className="flex-1 pt-14">
              {children}
            </main>
            <Footer />
            <TerminalCursor />
          </NavThemeProvider>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
