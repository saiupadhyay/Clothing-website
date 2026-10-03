import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ShoppingBag, 
  ShieldCheck, 
  Ruler, 
  Check, 
  Truck, 
  Sparkles,
  HelpCircle,
  RotateCcw,
  Star,
  MapPin,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { SizeType } from '../types';
import { formatPrice } from '../utils/formatPrice';

export const ProductDetailModal: React.FC = () => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    setCheckoutOpen
  } = useShop();

  const product = quickViewProduct;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<SizeType>('L');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState<'features' | 'care' | 'reviews'>('features');

  // Pincode Delivery Estimator
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<{ checked: boolean; valid: boolean; message: string } | null>(null);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pincode.trim();
    if (!/^\d{6}$/.test(clean)) {
      setPincodeStatus({
        checked: true,
        valid: false,
        message: 'Please enter a valid 6-digit Indian PIN code',
      });
      return;
    }
    const days = clean.startsWith('4') || clean.startsWith('1') || clean.startsWith('5') ? '2-3 days' : '3-4 days';
    setPincodeStatus({
      checked: true,
      valid: true,
      message: `Express delivery to ${clean} in ${days} • Free shipping & Cash on Delivery available`,
    });
  };

  // Fit recommender inputs
  const [calcHeight, setCalcHeight] = useState('5\'10" (178 cm)');
  const [calcWeight, setCalcWeight] = useState('175 lbs (79 kg)');
  const [calcPreference, setCalcPreference] = useState<'Standard' | 'Oversized Street'>('Oversized Street');

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const currentSizeStock = product.sizes.find((s) => s.size === selectedSize)?.stock || 0;

  const handleAddToCart = () => {
    if (currentSizeStock <= 0) return;
    addToCart(product, selectedSize, quantity);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      setQuickViewProduct(null);
    }, 1200);
  };

  const handleBuyNow = () => {
    if (currentSizeStock <= 0) return;
    addToCart(product, selectedSize, quantity);
    setQuickViewProduct(null);
    setCheckoutOpen(true);
  };

  const getRecommendedSize = (): SizeType => {
    if (calcPreference === 'Oversized Street') {
      if (calcWeight.includes('140') || calcWeight.includes('150')) return 'M';
      if (calcWeight.includes('175') || calcWeight.includes('180')) return 'XL';
      if (calcWeight.includes('200')) return 'XXL';
      return 'L';
    }
    return 'M';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl my-auto text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Media Column */}
          <div className="bg-zinc-900 p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800">
            {/* Main Preview Image */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-black mb-4">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono border border-zinc-800 text-zinc-200">
                {product.gsm} GSM OBSIDIAN
              </div>
            </div>

            {/* Thumbnails row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === idx 
                      ? 'border-white scale-105' 
                      : 'border-zinc-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Product Details Column */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5 max-h-[85vh] overflow-y-auto">
            <div>
              {/* Fit Badge & Category */}
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-2">
                <span className="uppercase tracking-widest text-zinc-300 font-bold bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800">
                  {product.fit}
                </span>
                <span className="text-zinc-500">STYLE #{product.id.toUpperCase()}</span>
              </div>

              {/* Title & Price */}
              <h2 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight leading-tight">
                {product.name}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                {product.subtitle}
              </p>

              <div className="flex items-baseline gap-3 mt-3 flex-wrap">
                <span className="text-2xl font-heading font-black text-white">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-zinc-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-900/60 px-2 py-0.5 rounded">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                )}
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-900/60 px-2 py-0.5 rounded">
                  In Stock & Ready to Ship
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
              {product.description}
            </p>

            {/* SIZE SELECTOR WITH LIVE STOCK */}
            <div className="space-y-2 pt-2 border-t border-zinc-850">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-zinc-300 font-semibold flex items-center gap-1.5">
                  <span>SELECT SIZE:</span>
                  <span className="text-white font-bold">{selectedSize}</span>
                </span>

                <button
                  onClick={() => setSizeGuideOpen(!sizeGuideOpen)}
                  className="text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1 text-[11px] underline underline-offset-4"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>{sizeGuideOpen ? 'Hide Fit Calculator' : 'Fit Recommender & Specs'}</span>
                </button>
              </div>

              {/* Size Buttons */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {product.sizes.map((s) => {
                  const outOfStock = s.stock <= 0;
                  const isSelected = selectedSize === s.size;
                  return (
                    <button
                      key={s.size}
                      disabled={outOfStock}
                      onClick={() => setSelectedSize(s.size)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold transition-all relative border ${
                        outOfStock
                          ? 'opacity-30 cursor-not-allowed bg-zinc-900 text-zinc-600 line-through border-zinc-850'
                          : isSelected
                          ? 'bg-white text-zinc-950 border-white shadow-md'
                          : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-650'
                      }`}
                    >
                      {s.size}
                      {s.stock > 0 && s.stock <= 5 && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Stock Notice */}
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-0.5">
                <span>
                  {currentSizeStock > 5
                    ? 'Available in Vault stock'
                    : currentSizeStock > 0
                    ? `⚠️ Only ${currentSizeStock} left in size ${selectedSize}!`
                    : 'Out of stock in this size'}
                </span>
                <span className="text-zinc-500">True to Streetwear Drape</span>
              </div>
            </div>

            {/* INTERACTIVE SIZE & FIT RECOMMENDER */}
            {sizeGuideOpen && (
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    INTELLIGENT FIT RECOMMENDER
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">BLACKFITS AI</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 block mb-1">YOUR HEIGHT</label>
                    <select
                      value={calcHeight}
                      onChange={(e) => setCalcHeight(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs p-1.5 rounded-lg"
                    >
                      <option>5'6" (167 cm)</option>
                      <option>5'8" (173 cm)</option>
                      <option>5'10" (178 cm)</option>
                      <option>6'0" (183 cm)</option>
                      <option>6'2" (188 cm)+</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 block mb-1">YOUR WEIGHT</label>
                    <select
                      value={calcWeight}
                      onChange={(e) => setCalcWeight(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs p-1.5 rounded-lg"
                    >
                      <option>140 lbs (64 kg)</option>
                      <option>160 lbs (72 kg)</option>
                      <option>175 lbs (79 kg)</option>
                      <option>195 lbs (88 kg)</option>
                      <option>215 lbs+ (98 kg+)</option>
                    </select>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 block">RECOMMENDED FOR YOU:</span>
                    <span className="font-heading font-black text-white text-sm">
                      SIZE {getRecommendedSize()} ({product.fit})
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedSize(getRecommendedSize())}
                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-200 rounded border border-zinc-700"
                  >
                    Select Size {getRecommendedSize()}
                  </button>
                </div>
              </div>
            )}

            {/* PINCODE DELIVERY CHECKER */}
            <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-zinc-300 font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>DELIVERY TIMELINE CHECKER</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Pan-India Dispatch</span>
              </div>

              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Indian PIN (e.g. 400001)"
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white font-mono"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-xs font-mono font-bold text-white rounded-xl transition-colors border border-zinc-700"
                >
                  Check
                </button>
              </form>

              {pincodeStatus && (
                <div className={`text-[11px] font-mono p-2 rounded-lg flex items-start gap-1.5 ${
                  pincodeStatus.valid ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/50' : 'bg-rose-950/40 text-rose-300 border border-rose-800/50'
                }`}>
                  {pincodeStatus.valid ? <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> : <X className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />}
                  <span>{pincodeStatus.message}</span>
                </div>
              )}
            </div>

            {/* SPECIFICATION TABS */}
            <div className="pt-2 border-t border-zinc-850 space-y-2.5">
              <div className="flex border-b border-zinc-800 text-xs font-mono">
                <button
                  onClick={() => setActiveDetailTab('features')}
                  className={`pb-2 px-2.5 font-bold transition-colors border-b-2 -mb-px ${
                    activeDetailTab === 'features' ? 'text-white border-white' : 'text-zinc-500 border-transparent hover:text-zinc-300'
                  }`}
                >
                  Features & Fit
                </button>
                <button
                  onClick={() => setActiveDetailTab('care')}
                  className={`pb-2 px-2.5 font-bold transition-colors border-b-2 -mb-px ${
                    activeDetailTab === 'care' ? 'text-white border-white' : 'text-zinc-500 border-transparent hover:text-zinc-300'
                  }`}
                >
                  Fabric & Wash Care
                </button>
                <button
                  onClick={() => setActiveDetailTab('reviews')}
                  className={`pb-2 px-2.5 font-bold transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${
                    activeDetailTab === 'reviews' ? 'text-white border-white' : 'text-zinc-500 border-transparent hover:text-zinc-300'
                  }`}
                >
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>Reviews ({product.reviewsCount})</span>
                </button>
              </div>

              {activeDetailTab === 'features' && (
                <ul className="space-y-1 text-xs text-zinc-300 font-sans">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 mt-1.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeDetailTab === 'care' && (
                <div className="space-y-2 text-xs text-zinc-300 font-sans">
                  <p><strong className="text-white font-mono">Composition:</strong> {product.material} ({product.gsm} GSM)</p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-400 pt-1">
                    <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                      • Cold machine wash (30°C) inside out
                    </div>
                    <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                      • Tumble dry low or air dry in shade
                    </div>
                    <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                      • Warm iron on reverse (do not iron print)
                    </div>
                    <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                      • Pre-shrunk with industrial steam (0% shrink)
                    </div>
                  </div>
                </div>
              )}

              {activeDetailTab === 'reviews' && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 p-2 bg-zinc-900/60 rounded-xl border border-zinc-800">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                    <span className="font-heading font-black text-white">{product.rating} / 5.0</span>
                    <span className="text-[11px] font-mono text-zinc-400">• Verified BlackFits Owners</span>
                  </div>

                  <div className="space-y-2 pt-1 text-xs">
                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                        <span className="font-bold text-white">Arjun M. (Mumbai)</span>
                        <span className="text-emerald-400 font-mono text-[10px]">Verified Buyer</span>
                      </div>
                      <p className="text-zinc-300 text-[11px]">
                        "The collar stiffness is insane. Washed 5 times and zero sag. 280 GSM gives that heavy streetwear boxy drape perfectly."
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-850">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                        <span className="font-bold text-white">Kabir S. (Bengaluru)</span>
                        <span className="text-emerald-400 font-mono text-[10px]">Verified Buyer</span>
                      </div>
                      <p className="text-zinc-300 text-[11px]">
                        "True obsidian pitch black. Looks very luxurious with silver chains and cargo pants. Definitely ordering two more."
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quantity & CTA */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                {/* Quantity adjuster */}
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(currentSizeStock, quantity + 1))}
                    className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add To Cart Button */}
                <button
                  disabled={currentSizeStock <= 0}
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-3 rounded-xl font-heading font-black text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 border ${
                    addedNotice
                      ? 'bg-emerald-500 text-zinc-950 border-emerald-400'
                      : currentSizeStock <= 0
                      ? 'bg-zinc-850 text-zinc-500 cursor-not-allowed border-zinc-800'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>ADDED TO BAG</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{currentSizeStock <= 0 ? 'OUT OF STOCK' : `ADD TO BAG`}</span>
                    </>
                  )}
                </button>

                {/* 1-Click Express BUY NOW Button */}
                <button
                  disabled={currentSizeStock <= 0}
                  onClick={handleBuyNow}
                  className={`flex-1 py-3 px-3 rounded-xl font-heading font-black text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 shadow-xl ${
                    currentSizeStock <= 0
                      ? 'opacity-40 cursor-not-allowed bg-zinc-800 text-zinc-500'
                      : 'bg-white text-zinc-950 hover:bg-zinc-200'
                  }`}
                >
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>BUY NOW</span>
                </button>

                {/* Wishlist toggle */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all flex-shrink-0 ${
                    isFavorited
                      ? 'bg-rose-600 border-rose-500 text-white'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400 pt-2 border-t border-zinc-900 font-mono">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Free shipping on orders &gt; Rs. 999</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                  <span>30-Day Noir Guarantee</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
