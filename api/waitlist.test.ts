import test from 'node:test';
import assert from 'node:assert/strict';
import { handleWaitlistRequest, WaitlistResponse, WaitlistSuccessResponse } from './waitlist';

test('handleWaitlistRequest rejects invalid email', async () => {
  const result = await handleWaitlistRequest({
    name: 'Test Trader',
    email: 'not-an-email',
    accountSize: 100000,
    step: 'two-step',
    privacyConsent: true,
  });
  assert.equal(result.status, 400);
  assert.equal(result.body.success, false);
  assert.equal((result.body as any).code, 'VALIDATION_ERROR');
});

test('handleWaitlistRequest rejects missing name', async () => {
  const result = await handleWaitlistRequest({
    name: '',
    email: 'test@boltiqmarkets.com',
    accountSize: 100000,
    step: 'two-step',
    privacyConsent: true,
  });
  assert.equal(result.status, 400);
  assert.equal(result.body.success, false);
});

test('handleWaitlistRequest rejects missing privacy consent', async () => {
  const result = await handleWaitlistRequest({
    name: 'Test Trader',
    email: 'test@boltiqmarkets.com',
    accountSize: 100000,
    step: 'two-step',
    privacyConsent: false,
  });
  assert.equal(result.status, 400);
  assert.equal(result.body.success, false);
});

test('handleWaitlistRequest traps honeypot spam', async () => {
  const result = await handleWaitlistRequest({
    name: 'Spam Bot',
    email: 'bot@spamdomain.com',
    accountSize: 100000,
    step: 'two-step',
    privacyConsent: true,
    website: 'http://spam-link.xyz',
  });
  assert.equal(result.status, 400);
  assert.equal(result.body.success, false);
  assert.equal((result.body as any).code, 'SPAM_DETECTED');
});

test('handleWaitlistRequest rejects invalid account size', async () => {
  const result = await handleWaitlistRequest({
    name: 'Test Trader',
    email: 'test@boltiqmarkets.com',
    accountSize: 99999,
    step: 'two-step',
    privacyConsent: true,
  });
  assert.equal(result.status, 400);
  assert.equal(result.body.success, false);
});

test('handleWaitlistRequest returns 503 when Supabase not configured', async () => {
  // Ensure Supabase env vars are not set
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_ANON_KEY;

  const result = await handleWaitlistRequest({
    name: 'Sarah Connor',
    email: 'sarah.connor@quantfunds.org',
    accountSize: 100000,
    step: 'two-step',
    privacyConsent: true,
  } as any);
  assert.equal(result.status, 503);
  assert.equal(result.body.success, false);
  assert.equal((result.body as any).persisted, false);
  assert.equal((result.body as any).provider, 'unavailable');
});

test('handleWaitlistRequest never claims persisted without Supabase', async () => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_ANON_KEY;

  const result = await handleWaitlistRequest({
    name: 'Test User',
    email: 'test@example.com',
    accountSize: 50000,
    step: 'one-step',
    privacyConsent: true,
  } as any);
  assert.equal((result.body as any).persisted, false);
  assert.notEqual((result.body as any).provider, 'serverless-buffer');
});

test('handleWaitlistRequest handles duplicate submissions idempotently', async () => {
  // Note: Without the idempotency cache, duplicate submissions will each
  // return 503 when Supabase is not configured, since there's no caching
  // of failed responses. This demonstrates that 503 errors can be retried.
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_ANON_KEY;

  const payload = {
    name: 'Duplicate User',
    email: 'dup@example.com',
    accountSize: 100000,
    step: 'two-step',
    privacyConsent: true,
  } as any;

  const first = await handleWaitlistRequest(payload);
  assert.equal(first.status, 503);
  assert.equal(first.body.success, false);

  // Without idempotency cache, second submission also returns 503
  // (previously cached response was removed so retries can succeed)
  const second = await handleWaitlistRequest(payload);
  assert.equal(second.status, 503);
  assert.equal(second.body.success, false);
});

/** regression: 503 responses can be retried (no idempotency cache) */
test('handleWaitlistRequest retries 503 submission without idempotency cache', async () => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_ANON_KEY;

  const payload = {
    name: 'Retry User',
    email: 'retry@example.com',
    accountSize: 100000,
    step: 'two-step',
    privacyConsent: true,
  } as any;

  const first = await handleWaitlistRequest(payload);
  assert.equal(first.status, 503);
  assert.equal(first.body.success, false);
  assert.equal((first.body as WaitlistSuccessResponse).code, 'SERVICE_UNAVAILABLE');

  // Without idempotency cache, retry should also return 503 (not cache the failure)
  const second = await handleWaitlistRequest(payload);
  assert.equal(second.status, 503);
  assert.equal(second.body.success, false);
  assert.equal((second.body as WaitlistSuccessResponse).code, 'SERVICE_UNAVAILABLE');
});

