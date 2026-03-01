import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createOrderApi,
  trackOrderApi,
  updateOrderStatusApi,
  uploadPaymentProofApi
} from './api';
import type { Order } from '@/types';

const sampleOrder: Order = {
  id: 'order-1',
  orderNumber: 'TK-20260301-123',
  customer: {
    fullName: 'Budi',
    email: 'budi@example.com',
    phone: '08123456789',
    address: 'Jl. Mawar 1',
    city: 'Bandung',
    postalCode: '40111',
    deliveryNotes: ''
  },
  items: [
    {
      id: 'item-1',
      productId: 'product-1',
      productName: 'Brownies Cokelat',
      variantName: 'Original',
      variantSize: 'Medium',
      quantity: 1,
      pricePerItem: 100000,
      subtotal: 100000,
      image: '/images/products/brownies-cokelat-1.jpg'
    }
  ],
  subtotal: 100000,
  shipping: 10000,
  discount: 0,
  total: 110000,
  orderType: 'Delivery',
  deliveryDate: '2026-03-03',
  deliveryTime: '10:00',
  paymentMethod: 'Bank Transfer',
  paymentStatus: 'Unpaid',
  status: 'Pending',
  statusHistory: [{ status: 'Pending', changedAt: '2026-03-01T10:00:00.000Z' }],
  adminNotes: '',
  createdAt: '2026-03-01T10:00:00.000Z',
  updatedAt: '2026-03-01T10:00:00.000Z'
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('api client critical flows', () => {
  it('creates order with expected payload and path', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: sampleOrder
        }),
        { status: 200 }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await createOrderApi(sampleOrder);

    expect(result.orderNumber).toBe(sampleOrder.orderNumber);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/orders',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ order: sampleOrder })
      })
    );
  });

  it('returns null when order tracking API fails', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          error: 'Order not found'
        }),
        { status: 404 }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const result = await trackOrderApi('TK-UNKNOWN', 'missing@example.com');

    expect(result).toBeNull();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/orders/track?orderNumber=TK-UNKNOWN&email=missing%40example.com',
      expect.any(Object)
    );
  });

  it('encodes order id when updating status', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: sampleOrder
        }),
        { status: 200 }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    await updateOrderStatusApi('order/with/slash', 'Confirmed', 'ok');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/orders/order%2Fwith%2Fslash/status',
      expect.objectContaining({ method: 'PATCH' })
    );
  });

  it('uploads payment proof as form data', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            key: 'payment-proofs/key.jpg',
            viewUrl: '/api/media/payment-proofs%2Fkey.jpg',
            contentType: 'image/jpeg',
            size: 12
          }
        }),
        { status: 200 }
      )
    );
    vi.stubGlobal('fetch', fetchMock);

    const file = new File(['dummy'], 'proof.jpg', { type: 'image/jpeg' });
    await uploadPaymentProofApi('order-1', file);

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = init.body as FormData;

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/orders/order-1/payment-proof',
      expect.objectContaining({ method: 'POST' })
    );
    expect(body.get('alt')).toBe('Bukti pembayaran untuk order-1');
    expect(body.get('file')).toBeInstanceOf(File);
  });
});
