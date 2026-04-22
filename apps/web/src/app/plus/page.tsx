'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Flame, Zap, Crown, Ghost, EyeOff, MapPin, Sparkles, 
  Image as ImageIcon, UserCheck, MessageSquareOff, Music, 
  RotateCcw, Link as LinkIcon, Palette, TrendingUp, History,
  Lock, Search, ShieldCheck
} from 'lucide-react';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/context/AuthContext';
import UserIdentity from '@/components/shared/UserIdentity';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { api } from '@/lib/api';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PLANS = [
  {
    name: 'PRO',
    tagline: 'The Professional Edge.',
    price: 'KES 299',
    period: 'per month',
    type: 'basic',
    icon: <UserCheck className="text-zinc-400" size={24} />,
    features: [
      'Basic Verified Checkmark',
      'Advanced Photo Editor for Statuses',
      'Creator Fund Eligibility (Start Earning)',
      '10 Kao Searches / week (3km Radius)',
      'Undo Post (5-second grace period)',
      'Pin up to 3 Posts to Profile',
      'Up to 3 Bio Links',
      'No Ads in Comment Sections'
    ],
    buttonText: 'GET PRO',
    status: 'available',
  },
  {
    name: 'PLUS',
    tagline: 'The Absolute Identity.',
    price: 'KES 799',
    period: 'per month',
    type: 'shimmer',
    icon: <Sparkles className="text-primary-gold animate-pulse" size={24} />,
    features: [
      'Shimmering Gold Checkmark',
      'Glowing Shimmering Username',
      'Animated GIF Profile Photo',
      'Golden Shimmer Avatar Ring',
      'Anonymous Story Viewing (Ghost Mode)',
      'See Repeated View Counts on Statuses',
      '100 Kao Searches / week (10km Radius)',
      'Unlimited Map Mode Searches',
      'Profile Theme Music & Custom Soundboard',
      'Anonymous Tribe Posting',
      'Custom Chat Gradients & Bubbles',
      'Unlimited Bio Links',
      'Priority Marketplace Listing Boost'
    ],
    buttonText: 'GET PLUS',
    status: 'available',
    popular: true,
  },
    {
    name: 'ULTRA',
    tagline: 'Spectral Dominance.',
    price: '???',
    period: 'per eon',
    type: 'ghost',
    icon: <Ghost className="text-white/20" size={24} />,
    features: [
      'Spectral Username (Fading Effect)',
      'Hidden from all "Who Viewed" lists',
      'Bypass all Radius & Search limits',
      'Total Platform Anonymity',
      'The Vault: Exclusive Creator Access',
      'Encrypted "Shadow" Chats'
    ],
    buttonText: 'LOCKED',
    status: 'ghost',
  }
];

const CATEGORIES = [
  {
    title: 'IDENTITY & PRESTIGE',
    features: [
      { name: 'Checkmarks', pro: 'Standard', plus: 'Shimmering Gold', ultra: 'Spectral' },
      { name: 'Avatar Effects', pro: 'None', plus: 'Golden Shimmer', ultra: 'Hidden' },
      { name: 'Username Glow', pro: 'None', plus: 'Active Glow', ultra: 'Animated' },
      { name: 'Profile Media', pro: 'Static', plus: 'GIF / Video', ultra: 'Custom' },
    ]
  },
  {
    title: 'STATUS & PRIVACY',
    features: [
      { name: 'Story Viewing', pro: 'Public', plus: 'Anonymous', ultra: 'Untraceable' },
      { name: 'Repeated Views', pro: 'None', plus: 'Full Detail', ultra: 'N/A' },
      { name: 'Anonymous Tribes', pro: 'None', plus: 'Unlimited', ultra: 'Unlimited' },
      { name: 'Tribe Identity', pro: 'Standard', plus: 'Pseudo', ultra: 'Ghost' },
    ]
  },
  {
    title: 'SEARCH & DISCOVERY',
    features: [
      { name: 'Kao Search Radius', pro: '3km', plus: '10km', ultra: 'Unlimited' },
      { name: 'Weekly Search Cap', pro: '10', plus: '100', ultra: 'Infinite' },
      { name: 'Map Mode', pro: 'Basic', plus: 'Unlimited', ultra: 'Unlimited' },
      { name: 'Price History', pro: 'None', plus: 'Full Access', ultra: 'Full Access' },
    ]
  }
];

