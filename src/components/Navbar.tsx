import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  ShieldCheck, 
  Search, 
  Menu, 
  X, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BrandLogo } from './BrandLogo';

export const Navbar: React.FC = () => {
  const { 
    totalCartItems, 
    setCartOpen, 
    wishlist, 
    activeTab, 
    setActiveTab, 
    filters, 
    setFilters 
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Banner Announcement */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800/80 px-4 py-1.5 text-xs text-center text-zinc-400 flex items-center justify-center gap-2 overflow-hidden">
        <span className="inline-flex items-center gap-1.5 font-medium text-zinc-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>SIGNATURE DROP: 280 GSM HEAVYWEIGHT OBSIDIAN TEES</span>
        </span>
        <span className="hidden sm:inline text-zinc-600">•</span>
        <span className="hidden sm:inline text-zinc-400">
          FREE EXPRESS SHIPPING OVER Rs. 999 WITH CODE <span className="font-mono text-zinc-100 font-semibold bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700">BLACKFITS15</span>
        </span>
      </div>

      {/* Main Navbar */}
      <nav className="glass-panel border-b border-zinc-800/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setActiveTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <BrandLogo size="md" allowEdit={true} />
              <div>
                <span className="font-heading font-extrabold text-xl sm:text-2xl text-white tracking-widest block leading-none">
                  BLACKFITS<span className="text-zinc-500">.</span>
                </span>
                <span className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase block mt-0.5">
                  THE OBSIDIAN DISCIPLINE
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => setActiveTab('shop')}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'shop'
                  ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              T-Shirt Vault
            </button>

            <button
              onClick={() => setActiveTab('lookbook')}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'lookbook'
                  ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              Lookbook Feed
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>My Orders & Account</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all flex items-center gap-1.5 border ${
                activeTab === 'admin'
                  ? 'bg-amber-400 text-zinc-950 border-amber-300 font-bold'
                  : 'text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin Panel</span>
            </button>
          </div>

          {/* Action Icons: Search, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Toggle */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-full px-3 py-1">
                  <Search className="w-3.5 h-3.5 text-zinc-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search heavy tees..."
                    value={filters.search}
                    onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                    className="bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none w-28 sm:w-40"
                    autoFocus
                  />
                  <button 
                    onClick={() => { setSearchOpen(false); setFilters(prev => ({ ...prev, search: '' })); }}
                    className="text-zinc-500 hover:text-zinc-300 ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800/60 transition-colors"
                  aria-label="Search products"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Wishlist */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800/60 relative transition-colors"
              aria-label="Wishlist"
              title="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 hover:border-zinc-500 text-white px-3 sm:px-4 py-2 rounded-full transition-all group"
              aria-label="Open Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-zinc-300 group-hover:text-white transition-colors" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-zinc-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {totalCartItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-semibold tracking-wide">
                BAG {totalCartItems > 0 && `(${totalCartItems})`}
              </span>
            </button>
          </div>

        </div>

        {/* Mobile dropdown drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-zinc-800 flex flex-col gap-2">
            <button
              onClick={() => { setActiveTab('shop'); setMobileMenuOpen(false); }}
              className={`px-4 py-2.5 rounded-lg text-left text-sm font-medium flex items-center justify-between ${
                activeTab === 'shop' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:bg-zinc-900'
              }`}
            >
              <span>The T-Shirt Collection</span>
              <ArrowRight className="w-4 h-4 text-zinc-500" />
            </button>

            <button
              onClick={() => { setActiveTab('lookbook'); setMobileMenuOpen(false); }}
              className={`px-4 py-2.5 rounded-lg text-left text-sm font-medium flex items-center justify-between ${
                activeTab === 'lookbook' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:bg-zinc-900'
              }`}
            >
              <span>Street Lookbook Feed</span>
              <Layers className="w-4 h-4 text-zinc-500" />
            </button>

            <button
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
              className={`px-4 py-2.5 rounded-lg text-left text-sm font-medium flex items-center justify-between ${
                activeTab === 'dashboard' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-zinc-400" />
                <span>My Dashboard & Track Order</span>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-500" />
            </button>

            <button
              onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
              className={`px-4 py-2.5 rounded-lg text-left text-xs font-mono flex items-center justify-between border ${
                activeTab === 'admin' ? 'bg-amber-400/20 text-amber-300 border-amber-500/50' : 'text-zinc-400 border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Admin & Inventory Portal</span>
              </div>
              <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">Staff</span>
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};
