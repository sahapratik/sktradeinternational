import { NextResponse } from 'next/server';
import { createQuoteRequest, createAuditLog } from '@/db';
import { quoteRequestSchema } from '@/lib/validation';
import { rateLimit, clientKeyFromRequest } from '@/lib/rateLimit';

export async function POST(req: Request) {
  const key = `quote:${clientKeyFromRequest(req)}`;
  const { allowed } = await rateLimit(key, 5, 60); // 5 submissions per minute per client
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = quoteRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Some fields need attention.' }, { status: 422 });
  }

  const data = parsed.data;
  if (data.website) {
    // Honeypot tripped — respond as if it succeeded so the bot learns nothing, but store nothing.
    return NextResponse.json({ ok: true, refNumber: 'SKT-0000-000000' });
  }

  const created = await createQuoteRequest({
    contactName: data.contactName,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
    company: data.company,
    sector: data.sector,
    message: data.message,
    items: data.items,
  });

  await createAuditLog(null, 'quote_request.created', created.refNumber);

  return NextResponse.json({ ok: true, refNumber: created.refNumber });
}
