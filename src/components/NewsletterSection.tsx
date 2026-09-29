import React, { useState } from 'react';
import { Mail, Check, Sparkles, Copy, ArrowRight, ShieldCheck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const NewsletterSection: React.FC = () => {
  const { applyCoupon, setCartOpen } = useShop();

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    applyCoupon('BLACKFITS15');
    localStorage.setItem('bf_subscribed_email', email);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('BLACKFITS15');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-gradient-to-b from-zinc-950 via-zinc-900 to-black border-y border-zinc-800/80 py-16 sm:py-20 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-zinc-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>JOIN THE BLACK SYNDICATE</span>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
            UNLOCK 15% OFF YOUR FIRST DROP
          </h2>
          <p className="text-zinc-400 text-xs sm:text-base max-w-xl mx-auto leading-relaxed">
            Gain secret nocturnal drop access, archival restock alerts, and member-only heavyweight capsule invitations. Zero spam, pure obsidian discipline.
          </p>
        </div>

        {/* Form or Subscribed State */}
        {!subscribed ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800 focus-within:border-zinc-500 transition-all shadow-xl">
              <div className="flex items-center w-full px-3 py-1">
                <Mail className="w-4 h-4 text-zinc-500 mr-2 flex-shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none w-full"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto whitespace-nowrap px-6 py-3 rounded-xl bg-white text-zinc-950 font-heading font-black text-xs tracking-wider uppercase hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>Join & Unlock</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 text-[11px] font-mono text-zinc-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                Private & Unshared
              </span>
              <span>•</span>
              <span>Unsubscribe Anytime</span>
            </div>
          </form>
        ) : (
          /* Subscribed success banner */
          <div className="max-w-md mx-auto bg-zinc-950 border border-zinc-800 p-6 rounded-3xl space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center mx-auto shadow-lg">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading font-black text-lg text-white">YOU ARE IN THE SYNDICATE</h3>
              <p className="text-xs text-zinc-400">
                Your 15% discount has been automatically applied to your cart!
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-750 p-3 rounded-xl flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-amber-400 tracking-wider">
                BLACKFITS15
              </span>
              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] font-mono text-zinc-200 flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <button
              onClick={() => setCartOpen(true)}
              className="w-full py-2.5 rounded-xl bg-white text-zinc-950 font-bold text-xs uppercase hover:bg-zinc-200 transition-colors"
            >
              Open Bag to View Discount
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
