import { createClient, type Client } from '@libsql/client';
import { randomUUID } from 'crypto';
import { SCHEMA_SQL } from './schema';

// One client, reused across Next.js dev-mode hot reloads.
//
// Local dev / this sandbox: url defaults to a local file — no external
// service needed. Production on Vercel: set TURSO_DATABASE_URL and
// TURSO_AUTH_TOKEN (see .env.example) and the exact same code talks to a
// real, network-reachable database instead. This is the fix for the issue
// node:sqlite had: Vercel's serverless functions have an ephemeral,
// non-shared filesystem, so a local SQLite file written in one invocation
// is simply gone by the next one. libSQL (Turso) speaks the same SQL
// dialect as SQLite over the network, so the schema and every query below
// are unchanged from the node:sqlite version — only the connection differs.
//
// Two things fixed here after "it can't deploy to Vercel":
// 1. The schema used to be loaded via `fs.readFileSync('src/db/schema.sql')`
//    at runtime. Confirmed directly: if that file isn't present at runtime
//    for any reason (and Vercel's build-time file tracer is known to miss
//    exactly this pattern — a computed fs path read at request time, not a
//    static import), this throws a hard ENOENT the moment the first request
//    hits the database. The schema now lives in schema.ts as a plain
//    exported string — part of the normal JS bundle, so there's no file to
//    miss.
// 2. If TURSO_DATABASE_URL isn't set, this used to silently fall back to a
//    local file. On Vercel that file lives outside /tmp, which is a
//    read-only mount in production — so this now fails immediately with a
//    clear message instead of a cryptic filesystem error (or, worse, silent
//    data loss if some future Vercel runtime tolerated the write but simply
//    didn't persist it across invocations).
function open(): Client {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    if (process.env.VERCEL) {
      throw new Error(
        'TURSO_DATABASE_URL is not set. On Vercel, the filesystem outside /tmp is read-only and ' +
          'nothing persists between invocations anyway, so there is no local-file fallback here. ' +
          'Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in Project Settings → Environment Variables ' +
          '— see README "Deploying to Vercel".'
      );
    }
    // Local dev / this sandbox only: a plain file, zero setup required.
    const fallback = `file:${process.env.DATABASE_FILE ?? 'dev.db'}`;
    return createClient({ url: fallback });
  }

  return createClient(authToken ? { url, authToken } : { url });
}

const globalForDb = globalThis as unknown as { libsqlClient?: Client };
export const client = globalForDb.libsqlClient ?? open();
if (process.env.NODE_ENV !== 'production') globalForDb.libsqlClient = client;

let schemaReady: Promise<unknown> | null = null;
export function ensureSchema(): Promise<unknown> {
  if (!schemaReady) {
    schemaReady = client.executeMultiple(SCHEMA_SQL);
  }
  return schemaReady;
}

export function newId(): string {
  return randomUUID();
}

// ---------- Types ----------
export interface ProductCategory {
  id: string; slug: string; title: string; tag: string; icon: string; summary: string; sort_order: number;
}
export interface ProductRow {
  id: string; slug: string; title: string; category_id: string; summary: string; application: string;
  icon: string; datasheet_url: string | null; status: string; sort_order: number;
}
export interface ProductWithCategory extends ProductRow {
  category_title: string; category_tag: string; category_slug: string;
}
export interface Solution { id: string; title: string; description: string; icon: string; sort_order: number; }
export interface IndustryRow { id: string; slug: string; title: string; icon: string; points_json: string; sort_order: number; }
export interface GalleryImageRow {
  id: string; category: string; filename: string; caption: string | null; featured: number; status: string; sort_order: number;
}
export interface QuoteRequestRow {
  id: string; ref_number: string; contact_name: string; contact_email: string; contact_phone: string;
  company: string | null; sector: string; message: string | null; status: string; created_at: string;
}
export interface QuoteItemRow { id: string; quote_request_id: string; product_name: string; quantity: string | null; }
export interface ConversationRow {
  id: string; ticket_id: string; visitor_session_id: string; status: string; channel: string;
  wa_conversation_id: string | null; page_context: string | null; created_at: string; last_message_at: string;
}
export interface MessageRow {
  id: string; conversation_id: string; direction: string; body: string; wa_message_id: string | null;
  status: string; created_at: string;
}
export interface AdminUserRow { id: string; email: string; password_hash: string; role: string; created_at: string; }

