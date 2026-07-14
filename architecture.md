# SK Trade International — Technical Architecture

This document is the technical companion to `index.html`. It specifies everything needed
to take the site from this front-end build to the full production system described in
the original brief: CMS, quotation workflow, gallery admin, and a real two-way WhatsApp
support channel.

---

## 1. Sitemap

```
Home
├── About                 story, timeline, leadership, downloadable company profile
├── Products              filterable catalogue → product detail template
│   └── /products/[slug]  overview, specs, packaging, datasheet, inquiry, add-to-quote
├── Machinery
│   └── /machinery/[slug] specs, capacity, utilities, installation, brochure
├── Industries             /industries/tableware, /tiles, /sanitary-ware
├── Solutions              installation, logistics, QA, documentation, sourcing…
├── Gallery                categorized, admin-managed, lightbox
├── Partners               principal / supplier logo wall
├── Insights                articles / resources
├── Contact                department-routed inquiry form
├── Request a Quote        multi-item quote workflow
├── /privacy, /cookies, /terms, /sitemap.xml, /404
└── /admin (auth required)
    ├── Dashboard          quote requests, support conversations, analytics
    ├── Content            products, machinery, industries, solutions, gallery, partners
    ├── Support inbox      conversations, assignment, internal notes
    └── Settings           users & roles, integrations, audit log
```

## 2. Design tokens

Calibrated directly from the supplied logo file (sampled ink color), not guessed.

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#FAF7F1` | `#14120E` |
| `--surface` | `#FFFFFF` | `#1F1A15` |
| `--ink` | `#221F1B` | `#F3EEE3` |
| `--ink-soft` | `#5B5449` | `#B6AC9B` |
| `--copper` (brand ink) | `#8F6A2E` | `#F0C570` |
| `--kiln` (rare accent) | `#B34A22` | `#E2794A` |
| `--line` | `#E3DBCB` | `#332C22` |

Type: **Fraunces** (display/serif headings) + **Manrope** (UI/body grotesk), fluid via `clamp()`.
Icons: hand-built monoline SVG sprite (no external icon library dependency — see note below).

> **Why hand-built icons instead of a Lucide/Phosphor CDN import:** the live preview renders
> inside a sandboxed artifact iframe with a restricted set of allowed external hosts. Rather
> than risk icons silently failing to load, I built a small inline `<symbol>` sprite. This is
> explicitly one of the brief's own sanctioned options ("Lucide, Phosphor, **or custom monoline
> SVG icons**"). Swap in Lucide/Phosphor later if preferred — the `.icon` class and `<use>`
> pattern make that a mechanical find-and-replace.

## 3. What's shipped now vs. what needs real infrastructure

`index.html` is a real, fully interactive static build — not a mockup. Working right now:
theme system, loading animation, responsive nav, all 14 homepage sections, scroll reveals,
an in-memory quote list, a gallery lightbox over your real photos, and a support-panel UI
with an honest "not yet connected" state.

It cannot include a live database, authentication, or WhatsApp bridge, because none of
those can run inside this chat: there's no persistent server here to host Postgres/Redis,
and Meta will only issue WhatsApp Cloud API credentials against **your** verified Business
account and **your** hosted webhook URL. The sections below spec that system precisely so
it can be built out from here without re-deriving the design.

## 4. Recommended production stack

- **Frontend:** Next.js + TypeScript, React, Tailwind (or the token system above ported to
  a CSS-in-JS/vars setup), route-level code splitting, `next/image` for the real photo library.
- **Backend:** Next.js server actions/route handlers or a dedicated Node service.
- **Database:** PostgreSQL via Prisma.
- **Queue/cache/rate-limiting:** Redis.
- **Real-time delivery:** WebSockets or Server-Sent Events for chat replies.
- **Object storage:** S3-compatible bucket for gallery images and quote attachments.
- **Auth:** an audited library (e.g. Auth.js/NextAuth or Lucia) rather than hand-rolled sessions.

## 5. Data model (Prisma-style outline)