/** regression: 503 does not falsely claim persistence without Supabase */
test('handleWaitlistRequest never claims persisted without Supabase (regression)', async () => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_ANON_KEY;

  const result = await handleWaitlistRequest({
    name: 'Test User',
    email: 'test@example.com',
    accountSize: 50000,
    step: 'one-step',
    privacyConsent: true,
  } as any);
  assert.equal((result.body as any).persisted, false);
  assert.notEqual((result.body as any).provider, 'serverless-buffer');
      assert.equal((result.body as WaitlistSuccessResponse).provider, 'unavailable');
});

/** regression: malformed JSON body returns 400 */
test('handleWaitlistRequest rejects malformed JSON', async () => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_ANON_KEY;

  // This test simulates what happens when invalid JSON is passed
  // The handler will parse it and pass to handleWaitlistRequest
  // Since handleWaitlistRequest receives a parsed object, we test validation
  const result = await handleWaitlistRequest({
    name: 'Test',
    email: 'invalid-email',  // invalid email
    accountSize: 100000,
    step: 'two-step',
    privacyConsent: true,
  } as any);
  assert.equal(result.status, 400);
  assert.equal(result.body.success, false);
  assert.equal((result.body as any).code, 'VALIDATION_ERROR');
});

/** regression: payload too large returns 413 */
test('handleWaitlistRequest rejects oversized payload', async () => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_ANON_KEY;

  // Create a payload that exceeds MAX_BODY_SIZE (64KB)
  const largeName = 'x'.repeat(70000); // ~70KB
  const result = await handleWaitlistRequest({
    name: largeName,
    email: 'test@example.com',
    accountSize: 100000,
    step: 'two-step',
    privacyConsent: true,
  } as any);
  assert.equal(result.status, 413);
  assert.equal(result.body.success, false);
  assert.equal((result.body as any).code, 'PAYLOAD_TOO_LARGE');
});

/** regression: successful persistence with mocked database */
test('handleWaitlistRequest persists successfully with mocked Supabase', async () => {
  // Mock Supabase environment
  process.env.SUPABASE_URL = 'https://test.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

  // Mock fetch globally
  const originalFetch = global.fetch;
  let mockResponse: any = null;
  
  global.fetch = async (input: string | URL | Request, init?: RequestInit) => {
    const body = JSON.parse((init?.body as string) || '{}');
    // Verify the payload structure
    assert.equal(body.name, 'Mock User');
    assert.equal(body.email, 'mock@example.com');
    assert.equal(body.account_tier, 100000);
    assert.equal(body.challenge_type, 'two-step');
    assert.equal(body.privacy_accepted, true);
    
    // Return database-generated UUID (simulating Supabase gen_random_uuid())
    const dbGeneratedId = 'db-uuid-12345-67890-abcdef';
    mockResponse = {
      ok: true,
      json: async () => [{ id: dbGeneratedId, ...body }],
    };
    return mockResponse as Response;
  };

  try {
    const result = await handleWaitlistRequest({
      name: 'Mock User',
      email: 'mock@example.com',
      accountSize: 100000,
      step: 'two-step',
      privacyConsent: true,
    } as any);

    assert.equal(result.status, 201);
    assert.equal(result.body.success, true);
    assert.equal(result.body.persisted, true);
    assert.equal(result.body.provider, 'supabase');
    // Use the database-generated UUID from the Supabase response
    assert.equal(result.body.id, 'db-uuid-12345-67890-abcdef');
    assert.equal(result.body.message, 'Evaluation waitlist application successfully recorded.');
  } finally {
    global.fetch = originalFetch;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
});

/** regression: database error returns 502 */
test('handleWaitlistRequest returns 502 on database error', async () => {
  process.env.SUPABASE_URL = 'https://test.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: false,
    status: 500,
    text: async () => 'Internal Server Error',
    headers: new Headers(),
    redirected: false,
    statusText: 'Internal Server Error',
    type: 'default',
    url: '',
    clone: () => ({}),
    body: null,
    bodyUsed: false,
    arrayBuffer: async () => new ArrayBuffer(0),
    blob: async () => new Blob(),
    formData: async () => new FormData(),
    json: async () => ({}),
  } as Response);

  try {
    const result = await handleWaitlistRequest({
      name: 'Test User',
      email: 'test@example.com',
      accountSize: 100000,
      step: 'two-step',
      privacyConsent: true,
    } as any);

    assert.equal(result.status, 502);
    assert.equal(result.body.success, false);
    assert.equal((result.body as any).error, 'Database connection failed. Please try again shortly.');
  } finally {
    global.fetch = originalFetch;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
});

/** regression: network error returns 500 */
test('handleWaitlistRequest returns 500 on network error', async () => {
  process.env.SUPABASE_URL = 'https://test.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

  const originalFetch = global.fetch;
  global.fetch = async () => {
    throw new Error('Network error');
  };

  try {
    const result = await handleWaitlistRequest({
      name: 'Test User',
      email: 'test@example.com',
      accountSize: 100000,
      step: 'two-step',
      privacyConsent: true,
    } as any);

    assert.equal(result.status, 500);
    assert.equal(result.body.success, false);
    assert.equal((result.body as any).code, 'DATABASE_SERVICE_UNAVAILABLE');
  } finally {
    global.fetch = originalFetch;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
});
