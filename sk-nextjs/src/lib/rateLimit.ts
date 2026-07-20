import { checkRateLimit } from '@/db';

/** Best-effort client identifier for rate limiting behind a proxy/CDN. */
export function clientKeyFromRequest(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  return fwd?.split(',')[0]?.trim() ?? 'unknown';
}

export async function rateLimit(key: string, maxRequests: number, windowSeconds: number): Promise<{ allowed: boolean }> {
  return checkRateLimit(key, maxRequests, windowSeconds);
}
