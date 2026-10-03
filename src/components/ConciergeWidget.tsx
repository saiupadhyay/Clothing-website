import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, ShieldCheck, Ruler, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ConciergeWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setQuickViewProduct, products, openWishlist } = useShop();

  const handleWhatsAppRedirect = (prefilledText: string) => {
    const phone = '919820144520';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(prefilledText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40">
      {/* Popover Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-zinc-950/95 border border-zinc-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 text-zinc-100">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-850">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-black text-sm text-white tracking-tight flex items-center gap-1.5">
                  <span>BLACKFITS CONCIERGE</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                </h4>
                <p className="text-[10px] font-mono text-zinc-400">Live Streetwear Stylist & Support</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick FAQ / Prompts */}
          <div className="py-3 space-y-2 text-xs">
            <p className="text-[11px] text-zinc-400 font-sans">
              Need personalized sizing advice, fabric specs, or quick tracking updates? Tap an option below:
            </p>

            <button
              onClick={() => handleWhatsAppRedirect('Hi BlackFits Concierge! I need help choosing between L and XL size for the 280 GSM oversized fit.')}
              className="w-full text-left p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <Ruler className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-[11px]">Sizing & Fit Advice</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() => handleWhatsAppRedirect('Hi! Can you check delivery timeline and dispatch for Mumbai / Delhi PIN codes?')}
              className="w-full text-left p-2.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-[11px]">Express Shipping & Cash on Delivery</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </button>
          </div>

          {/* Direct WhatsApp CTA */}
          <div className="pt-2 border-t border-zinc-850">
            <button
              onClick={() => handleWhatsAppRedirect('Hi BlackFits Team, I have a question about my order and sizing.')}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </button>
            <p className="text-[9px] font-mono text-center text-zinc-500 mt-2">
              Typical reply time: Under 15 minutes • 10 AM - 10 PM IST
            </p>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-emerald-500 text-zinc-950 shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center ring-4 ring-emerald-500/20 group"
        aria-label="Open Concierge Support"
        title="Chat with BlackFits Concierge"
      >
        {isOpen ? (
          <X className="w-6 h-6 stroke-[2.5]" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-zinc-950 border border-emerald-400" />
          </div>
        )}
      </button>
    </div>
  );
};
