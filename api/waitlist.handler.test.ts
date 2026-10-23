import test from 'node:test';
import assert from 'node:assert/strict';
import handler from './waitlist';

// Mock response object
function createMockResponse() {
  const res: any = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    setHeader(name: string, value: string) {
      this.headers[name.toLowerCase()] = value;
      return this;
    },
    json(data: any) {
      this.body = data;
      return this;
    },
  };
  return res;
}

// Mock request object
function createMockRequest(overrides: any = {}) {
  return {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: null,
    ...overrides,
    // Make it iterable for raw body reading
    [Symbol.asyncIterator]: async function* () {
      if (this.bodyRaw) {
        yield this.bodyRaw;
      }
    },
  };
}

test('Vercel handler: valid POST with pre-parsed body', async () => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_ANON_KEY;

  const req = createMockRequest({
    body: {
      name: 'Test User',
      email: 'test@example.com',
      accountSize: 100000,
      step: 'two-step',
      privacyConsent: true,
    },
  });
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 503);
  assert.equal(res.body.success, false);
  assert.equal(res.body.code, 'SERVICE_UNAVAILABLE');
  assert.equal(res.body.provider, 'unavailable');
});

test('Vercel handler: valid POST with raw JSON body', async () => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_ANON_KEY;

  const req = createMockRequest({
    bodyRaw: JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      accountSize: 100000,
      step: 'two-step',
      privacyConsent: true,
    }),
    body: undefined, // undefined triggers raw body reading
  });
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 503);
  assert.equal(res.body.success, false);
  assert.equal(res.body.code, 'SERVICE_UNAVAILABLE');
});

test('Vercel handler: empty JSON object (treated as parsed)', async () => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_ANON_KEY;

  const req = createMockRequest({
    body: {},
  });
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.success, false);
  // Empty object is treated as parsed body, fails validation
  assert.equal(res.body.code, 'VALIDATION_ERROR');
});

test('Vercel handler: null body (treated as parsed)', async () => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_ANON_KEY;

  const req = createMockRequest({
    body: null,
  });
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.success, false);
  // null is a defined value, treated as parsed body, fails type check
  assert.equal(res.body.code, 'INVALID_BODY_TYPE');
});

test('Vercel handler: malformed JSON', async () => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_ANON_KEY;

  const req = createMockRequest({
    bodyRaw: '{ invalid json }',
    body: undefined, // undefined triggers raw body reading
  });
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.success, false);
  assert.equal(res.body.code, 'INVALID_JSON');
});

test('Vercel handler: unsupported HTTP method', async () => {
  const req = createMockRequest({
    method: 'GET',
    body: {},
  });
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 405);
  assert.equal(res.body.success, false);
  assert.equal(res.body.code, 'METHOD_NOT_ALLOWED');
  assert.equal(res.headers.allow, 'POST');
});

test('Vercel handler: invalid content type', async () => {
  const req = createMockRequest({
    headers: { 'content-type': 'text/plain' },
    body: {},
  });
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.success, false);
  assert.equal(res.body.code, 'INVALID_CONTENT_TYPE');
});

test('Vercel handler: oversized payload', async () => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_ANON_KEY;

  const largeName = 'x'.repeat(70000);
  const req = createMockRequest({
    body: {
      name: largeName,
      email: 'test@example.com',
      accountSize: 100000,
      step: 'two-step',
      privacyConsent: true,
    },
  });
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 413);
  assert.equal(res.body.success, false);
  assert.equal(res.body.code, 'PAYLOAD_TOO_LARGE');
});

test('Vercel handler: missing database configuration', async () => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_ANON_KEY;

  const req = createMockRequest({
    body: {
      name: 'Test User',
      email: 'test@example.com',
      accountSize: 100000,
      step: 'two-step',
      privacyConsent: true,
    },
  });
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 503);
  assert.equal(res.body.success, false);
  assert.equal(res.body.code, 'SERVICE_UNAVAILABLE');
  assert.equal(res.body.provider, 'unavailable');
});

