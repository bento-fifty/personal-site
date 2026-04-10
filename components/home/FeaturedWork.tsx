import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const FEATURED_CASES = [
  {
    id: '001',
    type: 'BRAND',
    title: '品牌沈浸體驗',
    titleEn: 'Brand Immersive Experience',
    desc: '線下沈浸式場景設計與執行',
    descEn: 'Offline immersive environment design & production',
    slug: 'brand-experience',
  },
  {
    id: '002',
    type: 'EVENT',
    title: '大型演唱會統籌',
    titleEn: 'Large-Scale Concert Production',
    desc: '千人以上戶外演唱活動全程統籌',
    descEn: 'End-to-end management for 1,000+ outdoor concerts',
    slug: 'concert-production',
  },
  {
    id: '003',
    type: 'CORP',
    title: '企業年度大會',
    titleEn: 'Corporate Annual Conference',
    desc: '跨部門溝通活化工作坊設計',
    descEn: 'Cross-department engagement workshop design',
    slug: 'corporate-conference',
  },
] as const;

export default function FeaturedWork() {
  const t = useTranslations('home');

  return (
    <section className="bg-[#080808] pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <p className="font-label text-white/20 text-[0.625rem] mb-16 pt-24">
          {'// SELECTED_WORK'}
        </p>

        {/* Case grid */}
        <div className="grid md:grid-cols-3 gap-px bg-[rgba(255,255,255,0.05)]">
          {FEATURED_CASES.map((c) => (
            <Link
              key={c.id}
              href={`/work/${c.slug}`}
              className="group bg-[#080808] p-8 block"
            >
              {/* Header row */}
              <div className="flex items-center gap-3 mb-10">
                <span className="case-number">{c.id} /</span>
                <span className="font-label text-white/20 text-[0.625rem]">[ {c.type} ]</span>
              </div>

              {/* Placeholder image */}
              <div className="aspect-[4/3] bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-8 overflow-hidden">
                <span className="font-label text-white/[0.07] text-[0.5rem]">
                  IMG_{c.id}
                </span>
              </div>

              {/* Title + desc */}
              <h3 className="font-display text-white text-2xl font-light leading-snug mb-2 group-hover:text-[#C8A96E] transition-colors">
                {c.title}
              </h3>
              <p className="font-label text-white/30 text-[0.625rem]">{c.desc}</p>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link
            href="/work"
            className="inline-block font-label text-[0.6875rem] border border-white/20 text-white/50 px-10 py-4 hover:border-[#C8A96E] hover:text-[#C8A96E] transition-colors"
          >
            {t('cta_work')} →
          </Link>
        </div>
      </div>
    </section>
  );
}
