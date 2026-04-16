// Ambient-background shaders — static, looping, no progress uniform.
// Each is designed for a specific page role; palette/motion differ.

const HEAD = `
precision highp float;
uniform float u_time;
uniform vec2 u_res;

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
vec3 ICE      = vec3(0.365, 0.827, 0.890); // #5DD3E3
vec3 ICE_PALE = vec3(0.625, 0.937, 0.969); // #9FEFF7
vec3 ICE_DEEP = vec3(0.180, 0.561, 0.627); // #2E8FA0
vec3 FLAME    = vec3(0.902, 0.243, 0.122); // #E63E1F
vec3 EMBER    = vec3(1.000, 0.600, 0.300); // warm
vec3 NIGHT    = vec3(0.043, 0.063, 0.149); // #0B1026
vec3 MAGENTA  = vec3(1.000, 0.180, 0.823); // #FF2ED2
vec3 VIOLET   = vec3(0.623, 0.369, 1.000); // #9F5EFF
vec3 ACID     = vec3(0.169, 0.961, 0.722); // #2BF5B8
`;

// 1. LIQUID CHROME — silver-blue metal, chill wave-sheet (work list)
// Palette: cool — silver, ice, violet. No magenta, no warm tones.
export const voidStar = HEAD + `
float heightAt(vec2 p, float t){
  vec2 s1 = vec2(sin(t*0.14)*0.45, cos(t*0.12)*0.38);
  vec2 s2 = vec2(cos(t*0.10+1.2)*0.50, sin(t*0.16+0.5)*0.32);
  vec2 s3 = vec2(sin(t*0.18+2.1)*0.38, cos(t*0.17+2.8)*0.42);
  vec2 s4 = vec2(cos(t*0.13+3.4)*0.42, sin(t*0.20+1.1)*0.36);
  float w1 = sin(length(p-s1)*8.0 - t*0.7);
  float w2 = sin(length(p-s2)*7.0 - t*0.55);
  float w3 = sin(length(p-s3)*10.0 - t*0.8);
  float w4 = sin(length(p-s4)*6.0 - t*0.45);
  return (w1 + w2 + w3 + w4) * 0.25;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 aspect = vec2(u_res.x/u_res.y, 1.0);
  vec2 p = (uv - 0.5) * aspect;
  float t = u_time;

  float h = heightAt(p, t);
  float e = 0.006;
  float hx = heightAt(p + vec2(e, 0.0), t) - heightAt(p - vec2(e, 0.0), t);
  float hy = heightAt(p + vec2(0.0, e), t) - heightAt(p - vec2(0.0, e), t);
  vec3 N = normalize(vec3(-hx * 14.0, -hy * 14.0, 1.0)); // softer normal

  vec3 L = normalize(vec3(-0.35, 0.5, 0.85));
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 R = reflect(-L, N);
  float diff = max(0.0, dot(N, L));
  float spec = pow(max(0.0, dot(R, V)), 22.0); // wider, gentler highlight
  float rim  = pow(1.0 - max(0.0, dot(N, V)), 2.5);

  // cool iridescence: ice ↔ violet only
  vec3 iri = vec3(
    0.5 + 0.5 * sin(N.x * 3.2 + 0.0),
    0.5 + 0.5 * sin(N.y * 3.2 + 2.0),
    0.5 + 0.5 * sin((N.x + N.y) * 3.2 + 4.0)
  );
  vec3 iriMix = mix(ICE, VIOLET, iri.r) * 0.5 + mix(ICE_PALE, ICE_DEEP, iri.g) * 0.5;

  // silver-cool body
  vec3 silver = vec3(0.72, 0.80, 0.92);
  vec3 body = mix(NIGHT * 0.8, silver * 0.65, diff);

  vec3 col = body;
  col = mix(col, iriMix, 0.28 * (0.6 + diff * 0.4));
  col += vec3(0.92, 0.96, 1.0) * spec * 0.9;
  col += VIOLET * rim * 0.15;
  col = pow(col, vec3(0.95));
  gl_FragColor = vec4(col, 1.0);
}
`;

