import type { Order } from '@/types';

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const makeUrl = (path: string): string => {
  if (baseUrl) {
    return `${baseUrl}${path}`;
  }
  return path;
};

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(makeUrl(path), {
    ...init,
    headers: {
      ...(init?.headers || {}),
      'Content-Type': 'application/json'
    }
  });

  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !payload.success) {
    const message = 'error' in payload ? payload.error : 'Request failed';
    throw new Error(message);
  }

  return payload.data;
}

async function requestFormData<T>(path: string, formData: FormData, init?: RequestInit): Promise<T> {
  const response = await fetch(makeUrl(path), {
    ...init,
    body: formData
  });

  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !payload.success) {
    const message = 'error' in payload ? payload.error : 'Request failed';
    throw new Error(message);
  }

  return payload.data;
}

export const createOrderApi = async (order: Order): Promise<Order> => {
  return requestJson<Order>('/api/orders', {
    method: 'POST',
    body: JSON.stringify({ order })
  });
};

export const trackOrderApi = async (orderNumber: string, email: string): Promise<Order | null> => {
  const query = new URLSearchParams({ orderNumber, email }).toString();
  try {
    return await requestJson<Order>(`/api/orders/track?${query}`);
  } catch {
    return null;
  }
};

export interface UploadedPaymentProof {
  key: string;
  viewUrl: string;
  contentType: string;
  size: number;
}

export const uploadPaymentProofApi = async (orderId: string, file: File): Promise<UploadedPaymentProof> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('alt', `Bukti pembayaran untuk ${orderId}`);

  return requestFormData<UploadedPaymentProof>(`/api/orders/${encodeURIComponent(orderId)}/payment-proof`, formData, {
    method: 'POST'
  });
};
