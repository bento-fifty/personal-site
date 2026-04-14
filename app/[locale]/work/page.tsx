import type { Metadata } from 'next';
import ArchivePage from '@/components/work/ArchivePage';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'zh-TW' ? 'ARCHIVE — The Level Studio' : 'Archive — The Level Studio',
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = (locale === 'en-US' ? 'en-US' : 'zh-TW') as 'zh-TW' | 'en-US';
  return <ArchivePage locale={l} />;
}
