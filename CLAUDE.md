# CLAUDE.md

Guidance for Claude Code working on this repo.

@AGENTS.md

## Commands

```bash
npm run dev      # Turbopack dev (Next.js 16 default)
npm run build    # Production build
npm run lint     # ESLint
```

No test suite yet.

## Architecture

Deploy plan + API abstraction (Vercel main site, Cloudflare Workers future split): see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). All frontend API calls must go through `lib/api-client.ts`.

Component tour, routing, home composition, data conventions — **read the code directly**. Key entry points:

- `app/[locale]/layout.tsx` — root shell (i18n provider + fonts + `<Nav>` + `<main>` + `<Footer>`)
- `app/[locale]/page.tsx` — home composition (Hero / FeaturedWork / LocationsMap / HomeCta)
- `app/[locale]/about/page.tsx` → `components/about/AboutPage.tsx` — about page
- `app/[locale]/contact/page.tsx` → `components/contact/ContactPage.tsx` — contact page
- `app/[locale]/work/[slug]/page.tsx` — case detail (OSER: Objective / Strategy / Execution / Result)
- `components/home/*` — marketing sections
- `components/shared/HudCorners.tsx`, `components/shared/GlitchText.tsx` — reusable primitives

## Critical gotchas

### Next.js 16

- **`proxy.ts` replaces `middleware.ts`** — named export `export const proxy = ...`, not default export
- **`params` is a `Promise`** — always `const { locale } = await params` in layouts / pages / `generateMetadata`
- **Turbopack** is the default bundler
- Authoritative API reference: `node_modules/next/dist/docs/` — read before touching routing / proxy / config

### Styling / fonts

- **Tailwind v4 arbitrary values**: use `border-[rgba(0,0,0,0.08)]`, not `border-black/8` (v4 opacity shorthand behaves differently)
- **`Noto_Serif_TC` / `Noto_Sans_TC`** do NOT accept a `subsets` parameter — omit it when loading
- **Turbopack `:root` CSS HMR gotcha**: editing CSS variables in `globals.css` sometimes doesn't trigger rebuild. Touch any other line (comment / whitespace) to force reprocess.
- **`.font-display` / `.font-label` have `-webkit-font-smoothing: none`** — pixel fonts (Departure Mono / Cubic 11) need this to stay crisp. If you re-enable smoothing per-element, use inline `WebkitFontSmoothing: 'antialiased'`.

### Layout

- `<main className="pt-14">` in `app/[locale]/layout.tsx` is tied to `<Nav>` `h-14`. Change both together or the hero gets cropped.
- Home sections use `bg-transparent` so `HomeAmbientBg` streams show through every section. Do NOT add `bg-[#080808]` to individual home sections — it breaks visual continuity.

### Environment

- **Dev server runs in `.worktrees/build/`** on branch `feature/build-personal-site`, NOT the main checkout. Edit files at the worktree path during active sessions — main-path edits won't be picked up by HMR.
- **`git push` is blocked** by a harness hook per user rule. Commit freely; always stop before push and let the user run `git push` manually.
