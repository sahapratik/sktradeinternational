import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Verifies Meta's X-Hub-Signature-256 header against the raw request body.
 * This MUST run against the raw (unparsed) body — verifying against a
 * re-serialized JSON object can produce a different byte sequence and a
 * false rejection (or, worse, a false acceptance if you're not careful).
 *
 * Meta signs with your App Secret, not your access token. Never log the
 * secret or the raw signature.
 */
export function verifyWhatsAppSignature(rawBody: string, signatureHeader: string | null): boolean {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) {
    throw new Error('WHATSAPP_APP_SECRET is not configured');
  }
  if (!signatureHeader || !signatureHeader.startsWith('sha256=')) return false;

  const providedHex = signatureHeader.slice('sha256='.length);
  const expectedHex = createHmac('sha256', appSecret).update(rawBody, 'utf8').digest('hex');

  const a = Buffer.from(providedHex, 'hex');
  const b = Buffer.from(expectedHex, 'hex');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Meta's webhook verification handshake (the GET request when you register the webhook URL). */
export function verifyWebhookChallenge(params: URLSearchParams): { ok: true; challenge: string } | { ok: false } {
  const mode = params.get('hub.mode');
  const token = params.get('hub.verify_token');
  const challenge = params.get('hub.challenge');

  const expected = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
  if (mode === 'subscribe' && token && expected && token === expected && challenge) {
    return { ok: true, challenge };
  }
  return { ok: false };
}

interface SendResult {
  ok: boolean;
  waMessageId?: string;
  error?: string;
}

/**
 * Sends an outbound message via the WhatsApp Cloud API.
 * Requires WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID to be configured —
 * both only exist once Meta Business verification is complete (see architecture.md §7).
 * Until then this fails closed with a clear error rather than pretending to send.
 */
export async function sendWhatsAppMessage(toE164: string, body: string): Promise<SendResult> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    return { ok: false, error: 'WhatsApp credentials not configured — see architecture.md §7' };
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: toE164,
        type: 'text',
        text: { body },
      }),
    });

    const json = (await res.json()) as { messages?: { id: string }[]; error?: { message: string } };
    if (!res.ok) {
      return { ok: false, error: json.error?.message ?? `HTTP ${res.status}` };
    }
    return { ok: true, waMessageId: json.messages?.[0]?.id };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown network error' };
  }
}
