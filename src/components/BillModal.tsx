import React from 'react';
import { 
  X, 
  Printer, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  FileText, 
  Home, 
  Tag, 
  CheckCircle2, 
  Receipt
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/formatPrice';

export const BillModal: React.FC = () => {
  const {
    billModalOpen,
    setBillModalOpen,
    setCartOpen,
    setCheckoutOpen,
    setActiveTab,
    cart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartTotal,
    appliedCoupon,
    user
  } = useShop();

  if (!billModalOpen) return null;

  const handleCloseToHome = () => {
    setBillModalOpen(false);
    setCartOpen(false);
    setActiveTab('shop');
  };

  const handleProceedToCheckout = () => {
    setBillModalOpen(false);
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  // Indian GST 18% itemized breakdown calculation (prices are GST-inclusive)
  const netPayable = Math.max(0, cartSubtotal - discountAmount);
  const taxableAmount = Math.round((netPayable / 1.18) * 100) / 100;
  const totalTax = Math.round((netPayable - taxableAmount) * 100) / 100;
  const cgst = Math.round((totalTax / 2) * 100) / 100;
  const sgst = Math.round((totalTax / 2) * 100) / 100;

  const invoiceNumber = `BF-BILL-${Date.now().toString().slice(-6)}`;
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      {/* Click outside to return home */}
      <div className="fixed inset-0" onClick={handleCloseToHome} />

      <div 
        className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl text-zinc-100 z-10 my-auto print:bg-white print:text-black print:border-none print:shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header with Close Tag */}
        <div className="p-5 sm:p-6 border-b border-zinc-850 flex items-center justify-between bg-zinc-900/70 print:bg-white print:border-zinc-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black border border-zinc-800 flex items-center justify-center font-heading font-black text-white text-base">
              BF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-black text-lg text-white print:text-black">TAX INVOICE & ORDER BILL</h2>
                <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full border border-zinc-700">
                  Pre-Checkout
                </span>
              </div>
              <p className="text-xs text-zinc-400 print:text-zinc-600 font-mono">
                Official Descriptive Summary • BlackFits Luxury Streetwear
              </p>
            </div>
          </div>

          {/* Close Tag Button returning to Home */}
          <button
            onClick={handleCloseToHome}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all text-xs font-mono print:hidden"
            title="Close bill and return to shop"
          >
            <span>Close to Home</span>
            <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Invoice Meta Bar */}
        <div className="bg-zinc-900/40 border-b border-zinc-850 p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono print:bg-zinc-100 print:border-zinc-300 print:text-black">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase block">Invoice Reference</span>
            <span className="font-bold text-white print:text-black">{invoiceNumber}</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase block">Billing Date</span>
            <span className="text-zinc-300 print:text-black">{currentDate}</span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase block">Billed To</span>
            <span className="text-zinc-300 truncate block print:text-black">
              {user?.name || 'Valued Patron (Guest)'}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase block">Shipping Zone</span>
            <span className="text-emerald-400 font-semibold print:text-black">All India Standard</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Section 1: Selected Products */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-heading font-black tracking-wider uppercase text-zinc-300 flex items-center gap-2 print:text-black">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>Selected Products ({cart.reduce((s, i) => s + i.quantity, 0)} Units)</span>
              </h3>
              <span className="text-[11px] font-mono text-zinc-500">
                100% Combed Heavyweight Cotton
              </span>
            </div>

            <div className="space-y-2.5">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between gap-3 text-xs print:bg-white print:border-zinc-300"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-14 rounded-xl object-cover bg-zinc-800 border border-zinc-800"
                    />
                    <div>
                      <h4 className="font-heading font-bold text-white text-xs sm:text-sm print:text-black">
                        {item.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] font-mono text-zinc-400 print:text-zinc-600">
                        <span className="bg-zinc-800 print:bg-zinc-200 px-1.5 py-0.5 rounded text-zinc-300 print:text-black">
                          {item.fit}
                        </span>
                        <span>•</span>
                        <span>{item.gsm} GSM</span>
                        <span>•</span>
                        <span className="text-white font-bold print:text-black">Size: {item.size}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-[11px] text-zinc-500 print:text-zinc-600">
                      {formatPrice(item.price)} × {item.quantity}
                    </div>
                    <div className="font-heading font-black text-sm text-white print:text-black">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Detailed Tax & Charges Breakdown */}
          <div className="p-4 sm:p-5 bg-zinc-900/40 rounded-2xl border border-zinc-800/80 font-mono text-xs space-y-2.5 print:bg-zinc-50 print:border-zinc-300">
            <div className="flex items-center gap-2 text-zinc-300 font-heading font-bold uppercase text-[11px] border-b border-zinc-800 pb-2 print:border-zinc-300 print:text-black">
              <Receipt className="w-3.5 h-3.5 text-emerald-400" />
              <span>Descriptive Bill Breakdown</span>
            </div>

            <div className="flex justify-between text-zinc-400 print:text-zinc-700">
              <span>Gross Total (MRP Subtotal)</span>
              <span className="text-white font-bold print:text-black">{formatPrice(cartSubtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3 h-3" />
                  <span>Promo Code Savings {appliedCoupon ? `(${appliedCoupon.code})` : ''}</span>
                </span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-zinc-400 print:text-zinc-700">
              <span>Taxable Value (Before GST)</span>
              <span className="text-zinc-300 print:text-black">₹{taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between text-zinc-500 text-[11px]">
              <span>Central GST (CGST @ 9%)</span>
              <span>₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between text-zinc-500 text-[11px]">
              <span>State GST (SGST @ 9%)</span>
              <span>₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="flex justify-between text-zinc-400 print:text-zinc-700">
              <span>Standard Courier & Tamper-Proof Packaging</span>
              <span className={shippingFee === 0 ? 'text-emerald-400 font-bold' : 'text-white'}>
                {shippingFee === 0 ? 'FREE (Unlocked over ₹999)' : formatPrice(shippingFee)}
              </span>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-sm sm:text-base font-heading font-black print:border-zinc-300">
              <span className="text-white print:text-black">NET PAYABLE AMOUNT:</span>
              <span className="text-white text-lg sm:text-xl font-mono print:text-black">
                {formatPrice(cartTotal)}
              </span>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono text-right">
              * Inclusive of all applicable Indian taxes, packaging, and logistics.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-zinc-850 bg-zinc-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCloseToHome}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-mono text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-mono text-zinc-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
              title="Print Bill"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Bill</span>
            </button>
          </div>

          <button
            onClick={handleProceedToCheckout}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-zinc-950 font-heading font-black text-xs tracking-wider uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-white/10"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
