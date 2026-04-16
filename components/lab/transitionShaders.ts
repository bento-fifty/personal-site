// Route-transition shaders. All use u_progress (0..1..0 curve) + u_origin (uv space).
// Coverage peaks at progress ~= 0.5.

const HEAD = `
precision highp float;
uniform float u_time;
uniform vec2 u_res;
uniform float u_progress;
uniform vec2 u_origin;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  float a = hash(i), b = hash(i+vec2(1.,0.));
  float c = hash(i+vec2(0.,1.)), d = hash(i+vec2(1.,1.));
  vec2 u = f*f*(3.-2.*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.; float a = 0.5;
  for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
vec3 ICE = vec3(0.365, 0.827, 0.890);
vec3 ICE_DEEP = vec3(0.180, 0.561, 0.627);
vec3 FLAME = vec3(0.902, 0.243, 0.122);
vec3 NIGHT = vec3(0.043, 0.063, 0.149);
`

// 1. Dither expand — Bayer dither radius grows from origin to cover, with flame/ice fill
export const ditherExpand = HEAD + `
float bayer4(vec2 p){
  int x = int(mod(p.x, 4.0));
  int y = int(mod(p.y, 4.0));
  float v = 0.0;
  if(y==0){ if(x==0) v=0.0; else if(x==1) v=8.0; else if(x==2) v=2.0; else v=10.0; }
  else if(y==1){ if(x==0) v=12.0; else if(x==1) v=4.0; else if(x==2) v=14.0; else v=6.0; }
  else if(y==2){ if(x==0) v=3.0; else if(x==1) v=11.0; else if(x==2) v=1.0; else v=9.0; }
  else { if(x==0) v=15.0; else if(x==1) v=7.0; else if(x==2) v=13.0; else v=5.0; }
  return v / 16.0;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 d = (uv - u_origin) * vec2(u_res.x/u_res.y, 1.0);
  float r = length(d);
  // progress 0 -> radius 0, progress 1 -> radius 1.8 (covers corners)
  float radius = u_progress * 1.8;
  // soft edge
  float mask = smoothstep(radius + 0.08, radius - 0.08, r);
  // dither inside the mask
  vec2 px = floor(gl_FragCoord.xy / 3.0);
  float bd = bayer4(px);
  float n = fbm(uv * 4.0 + u_time*0.1);
  float fill = step(bd, mask * (0.6 + 0.4*n));
  // coloring: ice body, flame flecks
  vec3 col = mix(ICE_DEEP*0.8, ICE, n);
  col = mix(col, FLAME, smoothstep(0.75, 0.95, n) * mask);
  gl_FragColor = vec4(col, fill);
}
`

// 2. Voronoi shatter — ice cell tessellation expanding from origin
export const voronoiShatter = HEAD + `
vec2 hash2(vec2 p){
  return fract(sin(vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3))))*43758.5453);
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 aspect = vec2(u_res.x/u_res.y, 1.0);
  vec2 p = uv * 8.0;
  vec2 i = floor(p); vec2 f = fract(p);
  float minD = 1.0; float minD2 = 1.0;
  for(int y=-1;y<=1;y++){
    for(int x=-1;x<=1;x++){
      vec2 g = vec2(float(x), float(y));
      vec2 o = hash2(i+g);
      vec2 r = g + o - f;
      float d = dot(r,r);
      if(d < minD){ minD2 = minD; minD = d; } else if(d < minD2){ minD2 = d; }
    }
  }
  float edge = smoothstep(0.0, 0.04, sqrt(minD2) - sqrt(minD));
  // distance from origin for reveal
  vec2 od = (uv - u_origin) * aspect;
  float r = length(od);
  float radius = u_progress * 1.8;
  // stagger cells by hash so they appear in shatter order
  vec2 cellId = floor(p);
  float cellRand = hash(cellId);
  float cellRadius = radius - cellRand * 0.25;
  float mask = smoothstep(cellRadius + 0.05, cellRadius - 0.05, r);
  vec3 col = mix(NIGHT, ICE_DEEP, 0.6);
  col += ICE * (1.0 - edge) * 0.9;
  // flame on edges
  col = mix(col, FLAME, (1.0 - edge) * 0.15);
  gl_FragColor = vec4(col, mask);
}
`

