/**
 * Serverless API Endpoint: /api/waitlist
 * BoltIQ Markets (boltiqmarkets.com) — WorkFusionApp, Inc.
 * Compatible with Vercel Serverless Functions and local Vite middleware.
 *
 * TRUTHFUL PERSISTENCE GUARANTEE:
 * - Never returns success: true / persisted: true unless durable persistence succeeded.
 * - If Supabase credentials are missing, returns 503 Service Unavailable.
 * - No visitor IP addresses are stored.
 * - Request body size is limited.
 */

const MAX_BODY_SIZE = 64 * 1024;

interface WaitlistRequestBody {
  name: string;
  email: string;
  accountSize: number;
  step: 'one-step' | 'two-step';
  privacyConsent: boolean;
  website?: string;
}

interface WaitlistErrorResponse {
  success: false;
  error: string;
  code?: string;
}

interface WaitlistSuccessResponse {
  success: boolean;
  persisted: boolean;
  provider: 'supabase' | 'unavailable';
  id?: string;
  message: string;
  code?: string;
}

type WaitlistResponse = WaitlistErrorResponse | WaitlistSuccessResponse;

const idempotencyCache = new Map<string, { timestamp: number; response: WaitlistResponse }>();
const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000;

function generateIdempotencyKey(body: WaitlistRequestBody): string {
  return `${body.email.toLowerCase().trim()}|${body.accountSize}|${body.step}`;
}

function checkIdempotency(key: string): WaitlistResponse | null {
  const cached = idempotencyCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > IDEMPOTENCY_TTL_MS) {
    idempotencyCache.delete(key);
    return null;
  }
  return cached.response;
}

function storeIdempotency(key: string, response: WaitlistResponse): void {
  idempotencyCache.set(key, { timestamp: Date.now(), response });
}

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of idempotencyCache.entries()) {
    if (now - value.timestamp > IDEMPOTENCY_TTL_MS) {
      idempotencyCache.delete(key);
    }
  }
}, 60 * 60 * 1000).unref();

