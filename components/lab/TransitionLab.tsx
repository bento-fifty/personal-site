'use client'

import { useEffect, useRef, useState } from 'react'
import TransitionShaderCanvas from './TransitionShaderCanvas'
import {
  ditherExpand,
  ditherSquare,
  ditherDiamond,
  ditherDiagonal,
  ditherScanlines,
  ditherGrid,
  ditherCollision,
} from './transitionShaders'

type Variant = {
  id: string
  name: string
  frag: string
  note: string
}

const VARIANTS: Variant[] = [
  { id: 'circle', name: '01 · CIRCLE (現行)', frag: ditherExpand, note: 'length() · 標準放射' },
  { id: 'square', name: '02 · SQUARE', frag: ditherSquare, note: 'max(|dx|,|dy|) · 方形 CRT 感' },
  { id: 'diamond', name: '03 · DIAMOND', frag: ditherDiamond, note: '|dx|+|dy| · 菱形銳利' },
  { id: 'diagonal', name: '04 · DIAGONAL WIPE', frag: ditherDiagonal, note: '粗條帶對角掃過' },
  { id: 'scan', name: '05 · SCANLINES', frag: ditherScanlines, note: '水平橫條由 origin 上下擴張' },
  { id: 'grid', name: '06 · GRID FRAGMENTS', frag: ditherGrid, note: '12×8 格碎片依距離依序點亮' },
  { id: 'collision', name: '07 · COLLISION', frag: ditherCollision, note: 'origin + 對角同時擴散撞擊' },
]

const DURATION = 680 // ms total, peak coverage mid

export default function TransitionLab() {
  const [active, setActive] = useState<Variant | null>(null)
  const [progress, setProgress] = useState(0)
  const [origin, setOrigin] = useState<[number, number]>([0.5, 0.5])
  const rafRef = useRef<number | null>(null)
  const startRef = useRef(0)

  const fire = (v: Variant, e: React.MouseEvent) => {
    if (active) return
    // convert click to uv (0..1) — Y flipped for WebGL
    const x = e.clientX / window.innerWidth
    const y = 1 - e.clientY / window.innerHeight
    setOrigin([x, y])
    setActive(v)
    startRef.current = performance.now()

    const tick = () => {
      const t = (performance.now() - startRef.current) / DURATION
      if (t >= 1) {
        setProgress(0)
        setActive(null)
        return
      }
      // 0 -> 1 -> 0 (sine curve, peak at 0.5)
      const p = Math.sin(t * Math.PI)
      setProgress(p)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div className="min-h-screen bg-[#0B1026] text-[#F0EDE6]">
      {/* fake page content */}
      <div className="mx-auto max-w-5xl px-8 py-20">
        <div className="font-mono text-[10px] tracking-[0.3em] text-[#5DD3E3] opacity-70">
          LAB / ROUTE_TRANSITION_SHADERS
        </div>
        <h1 className="mt-6 font-serif text-5xl leading-[1.05] text-[#F0EDE6]">
          Shader-driven transitions
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#F0EDE6]/70">
          點任一按鈕觸發轉場。每個 shader 同一條 sine 曲線（0→1→0, {DURATION}ms），
          coverage 在中段達峰。點擊位置會作為 origin 傳入 shader 做放射起點。
        </p>

        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              onClick={(e) => fire(v, e)}
              disabled={!!active}
              className="group relative overflow-hidden border border-[#5DD3E3]/40 bg-transparent p-5 text-left transition-colors hover:border-[#5DD3E3] hover:bg-[#5DD3E3]/5 disabled:opacity-40"
            >
              <div className="font-mono text-[10px] tracking-[0.28em] text-[#5DD3E3]">
                {v.name}
              </div>
              <div className="mt-3 text-[11px] leading-snug text-[#F0EDE6]/60">
                {v.note}
              </div>
              <div className="mt-6 font-mono text-[9px] tracking-[0.3em] text-[#E63E1F] opacity-0 transition-opacity group-hover:opacity-100">
                CLICK TO FIRE →
              </div>
            </button>
          ))}
        </div>

        <div className="mt-16 space-y-4 border-t border-[rgba(255,255,255,0.08)] pt-8 font-mono text-[10px] tracking-[0.22em] text-[#F0EDE6]/50">
          <div>DURATION · {DURATION}MS · SINE 0→1→0</div>
          <div>ORIGIN · [{origin[0].toFixed(2)}, {origin[1].toFixed(2)}]</div>
          <div>STATE · {active ? `FIRING · ${active.name}` : 'IDLE'}</div>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-4 opacity-40">
          {['SAMPLE_TILE_01', 'SAMPLE_TILE_02', 'SAMPLE_TILE_03'].map((s) => (
            <div key={s} className="aspect-[4/3] border border-[rgba(255,255,255,0.15)] p-4 font-mono text-[9px] tracking-[0.24em] text-[#F0EDE6]/60">
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* overlay */}
      {active && (
        <div className="pointer-events-none fixed inset-0 z-[9999]">
          <TransitionShaderCanvas
            frag={active.frag}
            progress={progress}
            origin={origin}
            className="h-full w-full"
          />
        </div>
      )}
    </div>
  )
}
