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

### Components

- `components/layout/Nav.tsx` — `'use client'`, accepts `theme?: 'dark' | 'light'` (default `'light'`). Layout hardcodes `<Nav />` without theme — homepage needs a ThemeContext or slot to drive dark nav.
- `components/layout/Footer.tsx` — server component; uses `CopyrightYear` client island
- `components/layout/CopyrightYear.tsx` — `'use client'` island for runtime `new Date().getFullYear()`

### Pages (stubs)

All inner pages are stubs: `app/[locale]/{page,about,work,services,blog,contact}/page.tsx`
