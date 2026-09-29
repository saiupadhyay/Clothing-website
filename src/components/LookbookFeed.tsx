import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  ArrowUpRight, 
  X,
  Sparkles
} from 'lucide-react';
import { InstagramIcon } from './SocialIcons';
import { useShop } from '../context/ShopContext';
import { LookbookPost, FitType } from '../types';
import { formatPrice } from '../utils/formatPrice';

const FIT_TABS: { label: string; value: 'All' | FitType }[] = [
  { label: 'All Fits', value: 'All' },
  { label: 'Oversized', value: 'Oversized' },
  { label: 'BoxyFit', value: 'BoxyFit' },
  { label: 'Standard', value: 'Standard' },
  { label: 'Gym T-shirt', value: 'Gym T-shirt' },
];

export const LookbookFeed: React.FC = () => {
  const { 
    lookbookPosts,
    selectedLookbook, 
    setSelectedLookbook, 
    products, 
    addToCart, 
    setQuickViewProduct 
  } = useShop();

  const [selectedFitFilter, setSelectedFitFilter] = useState<'All' | FitType>('All');

  const handleShopLook = (post: LookbookPost) => {
    setSelectedLookbook(post);
  };

  const filteredPosts = selectedFitFilter === 'All'
    ? lookbookPosts
    : lookbookPosts.filter((post) => post.fitTag === selectedFitFilter);

  const linkedProduct = selectedLookbook
    ? products.find((p) => p.id === selectedLookbook.productId) || products[0]
    : null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-zinc-900">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono mb-1">
            <InstagramIcon className="w-3.5 h-3.5 text-zinc-300" />
            <span>@BLACKFITS.OFFICIAL ON INSTAGRAM</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            COMMUNITY & STREET ARCHIVE
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-lg">
            Styled in Tokyo, Berlin, and NYC. Tag <span className="text-zinc-200 font-mono">#BlackFitsDiscipline</span> to be featured in the nocturnal feed.
          </p>
        </div>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors self-start sm:self-auto"
        >
          <span>Follow @blackfits.official</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Fit Type Showcase Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 bg-zinc-900/60 p-2 sm:p-2.5 rounded-2xl border border-zinc-800 backdrop-blur-sm">
        <div className="flex items-center gap-2 pl-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider font-bold">
            Showcase By Fit Type:
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {FIT_TABS.map((tab) => {
            const isSelected = selectedFitFilter === tab.value;
            const count = tab.value === 'All'
              ? lookbookPosts.length
              : lookbookPosts.filter((p) => p.fitTag === tab.value).length;

            return (
              <button
                key={tab.value}
                onClick={() => setSelectedFitFilter(tab.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20'
                    : 'bg-zinc-950/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected ? 'bg-zinc-950/20 text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Lookbook Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPosts.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-zinc-900/30 border border-zinc-800 rounded-3xl space-y-3">
            <p className="text-sm font-mono text-zinc-300">
              No street snaps found under <strong className="text-amber-400">"{selectedFitFilter}"</strong> yet.
            </p>
            <button
              onClick={() => setSelectedFitFilter('All')}
              className="px-4 py-2 bg-white text-zinc-950 rounded-xl font-bold text-xs hover:bg-zinc-200 transition-colors"
            >
              Show All Fits
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => handleShopLook(post)}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-black border border-zinc-850 cursor-pointer shadow-lg hover:shadow-2xl hover:border-zinc-700 transition-all duration-300"
            >
              {/* Image */}
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />

              {/* Dark overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Top Fit Type Badge */}
              <div className="absolute top-3.5 left-3.5 z-10">
                <span className="bg-zinc-950/90 backdrop-blur-md border border-zinc-700/80 text-[10px] font-mono font-bold text-amber-400 px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span>{post.fitTag}</span>
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-4 inset-x-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-rose-400 font-mono">
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>{post.likes.toLocaleString()} likes</span>
                </div>

                <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                  "{post.caption}"
                </p>

                {/* Shop This Look Button */}
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 text-zinc-950 font-heading font-bold text-[11px] tracking-wide group-hover:bg-white transition-all shadow-md">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Shop The Fit</span>
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* SHOP THE LOOK MODAL */}
      {selectedLookbook && linkedProduct && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative text-zinc-100 grid grid-cols-1 sm:grid-cols-2">
            
            {/* Left: Lookbook image */}
            <div className="relative aspect-[4/5] bg-black">
              <img
                src={selectedLookbook.image}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-zinc-950/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono font-bold text-amber-400 border border-zinc-700/80 flex items-center gap-1.5 shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>{selectedLookbook.fitTag} FIT</span>
              </div>
            </div>

            {/* Right: Featured T-Shirt & Quick Add */}
            <div className="p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                    FEATURED IN POST
                  </span>
                  <button
                    onClick={() => setSelectedLookbook(null)}
                    className="text-zinc-500 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="font-heading font-black text-lg text-white mt-1 leading-snug">
                  {linkedProduct.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono uppercase bg-amber-400 text-zinc-950 px-2 py-0.5 rounded font-bold">
                    {selectedLookbook.fitTag}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    {linkedProduct.subtitle} • {linkedProduct.gsm} GSM
                  </span>
                </div>

                <div className="text-xl font-heading font-black text-white mt-2">
                  {formatPrice(linkedProduct.price)}
                </div>

                <p className="text-xs text-zinc-300 mt-3 leading-relaxed">
                  "{selectedLookbook.caption}"
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <button
                  onClick={() => {
                    addToCart(linkedProduct, 'L', 1);
                    setSelectedLookbook(null);
                  }}
                  className="w-full py-3 rounded-xl bg-white text-zinc-950 font-heading font-black text-xs tracking-wider uppercase hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Instant Add Size L to Bag</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedLookbook(null);
                    setQuickViewProduct(linkedProduct);
                  }}
                  className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 transition-colors"
                >
                  View All Sizes & Specs
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
