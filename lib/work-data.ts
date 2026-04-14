import type { LocationKey } from './locations';

export type EventType = 'BRAND' | 'CONFERENCE' | 'POPUP' | 'LAUNCH' | 'GALA' | 'CORPORATE';

export interface CaseStat {
  label: string;
  labelEn: string;
  value: string;
}

export interface LocalizedText {
  zh: string;
  en: string;
}

export interface CasePhoto {
  src: string;
  alt: string;
  aspect: 'wide' | 'square' | 'portrait';
  role: 'hero' | 'detail' | 'bts';
}

export type ClusterLayout = 'a' | 'b' | 'c' | 'd';

export interface Case {
  id: string;                          // 3-digit, e.g. '042'
  slug: string;
  issueRef: string;                    // EDI-TLS-{id}
  title: string;                       // zh
  titleEn: string;
  client: string;
  year: number;                        // 4-digit
  scale: string;                       // e.g. "3,500 GUESTS"
  types: EventType[];                  // can belong to multiple categories
  roles: string[];                     // ['Principal', 'Producer']
  venue: string;
  location?: LocationKey;
  lead?: LocalizedText;
  objective?: LocalizedText;
  strategy?: LocalizedText;
  execution?: LocalizedText;
  result?: LocalizedText;
  stats: CaseStat[];
  photos: CasePhoto[];
  clusterLayout: ClusterLayout;
  featured: boolean;

  // Legacy compat (older code paths still reference these)
  type?: EventType;
  date?: string;
  desc?: string;
  descEn?: string;
  description?: string;
  descriptionEn?: string;
  videoUrl?: string;
}

// Placeholder photo generator — solid color block with event id overlay
const photo = (id: string, aspect: CasePhoto['aspect'], role: CasePhoto['role'], hue: number): CasePhoto => ({
  src: `/api/placeholder/${id}/${aspect}/${hue}`,
  alt: `${id} ${role}`,
  aspect,
  role,
});

