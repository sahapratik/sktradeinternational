# SK Trade International — Full-Stack Build (Next.js)

**Crafted by Pratik Studios**

This is the real backend the static `index.html` build's `architecture.md` specified —
not a mockup. Every claim below was verified by actually running the project in a
sandboxed environment before this was handed to you: `npm run build` compiles clean,
and the auth flow, quote workflow, and WhatsApp webhook pipeline were exercised end-to-end
with real HTTP requests (see "What was actually tested," below).

## Quick start

```bash
npm install
npm run db:seed     # creates dev.db and fills it with real product/gallery data + one demo admin
npm run dev          # http://localhost:3000
```

Admin dashboard: `http://localhost:3000/admin/login`
Demo login: `admin@sktradeinternational.net` / `ChangeMe!2026` — **change this password
before this ever runs anywhere reachable by the public.**

## An important, honest note on the database

architecture.md (from the static-site deliverable) specifies **PostgreSQL via Prisma**
for production, and that's still a perfectly good choice once this is deployed somewhere
with normal internet access — but two rounds of actually running this project surfaced
real reasons not to ship either of the two things tried first:

1. **Prisma** needs to download a query-engine binary from `binaries.prisma.sh` at
   `generate`/`migrate` time. This sandboxed build environment blocks that domain (a 403,
   not a code bug) — so it couldn't even run its own migration step here.
2. **Node's built-in `node:sqlite`** (tried next, and it did work locally) writes to a
   file on disk. That's fundamentally incompatible with Vercel: serverless functions run
   on an ephemeral, non-shared filesystem, so a database file written during one request
   is simply gone by the next one. It would have looked fine locally and then silently
   lost every quote request and conversation in production.

The data layer now runs on **libSQL** (`@libsql/client`) — the same SQL dialect and the
same `schema.sql`, but reachable over the network. Locally (and in this sandbox) it talks
to a plain file with zero setup. In production it talks to a real hosted database
(Turso, or any libSQL-compatible host) using the exact same code. See "Deploying to
Vercel" below.

**To move to Postgres/Prisma later instead:** `src/db/schema.sql` was written
field-for-field to match the Prisma schema already documented in `architecture.md`,
specifically so that translating it into a real `schema.prisma` is a mechanical exercise,
not a redesign.

## What was actually tested (not just written)

- `npm run build` — clean TypeScript compile, all 20 routes, zero errors
- Full page sweep (`/`, `/about`, `/products`, a product detail page, `/machinery`,
  `/gallery`, `/contact`) — all return 200 against a real running server
- Quote submission → real row created → **appears in `/admin/quotes` immediately**
- `/admin/*` without a session → 307 redirect to `/admin/login` (middleware working)
- Wrong password → generic 401 (no user enumeration); correct password → session issued
- WhatsApp webhook GET handshake → correctly echoes Meta's challenge
- WhatsApp webhook POST with a **valid** HMAC-SHA256 signature → accepted (200)
- WhatsApp webhook POST with an **invalid** signature → rejected (401), fails closed
- A signature-verified inbound message → **appears in `/admin/support` immediately**
- Argon2id hashing: correct password verifies, wrong password rejected, tampered/expired
  session tokens rejected
- **The rate limiter itself was hammered past its limit** (7 requests against a 5/window
  cap) and confirmed to actually return 429 on the 6th and 7th request — this caught a
  real bug first: an earlier version compared a JS `toISOString()` cutoff against
  timestamps SQLite wrote in its own `datetime('now')` format, and those two string
  formats don't sort correctly against each other, so nothing was ever counted as
  "recent" and the limiter silently let everything through despite compiling and looking
  correct on read. Fixed by keeping the whole time comparison inside SQLite, then
  re-tested in isolation and inside the running app before trusting it again.

## What's real vs. what needs your credentials

**Fully working right now:** the database (now libSQL, so it actually persists on
Vercel — see "Deploying to Vercel" below), every page, the quote workflow end-to-end
(form → validation → DB-backed rate limit → storage → admin view), admin authentication
(Argon2id + signed sessions + RBAC field on the user model), the WhatsApp webhook's
signature verification and inbound message handling, and security headers/CSP.

**Correctly wired but inert until you provide credentials:** outbound WhatsApp
sending (`src/lib/whatsapp.ts` → `sendWhatsAppMessage`) fails closed with a clear error
if `WHATSAPP_ACCESS_TOKEN` / `WHATSAPP_PHONE_NUMBER_ID` aren't set, rather than pretending
to send. Once you complete Meta Business verification (architecture.md §7), set those
plus `WHATSAPP_SUPPORT_DESTINATION`, and it will actually send.

