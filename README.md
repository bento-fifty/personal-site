# Evan Chang — Personal Site

Bilingual (zh-TW / en) portfolio site for **Evan Chang** — event planner,
producer, and consultant based in Taipei. Editorial × cyber-HUD aesthetic:
dark background, neon-blue accents, scan lines, CRT glitches, scroll-linked
animations.

## Stack

- **[Next.js 16](https://nextjs.org)** with App Router + Turbopack
- **[Tailwind v4](https://tailwindcss.com)** (CSS-first, no config file)
- **[framer-motion](https://motion.dev)** for all animations
- **[next-intl](https://next-intl.dev)** — bilingual routing, zh-TW default
- **TypeScript** strict mode
- **Cormorant Garamond** + **Noto Serif TC** (display) + **Space Mono** (labels)
- Deploy target: **Vercel** (with `@vercel/analytics` + `@vercel/speed-insights`)

## Commands

```bash
npm run dev      # Dev server on :3000 (Turbopack)
npm run build    # Production build
npm run start    # Run production build locally
npm run lint     # ESLint check
```

No test suite yet.

## Architecture

The home page is a single scrollable experience composed of:

1. **`Hero`** — loading intro → headline with scan-line + character scramble
   + blinking cursor, EVENTS ghost text with CRT scan + slice glitch,
   subheading (企劃 · 統籌 · 顧問) where each role clicks through to
   `/work?type=BRAND|EVENT|CORP`
2. **`FeaturedWork`** — typography-first featured stats with count-up + burst
   glitches, then three scroll-linked full-viewport case sections with
   per-character CJK title reveal and English subtitle scramble decode
3. **`LocationsMap`** — SVG Taiwan with lat/lng-clipped grid + constellation
   pin lines. Pins auto-render from `lib/work-data.ts` cases tagged with
   `location: 'taipei'` etc. (catalog in `lib/locations.ts`).
4. **`Footer`** — large editorial `Evan Chang.` wordmark with signature-draw
   intro + periodic letter glitch + period pulse

Held together by:

- **`HomeAmbientBg`** — page-level fixed DataStreams (matrix character rain)
  as a single continuous backdrop so sections don't feel panelled
- **`SectionNavigator`** — right-edge fixed dots + scroll progress line,
  jumps between the four sections

Routing lives under `app/[locale]/`. The rest of the inner pages
(`about`, `services`, `blog`, `contact`) are still stubs. `work/` has a real
`CaseList` with `?type` query-param filtering (wrapped in `<Suspense>` so
`useSearchParams` doesn't deopt the build).

See **[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)** for the hybrid
Vercel + Cloudflare Workers deploy plan (main site on Vercel, high-traffic
APIs can be split to CF Workers later via `lib/api-client.ts`'s
`NEXT_PUBLIC_API_BASE` env var). See **[`CLAUDE.md`](CLAUDE.md)** for a
deeper component-by-component tour, including Next.js 16 gotchas.

## Deploy

Intended for Vercel:

```bash
vercel
```

Domain / custom URL setup not yet configured. DNS will live on Cloudflare
when it happens, with a CNAME to `cname.vercel-dns.com`.
