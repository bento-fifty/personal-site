'use client'

import { useState } from 'react'
import ShaderText from './ShaderText'
import {
  ditherExpand,
  ditherSquare,
  ditherDiamond,
  ditherDiagonal,
  ditherScanlines,
  ditherGrid,
  ditherCollision,
} from './transitionShaders'

const VARIANTS = [
  { id: 'circle', name: '01 CIRCLE', frag: ditherExpand },
  { id: 'square', name: '02 SQUARE', frag: ditherSquare },
  { id: 'diamond', name: '03 DIAMOND', frag: ditherDiamond },
  { id: 'diagonal', name: '04 DIAGONAL', frag: ditherDiagonal },
  { id: 'scan', name: '05 SCANLINES', frag: ditherScanlines },
  { id: 'grid', name: '06 GRID', frag: ditherGrid },
  { id: 'collision', name: '07 COLLISION', frag: ditherCollision },
]

const TEXTS = [
  { id: 'en', label: 'THE LEVEL STUDIO', font: 'Fraunces, "Noto Serif TC", serif', size: 140, weight: 700, ls: -0.02 },
  { id: 'tw', label: '等級', font: '"Noto Serif TC", Fraunces, serif', size: 320, weight: 900, ls: 0 },
]

export default function ShaderTextLab() {
  const [vIdx, setVIdx] = useState(0)
  const [tIdx, setTIdx] = useState(0)
  const [pulse, setPulse] = useState(true)
  const v = VARIANTS[vIdx]
  const t = TEXTS[tIdx]

  return (
    <div className="min-h-screen bg-[#0B1026] text-[#F0EDE6]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="font-mono text-[10px] tracking-[0.3em] text-[#5DD3E3] opacity-70">
          LAB / SHADER_TEXT
        </div>
        <h1 className="mt-3 font-serif text-3xl text-[#F0EDE6]">Brand text × shader fills</h1>

        {/* Preview */}
        <div className="mt-8 flex h-[400px] items-center justify-center border border-[rgba(255,255,255,0.1)] bg-black/50">
          <ShaderText
            key={`${v.id}-${t.id}-${pulse}`}
            text={t.label}
            frag={v.frag}
            fontFamily={t.font}
            fontSize={t.size}
            fontWeight={t.weight}
            letterSpacing={t.ls}
            pulse={pulse}
            progress={pulse ? undefined : 1}
            className="h-[300px] w-[90%]"
          />
        </div>

        {/* Controls */}
        <div className="mt-8 space-y-4">
          <div>
            <div className="font-mono text-[10px] tracking-[0.28em] text-[#F0EDE6]/50">SHADER</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {VARIANTS.map((x, i) => (
                <button
                  key={x.id}
                  onClick={() => setVIdx(i)}
                  className={`border px-3 py-2 font-mono text-[10px] tracking-[0.25em] transition-colors ${
                    i === vIdx
                      ? 'border-[#5DD3E3] bg-[#5DD3E3]/10 text-[#5DD3E3]'
                      : 'border-[rgba(255,255,255,0.2)] text-[#F0EDE6]/70 hover:border-[#5DD3E3]/60'
                  }`}
                >
                  {x.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-[0.28em] text-[#F0EDE6]/50">TEXT</div>
            <div className="mt-2 flex gap-2">
              {TEXTS.map((x, i) => (
                <button
                  key={x.id}
                  onClick={() => setTIdx(i)}
                  className={`border px-3 py-2 font-mono text-[10px] tracking-[0.25em] transition-colors ${
                    i === tIdx
                      ? 'border-[#E63E1F] bg-[#E63E1F]/10 text-[#E63E1F]'
                      : 'border-[rgba(255,255,255,0.2)] text-[#F0EDE6]/70 hover:border-[#E63E1F]/60'
                  }`}
                >
                  {x.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="font-mono text-[10px] tracking-[0.28em] text-[#F0EDE6]/50">MOTION</div>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => setPulse(false)}
                className={`border px-3 py-2 font-mono text-[10px] tracking-[0.25em] ${
                  !pulse ? 'border-[#F0EDE6] bg-[#F0EDE6]/10 text-[#F0EDE6]' : 'border-[rgba(255,255,255,0.2)] text-[#F0EDE6]/70'
                }`}
              >
                STATIC (progress=1)
              </button>
              <button
                onClick={() => setPulse(true)}
                className={`border px-3 py-2 font-mono text-[10px] tracking-[0.25em] ${
                  pulse ? 'border-[#F0EDE6] bg-[#F0EDE6]/10 text-[#F0EDE6]' : 'border-[rgba(255,255,255,0.2)] text-[#F0EDE6]/70'
                }`}
              >
                PULSE (sin)
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 font-mono text-[10px] tracking-[0.22em] text-[#F0EDE6]/40">
          · u_time 會持續流動，靜態下仍會看到 fbm 噪波流動 ·
        </div>
      </div>
    </div>
  )
}