// 3. CRT roll — chromatic horizontal rollover, feels like cut to black signal
export const crtRoll = HEAD + `
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  // displacement driven by progress: bar sweeps from bottom up
  float barY = 1.0 - u_progress * 1.3;
  float barThickness = 0.3;
  float inBar = smoothstep(barY + barThickness, barY, uv.y) *
                smoothstep(barY - barThickness, barY, uv.y);
  // below-bar: covered; above-bar: not yet
  float coverage = 1.0 - smoothstep(barY, barY + 0.02, uv.y);
  // noise band at the bar edge
  float band = smoothstep(0.8, 1.0, inBar);
  float grain = hash(floor(gl_FragCoord.xy*0.6) + floor(u_time*60.0));
  float scan = 0.7 + 0.3*sin(gl_FragCoord.y*2.0);
  // chromatic split at bar edge
  float r = step(0.5, grain + band*0.8);
  vec3 col = mix(NIGHT, vec3(0.02), coverage);
  col += FLAME * band * (0.5 + 0.5*r);
  col += ICE * band * (0.4 + 0.3*(1.0-r));
  col *= scan;
  gl_FragColor = vec4(col, coverage + band);
}
`

// 4. Grain dissolve — heavy film grain erasure from origin outward
export const grainDissolve = HEAD + `
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 aspect = vec2(u_res.x/u_res.y, 1.0);
  vec2 od = (uv - u_origin) * aspect;
  float r = length(od);
  float radius = u_progress * 1.8;
  // per-pixel jitter in the threshold so edge is chunky
  float jitter = hash(floor(gl_FragCoord.xy*0.5)) * 0.12;
  float mask = step(r, radius + jitter);
  // grain inside: heavy monochrome film grain
  float slow = fbm(uv * 3.0 + u_time*0.08);
  float fast = hash(floor(gl_FragCoord.xy) + floor(u_time*60.0));
  float v = mix(slow, fast, 0.6);
  v = pow(v, 1.3);
  vec3 col = mix(NIGHT, ICE*0.9, v);
  col = mix(col, FLAME, smoothstep(0.75, 1.0, v) * 0.7);
  gl_FragColor = vec4(col, mask);
}
`

// ========================================================================
// Dither-family variants — same coloring + Bayer dither, different mask metric
// ========================================================================

const BAYER = `
float bayer4(vec2 p){
  int x = int(mod(p.x, 4.0));
  int y = int(mod(p.y, 4.0));
  float v = 0.0;
  if(y==0){ if(x==0) v=0.0; else if(x==1) v=8.0; else if(x==2) v=2.0; else v=10.0; }
  else if(y==1){ if(x==0) v=12.0; else if(x==1) v=4.0; else if(x==2) v=14.0; else v=6.0; }
  else if(y==2){ if(x==0) v=3.0; else if(x==1) v=11.0; else if(x==2) v=1.0; else v=9.0; }
  else { if(x==0) v=15.0; else if(x==1) v=7.0; else if(x==2) v=13.0; else v=5.0; }
  return v / 16.0;
}
`

// Shared body: given `mask` 0..1, emit dithered ice/flame fill
const DITHER_OUT = `
  vec2 px = floor(gl_FragCoord.xy / 3.0);
  float bd = bayer4(px);
  vec2 uvN = gl_FragCoord.xy / u_res.xy;
  float n = fbm(uvN * 4.0 + u_time*0.1);
  float fill = step(bd, mask * (0.6 + 0.4*n));
  vec3 col = mix(ICE_DEEP*0.8, ICE, n);
  col = mix(col, FLAME, smoothstep(0.75, 0.95, n) * mask);
  gl_FragColor = vec4(col, fill);
`