export default function PlusPage() {
  const { user } = useAuth();
  const [isSubscribing, setIsSubscribing] = React.useState<string | null>(null);
  const [showSuccess, setShowSuccess] = React.useState<string | null>(null);

  const handleSubscribe = async (tier: string) => {
    setIsSubscribing(tier);
    const backendTier = tier === 'ULTRA' ? 'ELITE' : tier;
    try {
      await api.patch('/users/tier', { tier: backendTier });
      setShowSuccess(tier);
      // Wait for user to see the success before reload
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Identity Uplink Failed.');
    } finally {
      setIsSubscribing(null);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] pb-24 selection:bg-primary-gold/30">
      <TopBar />
      
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full p-10 bg-zinc-900 border border-primary-gold/40 rounded-3xl text-center shadow-[0_0_100px_rgba(197,160,89,0.2)] relative overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,#c5a059_0%,transparent_70%)]" />
              
              <div className="relative z-10">
                <div className="size-24 rounded-full bg-primary-gold/10 border border-primary-gold/20 flex items-center justify-center mx-auto mb-8 animate-pulse">
                  <Crown size={48} className="text-primary-gold" />
                </div>
                
                <h2 className="text-4xl font-black text-white tracking-tighter mb-4 shimmer-text">
                  CONGRATULATIONS
                </h2>
                
                <p className="text-zinc-400 font-medium mb-10 leading-relaxed">
                  Your identity has been successfully transcended. You are now part of the 
                  <span className="text-white font-black mx-1 tracking-widest">{showSuccess}</span> 
                  elite.
                </p>
                
                <button 
                  onClick={handleCloseSuccess}
                  className="w-full py-5 bg-primary-gold text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:scale-105 transition-transform"
                >
                  Enter the Kihumba
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-6xl mx-auto px-4 py-12 lg:py-20">
        {/* Diagnostic Section */}
        {user && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 rounded-xl bg-zinc-900/50 border border-primary-gold/20 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-2 opacity-10">
               <ShieldCheck size={120} />
             </div>
             
             <div className="shrink-0">
               <UserIdentity user={user as any} size="lg" hideHandle={false} isLink={false} />
             </div>

             <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <div className="p-4 bg-black/40 rounded-lg border border-white/5">
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Active Tier</span>
                  <span className={cn(
                    "text-xs font-black uppercase tracking-tighter",
                    user.subscriptionTier === 'PLUS' ? "text-primary-gold animate-torch-text" : "text-white"
                  )}>
                    {user.subscriptionTier || 'FREE'}
                  </span>
                </div>

                <div className="p-4 bg-black/40 rounded-lg border border-white/5">
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Entity Geometry</span>
                  <span className="text-xs font-black text-white uppercase tracking-tighter">
                    {user.accountType === 'NORMAL' ? 'Circular' : 'Squircle'} ({user.accountType})
                  </span>
                </div>

                <div className="p-4 bg-black/40 rounded-lg border border-white/5">
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Verified Status</span>
                  <span className={`text-xs font-black uppercase tracking-tighter ${user.isVerified ? 'text-primary-gold' : 'text-zinc-600'}`}>
                    {user.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                  </span>
                </div>

                <div className="p-4 bg-black/40 rounded-lg border border-white/5">
                  <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block mb-1">Identity Expiry</span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                    {user.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt).toLocaleDateString() : 'PERPETUAL'}
                  </span>
                </div>
             </div>
          </motion.div>
        )}
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-white/5 mb-8 shadow-2xl"
          >
            <Sparkles size={14} className="text-primary-gold" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Pioneer Access</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-black text-white mb-6 tracking-tighter"
          >
            TRANSCEND THE <br /> <span className="text-primary-gold shimmer-text">ORDINARY.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-sm lg:text-lg text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Kihumba+ is more than a subscription. It is your digital fingerprint, upgraded. 
            Designed for those who lead the feed.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-6 mb-32">
          {PLANS.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
              className={`relative flex flex-col p-8 rounded-lg border transition-all duration-700 ${
                plan.status === 'ghost' 
                  ? 'bg-black/40 border-white/5 grayscale blur-[2px] hover:blur-0 opacity-40' 
                  : plan.popular 
                    ? 'bg-zinc-950 border-primary-gold/40 shadow-[0_0_100px_-20px_rgba(197,160,89,0.2)] z-10 scale-105' 
                    : 'bg-zinc-900/50 border-white/5'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-gold text-black text-[9px] font-black uppercase tracking-[0.3em] px-6 py-2 rounded-full shadow-2xl">
                  Most Elite
                </div>
              )}

              <div className="mb-10">
                <div className="size-16 rounded-2xl bg-black border border-white/5 flex items-center justify-center mb-6 shadow-inner">
                  {plan.icon}
                </div>
                <h2 className={`text-4xl font-black tracking-tighter mb-1 ${plan.type === 'shimmer' ? 'shimmer-text text-primary-gold' : 'text-white'}`}>
                  {plan.name}
                </h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{plan.tagline}</p>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white tracking-tighter">
                    {plan.status === 'ghost' ? '???' : 'FREE'}
                  </span>
                  <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] line-through opacity-40">{plan.price}</span>
                </div>
                {plan.status !== 'ghost' && (
                  <p className="text-[8px] font-black text-primary-gold uppercase tracking-widest mt-2">Test Pilot Access Enabled</p>
                )}
              </div>

              <div className="flex-1 space-y-4 mb-12">
                {plan.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-4 group">
                    <div className={`mt-1 size-4 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                      plan.popular ? 'bg-primary-gold/10 border-primary-gold/20 text-primary-gold' : 'bg-white/5 border-white/10 text-zinc-600'
                    }`}>
                      <Check size={8} strokeWidth={4} />
                    </div>
                    <span className={`text-[12px] font-bold leading-tight transition-colors ${plan.status === 'ghost' ? 'text-zinc-700' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleSubscribe(plan.name)}
                disabled={plan.status === 'ghost' || isSubscribing === plan.name || user?.subscriptionTier === plan.name}
                className={`w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${
                  plan.status === 'ghost' || user?.subscriptionTier === plan.name
                    ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                    : plan.popular 
                      ? 'bg-primary-gold text-black hover:scale-[1.02] shadow-[0_20px_40px_-10px_rgba(197,160,89,0.3)]' 
                      : 'bg-white text-black hover:bg-zinc-200 hover:scale-[1.02]'
              }`}>
                {isSubscribing === plan.name ? 'Uplink Active...' : user?.subscriptionTier === plan.name ? 'Tier Active' : plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Deep Dive Table */}
        <div className="mb-32 overflow-hidden rounded-xl border border-white/5 bg-zinc-900/30">
          <div className="px-8 py-10 border-b border-white/5 text-center">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-white">The Feature Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/40">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Capability</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">Pro</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-primary-gold">Plus</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">Ultra</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.map((cat, i) => (
                  <React.Fragment key={i}>
                    <tr className="bg-white/5">
                      <td colSpan={4} className="px-8 py-3 text-[9px] font-black text-zinc-500 uppercase tracking-widest">{cat.title}</td>
                    </tr>
                    {cat.features.map((f, j) => (
                      <tr key={j} className="border-b border-white/5 last:border-0">
                        <td className="px-8 py-5 text-xs font-bold text-zinc-300">{f.name}</td>
                        <td className="px-8 py-5 text-[11px] font-bold text-zinc-500">{f.pro}</td>
                        <td className="px-8 py-5 text-[11px] font-black text-white">{f.plus}</td>
                        <td className="px-8 py-5 text-[11px] font-bold text-zinc-700 italic">{f.ultra}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Exclusive Feature Highlights */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Music size={18} />, title: 'IDENTITY AUDIO', desc: 'Set a profile theme song that plays for visitors.' },
            { icon: <RotateCcw size={18} />, title: 'UNDO POST', desc: '5-second grace period to unsend any post or status.' },
            { icon: <History size={18} />, title: 'PRICE PULSE', desc: 'Full history of property price changes on Kao.' },
            { icon: <TrendingUp size={18} />, title: 'ALGO BOOST', desc: 'Priority indexing for marketplace listings.' },
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-xl bg-zinc-900/30 border border-white/5 flex flex-col items-center text-center group hover:bg-zinc-900/50 transition-all">
              <div className="size-12 rounded-2xl bg-black border border-white/5 flex items-center justify-center text-primary-gold mb-6 shadow-xl group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-[10px] font-black text-white mb-3 uppercase tracking-widest">{item.title}</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-medium uppercase tracking-tighter">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />

      <style jsx global>{`
        .shimmer-text {
          background: linear-gradient(90deg, #c5a059 0%, #e2c27d 50%, #c5a059 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 3s linear infinite;
        }

        @keyframes shine {
          to { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
}
