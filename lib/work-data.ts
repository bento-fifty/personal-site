import type { LocationKey } from './locations';

export type EventType = 'BRAND' | 'EVENT' | 'CORP' | 'OTHER';

export interface CaseStat {
  label: string;
  labelEn: string;
  value: string;
}

/** Bilingual free-text block for case detail OSER sections. */
export interface LocalizedText {
  zh: string;
  en: string;
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
  /** Taiwan city key — referenced by LocationsMap to render pin + link */
  location?: LocationKey;

  // ── Case detail OSER fields ──────────────────────────
  // Objective → Strategy → Execution → Result. All optional so existing
  // cases keep working; the detail page falls back to "content pending"
  // for any missing field.
  objective?: LocalizedText;
  strategy?:  LocalizedText;
  execution?: LocalizedText;
  result?:    LocalizedText;
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
    location: 'taipei',
    stats: [
      { label: '參與人數', labelEn: 'Attendees',  value: '2,000+' },
      { label: '媒體露出', labelEn: 'Media Hits', value: '50+'    },
      { label: 'NPS',     labelEn: 'NPS',         value: '92'     },
    ],
    videoUrl: '',
    description: '此案例內容尚待填入。這裡將說明活動背景、執行挑戰與解決方案，以及最終成果。',
    descriptionEn: 'Case description pending. This section will cover event background, execution challenges, solutions, and outcomes.',
    // TODO: Evan — replace sample copy below with real case details before launch.
    objective: {
      zh: '客戶希望用最低媒體預算製造最大聲量——在不投放大量廣告的前提下，讓目標受眾願意花時間到場體驗，並且離開後願意主動在自己的社群分享。',
      en: 'Client wanted maximum buzz on a constrained media budget — get target audiences to visit on their own volition and share the experience organically afterward.',
    },
    strategy: {
      zh: '我們把「可分享」而不是「好看」當成場景設計的主要 KPI。動線設計成一條必經敘事路徑，每個節點都安排一個被設計過的拍照可能性，讓來賓在不自覺間成為內容產生者。',
      en: 'We treated shareability — not aesthetics — as the primary design KPI. The floor flow became a single narrative path with deliberate photo moments at each node, turning guests into organic content creators.',
    },
    execution: {
      zh: '3 週前期概念與視覺開發，2 週場地佈建，活動當天全程 14 小時現場統籌。包含 KOL 預覽場、媒體專場、公眾體驗場，每一場的節奏、燈光、音樂都獨立設定。',
      en: '3 weeks of concept and visual development, 2 weeks of on-site build, 14 hours of live on-site management on event day. Covered a KOL soft launch, media preview, and public experience window — each tuned separately for pacing, lighting, and sound.',
    },
    result: {
      zh: '2,000+ 人次完整走完體驗動線，媒體自然露出 50+ 篇，NPS 92 — 遠高於活動類品牌專案的平均值。關鍵在於：來賓離開時，帶走的是一個只屬於當晚的記憶。',
      en: '2,000+ guests completed the full walkthrough. 50+ earned media mentions. NPS of 92 — well above the average for brand experiential work. The real win: every guest left with a memory that only belonged to that night.',
    },
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
    location: 'kaohsiung',
    stats: [
      { label: '入場人數', labelEn: 'Attendees',   value: '3,500+'  },
      { label: '直播觀看', labelEn: 'Live Views',  value: '12,000+' },
      { label: '執行天數', labelEn: 'Days On-Site', value: '5'      },
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
    featured: true,
    location: 'taichung',
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

/** Cases that have a location tag — consumed by LocationsMap to render pins. */
export function getCasesWithLocation(): (Case & { location: LocationKey })[] {
  return CASES.filter((c): c is Case & { location: LocationKey } => Boolean(c.location));
}
