-- SK Trade International — database schema (SQLite dialect, via libSQL)
--
-- Runs locally against a plain SQLite file with zero setup, and against a
-- real Turso (libSQL) database in production — same schema, same SQL,
-- just a different connection string (see .env.example). For production,
-- architecture.md specifies the same shape of schema on PostgreSQL via Prisma —
-- translating this file to a Prisma schema is a mechanical, field-for-field
-- exercise, not a redesign, because the two were designed together.

CREATE TABLE IF NOT EXISTS product_category (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tag TEXT NOT NULL,
  icon TEXT NOT NULL,
  summary TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS product (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES product_category(id),
  summary TEXT NOT NULL,
  application TEXT NOT NULL,
  icon TEXT NOT NULL,
  datasheet_url TEXT,
  status TEXT NOT NULL DEFAULT 'PUBLISHED',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS solution (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS industry (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  icon TEXT NOT NULL,
  points_json TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS gallery_image (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  filename TEXT NOT NULL,
  caption TEXT,
  featured INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'PUBLISHED',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS partner (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS quote_request (
  id TEXT PRIMARY KEY,
  ref_number TEXT UNIQUE NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  company TEXT,
  sector TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'NEW',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS quote_request_item (
  id TEXT PRIMARY KEY,
  quote_request_id TEXT NOT NULL REFERENCES quote_request(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  quantity TEXT
);

CREATE TABLE IF NOT EXISTS conversation (
  id TEXT PRIMARY KEY,
  ticket_id TEXT UNIQUE NOT NULL,
  visitor_session_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN',
  channel TEXT NOT NULL DEFAULT 'web-intake',
  wa_conversation_id TEXT,
  page_context TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_message_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS message (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversation(id) ON DELETE CASCADE,
  direction TEXT NOT NULL,
  body TEXT NOT NULL,
  wa_message_id TEXT,
  status TEXT NOT NULL DEFAULT 'received',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS admin_user (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'SUPPORT_AGENT',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  actor_id TEXT,
  action TEXT NOT NULL,
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS rate_limit_hit (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_product_category ON product(category_id);
CREATE INDEX IF NOT EXISTS idx_message_conversation ON message(conversation_id);
CREATE INDEX IF NOT EXISTS idx_quote_item_request ON quote_request_item(quote_request_id);
CREATE INDEX IF NOT EXISTS idx_rate_limit_key_time ON rate_limit_hit(key, created_at);
