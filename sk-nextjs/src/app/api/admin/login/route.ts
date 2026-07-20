import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminUserByEmail, createAuditLog } from '@/db';
import { verifyPassword } from '@/lib/password';
import { createSessionToken } from '@/lib/session';
import { adminLoginSchema } from '@/lib/validation';
import { rateLimit, clientKeyFromRequest } from '@/lib/rateLimit';

export async function POST(req: Request) {
  const key = `admin-login:${clientKeyFromRequest(req)}`;
  const { allowed } = await rateLimit(key, 8, 300); // 8 attempts / 5 min — slows brute force without locking out typos
  if (!allowed) {
    return NextResponse.json({ error: 'Too many attempts. Please wait and try again.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = adminLoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const user = await getAdminUserByEmail(parsed.data.email);

  // Same generic error whether the email doesn't exist or the password is wrong.
  const genericError = () => NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  if (!user) return genericError();

  const valid = await verifyPassword(parsed.data.password, user.password_hash);
  if (!valid) return genericError();

  const token = await createSessionToken(user.id, user.role);
  cookies().set('sk_admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  await createAuditLog(user.id, 'admin.login');

  return NextResponse.json({ ok: true, role: user.role });
}
