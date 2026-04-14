import ContactPage from '@/components/contact/ContactPage';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = (locale === 'en-US' ? 'en-US' : 'zh-TW') as 'zh-TW' | 'en-US';
  return <ContactPage locale={l} />;
}
