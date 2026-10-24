import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import handler, { retentionCutoff } from './waitlist-retention';

const originalFetch = global.fetch;
const originalEnv = { ...process.env };
afterEach(() => {
  global.fetch = originalFetch;
  for (const key of ['CRON_SECRET', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[key];
  }
});

function response() {
  return {
    statusCode: 0, body: null as any, headers: {} as Record<string, string>,
    setHeader(key: string, value: string) { this.headers[key] = value; },
    status(code: number) { this.statusCode = code; return this; },
    json(body: unknown) { this.body = body; return this; },
  };
}
function configure() {
  process.env.CRON_SECRET = 'test-cron-secret';
  process.env.SUPABASE_URL = 'https://test.supabase.co/';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-server-key';
}
const request = () => ({ method: 'GET', headers: { authorization: 'Bearer test-cron-secret' } });

test('retention uses calendar years and preserves the UTC time', () => {
  assert.equal(retentionCutoff(new Date('2026-10-24T04:12:30.123Z')), '2025-10-24T04:12:30.123Z');
  assert.equal(retentionCutoff(new Date('2024-02-29T08:00:00Z')), '2023-02-28T08:00:00.000Z');
  assert.equal(retentionCutoff(new Date('2025-03-01T00:00:00Z')), '2024-03-01T00:00:00.000Z');
});

test('retention fails closed without a configured secret', async () => {
  delete process.env.CRON_SECRET;
  global.fetch = async () => { throw new Error('must not reach database'); };
  const res = response();
  await handler(request(), res);
  assert.equal(res.statusCode, 503);
  assert.equal(res.headers['Cache-Control'], 'no-store');
});

test('unauthorized cleanup never contacts the database', async () => {
  configure();
  let calls = 0;
  global.fetch = async () => { calls++; throw new Error('must not reach database'); };
  for (const authorization of [undefined, '', 'Bearer wrong', ['Bearer test-cron-secret']]) {
    const res = response();
    await handler({ method: 'GET', headers: { authorization } }, res);
    assert.equal(res.statusCode, 401);
  }
  assert.equal(calls, 0);
});

test('cleanup rejects other methods and missing database credentials', async () => {
  configure();
  const methodRes = response();
  await handler({ ...request(), method: 'POST' }, methodRes);
  assert.equal(methodRes.statusCode, 405);
  assert.equal(methodRes.headers.Allow, 'GET');
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  const configRes = response();
  await handler(request(), configRes);
  assert.equal(configRes.statusCode, 503);
});

test('cleanup deletes only expired records with a server-generated cutoff', async () => {
  configure();
  let cutoff = '';
  global.fetch = async (input, init) => {
    const url = new URL(String(input));
    assert.equal(url.origin, 'https://test.supabase.co');
    assert.equal(url.pathname, '/rest/v1/waitlist');
    assert.equal([...url.searchParams.keys()].join(','), 'created_at');
    assert.ok(url.searchParams.get('created_at')?.startsWith('lte.'));
    cutoff = url.searchParams.get('created_at')!.slice(4);
    assert.ok(Math.abs(Date.parse(cutoff) - Date.parse(retentionCutoff())) < 5000);
    assert.equal(init?.method, 'DELETE');
    assert.equal((init?.headers as any).Authorization, 'Bearer test-server-key');
    return new Response(null, { status: 204 });
  };
  const res = response();
  await handler({ ...request(), query: { cutoff: '2099-01-01', created_at: 'gte.1900-01-01' } }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { success: true, cutoff });
});

test('database errors are reported without exposing provider details', async () => {
  configure();
  for (const fail of [false, true]) {
    global.fetch = async () => {
      if (fail) throw new Error('private-provider-details');
      return new Response('private-provider-details', { status: 500 });
    };
    const res = response();
    await handler(request(), res);
    assert.equal(res.statusCode, 502);
    assert.equal(JSON.stringify(res.body).includes('private-provider-details'), false);
  }
});
