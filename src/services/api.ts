import { Product, LookbookPost, Order, OrderStatus, UserProfile } from '../types';

const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return 'https://blackfits.onrender.com/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE = getApiBaseUrl();

const TOKEN_KEY = 'bf_auth_token';

export const authStorage = {
  getToken: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setToken: (token: string): void => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {}
  },
  clearToken: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
  }
};

const getHeaders = (isJson = true): Record<string, string> => {
  const headers: Record<string, string> = {};
  if (isJson) {
    headers['Content-Type'] = 'application/json';
  }
  const token = authStorage.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Resilient fetch wrapper with automatic retries for cold-start delays and transient network drops on Render.
 */
const fetchWithRetry = async (
  url: string,
  options: RequestInit = {},
  retries = 2,
  delayMs = 2500
): Promise<Response> => {
  let lastError: any = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (err: any) {
      lastError = err;
      const isNetworkError =
        err instanceof TypeError ||
        err.name === 'AbortError' ||
        err.message?.toLowerCase().includes('fetch') ||
        err.message?.toLowerCase().includes('network');

      if (attempt < retries && isNetworkError) {
        console.warn(
          `[BlackFits API] Connection attempt ${attempt + 1}/${retries + 1} to ${url} failed (likely cold start). Retrying in ${delayMs / 1000}s...`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
      throw err;
    }
  }
  throw lastError || new Error('Network request failed');
};

export const api = {
  // --- HEALTH CHECK & PRE-WARM ---
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      const data = await res.json();
      return data.status === 'ONLINE';
    } catch {
      return false;
    }
  },

  // --- AUTHENTICATION ---
  async login(credentials: { email: string; password: string }): Promise<{ token: string; user: UserProfile }> {
    try {
      const res = await fetchWithRetry(
        `${API_BASE}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        },
        2,
        2500
      );
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Login failed. Invalid credentials.');
      }
      authStorage.setToken(json.token);
      return json;
    } catch (err: any) {
      if (err.message?.toLowerCase().includes('fetch') || err instanceof TypeError) {
        throw new Error('Cloud database server is waking up from idle. Please wait 10 seconds and try again.');
      }
      throw err;
    }
  },

  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    preferredFit?: string;
    preferredSize?: string;
    adminPasscode?: string;
  }): Promise<{ token: string; user: UserProfile }> {
    try {
      const res = await fetchWithRetry(
        `${API_BASE}/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        },
        2,
        2500
      );
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Registration failed.');
      }
      authStorage.setToken(json.token);
      return json;
    } catch (err: any) {
      if (err.message?.toLowerCase().includes('fetch') || err instanceof TypeError) {
        throw new Error('Cloud database server is waking up from idle. Please wait 10 seconds and try again.');
      }
      throw err;
    }
  },

  async getMe(): Promise<UserProfile | null> {
    const token = authStorage.getToken();
    if (!token) return null;
    try {
      const res = await fetchWithRetry(`${API_BASE}/auth/me`, {
        headers: getHeaders()
      });
      if (!res.ok) {
        authStorage.clearToken();
        return null;
      }
      const json = await res.json();
      return json.user;
    } catch {
      return null;
    }
  },

  logout(): void {
    authStorage.clearToken();
  },

  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    const res = await fetchWithRetry(`${API_BASE}/products`, {}, 2, 2000);
    if (!res.ok) throw new Error('Failed to fetch products');
    const json = await res.json();
    return (json.data || []).map((p: any) => ({
      ...p,
      id: p._id || p.id
    }));
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetchWithRetry(`${API_BASE}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to create product');
    const json = await res.json();
    return { ...json.data, id: json.data._id || json.data.id };
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const res = await fetchWithRetry(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to update product');
    const json = await res.json();
    return { ...json.data, id: json.data._id || json.data.id };
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetchWithRetry(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete product');
  },

  // --- LOOKBOOK / STREET ARCHIVE ---
  async getLookbook(): Promise<LookbookPost[]> {
    const res = await fetchWithRetry(`${API_BASE}/lookbook`, {}, 2, 2000);
    if (!res.ok) throw new Error('Failed to fetch lookbook');
    const json = await res.json();
    return (json.data || []).map((p: any) => ({
      ...p,
      id: p._id || p.id
    }));
  },

  async createLookbookPost(post: Partial<LookbookPost>): Promise<LookbookPost> {
    const res = await fetchWithRetry(`${API_BASE}/lookbook`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(post)
    });
    if (!res.ok) throw new Error('Failed to create lookbook post');
    const json = await res.json();
    return { ...json.data, id: json.data._id || json.data.id };
  },

  async updateLookbookPost(id: string, post: Partial<LookbookPost>): Promise<LookbookPost> {
    const res = await fetchWithRetry(`${API_BASE}/lookbook/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(post)
    });
    if (!res.ok) throw new Error('Failed to update lookbook post');
    const json = await res.json();
    return { ...json.data, id: json.data._id || json.data.id };
  },

  async deleteLookbookPost(id: string): Promise<void> {
    const res = await fetchWithRetry(`${API_BASE}/lookbook/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete lookbook post');
  },

  // --- ORDERS ---
  async getOrders(): Promise<Order[]> {
    const res = await fetchWithRetry(`${API_BASE}/orders`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    const json = await res.json();
    return (json.data || []).map((o: any) => ({
      ...o,
      id: o.orderNumber || o._id || o.id
    }));
  },

  async createOrder(orderPayload: any): Promise<Order> {
    const res = await fetchWithRetry(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderPayload)
    });
    if (!res.ok) throw new Error('Failed to create order');
    const json = await res.json();
    return { ...json.data, id: json.data.orderNumber || json.data._id || json.data.id };
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const res = await fetchWithRetry(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update order status');
    const json = await res.json();
    return json.data;
  },

  // --- CLOUDINARY IMAGE UPLOADS ---
  async uploadImage(file: File): Promise<{ url: string; publicId: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const token = authStorage.getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetchWithRetry(`${API_BASE}/upload/single`, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Image upload failed');
    }

    const json = await res.json();
    return {
      url: json.url,
      publicId: json.publicId
    };
  }
};
