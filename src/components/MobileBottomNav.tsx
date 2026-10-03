import React from 'react';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Compass, 
  Layers 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const MobileBottomNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    totalCartItems, 
    setCartOpen, 
    wishlist,
    openWishlist,
    activeDashboardSubTab,
    setActiveDashboardSubTab
  } = useShop();

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 px-4 py-2 flex items-center justify-around shadow-2xl safe-area-bottom">
      
      {/* Shop Vault */}
      <button
        onClick={() => {
          setActiveTab('shop');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center gap-1 p-1 transition-colors ${
          activeTab === 'shop' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] font-mono font-medium">Vault</span>
      </button>

      {/* Lookbook */}
      <button
        onClick={() => {
          setActiveTab('lookbook');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center gap-1 p-1 transition-colors ${
          activeTab === 'lookbook' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <Layers className="w-5 h-5" />
        <span className="text-[10px] font-mono font-medium">Lookbook</span>
      </button>

      {/* Wishlist */}
      <button
        onClick={openWishlist}
        className={`flex flex-col items-center gap-1 p-1 transition-colors relative ${
          activeTab === 'dashboard' && activeDashboardSubTab === 'wishlist' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <Heart className="w-5 h-5" />
        {wishlist.length > 0 && (
          <span className="absolute -top-0.5 right-1 w-3.5 h-3.5 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {wishlist.length}
          </span>
        )}
        <span className="text-[10px] font-mono font-medium">Saved</span>
      </button>

      {/* Cart Bag */}
      <button
        onClick={() => setCartOpen(true)}
        className="flex flex-col items-center gap-1 p-1 text-zinc-500 hover:text-zinc-300 transition-colors relative"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {totalCartItems > 0 && (
            <span className="absolute -top-1 -right-2 w-4 h-4 bg-white text-zinc-950 text-[10px] font-bold rounded-full flex items-center justify-center">
              {totalCartItems}
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono font-medium">Bag</span>
      </button>

      {/* Account / Dashboard */}
      <button
        onClick={() => {
          setActiveDashboardSubTab('orders');
          setActiveTab('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center gap-1 p-1 transition-colors ${
          activeTab === 'dashboard' && activeDashboardSubTab !== 'wishlist' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-mono font-medium">Account</span>
      </button>

    </div>
  );
};
