/**
 * Telemetry / media mentions data.
 *
 * These are placeholder entries — Evan should swap them with real
 * press / feature / mention / interview entries before launch.
 * TODO(evan): replace all 8 entries with real coverage.
 */

export type ResultType = 'PRESS' | 'FEATURE' | 'MENTION' | 'INTERVIEW' | 'AWARD';

export interface ResultItem {
  id:       string;
  type:     ResultType;
  source:   string;
  headline: string;
  date:     string;  // YYYY-MM
  url?:     string;
}

export const RESULTS: ResultItem[] = [
  {
    id:       '01',
    type:     'PRESS',
    source:   'Marketing Weekly',
    headline: 'Taipei Brand Immersive Draws 2,000+ in First Weekend',
    date:     '2024-07',
    url:      '#',
  },
  {
    id:       '02',
    type:     'FEATURE',
    source:   'Shoppe Monthly',
    headline: 'Behind the Pop-Up That Changed How Brands Think About Flow',
    date:     '2024-08',
    url:      '#',
  },
  {
    id:       '03',
    type:     'INTERVIEW',
    source:   'Creative Mornings TPE',
    headline: 'Evan Chang on Designing Events People Actually Remember',
    date:     '2024-09',
    url:      '#',
  },
  {
    id:       '04',
    type:     'MENTION',
    source:   'Campaign Asia',
    headline: '10 Taipei Producers Worth Watching Next Quarter',
    date:     '2024-10',
    url:      '#',
  },
  {
    id:       '05',
    type:     'PRESS',
    source:   'UDN Style',
    headline: '大型戶外演唱會現場：一位統籌的 14 小時',
    date:     '2024-09',
    url:      '#',
  },
  {
    id:       '06',
    type:     'AWARD',
    source:   'TW Experiential Awards',
    headline: 'Finalist — Best Immersive Brand Experience 2024',
    date:     '2024-11',
    url:      '#',
  },
  {
    id:       '07',
    type:     'FEATURE',
    source:   'Vogue Taiwan',
    headline: 'The Producer Quietly Shaping Taipei Nightlife Launches',
    date:     '2024-11',
    url:      '#',
  },
  {
    id:       '08',
    type:     'MENTION',
    source:   'Dezeen',
    headline: 'Notable Event Design from Asia — Q3 2024 Round-up',
    date:     '2024-10',
    url:      '#',
  },
];

/** Deterministic rotation value in [-4, +4] degrees derived from id,
 *  so SSR and client output matches without hydration mismatch. */
export function rotationFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (((h % 80) - 40) / 10);
}
