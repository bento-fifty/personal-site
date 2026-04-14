import IssueCover from '@/components/home/IssueCover';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = (locale === 'en-US' ? 'en-US' : 'zh-TW') as 'zh-TW' | 'en-US';
  return <IssueCover locale={l} />;
}