export async function handleWaitlistRequest(body: WaitlistRequestBody): Promise<{ status: number; body: WaitlistResponse }> {
  // 1. Request body size limit
  const bodySize = Buffer.byteLength(JSON.stringify(body), 'utf8');
  if (bodySize > MAX_BODY_SIZE) {
    return {
      status: 413,
      body: {
        success: false,
        error: 'Request payload too large.',
        code: 'PAYLOAD_TOO_LARGE',
      } as WaitlistErrorResponse,
    };
  }
  // 2. Honeypot Spam Prevention
  if (body.website && body.website.trim().length > 0) {
    return {
      status: 400,
      body: {
        success: false,
        error: 'Spam validation triggered.',
        code: 'SPAM_DETECTED',
      } as WaitlistErrorResponse,
    };
  }

  // 3. Input Validation — server-side only, never trust client validation
  const errors: string[] = [];

  if (!body.name || !body.name.trim()) {
    errors.push('Name is required.');
  } else if (body.name.trim().length > 100) {
    errors.push('Name must not exceed 100 characters.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!body.email || typeof body.email !== 'string') {
    errors.push('A valid email address is required.');
  } else if (!emailRegex.test(body.email)) {
    errors.push('Please provide a valid email address.');
  } else if (body.email.length > 254) {
    errors.push('Email address is too long.');
  }

  if (!body.privacyConsent) {
    errors.push('Privacy policy consent is required.');
  }

  const validSizes = [25000, 50000, 100000, 200000];
  const parsedSize = Number(body.accountSize);
  if (!validSizes.includes(parsedSize)) {
    errors.push('Invalid account tier selected.');
  }

  if (body.step !== 'one-step' && body.step !== 'two-step') {
    errors.push('Invalid challenge type selected.');
  }

  if (errors.length > 0) {
    return {
      status: 400,
      body: {
        success: false,
        error: errors.join(' '),
        code: 'VALIDATION_ERROR',
      } as WaitlistErrorResponse,
    };
  }

  // 4. Idempotency check — reject duplicate submissions
  const idempotencyKey = generateIdempotencyKey(body);
  const cached = checkIdempotency(idempotencyKey);
  if (cached) {
    return {
      status: 200,
      body: {
        ...cached,
        message: 'Duplicate submission detected. Your application was already received.',
      } as WaitlistSuccessResponse,
    };
  }

  const entry = {
    id: `wq_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    name: body.name.trim().substring(0, 100) || 'Anonymous Trader',
    email: body.email.toLowerCase().trim(),
    accountSize: parsedSize,
    step: body.step,
    privacyConsent: true,
    createdAt: new Date().toISOString(),
  };

  // 5. Persistence Layer — truthful behavior
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    const unavailableResponse: WaitlistSuccessResponse = {
      success: false,
      persisted: false,
      provider: 'unavailable',
      message: 'Waitlist applications cannot be accepted at this time. Production database is not configured.',
    };
    storeIdempotency(idempotencyKey, unavailableResponse);
    return {
      status: 503,
      body: unavailableResponse,
    };
  }

  try {
      const response = await fetch(`${supabaseUrl}/rest/v1/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          name: entry.name,
          email: entry.email,
          account_tier: entry.accountSize,
          challenge_type: entry.step,
          privacy_accepted: true,
          created_at: entry.createdAt,
        }),
      });

      if (!response.ok) {
        await response.text();
        console.error('[waitlist] Supabase insertion failed with status:', response.status);
        return {
          status: 502,
          body: {
            success: false,
            error: 'Database connection failed. Please try again shortly.',
          },
        };
      }

      const data = await response.json();
      return {
        status: 201,
        body: {
          success: true,
          persisted: true,
          provider: 'supabase',
          id: entry.id,
          message: 'Evaluation waitlist application successfully recorded.',
        },
      };
    } catch (dbErr) {
      console.error('[waitlist] Unexpected database error:', String(dbErr));
      return {
        status: 500,
        body: {
          success: false,
          error: 'Database service unavailable. Please try again later.',
          code: 'DATABASE_SERVICE_UNAVAILABLE',
        } as WaitlistErrorResponse,
      };
    }

  return {
    status: 500,
    body: {
      success: false,
      error: 'Internal server error.',
      code: 'INTERNAL_ERROR',
    } as WaitlistErrorResponse,
  };
}

// Default export for Vercel Serverless Function (Node.js runtime)
export default async function handler(req: any, res: any): Promise<void> {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.setHeader('Content-Type', 'application/json');
    return res.status(405).json({
      success: false,
      error: `Method ${req.method} Not Allowed. Only POST is supported.`,
      code: 'METHOD_NOT_ALLOWED',
    });
  }

  const contentType = req.headers['content-type'] || '';
  if (!String(contentType).includes('application/json')) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({
      success: false,
      error: 'Content-Type must be application/json.',
      code: 'INVALID_CONTENT_TYPE',
    });
  }

  let bodyRaw = '';
  try {
    for await (const chunk of req as any) {
      bodyRaw += chunk;
      if (Buffer.byteLength(bodyRaw, 'utf8') > MAX_BODY_SIZE) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(413).json({
          success: false,
          error: 'Request payload too large.',
          code: 'PAYLOAD_TOO_LARGE',
        });
      }
    }
  } catch {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({
      success: false,
      error: 'Failed to read request body.',
      code: 'BODY_READ_ERROR',
    });
  }

  let parsed: any;
  try {
    parsed = JSON.parse(bodyRaw || '{}');
  } catch {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON payload.',
      code: 'INVALID_JSON',
    });
  }

  const result = await handleWaitlistRequest(parsed);
  res.setHeader('Content-Type', 'application/json');
  return res.status(result.status).json(result.body);
}
