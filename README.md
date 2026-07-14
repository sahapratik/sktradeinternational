# SK Trade International — Website Build

**Crafted by Pratik Studios**

## What this is

A real, fully interactive homepage build for SK Trade International — a Bangladeshi
ceramic raw-materials, machinery and technical-support trading company, established 2008 —
built from the full creative and technical brief, using the company's actual logo and
facility/exhibition photography rather than placeholders or stock imagery.

This is a working front-end prototype, not a static mockup: theme switching, the loading
animation, scroll reveals, the mobile menu, the quote list, the gallery lightbox over real
photos, and the support-panel UI are all functional in the browser right now.

## Files in this delivery

| File / folder | What it is |
|---|---|
| `index.html` | The marketing homepage. Self-contained — open it directly in any browser. |
| `architecture.md` | Sitemap, design tokens, data model, API routes, the full WhatsApp Cloud API integration spec, and the security checklist — the plan the backend below was built from. |
| `.env.example` | Every environment variable the production backend needs — names only, no values. |
| `sk-nextjs/` | **The real backend + full-stack app** — see `sk-nextjs/README.md`. Database, quote workflow, admin dashboard, and a signature-verified WhatsApp webhook, all tested end-to-end. |

## Viewing the homepage

Double-click `index.html`, or open it in any browser — no build step, no server required.
To put it on the internet as-is, upload it to any static host (Netlify, Vercel, S3 + CloudFront,
or your existing hosting) exactly as it is.

## What's real vs. what's staged for next

**Working now, in `index.html`:** every homepage section from the brief — hero, credibility
strip, product categories, featured products, solutions, industries, "why us," the process
timeline, a photo gallery built from your own supplied images, a principals wall, a reserved
testimonials section, the quote CTA, and a full footer — plus dark/light mode, the branded
loader, and the floating support cluster.

**Working now, in `sk-nextjs/`:** a real database (products, gallery, quotes, conversations),
a live quote-request form that actually saves and shows up in an authenticated admin
dashboard, Argon2id-hashed admin login with signed sessions, and a WhatsApp webhook that
correctly verifies Meta's signature and rejects forged requests. This was updated after the
static build shipped, once you asked directly whether the backend was actually done —
it wasn't yet, so it got built for real rather than just documented further. Full details,
including exactly what was tested, are in `sk-nextjs/README.md`.

**Honestly still incomplete:** outbound WhatsApp sending is correctly wired but inert
until you complete Meta Business verification and provide real credentials — it fails
closed with a clear error rather than pretending to send. Real-time push of WhatsApp
replies into an open browser tab (needs a WebSocket/SSE layer) isn't built. Content-editing
CMS screens beyond Quote Requests and Support Conversations aren't built yet. None of
these can be faked into "done" — they either need your Meta credentials and a public
hosting URL, or more build time, and `sk-nextjs/README.md` is specific about which is which.

## Recommended production stack

Next.js + TypeScript, PostgreSQL via Prisma, Redis, WebSockets/SSE for real-time chat,
object storage for the media library — detailed in `architecture.md` §4–6, and in
`sk-nextjs/README.md` for the one deliberate substitution made (SQLite instead of Postgres,
for a concrete, disclosed sandboxing reason) in the code you're holding right now.

## A note on the icons and fonts

Icons are a small hand-built monoline SVG sprite rather than a CDN-loaded library, so the
page has zero external script dependencies and renders reliably wherever it's opened.
Fraunces and Manrope load from Google Fonts in `index.html`; if that's ever unavailable,
the page falls back to clean system serif/sans stacks rather than breaking. The `sk-nextjs/`
project self-hosts the same two fonts via `@fontsource`, so it has no font-related external
dependency at all.
