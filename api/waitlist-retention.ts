import { timingSafeEqual } from 'node:crypto';

/** Twelve calendar months, clamping leap-day anniversaries to February 28. */
export function retentionCutoff(now = new Date()): string {
  const year = now.getUTCFullYear() - 1;
  const month = now.getUTCMonth();
  const day = Math.min(now.getUTCDate(), new Date(Date.UTC(year, month + 1, 0)).getUTCDate());
  return new Date(Date.UTC(year, month, day, now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds())).toISOString();
}

export default async function handler(req: any, res: any): Promise<void> {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, code: 'METHOD_NOT_ALLOWED' });
  }

  const secret = process.env.CRON_SECRET;
  const authorization = req.headers?.authorization;
  if (!secret) return res.status(503).json({ success: false, code: 'RETENTION_NOT_CONFIGURED' });
  const expected = Buffer.from(`Bearer ${secret}`);
  const actual = Buffer.from(typeof authorization === 'string' ? authorization : '');
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return res.status(401).json({ success: false, code: 'UNAUTHORIZED' });
  }

  const supabaseUrl = process.env.SUPABASE_URL?.trim().replace(/\/+$/, '').replace(/\/rest\/v1$/i, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !key) return res.status(503).json({ success: false, code: 'DATABASE_NOT_CONFIGURED' });

  // The cutoff is server-generated; request parameters cannot broaden deletion.
  const cutoff = retentionCutoff();
  try {
    const url = new URL(`${supabaseUrl}/rest/v1/waitlist`);
    url.searchParams.set('created_at', `lte.${cutoff}`);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: 'return=minimal' },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) {
      console.error('[waitlist-retention] Cleanup failed', { status: response.status });
      return res.status(502).json({ success: false, code: 'CLEANUP_FAILED' });
    }
    console.info('[waitlist-retention] Cleanup completed', { cutoff });
    return res.status(200).json({ success: true, cutoff });
  } catch {
    console.error('[waitlist-retention] Database request failed');
    return res.status(502).json({ success: false, code: 'CLEANUP_FAILED' });
  }
}
