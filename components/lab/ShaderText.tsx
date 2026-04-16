'use client'

import { useEffect, useRef } from 'react'

// Renders a shader canvas clipped to the shape of text.
// Uses CSS mask with an inline SVG <text> as the alpha mask.

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`

type Props = {
  text: string
  frag: string
  fontFamily: string
  fontSize: number // px
  fontWeight?: number | string
  letterSpacing?: number // em
  progress?: number // 0..1, static by default = 1
  origin?: [number, number]
  pulse?: boolean // if true, progress cycles via sin(time)
  className?: string
}

export default function ShaderText({
  text,
  frag,
  fontFamily,
  fontSize,
  fontWeight = 700,
  letterSpacing = 0,
  progress = 1,
  origin = [0.5, 0.5],
  pulse = false,
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const stateRef = useRef({ progress, origin, pulse })
  stateRef.current = { progress, origin, pulse }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false })
    if (!gl) return

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s), src)
      return s
    }
    const vs = compile(gl.VERTEX_SHADER, VERT)
    const fs = compile(gl.FRAGMENT_SHADER, frag)
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )
    const loc = gl.getAttribLocation(prog, 'a_pos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uProg = gl.getUniformLocation(prog, 'u_progress')
    const uOrigin = gl.getUniformLocation(prog, 'u_origin')

    let raf = 0
    const start = performance.now()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth * dpr
      const h = canvas.clientHeight * dpr
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }

    const render = () => {
      resize()
      const t = (performance.now() - start) / 1000
      let p = stateRef.current.progress
      if (stateRef.current.pulse) {
        p = 0.5 + 0.5 * Math.sin(t * Math.PI * 0.6)
      }
      gl.uniform1f(uTime, t)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uProg, p)
      gl.uniform2f(uOrigin, stateRef.current.origin[0], stateRef.current.origin[1])
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      raf = requestAnimationFrame(render)
    }
    render()

    return () => cancelAnimationFrame(raf)
  }, [frag])

  // SVG data URI mask: alpha is the text shape
  const svgMask = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="400" viewBox="0 0 2000 400" preserveAspectRatio="xMidYMid meet"><text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" fill="white" font-family="${fontFamily.replace(/"/g, "'")}" font-size="${fontSize}" font-weight="${fontWeight}" letter-spacing="${letterSpacing}em">${text.replace(/</g, '&lt;')}</text></svg>`,
  )}`

  const maskStyle: React.CSSProperties = {
    WebkitMaskImage: `url("${svgMask}")`,
    maskImage: `url("${svgMask}")`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskSize: '100% 100%',
    maskSize: '100% 100%',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
  }

  return (
    <div className={className} style={{ position: 'relative', lineHeight: 0 }}>
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          ...maskStyle,
        }}
      />
    </div>
  )
}
