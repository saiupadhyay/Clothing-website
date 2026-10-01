export type FitType = 'Standard' | 'Oversized' | 'BoxyFit' | 'Gym T-shirt';

export type SizeType = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL';

export interface CadImagesConfig {
  front: string;
  back: string;
  collar: string;
  texture: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  fit: FitType;
  gsm: number;
  material: string;
  description: string;
  features: string[];
  images: string[];
  sizes: {
    size: SizeType;
    stock: number;
  }[];
  isNewDrop?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewsCount: number;
  tag?: string;
}

export interface CartItem {
  id: string; // unique item id (productId + size)
  productId: string;
  name: string;
  price: number;
  fit: FitType;
  size: SizeType;
  image: string;
  quantity: number;
  gsm: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  size: SizeType;
  fit: FitType;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = 'Order Placed' | 'Quality Check & Packing' | 'Dispatched' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface OrderTrackingStep {
  status: OrderStatus;
  date: string;
  location: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  paymentMethod: 'Credit / Debit Card' | 'Razorpay / UPI' | 'Apple Pay / Google Pay' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  trackingSteps: OrderTrackingStep[];
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role?: 'customer' | 'admin';
  preferredFit: FitType;
  preferredSize: SizeType;
  addresses: Address[];
}

export interface LookbookPost {
  id: string;
  image: string;
  caption: string;
  likes: number;
  productName: string;
  productId: string;
  fitTag: FitType;
}

export interface FilterState {
  search: string;
  fits: FitType[];
  sizes: SizeType[];
  priceRange: [number, number];
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  inStockOnly: boolean;
}