// ---------- Product categories ----------
export async function getProductCategories(): Promise<ProductCategory[]> {
  await ensureSchema();
  const res = await client.execute('SELECT * FROM product_category ORDER BY sort_order ASC');
  return res.rows as unknown as ProductCategory[];
}

// ---------- Products ----------
export async function getProducts(opts: { categorySlug?: string; take?: number } = {}): Promise<ProductWithCategory[]> {
  await ensureSchema();
  const take = opts.take ?? 200;
  const base = `SELECT p.*, c.title as category_title, c.tag as category_tag, c.slug as category_slug
                FROM product p JOIN product_category c ON c.id = p.category_id
                WHERE p.status = 'PUBLISHED'`;
  const res = opts.categorySlug
    ? await client.execute({ sql: `${base} AND c.slug = ? ORDER BY p.sort_order ASC LIMIT ?`, args: [opts.categorySlug, take] })
    : await client.execute({ sql: `${base} ORDER BY p.sort_order ASC LIMIT ?`, args: [take] });
  return res.rows as unknown as ProductWithCategory[];
}

export async function getMachineryProducts(): Promise<ProductWithCategory[]> {
  await ensureSchema();
  const res = await client.execute(
    `SELECT p.*, c.title as category_title, c.tag as category_tag, c.slug as category_slug
     FROM product p JOIN product_category c ON c.id = p.category_id
     WHERE p.status = 'PUBLISHED' AND c.tag = 'Machinery'
     ORDER BY p.sort_order ASC`
  );
  return res.rows as unknown as ProductWithCategory[];
}

export async function getProductBySlug(slug: string): Promise<ProductWithCategory | undefined> {
  await ensureSchema();
  const res = await client.execute({
    sql: `SELECT p.*, c.title as category_title, c.tag as category_tag, c.slug as category_slug
          FROM product p JOIN product_category c ON c.id = p.category_id WHERE p.slug = ?`,
    args: [slug],
  });
  return res.rows[0] as unknown as ProductWithCategory | undefined;
}

export async function getRelatedProducts(categoryId: string, excludeId: string, take = 3): Promise<ProductRow[]> {
  await ensureSchema();
  const res = await client.execute({
    sql: `SELECT * FROM product WHERE category_id = ? AND id != ? AND status = 'PUBLISHED' LIMIT ?`,
    args: [categoryId, excludeId, take],
  });
  return res.rows as unknown as ProductRow[];
}

export async function countProducts(): Promise<number> {
  await ensureSchema();
  const res = await client.execute('SELECT COUNT(*) as n FROM product');
  return Number(res.rows[0]?.n ?? 0);
}

// ---------- Solutions & industries ----------
export async function getSolutions(): Promise<Solution[]> {
  await ensureSchema();
  const res = await client.execute('SELECT * FROM solution ORDER BY sort_order ASC');
  return res.rows as unknown as Solution[];
}

export async function getIndustries(): Promise<Array<Omit<IndustryRow, 'points_json'> & { points: string[] }>> {
  await ensureSchema();
  const res = await client.execute('SELECT * FROM industry ORDER BY sort_order ASC');
  const rows = res.rows as unknown as IndustryRow[];
  return rows.map((r) => ({ ...r, points: JSON.parse(r.points_json) as string[] }));
}

// ---------- Gallery ----------
export async function getGalleryImages(opts: { category?: string; take?: number } = {}): Promise<GalleryImageRow[]> {
  await ensureSchema();
  const take = opts.take ?? 200;
  const res = opts.category
    ? await client.execute({
        sql: `SELECT * FROM gallery_image WHERE status='PUBLISHED' AND category = ? ORDER BY featured DESC, sort_order ASC LIMIT ?`,
        args: [opts.category, take],
      })
    : await client.execute({
        sql: `SELECT * FROM gallery_image WHERE status='PUBLISHED' ORDER BY featured DESC, sort_order ASC LIMIT ?`,
        args: [take],
      });
  return res.rows as unknown as GalleryImageRow[];
}

