import React, { useState } from 'react';
import { 
  Package, 
  User, 
  MapPin, 
  Heart, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ExternalLink, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  ChevronRight,
  X 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order, SizeType, FitType, Address } from '../types';
import { INITIAL_USER } from '../data/mockProducts';
import { formatPrice } from '../utils/formatPrice';

export const UserDashboard: React.FC = () => {
  const { 
    orders, 
    user, 
    isAuthenticated,
    isAdmin,
    setAuthModalOpen,
    setAuthMode,
    setAdminLoginIntent,
    logout,
    updateProfile, 
    addAddress, 
    deleteAddress, 
    setDefaultAddress,
    wishlist,
    products,
    addToCart,
    setActiveTab,
    setQuickViewProduct
  } = useShop();

  const currentUser = user || INITIAL_USER;

  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'profile' | 'addresses' | 'wishlist'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Profile Form state initialized safely from currentUser
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [preferredFit, setPreferredFit] = useState<FitType>(currentUser.preferredFit);
  const [preferredSize, setPreferredSize] = useState<SizeType>(currentUser.preferredSize);
  const [profileSavedFeedback, setProfileSavedFeedback] = useState(false);

  // Synchronize form fields whenever authenticated user session updates
  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
      setPreferredFit(user.preferredFit || 'Oversized');
      setPreferredSize(user.preferredSize || 'L');
    }
  }, [user]);

  // Address modal form
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('');
  const [newAddrZip, setNewAddrZip] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');

  const handleCopyTracking = (trackNum: string) => {
    navigator.clipboard.writeText(trackNum);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      phone,
      preferredFit,
      preferredSize
    });
    setProfileSavedFeedback(true);
    setTimeout(() => setProfileSavedFeedback(false), 2500);
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet || !newAddrCity) return;
    addAddress({
      name: newAddrName || `${currentUser.name} (Address)`,
      street: newAddrStreet,
      city: newAddrCity,
      state: newAddrState || 'NY',
      postalCode: newAddrZip,
      country: 'United States',
      phone: newAddrPhone || currentUser.phone,
      isDefault: false
    });
    setShowAddAddress(false);
    setNewAddrName('');
    setNewAddrStreet('');
    setNewAddrCity('');
    setNewAddrState('');
    setNewAddrZip('');
    setNewAddrPhone('');
  };

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Auth Status Notification Banner */}
      {!isAuthenticated ? (
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shadow-xl">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  GUEST SESSION DETECTED
                </span>
                <span className="text-[10px] font-mono text-zinc-600">•</span>
                <span className="text-[10px] font-mono text-zinc-400">PREVIEW MODE</span>
              </div>
              <p className="text-xs text-zinc-300 mt-0.5">
                Sign in to your BlackFits account or create one to save personal fit profiles, sync orders to MongoDB, and access VIP courier tracking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAdminLoginIntent(false);
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-heading font-black text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In / Register</span>
            </button>
          </div>
        </div>
      ) : isAdmin ? (
        <div className="bg-gradient-to-r from-amber-950/30 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shadow-xl">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  EXECUTIVE ADMIN ACTIVE
                </span>
                <span className="text-[10px] font-mono text-zinc-600">•</span>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold">ROOT ACCESS</span>
              </div>
              <p className="text-xs text-zinc-300 mt-0.5">
                Logged in as master administrator ({user?.email}). You have authorized access to the BlackFits Store Command Portal.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('admin')}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-heading font-black text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-1.5 self-start sm:self-auto"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Open Admin Panel</span>
          </button>
        </div>
      ) : null}

      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
            OBSIDIAN MEMBER TERMINAL
          </span>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight mt-0.5">
            WELCOME BACK, {currentUser.name.toUpperCase()}
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Preferred Fit: <span className="text-white font-bold">{currentUser.preferredFit}</span> • Preferred Size: <span className="text-white font-bold">{currentUser.preferredSize}</span>
          </p>
        </div>

        {/* Quick action: Return to shop or Sign out */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isAuthenticated && (
            <button
              onClick={logout}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-rose-950/30 border border-zinc-800 hover:border-rose-800 text-xs font-mono text-rose-400 transition-colors"
            >
              Sign Out
            </button>
          )}
          <button
            onClick={() => setActiveTab('shop')}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-xs font-mono text-zinc-200 transition-colors flex items-center gap-1.5"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tab Navigation Strip */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-zinc-850 no-scrollbar">
        {[
          { id: 'orders', label: 'Order History & Live Tracking', icon: Package, badge: orders.length },
          { id: 'profile', label: 'Profile & Fit Preferences', icon: User },
          { id: 'addresses', label: 'Saved Delivery Addresses', icon: MapPin, badge: currentUser.addresses?.length || 0 },
          { id: 'wishlist', label: 'Saved Wishlist', icon: Heart, badge: wishlist.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-white text-zinc-950 border-white shadow-md'
                  : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-zinc-950 text-white' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ORDER TRACKING & HISTORY */}
      {activeSubTab === 'orders' && (
        <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Orders List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">YOUR PAST & ACTIVE ORDERS</h3>
            {orders.length === 0 ? (
              <div className="p-8 bg-zinc-900/30 rounded-2xl border border-zinc-800 text-center">
                <Package className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-xs text-zinc-400">No orders yet. Start your obsidian collection today.</p>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedOrder?.id === ord.id
                      ? 'bg-zinc-900 border-white ring-1 ring-white shadow-lg'
                      : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-heading font-black text-sm text-white">ORDER #{ord.id}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      ord.status === 'Delivered'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {ord.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-xs text-zinc-400 flex items-center justify-between">
                    <span>{ord.date}</span>
                    <span className="font-heading font-bold text-white">{formatPrice(ord.total)} ({ord.items.length} items)</span>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-hidden mt-3 pt-2 border-t border-zinc-800/80">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="w-8 h-10 rounded bg-zinc-950 border border-zinc-800 overflow-hidden flex-shrink-0">
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <span className="text-[11px] text-zinc-500 font-mono ml-auto">
                      View Timeline →
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Column: Live Order Tracking Timeline View */}
          <div className="lg:col-span-7">
            {selectedOrder ? (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
                
                {/* Order Top Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                      LIVE TRACKING TELEMETRY
                    </span>
                    <h3 className="font-heading font-black text-xl text-white">
                      ORDER #{selectedOrder.id}
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">
                      Estimated Arrival: <strong className="text-emerald-400">{selectedOrder.estimatedDelivery}</strong>
                    </p>
                  </div>

                  {/* Tracking Number copy box */}
                  <div className="bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl flex items-center gap-2">
                    <div>
                      <span className="text-[9px] font-mono text-zinc-500 block uppercase">Carrier Tracking</span>
                      <span className="font-mono text-xs text-zinc-200">{selectedOrder.trackingNumber}</span>
                    </div>
                    <button
                      onClick={() => handleCopyTracking(selectedOrder.trackingNumber)}
                      className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"
                      title="Copy Tracking Number"
                    >
                      {copiedTracking ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Animated Vertical Tracking Timeline */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                    JOURNEY MILESTONES
                  </h4>

                  <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
                    {selectedOrder.trackingSteps.map((step, idx) => (
                      <div key={idx} className="relative flex items-start gap-4">
                        {/* Milestone dot */}
                        <div className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                          step.completed
                            ? 'bg-emerald-400 border-zinc-950 text-zinc-950'
                            : step.current
                            ? 'bg-amber-400 border-white text-zinc-950 animate-pulse'
                            : 'bg-zinc-900 border-zinc-700 text-zinc-600'
                        }`}>
                          {step.completed && <Check className="w-3 h-3 stroke-[3]" />}
                          {step.current && !step.completed && <span className="w-2 h-2 rounded-full bg-zinc-950" />}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs sm:text-sm font-heading font-bold ${
                              step.completed ? 'text-white' : step.current ? 'text-amber-400 font-extrabold' : 'text-zinc-500'
                            }`}>
                              {step.status}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500">{step.date}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{step.location}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items in this Order */}
                <div className="space-y-3 pt-4 border-t border-zinc-800">
                  <h4 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                    ITEMS IN THIS PACKAGE ({selectedOrder.items.length})
                  </h4>

                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-850">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-14 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden">
                            <img src={item.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h5 className="font-heading font-bold text-xs sm:text-sm text-white">{item.name}</h5>
                            <span className="text-[10px] font-mono text-zinc-400">
                              Size {item.size} • {item.fit} • Qty {item.quantity}
                            </span>
                          </div>
                        </div>
                        <span className="font-heading font-black text-sm text-white">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Destination & Payment method recap */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-zinc-800 text-xs font-mono">
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-850">
                    <span className="text-zinc-500 text-[10px] block uppercase">Delivery Address</span>
                    <p className="text-zinc-300 font-bold mt-0.5">{selectedOrder.shippingAddress.name}</p>
                    <p className="text-zinc-400">{selectedOrder.shippingAddress.street}</p>
                    <p className="text-zinc-400">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                  </div>

                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-850">
                    <span className="text-zinc-500 text-[10px] block uppercase">Payment Method</span>
                    <p className="text-zinc-300 font-bold mt-0.5">{selectedOrder.paymentMethod}</p>
                    <p className="text-emerald-400">Payment Status: {selectedOrder.paymentStatus}</p>
                    <p className="text-zinc-400">Total Billed: {formatPrice(selectedOrder.total)}</p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-zinc-500">Select an order on the left to inspect its live status.</div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: PROFILE & PREFERENCES */}
      {activeSubTab === 'profile' && (
        <div className="py-6 max-w-2xl">
          <form onSubmit={handleSaveProfile} className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5">
            <div>
              <h3 className="font-heading font-black text-lg text-white">PERSONAL CREDENTIALS & SIZING</h3>
              <p className="text-xs text-zinc-400 font-mono">Customize your profile so recommendations and fit drapes match your body structure.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-mono text-zinc-400 block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="font-mono text-zinc-400 block mb-1">Account Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="font-mono text-zinc-400 block mb-1">Primary Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="font-mono text-zinc-400 block mb-1">Preferred Silhouette Cut</label>
                <select
                  value={preferredFit}
                  onChange={(e) => setPreferredFit(e.target.value as FitType)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white cursor-pointer"
                >
                  <option value="Standard">Standard (Classic Heavyweight)</option>
                  <option value="Oversized">Oversized (Dropped Shoulder)</option>
                  <option value="BoxyFit">BoxyFit (Cropped & Wide)</option>
                  <option value="Gym T-shirt">Gym T-shirt (Athletic Stretch)</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-zinc-400 block mb-1">Default Size</label>
                <select
                  value={preferredSize}
                  onChange={(e) => setPreferredSize(e.target.value as SizeType)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white cursor-pointer"
                >
                  {(['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'] as SizeType[]).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
              {profileSavedFeedback ? (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Profile & Sizing Updated!</span>
                </span>
              ) : <div />}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-white text-zinc-950 font-heading font-black text-xs tracking-wider uppercase hover:bg-zinc-200 transition-all shadow-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: SAVED DELIVERY ADDRESSES */}
      {activeSubTab === 'addresses' && (
        <div className="py-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white">YOUR SAVED LOCATIONS</h3>
            <button
              onClick={() => setShowAddAddress(true)}
              className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(currentUser.addresses || []).map((addr) => (
              <div key={addr.id} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-heading font-bold text-sm text-white">{addr.name}</span>
                    {addr.isDefault && (
                      <span className="text-[9px] font-mono bg-zinc-800 text-amber-400 px-1.5 py-0.5 rounded border border-zinc-700">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400">{addr.street}</p>
                  <p className="text-xs text-zinc-400">{addr.city}, {addr.state} {addr.postalCode}</p>
                  <p className="text-[11px] font-mono text-zinc-500 mt-1">{addr.phone}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-850">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-[11px] font-mono text-zinc-400 hover:text-white underline"
                    >
                      Make Default
                    </button>
                  ) : <span className="text-[10px] text-zinc-600 font-mono">Primary Delivery Destination</span>}

                  {(currentUser.addresses || []).length > 1 && (
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="text-zinc-500 hover:text-rose-400 p-1"
                      title="Delete Address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Address Modal Form */}
          {showAddAddress && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
              <form onSubmit={handleCreateAddress} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 max-w-md w-full space-y-4 text-xs">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <h4 className="font-heading font-bold text-sm text-white">Add Delivery Location</h4>
                  <button type="button" onClick={() => setShowAddAddress(false)} className="text-zinc-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Label (e.g. Studio, Loft)</label>
                  <input
                    type="text"
                    required
                    value={newAddrName}
                    onChange={(e) => setNewAddrName(e.target.value)}
                    placeholder="Loft 2B"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-zinc-400 block mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={newAddrStreet}
                    onChange={(e) => setNewAddrStreet(e.target.value)}
                    placeholder="400 Obsidian Way"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={newAddrCity}
                      onChange={(e) => setNewAddrCity(e.target.value)}
                      placeholder="New York"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Zip Code</label>
                    <input
                      type="text"
                      required
                      value={newAddrZip}
                      onChange={(e) => setNewAddrZip(e.target.value)}
                      placeholder="10001"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-colors"
                >
                  Save Address
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SAVED WISHLIST */}
      {activeSubTab === 'wishlist' && (
        <div className="py-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-white">SAVED OBSIDIAN PIECES ({wishlistProducts.length})</h3>
            <span className="text-xs font-mono text-zinc-400">Instant one-tap add to bag</span>
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="p-12 bg-zinc-900/30 rounded-3xl border border-zinc-800 text-center max-w-md mx-auto">
              <Heart className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
              <p className="text-xs text-zinc-400">You haven't favorited any tees yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {wishlistProducts.map((prod) => (
                <div key={prod.id} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-3 flex flex-col justify-between space-y-3">
                  <div className="aspect-[4/5] rounded-xl overflow-hidden bg-black cursor-pointer" onClick={() => setQuickViewProduct(prod)}>
                    <img src={prod.images[0]} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400">{prod.fit} • {prod.gsm} GSM</span>
                    <h5 className="font-heading font-bold text-xs sm:text-sm text-white line-clamp-1">{prod.name}</h5>
                    <span className="font-heading font-black text-sm text-white">{formatPrice(prod.price)}</span>
                  </div>
                  <button
                    onClick={() => addToCart(prod, currentUser.preferredSize || 'L', 1)}
                    className="w-full py-2 rounded-xl bg-white text-zinc-950 text-xs font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag (Size {currentUser.preferredSize || 'L'})</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
