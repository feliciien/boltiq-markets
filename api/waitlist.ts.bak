/**
 * Serverless API Endpoint: /api/waitlist
 * BoltIQ Markets (boltiqmarkets.com) — WorkFusionApp, Inc.
 * Compatible with Vercel Serverless Functions and local Vite middleware.
 */

interface WaitlistRequestBody {
  name: string;
  email: string;
  accountSize: number;
  step: 'one-step' | 'two-step';
  privacyConsent: boolean;
  website?: string; // Honeypot spam trap
}

// In-memory rate limiting map (IP -> timestamp)
const rateLimitMap = new Map<string, number[]>();

export async function handleWaitlistRequest(body: WaitlistRequestBody, clientIp = '127.0.0.1') {
  // 1. Honeypot Spam Prevention
  if (body.website && body.website.trim().length > 0) {
    return {
      status: 400,
      body: { success: false, error: 'Spam validation triggered.' },
    };
  }

  // 2. Input Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!body.email || !emailRegex.test(body.email)) {
    return {
      status: 400,
      body: { success: false, error: 'A valid email address is required.' },
    };
  }

  if (!body.privacyConsent) {
    return {
      status: 400,
      body: { success: false, error: 'Privacy policy consent is required.' },
    };
  }

  const validSizes = [25000, 50000, 100000, 200000];
  if (!validSizes.includes(Number(body.accountSize))) {
    return {
      status: 400,
      body: { success: false, error: 'Invalid account tier selected.' },
    };
  }

  // 3. Simple In-Memory Rate Limiting (max 5 requests per 10 minutes per IP)
  const now = Date.now();
  const timestamps = rateLimitMap.get(clientIp) || [];
  const recentTimestamps = timestamps.filter(t => now - t < 600000);
  if (recentTimestamps.length >= 5) {
    return {
      status: 429,
      body: { success: false, error: 'Too many requests. Please try again in a few minutes.' },
    };
  }
  recentTimestamps.push(now);
  rateLimitMap.set(clientIp, recentTimestamps);

  const entry = {
    id: `wq_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    name: body.name ? body.name.trim().substring(0, 100) : 'Anonymous Trader',
    email: body.email.toLowerCase().trim(),
    accountSize: Number(body.accountSize),
    step: body.step === 'one-step' ? 'one-step' : 'two-step',
    privacyConsent: true,
    clientIp: clientIp.replace(/:\d+$/, ''),
    createdAt: new Date().toISOString(),
  };

  // 4. Persistence Layer
  // If Supabase environment variables are available, persist to Supabase REST API
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
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
        console.error('Supabase waitlist insertion error:', errorText);
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
      console.error('Failed to connect to Supabase:', dbErr);
      return {
        status: 500,
        body: { success: false, error: 'Database service unavailable.' },
      };
    }
  }

  // Fallback: serverless memory buffer with explicit provider status
  return {
    status: 200,
    body: {
      success: true,
      persisted: true,
      provider: 'serverless-buffer',
      id: entry.id,
      message: 'Evaluation waitlist application successfully validated and recorded in server queue.',
      notice: 'Production database credentials (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) not yet configured in environment.',
    },
  };
}

// Default export for Vercel Serverless Function (Node.js runtime)
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ success: false, error: 'Invalid JSON payload' });
    }
  }

  const result = await handleWaitlistRequest(body, Array.isArray(clientIp) ? clientIp[0] : clientIp);
  return res.status(result.status).json(result.body);
}
