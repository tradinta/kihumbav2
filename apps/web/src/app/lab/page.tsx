'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, ShieldAlert, BadgeCheck, CheckCircle2, 
  Beaker, Sparkles, Layers, Palette, Zap
} from 'lucide-react';
import LeftSidebar from '@/components/LeftSidebar';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';

export default function LabPage() {
  const [accountType, setAccountType] = useState('NORMAL');
  const [tier, setTier] = useState('FREE');
  const [hasStatus, setHasStatus] = useState(false);
  const [businessColor, setBusinessColor] = useState('#1d9bf0');
  const [businessWeight, setBusinessWeight] = useState('3px');

  // Auto-reset tier for institutional accounts
  React.useEffect(() => {
    if (accountType !== 'NORMAL') setTier('FREE');
  }, [accountType]);

  const getAvatarShape = () => {
    if (accountType === 'NORMAL') return 'rounded-full';
    return 'rounded-[16px]'; // Squircle
  };

  const getFrameStyle = () => {
    let classes = [];
    
    // 1. Base Identity Frame
    if (accountType === 'NORMAL') {
      if (tier === 'PLUS') classes.push('border-2 border-transparent animate-torch-bg shadow-[0_0_25px_rgba(255,215,0,0.3)]');
      else if (tier === 'PRO') classes.push('border-2 border-primary-gold shadow-[0_0_10px_rgba(212,175,55,0.2)]');
      else classes.push('border border-white/10');
    } else if (accountType === 'GOVERNMENT') {
      // Silver inner border
      classes.push('border-2 border-slate-300 shadow-[0_0_15px_rgba(148,163,184,0.2)]');
      // If no status, add the outer silver ring
      if (!hasStatus) classes.push('ring-1 ring-slate-500 ring-offset-2 ring-offset-black');
    } else if (accountType === 'BUSINESS') {
      classes.push('border-solid shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]');
    }

    // 2. Status Override (Stacks outside the frame)
    if (hasStatus) {
      classes.push('ring-[3px] ring-offset-[3px] ring-offset-black ring-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]');
    }

    return classes.join(' ');
  };

  const getInlineStyles = () => {
    if (accountType === 'BUSINESS') {
      return { borderColor: businessColor, borderWidth: businessWeight };
    }
    return {};
  };

  const getUsernameStyle = () => {
    if (accountType === 'NORMAL' && tier === 'PLUS') {
      return 'animate-torch-text font-black drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]';
    }
    if (accountType === 'GOVERNMENT') return 'text-slate-200 font-black tracking-tight';
    if (accountType === 'BUSINESS') return 'text-white font-black tracking-tight';
    return 'text-white font-bold tracking-tight';
  };

  const renderCheckmark = () => {
    if (accountType === 'GOVERNMENT') return <BadgeCheck size={24} className="badge-solid text-white fill-slate-400 shrink-0" />;
    if (accountType === 'BUSINESS') return <BadgeCheck size={24} className="badge-solid text-white shrink-0" style={{ fill: businessColor }} />;
    
    if (accountType === 'NORMAL') {
      if (tier === 'PLUS') return (
        <div className="relative inline-flex shrink-0 drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]">
          <BadgeCheck size={24} className="badge-solid text-white fill-[#D4AF37]" />
          <div className="absolute inset-0 animate-torch-mask">
            <BadgeCheck size={24} className="badge-solid text-white fill-white" />
          </div>
        </div>
      );
      if (tier === 'PRO') return <BadgeCheck size={24} className="badge-solid text-white fill-primary-gold shrink-0" />;
    }
    return null;
  };

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6 bg-black">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-5xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
        <TopBar />

        {/* --- Lab Header --- */}
        <div className="px-6 py-12 border-b border-white/5 mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="size-12 rounded-sm bg-primary-gold/10 flex items-center justify-center border border-primary-gold/20">
              <Beaker className="text-primary-gold" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter gold-glow">The UI Lab v2</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-custom mt-1">Creative Visual Sovereignty & Identity Framing.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-6">
          
          {/* --- Simulator Controls --- */}
          <section className="space-y-6 card-surface p-8 rounded-sm border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-primary-gold" size={16} />
              <h2 className="text-xs font-black uppercase tracking-widest text-white">Identity Matrix</h2>
            </div>

            <div className="space-y-6">
              {/* Account Type */}
              <div className="space-y-3">
                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">Account Entity</label>
                <div className="grid grid-cols-3 gap-2">
                  {['NORMAL', 'BUSINESS', 'GOVERNMENT'].map(type => (
                    <button key={type} onClick={() => setAccountType(type)} className={`h-8 rounded-sm text-[8px] font-black tracking-widest uppercase transition-all ${accountType === type ? 'bg-primary-gold text-black shadow-[0_0_15px_rgba(197,160,89,0.3)]' : 'bg-white/5 text-muted-custom hover:bg-white/10'}`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Business Customization */}
              {accountType === 'BUSINESS' && (
                <div className="space-y-3 p-4 rounded bg-white/5 border border-white/10 animate-fade-in-up">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-primary-gold">Brand Customization</label>
                  
                  <div className="space-y-2">
                    <span className="text-[8px] font-bold uppercase text-muted-custom">Frame Color</span>
                    <div className="flex gap-2">
                      {['#1d9bf0', '#EF4444', '#10B981', '#F59E0B'].map(c => (
                        <button key={c} onClick={() => setBusinessColor(c)} className={`size-6 rounded-sm border-2 transition-all ${businessColor === c ? 'border-white scale-110' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 mt-3">
                    <span className="text-[8px] font-bold uppercase text-muted-custom">Frame Weight</span>
                    <div className="flex gap-2">
                      {['2px', '3px', '4px'].map(w => (
                        <button key={w} onClick={() => setBusinessWeight(w)} className={`px-2 py-1 rounded-sm text-[8px] font-bold transition-all ${businessWeight === w ? 'bg-white/20 text-white' : 'bg-black/50 text-muted-custom hover:bg-white/10'}`}>
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tier */}
              <div className={`space-y-3 transition-opacity ${accountType !== 'NORMAL' ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">Premium Tier (Normal Only)</label>
                <div className="grid grid-cols-3 gap-2">
                  {['FREE', 'PRO', 'PLUS'].map(t => (
                    <button key={t} onClick={() => setTier(t)} className={`h-8 rounded-sm text-[8px] font-black tracking-widest uppercase transition-all ${tier === t ? 'bg-primary-gold text-black shadow-[0_0_15px_rgba(197,160,89,0.3)]' : 'bg-white/5 text-muted-custom hover:bg-white/10'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Toggle */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                 <button 
                  onClick={() => setHasStatus(!hasStatus)}
                  className={`w-full h-10 rounded-sm text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                    hasStatus ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 'bg-white/5 text-muted-custom hover:bg-white/10'
                  }`}
                 >
                   <Sparkles size={14} className={hasStatus ? "animate-pulse" : ""} /> {hasStatus ? 'Unviewed Status Active' : 'Toggle Status Fire'}
                 </button>
              </div>
            </div>
          </section>

          {/* --- Visual Result --- */}
          <section className="flex flex-col items-center justify-center card-surface p-12 rounded-sm border border-white/5 relative overflow-hidden min-h-[350px]">
            {/* Background ambiance based on type */}
            <div className={`absolute inset-0 opacity-20 pointer-events-none transition-colors duration-1000 ${
              accountType === 'GOVERNMENT' ? 'bg-gradient-to-t from-slate-500/20' :
              accountType === 'BUSINESS' ? `bg-gradient-to-t` :
              tier === 'PLUS' ? 'bg-gradient-to-t from-[#FFD700]/20' : 'bg-gradient-to-t from-primary-gold/5'
            }`} style={accountType === 'BUSINESS' ? { backgroundImage: `linear-gradient(to top, ${businessColor}33, transparent)` } : {}} />
            
            <div className="relative z-10 flex flex-col items-center gap-6">
               {/* Avatar Frame Wrapper */}
               <div 
                 className={`size-32 transition-all duration-700 relative flex items-center justify-center ${getAvatarShape()} ${getFrameStyle()}`}
                 style={getInlineStyles()}
               >
                  <div className={`size-full bg-black overflow-hidden ${getAvatarShape()}`}>
                    <img src="/branding/avatar-fallback.png" className="size-full object-cover" alt="Preview" />
                  </div>
               </div>

               <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h3 className={`text-xl ${getUsernameStyle()}`}>
                      Kihumba User 
                    </h3>
                    {renderCheckmark()}
                  </div>
                  <p className="text-[10px] font-black text-muted-custom uppercase tracking-[0.2em] mt-1">
                    {accountType} {accountType === 'NORMAL' ? `• ${tier} TIER` : ''}
                  </p>
               </div>
            </div>
          </section>

          {/* --- Logic Legend --- */}
          <section className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-surface p-6 rounded-sm border border-white/5">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-gold mb-4">Geometry & Identity</h4>
               <ul className="space-y-3 text-[9px] font-bold text-muted-custom uppercase">
                 <li className="flex flex-col gap-1">
                   <span className="text-white">Government</span>
                   <span className="text-[8px] text-slate-400">Squircle • Grey Check • Double Silver Frame</span>
                 </li>
                 <li className="flex flex-col gap-1">
                   <span className="text-white">Business</span>
                   <span className="text-[8px] text-blue-400">Squircle • Blue Check • Thick Blue Outline</span>
                 </li>
               </ul>
            </div>

            <div className="card-surface p-6 rounded-sm border border-white/5">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-gold mb-4">Normal Hierarchy</h4>
               <ul className="space-y-3 text-[9px] font-bold text-muted-custom uppercase">
                 <li className="flex flex-col gap-1">
                   <span className="text-white">Pro Subscriber</span>
                   <span className="text-[8px] text-primary-gold">Solid Gold Frame • Static Gold Check</span>
                 </li>
                 <li className="flex flex-col gap-1">
                   <span className="text-white">Plus Subscriber</span>
                   <span className="text-[8px] text-[#FFD700]">Flowing Gradient Frame • Shimmering Username • Pulsing Check</span>
                 </li>
               </ul>
            </div>

            <div className="card-surface p-6 rounded-sm border border-white/5">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-gold mb-4">Status Interaction</h4>
               <ul className="space-y-3 text-[9px] font-bold text-muted-custom uppercase">
                 <li className="flex flex-col gap-1">
                   <span className="text-white">The Fire Ring</span>
                   <span className="text-[8px] text-orange-400">Unviewed status completely overtakes the identity frame with an aggressive, floating orange aura.</span>
                 </li>
               </ul>
            </div>
          </section>

        </div>
      </main>

      <BottomNav />
    </div>
  );
}
