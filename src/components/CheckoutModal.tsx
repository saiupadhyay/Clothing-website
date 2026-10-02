import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Smartphone, 
  Banknote, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Truck, 
  Printer, 
  Sparkles, 
  MapPin, 
  Clock,
  Plus,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';
import { Address, Order } from '../types';
import { INITIAL_USER } from '../data/mockProducts';
import { formatPrice } from '../utils/formatPrice';

export const CheckoutModal: React.FC = () => {
  const {
    checkoutOpen,
    setCheckoutOpen,
    cart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartTotal,
    user,
    placeOrder,
    setActiveTab,
  } = useShop();

  const currentUser = user || INITIAL_USER;

  const [step, setStep] = useState<'shipping' | 'payment' | 'otp' | 'success'>('shipping');

  // Shipping details state
  const [selectedSavedAddrId, setSelectedSavedAddrId] = useState<string>(
    currentUser.addresses?.find((a) => a.isDefault)?.id || currentUser.addresses?.[0]?.id || 'custom'
  );

  const [customAddress, setCustomAddress] = useState<Omit<Address, 'id'>>({
    name: currentUser.name || '',
    street: currentUser.addresses?.[0]?.street || '',
    city: currentUser.addresses?.[0]?.city || 'Mumbai',
    state: currentUser.addresses?.[0]?.state || 'Maharashtra',
    postalCode: currentUser.addresses?.[0]?.postalCode || '400050',
    country: 'India',
    phone: currentUser.phone || '+91 98201 44520',
  });

  // Default shipping method is standard courier across all orders
  const shippingMethod: 'standard' | 'express' | 'overnight' = 'standard';

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('Credit / Debit Card');

  // Card details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('ALEX VANCE');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('888');

  // OTP simulation
  const [otpCode, setOtpCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  if (!checkoutOpen) return null;

  const currentAddress: Address =
    selectedSavedAddrId !== 'custom'
      ? currentUser.addresses?.find((a) => a.id === selectedSavedAddrId) || { ...customAddress, id: 'temp-id' }
      : { ...customAddress, id: 'custom-id' };

  const getShippingCost = () => {
    return shippingFee;
  };

  const finalTotal = Math.max(0, cartSubtotal - discountAmount + getShippingCost());

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffffff', '#a1a1aa', '#52525b', '#f59e0b'],
      });
    } catch (e) {
      // fallback if canvas-confetti environment issue
    }
  };

  const handleStartPayment = () => {
    if (paymentMethod === 'Credit / Debit Card') {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setStep('otp');
      }, 1000);
    } else {
      finalizeOrder();
    }
  };

  const finalizeOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const newOrder = placeOrder({
        address: currentAddress,
        paymentMethod,
        shippingMethod,
      });
      setConfirmedOrder(newOrder);
      setStep('success');
      triggerConfetti();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl text-zinc-100 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-850 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black border border-zinc-800 flex items-center justify-center font-heading font-black text-white text-base">
              BF
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-white">SECURE CHECKOUT</h2>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>256-Bit SSL Encrypted Terminal</span>
              </div>
            </div>
          </div>

          {step !== 'success' && (
            <button
              onClick={() => setCheckoutOpen(false)}
              className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Progress Tracker Steps (Hidden on Success) */}
        {step !== 'success' && (
          <div className="bg-zinc-950 px-6 py-3 border-b border-zinc-850 flex items-center justify-center gap-6 sm:gap-12 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 'shipping' ? 'bg-white text-zinc-950' : 'bg-emerald-400 text-zinc-950'
              }`}>
                1
              </span>
              <span className={step === 'shipping' ? 'text-white font-bold' : 'text-zinc-400'}>
                Delivery Destination
              </span>
            </div>

            <div className="w-12 sm:w-24 h-px bg-zinc-800" />

            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step === 'payment' || step === 'otp' ? 'bg-white text-zinc-950' : 'bg-zinc-800 text-zinc-400'
              }`}>
                2
              </span>
              <span className={step === 'payment' || step === 'otp' ? 'text-white font-bold' : 'text-zinc-400'}>
                Payment Gateway
              </span>
            </div>
          </div>
        )}

        {/* STEP 1: SHIPPING ADDRESS */}
        {step === 'shipping' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-heading font-bold text-base text-white mb-1">Select Delivery Address</h3>
              <p className="text-xs text-zinc-400 font-mono">Choose a saved Indian address or enter a new destination</p>
            </div>

            {/* Saved Addresses list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(currentUser.addresses || []).map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedSavedAddrId(addr.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                    selectedSavedAddrId === addr.id
                      ? 'bg-zinc-900 border-white shadow-md ring-1 ring-white'
                      : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedSavedAddrId === addr.id ? 'border-white bg-white text-zinc-950' : 'border-zinc-600'
                        }`}>
                          {selectedSavedAddrId === addr.id && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span className="font-heading font-bold text-sm text-white">{addr.name}</span>
                      </div>
                      {addr.isDefault && (
                        <span className="text-[9px] font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400">{addr.street}</p>
                    <p className="text-xs text-zinc-400">{addr.city}, {addr.state} {addr.postalCode}</p>
                  </div>
                  <p className="text-[11px] font-mono text-zinc-500 mt-2">{addr.phone}</p>
                </div>
              ))}

              {/* Custom Address option */}
              <div
                onClick={() => setSelectedSavedAddrId('custom')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-center items-center text-center ${
                  selectedSavedAddrId === 'custom'
                    ? 'bg-zinc-900 border-white shadow-md ring-1 ring-white'
                    : 'bg-zinc-900/20 border-zinc-800 border-dashed hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedSavedAddrId === 'custom' ? 'border-white bg-white text-zinc-950' : 'border-zinc-600'
                  }`}>
                    {selectedSavedAddrId === 'custom' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs font-bold text-white">Enter New Custom Address</span>
                </div>
                <p className="text-[11px] text-zinc-500">Deliver to a different destination across India</p>
              </div>
            </div>

            {/* If Custom Address selected, show form inputs */}
            {selectedSavedAddrId === 'custom' && (
              <div className="space-y-3 p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800 text-xs">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <span className="font-heading font-bold text-xs uppercase text-zinc-200">New Delivery Destination</span>
                  <span className="text-[10px] font-mono text-zinc-500">India Shipping Only</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Recipient Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Vance"
                      value={customAddress.name}
                      onChange={(e) => setCustomAddress({ ...customAddress, name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Contact Phone *</label>
                    <input
                      type="text"
                      placeholder="+91 98201 44520"
                      value={customAddress.phone}
                      onChange={(e) => setCustomAddress({ ...customAddress, phone: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Street Address / Flat / Floor *</label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 402, Obsidian Heights, Bandra West"
                      value={customAddress.street}
                      onChange={(e) => setCustomAddress({ ...customAddress, street: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">City *</label>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai"
                      value={customAddress.city}
                      onChange={(e) => setCustomAddress({ ...customAddress, city: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">State *</label>
                    <input
                      type="text"
                      placeholder="e.g. Maharashtra"
                      value={customAddress.state}
                      onChange={(e) => setCustomAddress({ ...customAddress, state: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">PIN / Postal Code *</label>
                    <input
                      type="text"
                      placeholder="e.g. 400050"
                      maxLength={6}
                      value={customAddress.postalCode}
                      onChange={(e) => setCustomAddress({ ...customAddress, postalCode: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Country</label>
                    <input
                      type="text"
                      disabled
                      value="India"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-zinc-400 cursor-not-allowed font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Default Standard Courier Notice */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-zinc-850 flex items-center justify-center text-zinc-300">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-xs text-white">Standard Courier Dispatch</span>
                    <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded uppercase font-bold">
                      Default
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">All-India delivery in 3–4 business days with carbon tracking</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                </span>
              </div>
            </div>

            {/* Navigation CTA */}
            <div className="flex justify-end pt-4 border-t border-zinc-850">
              <button
                onClick={() => {
                  if (selectedSavedAddrId === 'custom') {
                    if (!customAddress.name.trim() || !customAddress.street.trim() || !customAddress.city.trim() || !customAddress.state.trim() || !customAddress.postalCode.trim()) {
                      alert('Please fill in all required address fields before proceeding.');
                      return;
                    }
                  }
                  setStep('payment');
                }}
                className="px-6 py-3 rounded-xl bg-white text-zinc-950 font-heading font-black text-xs tracking-wider uppercase hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-lg"
              >
                <span>Proceed to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PAYMENT GATEWAY INTEGRATION */}
        {step === 'payment' && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-heading font-bold text-base text-white mb-1">Select Payment Gateway</h3>
              <p className="text-xs text-zinc-400 font-mono">Fully integrated with instant simulated verification</p>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'Credit / Debit Card', label: 'Cards (3DS)', icon: CreditCard },
                { id: 'Razorpay / UPI', label: 'UPI / QR Scan', icon: QrCode },
                { id: 'Apple Pay / Google Pay', label: 'Apple / G-Pay', icon: Smartphone },
                { id: 'Cash on Delivery', label: 'Cash On Hand', icon: Banknote },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-zinc-100 text-zinc-950 border-white shadow-md'
                        : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="truncate">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* VIEW 1: Credit / Debit Card Interactive Visualizer */}
            {paymentMethod === 'Credit / Debit Card' && (
              <div className="space-y-4">
                {/* 3D Black Luxury Card Preview */}
                <div className="relative aspect-[1.8/1] max-w-sm mx-auto rounded-2xl p-5 bg-gradient-to-tr from-black via-zinc-900 to-zinc-800 border border-zinc-700/80 shadow-2xl flex flex-col justify-between overflow-hidden">
                  {/* Card sheen & chip */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-7 rounded bg-gradient-to-r from-amber-200 to-amber-400 opacity-90 shadow-inner flex items-center justify-center">
                      <div className="w-8 h-5 border border-amber-900/40 rounded-sm" />
                    </div>
                    <span className="font-heading font-black text-xs tracking-widest text-zinc-400">
                      BLACKFITS OBSIDIAN CARD
                    </span>
                  </div>

                  {/* Card Number */}
                  <div className="font-mono text-base sm:text-lg tracking-widest text-white text-center font-bold">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>

                  {/* Card Bottom Details */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-300">
                    <div>
                      <div className="text-[8px] text-zinc-500 uppercase">Cardholder</div>
                      <div className="font-bold tracking-wider">{cardHolder || 'ALEX VANCE'}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-zinc-500 uppercase">Expires</div>
                      <div className="font-bold">{cardExpiry || '08/29'}</div>
                    </div>
                  </div>
                </div>

                {/* Card input fields */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-zinc-900/40 p-4 rounded-2xl border border-zinc-850">
                  <div className="col-span-2">
                    <label className="text-[10px] font-mono text-zinc-400 block mb-1">Card Number (Live Format)</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white font-mono uppercase"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white font-mono text-center"
                      />
                    </div>
                    <div className="w-16">
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white font-mono text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: Razorpay / UPI QR Scan Simulation */}
            {paymentMethod === 'Razorpay / UPI' && (
              <div className="p-6 bg-zinc-900/60 rounded-2xl border border-zinc-800 flex flex-col items-center text-center space-y-3">
                <div className="w-40 h-40 bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center">
                  {/* Dynamic simulated QR representation */}
                  <div className="w-full h-full bg-zinc-950 rounded-lg flex flex-col items-center justify-center p-2 text-center">
                    <QrCode className="w-20 h-20 text-white" />
                    <span className="text-[8px] font-mono text-zinc-400 mt-1">UPI: blackfits@icici</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="font-heading font-bold text-sm text-white">Scan with Any UPI App</div>
                  <p className="text-xs text-zinc-400 font-mono">Google Pay, PhonePe, Paytm, or CRED</p>
                  <span className="inline-block bg-zinc-800 text-amber-400 text-[10px] font-mono px-2 py-0.5 rounded">
                    Session active for 04:45
                  </span>
                </div>
              </div>
            )}

            {/* VIEW 3: Apple Pay / Google Pay */}
            {paymentMethod === 'Apple Pay / Google Pay' && (
              <div className="p-6 bg-zinc-900/60 rounded-2xl border border-zinc-800 flex flex-col items-center text-center space-y-3">
                <Smartphone className="w-12 h-12 text-zinc-300" />
                <h4 className="font-heading font-bold text-sm text-white">Biometric One-Touch Authentication</h4>
                <p className="text-xs text-zinc-400 max-w-sm">
                  Click 'Authorize Payment' to trigger your device's biometric TouchID / FaceID wallet confirmation.
                </p>
              </div>
            )}

            {/* VIEW 4: Cash on Delivery */}
            {paymentMethod === 'Cash on Delivery' && (
              <div className="p-6 bg-zinc-900/60 rounded-2xl border border-zinc-800 flex flex-col items-center text-center space-y-3">
                <Banknote className="w-12 h-12 text-emerald-400" />
                <h4 className="font-heading font-bold text-sm text-white">Inspect & Pay in Cash</h4>
                <p className="text-xs text-zinc-400 max-w-sm">
                  You can inspect the 280 GSM fabric weight before handing cash to the courier. Please keep exact change ready.
                </p>
              </div>
            )}

            {/* Price Recap & Submit CTA */}
            <div className="pt-4 border-t border-zinc-850 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-zinc-400 block">TOTAL TO PAY:</span>
                <span className="font-heading font-black text-xl text-white">{formatPrice(finalTotal)}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep('shipping')}
                  className="px-4 py-2 text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Back
                </button>

                <button
                  disabled={isProcessing}
                  onClick={handleStartPayment}
                  className="px-6 py-3 rounded-xl bg-white text-zinc-950 font-heading font-black text-xs tracking-wider uppercase hover:bg-zinc-200 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isProcessing ? 'Verifying Gateway...' : `Authorize ${formatPrice(finalTotal)}`}</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* STEP 3.5: 3D SECURE OTP SIMULATION */}
        {step === 'otp' && (
          <div className="p-8 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-amber-400">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-bold text-lg text-white">3D Secure Bank Verification</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                We sent a simulated 6-digit confirmation code to your linked phone (+1 •••• ••9012) for transaction authorization.
              </p>
              <div className="pt-2">
                <span className="font-mono text-xs bg-zinc-900 border border-zinc-700 px-3 py-1 rounded text-zinc-200">
                  Demo Test Code: <strong className="text-amber-400">948123</strong>
                </span>
              </div>
            </div>

            <div className="max-w-xs mx-auto space-y-3">
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                className="w-full text-center tracking-widest text-lg font-mono bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-white"
              />

              <button
                disabled={isProcessing}
                onClick={finalizeOrder}
                className="w-full py-3 rounded-xl bg-white text-zinc-950 font-heading font-black text-xs tracking-wider uppercase hover:bg-zinc-200 transition-all"
              >
                {isProcessing ? 'Verifying with Bank...' : 'Submit & Complete Order'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ORDER CONFIRMED CELEBRATION */}
        {step === 'success' && confirmedOrder && (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center mx-auto shadow-2xl">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                PAYMENT CONFIRMED & DISPATCHED TO VAULT
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
                WELCOME TO THE OBSIDIAN DISCIPLINE
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                Order <strong className="text-white">#{confirmedOrder.id}</strong> has been secured.
              </p>
            </div>

            {/* Tracking Summary Card */}
            <div className="max-w-md mx-auto bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 text-left space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <span className="font-mono text-zinc-400">Carrier:</span>
                <span className="text-white font-bold">{confirmedOrder.carrier}</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <span className="font-mono text-zinc-400">Tracking Number:</span>
                <span className="font-mono text-amber-400">{confirmedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <span className="font-mono text-zinc-400">Destination:</span>
                <span className="text-white truncate max-w-[200px]">{confirmedOrder.shippingAddress.street}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-zinc-400">Total Charged:</span>
                <span className="font-heading font-black text-white text-sm">{formatPrice(confirmedOrder.total)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setCheckoutOpen(false);
                  setActiveTab('dashboard');
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-zinc-950 font-heading font-black text-xs tracking-wider uppercase hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
              >
                <span>Track Live In Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowInvoiceModal(true)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-200 transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>View Tax Invoice</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Printable Invoice Modal */}
      {showInvoiceModal && confirmedOrder && (
        <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-white text-zinc-950 max-w-lg w-full rounded-2xl p-6 space-y-4 font-mono text-xs">
            <div className="flex justify-between items-start border-b border-zinc-300 pb-3">
              <div>
                <h3 className="font-black text-base tracking-widest">BLACKFITS CORP</h3>
                <p className="text-[10px] text-zinc-600">TAX INVOICE / RECEIPT</p>
                <p className="text-[10px] text-zinc-600">GST/EIN: US-99482103</p>
              </div>
              <button onClick={() => setShowInvoiceModal(false)} className="text-zinc-600 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <p className="font-bold">INVOICE TO:</p>
                <p>{confirmedOrder.shippingAddress.name}</p>
                <p>{confirmedOrder.shippingAddress.street}</p>
                <p>{confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.postalCode}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">ORDER ID: {confirmedOrder.id}</p>
                <p>DATE: {confirmedOrder.date}</p>
                <p>METHOD: {confirmedOrder.paymentMethod}</p>
                <p className="text-emerald-700 font-bold">STATUS: PAID</p>
              </div>
            </div>

            <table className="w-full border-t border-zinc-300 pt-2 text-[10px]">
              <thead>
                <tr className="border-b border-zinc-300 text-left">
                  <th className="py-1">ITEM</th>
                  <th>FIT/SIZE</th>
                  <th>QTY</th>
                  <th className="text-right">PRICE</th>
                </tr>
              </thead>
              <tbody>
                {confirmedOrder.items.map((i, idx) => (
                  <tr key={idx} className="border-b border-zinc-200">
                    <td className="py-1.5">{i.name}</td>
                    <td>{i.fit} / {i.size}</td>
                    <td>{i.quantity}</td>
                    <td className="text-right">{formatPrice(i.price * i.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="space-y-1 text-right border-t border-zinc-300 pt-2 text-[11px]">
              <div>Subtotal: {formatPrice(confirmedOrder.subtotal)}</div>
              <div>Shipping: {formatPrice(confirmedOrder.shipping)}</div>
              <div>Discount: -{formatPrice(confirmedOrder.discount)}</div>
              <div className="font-bold text-sm text-black">TOTAL PAID: {formatPrice(confirmedOrder.total)}</div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-black text-white rounded font-bold hover:bg-zinc-800"
              >
                Print Official Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
