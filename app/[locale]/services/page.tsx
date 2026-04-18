import type { Metadata } from 'next';
import ServicesPage from '@/components/services/ServicesPage';

export const metadata: Metadata = {
  title: 'Services — The Level Studio',
};

export default async function ServicesRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <ServicesPage locale={locale as 'zh-TW' | 'en-US'} />;
}
