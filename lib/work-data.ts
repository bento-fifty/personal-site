export type EventType = 'BRAND' | 'EVENT' | 'CORP' | 'OTHER';

export interface CaseStat {
  label: string;
  labelEn: string;
  value: string;
}

export interface Case {
  id: string;
  slug: string;
  type: EventType;
  title: string;
  titleEn: string;
  client: string;
  date: string;       // YYYY-MM
  desc: string;
  descEn: string;
  featured: boolean;
  stats: CaseStat[];
  videoUrl: string;
  description: string;
  descriptionEn: string;
}

export const CASES: Case[] = [
  {
    id: '001',
    slug: 'brand-immersive-2024',
    type: 'BRAND',
    title: '品牌沈浸體驗',
    titleEn: 'Brand Immersive Experience',
    client: '品牌客戶 A',
    date: '2024-06',
    desc: '線下沈浸式場景設計與全程執行',
    descEn: 'Full-service offline immersive environment design & production',
    featured: true,
    stats: [
      { label: '參與人數', labelEn: 'Attendees',  value: '2,000+' },
      { label: '媒體露出', labelEn: 'Media Hits', value: '50+'    },
      { label: 'NPS',     labelEn: 'NPS',         value: '92'     },
    ],
    videoUrl: '',
    description: '此案例內容尚待填入。這裡將說明活動背景、執行挑戰與解決方案，以及最終成果。',
    descriptionEn: 'Case description pending. This section will cover event background, execution challenges, solutions, and outcomes.',
  },
  {
    id: '002',
    slug: 'outdoor-concert-2024',
    type: 'EVENT',
    title: '大型戶外演唱會',
    titleEn: 'Large-Scale Outdoor Concert',
    client: '品牌客戶 B',
    date: '2024-09',
    desc: '千人以上戶外演唱活動全程統籌',
    descEn: 'End-to-end management for 1,000+ outdoor concert',
    featured: true,
    stats: [
      { label: '入場人數', labelEn: 'Attendees',  value: '3,500+' },
      { label: '直播觀看', labelEn: 'Live Views',  value: '12,000+' },
      { label: '執行天數', labelEn: 'Days On-Site', value: '5'    },
    ],
    videoUrl: '',
    description: '此案例內容尚待填入。',
    descriptionEn: 'Case description pending.',
  },
  {
    id: '003',
    slug: 'corporate-conference-2024',
    type: 'CORP',
    title: '企業年度大會',
    titleEn: 'Corporate Annual Conference',
    client: '品牌客戶 C',
    date: '2024-11',
    desc: '跨部門溝通活化工作坊設計與執行',
    descEn: 'Cross-department engagement workshop design & facilitation',
    featured: false,
    stats: [
      { label: '參與員工', labelEn: 'Participants', value: '800+' },
      { label: '滿意度',   labelEn: 'Satisfaction', value: '96%'  },
      { label: '互動環節', labelEn: 'Activities',   value: '12'   },
    ],
    videoUrl: '',
    description: '此案例內容尚待填入。',
    descriptionEn: 'Case description pending.',
  },
];

export const EVENT_TYPES: {
  value: EventType | 'ALL';
  labelZh: string;
  labelEn: string;
}[] = [
  { value: 'ALL',   labelZh: '全部',   labelEn: 'All'         },
  { value: 'BRAND', labelZh: '品牌活動', labelEn: 'Brand'      },
  { value: 'EVENT', labelZh: '大型實體', labelEn: 'Large-Scale' },
  { value: 'CORP',  labelZh: '企業活動', labelEn: 'Corporate'  },
];

export function getCaseBySlug(slug: string): Case | undefined {
  return CASES.find((c) => c.slug === slug);
}
