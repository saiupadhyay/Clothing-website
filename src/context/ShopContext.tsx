import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  UserProfile, 
  Address, 
  FilterState, 
  SizeType, 
  FitType,
  OrderStatus,
  LookbookPost,
  CadImagesConfig 
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_USER, LOOKBOOK_POSTS } from '../data/mockProducts';
import { DEFAULT_CAD_IMAGES } from '../data/cadImages';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  user: UserProfile;
  activeTab: 'shop' | 'dashboard' | 'admin' | 'lookbook';
  setActiveTab: (tab: 'shop' | 'dashboard' | 'admin' | 'lookbook') => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  checkoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  selectedLookbook: LookbookPost | null;
  setSelectedLookbook: (post: LookbookPost | null) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  appliedCoupon: { code: string; percent: number } | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addToCart: (product: Product, size: SizeType, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  placeOrder: (orderPayload: {
    address: Address;
    paymentMethod: Order['paymentMethod'];
    shippingMethod: 'standard' | 'express' | 'overnight';
  }) => Order;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  // Admin actions
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  // Cart summary calculations
  cartSubtotal: number;
  discountAmount: number;
  shippingFee: number;
  cartTotal: number;
  totalCartItems: number;
  // CAD Visualizer Image config
  cadImages: CadImagesConfig;
  updateCadImages: (updates: Partial<CadImagesConfig>) => void;
  resetCadImages: () => void;
  // Brand Logo config
  brandLogo: string;
  updateBrandLogo: (logoUrl: string) => void;
  resetBrandLogo: () => void;
  // Lookbook / Community & Street Archive config
  lookbookPosts: LookbookPost[];
  addLookbookPost: (post: LookbookPost) => void;
  updateLookbookPost: (post: LookbookPost) => void;
  deleteLookbookPost: (id: string) => void;
  resetLookbookPosts: () => void;
}

