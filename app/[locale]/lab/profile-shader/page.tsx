'use client';

import ShaderCanvas from '@/components/lab/ShaderCanvas';
import {
  profileShatter,
  profileBrushed,
  profileThinfilm,
  profileRidged,
} from '@/components/lab/ambientShaders';

const VARIANTS = [
  {
    key: 'A',
    name: 'MOLTEN CHROME',
    algorithm: 'Ridged fbm + cool env-map',
    structure: 'ridged multifractal 高頻波峰 + 天藍→ice→warm horizon env map',
    vibe: '液態鉻銀、細密波峰、強 blinn 高光、天空反射',
    shader: profileShatter,
  },
  {
    key: 'B',
    name: 'POURED GOLD',
    algorithm: 'Domain-warped fbm + amber env-map',
    structure: '兩層 domain warp fbm 產生光滑液流 + 暖 amber sky env map',
    vibe: '熔化黃金、流線感強、warm 金屬反射（接近你給的金色參考）',
    shader: profileBrushed,
  },
  {
    key: 'C',
    name: 'QUICKSILVER',
    algorithm: 'Directional curl flow + pewter env-map',
    structure: 'X 軸偏向 fbm + curl 層疊 → 水平流動 swirl + flame 地平線',
    vibe: '水銀橫流、pewter 銀質 + flame 火光點綴，中等對比',
    shader: profileThinfilm,
  },
  {
    key: 'D',
    name: 'OBSIDIAN POUR',
    algorithm: 'Twice-warped low-freq + ultra-sharp spec',
    structure: '低頻 domain warp 兩次 + pow 110 超銳高光 + violet 夜空 env',
    vibe: '黑曜液流、戲劇化 high contrast、幾乎只靠 spec 勾形狀',
    shader: profileRidged,
  },
];

export default function ProfileShaderLab() {
  return (
    <div style={{ color: '#FAFAF8' }}>
      <div className="max-w-[1400px] mx-auto px-8 py-16">
        <header className="mb-12 border-b pb-8" style={{ borderColor: 'rgba(93,211,227,0.2)' }}>
          <p
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 10,
              letterSpacing: '0.3em',
              color: 'rgba(93,211,227,0.7)',
              marginBottom: 12,
              textTransform: 'uppercase',
            }}
          >
            [ LAB · PROFILE SHADER · 4 STRUCTURALLY DISTINCT VARIANTS ]
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-fraunces), serif',
              fontVariationSettings: '"opsz" 144, "wght" 800',
              fontSize: 64,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: '#E63E1F',
              margin: 0,
            }}
          >
            Pick a metal.
          </h1>
          <p
            className="mt-3 max-w-2xl"
            style={{
              fontFamily: 'var(--font-noto-serif-tc), serif',
              fontSize: 15,
              color: 'rgba(250,250,248,0.7)',
              lineHeight: 1.7,
            }}
          >
            都朝「熔化液態金屬流」方向（參考你那兩張 avif）— height-field + env-map 反射 + 強高光 + 高對比。四格差在 height field 用什麼演算法和 env map 色系。
          </p>
        </header>

        <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {VARIANTS.map((v) => (
            <section
              key={v.key}
              className="border"
              style={{
                borderColor: 'rgba(93,211,227,0.25)',
                background: 'rgba(0,0,0,0.3)',
              }}
            >
              {/* Label strip */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{
                  borderBottom: '1px solid rgba(93,211,227,0.2)',
                  background: 'rgba(93,211,227,0.04)',
                }}
              >
                <div className="flex items-baseline gap-3">
                  <span
                    style={{
                      fontFamily: 'var(--font-fraunces), serif',
                      fontVariationSettings: '"opsz" 144, "wght" 800',
                      fontSize: 28,
                      color: '#E63E1F',
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                    }}
                  >
                    {v.key}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: 11,
                      letterSpacing: '0.3em',
                      color: '#FAFAF8',
                    }}
                  >
                    {v.name}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 9,
                    letterSpacing: '0.26em',
                    color: '#5DD3E3',
                  }}
                >
                  [ {v.algorithm} ]
                </span>
              </div>

              {/* Live shader */}
              <div style={{ aspectRatio: '16 / 10', position: 'relative' }}>
                <ShaderCanvas frag={v.shader} className="block w-full h-full" />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: 'rgba(11,16,38,0.35)', pointerEvents: 'none' }}
                />
              </div>

              {/* Notes */}
              <div className="px-4 py-4">
                <p
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 9,
                    letterSpacing: '0.28em',
                    color: 'rgba(93,211,227,0.7)',
                    marginBottom: 6,
                    textTransform: 'uppercase',
                  }}
                >
                  // structure
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-noto-serif-tc), serif',
                    fontSize: 13,
                    color: 'rgba(240,237,230,0.85)',
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {v.structure}
                </p>
                <p
                  className="mt-3"
                  style={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: 9,
                    letterSpacing: '0.28em',
                    color: 'rgba(245,185,58,0.75)',
                    textTransform: 'uppercase',
                    marginBottom: 6,
                  }}
                >
                  // vibe
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-noto-serif-tc), serif',
                    fontSize: 13,
                    color: 'rgba(240,237,230,0.7)',
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {v.vibe}
                </p>
              </div>
            </section>
          ))}
        </div>

        <p
          className="mt-12"
          style={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 10,
            letterSpacing: '0.3em',
            color: 'rgba(93,211,227,0.55)',
          }}
        >
          [ 告訴我挑 A / B / C / D，或哪兩個混，我再改色調套到 /about ]
        </p>
      </div>
    </div>
  );
}