```prisma
model Product {
  id            String   @id @default(cuid())
  slug          String   @unique
  title         String
  categoryId    String
  category      ProductCategory @relation(fields: [categoryId], references: [id])
  summary       String
  applications  String[]
  originCountry String?
  datasheetUrl  String?
  images        Image[]
  status        ContentStatus  @default(DRAFT)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model ProductCategory { id String @id @default(cuid()) name String slug String @unique products Product[] }

model Machinery {
  id           String  @id @default(cuid())
  slug         String  @unique
  title        String
  specs        Json      // dimensions, capacity, utility requirements
  brochureUrl  String?
  status       ContentStatus @default(DRAFT)
}

model GalleryImage {
  id        String   @id @default(cuid())
  category  String
  url       String
  caption   String?
  location  String?
  date      DateTime?
  featured  Boolean  @default(false)
  status    ContentStatus @default(DRAFT)
  order     Int      @default(0)
}

model Partner { id String @id @default(cuid()) name String logoUrl String url String? }

model QuoteRequest {
  id           String   @id @default(cuid())
  refNumber    String   @unique   // e.g. SKT-2026-000482
  contactName  String
  contactEmail String
  contactPhone String
  company      String?
  sector       String
  items        QuoteRequestItem[]
  status       QuoteStatus @default(NEW)
  createdAt    DateTime @default(now())
}
model QuoteRequestItem { id String @id @default(cuid()) quoteRequestId String product String quantity String notes String? }

model Conversation {
  id            String   @id @default(cuid())
  ticketId      String   @unique
  visitorSessionId String
  status        ConversationStatus @default(OPEN)
  channel       String   @default("whatsapp")
  waConversationId String?
  assignedAgentId String?
  pageContext   String?
  createdAt     DateTime @default(now())
  lastMessageAt DateTime @default(now())
  messages      Message[]
}
model Message {
  id             String   @id @default(cuid())
  conversationId String
  direction      String   // "inbound" | "outbound"
  body           String
  waMessageId    String?
  status         String   // sent | delivered | read | failed
  createdAt      DateTime @default(now())
}

model AdminUser {
  id           String @id @default(cuid())
  email        String @unique
  passwordHash String   // Argon2id
  role         AdminRole
  mfaEnabled   Boolean @default(false)
}
enum AdminRole { SUPER_ADMIN CONTENT_MANAGER PRODUCT_MANAGER GALLERY_MANAGER SUPPORT_AGENT READ_ONLY_ANALYST }
enum ContentStatus { DRAFT PUBLISHED SCHEDULED }
enum QuoteStatus { NEW REVIEWING QUOTED CLOSED }
enum ConversationStatus { OPEN PENDING CLOSED }
```

## 6. API architecture

| Route group | Notes |
|---|---|
| `/api/products`, `/api/machinery`, `/api/gallery`, `/api/partners` | Public read, paginated, cached |
| `/api/quotes` (POST) | Rate-limited, validated, generates `refNumber`, emails confirmation |
| `/api/chat/send` (POST) | Authenticated visitor session → writes `Message`, enqueues outbound WhatsApp send |
| `/api/whatsapp/webhook` (GET/POST) | GET = Meta verification handshake. POST = inbound messages/status, **signature-verified** |
| `/api/admin/*` | Authenticated + role-checked, audit-logged |

General rules: allow-list CORS, request-size limits, idempotency keys on message/quote
submission, generic client-facing errors with detailed logs kept server-side only.

## 7. WhatsApp live-support architecture

*(See the flow diagram earlier in this conversation — solid arrows carry the visitor's
message down through your stack to the agent; dashed arrows carry the reply back.)*

**Outbound (visitor → agent):**
`Chat widget` → `POST /api/chat/send` → write `Message` + `Conversation` (ticket/session
mapped) → push onto a Redis-backed queue → call the **WhatsApp Cloud API** `/messages`
endpoint using your permanent access token → delivered to the agent's WhatsApp via your
configured Business Account.

**Inbound (agent → visitor):**
Agent replies on WhatsApp → Meta calls your `webhookUrl` → **verify `X-Hub-Signature-256`
against your App Secret** (reject anything that doesn't match) → look up the `Conversation`
by WhatsApp thread ID → append `Message` → push to the visitor's open session over a
WebSocket/SSE connection → widget renders the reply in real time.

**Required before any of this can go live:**
1. A Meta Business Account, verified.
2. A WhatsApp Business Account + registered phone number.
3. A permanent (System User) access token — not a 24-hour temporary one.
4. A publicly hosted webhook URL + a verify token you choose, entered into Meta's app dashboard.
5. Subscription to the `messages` webhook field.

**Never do instead:** a bare `wa.me` redirect passed off as "live chat", browser automation
against WhatsApp Web, unofficial scraping libraries, or credential sharing. The floating
"WhatsApp" button on the homepage *is* an honest `wa.me` deep link by design — that's a
normal, sanctioned shortcut for a single CTA button. It is not the same thing as the
two-way "Live Support" panel, which needs the architecture above.

## 8. Security checklist

- [ ] HTTPS everywhere, HTTP→HTTPS redirect, HSTS once confirmed stable, TLS 1.2+
- [ ] CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, frame-ancestors
- [ ] Server-side validation + output encoding on every form, search field, and API payload
- [ ] Parameterized queries only; no string-built SQL
- [ ] CSRF protection, rate limiting, honeypot field, duplicate-submission protection on public forms
- [ ] Argon2id password hashing, MFA support, RBAC, session rotation on login, lockout/backoff
- [ ] Cookies: `Secure`, `HttpOnly`, appropriate `SameSite` — **never** tokens in localStorage
- [ ] CORS allow-list only, never wildcard + credentials
- [ ] WhatsApp webhook signature verified on every request; replay protection; tokens in a secrets manager, never logged
- [ ] Uploads: true MIME-type check (not extension), random filenames, malware scan, stored outside the web root, served via signed URLs
- [ ] Structured logging with passwords/secrets/full tokens never written to logs
- [ ] Staging and production kept fully separate; tested backup/restore procedure

## 9. Deployment notes

- Keep `.env` values out of version control; see `.env.example` for the full variable list.
- Run database migrations as part of CI, never manually against production.
- Point Meta's webhook configuration at the **production** URL only after signature
  verification has been tested against a staging endpoint.
- Add `robots.txt` + `sitemap.xml` and disallow indexing of `/admin` and chat transcripts.
