import { describe, expect, it } from 'vitest';
import worker from '../src/index';

const env = {
  APP_ENV: 'test',
  DB: {} as D1Database,
  MEDIA_BUCKET: {} as R2Bucket
};

describe('worker critical routes', () => {
  it('returns health payload', async () => {
    const response = await worker.fetch(new Request('https://example.com/health'), env);
    const payload = (await response.json()) as { success: boolean; service: string; env: string };

    expect(response.status).toBe(200);
    expect(payload.success).toBe(true);
    expect(payload.service).toBe('toko-kue-api');
    expect(payload.env).toBe('test');
  });

  it('returns cors headers on preflight', async () => {
    const response = await worker.fetch(
      new Request('https://example.com/api/orders', { method: 'OPTIONS' }),
      env
    );

    expect(response.status).toBe(204);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('validates track order query requirements', async () => {
    const response = await worker.fetch(new Request('https://example.com/api/orders/track'), env);
    const payload = (await response.json()) as { success: boolean; error: string };

    expect(response.status).toBe(400);
    expect(payload.success).toBe(false);
    expect(payload.error).toBe('orderNumber and email are required');
  });

  it('returns not found for unknown routes', async () => {
    const response = await worker.fetch(new Request('https://example.com/api/unknown'), env);
    const payload = (await response.json()) as { success: boolean; error: string; path: string };

    expect(response.status).toBe(404);
    expect(payload.success).toBe(false);
    expect(payload.error).toBe('Route not found');
    expect(payload.path).toBe('/api/unknown');
  });
});
