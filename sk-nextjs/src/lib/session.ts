// Session token signing/verification using the Web Crypto API (globalThis.crypto.subtle)
// rather than Node's `crypto` module. This file is imported by src/middleware.ts,
// which runs in the Edge Runtime — Web Crypto is the one crypto surface that's
// properly supported in both Node and Edge, so this avoids the "Node.js module
// not supported in Edge Runtime" warning a require('crypto') import produces there.

interface SessionPayload {
  sub: string; // AdminUser id
  role: string;
  exp: number; // unix seconds
}

function getSecretBytes(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('SESSION_SECRET is missing or too short — set a real value in .env');
  }
  return new TextEncoder().encode(secret);
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let str = '';
  arr.forEach((b) => (str += String.fromCharCode(b)));
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/').padEnd(b64url.length + ((4 - (b64url.length % 4)) % 4), '=');
  const str = atob(b64);
  return Uint8Array.from(str, (c) => c.charCodeAt(0));
}

async function importKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', getSecretBytes(), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

async function sign(data: string): Promise<string> {
  const key = await importKey();
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return toBase64Url(sig);
}

export async function createSessionToken(sub: string, role: string, ttlSeconds = 60 * 60 * 8): Promise<string> {
  const payload: SessionPayload = { sub, role, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const body = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const sig = await sign(body);
  return `${body}.${sig}`;
}

export async function verifySessionToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;

  // Verify via the key's own `verify` operation (constant-time internally)
  // rather than a manual byte comparison.
  const key = await importKey();
  const valid = await crypto.subtle.verify('HMAC', key, fromBase64Url(sig), new TextEncoder().encode(body));
  if (!valid) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
