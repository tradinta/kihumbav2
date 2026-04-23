"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Megaphone, 
  ShoppingBag, 
  Sparkles, 
  Wallet,
  ArrowRight,
  TrendingUp,
  Globe,
  Lock,
  Activity,
  Users,
  ShieldCheck,
  Edit3,
  PlusCircle,
  Image as ImageIcon,
  Heart,
  BarChart3,
  Target,
  MousePointer2,
  ChevronRight,
  Eye,
  Zap,
  Play,
  ArrowUpRight,
  MessageCircle,
  X,
  MapPin
} from "lucide-react";

export default function AdCentreDashboard() {
  const router = useRouter();
  const [showComposer, setShowComposer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeSimulator, setActiveSimulator] = useState<string>("feed");

  return (
    <div className="min-h-screen bg-main font-inter selection:bg-primary-gold/30">
      
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 1: AD ACCOUNT STUFF — Identity & Global Pulse       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="border-b border-custom">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="size-20 rounded-xl bg-[var(--card-bg)] border border-custom flex items-center justify-center font-black text-primary-gold text-2xl shadow-[0_0_20px_rgba(197,160,89,0.1)]">
                 AC
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-main tracking-tight">Ad Command Console</h1>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase border border-emerald-500/20">Operational</span>
                </div>
                <p className="text-sm font-medium text-muted-custom mt-1">Managing Safaricom PLC • ID: AD-9281-SF</p>
                <div className="flex items-center gap-4 mt-4">
                  <QuickMetric label="Active Reach" value="1.2M" trend="+15%" />
                  <div className="h-8 w-px bg-custom" />
                  <QuickMetric label="Avg. ROAS" value="4.2x" trend="+0.4" />
                  <div className="h-8 w-px bg-custom" />
                  <QuickMetric label="Burn Rate" value="14k/day" trend="Stable" />
                </div>
              </div>
            </div>

            <div className="bg-[var(--card-bg)] border border-custom rounded-xl p-5 w-full md:w-72">
               <div className="flex justify-between items-center mb-4">
                  <Wallet size={18} className="text-primary-gold" />
                  <p className="text-[10px] font-black text-emerald-500 uppercase">Pre-paid</p>
               </div>
               <p className="text-[9px] font-black text-muted-custom uppercase tracking-widest mb-1">Ad Credit Balance</p>
               <p className="text-2xl font-black text-main tracking-tight">KES 145,000</p>
               <button className="w-full mt-5 py-2.5 rounded-lg bg-primary-gold text-black text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all">
                  Top-up Wallet
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SECTION 2: AD LAUNCHPAD — Mock Posting Flow                */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="border-b border-custom">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
             <div>
                <h2 className="text-[11px] font-black text-muted-custom uppercase tracking-[0.3em] mb-2">Campaign Architect</h2>
                <p className="text-sm font-bold text-main/60">Select an ad category to launch a new placement engine</p>
             </div>
             <button className="flex items-center gap-2 text-[10px] font-black text-primary-gold uppercase tracking-widest hover:translate-x-1 transition-all">
                View Policy Guide <ArrowRight size={14} />
             </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CategoryCard 
              title="Generic Ads" 
              desc="Feed, Sparks, Video details & Sidebars"
              icon={<Globe size={24} />}
              color="text-primary-gold"
              onClick={() => router.push("/ads/generic")}
            />
            <CategoryCard 
              title="Kao Ads" 
              desc="Property listings, Maps & Agent spotlights"
              icon={<MapPin size={24} />}
              color="text-blue-500"
              onClick={() => router.push("/ads/kao")}
            />
            <CategoryCard 
              title="Marketplace" 
              desc="Boosted listings & Category highlights"
              icon={<ShoppingBag size={24} />}
              color="text-emerald-500"
              onClick={() => router.push("/ads/marketplace")}
            />

          </div>
        </div>
      </section>

      {/* ════ ═══════════════════════════════════════════════════════ */}
      {/* SECTION 3: CAMPAIGN LEDGER & SIMULATOR                     */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-6 py-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Active Campaigns */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-[11px] font-black text-muted-custom uppercase tracking-[0.3em]">Active Placements</h2>
               <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <p className="text-[10px] font-black text-main uppercase tracking-widest">3 Live Engines</p>
               </div>
            </div>

            <div className="bg-[var(--card-bg)] border border-custom rounded-xl overflow-hidden">
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-white/[0.02] border-b border-custom">
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-custom">Campaign / ID</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-custom">Performance</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-muted-custom">Budget Pacing</th>
                        <th className="px-6 py-4 text-right text-[9px] font-black uppercase tracking-widest text-muted-custom">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     <CampaignRow name="In-Feed Fiber Launch" id="C-9281" type="Generic" reach="842k" ctr="4.2%" spent={45000} budget={100000} />
                     <CampaignRow name="Kilimani Property Pin" id="C-9275" type="Kao" reach="128k" ctr="8.1%" spent={12000} budget={15000} />
                     <CampaignRow name="Sony WH-1000XM5 Boost" id="C-9270" type="Marketplace" reach="42k" ctr="3.8%" spent={5000} budget={8000} />
                  </tbody>
               </table>
            </div>
          </div>

          {/* Placement Simulator */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-[11px] font-black text-muted-custom uppercase tracking-[0.3em]">Live Simulator</h2>
            <div className="bg-[var(--card-bg)] border border-custom rounded-xl p-5 space-y-6">
               <div className="flex gap-2 p-1 bg-white/5 rounded-lg">
                  <SimulatorTab active={activeSimulator === "feed"} label="Feed" onClick={() => setActiveSimulator("feed")} />
                  <SimulatorTab active={activeSimulator === "kao"} label="Kao" onClick={() => setActiveSimulator("kao")} />
                  <SimulatorTab active={activeSimulator === "market"} label="Store" onClick={() => setActiveSimulator("market")} />
               </div>

               <div className="aspect-[4/5] bg-black border border-white/10 rounded-lg relative overflow-hidden flex items-center justify-center p-6">
                  {activeSimulator === "feed" && <FeedMockAd />}
                  {activeSimulator === "kao" && <KaoMockAd />}
                  {activeSimulator === "market" && <MarketplaceMockAd />}
               </div>
               
               <p className="text-[10px] font-bold text-muted-custom text-center uppercase tracking-widest">
                  Previewing: {activeSimulator.toUpperCase()} Placement Engine
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* AD COMPOSER OVERLAY — Mock Posting Logic                   */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
         {showComposer && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"
            >
               <motion.div 
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  className="w-full max-w-2xl bg-[var(--card-bg)] border border-custom rounded-2xl overflow-hidden shadow-2xl"
               >
                  <div className="p-6 border-b border-custom flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary-gold/10 text-primary-gold"><Zap size={18} /></div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-main font-inter">Launch {selectedCategory} Campaign</h3>
                     </div>
                     <button onClick={() => {setShowComposer(false); setSelectedCategory(null);}} className="text-muted-custom hover:text-main transition-colors"><X size={20} /></button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2">
                     {/* Left: Inputs */}
                     <div className="p-8 space-y-8 border-r border-custom">
                        <div>
                           <label className="block text-[9px] font-black uppercase tracking-widest text-muted-custom mb-3">Target Placement</label>
                           <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-xs font-bold text-main focus:outline-none focus:border-primary-gold/50 transition-all appearance-none">
                              {selectedCategory === "Generic" && (
                                 <>
                                    <option>In-Feed Post</option>
                                    <option>Sparks Interstitial</option>
                                    <option>Video Pre-roll</option>
                                    <option>Sidebar Sticky</option>
                                 </>
                              )}
                              {selectedCategory === "Kao" && (
                                 <>
                                    <option>Featured Listing</option>
                                    <option>Map Pin Highlight</option>
                                    <option>Agent Spotlight</option>
                                 </>
                              )}
                              {selectedCategory === "Marketplace" && (
                                 <>
                                    <option>Boosted Grid Item</option>
                                    <option>Search Top Banner</option>
                                    <option>Store Spotlight</option>
                                 </>
                              )}

                           </select>
                        </div>

                        <div>
                           <label className="block text-[9px] font-black uppercase tracking-widest text-muted-custom mb-3">Daily Budget (KES)</label>
                           <input type="number" defaultValue="5000" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-xs font-black text-primary-gold focus:outline-none focus:border-primary-gold/50 transition-all" />
                        </div>

                        <div>
                           <label className="block text-[9px] font-black uppercase tracking-widest text-muted-custom mb-3">Ad Creative</label>
                           <button className="w-full h-32 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 hover:border-primary-gold/30 transition-all group">
                              <ImageIcon size={24} className="text-muted-custom group-hover:text-primary-gold" />
                              <span className="text-[10px] font-black uppercase text-muted-custom group-hover:text-main">Upload Visual Media</span>
                           </button>
                        </div>
                     </div>

                     {/* Right: Projected Intelligence */}
                     <div className="p-8 bg-white/[0.01] flex flex-col justify-between">
                        <div className="space-y-6">
                           <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-custom">AI Performance Projection</h4>
                           <ProjectionItem label="Est. Daily Impressions" value="48,000 — 72,000" />
                           <ProjectionItem label="Est. Daily Clicks" value="1.2k — 1.8k" />
                           <ProjectionItem label="Est. CPC" value="KES 12.50" />
                           <ProjectionItem label="Audience Coverage" value="84% of High-Intent Users" />
                        </div>

                        <div className="pt-8 space-y-4">
                           <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                              <ShieldCheck size={18} className="text-emerald-500" />
                              <p className="text-[10px] font-bold text-emerald-500/80 leading-relaxed">
                                 Your budget is optimized for the Kilimani & Westlands counties.
                              </p>
                           </div>
                           <button className="w-full py-4 rounded-xl bg-primary-gold text-black text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary-gold/20 flex items-center justify-center gap-2">
                              Deploy Campaign Engine <ArrowRight size={16} />
                           </button>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function QuickMetric({ label, value, trend }: any) {
   return (
      <div>
         <p className="text-[9px] font-black text-muted-custom uppercase tracking-widest mb-0.5 font-inter">{label}</p>
         <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-main font-inter">{value}</span>
            <span className="text-[10px] font-black text-emerald-500 font-inter">{trend}</span>
         </div>
      </div>
   );
}

function CategoryCard({ title, desc, icon, color, onClick }: any) {
   return (
      <button 
         onClick={onClick}
         className="bg-[var(--card-bg)] border border-custom rounded-xl p-6 text-left hover:border-primary-gold/30 hover:bg-white/[0.02] transition-all group"
      >
         <div className={`size-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${color}`}>
            {icon}
         </div>
         <h3 className="text-sm font-black text-main tracking-tight group-hover:text-primary-gold transition-colors font-inter">{title}</h3>
         <p className="text-[10px] font-medium text-muted-custom mt-1 leading-relaxed font-inter">{desc}</p>
      </button>
   );
}

function CampaignRow({ name, id, type, reach, ctr, spent, budget }: any) {
   const progress = (spent / budget) * 100;
   return (
      <tr className="hover:bg-white/[0.01] transition-colors group">
         <td className="px-6 py-5">
            <p className="text-xs font-black text-main font-inter">{name}</p>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-[9px] font-black text-muted-custom uppercase tracking-widest font-inter">{id}</span>
               <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/5 text-muted-custom font-black uppercase border border-white/10 font-inter">{type}</span>
            </div>
         </td>
         <td className="px-6 py-5">
            <div className="flex gap-4">
               <div>
                  <p className="text-[8px] font-black text-muted-custom uppercase font-inter">Reach</p>
                  <p className="text-xs font-black text-main font-inter">{reach}</p>
               </div>
               <div>
                  <p className="text-[8px] font-black text-muted-custom uppercase font-inter">CTR</p>
                  <p className="text-xs font-black text-emerald-500 font-inter">{ctr}</p>
               </div>
            </div>
         </td>
         <td className="px-6 py-5">
            <div className="w-32">
               <div className="flex justify-between items-center mb-1 text-[9px] font-black uppercase tracking-widest font-inter">
                  <span className="text-main">KES {(spent/1000).toFixed(0)}k</span>
                  <span className="text-muted-custom">{(progress).toFixed(0)}%</span>
               </div>
               <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-gold" style={{ width: `${progress}%` }} />
               </div>
            </div>
         </td>
         <td className="px-6 py-5 text-right">
            <button className="p-2 rounded-lg bg-white/5 text-muted-custom hover:text-primary-gold transition-all">
               <BarChart3 size={16} />
            </button>
         </td>
      </tr>
   );
}

function SimulatorTab({ active, label, onClick }: any) {
   return (
      <button 
         onClick={onClick}
         className={`flex-1 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all font-inter ${
            active ? "bg-white text-black shadow-sm" : "text-muted-custom hover:text-main"
         }`}
      >
         {label}
      </button>
   );
}

function FeedMockAd() {
   return (
      <div className="w-full h-full bg-black border border-white/10 rounded-lg overflow-hidden flex flex-col shadow-2xl">
         <div className="p-3 flex items-center gap-2 border-b border-white/5">
            <div className="size-8 rounded-full bg-blue-500/20 border border-blue-500/40" />
            <div>
               <p className="text-[10px] font-black text-white font-inter">Safaricom PLC</p>
               <p className="text-[8px] font-black uppercase tracking-widest text-primary-gold font-inter">Sponsored</p>
            </div>
         </div>
         <div className="flex-1 bg-gradient-to-br from-blue-900/20 to-black flex flex-col items-center justify-center p-4">
            <Sparkles size={32} className="text-white/10 mb-4" />
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-inter">Ad Creative 9:16</p>
         </div>
         <div className="p-3 bg-white/5 flex justify-between items-center">
            <p className="text-[9px] font-bold text-white/70 font-inter">Get 50% data bundles today.</p>
            <button className="px-3 py-1.5 bg-blue-600 rounded text-[8px] font-black text-white uppercase font-inter">Shop Now</button>
         </div>
      </div>
   );
}

function KaoMockAd() {
   return (
      <div className="w-full h-full bg-[#050505] rounded-lg overflow-hidden relative flex flex-col">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-20" />
         <div className="flex-1 flex items-center justify-center relative">
            <div className="size-12 rounded-full bg-primary-gold/10 border-2 border-primary-gold/50 flex items-center justify-center text-primary-gold animate-pulse">
               <Target size={20} />
            </div>
            <div className="absolute top-1/4 left-1/4 w-32 bg-black/80 backdrop-blur border border-primary-gold/40 rounded p-2 shadow-2xl">
               <p className="text-[8px] font-black text-primary-gold uppercase mb-1 font-inter">Featured</p>
               <p className="text-[9px] font-black text-white font-inter">3BR Kilimani • KES 120k</p>
            </div>
         </div>
         <div className="p-3 bg-black/60 backdrop-blur-md border-t border-white/10">
            <p className="text-[8px] font-black text-muted-custom uppercase tracking-widest font-inter">Live Placement: Kao Map Pin</p>
         </div>
      </div>
   );
}

function MarketplaceMockAd() {
   return (
      <div className="w-full h-full grid grid-cols-2 gap-2 p-2 bg-[#050505]">
         <div className="rounded-lg border-2 border-primary-gold bg-primary-gold/5 p-2 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary-gold text-black text-[7px] font-black uppercase px-1.5 py-0.5 rounded-bl font-inter">Ad</div>
            <div className="flex-1 bg-white/5 rounded-md mb-2 flex items-center justify-center">
               <ShoppingBag size={20} className="text-white/10" />
            </div>
            <p className="text-[9px] font-black text-white truncate font-inter">Sony WH-1000XM5</p>
            <p className="text-[8px] font-black text-primary-gold mt-1 font-inter">KES 45,000</p>
         </div>
         <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2 flex flex-col">
            <div className="flex-1 bg-white/5 rounded-md mb-2" />
            <p className="text-[9px] font-bold text-white/30 truncate font-inter">Organic Product</p>
            <p className="text-[8px] font-black text-white/20 mt-1 font-inter">KES 42,000</p>
         </div>
         <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2 flex flex-col">
            <div className="flex-1 bg-white/5 rounded-md mb-2" />
            <p className="text-[9px] font-bold text-white/30 truncate font-inter">Organic Product</p>
            <p className="text-[8px] font-black text-white/20 mt-1 font-inter">KES 38,000</p>
         </div>
         <div className="rounded-lg border border-white/5 bg-white/[0.02] p-2 flex flex-col">
            <div className="flex-1 bg-white/5 rounded-md mb-2" />
            <p className="text-[9px] font-bold text-white/30 truncate font-inter">Organic Product</p>
            <p className="text-[8px] font-black text-white/20 mt-1 font-inter">KES 40,000</p>
         </div>
      </div>
   );
}

function ProjectionItem({ label, value }: any) {
   return (
      <div className="flex justify-between items-center py-2 border-b border-white/5">
         <span className="text-[9px] font-black text-muted-custom uppercase tracking-widest font-inter">{label}</span>
         <span className="text-xs font-black text-main font-inter">{value}</span>
      </div>
   );
}
