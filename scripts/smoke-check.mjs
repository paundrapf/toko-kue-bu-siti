#!/usr/bin/env node

const baseUrl = (process.env.SMOKE_BASE_URL || '').trim().replace(/\/$/, '');
const orderNumber = (process.env.SMOKE_ORDER_NUMBER || '').trim();
const orderEmail = (process.env.SMOKE_ORDER_EMAIL || '').trim();
const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS || '15000');

let passes = 0;
let warnings = 0;
let failures = 0;

const usage = () => {
  console.log('Usage:');
  console.log('  SMOKE_BASE_URL=https://your-domain node scripts/smoke-check.mjs');
  console.log('Optional:');
  console.log('  SMOKE_ORDER_NUMBER=TK-...');
  console.log('  SMOKE_ORDER_EMAIL=customer@example.com');
  console.log('  SMOKE_TIMEOUT_MS=20000');
};

const report = (type, name, detail = '') => {
  const symbol = type === 'PASS' ? '[PASS]' : type === 'WARN' ? '[WARN]' : '[FAIL]';
  console.log(`${symbol} ${name}${detail ? ` - ${detail}` : ''}`);
};

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const request = async (path, init = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...init,
      signal: controller.signal
    });

    const text = await response.text();
    let json = null;
    if (text) {
      try {
        json = JSON.parse(text);
      } catch {
        json = null;
      }
    }

    return { response, json, text };
  } finally {
    clearTimeout(timer);
  }
};

const runCheck = async (name, run, optional = false) => {
  try {
    await run();
    passes += 1;
    report('PASS', name);
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown error';
    if (optional) {
      warnings += 1;
      report('WARN', name, detail);
      return;
    }
    failures += 1;
    report('FAIL', name, detail);
  }
};

const main = async () => {
  if (!baseUrl) {
    report('FAIL', 'Configuration', 'SMOKE_BASE_URL is required');
    usage();
    process.exit(1);
  }

  console.log(`Running smoke checks against ${baseUrl}`);

  await runCheck('GET /health', async () => {
    const { response, json } = await request('/health');
    assert(response.status === 200, `Expected 200, got ${response.status}`);
    assert(json && json.success === true, 'Expected success=true response');
  });

  await runCheck('OPTIONS /api/orders CORS', async () => {
    const { response } = await request('/api/orders', { method: 'OPTIONS' });
    assert(response.status === 204, `Expected 204, got ${response.status}`);
    const corsHeader = response.headers.get('access-control-allow-origin') || '';
    assert(corsHeader === '*' || corsHeader.includes('*'), 'CORS origin header missing wildcard');
  });

  await runCheck('GET /api/products', async () => {
    const { response, json } = await request('/api/products');
    assert(response.status === 200, `Expected 200, got ${response.status}`);
    assert(json && json.success === true, 'Expected success=true response');
    assert(Array.isArray(json.data), 'Expected data to be an array');
  });

  await runCheck('GET /api/settings', async () => {
    const { response, json } = await request('/api/settings');
    assert(response.status === 200, `Expected 200, got ${response.status}`);
    assert(json && json.success === true, 'Expected success=true response');
    assert(json && typeof json.data === 'object' && json.data !== null, 'Expected settings object payload');
  });

  await runCheck('GET /api/orders/track validation', async () => {
    const { response, json } = await request('/api/orders/track');
    assert(response.status === 400, `Expected 400, got ${response.status}`);
    assert(json && json.success === false, 'Expected success=false response');
  });

  if (orderNumber && orderEmail) {
    await runCheck(
      'GET /api/orders/track existing order',
      async () => {
        const query = new URLSearchParams({ orderNumber, email: orderEmail }).toString();
        const { response, json } = await request(`/api/orders/track?${query}`);
        assert(response.status === 200, `Expected 200, got ${response.status}`);
        assert(json && json.success === true, 'Expected success=true response');
        assert(json && json.data && json.data.orderNumber === orderNumber, 'Tracked order number mismatch');
      },
      true
    );
  } else if (orderNumber || orderEmail) {
    warnings += 1;
    report('WARN', 'Optional order tracking check', 'Set both SMOKE_ORDER_NUMBER and SMOKE_ORDER_EMAIL');
  } else {
    warnings += 1;
    report('WARN', 'Optional order tracking check', 'Skipped because no order credentials provided');
  }

  console.log('');
  console.log(`Summary: ${passes} passed, ${warnings} warnings, ${failures} failed`);

  if (failures > 0) {
    process.exit(1);
  }
};

main().catch((error) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  report('FAIL', 'Smoke check runtime', message);
  process.exit(1);
});
