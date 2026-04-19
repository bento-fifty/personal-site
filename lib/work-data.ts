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

  // Dossier Spine — optional redaction / declass metadata
  confidential?: {
    client?: boolean;    // redact client name in RedactionBar
    budget?: boolean;    // redact budget fields
    fields?: string[];   // extra custom field keys to redact
  };
  declassifiedAt?: string;   // ISO year+quarter, e.g. "2027.Q1"

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
    id: '019',
    slug: 'glenfiddich-players-hq-2019',
    issueRef: 'EDI-TLS-019',
    title: '格蘭菲迪 15 號玩家基地全台巡迴',
    titleEn: 'Glenfiddich No.15 Players\' HQ Tour',
    client: '格蘭菲迪 (Glenfiddich)',
    year: 2019,
    date: '2019',
    scale: '3 CITIES · 22,978 VISITORS',
    types: ['POPUP', 'BRAND'],
    type: 'POPUP',
    roles: ['Producer', 'Creative Director'],
    venue: '高雄巨蛋北廣場 / 台中大遠百中廣場 / 台北 101 北廣場',
    featured: true,
    clusterLayout: 'a',
    lead: {
      zh: '威士忌的傳統策略是品飲體驗。格蘭菲迪選了另一條路：把 15 年的「深藏不露」個性，轉譯成一個收藏家才看得懂的語言。',
      en: 'The standard whisky playbook calls for tasting events. Glenfiddich chose differently — translating the 15-Year\'s character into a language only collectors understand.',
    },
    objective: {
      zh: '格蘭菲迪希望為 15 年系列打開新族群，超越既有威士忌飲用者，觸及有收藏文化的潛在消費者。',
      en: 'Glenfiddich needed to open up the 15-Year expression beyond existing whisky drinkers, reaching a new audience rooted in collector and enthusiast culture.',
    },
    strategy: {
      zh: '以「玩家基地」為概念設計五大主題區：傳奇球鞋、歷史軍品、夢幻模型收藏，與蘇羅拉互動體驗及品牌試飲實驗室並陳。讓消費者帶著自己的收藏視角走進品牌，而非被動接受品牌敘事。',
      en: 'We designed the "Players\' HQ" around five collector-themed zones — legendary sneakers, military memorabilia, fantasy models, a Surrala interactive station, and a tasting lab — letting visitors enter through their own cultural obsessions rather than receiving a brand lecture.',
    },
    execution: {
      zh: '三城九日巡迴：高雄巨蛋北廣場、台中大遠百中廣場、台北 101 北廣場，每場三天連續執行。品牌大使與調酒師配置在每個環節，確保體驗流暢與品牌知識的有效傳遞。',
      en: 'A nine-day relay across Kaohsiung (Arena North Plaza), Taichung (Far Eastern–Shin Kong Mitsukoshi Plaza), and Taipei (101 North Plaza) — three cities, three days each. Brand ambassadors and whisky guides staffed every zone to keep the experience coherent and the brand knowledge moving.',
    },
    result: {
      zh: '三城合計 22,978 人次，837 瓶格蘭菲迪 15 年現場試飲完畢。超過八成參與者完成品牌知識互動。三成試飲者主動詢問通路購買資訊，帶動即時轉換意圖。',
      en: '22,978 visitors across three cities. 837 bottles of the 15-Year poured over nine days. Over 80% of participants engaged with brand knowledge content. 30% of tasters actively sought purchase channel information — demonstrating immediate conversion intent.',
    },
    stats: [
      { label: '總人次', labelEn: 'Visitors', value: '22,978' },
      { label: '城市巡迴', labelEn: 'Cities', value: '3' },
      { label: '現場試飲', labelEn: 'Bottles Poured', value: '837' },
    ],
    photos: [
      photo('019', 'wide', 'hero', 35),
      photo('019', 'square', 'detail', 38),
      photo('019', 'portrait', 'detail', 30),
      photo('019', 'wide', 'bts', 32),
    ],
  },
  {
    id: '022',
    slug: 'cod-mw2-launch-taipei-2022',
    issueRef: 'EDI-TLS-022',
    title: '決勝時刻：現代戰爭 2 台灣上市活動',
    titleEn: 'Call of Duty: Modern Warfare 2 Launch Activation',
    client: 'Activision',
    year: 2022,
    date: '2022',
    scale: '2 DAYS · 大稻埕碼頭廣場',
    types: ['LAUNCH', 'BRAND', 'POPUP'],
    type: 'LAUNCH',
    roles: ['Producer'],
    venue: '台北大稻埕碼頭廣場 B',
    location: 'taipei',
    featured: true,
    clusterLayout: 'b',
    lead: {
      zh: '遊戲發布活動最常見的陷阱：把玩家當觀眾。MW2 在台北的方式是：把碼頭變成戰場，把玩家變成玩法本身。',
      en: 'The recurring trap of a game launch: treating players as an audience. In Taipei, MW2 turned the waterfront into a theatre of play — putting the players inside the experience, not in front of it.',
    },
    objective: {
      zh: 'Activision 希望 MW2 的台灣發布不只是一般遊戲宣傳，而是製造一個足以在玩家社群自發傳播的實體事件，並透過 KOL 直播同步擴大線上聲量。',
      en: 'Activision needed the Taiwan launch to generate organic player community spread — not just paid media reach — while using KOL live streams to amplify the on-site energy to online audiences simultaneously.',
    },
    strategy: {
      zh: '以「實際參戰」為體驗設計核心：射擊闖關、遊戲試玩、客製化軍牌，讓每位到場者都有自己的任務完成路徑。舞台上安排 KOL 擂台挑戰賽，讓直播觀眾與現場觀眾共享同一個緊張時刻。',
      en: 'We designed every station around genuine participation: shooting challenge, game demo, laser-engraved military dog tag. Everyone on-site had their own mission arc. KOL battle streams on stage gave online viewers a real-time stake in the on-site drama.',
    },
    execution: {
      zh: '大稻埕碼頭廣場 B，連續兩天執行。KOL 庹宗康、小建、Zonda、瘋狗輪番主持舞台直播，Sophy 負責集客活動。PS、PC 試玩區、射擊體驗區、拍照打卡區三線並跑，六組執行人力分區統籌。',
      en: 'Taipei Dadaocheng Waterfront Square B, two days. KOLs 庹宗康, 小建, Zonda, and 瘋狗 rotated through stage streaming sessions; Sophy anchored crowd activation. PS and PC demo zones, shooting challenge, and photo station ran simultaneously across six crew zones.',
    },
    result: {
      zh: '兩天合計 758 次射擊闖關體驗，發出 269 組客製軍牌、280 個特遣隊專屬提袋。KOL 直播同步覆蓋線上玩家社群，現場話題熱度延伸至活動後 48 小時。',
      en: '758 shooting challenge completions over two days. 269 custom military dog tags engraved and issued. 280 special ops tote bags distributed. KOL stream coverage extended the event\'s reach into the online gaming community, with discussion continuing 48 hours post-event.',
    },
    stats: [
      { label: '射擊挑戰人次', labelEn: 'Shooting Challenges', value: '758' },
      { label: '客製軍牌', labelEn: 'Custom Dog Tags', value: '269' },
      { label: '執行天數', labelEn: 'Days', value: '2' },
    ],
    photos: [
      photo('022', 'wide', 'hero', 10),
      photo('022', 'square', 'detail', 8),
      photo('022', 'portrait', 'detail', 15),
      photo('022', 'wide', 'bts', 12),
    ],
  },
  {
    id: '017',
    slug: 'eva-air-uniform-launch-2017',
    issueRef: 'EDI-TLS-017',
    title: '長榮航空新制服發表記者會',
    titleEn: 'EVA Air New Uniform Launch Press Conference',
    client: '長榮航空 (EVA Air)',
    year: 2017,
    date: '2017',
    scale: '媒體記者會 · 100+ 員工同台',
    types: ['LAUNCH', 'CORPORATE'],
    type: 'LAUNCH',
    roles: ['Producer', 'Stage Director'],
    venue: '長榮航空',
    location: 'taipei',
    featured: true,
    clusterLayout: 'c',
    lead: {
      zh: '新制服的發表會很容易變成「看衣服」。長榮想說的不是衣服，是「為什麼我們用服務定義自己」這件事。',
      en: 'A uniform launch easily becomes a fashion show. EVA Air had something harder to communicate — why a company defines itself through the act of service, not the look of a garment.',
    },
    objective: {
      zh: '747 機隊退役、新制服亮相，長榮希望將這兩件同步發生的事件整合為一個品牌敘事——不是告別舊時代，而是用傳承的精神迎接下一段旅程。',
      en: 'With the 747 fleet retiring and new uniforms launching simultaneously, EVA Air needed to transform two separate news items into a single brand statement — not nostalgia, but inheritance as forward momentum.',
    },
    strategy: {
      zh: '以「傳承‧再出發」為主軸設計雙段式記者會：前半段是 747 機隊的光榮退役儀式，後半段是新制服的走秀亮相。讓設計師、機組員與長官共同站上發布舞台，強調制服背後「為服務而生」的創作初衷。',
      en: 'We structured the press conference in two acts: a farewell ceremony for the 747 fleet, followed by the new uniform reveal. Designer, crew, and executives shared the same stage — making the point that the new uniform was built for service, not for aesthetics.',
    },
    execution: {
      zh: '媒體接待、VIP 引場、747 儀式人員出場、走秀、電視聯訪、平面媒體一對一——全程流程精準執行於 2 小時內。百餘位員工與家屬同台共慶，整場記者會兼顧內部士氣與對外形象。',
      en: 'Media reception, VIP seating, 747 ceremonial send-off, new uniform runway, TV press junket, print media one-on-ones — all executed within two hours. 100+ crew members and their families shared the stage, making it a company-wide moment as much as a media event.',
    },
    result: {
      zh: '電視與平面媒體全程採訪，「傳承‧再出發」的品牌訊息成功主導報導框架。747 退役情感敘事與新制服品牌定位雙線並進，達成比單一發布更完整的媒體覆蓋效果。',
      en: 'Full TV and print media coverage. The "Inheritance Forward" framing successfully defined the story — press coverage led with brand mission rather than garment design. The 747 retirement narrative and uniform launch worked as one coherent press moment, achieving broader coverage than either event could have generated alone.',
    },
    stats: [
      { label: '員工與家屬同台', labelEn: 'Crew & Families on Stage', value: '100+' },
      { label: '活動時長', labelEn: 'Event Duration', value: '2 hrs' },
      { label: '敘事段落', labelEn: 'Narrative Acts', value: '2' },
    ],
    photos: [
      photo('017', 'wide', 'hero', 210),
      photo('017', 'square', 'detail', 215),
      photo('017', 'portrait', 'bts', 205),
    ],
  },
  {
    id: '016',
    slug: 'north-coast-arts-festival-2016',
    issueRef: 'EDI-TLS-016',
    title: '2016 新北市北海岸藝術祭',
    titleEn: '2016 North Coast Arts Festival',
    client: '新北市政府文化局',
    year: 2016,
    date: '2016',
    scale: '6 DISTRICTS · 20+ ARTISTS',
    types: ['BRAND'],
    type: 'BRAND',
    roles: ['Producer', 'Creative Director'],
    venue: '北海岸六大行政區（八里・淡水・三芝・石門・金山・萬里）',
    location: 'new-taipei',
    featured: true,
    clusterLayout: 'd',
    lead: {
      zh: '藝術節通常把人帶進美術館。北海岸藝術祭反過來：把藝術送進六個行政區的日常裡，讓地景成為展場。',
      en: 'Art festivals bring people to museums. The North Coast Arts Festival reversed the logic — delivering art into six districts\' everyday landscape, turning terrain into gallery.',
    },
    objective: {
      zh: '新北市政府文化局希望透過公共藝術計畫活化北海岸自然地景與人文紋理，讓更多人走進八里、淡水、三芝、石門、金山、萬里，重新發現這條海岸線的價值。',
      en: 'New Taipei Cultural Affairs Bureau needed a public art initiative that would activate the North Coast\'s natural and cultural landscape across six districts — Bali, Tamsui, Sanzhi, Shimen, Jinshan, Wanli — drawing visitors to rediscover the coastline.',
    },
    strategy: {
      zh: '以「人與土地的關係」為策展命題，邀請 20 餘位國內外藝術家進行駐地創作，讓作品從地景與社區中生長出來，而非外來置入。南非、義大利、馬來西亞的國際藝術家加入，提升展覽的跨國格局。',
      en: 'We commissioned 20+ domestic and international artists — including practitioners from South Africa, Italy, and Malaysia — to create site-specific work rooted in the curatorial premise of people and land. The work grew from the sites rather than being installed into them.',
    },
    execution: {
      zh: '20 件藝術裝置橫跨六大行政區同期展出，涵蓋海岸、梯田、廢棄校舍、博物館廣場等多元現地。策展、田野調查、社區協作與公共展覽同時並進，協調藝術家、在地社區與政府機關三方合作。',
      en: '20 site-specific installations across six districts — coast, terraced fields, abandoned schools, museum plazas. Curation, field research, community collaboration, and public exhibition ran simultaneously. Three-way coordination between artists, local communities, and government agencies throughout.',
    },
    result: {
      zh: '六大行政區同期開幕，國內外媒體報導全程覆蓋。國際藝術家參與提升展覽能見度，超越地方政府活動框架。藝術作為城市行銷工具，帶動跨區人流並強化北海岸的文化品牌識別。',
      en: 'Simultaneous opening across six districts with domestic and international media coverage. International artist participation elevated the festival beyond regional government programming. Art as city marketing — successfully driving cross-district visitation and reinforcing the North Coast\'s cultural identity.',
    },
    stats: [
      { label: '參展藝術家', labelEn: 'Artists', value: '20+' },
      { label: '行政區', labelEn: 'Districts', value: '6' },
      { label: '國際藝術家來源國', labelEn: 'Int\'l Countries', value: '3' },
    ],
    photos: [
      photo('016', 'wide', 'hero', 175),
      photo('016', 'square', 'detail', 180),
      photo('016', 'portrait', 'bts', 170),
    ],
  },
  {
    id: '018',
    slug: 'heineken-bp-spring-gala-2019',
    issueRef: 'EDI-TLS-018',
    title: '海尼根品牌推廣人員春酒晚宴',
    titleEn: 'Heineken Brand Force Spring Gala',
    client: '海尼根 (Heineken)',
    year: 2019,
    date: '2019',
    scale: '260 GUESTS',
    types: ['CORPORATE', 'BRAND'],
    type: 'CORPORATE',
    roles: ['Producer'],
    venue: 'BP 174 宴會廳',
    location: 'taipei',
    featured: false,
    clusterLayout: 'a',
    lead: {
      zh: '商化人員的年度春酒，可以是例行聚會，也可以是讓 BP 真正感覺自己屬於品牌的一夜。我們選了後者。',
      en: 'A brand promoter spring gala can run on autopilot. We chose to make it the night Heineken\'s field force felt genuinely part of the brand — not just employed by it.',
    },
    objective: {
      zh: '海尼根希望透過春酒晚宴，強化品牌推廣人員（BP）與業務主管（MD）對品牌的認同感，同時藉由走秀與競賽讓現場充滿記憶點。',
      en: 'Heineken wanted the annual spring gala to build genuine brand affinity among its Brand Promoters and MDs — not just reward attendance, but create a night people would remember.',
    },
    strategy: {
      zh: '以造型走秀競賽作為核心節目，讓 BP 化身品牌代言人上台競技。搭配品牌知識線上問答和 Live Band 貫穿整個晚宴節奏，維持全場持續的參與感。',
      en: 'We anchored the programme around a costume runway competition, turning BP staff into brand advocates on stage. Live band performances and a brand knowledge quiz ran throughout, keeping the room engaged rather than passive.',
    },
    execution: {
      zh: '活動前一日設置 BP 彩妝室，當天完成入場動線場佈。晚宴流程精準控制在 2.5 小時：頒獎、致詞、走秀、互動問答、Live Band 無縫接力，260 人全程在場。',
      en: 'The day before: dedicated hair-and-makeup studio for BP staff. Day-of: reception layout completed by afternoon. The 2.5-hour programme ran without gaps — awards, speeches, runway, quiz, live band, each in sequence. 260 guests, full retention.',
    },
    result: {
      zh: '全體 260 位 BP 及海尼根員工完整參與，走秀環節引爆全場互動高峰，現場自發歡呼與拍照時長超出預期排程。',
      en: 'Full 260-person attendance. The runway competition sparked the highest engagement moment of the evening, drawing spontaneous cheering and photography well beyond the planned window.',
    },
    stats: [
      { label: '出席人數', labelEn: 'Guests', value: '260' },
      { label: '頒獎名額', labelEn: 'Award Winners', value: '12' },
      { label: 'Live Band 場次', labelEn: 'Live Performances', value: '2' },
    ],
    photos: [
      photo('018', 'wide', 'hero', 145),
      photo('018', 'square', 'detail', 150),
      photo('018', 'portrait', 'bts', 140),
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

export const YEARS: (number | 'ALL')[] = ['ALL', 2022, 2019, 2017, 2016];
