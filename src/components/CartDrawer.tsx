import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Tag, 
  ShoppingBag,
  CreditCard,
  FileText
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/formatPrice';

export const CartDrawer: React.FC = () => {
  const {
    cartOpen,
    setCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setCheckoutOpen,
    setBillModalOpen,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!cartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback(res);
    if (res.success) setCouponInput('');
  };

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={() => setCartOpen(false)} />

      {/* Drawer Panel */}
      <div className="w-full max-w-md bg-zinc-950 border-l border-zinc-850 h-full flex flex-col justify-between shadow-2xl z-10 text-zinc-100">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-zinc-850 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-750 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-heading font-black text-lg text-white tracking-tight">YOUR BAG</h2>
              <p className="text-[11px] font-mono text-zinc-400">
                {cart.length === 0 ? 'Empty bag' : `${cart.length} distinct item(s)`}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCartOpen(false)}
            className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-zinc-900/60 px-5 py-3 border-b border-zinc-850">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {amountNeeded > 0 ? (
                <>Add <strong className="text-white">{formatPrice(amountNeeded)}</strong> for Free Express Delivery</>
              ) : (
                <span className="text-emerald-400 font-bold">Free Express Shipping Unlocked!</span>
              )}
            </span>
            <span className="text-zinc-500 font-bold">{progressPercent}%</span>
          </div>

          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                progressPercent === 100 ? 'bg-emerald-400' : 'bg-white'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="font-heading font-bold text-lg text-white">Your Bag is Empty</h3>
              <p className="text-xs text-zinc-400 max-w-xs">
                Explore the obsidian archive to add heavyweight black tees engineered for discipline.
              </p>
              <button
                onClick={() => setCartOpen(false)}
                className="mt-2 px-5 py-2.5 rounded-full bg-white text-zinc-950 font-heading font-bold text-xs tracking-wider uppercase hover:bg-zinc-200 transition-colors"
              >
                Browse Heavy Tees
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 bg-zinc-900/40 border border-zinc-850 p-3 rounded-2xl relative group"
              >
                {/* Item Thumbnail */}
                <div className="w-20 h-24 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-zinc-800">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-white line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-500 hover:text-rose-400 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono font-bold text-zinc-300 bg-zinc-850 px-1.5 py-0.5 rounded border border-zinc-750">
                        SIZE {item.size}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {item.fit}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {item.gsm} GSM
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-850">
                    <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white text-xs"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white text-xs"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-heading font-black text-sm text-white">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Checkout Actions & Summary */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-zinc-850 bg-zinc-950/95 space-y-4">
            
            {/* Promo code bar */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl text-xs">
                  <span className="font-mono text-emerald-400 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{appliedCoupon.code} applied (-{appliedCoupon.percent}%)</span>
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-zinc-500 hover:text-white text-xs underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-xl p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-amber-300">BLACKFITS15</span>
                          <span className="text-[9px] font-mono bg-amber-400 text-zinc-950 font-bold px-1.5 py-0.2 rounded">15% OFF</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 block">Valid on orders over Rs. 999</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const res = applyCoupon('BLACKFITS15');
                        setCouponFeedback(res);
                      }}
                      className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-mono font-bold text-[11px] rounded-lg transition-colors"
                    >
                      APPLY
                    </button>
                  </div>

                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Or enter custom promo code"
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-bold text-white rounded-xl border border-zinc-700 transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                </div>
              )}

              {couponFeedback && (
                <p className={`text-[10px] mt-1 font-mono ${couponFeedback.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {couponFeedback.message}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-zinc-400 font-mono">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">{formatPrice(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Promo Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Express Shipping</span>
                <span className={shippingFee === 0 ? 'text-emerald-400' : 'text-white'}>
                  {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-sm font-heading font-black text-white pt-2 border-t border-zinc-850">
                <span>ESTIMATED TOTAL</span>
                <span className="text-base">{formatPrice(cartTotal)}</span>
              </div>
            </div>

            {/* View Descriptive Bill / Generate Bill Option */}
            <button
              onClick={() => {
                setBillModalOpen(true);
              }}
              className="w-full py-2.5 px-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-xs font-mono text-zinc-300 hover:text-white transition-all flex items-center justify-between group shadow-sm"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="font-bold">View Descriptive Bill & Breakdown</span>
              </div>
              <span className="text-[10px] text-zinc-400 group-hover:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1 transition-colors">
                Generate Bill →
              </span>
            </button>

            {/* Checkout CTA */}
            <button
              onClick={() => {
                setCartOpen(false);
                setCheckoutOpen(true);
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-white text-zinc-950 font-heading font-black text-sm tracking-wider uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-white/10"
            >
              <CreditCard className="w-4 h-4" />
              <span>SECURE CHECKOUT • {formatPrice(cartTotal)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Badges */}
            <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-500 font-mono pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-zinc-400" />
                256-Bit Encrypted
              </span>
              <span>•</span>
              <span>Cards / G-Pay / Cash</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