**Not built:** real-time delivery of WhatsApp replies back to an open browser tab
(needs a WebSocket/SSE layer — architecture.md §7 specs it, this repo doesn't stand
one up), and the richer CMS screens (editing gallery captions, reordering products, etc.)
beyond the two admin views that exist (Quote Requests, Support Conversations).

## A known, disclosed dependency issue

`npm audit` currently reports moderate/high advisories against the Next.js 14.2.x line
(image-optimizer DoS, RSC cache-poisoning/DoS variants, a Pages Router + i18n middleware
bypass, WebSocket-upgrade SSRF). None involve this codebase's actual attack surface — it
uses the App Router only (no i18n, no Pages Router), plain `<img>` tags rather than
`next/image` (so no image-optimizer exposure), and doesn't implement WebSocket-upgrade
proxying. The one **critical** advisory that did directly apply — a middleware
authorization bypass, relevant here since `/admin` is middleware-protected — is patched
by pinning `next@14.2.35`. Run `npm audit` yourself before deploying and re-evaluate
against whatever Next.js version is current then; a full major-version upgrade (15/16)
wasn't made in this pass because properly verifying its breaking API changes was out of
scope for this round.

## Project layout

```
src/
  app/            pages + API routes (Next.js App Router)
  components/     shared header/footer/theme-toggle/logout-button
  db/             schema.sql + the SQLite data-access layer
  lib/            session.ts (Edge-safe), password.ts (Argon2id), whatsapp.ts,
                  rateLimit.ts, validation.ts
  middleware.ts   protects /admin/*
scripts/seed.ts   the real seed data (same content as the static homepage build)
public/gallery/   the real photos from your upload
```

## Deploying to Vercel

This project is now Vercel-ready. Node's built-in SQLite (used in the previous version of
this build) is **not** viable on Vercel: serverless functions run on an ephemeral,
non-shared filesystem, so a database file written by one request is simply gone by the
next. The data layer now runs on **libSQL** instead — the exact same SQL dialect and
schema, but over the network, which is what makes it work here at all.

### 1. Create a free database

1. Go to [turso.tech](https://turso.tech) and create a free account + database.
2. Get the database URL (`libsql://your-db-name.turso.io`) and create an auth token —
   both are in the Turso dashboard/CLI.

### 2. Seed it once, from your own machine, before first deploy

```bash
npm install
TURSO_DATABASE_URL="libsql://your-db.turso.io" TURSO_AUTH_TOKEN="your-token" npm run db:seed
```

This runs the exact same seed script tested in this build — same products, same gallery
captions, same demo admin account — against your real production database.

### 3. Deploy

```bash
npm install -g vercel   # if you don't have it
vercel                  # deploys straight from this folder, no GitHub push required
```

Or connect the repo in the Vercel dashboard for git-based deploys — either way, Vercel
auto-detects this as a Next.js project with no extra configuration.

### 4. Set environment variables in Vercel

Project Settings → Environment Variables → add everything from `.env.example`:
`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `SESSION_SECRET` (generate a real one —
`openssl rand -base64 32`), and the `WHATSAPP_*` variables once you have them
(architecture.md §7). Redeploy after adding them — Vercel doesn't hot-reload env vars
into an already-running deployment.

### 5. Change the seeded admin password

The demo login (`admin@sktradeinternational.net` / `ChangeMe!2026`) is meant for local
testing, not for a real deployment. Either update it directly in the Turso database via
their SQL console, or add a small one-off script that re-hashes and updates it.

### What to know about running this on Vercel specifically

- **Rate limiting is DB-backed**, not in-memory — this was a deliberate fix, not an
  afterthought: an in-memory limiter would silently do almost nothing across Vercel's
  independent, short-lived function instances. It was tested to confirm it actually
  blocks after its configured limit, not just that it compiles.
- **Middleware runs on the Edge Runtime.** Session verification uses the Web Crypto API
  (`crypto.subtle`) rather than Node's `crypto` module specifically so it runs correctly
  there — Node's `crypto` module is not reliably available in Vercel's Edge Runtime.
- **`node:sqlite` is gone entirely** — this build has no dependency on it anymore, so
  there's no experimental-API risk left in the data layer.

## Recommended next steps

1. Change the seeded admin password immediately if you deploy this anywhere.
2. Complete Meta Business verification and set the WhatsApp env vars (architecture.md §7).
3. When you're ready for Postgres, translate `src/db/schema.sql` to `schema.prisma`
   and swap `src/db/index.ts` for a Prisma client — the schema was designed for exactly
   this migration.
4. Build out the remaining CMS screens (product/gallery editing) using the existing
   admin layout and the `AdminRole` field already on `admin_user` for permissions.
