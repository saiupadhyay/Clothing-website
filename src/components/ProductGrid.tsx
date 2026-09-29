import React from 'react';
import { ProductCard } from './ProductCard';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';
import { SearchX, SlidersHorizontal } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const { products, filters, resetFilters } = useShop();

  // Apply filters
  const filteredProducts = products.filter((product: Product) => {
    // Search query matching title, subtitle, material, gsm, features
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchSub = product.subtitle.toLowerCase().includes(q);
      const matchFit = product.fit.toLowerCase().includes(q);
      const matchGsm = product.gsm.toString().includes(q);
      if (!matchName && !matchSub && !matchFit && !matchGsm) return false;
    }

    // Fit filter
    if (filters.fits.length > 0) {
      if (!filters.fits.includes(product.fit)) return false;
    }

    // Size filter
    if (filters.sizes.length > 0) {
      const hasAnySelectedSize = product.sizes.some(
        (s) => filters.sizes.includes(s.size) && s.stock > 0
      );
      if (!hasAnySelectedSize) return false;
    }

    // In Stock Only
    if (filters.inStockOnly) {
      const hasStock = product.sizes.some((s) => s.stock > 0);
      if (!hasStock) return false;
    }

    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filters.sortBy === 'price-asc') return a.price - b.price;
    if (filters.sortBy === 'price-desc') return b.price - a.price;
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    if (filters.sortBy === 'newest') return (b.isNewDrop ? 1 : 0) - (a.isNewDrop ? 1 : 0);
    return 0; // featured default order
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Product Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-14 h-14 rounded-full bg-zinc-850 flex items-center justify-center mx-auto mb-4 text-zinc-500">
            <SearchX className="w-7 h-7" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white mb-2">No Black Fits Match Your Filter</h3>
          <p className="text-zinc-400 text-sm mb-6">
            We couldn't find any heavyweight tees matching your active silhouette, size, or search combinations.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-full bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-200 transition-colors inline-flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </section>
  );
};