export const CASES: Case[] = [
  {
    id: '042',
    slug: 'brand-summit-vol2',
    issueRef: 'EDI-TLS-042',
    title: '品牌高峰會 Vol.2',
    titleEn: 'Brand Summit Vol.2',
    client: 'Confidential',
    year: 2025,
    scale: '3,500 GUESTS',
    types: ['BRAND', 'CONFERENCE'],
    roles: ['Principal', 'Producer'],
    venue: 'Taipei Arena',
    location: 'taipei',
    featured: true,
    clusterLayout: 'a',
    lead: {
      zh: '當品牌年會從單一主題簡報進化成跨媒介敘事現場，我們處理的是 3,500 人同時進入一個故事的可能性。',
      en: 'When a brand summit evolves from a single-keynote format into a multi-media storytelling stage, we are orchestrating the possibility of 3,500 people entering the same story simultaneously.',
    },
    objective: {
      zh: '客戶希望把年會轉型成「品牌信念實體化」的場合，而不只是業務成果發表。',
      en: 'Client wanted to convert the annual summit from a business results showcase into a physical manifestation of brand belief.',
    },
    strategy: {
      zh: '我們把會場規劃成三段式敘事：入場序幕、中場信念劇場、收尾共鳴儀式。每一段視覺、音樂、動線都獨立調校。',
      en: 'We planned the venue as a three-act narrative: arrival prelude, mid-show belief theatre, closing resonance ritual — each with independent visual, sonic, and circulation direction.',
    },
    execution: {
      zh: '4 週概念開發，3 週製作期，活動當天 18 小時現場統籌。20 家供應商、45 人執行團隊、8 台攝影機並行直播。',
      en: '4 weeks of concept development, 3 weeks of production, 18 hours of live management on show day. 20 suppliers coordinated, 45-person crew, 8-camera multi-feed live stream.',
    },
    result: {
      zh: '3,500 人全程留場率 94%，自發社群 UGC 超過 1,200 則，NPS 96。客戶首次把「我以公司為榮」寫進對外宣傳素材。',
      en: '94% guest retention across full 3-hour programme. 1,200+ organic UGC posts. NPS of 96. For the first time, client used employee-authored "I am proud of this company" quotes in outbound marketing.',
    },
    stats: [
      { label: '參與人數', labelEn: 'Attendees', value: '3,500' },
      { label: '留場率', labelEn: 'Retention', value: '94%' },
      { label: 'NPS', labelEn: 'NPS', value: '96' },
    ],
    photos: [
      photo('042', 'wide', 'hero', 15),
      photo('042', 'square', 'detail', 18),
      photo('042', 'portrait', 'detail', 20),
      photo('042', 'wide', 'bts', 12),
    ],
  },
  {
    id: '041',
    slug: 'taipei-future-forum-2025',
    issueRef: 'EDI-TLS-041',
    title: '台北未來論壇',
    titleEn: 'Taipei Future Forum',
    client: 'Confidential',
    year: 2025,
    scale: '1,200 DELEGATES',
    types: ['CONFERENCE'],
    roles: ['Principal', 'Stage Director'],
    venue: 'Taipei International Convention Center',
    location: 'taipei',
    featured: true,
    clusterLayout: 'b',
    lead: {
      zh: '國際論壇在台灣不少，但願意把「觀眾也是發言者」列入設計前提的很少。',
      en: 'International forums are common in Taiwan. Ones that treat the audience as a speaker — not a seat — are rare.',
    },
    stats: [
      { label: '講者', labelEn: 'Speakers', value: '28' },
      { label: '國家', labelEn: 'Countries', value: '14' },
      { label: '直播觀看', labelEn: 'Live Views', value: '42,000' },
    ],
    photos: [
      photo('041', 'wide', 'hero', 200),
      photo('041', 'square', 'detail', 210),
      photo('041', 'square', 'bts', 195),
    ],
  },
  {
    id: '040',
    slug: 'nike-neighborhood-popup',
    issueRef: 'EDI-TLS-040',
    title: 'Nike × Neighborhood 快閃',
    titleEn: 'Nike × Neighborhood Pop-Up',
    client: 'Nike Taiwan',
    year: 2025,
    scale: '3 DAYS · 8,000 VISITORS',
    types: ['POPUP', 'BRAND'],
    roles: ['Producer', 'Art Direction'],
    venue: 'Xinyi Anhe',
    location: 'taipei',
    featured: true,
    clusterLayout: 'c',
    lead: {
      zh: '快閃的陷阱是「網美造景」，我們選擇逆向：讓街頭文化本身當佈景。',
      en: 'The pop-up cliché is IG-bait sets. We inverted it — letting street culture itself be the backdrop.',
    },
    stats: [
      { label: '到場', labelEn: 'Visitors', value: '8,000' },
      { label: 'IG 標籤', labelEn: 'IG Tags', value: '2,400+' },
      { label: 'SKU 售罄', labelEn: 'Sold Out', value: '14' },
    ],
    photos: [
      photo('040', 'portrait', 'hero', 30),
      photo('040', 'wide', 'detail', 25),
      photo('040', 'square', 'bts', 35),
      photo('040', 'square', 'detail', 28),
    ],
  },
  {
    id: '039',
    slug: 'audi-etron-launch',
    issueRef: 'EDI-TLS-039',
    title: 'Audi e-tron 發表會',
    titleEn: 'Audi e-tron Launch',
    client: 'Audi Taiwan',
    year: 2024,
    scale: '600 GUESTS',
    types: ['LAUNCH', 'BRAND'],
    roles: ['Principal', 'Producer'],
    venue: 'Songshan Cultural Park',
    location: 'taipei',
    featured: true,
    clusterLayout: 'd',
    lead: {
      zh: '車的發表會容易被拍成型錄，我們把重點挪到駕駛的「第一公里」情緒。',
      en: 'Car launches too often read as brochures. We shifted the centre of gravity to the driver\'s first kilometre of emotion.',
    },
    stats: [
      { label: '媒體出席', labelEn: 'Media', value: '78' },
      { label: '試駕預約', labelEn: 'Test Drive', value: '340' },
      { label: '成交', labelEn: 'Closed', value: '52' },
    ],
    photos: [
      photo('039', 'wide', 'hero', 220),
      photo('039', 'portrait', 'detail', 210),
      photo('039', 'square', 'detail', 215),
    ],
  },
  {
    id: '038',
    slug: 'momofuku-taipei-gala',
    issueRef: 'EDI-TLS-038',
    title: 'Momofuku Taipei Gala',
    titleEn: 'Momofuku Taipei Gala',
    client: 'Momofuku x Taipei',
    year: 2024,
    scale: '280 GUESTS',
    types: ['GALA'],
    roles: ['Principal', 'Creative Director'],
    venue: 'Taipei Guest House',
    location: 'taipei',
    featured: true,
    clusterLayout: 'a',
    stats: [
      { label: '廚師', labelEn: 'Chefs', value: '12' },
      { label: '道次', labelEn: 'Courses', value: '9' },
      { label: '捐款', labelEn: 'Donation', value: 'NT$4.2M' },
    ],
    photos: [
      photo('038', 'square', 'hero', 10),
      photo('038', 'wide', 'detail', 14),
      photo('038', 'portrait', 'bts', 8),
    ],
  },
  {
    id: '037',
    slug: 'corporate-summit-2024',
    issueRef: 'EDI-TLS-037',
    title: '企業年度大會',
    titleEn: 'Corporate Annual Summit',
    client: 'Confidential',
    year: 2024,
    scale: '800 EMPLOYEES',
    types: ['CORPORATE', 'CONFERENCE'],
    roles: ['Producer'],
    venue: 'Taichung International Expo Center',
    location: 'taichung',
    featured: false,
    clusterLayout: 'b',
    stats: [
      { label: '參與員工', labelEn: 'Participants', value: '800+' },
      { label: '滿意度', labelEn: 'Satisfaction', value: '96%' },
      { label: '互動環節', labelEn: 'Activities', value: '12' },
    ],
    photos: [
      photo('037', 'wide', 'hero', 180),
      photo('037', 'square', 'detail', 170),
    ],
  },
];

