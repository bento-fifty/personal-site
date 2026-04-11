/**
 * Taiwan city catalog for the LocationsMap component.
 *
 * Coordinates are in the TaiwanMap SVG viewBox space (400 × 800).
 * They're rough approximations of real lat/lng, tuned for visual balance
 * on the stylized outline — not cartographic precision.
 *
 * To add a location:
 *   1. Pick a kebab-case key and add it to LocationKey
 *   2. Add the entry to LOCATIONS below
 *   3. Reference it from a Case via `location: 'your-key'`
 */

export type LocationKey =
  | 'taipei'
  | 'new-taipei'
  | 'keelung'
  | 'taoyuan'
  | 'hsinchu'
  | 'taichung'
  | 'nantou'
  | 'tainan'
  | 'kaohsiung'
  | 'pingtung'
  | 'yilan'
  | 'hualien'
  | 'taitung';

export interface TaiwanLocation {
  key:     LocationKey;
  labelZh: string;
  labelEn: string;
  /** Real latitude (decimal degrees) */
  lat: number;
  /** Real longitude (decimal degrees) */
  lng: number;
  /** Position on the viewBox 400 × 800 (derived from lat/lng) */
  x: number;
  y: number;
}

/**
 * City pin coordinates derived from real lat/lng:
 *   x = (lng - 120) × 200
 *   y = (25.3 - lat) × 216 + 35
 * Mapped into viewBox 400 × 800 for the outline below.
 */
export const LOCATIONS: Record<LocationKey, TaiwanLocation> = {
  'taipei':     { key: 'taipei',     labelZh: '台北', labelEn: 'Taipei',     lat: 25.03, lng: 121.56, x: 312, y: 93  },
  'new-taipei': { key: 'new-taipei', labelZh: '新北', labelEn: 'New Taipei', lat: 25.01, lng: 121.47, x: 294, y: 98  },
  'keelung':    { key: 'keelung',    labelZh: '基隆', labelEn: 'Keelung',    lat: 25.13, lng: 121.74, x: 348, y: 72  },
  'taoyuan':    { key: 'taoyuan',    labelZh: '桃園', labelEn: 'Taoyuan',    lat: 24.99, lng: 121.31, x: 262, y: 102 },
  'hsinchu':    { key: 'hsinchu',    labelZh: '新竹', labelEn: 'Hsinchu',    lat: 24.81, lng: 120.96, x: 192, y: 141 },
  'taichung':   { key: 'taichung',   labelZh: '台中', labelEn: 'Taichung',   lat: 24.14, lng: 120.68, x: 136, y: 286 },
  'nantou':     { key: 'nantou',     labelZh: '南投', labelEn: 'Nantou',     lat: 23.92, lng: 120.67, x: 134, y: 334 },
  'tainan':     { key: 'tainan',     labelZh: '台南', labelEn: 'Tainan',     lat: 22.99, lng: 120.21, x: 58,  y: 534 },
  'kaohsiung':  { key: 'kaohsiung',  labelZh: '高雄', labelEn: 'Kaohsiung',  lat: 22.63, lng: 120.30, x: 78,  y: 612 },
  'pingtung':   { key: 'pingtung',   labelZh: '屏東', labelEn: 'Pingtung',   lat: 22.67, lng: 120.49, x: 118, y: 603 },
  'yilan':      { key: 'yilan',      labelZh: '宜蘭', labelEn: 'Yilan',      lat: 24.75, lng: 121.75, x: 350, y: 154 },
  'hualien':    { key: 'hualien',    labelZh: '花蓮', labelEn: 'Hualien',    lat: 23.99, lng: 121.60, x: 320, y: 318 },
  'taitung':    { key: 'taitung',    labelZh: '台東', labelEn: 'Taitung',    lat: 22.75, lng: 121.15, x: 230, y: 586 },
};

/**
 * Stylized Taiwan outline — viewBox="0 0 400 800".
 * Hand-traced clockwise from Fugui Cape (north tip). Not cartographically
 * precise, but proportions follow real lat/lng ranges and all city pins
 * above fall inside the polygon.
 */
export const TAIWAN_OUTLINE_PATH = `
M 306 35
L 354 63
L 395 89
L 390 154
L 390 252
L 380 317
L 370 359
L 340 450
L 300 520
L 260 590
L 210 660
L 170 770
L 130 748
L 75 680
L 40 590
L 20 490
L 15 390
L 30 300
L 55 230
L 95 165
L 150 115
L 210 75
L 275 55
Z
`.replace(/\s+/g, ' ').trim();
