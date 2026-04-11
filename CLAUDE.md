# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server (Turbopack, default in Next.js 16)
npm run build    # Production build
npm run lint     # ESLint check
```

No test suite yet.

---

## Next.js 16 Breaking Changes

This project uses **Next.js 16.2.3**. Key differences from v14/v15:

- **`proxy.ts` replaces `middleware.ts`** — named export `export const proxy = ...`, not default export
- **`params` is a `Promise`** — in layout/page/generateMetadata, always `const { locale } = await params`
- **Turbopack** is the default bundler
- Read `node_modules/next/dist/docs/` for authoritative API reference

---

## Architecture

Deploy plan: main site → Vercel, future high-traffic APIs → Cloudflare Workers.
See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). All frontend API calls
must go through `lib/api-client.ts` (never raw `fetch` to internal endpoints),
so the Vercel → CF split for individual routes changes one env var and
nothing else.

### Routing

App Router with `[locale]` dynamic segment for bilingual support:

```
/          → zh-TW (default)
/en/       → English
```

- `proxy.ts` — next-intl middleware (matcher excludes `_next`, `api`, static files)
- `i18n/routing.ts` — `defineRouting({ locales: ['zh-TW', 'en'], defaultLocale: 'zh-TW' })`
- `i18n/request.ts` — `getRequestConfig` for server-side locale resolution
- `i18n/navigation.ts` — locale-aware `Link`, `useRouter`, `usePathname`
- `messages/zh-TW.json`, `messages/en.json` — UI string translations

### Layout

`app/[locale]/layout.tsx` is the root shell:
- Loads all 5 Google Fonts as CSS variables (`--font-cormorant`, `--font-dm-sans`, `--font-space-mono`, `--font-noto-serif-tc`, `--font-noto-sans-tc`)
- Wraps children in `NextIntlClientProvider`
- Renders `<Nav />` (fixed, `h-14`) → `<main className="pt-14">` → `<Footer />`
- `pt-14` on main is tied to nav height — if nav height changes, update both

### Design System

**Tailwind v4** — CSS-first config, no `tailwind.config.js`:
- `@import "tailwindcss"` in `globals.css`
- Custom tokens in `@theme inline {}` block
- Arbitrary values syntax: `border-[rgba(0,0,0,0.08)]`, not `border-black/8` (opacity shorthand behaves differently in v4)

**CSS variables** (defined in `:root`):
```
--bg-dark: #080808        --bg-light: #F7F5F2
--text-dark-primary: #FFF  --text-light-primary: #1A1A1A
--accent: #5CE1FF          (neon blue)
--border-dark/light: rgba opacity variants
```

**Utility classes** (defined in `globals.css`):
- `.font-display` — Cormorant Garamond + Noto Serif TC fallback
- `.font-label` — Space Mono, 0.6875rem, 0.15em tracking, uppercase
- `.theme-dark` / `.theme-light` — background + text color pair
- `.terminal-bracket` — CSS `::before`/`::after` adds `[ ]`
- `.case-number` — accent-colored monospace sequence label

**Font loading gotcha:** `Noto_Serif_TC` and `Noto_Sans_TC` do **not** accept a `subsets` parameter — omit it.

### Layout components

- `components/layout/Nav.tsx` — `'use client'`. Drives dark/light via `NavThemeContext`. Dark-mode features: sliding underline (`layoutId="nav-underline"`) tracking hover/active item, pulsing logo dot, `GlitchText` scramble on logo hover, `LIVE · TAIPEI` HUD readout, bottom-edge scan-line animation. Desktop only above `md`; below that falls back to `[ MENU ]` toggle.
- `components/layout/Footer.tsx` — server component rendering dark footer with grid of nav links, channels, brand block. Delegates animated wordmark to `FooterWordmark` client island.
- `components/layout/FooterWordmark.tsx` — `'use client'` island. Large editorial `Evan / Chang.` serif with signature-draw intro (per-letter `blur(8px)→0` stagger via `useInView`), continuous period pulse, and periodic random letter glitch (every ~3–5s, 120ms).
- `components/layout/BackToTop.tsx` — `'use client'` island, smooth scroll to top.
- `components/layout/CopyrightYear.tsx` — `'use client'` island for `new Date().getFullYear()`.

### Home page composition

`app/[locale]/page.tsx` is NOT a stub — it's the main marketing surface:

```tsx
<DarkNavActivator />
<HomeAmbientBg />       // fixed page-level background
<SectionNavigator />    // fixed right-side section jumper
<Hero          id="hero"      />
<FeaturedWork  id="featured"  />
<LocationsMap  id="footprint" />
// Footer (id="contact") comes from layout.tsx
```

- `components/home/DarkNavActivator.tsx` — runs `useNavTheme().setTheme('dark')` on mount so the fixed Nav switches to dark on the homepage
- `components/home/HomeAmbientBg.tsx` — **`fixed inset-0 -z-10 bg-[#080808]`** with `DataStreams` at 0.5 opacity inside. All home sections use `bg-transparent` so the ambient streams show through every section as one continuous backdrop. Do NOT add `bg-[#080808]` to individual home sections — it breaks the continuity.
- `components/home/DataStreams.tsx` — CSS-animated matrix character rain (80 lanes × 40 chars, seeded PRNG for SSR-stable output). Only rendered once inside `HomeAmbientBg`.
- `components/home/SectionNavigator.tsx` — fixed right-edge vertical list of 4 section dots (`01 INTRO`, `02 SELECTED WORK`, `03 FOOTPRINT`, `04 CONTACT`) + scroll progress line. Uses `IntersectionObserver` on section ids and smooth-scrolls on click. Hidden below `lg`.
- `components/home/LoadingIntro.tsx` — full-screen intro overlay (z-60). 4-phase state machine: `entering` (corner brackets + wordmark fade in) → `loading` (progress bar + scramble boot log) → `expanding` (scale 1.22 + fade) → `done` (onComplete → unmount). HUD chrome: radar conic sweep, concentric rings, CRT crosshair, corner HUD readouts (`LAT/LNG/SYS` left, `CONN/CASES/REACH/LOCAL` right with real-time clock).
- `components/home/Hero.tsx` — headline with scan line + letter scramble + blinking cursor; `EVAN · CHANG` label with periodic flicker (opacity burst) + horizontal tear (x offset); EVENTS ghost text with slow glow breath + static CRT scanline mask + periodic horizontal slice glitch (clipPath inset); `SubheadingHoverReveal` subcomponent — 企劃 / 統籌 / 顧問 click navigates to `/work?type=BRAND|EVENT|CORP` (uses `ROLE_TYPE` map). Dark radial backdrop behind headline block for readability against the ghost text.
- `components/home/FeaturedWork.tsx` — two subcomponents:
  - `FeaturedIntro` / `StatCard`: typography-first stats (3 big Cormorant numbers from first stat of each case). Count-up animation runs **once** on first view (tracked via `countStartedRef`, not conditional rendering — swapping elements would remount and re-run). Periodic "burst" effect every ~4s: all digits scramble to glitch chars + ±5px chromatic split + `scale(1.06)` + `brightness(1.35)` + x-shift for 180ms.
  - `CaseSection` / `CaseStatCell` / `TitleChar`: scroll-linked case section. CJK title reveals per-character via `scrollYProgress` windows (each char has a 0.14-wide reveal range). English subtitle uses `GlitchText` scramble decode triggered once via `useMotionValueEvent` threshold crossing. Case stats get independent chromatic flicker + digit scramble schedulers.
- `components/home/LocationsMap.tsx` — Taiwan SVG with `viewBox="0 0 400 800"`. Uses `clipPath` to constrain a dense lat/lng grid to the inside of `TAIWAN_OUTLINE_PATH`. Pins drawn from `getCasesWithLocation()` grouped by `LocationKey`. Active/inactive pin states differ dramatically: active = r=11 + white stroke + dual drop-shadow glow, inactive = r=4 + semi-transparent fill. List on the right shows hover-synced state + year inline with title (NOT justify-between).
- `components/home/ScrollIndicator.tsx` — static label + slow packet drop (4s cycle: 2s travel + 2s pause), mounted only after `LoadingIntro` onComplete.
- `components/shared/GlitchText.tsx` — reusable scramble decode component. Props: `text`, `trigger` (key-like, re-fires scramble), `speed` (ms/char, default 22), `once` (lock after first run), `preserveSpaces`. Used by nav logo hover, boot log lines, case EN subtitle, headline letter glitch.

### Inner pages

- `app/[locale]/page.tsx` — home (full composition above)
- `app/[locale]/work/page.tsx` — `CaseList` wrapped in `<Suspense>` (required because `CaseList` uses `useSearchParams` to read `?type` query param for initial filter)
- `app/[locale]/work/[slug]/page.tsx` — case study detail, uses `generateStaticParams` + `generateMetadata`
- `app/[locale]/{about,services,blog,contact}/page.tsx` — still stubs

### Data conventions

- `lib/work-data.ts` — `CASES` array. Each case has `location?: LocationKey` (optional). `getCasesWithLocation()` returns only the ones tagged, consumed by `LocationsMap` to auto-render pins. Add a new case with `location: 'taipei'` → pin appears on the map automatically.
- `lib/locations.ts` — Taiwan city catalog. Each entry has real `lat`/`lng` and derived `x`/`y` for the SVG viewBox. `TAIWAN_OUTLINE_PATH` is the hand-traced coastline used for both the rendered outline and the `clipPath` id.
- `lib/api-client.ts` — thin fetch wrapper. All frontend API calls must go through `apiGet`/`apiPost` (never raw `fetch` to internal endpoints) so the future Vercel → Cloudflare Workers split for individual routes changes only `NEXT_PUBLIC_API_BASE`.

### Known gotchas

- **Turbopack CSS HMR:** editing `:root` CSS variables in `globals.css` sometimes doesn't trigger a rebuild. Fix: touch any other line (comment / whitespace) to force Turbopack to reprocess the file.
- **Dev server lives in the worktree:** active development happens in `.worktrees/build/` on `feature/build-personal-site`, not the main checkout. Don't edit files at the main path during active sessions — they won't be picked up by HMR.
- **`git push` is blocked** by a harness hook. Commit freely; always stop before push and let the user run it manually.
