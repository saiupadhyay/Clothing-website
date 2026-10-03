import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { HeroIntro } from './components/HeroIntro';
import { FilterBar } from './components/FilterBar';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { BillModal } from './components/BillModal';
import { UserDashboard } from './components/UserDashboard';
import { AdminPanel } from './components/AdminPanel';
import { LookbookFeed } from './components/LookbookFeed';
import { NewsletterSection } from './components/NewsletterSection';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ConciergeWidget } from './components/ConciergeWidget';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeTab } = useShop();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased selection:bg-zinc-200 selection:text-zinc-950">
      {/* Sticky Navigation Bar */}
      <Navbar />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeTab === 'shop' && (
          <>
            {/* Professional Animated 3D/Angle T-Shirt Intro Board */}
            <HeroIntro />

            {/* Prominent Fit & Size Filter Strip */}
            <FilterBar />

            {/* Catalog Grid */}
            <ProductGrid />

            {/* Streetstyle Social Media Lookbook Feed */}
            <LookbookFeed />

            {/* Newsletter VIP Signup */}
            <NewsletterSection />
          </>
        )}

        {activeTab === 'lookbook' && (
          <div className="pt-4">
            <LookbookFeed />
            <NewsletterSection />
          </div>
        )}

        {activeTab === 'dashboard' && (
          <UserDashboard />
        )}

        {activeTab === 'admin' && (
          <AdminPanel />
        )}
      </main>

      {/* Persistent Modals & Slide-Overs */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <AuthModal />
      <BillModal />

      {/* Mobile App Navigation Bar */}
      <MobileBottomNav />

      {/* Floating 24/7 WhatsApp Concierge */}
      <ConciergeWidget />

      {/* Footer */}
      <Footer />
    </div>
  );
};

import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <ShopProvider>
        <AppContent />
      </ShopProvider>
    </ErrorBoundary>
  );
}
