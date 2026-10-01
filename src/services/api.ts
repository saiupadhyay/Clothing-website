import { Product, LookbookPost, Order, OrderStatus } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  // --- HEALTH CHECK ---
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      const data = await res.json();
      return data.status === 'ONLINE';
    } catch {
      return false;
    }
  },

  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const json = await res.json();
    return (json.data || []).map((p: any) => ({
      ...p,
      id: p._id || p.id
    }));
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to create product');
    const json = await res.json();
    return { ...json.data, id: json.data._id || json.data.id };
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to update product');
    const json = await res.json();
    return { ...json.data, id: json.data._id || json.data.id };
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete product');
  },

  // --- LOOKBOOK / STREET ARCHIVE ---
  async getLookbook(): Promise<LookbookPost[]> {
    const res = await fetch(`${API_BASE}/lookbook`);
    if (!res.ok) throw new Error('Failed to fetch lookbook');
    const json = await res.json();
    return (json.data || []).map((p: any) => ({
      ...p,
      id: p._id || p.id
    }));
  },

  async createLookbookPost(post: Partial<LookbookPost>): Promise<LookbookPost> {
    const res = await fetch(`${API_BASE}/lookbook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });
    if (!res.ok) throw new Error('Failed to create lookbook post');
    const json = await res.json();
    return { ...json.data, id: json.data._id || json.data.id };
  },

  async updateLookbookPost(id: string, post: Partial<LookbookPost>): Promise<LookbookPost> {
    const res = await fetch(`${API_BASE}/lookbook/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });
    if (!res.ok) throw new Error('Failed to update lookbook post');
    const json = await res.json();
    return { ...json.data, id: json.data._id || json.data.id };
  },

  async deleteLookbookPost(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/lookbook/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete lookbook post');
  },

  // --- ORDERS ---
  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    const json = await res.json();
    return (json.data || []).map((o: any) => ({
      ...o,
      id: o.orderNumber || o._id || o.id
    }));
  },

  async createOrder(orderPayload: any): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    if (!res.ok) throw new Error('Failed to create order');
    const json = await res.json();
    return { ...json.data, id: json.data.orderNumber || json.data._id || json.data.id };
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
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

    const res = await fetch(`${API_BASE}/upload/single`, {
      method: 'POST',
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