// A. Square expand — max(|dx|,|dy|), blocky CRT feel
export const ditherSquare = HEAD + BAYER + `
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 d = (uv - u_origin) * vec2(u_res.x/u_res.y, 1.0);
  float r = max(abs(d.x), abs(d.y));
  float radius = u_progress * 1.4;
  float mask = smoothstep(radius + 0.06, radius - 0.06, r);
  ${DITHER_OUT}
}
`

// B. Diamond expand — |dx|+|dy|, rotated square
export const ditherDiamond = HEAD + BAYER + `
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 d = (uv - u_origin) * vec2(u_res.x/u_res.y, 1.0);
  float r = abs(d.x) + abs(d.y);
  float radius = u_progress * 2.2;
  float mask = smoothstep(radius + 0.08, radius - 0.08, r);
  ${DITHER_OUT}
}
`

// C. Diagonal wipe — thick band sweeps across, origin-agnostic direction via u_origin.x sign
// (forward: L→R, back: R→L handled by origin mapping)
export const ditherDiagonal = HEAD + BAYER + `
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  // project uv onto diagonal axis (-1 .. 2)
  float axis = uv.x * 0.6 + uv.y * 0.4;
  // direction flip: origin.x > 0.5 means start from left (sweep L→R)
  float dir = u_origin.x > 0.5 ? 1.0 : -1.0;
  float pos = dir > 0.0 ? axis : (1.0 - axis);
  // progress drives wave front from -0.3 to 1.3
  float front = u_progress * 1.6 - 0.3;
  float mask = smoothstep(front + 0.12, front - 0.12, pos);
  ${DITHER_OUT}
}
`

// D. Scanlines sweep — horizontal band from origin.y outward both directions
export const ditherScanlines = HEAD + BAYER + `
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float dy = abs(uv.y - u_origin.y);
  float radius = u_progress * 1.1;
  float mask = smoothstep(radius + 0.04, radius - 0.04, dy);
  // accentuate scanline feel: darken even pixel rows
  float line = 0.85 + 0.15 * sin(gl_FragCoord.y * 1.8);
  mask *= line;
  ${DITHER_OUT}
}
`

// E. Grid fragments — 12x8 cells, each lights in order by distance to origin + random jitter
export const ditherGrid = HEAD + BAYER + `
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 cells = vec2(12.0, 8.0);
  vec2 cellId = floor(uv * cells);
  vec2 cellCenter = (cellId + 0.5) / cells;
  vec2 d = (cellCenter - u_origin) * vec2(u_res.x/u_res.y, 1.0);
  float cellDist = length(d);
  // per-cell hash for shuffle
  float jitter = hash(cellId) * 0.3;
  float cellRadius = u_progress * 1.8;
  float cellMask = smoothstep(cellRadius + 0.1, cellRadius - 0.1, cellDist + jitter);
  // fade at cell edges for grid feel
  vec2 f = fract(uv * cells);
  float border = min(min(f.x, 1.0-f.x), min(f.y, 1.0-f.y));
  float edgeFade = smoothstep(0.0, 0.04, border);
  float mask = cellMask * edgeFade;
  ${DITHER_OUT}
}
`

// F. Bidirectional collision — origin + opposite expand until collide
export const ditherCollision = HEAD + BAYER + `
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 opp = vec2(1.0, 1.0) - u_origin;
  vec2 d1 = (uv - u_origin) * vec2(u_res.x/u_res.y, 1.0);
  vec2 d2 = (uv - opp) * vec2(u_res.x/u_res.y, 1.0);
  float r1 = length(d1);
  float r2 = length(d2);
  float radius = u_progress * 1.2;
  float m1 = smoothstep(radius + 0.06, radius - 0.06, r1);
  float m2 = smoothstep(radius + 0.06, radius - 0.06, r2);
  float mask = max(m1, m2);
  ${DITHER_OUT}
}
`
