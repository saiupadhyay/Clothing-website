import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  Eye, 
  Star, 
  Check, 
  Flame,
  Sparkles
} from 'lucide-react';
import { Product, SizeType } from '../types';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/formatPrice';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setQuickViewProduct 
  } = useShop();

  const [hovered, setHovered] = useState(false);
  const [selectedQuickSize, setSelectedQuickSize] = useState<SizeType | null>(null);
  const [addedNotice, setAddedNotice] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const currentImage = hovered && product.images[1] ? product.images[1] : product.images[0];

  const handleQuickAdd = (size: SizeType, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedQuickSize(size);
    addToCart(product, size, 1);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1800);
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  const totalStock = product.sizes.reduce((sum, s) => sum + s.stock, 0);

  return (
    <div 
      className="group relative bg-zinc-900/40 rounded-2xl border border-zinc-800/80 hover:border-zinc-700/80 transition-all duration-300 flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-black/80"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top Media Container */}
      <div 
        onClick={() => setQuickViewProduct(product)}
        className="relative aspect-[4/5] bg-zinc-950 overflow-hidden cursor-pointer"
      >
        {/* Main Product Image */}
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Ambient Dark Gradient on bottom of image for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNewDrop && (
            <span className="inline-flex items-center gap-1 bg-white text-zinc-950 font-heading font-black text-[10px] px-2.5 py-0.5 rounded-full tracking-wider shadow-md">
              <Sparkles className="w-2.5 h-2.5" />
              NEW DROP
            </span>
          )}

          {product.isBestSeller && !product.isNewDrop && (
            <span className="inline-flex items-center gap-1 bg-amber-400 text-zinc-950 font-heading font-black text-[10px] px-2.5 py-0.5 rounded-full tracking-wider shadow-md">
              <Flame className="w-2.5 h-2.5 text-zinc-950" />
              BEST SELLER
            </span>
          )}

          <span className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-zinc-300 font-mono text-[10px] px-2 py-0.5 rounded-md font-semibold tracking-wide">
            {product.gsm} GSM
          </span>
        </div>

        {/* Top Right Wishlist & Quick View */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              isFavorited
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/50'
                : 'bg-zinc-950/70 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
            aria-label="Save to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="w-8 h-8 rounded-full bg-zinc-950/70 text-zinc-400 hover:text-white border border-zinc-800 flex items-center justify-center backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
            aria-label="Quick View"
            title="Inspect T-Shirt"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Size Select Strip (Visible on Desktop hover or Mobile tap) */}
        <div className="absolute bottom-3 inset-x-3 z-10 transition-all duration-300 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="bg-zinc-950/90 backdrop-blur-md border border-zinc-800 p-2 rounded-xl shadow-xl">
            <div className="text-[10px] font-mono text-zinc-400 mb-1.5 flex items-center justify-between">
              <span>QUICK ADD SIZE:</span>
              {totalStock < 10 && (
                <span className="text-amber-400">Low Stock</span>
              )}
            </div>
            <div className="flex items-center gap-1 justify-between">
              {product.sizes.map((s) => {
                const outOfStock = s.stock <= 0;
                return (
                  <button
                    key={s.size}
                    disabled={outOfStock}
                    onClick={(e) => handleQuickAdd(s.size, e)}
                    className={`flex-1 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                      outOfStock
                        ? 'opacity-30 cursor-not-allowed bg-zinc-900 text-zinc-600 line-through'
                        : 'bg-zinc-850 hover:bg-white hover:text-zinc-950 text-zinc-200 border border-zinc-750'
                    }`}
                  >
                    {s.size}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Added Feedback Toast */}
        {addedNotice && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20 transition-all animate-in fade-in">
            <div className="w-10 h-10 rounded-full bg-white text-zinc-950 flex items-center justify-center mb-2 shadow-lg">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
            <span className="text-xs font-mono font-bold tracking-widest uppercase">ADDED TO BAG</span>
            <span className="text-[11px] text-zinc-400 mt-0.5">Size {selectedQuickSize}</span>
          </div>
        )}
      </div>

      {/* Card Info Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Fit Badge & Rating */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-mono text-[11px] font-bold text-zinc-300 tracking-wider uppercase">
              {product.fit}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-zinc-400">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-zinc-600">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => setQuickViewProduct(product)}
            className="font-heading font-bold text-sm sm:text-base text-zinc-100 group-hover:text-white transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
            {product.subtitle}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="pt-2 border-t border-zinc-850 flex items-center justify-between">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-heading font-black text-base sm:text-lg text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-zinc-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-900/60 px-1.5 py-0.5 rounded">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          <button
            onClick={() => setQuickViewProduct(product)}
            className="px-3 py-1.5 rounded-lg bg-zinc-850 hover:bg-white hover:text-zinc-950 text-xs font-semibold text-zinc-200 border border-zinc-750 transition-all flex items-center gap-1"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Options</span>
          </button>
        </div>
      </div>
    </div>
  );
};
