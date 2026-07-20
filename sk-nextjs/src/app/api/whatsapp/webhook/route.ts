import { NextResponse } from 'next/server';
import { findConversationByWaId, createWhatsAppConversation, addMessage } from '@/db';
import { verifyWebhookChallenge, verifyWhatsAppSignature } from '@/lib/whatsapp';

// --- GET: Meta's one-time webhook verification handshake ---
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const result = verifyWebhookChallenge(searchParams);
  if (!result.ok) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  return new NextResponse(result.challenge, { status: 200 });
}

interface WhatsAppWebhookPayload {
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: Array<{ id: string; from: string; text?: { body?: string } }>;
      };
    }>;
  }>;
}

export async function POST(req: Request) {
  // Signature MUST be verified against the raw body text — parsing to JSON
  // first and re-stringifying can change byte-for-byte content and silently
  // break verification.
  const rawBody = await req.text();
  const signature = req.headers.get('x-hub-signature-256');

  let signatureValid: boolean;
  try {
    signatureValid = verifyWhatsAppSignature(rawBody, signature);
  } catch {
    return new NextResponse('Not configured', { status: 503 });
  }
  if (!signatureValid) {
    return new NextResponse('Invalid signature', { status: 401 });
  }

  let payload: WhatsAppWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new NextResponse('Invalid JSON', { status: 400 });
  }

  const incomingMessages = payload.entry?.flatMap((e) => e.changes?.flatMap((c) => c.value?.messages ?? []) ?? []) ?? [];

  for (const msg of incomingMessages) {
    const conversation = (await findConversationByWaId(msg.from)) ?? (await createWhatsAppConversation(msg.from));
    addMessage(conversation.id, { direction: 'inbound', body: msg.text?.body ?? '(non-text message)', waMessageId: msg.id });
    // Real-time delivery to the visitor's open browser session (WebSocket/SSE)
    // is specified in architecture.md §7 and intentionally not implemented
    // here — it needs a persistent connection layer beyond a request/response handler.
  }

  return NextResponse.json({ ok: true });
}
