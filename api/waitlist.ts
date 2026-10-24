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
 * - Duplicate protection via database unique constraint when Supabase is connected.
 * - 503 responses are never cached; they can be retried after database recovery.
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

export type { WaitlistResponse, WaitlistSuccessResponse, WaitlistErrorResponse };

export async function handleWaitlistRequest(body: unknown): Promise<{ status: number; body: WaitlistResponse }> {
  // 1. Validate body is a non-null object
  if (body === null || body === undefined || typeof body !== 'object' || Array.isArray(body)) {
    return {
      status: 400,
      body: {
        success: false,
        error: 'Request body must be a JSON object.',
        code: 'INVALID_BODY_TYPE',
      } as WaitlistErrorResponse,
    };
  }

  const payload = body as Record<string, unknown>;

  // 2. Request body size limit
  const bodySize = Buffer.byteLength(JSON.stringify(payload), 'utf8');
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

  // 3. Honeypot Spam Prevention
  const website = payload.website;
  if (typeof website === 'string' && website.trim().length > 0) {
    return {
      status: 400,
      body: {
        success: false,
        error: 'Spam validation triggered.',
        code: 'SPAM_DETECTED',
      } as WaitlistErrorResponse,
    };
  }

  // 4. Input Validation — server-side only, never trust client validation
  const errors: string[] = [];

  const name = payload.name;
  if (typeof name !== 'string' || !name.trim()) {
    errors.push('Name is required.');
  } else if (name.trim().length > 100) {
    errors.push('Name must not exceed 100 characters.');
  }

  const email = payload.email;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof email !== 'string' || !emailRegex.test(email)) {
    errors.push('A valid email address is required.');
  } else if (email.length > 254) {
    errors.push('Email address is too long.');
  }

  // TypeScript narrowing - after validation, name and email are strings
  const validatedName = name as string;
  const validatedEmail = email as string;

  const privacyConsent = payload.privacyConsent;
  if (privacyConsent !== true) {
    errors.push('Privacy policy consent is required.');
  }

  const accountSize = payload.accountSize;
  const validSizes = [25000, 50000, 100000, 200000];
  const parsedSize = Number(accountSize);
  if (!Number.isInteger(parsedSize) || !validSizes.includes(parsedSize)) {
    errors.push('Invalid account tier selected.');
  }

  const step = payload.step;
  if (step !== 'one-step' && step !== 'two-step') {
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

  const entry = {
      name: validatedName.trim().substring(0, 100) || 'Anonymous Trader',
      email: validatedEmail.toLowerCase().trim(),
      accountSize: parsedSize,
      step: step as 'one-step' | 'two-step',
      privacyConsent: true,
      createdAt: new Date().toISOString(),
    };

  // 5. Persistence Layer — truthful behavior
  // Normalize the configured project URL so both base URLs and REST endpoint URLs work.
  const rawSupabaseUrl = process.env.SUPABASE_URL;
  const supabaseUrl = rawSupabaseUrl
    ? rawSupabaseUrl.trim().replace(/\/+$/, '').replace(/\/rest\/v1$/i, '')
    : undefined;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    const unavailableResponse: WaitlistSuccessResponse = {
      success: false,
      persisted: false,
      provider: 'unavailable',
      message: 'Waitlist applications cannot be accepted at this time. Production database is not configured.',
      code: 'SERVICE_UNAVAILABLE',
    };
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
      const errorText = await response.text();
      // Sanitized logging: never log raw error bodies, secrets, PII, or auth headers
      console.error('[waitlist] Supabase insertion failed', { status: response.status });

      // Handle unique constraint violation using structured PostgreSQL error codes
      // Parse error response for structured error code (PostgreSQL returns JSON with 'code' field)
      let pgErrorCode: string | undefined;
      try {
        const errorJson = JSON.parse(errorText);
        pgErrorCode = errorJson.code;
      } catch {
        // Not JSON, ignore
      }

      if (response.status === 409 || pgErrorCode === '23505') {
        return {
          status: 409,
          body: {
            success: false,
            error: 'This email is already registered for the waitlist.',
            code: 'DUPLICATE_REGISTRATION',
          } as WaitlistErrorResponse,
        };
      }

      // Other database errors are retryable
      return {
        status: 502,
        body: {
          success: false,
          error: 'Database connection failed. Please try again shortly.',
          code: 'DATABASE_ERROR',
        } as WaitlistErrorResponse,
      };
    }

    const data = await response.json();
    // Verify that a successful database response represents an actual inserted row
    if (!Array.isArray(data) || data.length !== 1 || typeof data[0]?.id !== 'string' || !data[0].id.trim()) {
      console.error('[waitlist] Unexpected empty response from Supabase');
      return {
        status: 500,
        body: {
          success: false,
          error: 'Database returned unexpected response.',
          code: 'DATABASE_UNEXPECTED_RESPONSE',
        } as WaitlistErrorResponse,
      };
    }

        // Use the database-generated UUID from the inserted row
        const insertedRow = data[0];
        const dbId = insertedRow.id;

        return {
          status: 201,
          body: {
            success: true,
            persisted: true,
            provider: 'supabase',
            id: dbId,
            message: 'Evaluation waitlist application successfully recorded.',
          },
        };
  } catch (dbErr) {
    // Sanitized logging: never log raw error details that might contain secrets
    console.error('[waitlist] Unexpected database error');
    return {
      status: 500,
      body: {
        success: false,
        error: 'Database service unavailable. Please try again later.',
        code: 'DATABASE_SERVICE_UNAVAILABLE',
      } as WaitlistErrorResponse,
    };
  }
}

// Default export for Vercel Serverless Function (Node.js runtime)
export default async function handler(req: any, res: any): Promise<void> {
  res.setHeader('Cache-Control', 'no-store');
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

  let parsed: any;

  // Use req.body if already parsed by Vercel/body-parser middleware
  // Treat ANY defined req.body (including {}, null, arrays) as already parsed
  // to avoid re-reading a consumed request stream
  if (req.body !== undefined) {
    parsed = req.body;
  } else {
    // Fallback: read raw body for cases where body-parser is not configured
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
  }

  // Strict payload size limit check on parsed body
  const bodySize = Buffer.byteLength(JSON.stringify(parsed), 'utf8');
  if (bodySize > MAX_BODY_SIZE) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(413).json({
      success: false,
      error: 'Request payload too large.',
      code: 'PAYLOAD_TOO_LARGE',
    });
  }

  const result = await handleWaitlistRequest(parsed);
  res.setHeader('Content-Type', 'application/json');
  return res.status(result.status).json(result.body);
}