// 2. INK POOL — near-black obsidian metal with grazing-angle indigo/violet (case detail)
// Palette: deep blue-black, rim-only iridescence. Reading-friendly.
export const aperture = HEAD + `
float heightAt(vec2 p, float t){
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(3.8, -t)));
  return fbm(p * 0.9 + q * 1.2 + vec2(0.0, t * 0.2));
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv * 1.8;
  float t = u_time * 0.05;

  float h = heightAt(p, t);
  float e = 0.014;
  float hx = heightAt(p + vec2(e, 0.0), t) - heightAt(p - vec2(e, 0.0), t);
  float hy = heightAt(p + vec2(0.0, e), t) - heightAt(p - vec2(0.0, e), t);
  vec3 N = normalize(vec3(-hx * 18.0, -hy * 18.0, 1.0));

  vec3 L = normalize(vec3(0.2, 0.55, 0.82));
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 R = reflect(-L, N);
  float diff = max(0.0, dot(N, L));
  float spec = pow(max(0.0, dot(R, V)), 28.0);
  // grazing-angle weight — where iridescence lives
  float graze = pow(1.0 - max(0.0, dot(N, V)), 3.0);

  // muted cold palette — indigo, ultramarine, violet, faint teal
  vec3 OBSIDIAN    = vec3(0.025, 0.030, 0.055);
  vec3 INDIGO      = vec3(0.20, 0.22, 0.55);
  vec3 ULTRAMARINE = vec3(0.12, 0.32, 0.72);
  vec3 DEEP_VIOLET = vec3(0.35, 0.18, 0.55);
  vec3 COOL_TEAL   = vec3(0.18, 0.45, 0.50);

  float a = atan(N.y, N.x);
  vec3 iri = vec3(
    0.5 + 0.5 * sin(a * 1.6 + h * 1.5),
    0.5 + 0.5 * sin(a * 1.6 + h * 1.5 + 2.1),
    0.5 + 0.5 * sin(a * 1.6 + h * 1.5 + 4.2)
  );
  vec3 iriMix = mix(INDIGO, ULTRAMARINE, iri.r) * 0.55 + mix(DEEP_VIOLET, COOL_TEAL, iri.g) * 0.30;

  // body stays very dark — mostly obsidian
  vec3 body = mix(OBSIDIAN, INDIGO * 0.25, diff * 0.6);

  vec3 col = body;
  // iridescence only at grazing angles — keeps center calm
  col = mix(col, iriMix, 0.45 * graze);
  // soft dim specular, tinted cool
  col += vec3(0.78, 0.85, 1.0) * spec * 0.55;
  col = pow(col, vec3(0.96));
  gl_FragColor = vec4(col, 1.0);
}
`;

// 3. EMBER MAP — sparse contour lines + a warm dot wandering (about)
export const emberMap = HEAD + `
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv * 2.0;
  float h = fbm(p * 1.3);
  // contour lines: threshold-slice fbm
  float rings = abs(sin(h * 18.0));
  float contour = smoothstep(0.06, 0.0, rings) * 0.45;
  // finer second set of lines
  float rings2 = abs(sin(h * 36.0 + 0.5));
  float contour2 = smoothstep(0.04, 0.0, rings2) * 0.15;

  // wandering ember — slow lissajous path, 30-sec cycle
  float ta = u_time * 0.21;
  vec2 ember = vec2(0.5 + sin(ta) * 0.35, 0.5 + cos(ta * 0.7) * 0.28);
  float d = length((uv - ember) * vec2(u_res.x/u_res.y, 1.0));
  float glow = smoothstep(0.12, 0.0, d);
  float core = smoothstep(0.015, 0.0, d);

  vec3 col = NIGHT;
  col = mix(col, ICE_DEEP * 0.7, contour + contour2);
  col += EMBER * glow * 0.35;
  col += vec3(1.0, 0.8, 0.5) * core;
  gl_FragColor = vec4(col, 1.0);
}
`;

