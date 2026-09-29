import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Lock, 
  ArrowUp 
} from 'lucide-react';
import { InstagramIcon, TwitterIcon, YoutubeIcon } from './SocialIcons';
import { useShop } from '../context/ShopContext';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const { setActiveTab } = useShop();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t border-zinc-900 pt-16 pb-24 md:pb-16 text-zinc-400 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Value Prop Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-zinc-900">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-white text-sm">Zero-Shrinkage Guarantee</h4>
              <p className="text-zinc-500 mt-1">Pre-shrunk with industrial steam. Fits identical wash after wash.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-white text-sm">Dispatched in Air-Sealed Box</h4>
              <p className="text-zinc-500 mt-1">Free express shipping on all orders over Rs. 999.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-white text-sm">30-Day Noir Exchange</h4>
              <p className="text-zinc-500 mt-1">Effortless size swaps if your silhouette requires tuning.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-white text-sm">Encrypted Payment Gateway</h4>
              <p className="text-zinc-500 mt-1">PCI-DSS Level 1 security for cards, Apple Pay, and UPI.</p>
            </div>
          </div>
        </div>

        {/* Brand & Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <BrandLogo size="md" allowEdit={false} />
              <span className="font-heading font-black text-xl text-white tracking-widest">
                BLACKFITS<span className="text-zinc-500">.</span>
              </span>
            </div>

            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              The premier all-black apparel brand focused exclusively on engineered heavyweight T-shirts. Milled from 240–300 GSM combed organic cotton for pure obsidian discipline.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors">
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: Silhouettes */}
          <div className="space-y-3">
            <h5 className="font-mono uppercase text-white font-bold tracking-wider text-xs">SILHOUETTES</h5>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <button onClick={() => { setActiveTab('shop'); scrollToTop(); }} className="hover:text-white transition-colors">
                  Standard Heavyweight Tee (240 GSM)
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('shop'); scrollToTop(); }} className="hover:text-white transition-colors">
                  Oversized Dropped Tee (280 GSM)
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('shop'); scrollToTop(); }} className="hover:text-white transition-colors">
                  BoxyFit Architectural (260 GSM)
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('shop'); scrollToTop(); }} className="hover:text-white transition-colors">
                  Gym T-shirt Athletic (230 GSM)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Hub */}
          <div className="space-y-3">
            <h5 className="font-mono uppercase text-white font-bold tracking-wider text-xs">MEMBER SERVICES</h5>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition-colors">
                  Live Order Tracking Timeline
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition-colors">
                  Manage Delivery Addresses
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-white transition-colors">
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('lookbook')} className="hover:text-white transition-colors">
                  Community Streetstyle Lookbook
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('admin')} className="text-amber-400 hover:text-amber-300 font-mono">
                  Admin & Inventory Command →
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Fabric Science */}
          <div className="space-y-3">
            <h5 className="font-mono uppercase text-white font-bold tracking-wider text-xs">FABRIC SCIENCE</h5>
            <div className="space-y-2 text-zinc-400">
              <p>• 100% High-Density Reactive Dye</p>
              <p>• Zero Side-Seam Tubular Weave</p>
              <p>• 1.25" Double-Needle Bind Collar</p>
              <p>• Preshrunk at 120°C Steam</p>
              <p className="text-[11px] text-zinc-500 font-mono pt-1">
                Engineered in Indore , India
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright & Back to Top */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-500">
          <div>
            © 2026 BLACKFITS Inc. All rights reserved. The Obsidian Discipline.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors p-1"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
