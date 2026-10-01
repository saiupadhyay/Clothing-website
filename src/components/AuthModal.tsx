import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound,
  Crown
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { FitType } from '../types';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authMode, 
    setAuthMode, 
    adminLoginIntent, 
    setAdminLoginIntent, 
    login, 
    register, 
    setActiveTab 
  } = useShop();

  const [tab, setTab] = useState<'login' | 'register'>(authMode);
  const [isAdminMode, setIsAdminMode] = useState(adminLoginIntent);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredFit, setPreferredFit] = useState<FitType>('Oversized');
  const [adminPasscode, setAdminPasscode] = useState('');

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminPasscodeField, setShowAdminPasscodeField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setTab(authMode);
  }, [authMode]);

  useEffect(() => {
    if (adminLoginIntent) {
      setIsAdminMode(true);
      setEmail('admin@blackfits.com');
      setPassword('Admin@BlackFits2026');
    }
  }, [adminLoginIntent]);

  if (!authModalOpen) return null;

  const handleAutofillAdmin = () => {
    setEmail('admin@blackfits.com');
    setPassword('Admin@BlackFits2026');
    setIsAdminMode(true);
    setErrorMsg(null);
  };

  const handleAutofillCustomer = () => {
    setEmail('alex.vance@blackfits.com');
    setPassword('Password@123');
    setIsAdminMode(false);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (tab === 'login') {
        const res = await login({ email, password });
        if (!res.success) {
          setErrorMsg(res.message || 'Invalid credentials');
          setIsLoading(false);
          return;
        }

        setSuccessMsg(isAdminMode ? 'Executive clearance authorized! Opening Admin Command...' : 'Welcome back to BlackFits!');
        setTimeout(() => {
          setIsLoading(false);
          setAuthModalOpen(false);
          if (isAdminMode) {
            setActiveTab('admin');
            setAdminLoginIntent(false);
          } else {
            setActiveTab('dashboard');
          }
        }, 800);
      } else {
        // Register
        if (!name.trim()) {
          setErrorMsg('Please enter your full name');
          setIsLoading(false);
          return;
        }

        const res = await register({
          name,
          email,
          password,
          phone,
          preferredFit,
          adminPasscode: adminPasscode.trim() || undefined
        });

        if (!res.success) {
          setErrorMsg(res.message || 'Registration failed');
          setIsLoading(false);
          return;
        }

        setSuccessMsg('Account created successfully! Welcome to BlackFits.');
        setTimeout(() => {
          setIsLoading(false);
          setAuthModalOpen(false);
          if (adminPasscode.trim()) {
            setActiveTab('admin');
          } else {
            setActiveTab('dashboard');
          }
        }, 900);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className={`bg-zinc-950 border rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative transition-all my-auto ${
          isAdminMode 
            ? 'border-amber-400/40 shadow-amber-400/10' 
            : 'border-zinc-800'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setAuthModalOpen(false);
            setAdminLoginIntent(false);
          }}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono uppercase tracking-widest text-zinc-300 mb-2">
            {isAdminMode ? (
              <>
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400 font-bold">BLACKFITS EXECUTIVE VAULT</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>OBSIDIAN MEMBER ACCESS</span>
              </>
            )}
          </div>

          <h3 className="text-2xl font-heading font-black text-white tracking-tight">
            {tab === 'login' 
              ? (isAdminMode ? 'EXECUTIVE ADMIN SIGN IN' : 'SIGN IN TO BLACKFITS') 
              : 'JOIN THE NOCTURNAL GUILD'}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            {tab === 'login'
              ? (isAdminMode ? 'Enter authorized credentials to unlock Admin Command' : 'Access order history, live parcel tracking, and saved sizes')
              : 'Create your account for early drop access and tailored fits'}
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="grid grid-cols-2 p-1 bg-zinc-900 rounded-2xl border border-zinc-800 mb-5">
          <button
            type="button"
            onClick={() => { setTab('login'); setErrorMsg(null); }}
            className={`py-2 text-xs font-heading font-black tracking-wider uppercase rounded-xl transition-all ${
              tab === 'login'
                ? (isAdminMode ? 'bg-amber-400 text-zinc-950 shadow-md' : 'bg-white text-zinc-950 shadow-md')
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setErrorMsg(null); }}
            className={`py-2 text-xs font-heading font-black tracking-wider uppercase rounded-xl transition-all ${
              tab === 'register'
                ? 'bg-white text-zinc-950 shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Quick Demo Autofill Helpers */}
        <div className="mb-5 p-2.5 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl text-[11px] font-mono space-y-1.5">
          <span className="text-[10px] text-zinc-500 uppercase font-bold block">
            ⚡ Quick Test Autofill:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={handleAutofillAdmin}
              className="px-2.5 py-1 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 text-[10px] font-bold flex items-center gap-1 transition-colors"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Admin (Full Access)</span>
            </button>
            <button
              type="button"
              onClick={handleAutofillCustomer}
              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-[10px] flex items-center gap-1 transition-colors"
            >
              <User className="w-3 h-3" />
              <span>Customer Demo</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-mono">
          {tab === 'register' && (
            <div>
              <label className="block text-zinc-400 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-zinc-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@blackfits.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-10 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {tab === 'register' && (
            <>
              <div>
                <label className="block text-zinc-400 mb-1">Preferred Silhouette</label>
                <select
                  value={preferredFit}
                  onChange={(e) => setPreferredFit(e.target.value as FitType)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white cursor-pointer focus:outline-none focus:border-amber-400"
                >
                  <option value="Oversized">Oversized (Dropped Shoulder)</option>
                  <option value="BoxyFit">BoxyFit (Cropped & Wide)</option>
                  <option value="Standard">Standard (Classic Heavyweight)</option>
                  <option value="Gym T-shirt">Gym T-shirt (Athletic Fit)</option>
                </select>
              </div>

              {/* Expandable Secret Admin Passcode for Registration */}
              <div className="pt-1">
                {!showAdminPasscodeField ? (
                  <button
                    type="button"
                    onClick={() => setShowAdminPasscodeField(true)}
                    className="text-[11px] text-zinc-500 hover:text-amber-400 transition-colors flex items-center gap-1"
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>Have an Executive Admin Passcode?</span>
                  </button>
                ) : (
                  <div>
                    <label className="block text-amber-400 text-[11px] mb-1 font-bold">
                      Master Admin Passcode (Grants Admin Role)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BLACKFITS_ADMIN_2026"
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      className="w-full bg-zinc-900 border border-amber-400/40 rounded-xl px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 rounded-xl font-heading font-black text-xs tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2 mt-4 ${
              isLoading
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : isAdminMode
                  ? 'bg-amber-400 text-zinc-950 hover:bg-amber-300 shadow-amber-400/20'
                  : 'bg-white text-zinc-950 hover:bg-zinc-200'
            }`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>
              {isLoading 
                ? 'Authenticating...' 
                : tab === 'login' 
                  ? (isAdminMode ? 'Authorize Executive Command' : 'Sign In To Account') 
                  : 'Complete Registration'}
            </span>
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-5 text-center text-[11px] text-zinc-500 font-mono">
          {tab === 'login' ? (
            <p>
              New to BlackFits?{' '}
              <button
                type="button"
                onClick={() => { setTab('register'); setErrorMsg(null); }}
                className="text-white hover:underline font-bold"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setTab('login'); setErrorMsg(null); }}
                className="text-white hover:underline font-bold"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
