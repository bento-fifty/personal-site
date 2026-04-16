// Shared header for all fragment shaders
const HEAD = `
precision highp float;
uniform float u_time;
uniform vec2 u_res;

// classic 2D hash + value noise
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
`

// 1. Dithered duotone flow — flame x ice, Bayer 4x4 dither
export const dithered = HEAD + `
// Bayer 4x4 via bit-trick-ish selection
float bayer4(vec2 p){
  int x = int(mod(p.x, 4.0));
  int y = int(mod(p.y, 4.0));
  // Bayer 4x4 matrix values / 16 (classic):
  //  0  8  2 10
  // 12  4 14  6
  //  3 11  1  9
  // 15  7 13  5
  float v = 0.0;
  if(y==0){
    if(x==0) v = 0.0;  else if(x==1) v = 8.0;  else if(x==2) v = 2.0;  else v = 10.0;
  } else if(y==1){
    if(x==0) v = 12.0; else if(x==1) v = 4.0;  else if(x==2) v = 14.0; else v = 6.0;
  } else if(y==2){
    if(x==0) v = 3.0;  else if(x==1) v = 11.0; else if(x==2) v = 1.0;  else v = 9.0;
  } else {
    if(x==0) v = 15.0; else if(x==1) v = 7.0;  else if(x==2) v = 13.0; else v = 5.0;
  }
  return v / 16.0;
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv * 2.5;
  p.x += u_time * 0.05;
  float n = fbm(p + fbm(p*1.3 + u_time*0.1));
  // quantize to 2x2 pixel blocks for chunky feel
  vec2 px = floor(gl_FragCoord.xy / 2.0);
  float d = bayer4(px);
  float v = step(d, n);
  vec3 ice = vec3(0.365, 0.827, 0.890);   // #5DD3E3
  vec3 flame = vec3(0.902, 0.243, 0.122); // #E63E1F
  vec3 col = mix(vec3(0.03), mix(ice*0.7, flame, smoothstep(0.4, 0.8, n)), v);
  gl_FragColor = vec4(col, 1.0);
}
`

// 2. Flame noise field — domain-warped
export const flame = HEAD + `
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv * 3.0;
  vec2 q = vec2(fbm(p + u_time*0.08), fbm(p + vec2(5.2, 1.3)));
  vec2 r = vec2(fbm(p + q + vec2(1.7, 9.2) + u_time*0.05),
                fbm(p + q + vec2(8.3, 2.8)));
  float n = fbm(p + r);
  n = pow(n, 1.4);
  vec3 flameCol = vec3(0.902, 0.243, 0.122);
  vec3 col = mix(vec3(0.02, 0.01, 0.0), flameCol, n*1.3);
  col += vec3(0.5, 0.12, 0.0) * pow(n, 5.0);
  gl_FragColor = vec4(col, 1.0);
}
`

// 3. Ice voronoi plates
export const voronoi = HEAD + `
vec2 hash2(vec2 p){
  return fract(sin(vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3))))*43758.5453);
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv * 6.0;
  p.x += u_time * 0.06;
  vec2 i = floor(p); vec2 f = fract(p);
  float minD = 1.0; float minD2 = 1.0;
  for(int y=-1;y<=1;y++){
    for(int x=-1;x<=1;x++){
      vec2 g = vec2(float(x), float(y));
      vec2 o = hash2(i+g);
      o = 0.5 + 0.5*sin(u_time*0.3 + 6.2831*o);
      vec2 r = g + o - f;
      float d = dot(r,r);
      if(d < minD){ minD2 = minD; minD = d; } else if(d < minD2){ minD2 = d; }
    }
  }
  float edge = smoothstep(0.0, 0.05, sqrt(minD2) - sqrt(minD));
  vec3 ice = vec3(0.365, 0.827, 0.890);
  vec3 col = mix(vec3(0.02, 0.04, 0.06), ice*0.35, sqrt(minD));
  col += ice * (1.0 - edge) * 0.8;
  gl_FragColor = vec4(col, 1.0);
}
`

// 4. CRT scanline + chromatic drift
export const crt = HEAD + `
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float warp = sin(uv.y*3.0 + u_time*0.4) * 0.015;
  vec2 p = vec2(uv.x + warp, uv.y);
  float bg = fbm(p*2.5 + u_time*0.1);
  vec3 flame = vec3(0.902, 0.243, 0.122);
  vec3 ice = vec3(0.365, 0.827, 0.890);
  // chromatic split
  float r = fbm((p+vec2(0.01,0.))*2.5 + u_time*0.1);
  float b = fbm((p-vec2(0.01,0.))*2.5 + u_time*0.1);
  vec3 col = vec3(r*flame.r, bg*0.15, b*ice.b);
  // scanlines
  float scan = 0.75 + 0.25*sin(gl_FragCoord.y*1.5);
  col *= scan;
  // horizontal roll
  float roll = step(0.995, fract(uv.y*3.0 - u_time*0.2));
  col += roll * 0.3;
  gl_FragColor = vec4(col, 1.0);
}
`

// 5. Wireframe terrain scan
export const terrain = HEAD + `
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = (uv - 0.5) * vec2(u_res.x/u_res.y, 1.0);
  // pseudo-perspective: stretch y for depth
  float depth = 1.0 / max(p.y + 0.1, 0.05);
  vec2 g = vec2(p.x * depth, depth * 2.0 - u_time * 0.4);
  float h = fbm(g*0.4) * 0.3 * smoothstep(-0.1, 0.5, p.y);
  // grid lines
  vec2 grid = fract(g * vec2(4.0, 1.0));
  float line = max(
    smoothstep(0.02, 0.0, abs(grid.x - 0.5)),
    smoothstep(0.04, 0.0, abs(grid.y - 0.5 + h*3.0))
  );
  line *= smoothstep(0.5, -0.2, p.y) * 1.2;
  vec3 ice = vec3(0.365, 0.827, 0.890);
  vec3 col = vec3(0.015, 0.02, 0.03) + ice * line * 0.9;
  // horizon glow
  col += ice * 0.3 * smoothstep(0.1, -0.05, abs(p.y + 0.05));
  gl_FragColor = vec4(col, 1.0);
}
`

// 6. Grain storm — high contrast bw
export const grain = HEAD + `
void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv * 4.0;
  float slow = fbm(p*0.4 + u_time*0.05);
  // fast grain
  float g = hash(floor(gl_FragCoord.xy*0.8) + floor(u_time*60.0));
  float mask = smoothstep(0.3, 0.7, slow);
  float v = mix(g*0.3, g, mask);
  v = pow(v, 1.3);
  vec3 col = vec3(v);
  gl_FragColor = vec4(col, 1.0);
}
`