const DEFAULT_FILTERS: FilterState = {
  search: '',
  fits: [],
  sizes: [],
  priceRange: [30, 80],
  sortBy: 'featured',
  inStockOnly: false,
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const normalizeFit = (rawFit: string): FitType => {
  if (rawFit === 'Plain' || rawFit === 'Standard') return 'Standard';
  if (rawFit === 'Boxy Fit' || rawFit === 'Boxy Cut' || rawFit === 'BoxyFit') return 'BoxyFit';
  if (rawFit === 'Gym Tshirt' || rawFit === 'Gym T-shirt' || rawFit === 'gym T-shirt' || rawFit === 'gym Tshirt') return 'Gym T-shirt';
  return 'Oversized';
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('bf_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        return parsed.map((p) => ({ ...p, fit: normalizeFit(p.fit as string) }));
      }
    } catch (e) {
      console.error('Error loading products from storage', e);
    }
    return INITIAL_PRODUCTS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bf_cart');
      if (saved) {
        const parsed: CartItem[] = JSON.parse(saved);
        return parsed.map((c) => ({ ...c, fit: normalizeFit(c.fit as string) }));
      }
    } catch (e) {}
    return [];
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('bf_wishlist');
    return saved ? JSON.parse(saved) : ['bf-01', 'bf-03'];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('bf_orders');
      if (saved) {
        const parsed: Order[] = JSON.parse(saved);
        return parsed.map((o) => ({
          ...o,
          items: o.items.map((i) => ({ ...i, fit: normalizeFit(i.fit as string) }))
        }));
      }
    } catch (e) {}
    return INITIAL_ORDERS;
  });

  // User Profile
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('bf_user');
      if (saved) {
        const parsed: UserProfile = JSON.parse(saved);
        return { ...parsed, preferredFit: normalizeFit(parsed.preferredFit as string) };
      }
    } catch (e) {}
    return INITIAL_USER;
  });

  // Modals and UI state
  const [activeTab, setActiveTab] = useState<'shop' | 'dashboard' | 'admin' | 'lookbook'>('shop');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedLookbook, setSelectedLookbook] = useState<LookbookPost | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);

  // CAD Visualizer custom images
  const [cadImages, setCadImages] = useState<CadImagesConfig>(() => {
    try {
      const saved = localStorage.getItem('bf_cad_images_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.front && parsed.back) {
          return { ...DEFAULT_CAD_IMAGES, ...parsed };
        }
      }
    } catch (e) {
      // fallback
    }
    return DEFAULT_CAD_IMAGES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('bf_cad_images_v2', JSON.stringify(cadImages));
    } catch (e) {
      console.warn('LocalStorage error saving cadImages:', e);
    }
  }, [cadImages]);

  const updateCadImages = (updates: Partial<CadImagesConfig>) => {
    setCadImages((prev) => ({ ...prev, ...updates }));
  };

  const resetCadImages = () => {
    setCadImages(DEFAULT_CAD_IMAGES);
    try {
      localStorage.removeItem('bf_cad_images_v2');
      localStorage.removeItem('bf_cad_images');
    } catch (e) {}
  };

  // Brand Logo state
  const [brandLogo, setBrandLogo] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('bf_brand_logo');
      if (saved) return saved;
    } catch (e) {}
    return '/images/logo.png';
  });

  useEffect(() => {
    try {
      localStorage.setItem('bf_brand_logo', brandLogo);
    } catch (e) {}
  }, [brandLogo]);

  const updateBrandLogo = (logoUrl: string) => {
    setBrandLogo(logoUrl);
  };

  const resetBrandLogo = () => {
    setBrandLogo('/images/logo.png');
    try {
      localStorage.removeItem('bf_brand_logo');
    } catch (e) {}
  };

  // Lookbook / Community & Street Archive state
  const [lookbookPosts, setLookbookPosts] = useState<LookbookPost[]>(() => {
    try {
      const saved = localStorage.getItem('bf_lookbook_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return LOOKBOOK_POSTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('bf_lookbook_posts', JSON.stringify(lookbookPosts));
    } catch (e) {
      console.warn('LocalStorage error saving lookbook:', e);
    }
  }, [lookbookPosts]);

  const addLookbookPost = (post: LookbookPost) => {
    setLookbookPosts((prev) => [post, ...prev]);
  };

  const updateLookbookPost = (updated: LookbookPost) => {
    setLookbookPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (selectedLookbook?.id === updated.id) {
      setSelectedLookbook(updated);
    }
  };

  const deleteLookbookPost = (id: string) => {
    setLookbookPosts((prev) => prev.filter((p) => p.id !== id));
    if (selectedLookbook?.id === id) {
      setSelectedLookbook(null);
    }
  };

  const resetLookbookPosts = () => {
    setLookbookPosts(LOOKBOOK_POSTS);
    try {
      localStorage.removeItem('bf_lookbook_posts');
    } catch (e) {}
  };

  // Persistence effects with defensive error boundaries
  useEffect(() => {
    try {
      localStorage.setItem('bf_products', JSON.stringify(products));
    } catch (e) {
      console.warn('LocalStorage quota exceeded for products. Attempting recovery...', e);
      try {
        // Fallback: save products with primary image only to stay under quota
        const trimmed = products.map((p) => ({
          ...p,
          images: p.images.slice(0, 2),
        }));
        localStorage.setItem('bf_products', JSON.stringify(trimmed));
      } catch (innerErr) {
        console.error('Failed to persist products to localStorage:', innerErr);
      }
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('bf_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('LocalStorage error saving cart:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('bf_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('LocalStorage error saving wishlist:', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('bf_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('LocalStorage error saving orders:', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('bf_user', JSON.stringify(user));
    } catch (e) {
      console.warn('LocalStorage error saving user:', e);
    }
  }, [user]);

  // Cart logic
  const addToCart = (product: Product, size: SizeType, quantity = 1) => {
    const itemId = `${product.id}-${size}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          name: product.name,
          price: product.price,
          fit: product.fit,
          size,
          image: product.images[0],
          quantity,
          gsm: product.gsm,
        },
      ];
    });
    setCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  // Wishlist logic
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Coupon
  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'BLACKFITS15' || clean === 'FIRSTDROP') {
      setAppliedCoupon({ code: clean, percent: 15 });
      return { success: true, message: 'Code applied! 15% discount activated.' };
    }
    if (clean === 'ONYX20') {
      setAppliedCoupon({ code: clean, percent: 20 });
      return { success: true, message: 'VIP Code applied! 20% discount activated.' };
    }
    if (clean === 'BLACK10') {
      setAppliedCoupon({ code: clean, percent: 10 });
      return { success: true, message: 'Code applied! 10% discount activated.' };
    }
    return { success: false, message: 'Invalid or expired promo code.' };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  // Totals calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? Math.round((cartSubtotal * appliedCoupon.percent) / 100) : 0;
  // Free shipping over Rs. 999
  const shippingFee = cartSubtotal >= 999 || cartSubtotal === 0 ? 0 : 99;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + (cart.length > 0 ? shippingFee : 0));
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Checkout and place order
  const placeOrder = ({
    address,
    paymentMethod,
    shippingMethod,
  }: {
    address: Address;
    paymentMethod: Order['paymentMethod'];
    shippingMethod: 'standard' | 'express' | 'overnight';
  }): Order => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = `BF-${randomNum}`;
    const trackingNum = `BFX-${Math.floor(10000000 + Math.random() * 90000000)}US`;
    const today = new Date().toISOString().split('T')[0];

    const orderItems = cart.map((item) => ({
      productId: item.productId,
      name: item.name,
      size: item.size,
      fit: item.fit,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    const finalShipping = shippingMethod === 'overnight' ? 18 : shippingMethod === 'express' ? 10 : shippingFee;
    const finalTotal = Math.max(0, cartSubtotal - discountAmount + finalShipping);

    const newOrder: Order = {
      id: orderId,
      date: today,
      items: orderItems,
      subtotal: cartSubtotal,
      shipping: finalShipping,
      discount: discountAmount,
      total: finalTotal,
      status: 'Order Placed',
      shippingAddress: address,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      trackingNumber: trackingNum,
      carrier: 'Black Express Courier',
      estimatedDelivery: 'In 3-4 business days',
      trackingSteps: [
        {
          status: 'Order Placed',
          date: 'Just now',
          location: 'BLACKFITS Online Terminal',
          completed: true,
          current: true,
        },
        {
          status: 'Quality Check & Packing',
          date: 'Scheduled',
          location: 'Obsidian Vault 01, NY',
          completed: false,
        },
        {
          status: 'Dispatched',
          date: 'Scheduled',
          location: 'Regional Sorting Facility',
          completed: false,
        },
        {
          status: 'Out for Delivery',
          date: 'Scheduled',
          location: 'Destination Hub',
          completed: false,
        },
        {
          status: 'Delivered',
          date: 'Scheduled',
          location: address.street,
          completed: false,
        },
      ],
    };

    // Update product stock counts
    setProducts((prev) =>
      prev.map((prod) => {
        const itemOrdered = cart.find((c) => c.productId === prod.id);
        if (!itemOrdered) return prod;
        return {
          ...prod,
          sizes: prod.sizes.map((s) =>
            s.size === itemOrdered.size ? { ...s, stock: Math.max(0, s.stock - itemOrdered.quantity) } : s
          ),
        };
      })
    );

    // Add to orders
    setOrders((prev) => [newOrder, ...prev]);

    // Clear cart
    clearCart();
    setAppliedCoupon(null);

    return newOrder;
  };

  // User profile
  const updateProfile = (profile: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...profile }));
  };

  const addAddress = (newAddr: Omit<Address, 'id'>) => {
    const id = `addr-${Date.now()}`;
    setUser((prev) => ({
      ...prev,
      addresses: [...prev.addresses, { ...newAddr, id }],
    }));
  };

  const deleteAddress = (id: string) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((a) => a.id !== id),
    }));
  };

  const setDefaultAddress = (id: string) => {
    setUser((prev) => ({
      ...prev,
      addresses: prev.addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    }));
  };

  // Admin Actions
  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const stepsOrder: OrderStatus[] = [
          'Order Placed',
          'Quality Check & Packing',
          'Dispatched',
          'Out for Delivery',
          'Delivered',
        ];
        const statusIdx = stepsOrder.indexOf(status);

        const updatedSteps = order.trackingSteps.map((step) => {
          const stepIdx = stepsOrder.indexOf(step.status);
          const isDone = statusIdx >= stepIdx;
          const isCurrent = status === step.status;
          return {
            ...step,
            completed: isDone,
            current: isCurrent,
            date: isDone && step.date === 'Scheduled' ? 'Updated' : step.date,
          };
        });

        return {
          ...order,
          status,
          trackingSteps: updatedSteps,
        };
      })
    );
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        user,
        activeTab,
        setActiveTab,
        cartOpen,
        setCartOpen,
        checkoutOpen,
        setCheckoutOpen,
        quickViewProduct,
        setQuickViewProduct,
        selectedLookbook,
        setSelectedLookbook,
        filters,
        setFilters,
        resetFilters,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        placeOrder,
        updateProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        cartSubtotal,
        discountAmount,
        shippingFee,
        cartTotal,
        totalCartItems,
        cadImages,
        updateCadImages,
        resetCadImages,
        brandLogo,
        updateBrandLogo,
        resetBrandLogo,
        lookbookPosts,
        addLookbookPost,
        updateLookbookPost,
        deleteLookbookPost,
        resetLookbookPosts,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};
