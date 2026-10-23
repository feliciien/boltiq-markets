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
});

test('handleWaitlistRequest accepts valid application and returns queue ID', async () => {
  const result = await handleWaitlistRequest({
    name: 'Sarah Connor',
    email: 'sarah.connor@quantfunds.org',
    accountSize: 100000,
    step: 'two-step',
    privacyConsent: true,
  });
  assert.equal(result.status, 200);
  assert.equal(result.body.success, true);
  assert.ok(result.body.id);
  assert.equal(result.body.persisted, true);
});
