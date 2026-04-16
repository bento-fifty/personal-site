'use client'

import { useState } from 'react'
import ShaderCanvas from './ShaderCanvas'
import { voidStar, aperture, emberMap, blueprint, pulse, ink } from './ambientShaders'

const VARIANTS = [
  { id: 'void', name: '01 LIQUID CHROME', frag: voidStar, page: '/work 索引', note: '銀藍冷色 — silver + ice + violet 虹光' },
  { id: 'aperture', name: '02 INK POOL', frag: aperture, page: '/work/[slug] 案件', note: '深墨黑 obsidian，只在 grazing 角透出靛藍/深紫' },
  { id: 'ember', name: '03 EMBER MAP', frag: emberMap, page: '/about', note: '等高線 + 火星遊走 (已通過)' },
  { id: 'blueprint', name: '04 EMERALD FERROFLUID', frag: blueprint, page: '/services', note: '綠系虹光 — emerald + teal + 紫底 droplets' },
  { id: 'pulse', name: '05 PULSE', frag: pulse, page: '/contact', note: '偏心心跳環 (已通過)' },
  { id: 'ink', name: '06 INK', frag: ink, page: '/blog', note: '墨在水中暈開 (已通過)' },
]

export default function AmbientLab() {
  const [idx, setIdx] = useState(0)
  const v = VARIANTS[idx]

  return (
    <div className="min-h-screen bg-[#0B1026] text-[#F0EDE6]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="font-mono text-[10px] tracking-[0.3em] text-[#5DD3E3] opacity-70">
          LAB / AMBIENT_BACKGROUNDS
        </div>
        <h1 className="mt-3 font-serif text-3xl">Per-page ambient shaders</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#F0EDE6]/70">
          6 張全新紙質。預覽區套站內實際 opacity + 黑罩參數（opacity 0.35 · mask 0.45）。
          點按鈕切換。
        </p>

        {/* Preview with real tuning */}
        <div className="relative mt-8 h-[520px] overflow-hidden border border-[rgba(255,255,255,0.08)]">
          {/* shader layer at preview opacity */}
          <div
            className="absolute inset-0"
            style={{ opacity: 0.55 }}
          >
            <ShaderCanvas key={v.id} frag={v.frag} className="block h-full w-full" />
            <div className="absolute inset-0" style={{ background: 'rgba(11, 16, 38, 0.3)' }} />
          </div>

          {/* sample content on top to gauge readability */}
          <div className="relative h-full p-10">
            <div className="font-mono text-[10px] tracking-[0.3em] text-[#5DD3E3]">
              {v.page.toUpperCase()}
            </div>
            <h2 className="mt-4 font-serif text-5xl text-[#F0EDE6]">
              Sample headline here
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#F0EDE6]/70">
              This is placeholder body copy at the site's default size. If the background
              shader is too loud, you will see it fight this text. Ideally it breathes under
              the copy without demanding attention.
            </p>
            <div className="mt-10 font-mono text-[10px] tracking-[0.28em] text-[#F0EDE6]/50">
              · {v.note} ·
            </div>
          </div>
        </div>

        {/* Raw preview (no content, no mask) for pure shader review */}
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="border border-[rgba(255,255,255,0.08)]">
            <div className="border-b border-[rgba(255,255,255,0.08)] p-2 font-mono text-[9px] tracking-[0.28em] text-[#F0EDE6]/50">
              RAW (shader only, opacity 1)
            </div>
            <div className="h-40">
              <ShaderCanvas key={`raw-${v.id}`} frag={v.frag} className="block h-full w-full" />
            </div>
          </div>
          <div className="border border-[rgba(255,255,255,0.08)]">
            <div className="border-b border-[rgba(255,255,255,0.08)] p-2 font-mono text-[9px] tracking-[0.28em] text-[#F0EDE6]/50">
              TUNED (opacity 0.55 + mask 0.3, site preview)
            </div>
            <div className="relative h-40 bg-[#0B1026]">
              <div className="absolute inset-0" style={{ opacity: 0.55 }}>
                <ShaderCanvas key={`tuned-${v.id}`} frag={v.frag} className="block h-full w-full" />
                <div className="absolute inset-0" style={{ background: 'rgba(11, 16, 38, 0.3)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap gap-2">
          {VARIANTS.map((x, i) => (
            <button
              key={x.id}
              onClick={() => setIdx(i)}
              className={`border px-3 py-2 text-left font-mono text-[10px] tracking-[0.25em] transition-colors ${
                i === idx
                  ? 'border-[#5DD3E3] bg-[#5DD3E3]/10 text-[#5DD3E3]'
                  : 'border-[rgba(255,255,255,0.2)] text-[#F0EDE6]/70 hover:border-[#5DD3E3]/60'
              }`}
            >
              <div>{x.name}</div>
              <div className="mt-0.5 text-[9px] opacity-60">{x.page}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
