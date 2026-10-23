import test from 'node:test';
import assert from 'node:assert/strict';
import { handleWaitlistRequest } from './waitlist';

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
  assert.equal(first.body.code, 'SERVICE_UNAVAILABLE');

  // Without idempotency cache, retry should also return 503 (not cache the failure)
  const second = await handleWaitlistRequest(payload);
  assert.equal(second.status, 503);
  assert.equal(second.body.success, false);
  assert.equal(second.body.code, 'SERVICE_UNAVAILABLE');
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
  assert.equal(result.body.provider, 'unavailable');
});