export const EVENT_TYPES: { value: EventType | 'ALL'; labelZh: string; labelEn: string }[] = [
  { value: 'ALL',        labelZh: '全部',     labelEn: 'All'         },
  { value: 'BRAND',      labelZh: '品牌',     labelEn: 'Brand'       },
  { value: 'CONFERENCE', labelZh: '論壇',     labelEn: 'Conference'  },
  { value: 'POPUP',      labelZh: '快閃',     labelEn: 'Pop-Up'      },
  { value: 'LAUNCH',     labelZh: '發表',     labelEn: 'Launch'      },
  { value: 'GALA',       labelZh: '晚宴',     labelEn: 'Gala'        },
  { value: 'CORPORATE',  labelZh: '企業',     labelEn: 'Corporate'   },
];

export function getCaseBySlug(slug: string): Case | undefined {
  return CASES.find((c) => c.slug === slug);
}

export function getCasesWithLocation(): (Case & { location: LocationKey })[] {
  return CASES.filter((c): c is Case & { location: LocationKey } => Boolean(c.location));
}

export function countByType(type: EventType | 'ALL', year?: number | 'ALL'): number {
  return CASES.filter((c) => {
    const typeMatch = type === 'ALL' || c.types.includes(type);
    const yearMatch = !year || year === 'ALL' || c.year === year;
    return typeMatch && yearMatch;
  }).length;
}

export const YEARS: (number | 'ALL')[] = ['ALL', 2026, 2025, 2024, 2023];
