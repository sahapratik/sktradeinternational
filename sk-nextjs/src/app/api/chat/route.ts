import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createConversationWithMessage } from '@/db';
import { chatIntakeSchema } from '@/lib/validation';
import { rateLimit, clientKeyFromRequest } from '@/lib/rateLimit';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

export async function POST(req: Request) {
  const key = `chat:${clientKeyFromRequest(req)}`;
  const { allowed } = await rateLimit(key, 10, 60);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many messages. Please slow down.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = chatIntakeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Some fields need attention.' }, { status: 422 });
  }
  const data = parsed.data;
  if (data.website) {
    return NextResponse.json({ ok: true, ticketId: 'TCK-0000' });
  }

  const conversation = await createConversationWithMessage({
    visitorSessionId: randomUUID(),
    pageContext: data.pageContext,
    direction: 'inbound',
    body: `[${data.name} · ${data.contact} · ${data.sector}] ${data.message}`,
  });

  // Real attempt to forward to WhatsApp if credentials are configured; fails closed
  // and gracefully (the visitor's message is still safely stored either way) if not.
  const forwardTarget = process.env.WHATSAPP_SUPPORT_DESTINATION;
  let whatsappForwarded = false;
  if (forwardTarget) {
    const result = await sendWhatsAppMessage(
      forwardTarget,
      `New web inquiry (${conversation.ticketId})\nFrom: ${data.name} (${data.contact})\nSector: ${data.sector}\n\n${data.message}`
    );
    whatsappForwarded = result.ok;
  }

  return NextResponse.json({ ok: true, ticketId: conversation.ticketId, whatsappForwarded });
}
