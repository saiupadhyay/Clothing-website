import React from 'react';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  Check, 
  ChevronDown
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { FitType, SizeType } from '../types';

const ALL_FITS: FitType[] = [
  'Standard',
  'Oversized',
  'BoxyFit',
  'Gym T-shirt'
];

const ALL_SIZES: SizeType[] = ['S', 'M', 'L', 'XL', 'XXL'];

export const FilterBar: React.FC = () => {
  const { filters, setFilters, resetFilters, products } = useShop();

  const toggleFit = (fit: FitType) => {
    setFilters((prev) => {
      const exists = prev.fits.includes(fit);
      return {
        ...prev,
        fits: exists ? prev.fits.filter((f) => f !== fit) : [...prev.fits, fit],
      };
    });
  };

  const toggleSize = (size: SizeType) => {
    setFilters((prev) => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size],
      };
    });
  };

  const hasActiveFilters = 
    filters.fits.length > 0 || 
    filters.sizes.length > 0 ||
    filters.search !== '' || 
    filters.inStockOnly;

  return (
    <div id="product-catalog" className="w-full bg-zinc-950/80 backdrop-blur-xl border-y border-zinc-800/80 sticky top-[68px] z-30 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Top Control Line: Section Header, Search, Sort & Reset */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-heading font-black text-white tracking-tight flex items-center gap-2">
              <span>BLACK T-SHIRTS</span>
              <span className="text-xs font-mono font-normal text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full">
                {products.length} STYLES
              </span>
            </h2>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-amber-400 hover:text-amber-300 font-mono flex items-center gap-1 bg-amber-950/40 border border-amber-800/50 px-2 py-1 rounded-md transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Right side controls: Search input & Sorting */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Quick Search */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                placeholder="Search tees..."
                className="w-full sm:w-44 pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
              />
            </div>

            {/* In Stock Only Checkbox */}
            <label className="flex items-center gap-1.5 text-xs text-zinc-300 cursor-pointer select-none bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 rounded-lg hover:border-zinc-700">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))}
                className="w-3.5 h-3.5 accent-white rounded"
              />
              <span className="hidden sm:inline">In Stock Only</span>
              <span className="sm:hidden">In Stock</span>
            </label>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                className="appearance-none bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 pl-3 pr-8 py-1.5 rounded-lg focus:outline-none focus:border-zinc-500 cursor-pointer"
              >
                <option value="featured">Featured Drops</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
                <option value="newest">Newest Releases</option>
              </select>
              <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* PROMINENT FIT FILTERS: Standard, Oversized, BoxyFit, Gym T-shirt */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
              <Filter className="w-3 h-3 text-zinc-400" />
              FILTER BY SILHOUETTE & FIT:
            </span>
            <span className="text-[11px] text-zinc-500">
              {filters.fits.length > 0 ? `${filters.fits.length} selected` : 'Showing all fits'}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {/* "All Fits" Pill */}
            <button
              onClick={() => setFilters((prev) => ({ ...prev, fits: [] }))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                filters.fits.length === 0
                  ? 'bg-white text-zinc-950 font-bold border-white shadow-sm'
                  : 'bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
              }`}
            >
              All Fits ({products.length})
            </button>

            {ALL_FITS.map((fit) => {
              const isSelected = filters.fits.includes(fit);
              const count = products.filter((p) => p.fit === fit).length;

              return (
                <button
                  key={fit}
                  onClick={() => toggleFit(fit)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-zinc-100 text-zinc-950 font-bold border-white shadow-sm'
                      : 'bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{fit}</span>
                  <span className={`text-[10px] px-1 rounded-full ${isSelected ? 'bg-zinc-300 text-zinc-900' : 'bg-zinc-800 text-zinc-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* PROMINENT SIZE FILTER STRIP */}
        <div className="flex items-center gap-2 pt-2 border-t border-zinc-850/60 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
          <span className="text-zinc-400 uppercase text-[11px] whitespace-nowrap mr-1">
            FILTER SIZE:
          </span>

          <button
            onClick={() => setFilters((prev) => ({ ...prev, sizes: [] }))}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
              filters.sizes.length === 0
                ? 'bg-zinc-200 text-zinc-950 border-zinc-200'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
            }`}
          >
            All Sizes
          </button>

          {ALL_SIZES.map((size) => {
            const isSelected = filters.sizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all border ${
                  isSelected
                    ? 'bg-white text-zinc-950 border-white shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
