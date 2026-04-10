# Architecture

## Deployment plan

**Main site → Vercel.** Next.js 16 runs best on Vercel: native Server Actions,
App Router, ISR, RSC, `@vercel/analytics`, `@vercel/speed-insights`. No
adapter tax, no edge-runtime workarounds.

**High-traffic APIs → Cloudflare Workers (when needed).** Specific API routes
that are expected to burst — event registration, form submission, public
read endpoints — will move to Cloudflare Workers. Rationale: Workers charge
per request with **zero bandwidth cost**, so a traffic spike (viral event
registration, flash sale) does not produce a surprise Vercel bill.

```
┌──────────────────────┐          ┌───────────────────────────┐
│   Vercel (main site) │          │  Cloudflare Workers       │
│   — Next.js 16       │          │  api.<domain>             │
│   — App Router       │          │                           │
│   — Analytics        │  ───▶    │  - /register              │
│   — Speed Insights   │   fetch  │  - /contact               │
│   — RSC / SSG / ISR  │          │  - /webhooks/*            │
│   — `/api/*` (light) │          │  - R2 uploads             │
└──────────────────────┘          └───────────────────────────┘
           │                                   │
           └──────────── same domain ──────────┘
            (evanchang.com → main site,
             api.evanchang.com → worker)
```

## Split trigger — when to move an endpoint off Vercel

Move an endpoint to a Cloudflare Worker when **any** of the following is true:

1. Expected peak ≥ **5,000 req/min** (Vercel function overage kicks in fast).
2. Endpoint returns **large media** (R2 egress is free; Vercel Blob is not).
3. Endpoint needs **WebSocket or long-lived connections** (Durable Objects).
4. Endpoint runs **AI inference on small models** (Workers AI free tier).

Anything else stays on Vercel. Do not speculate — only split when a concrete
feature hits one of these triggers.

## The abstraction that makes the split cheap

All API calls from the Next.js frontend **must** go through
[`lib/api-client.ts`](../lib/api-client.ts), not raw `fetch`.

`api-client.ts` prepends `process.env.NEXT_PUBLIC_API_BASE` to every request.
The default is `/api` (same-origin Vercel routes). When an endpoint moves to
Workers, that env var switches to `https://api.<domain>` and **nothing else
in the codebase changes**.

```ts
// Good — abstracted, routable to either backend
import { apiPost } from '@/lib/api-client';
await apiPost('/register', formData);

// Bad — hard-codes the host, breaks the split
await fetch('/api/register', { method: 'POST', body: ... });
```

## Domain plan

- Domain NS on Cloudflare (DNS + potential CDN rules).
- Apex / `www` → Vercel (CNAME to `cname.vercel-dns.com`).
- `api` subdomain → Cloudflare Workers (custom domain binding), when workers exist.

This lets main-site deployment stay on Vercel while keeping the option to
flip individual API routes to CF without touching the domain.

## Not doing yet

- No Cloudflare Worker project scaffolded.
- No `wrangler.toml`, no `workers/` directory.
- No D1 / KV / R2 bindings.

These land **only** when the first endpoint meets a split trigger above.
