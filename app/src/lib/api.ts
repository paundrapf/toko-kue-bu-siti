import type { BlogPost, Order, Product, SiteSettings } from '@/types';

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

export const updateOrderStatusApi = async (
  orderId: string,
  status: Order['status'],
  notes?: string
): Promise<Order> => {
  return requestJson<Order>(`/api/orders/${encodeURIComponent(orderId)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, notes })
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

export const fetchAdminProductsApi = async (): Promise<Product[]> => {
  return requestJson<Product[]>('/api/products');
};

export const createAdminProductApi = async (product: Partial<Product>): Promise<{ id: string }> => {
  return requestJson<{ id: string }>('/api/products', {
    method: 'POST',
    body: JSON.stringify({ product })
  });
};

export const updateAdminProductApi = async (productId: string, product: Partial<Product>): Promise<{ id: string }> => {
  return requestJson<{ id: string }>(`/api/products/${encodeURIComponent(productId)}`, {
    method: 'PUT',
    body: JSON.stringify({ product })
  });
};

export const deleteAdminProductApi = async (productId: string): Promise<{ id: string }> => {
  return requestJson<{ id: string }>(`/api/products/${encodeURIComponent(productId)}`, {
    method: 'DELETE'
  });
};

export const fetchAdminBlogPostsApi = async (): Promise<BlogPost[]> => {
  return requestJson<BlogPost[]>('/api/blog/posts');
};

export const createAdminBlogPostApi = async (post: Partial<BlogPost>): Promise<{ id: string }> => {
  return requestJson<{ id: string }>('/api/blog/posts', {
    method: 'POST',
    body: JSON.stringify({ post })
  });
};

export const updateAdminBlogPostApi = async (postId: string, post: Partial<BlogPost>): Promise<{ id: string }> => {
  return requestJson<{ id: string }>(`/api/blog/posts/${encodeURIComponent(postId)}`, {
    method: 'PUT',
    body: JSON.stringify({ post })
  });
};

export const deleteAdminBlogPostApi = async (postId: string): Promise<{ id: string }> => {
  return requestJson<{ id: string }>(`/api/blog/posts/${encodeURIComponent(postId)}`, {
    method: 'DELETE'
  });
};

export interface ApiSiteSettings extends Record<string, unknown> {
  bankAccounts: Array<{
    id?: string;
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  }>;
}

export const getSiteSettingsApi = async (): Promise<ApiSiteSettings> => {
  return requestJson<ApiSiteSettings>('/api/settings');
};

export const updateSiteSettingsApi = async (settings: Partial<SiteSettings> & Record<string, unknown>): Promise<ApiSiteSettings> => {
  return requestJson<ApiSiteSettings>('/api/settings', {
    method: 'PUT',
    body: JSON.stringify({ settings })
  });
};

export const sendTestNotificationApi = async (
  channel: 'whatsapp' | 'email',
  target: string,
  message: string,
  subject?: string
): Promise<{ channel: string; target: string }> => {
  return requestJson<{ channel: string; target: string }>('/api/notifications/test', {
    method: 'POST',
    body: JSON.stringify({ channel, target, message, subject })
  });
};