export async function getGalleryCategories(): Promise<string[]> {
  await ensureSchema();
  const res = await client.execute('SELECT DISTINCT category FROM gallery_image ORDER BY category ASC');
  return (res.rows as unknown as { category: string }[]).map((r) => r.category);
}

// ---------- Quote requests ----------
export function generateRefNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `SKT-${year}-${rand}`;
}

export async function createQuoteRequest(data: {
  contactName: string; contactEmail: string; contactPhone: string; company?: string;
  sector: string; message?: string; items: Array<{ productName: string; quantity?: string }>;
}): Promise<{ id: string; refNumber: string }> {
  await ensureSchema();
  const id = newId();
  const refNumber = generateRefNumber();
  await client.execute({
    sql: `INSERT INTO quote_request (id, ref_number, contact_name, contact_email, contact_phone, company, sector, message)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, refNumber, data.contactName, data.contactEmail, data.contactPhone, data.company ?? null, data.sector, data.message ?? null],
  });
  for (const item of data.items) {
    await client.execute({
      sql: `INSERT INTO quote_request_item (id, quote_request_id, product_name, quantity) VALUES (?, ?, ?, ?)`,
      args: [newId(), id, item.productName, item.quantity ?? null],
    });
  }
  return { id, refNumber };
}

export async function getQuoteRequests(take = 100): Promise<Array<QuoteRequestRow & { items: QuoteItemRow[] }>> {
  await ensureSchema();
  const res = await client.execute({ sql: 'SELECT * FROM quote_request ORDER BY created_at DESC LIMIT ?', args: [take] });
  const quotes = res.rows as unknown as QuoteRequestRow[];
  const out: Array<QuoteRequestRow & { items: QuoteItemRow[] }> = [];
  for (const q of quotes) {
    const itemsRes = await client.execute({ sql: 'SELECT * FROM quote_request_item WHERE quote_request_id = ?', args: [q.id] });
    out.push({ ...q, items: itemsRes.rows as unknown as QuoteItemRow[] });
  }
  return out;
}

export async function countNewQuoteRequests(): Promise<number> {
  await ensureSchema();
  const res = await client.execute(`SELECT COUNT(*) as n FROM quote_request WHERE status = 'NEW'`);
  return Number(res.rows[0]?.n ?? 0);
}

// ---------- Conversations & messages ----------
export async function createConversationWithMessage(data: {
  visitorSessionId: string; pageContext?: string; direction: 'inbound' | 'outbound'; body: string;
}): Promise<{ id: string; ticketId: string }> {
  await ensureSchema();
  const id = newId();
  const ticketId = `TCK-${Date.now().toString(36).toUpperCase()}-${newId().slice(0, 4).toUpperCase()}`;
  await client.execute({
    sql: `INSERT INTO conversation (id, ticket_id, visitor_session_id, page_context, channel) VALUES (?, ?, ?, ?, 'web-intake')`,
    args: [id, ticketId, data.visitorSessionId, data.pageContext ?? null],
  });
  await client.execute({
    sql: `INSERT INTO message (id, conversation_id, direction, body, status) VALUES (?, ?, ?, ?, 'received')`,
    args: [newId(), id, data.direction, data.body],
  });
  return { id, ticketId };
}

export async function findConversationByWaId(waId: string): Promise<ConversationRow | undefined> {
  await ensureSchema();
  const res = await client.execute({ sql: 'SELECT * FROM conversation WHERE wa_conversation_id = ?', args: [waId] });
  return res.rows[0] as unknown as ConversationRow | undefined;
}

export async function createWhatsAppConversation(waId: string): Promise<ConversationRow> {
  await ensureSchema();
  const id = newId();
  const ticketId = `TCK-WA-${waId}`;
  await client.execute({
    sql: `INSERT INTO conversation (id, ticket_id, visitor_session_id, wa_conversation_id, channel) VALUES (?, ?, ?, ?, 'whatsapp')`,
    args: [id, ticketId, waId, waId],
  });
  return (await findConversationByWaId(waId))!;
}

export async function addMessage(conversationId: string, data: { direction: string; body: string; waMessageId?: string }): Promise<void> {
  await ensureSchema();
  await client.execute({
    sql: `INSERT INTO message (id, conversation_id, direction, body, wa_message_id, status) VALUES (?, ?, ?, ?, ?, 'received')`,
    args: [newId(), conversationId, data.direction, data.body, data.waMessageId ?? null],
  });
  await client.execute({ sql: `UPDATE conversation SET last_message_at = datetime('now'), status = 'OPEN' WHERE id = ?`, args: [conversationId] });
}

export async function getConversations(take = 100): Promise<Array<ConversationRow & { messages: MessageRow[] }>> {
  await ensureSchema();
  const res = await client.execute({ sql: 'SELECT * FROM conversation ORDER BY last_message_at DESC LIMIT ?', args: [take] });
  const convos = res.rows as unknown as ConversationRow[];
  const out: Array<ConversationRow & { messages: MessageRow[] }> = [];
  for (const c of convos) {
    const msgRes = await client.execute({ sql: 'SELECT * FROM message WHERE conversation_id = ? ORDER BY created_at ASC', args: [c.id] });
    out.push({ ...c, messages: msgRes.rows as unknown as MessageRow[] });
  }
  return out;
}

export async function countOpenConversations(): Promise<number> {
  await ensureSchema();
  const res = await client.execute(`SELECT COUNT(*) as n FROM conversation WHERE status = 'OPEN'`);
  return Number(res.rows[0]?.n ?? 0);
}

// ---------- Admin ----------
export async function getAdminUserByEmail(email: string): Promise<AdminUserRow | undefined> {
  await ensureSchema();
  const res = await client.execute({ sql: 'SELECT * FROM admin_user WHERE email = ?', args: [email] });
  return res.rows[0] as unknown as AdminUserRow | undefined;
}

export async function createAdminUser(email: string, passwordHash: string, role: string): Promise<void> {
  await ensureSchema();
  await client.execute({ sql: `INSERT INTO admin_user (id, email, password_hash, role) VALUES (?, ?, ?, ?)`, args: [newId(), email, passwordHash, role] });
}

export async function createAuditLog(actorId: string | null, action: string, detail?: string): Promise<void> {
  await ensureSchema();
  await client.execute({ sql: `INSERT INTO audit_log (id, actor_id, action, detail) VALUES (?, ?, ?, ?)`, args: [newId(), actorId, action, detail ?? null] });
}

// ---------- Rate limiting (DB-backed — correct across stateless serverless invocations) ----------
//
// IMPORTANT: the cutoff comparison is computed entirely inside SQLite via
// datetime('now', '-N seconds'), rather than formatting a cutoff in JS and
// comparing it against `created_at`. An earlier version built the cutoff
// with `new Date().toISOString()` (format: 2026-07-15T07:50:19.224Z) and
// compared it against rows written with SQLite's own `datetime('now')`
// (format: 2026-07-15 07:51:20 — space-separated, no ms, no Z). Those two
// strings don't compare correctly against each other lexicographically
// (' ' sorts before 'T'), so every comparison silently evaluated as if no
// row was ever "recent" — the limiter compiled fine, looked right on
// reading, and simply never blocked anything. Caught by actually hammering
// the endpoint past its limit in testing, not by reading the code.
export async function checkRateLimit(key: string, maxRequests: number, windowSeconds: number): Promise<{ allowed: boolean }> {
  await ensureSchema();
  const windowExpr = `-${Math.floor(windowSeconds)} seconds`;
  await client.execute({ sql: `DELETE FROM rate_limit_hit WHERE created_at < datetime('now', ?)`, args: [windowExpr] });
  const res = await client.execute({
    sql: `SELECT COUNT(*) as n FROM rate_limit_hit WHERE key = ? AND created_at >= datetime('now', ?)`,
    args: [key, windowExpr],
  });
  const count = Number(res.rows[0]?.n ?? 0);
  if (count >= maxRequests) return { allowed: false };
  await client.execute({ sql: `INSERT INTO rate_limit_hit (id, key, created_at) VALUES (?, ?, datetime('now'))`, args: [newId(), key] });
  return { allowed: true };
}
