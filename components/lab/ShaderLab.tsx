'use client'

import { useState } from 'react'
import ShaderCanvas from './ShaderCanvas'
import { dithered, flame, voronoi, crt, terrain, grain } from './shaders'

type Entry = { id: string; label: string; tag: string; frag: string; note: string }

const ENTRIES: Entry[] = [
  { id: '01', label: 'DITHERED DUOTONE', tag: '推薦', frag: dithered, note: 'flame × ice, Bayer dither, 像素編輯感' },
  { id: '02', label: 'FLAME FIELD', tag: '', frag: flame, note: '單色橘紅 domain-warped noise' },
  { id: '03', label: 'ICE VORONOI', tag: '', frag: voronoi, note: '冷藍板塊慢速漂移' },
  { id: '04', label: 'CRT SCANLINE', tag: '', frag: crt, note: '掃描線 + RGB 偏移 + horizontal roll' },
  { id: '05', label: 'TERRAIN SCAN', tag: '', frag: terrain, note: '低多邊形地形雷達' },
  { id: '06', label: 'GRAIN STORM', tag: '', frag: grain, note: '高對比黑白粒子' },
]

export default function ShaderLab() {
  const [focus, setFocus] = useState<string | null>(null)
  const focused = ENTRIES.find((e) => e.id === focus)

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <div className="px-6 pt-8 pb-6 flex items-baseline justify-between border-b border-white/10">
        <div>
          <div className="font-mono text-[11px] tracking-[0.2em] text-white/50">
            [ SHADER LAB / HOMEPAGE BG EXPLORATION ]
          </div>
          <h1 className="mt-2 text-2xl font-display tracking-wide">6 DIRECTIONS</h1>
        </div>
        <div className="font-mono text-[11px] text-white/40">點一格進入全螢幕</div>
      </div>

      {focused ? (
        <div className="relative">
          <ShaderCanvas
            frag={focused.frag}
            className="block w-screen h-[calc(100vh-80px)]"
          />
          <div className="absolute top-4 left-4 font-mono text-[11px] tracking-[0.2em] bg-black/60 backdrop-blur px-3 py-2 border border-white/20">
            <span className="text-white/60">{focused.id}</span>{' '}
            <span className="text-white">{focused.label}</span>
            {focused.tag && (
              <span className="ml-2 text-[#E63E1F]">[{focused.tag}]</span>
            )}
          </div>
          <button
            onClick={() => setFocus(null)}
            className="absolute top-4 right-4 font-mono text-[11px] tracking-[0.2em] bg-black/60 backdrop-blur px-3 py-2 border border-white/20 hover:bg-white hover:text-black transition"
          >
            ← BACK TO GRID
          </button>
          <div className="absolute bottom-4 left-4 font-mono text-[11px] text-white/70 bg-black/60 backdrop-blur px-3 py-2 border border-white/20 max-w-md">
            {focused.note}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-white/10">
          {ENTRIES.map((e) => (
            <button
              key={e.id}
              onClick={() => setFocus(e.id)}
              className="group relative bg-[#080808] aspect-[4/3] overflow-hidden text-left"
            >
              <ShaderCanvas frag={e.frag} className="block w-full h-full" />
              <div className="absolute inset-0 pointer-events-none border border-transparent group-hover:border-white transition" />
              <div className="absolute top-3 left-3 font-mono text-[10px] tracking-[0.2em] bg-black/60 backdrop-blur px-2 py-1 border border-white/20">
                <span className="text-white/50">{e.id}</span>{' '}
                <span className="text-white">{e.label}</span>
                {e.tag && (
                  <span className="ml-2 text-[#E63E1F]">[{e.tag}]</span>
                )}
              </div>
              <div className="absolute bottom-3 left-3 right-3 font-mono text-[10px] text-white/70 bg-black/60 backdrop-blur px-2 py-1 border border-white/20 opacity-0 group-hover:opacity-100 transition">
                {e.note}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