// 4. EMERALD FERROFLUID — green-teal-violet iridescent droplets, slow drift (services)
// Palette: green iridescence — emerald, teal, violet undertones.
export const blueprint = HEAD + `
vec2 hash2(vec2 p){
  return fract(sin(vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3))))*43758.5453);
}
float smin(float a, float b, float k){
  float h = clamp(0.5 + 0.5*(b-a)/k, 0.0, 1.0);
  return mix(b, a, h) - k*h*(1.0-h);
}
float fieldAt(vec2 p, float t){
  vec2 iP = floor(p);
  vec2 fP = fract(p);
  float d = 1e5;
  for(int y=-1;y<=1;y++){
    for(int x=-1;x<=1;x++){
      vec2 g = vec2(float(x), float(y));
      vec2 rnd = hash2(iP + g);
      vec2 seedPos = 0.5 + 0.42 * sin(t + rnd * 6.2831);
      float di = length(g + seedPos - fP);
      d = smin(d, di, 0.45); // larger k → softer merges
    }
  }
  return d;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv * vec2(u_res.x/u_res.y * 3.8, 3.8);
  float t = u_time * 0.08;

  float d  = fieldAt(p, t);
  float e = 0.018;
  float dx = fieldAt(p + vec2(e, 0.0), t) - fieldAt(p - vec2(e, 0.0), t);
  float dy = fieldAt(p + vec2(0.0, e), t) - fieldAt(p - vec2(0.0, e), t);
  vec3 N = normalize(vec3(dx * 8.0, dy * 8.0, 1.0));

  vec3 L = normalize(vec3(-0.35, 0.5, 0.8));
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 R = reflect(-L, N);
  float diff = max(0.0, dot(N, L));
  float spec = pow(max(0.0, dot(R, V)), 20.0);
  float rim = pow(1.0 - max(0.0, dot(N, V)), 2.3);

  float body = smoothstep(0.85, 0.25, d);

  // green-family iridescence
  vec3 EMERALD = vec3(0.12, 0.78, 0.55);
  vec3 TEAL    = vec3(0.28, 0.70, 0.68);
  vec3 JADE    = vec3(0.45, 0.80, 0.55);
  float a = atan(N.y, N.x);
  vec3 iri = vec3(
    0.5 + 0.5 * sin(a * 2.0 + d * 3.0),
    0.5 + 0.5 * sin(a * 2.0 + d * 3.0 + 2.1),
    0.5 + 0.5 * sin(a * 2.0 + d * 3.0 + 4.2)
  );
  vec3 iriMix = mix(EMERALD, TEAL, iri.r) * 0.55 + mix(JADE, VIOLET, iri.g) * 0.35;

  // deep teal-night body
  vec3 DARK_TEAL = vec3(0.03, 0.09, 0.10);
  vec3 darkMetal = mix(DARK_TEAL, TEAL * 0.5, diff);
  vec3 col = darkMetal;
  col = mix(col, iriMix, 0.42 * body);
  col += vec3(0.85, 1.0, 0.92) * spec * body * 1.0;
  col += VIOLET * rim * body * 0.2;
  // meniscus glow between droplets
  col += EMERALD * smoothstep(0.18, 0.1, d) * (1.0 - body) * 0.3;
  col = pow(col, vec3(0.93));
  gl_FragColor = vec4(col, 1.0);
}
`;

// 5. PULSE — heartbeat rings from off-center origin, 5-sec cycle (contact)
export const pulse = HEAD + `
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 center = vec2(0.3, 0.45);
  vec2 d = (uv - center) * vec2(u_res.x/u_res.y, 1.0);
  float r = length(d);
  float cyc = 5.0;
  float t = mod(u_time, cyc) / cyc; // 0..1
  // two staggered pulses per cycle (like heartbeat: lub-dub)
  float p1 = pow(max(0.0, 1.0 - abs(r - t * 1.2) * 4.0), 2.0);
  float t2 = mod(u_time - 0.22, cyc) / cyc;
  float p2 = pow(max(0.0, 1.0 - abs(r - t2 * 1.2) * 6.0), 2.5) * 0.6;
  // fade pulse as it expands
  float pulse = (p1 + p2) * smoothstep(1.2, 0.0, r);
  // ambient warm wash
  float n = fbm(uv * 2.0 + u_time * 0.04);
  vec3 col = mix(NIGHT, EMBER * 0.2, n * 0.3);
  col += FLAME * pulse * 0.45;
  col += EMBER * pulse * 0.25;
  gl_FragColor = vec4(col, 1.0);
}
`;

// 6. INK — ink-in-water diffusion, monochrome ice (blog / reading)
export const ink = HEAD + `
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float t = u_time * 0.04;
  // domain-warped fbm for organic bleed
  vec2 q = vec2(fbm(uv * 2.0 + t), fbm(uv * 2.0 + vec2(3.1, 1.7) - t));
  float n = fbm(uv * 2.5 + q * 1.4);
  // two-tone paper: dark newsprint + lighter bleed
  float ink1 = smoothstep(0.35, 0.65, n);
  float ink2 = smoothstep(0.55, 0.85, n);
  vec3 col = mix(NIGHT * 0.9, ICE_DEEP * 0.6, ink1);
  col = mix(col, ICE_PALE * 0.55, ink2 * 0.7);
  // soft horizontal paper texture
  col *= 0.92 + 0.08 * sin(uv.y * 180.0);
  gl_FragColor = vec4(col, 1.0);
}
`;
