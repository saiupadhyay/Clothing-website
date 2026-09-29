import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Rotate3d, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  Sliders, 
  Maximize2,
  CheckCircle2,
  Flame,
  Award
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { CadCustomizerModal } from './CadCustomizerModal';

export const HeroIntro: React.FC = () => {
  const { products, setQuickViewProduct, cadImages } = useShop();

  const [currentAngle, setCurrentAngle] = useState<'front' | 'back' | 'collar' | 'texture'>('front');
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [showCadModal, setShowCadModal] = useState(false);

  // Auto rotation effect
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setRotationDegrees((prev) => (prev + 0.5) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  // Featured Hero Product (Onyx Heavyweight)
  const featuredProduct = products.find((p) => p.id === 'bf-01') || products[0];

  const getHeroImage = () => {
    if (currentAngle === 'collar') {
      return cadImages.collar || '/images/cad/collar_detail.png';
    }
    if (currentAngle === 'texture') {
      return cadImages.texture || '/images/cad/texture_detail.png';
    }
    if (currentAngle === 'back') {
      return cadImages.back || '/images/cad/plain_back.png';
    }
    return cadImages.front || '/images/cad/plain_front.png';
  };

  return (
    <section className="relative overflow-hidden bg-zinc-950 border-b border-zinc-900 pt-8 pb-16 lg:py-20">
      {/* Ambient background lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-zinc-800/20 via-zinc-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-zinc-800/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-zinc-900/30 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-grain opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Intro Top Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-zinc-200">DROP 01 LIVE</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">100% PRE-SHRUNK HEAVY COTTON</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-zinc-500">
            <span>THREAD COUNT: 280 GSM</span>
            <span>•</span>
            <span>SHRINKAGE: 0.0%</span>
            <span>•</span>
            <span>COLOR: OBSIDIAN #040404</span>
          </div>
        </div>

        {/* Hero Grid: Left Copy & Controls, Right Animated 3D Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Manifesto & Brand Headline */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="text-xs uppercase font-mono tracking-widest text-zinc-400 flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                The All-Black Philosophy
              </span>
              <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05]">
                BORN IN <br />
                <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                  OBSIDIAN.
                </span> <br />
                SHAPED FOR DISCIPLINE.
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans max-w-xl">
                We make one thing with absolute perfection: <strong className="text-zinc-100 font-semibold">heavyweight black T-shirts</strong>. 
                Custom-milled 240–300 GSM combed cotton engineered to never lose its collar rigidity or deep noir saturation.
              </p>
            </div>

            {/* Quick Filter CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('product-catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-full bg-white text-zinc-950 font-heading font-bold text-sm tracking-wider hover:bg-zinc-200 transition-all shadow-lg hover:shadow-white/10 flex items-center gap-2 group"
              >
                <span>EXPLORE THE VAULT</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setQuickViewProduct(featuredProduct)}
                className="px-5 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 font-medium text-sm transition-all flex items-center gap-2"
              >
                <Maximize2 className="w-4 h-4 text-zinc-400" />
                <span>Quick View Signature Tee</span>
              </button>
            </div>

            {/* Value Guarantees */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-900">
              <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850">
                <ShieldCheck className="w-4 h-4 text-zinc-300 mb-1" />
                <p className="text-xs font-semibold text-white">0% Shrinkage</p>
                <p className="text-[10px] text-zinc-500">Steam pre-shrunk</p>
              </div>

              <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850">
                <Layers className="w-4 h-4 text-zinc-300 mb-1" />
                <p className="text-xs font-semibold text-white">280 GSM Density</p>
                <p className="text-[10px] text-zinc-500">Heavyweight drape</p>
              </div>

              <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850">
                <Award className="w-4 h-4 text-zinc-300 mb-1" />
                <p className="text-xs font-semibold text-white">Non-Sag Rib Collar</p>
                <p className="text-[10px] text-zinc-500">Double-needle bind</p>
              </div>
            </div>

          </div>

          {/* Right Column: Professional Intro Board with Animated 3D/Angle Visualizer */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-zinc-950 border border-zinc-800/90 p-4 sm:p-6 shadow-2xl overflow-hidden backdrop-blur-xl">
              
              {/* Top Board Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                  <span className="ml-2 font-mono text-xs text-zinc-400">
                    BLACKFITS CAD VISUALIZER // V2.4
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCadModal(true)}
                    className="px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1.5 transition-colors border bg-zinc-900 hover:bg-zinc-800 text-amber-400 border-amber-500/40 hover:border-amber-400 font-bold"
                    title="Upload or change CAD visualizer photos"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>CHANGE CAD PHOTOS</span>
                  </button>

                  <button
                    onClick={() => setIsAutoRotating(!isAutoRotating)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono flex items-center gap-1.5 transition-colors border ${
                      isAutoRotating 
                        ? 'bg-zinc-800 text-zinc-200 border-zinc-600' 
                        : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                    }`}
                  >
                    <Rotate3d className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
                    <span>{isAutoRotating ? 'AUTO' : 'PAUSED'}</span>
                  </button>
                  <span className="font-mono text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
                    ACTIVE MOCK
                  </span>
                </div>
              </div>

              {/* Main Animated Display Area */}
              <div className="relative my-4 aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-b from-zinc-900 to-black flex items-center justify-center border border-zinc-850">
                
                {/* Subtle radial spotlight */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-40 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.9) 70%)`
                  }}
                />

                {/* Animated Floating T-Shirt Canvas Simulation */}
                <div 
                  className="relative z-10 w-full h-full flex items-center justify-center p-4 transition-transform duration-500 ease-out"
                  style={{
                    transform: `scale(1.02) rotate(${(rotationDegrees % 360) * 0.02 - 3.6}deg)`
                  }}
                >
                  <div className="relative group max-w-sm sm:max-w-md w-full h-full flex items-center justify-center">
                    <img
                      src={getHeroImage()}
                      alt="BLACKFITS Heavyweight T-Shirt"
                      className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] transition-all duration-700 animate-float"
                    />

                    {/* Interactive Hotspot Pills on the Shirt */}
                    <div className="absolute top-[28%] left-[48%] -translate-x-1/2 group-hover:opacity-100 transition-opacity">
                      <div className="relative flex items-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
                        <div className="hidden sm:block absolute left-5 whitespace-nowrap bg-zinc-950/90 text-zinc-200 text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-700 backdrop-blur shadow-md">
                          Reinforced Collar Stay
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-[24%] right-[22%] group-hover:opacity-100 transition-opacity">
                      <div className="relative flex items-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
                        <div className="hidden sm:block absolute right-5 whitespace-nowrap bg-zinc-950/90 text-zinc-200 text-[10px] font-mono px-2 py-0.5 rounded border border-zinc-700 backdrop-blur shadow-md">
                          Blind Hem Stitch
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-Time Spec Floating Overlay Card */}
                <div className="absolute bottom-3 left-3 bg-zinc-950/85 backdrop-blur-md border border-zinc-800 rounded-xl p-3 max-w-[210px] shadow-xl z-20">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1">
                    <span>SPEC READOUT</span>
                    <span className="text-white font-bold">BLACKFITS CAD</span>
                  </div>
                  <div className="space-y-1 text-[10px] text-zinc-300">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Fabric Density:</span>
                      <span className="font-mono text-white font-semibold">280 GSM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Active View:</span>
                      <span className="font-mono text-zinc-300 uppercase">
                        {currentAngle === 'front' ? '01 Front' : currentAngle === 'back' ? '02 Back' : currentAngle === 'collar' ? '03 Collar' : '04 Fabric'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Dye Formula:</span>
                      <span className="font-mono text-zinc-300">Deep Obsidian Matte</span>
                    </div>
                  </div>
                </div>

                {/* Angle Selector Tabs overlayed on top right */}
                <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20 bg-zinc-950/80 p-1.5 rounded-xl border border-zinc-800/90 backdrop-blur-md">
                  <button
                    onClick={() => setCurrentAngle('front')}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors text-left flex items-center gap-1.5 ${
                      currentAngle === 'front' 
                        ? 'bg-white text-zinc-950 font-bold' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>01 Front</span>
                  </button>
                  <button
                    onClick={() => setCurrentAngle('back')}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors text-left flex items-center gap-1.5 ${
                      currentAngle === 'back' 
                        ? 'bg-white text-zinc-950 font-bold' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>02 Back</span>
                  </button>
                  <button
                    onClick={() => setCurrentAngle('collar')}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors text-left flex items-center gap-1.5 ${
                      currentAngle === 'collar' 
                        ? 'bg-white text-zinc-950 font-bold' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>03 Collar</span>
                  </button>
                  <button
                    onClick={() => setCurrentAngle('texture')}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors text-left flex items-center gap-1.5 ${
                      currentAngle === 'texture' 
                        ? 'bg-white text-zinc-950 font-bold' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>04 Fabric</span>
                  </button>
                </div>

              </div>

              {/* Bottom Interactive Board Controls: 4 CAD Angle Buttons */}
              <div className="space-y-3 pt-3 border-t border-zinc-850">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-zinc-400" />
                    SELECT ANGLE FOR LIVE SIMULATION:
                  </span>
                  <button
                    onClick={() => {
                      const el = document.getElementById('product-catalog');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-mono transition-colors flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>BROWSE ALL FITS IN CATALOG</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* 4 Clean CAD Angle Selector Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'front', label: '01 Front View', sub: 'Full Silhouette' },
                    { id: 'back', label: '02 Back View', sub: 'Reverse Drape' },
                    { id: 'collar', label: '03 Collar Detail', sub: '1.25" Rib Macro' },
                    { id: 'texture', label: '04 Fabric Weave', sub: '280 GSM Knit' },
                  ].map((angle) => (
                    <button
                      key={angle.id}
                      onClick={() => setCurrentAngle(angle.id as any)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-center transition-all border ${
                        currentAngle === angle.id
                          ? 'bg-zinc-100 text-zinc-950 border-white shadow-md'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <div className="truncate">{angle.label}</div>
                      <div className={`text-[10px] font-mono mt-0.5 ${currentAngle === angle.id ? 'text-zinc-700' : 'text-zinc-500'}`}>
                        {angle.sub}
                      </div>
                    </button>
                  ))}
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>

      {/* CAD Visualizer Image Customizer Modal */}
      <CadCustomizerModal 
        isOpen={showCadModal} 
        onClose={() => setShowCadModal(false)} 
      />
    </section>
  );
};
