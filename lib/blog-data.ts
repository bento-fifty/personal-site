export type TxStatus = 'LIVE' | 'ARCHIVED' | 'CLASSIFIED' | 'DRAFT';

export interface Transmission {
  id: string; // "N°001"
  freq: string; // "87.4 MHz" — decorative
  tag: string; // category band
  topic: { zh: string; en: string };
  lede: { zh: string; en: string };
  location: string; // "TPE · XINYI"
  date: string; // "2026.04.12"
  duration: string; // read time "12 min"
  signalBars: number; // 0–4
  status: TxStatus;
  slug?: string; // link to /blog/[slug] when published
}

export const TRANSMISSIONS: Transmission[] = [
  {
    id: 'N°001',
    freq: '87.4 MHz',
    tag: 'FIELD_OPS',
    topic: {
      zh: '一場活動的節奏',
      en: 'The rhythm of a live event',
    },
    lede: {
      zh: '為什麼有些活動感覺「順」、有些感覺「卡」— 其實跟內容關係不大，是時間切分的問題。',
      en: 'Why some events feel "smooth" and others feel "stuck" — has less to do with content, more with how time is divided.',
    },
    location: 'TPE · XINYI',
    date: '2026.04.12',
    duration: '12 min',
    signalBars: 4,
    status: 'DRAFT',
  },
  {
    id: 'N°002',
    freq: '104.1 MHz',
    tag: 'PROCESS',
    topic: {
      zh: '從 brief 到現場',
      en: 'From brief to show call',
    },
    lede: {
      zh: '一張 brief 到現場 cue sheet 中間發生什麼？我們內部怎麼把一句話變成 80 頁的執行手冊。',
      en: 'What happens between a one-page brief and the show call? How we turn one sentence into an 80-page run manual.',
    },
    location: 'TPE · DAAN',
    date: '2026.03.28',
    duration: '18 min',
    signalBars: 3,
    status: 'DRAFT',
  },
  {
    id: 'N°003',
    freq: '91.7 MHz',
    tag: 'ESSAY',
    topic: {
      zh: '為什麼要辦活動',
      en: 'Why make events at all',
    },
    lede: {
      zh: '在所有行銷動作裡，活動是成本最高、衰減最快的一種。那為什麼還要做？',
      en: 'Of all marketing moves, events are the most expensive and the fastest to fade. So why do them at all?',
    },
    location: 'TPE · SONGSHAN',
    date: '2026.03.05',
    duration: '9 min',
    signalBars: 4,
    status: 'DRAFT',
  },
  {
    id: 'N°004',
    freq: '98.2 MHz',
    tag: 'INCIDENT',
    topic: {
      zh: '那次下雨的品牌 popup',
      en: 'The popup that got rained on',
    },
    lede: {
      zh: '戶外活動遇到颱風外圍 — 取消 / 縮時 / 硬上，三個選項怎麼選。一份回顧筆記。',
      en: 'Outdoor event meets typhoon fringe — cancel / compress / push through. A postmortem on how we chose.',
    },
    location: 'TPE · HUASHAN',
    date: '2026.02.14',
    duration: '15 min',
    signalBars: 2,
    status: 'CLASSIFIED',
  },
  {
    id: 'N°005',
    freq: '88.9 MHz',
    tag: 'TOOLS',
    topic: {
      zh: '我每個案子用的 6 份文件',
      en: 'The 6 documents I open for every case',
    },
    lede: {
      zh: 'Brief、時程、預算、動線、cue sheet、debrief — 每份都長什麼樣、什麼時候填、誰填。',
      en: 'Brief, timeline, budget, flow, cue sheet, debrief — what each looks like, when it\'s filled, by whom.',
    },
    location: 'TPE · REMOTE',
    date: '2026.02.01',
    duration: '22 min',
    signalBars: 4,
    status: 'DRAFT',
  },
];
