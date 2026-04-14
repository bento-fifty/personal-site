import AboutPage from '@/components/about/AboutPage';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = (locale === 'en-US' ? 'en-US' : 'zh-TW') as 'zh-TW' | 'en-US';
  return <AboutPage locale={l} />;
}