test('Vercel handler: successful mocked persistence', async () => {
  process.env.SUPABASE_URL = 'https://test.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

  const originalFetch = global.fetch;
  global.fetch = async (input: string | URL | Request, init?: RequestInit) => {
    const body = JSON.parse((init?.body as string) || '{}');
    assert.equal(body.name, 'Mock User');
    assert.equal(body.email, 'mock@example.com');
    assert.equal(body.account_tier, 100000);
    assert.equal(body.challenge_type, 'two-step');
    assert.equal(body.privacy_accepted, true);

    return {
      ok: true,
      json: async () => [{ id: 'wq_mock_123', ...body }],
    } as Response;
  };

  try {
    const req = createMockRequest({
      body: {
        name: 'Mock User',
        email: 'mock@example.com',
        accountSize: 100000,
        step: 'two-step',
        privacyConsent: true,
      },
    });
    const res = createMockResponse();

    await handler(req, res);

    assert.equal(res.statusCode, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.persisted, true);
    assert.equal(res.body.provider, 'supabase');
    assert.ok(typeof res.body.id === 'string' && res.body.id.startsWith('wq_'));
    assert.equal(res.body.message, 'Evaluation waitlist application successfully recorded.');
  } finally {
    global.fetch = originalFetch;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
});

test('Vercel handler: database failure returns 502', async () => {
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
    const req = createMockRequest({
      body: {
        name: 'Test User',
        email: 'test@example.com',
        accountSize: 100000,
        step: 'two-step',
        privacyConsent: true,
      },
    });
    const res = createMockResponse();

    await handler(req, res);

    assert.equal(res.statusCode, 502);
    assert.equal(res.body.success, false);
    assert.equal(res.body.code, 'DATABASE_ERROR');
  } finally {
    global.fetch = originalFetch;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
});

test('Vercel handler: network failure returns 500', async () => {
  process.env.SUPABASE_URL = 'https://test.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

  const originalFetch = global.fetch;
  global.fetch = async () => {
    throw new Error('Network error');
  };

  try {
    const req = createMockRequest({
      body: {
        name: 'Test User',
        email: 'test@example.com',
        accountSize: 100000,
        step: 'two-step',
        privacyConsent: true,
      },
    });
    const res = createMockResponse();

    await handler(req, res);

    assert.equal(res.statusCode, 500);
    assert.equal(res.body.success, false);
    assert.equal(res.body.code, 'DATABASE_SERVICE_UNAVAILABLE');
  } finally {
    global.fetch = originalFetch;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
});

test('Vercel handler: duplicate database record returns 409', async () => {
  process.env.SUPABASE_URL = 'https://test.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: false,
    status: 409,
    text: async () => '{"code":"23505","message":"duplicate key value violates unique constraint"}',
    headers: new Headers(),
    redirected: false,
    statusText: 'Conflict',
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
    const req = createMockRequest({
      body: {
        name: 'Test User',
        email: 'duplicate@example.com',
        accountSize: 100000,
        step: 'two-step',
        privacyConsent: true,
      },
    });
    const res = createMockResponse();

    await handler(req, res);

    assert.equal(res.statusCode, 409);
    assert.equal(res.body.success, false);
    assert.equal(res.body.code, 'DUPLICATE_REGISTRATION');
    assert.equal(res.body.error, 'This email is already registered for the waitlist.');
  } finally {
    global.fetch = originalFetch;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
});

test('Vercel handler: concurrent submissions handled correctly', async () => {
  process.env.SUPABASE_URL = 'https://test.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

  let callCount = 0;
  const originalFetch = global.fetch;
  global.fetch = async () => {
    callCount++;
    if (callCount === 1) {
      return {
        ok: true,
        json: async () => [{ id: 'wq_first', email: 'concurrent@example.com' }],
      } as Response;
    }
    // Second call - duplicate
    return {
      ok: false,
      status: 409,
      text: async () => '{"code":"23505","message":"duplicate key value violates unique constraint"}',
      headers: new Headers(),
      redirected: false,
      statusText: 'Conflict',
      type: 'default',
      url: '',
      clone: () => ({}),
      body: null,
      bodyUsed: false,
      arrayBuffer: async () => new ArrayBuffer(0),
      blob: async () => new Blob(),
      formData: async () => new FormData(),
      json: async () => ({}),
    } as Response;
  };

  try {
    const payload = {
      name: 'Concurrent User',
      email: 'concurrent@example.com',
      accountSize: 100000,
      step: 'two-step',
      privacyConsent: true,
    };

    // Simulate concurrent requests
    const req1 = createMockRequest({ body: payload });
    const res1 = createMockResponse();
    const req2 = createMockRequest({ body: payload });
    const res2 = createMockResponse();

    await Promise.all([handler(req1, res1), handler(req2, res2)]);

    // One should succeed, one should fail with duplicate
    const successCount = [res1, res2].filter(r => r.statusCode === 201).length;
    const duplicateCount = [res1, res2].filter(r => r.statusCode === 409).length;

    assert.equal(successCount, 1);
    assert.equal(duplicateCount, 1);
  } finally {
    global.fetch = originalFetch;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  }
});

test('Vercel handler: array body rejected (treated as parsed)', async () => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_ANON_KEY;

  const req = createMockRequest({
    body: [{ name: 'Test', email: 'test@example.com' }],
  });
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.success, false);
  // Array is a defined value, treated as parsed body, fails type check
  assert.equal(res.body.code, 'INVALID_BODY_TYPE');
});

test('Vercel handler: string body rejected (treated as parsed)', async () => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_ANON_KEY;

  const req = createMockRequest({
    body: 'not an object',
  });
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.success, false);
  // String is a defined value, treated as parsed body, fails type check
  assert.equal(res.body.code, 'INVALID_BODY_TYPE');
});

test('Vercel handler: undefined body falls through to raw reading', async () => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_ANON_KEY;

  const req = createMockRequest({
    body: undefined,
    bodyRaw: '{}',
  });
  const res = createMockResponse();

  await handler(req, res);

  assert.equal(res.statusCode, 400);
  assert.equal(res.body.success, false);
  // undefined body falls through to raw reading, becomes {} after JSON.parse, fails validation
  assert.equal(res.body.code, 'VALIDATION_ERROR');
});