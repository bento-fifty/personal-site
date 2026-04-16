export interface Service {
  id: string;
  num: string;
  codename: string; // e.g. "BRAND EXPERIENCE RIG"
  title: { zh: string; en: string };
  whenToDeploy: { zh: string; en: string };
  kitContents: { zh: string[]; en: string[] };
  commonMistakes: { zh: string[]; en: string[] };
  caseRefs: { slug: string; label: string }[]; // cross-link to /work
  specs: {
    cycle: string; // "6–10 週"
    team: string; // "3–6 人"
    budget: string; // "M · 中型"
  };
  chefsNote: { zh: string; en: string };
}

export const SERVICES: Service[] = [
  {
    id: 'event-production',
    num: '§01',
    codename: 'EVENT PRODUCTION RIG',
    title: { zh: '活動製作', en: 'Event Production' },
    whenToDeploy: {
      zh: '你有一場活動需要從白紙變成現場。預算與檔期確認、合作團隊待組。',
      en: 'You have an event that needs to go from blank page to live. Budget and window confirmed, team to be assembled.',
    },
    kitContents: {
      zh: ['概念發想 · 動線規劃', '場地 · 設備 · 廠商統籌', '現場製作管理 · 執行控台', '客戶溝通與報表'],
      en: ['Concept design & flow planning', 'Venue, tech & vendor coordination', 'On-site production & show call', 'Client reporting & debrief'],
    },
    commonMistakes: {
      zh: ['太早承諾視覺，執行階段才發現不可行', '把 KOL 當附加品而非內容主軸', '沒留緩衝 — 第一場彩排從不準時'],
      en: ['Committing visuals too early, then hitting production limits', 'Treating KOLs as add-ons instead of core content', 'No buffer — first rehearsal never runs on time'],
    },
    caseRefs: [
      { slug: 'brand-summit-vol2', label: 'BRAND SUMMIT VOL.2' },
    ],
    specs: { cycle: '6–10 週', team: '3–6 人', budget: 'M — 中型' },
    chefsNote: {
      zh: '活動的 70% 工作是在開始前跑完的。到現場後你只是按照劇本走。',
      en: '70% of an event happens before it happens. By show day you are just running the score.',
    },
  },
  {
    id: 'brand-experience',
    num: '§02',
    codename: 'BRAND EXPERIENCE RIG',
    title: { zh: '品牌體驗顧問', en: 'Brand Experience Consulting' },
    whenToDeploy: {
      zh: '品牌敘事已有但「活不起來」— 廣告歸廣告、店頭歸店頭、活動歸活動，沒有一致體驗。',
      en: 'Brand narrative exists but feels flat — ads, retail, events all run on separate tracks with no shared experience.',
    },
    kitContents: {
      zh: ['體驗策略 · 觸點地圖', '實體 / 數位整合 · 儀式設計', 'KPI 定義 · 長期追蹤'],
      en: ['Experience strategy & touchpoint map', 'Physical × digital integration, ritual design', 'KPI definition & longitudinal tracking'],
    },
    commonMistakes: {
      zh: ['把體驗當成美學問題，忽略流程', 'KPI 只看當下熱度，沒設計回訪機制'],
      en: ['Treating experience as aesthetic-only, ignoring operational flow', 'KPIs chasing hype, no return-visit mechanism built in'],
    },
    caseRefs: [],
    specs: { cycle: '8–16 週', team: '2–4 人', budget: 'M — 中型' },
    chefsNote: {
      zh: '體驗是一組記憶的種子，不是一個秀。種子要重複發芽才算數。',
      en: 'Experience is a set of memory seeds, not a show. Seeds count only if they sprout again.',
    },
  },
  {
    id: 'creative-direction',
    num: '§03',
    codename: 'CREATIVE DIRECTION RIG',
    title: { zh: '創意統籌', en: 'Creative Direction' },
    whenToDeploy: {
      zh: '多團隊同時在生產素材（攝影、影像、文案、KOL），但輸出的語氣像三家不同公司做的。',
      en: 'Multiple teams producing in parallel (photo, film, copy, KOL) but the output sounds like three different companies.',
    },
    kitContents: {
      zh: ['視覺調性 · 文字語調定義', '攝影 / 影像 / KOL 合作統籌', '輸出審核 · 一致性把關'],
      en: ['Visual & verbal tone system', 'Photography / film / KOL coordination', 'Deliverable review & consistency QA'],
    },
    commonMistakes: {
      zh: ['用 moodboard 取代決策，所有團隊各自解讀', '太晚介入 — 素材已經拍完才發現 tone 偏'],
      en: ['Letting moodboards replace decisions — teams each reinterpret', 'Stepping in too late — footage already shot, tone already off'],
    },
    caseRefs: [],
    specs: { cycle: '持續合作', team: '1–2 人', budget: 'S—M' },
    chefsNote: {
      zh: '統籌的工作是「讓所有人做同一件事的不同部分」，不是「讓所有人同意我的版本」。',
      en: 'Direction is about "everyone working on different parts of the same thing," not "everyone agreeing with my version."',
    },
  },
  {
    id: 'launch-strategy',
    num: '§04',
    codename: 'LAUNCH STRATEGY RIG',
    title: { zh: '發表策略', en: 'Launch Strategy' },
    whenToDeploy: {
      zh: '新品牌或新產品即將上市，需要一套從訊息到節奏的完整規劃，而不只是一場發表會。',
      en: 'A brand or product is about to launch — you need a full message/timing/rollout plan, not just a single reveal event.',
    },
    kitContents: {
      zh: ['上市敘事 · 關鍵訊息', '節奏設計 · 媒體配置', '聲量追蹤 · 回饋迭代'],
      en: ['Launch narrative & key messages', 'Cadence design & media placement', 'Reception tracking & iteration'],
    },
    commonMistakes: {
      zh: ['把發表會當終點，沒規劃後續 4 週節奏', '訊息太多 — 一次想講完所有事，結果一件都沒記住'],
      en: ['Treating the reveal as the finish line, no 4-week follow-through', 'Too many messages — trying to say everything, nothing lands'],
    },
    caseRefs: [],
    specs: { cycle: '12–20 週', team: '3–5 人', budget: 'L — 旗艦' },
    chefsNote: {
      zh: '上市的第一週決定接下來一年要用多少力氣推。第一週做對，之後是慣性。',
      en: 'The first week after launch sets how much effort the next year requires. Nail week one, the rest is momentum.',
    },
  },
];
