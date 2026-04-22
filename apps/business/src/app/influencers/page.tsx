"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Sparkles, 
  ArrowLeft, 
  Users,
  BarChart3,
  Search,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  Zap,
  Target
} from "lucide-react";

// Modular Influencer Tabs
import CampaignsTab from "./components/CampaignsTab";
import RequestsTab from "./components/RequestsTab";
import PerformanceTab from "./components/PerformanceTab";

type InfluencerTab = "campaigns" | "requests" | "performance";

export default function InfluencerHub() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<InfluencerTab>("campaigns");

  const TABS: { id: InfluencerTab; label: string; icon: any }[] = [
    { id: "campaigns", label: "Briefs & Campaigns", icon: <Target size={16} /> },
    { id: "requests", label: "Creator Inbound", icon: <Users size={16} /> },
    { id: "performance", label: "Audit & ROI", icon: <BarChart3 size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#020202] font-inter text-main selection:bg-primary-gold/30">
      
      {/* Console Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-[60]">
        <div className="max-w-[1600px] mx-auto px-10 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6">
             <button 
               onClick={() => router.push("/")}
               className="p-3 rounded-xl bg-white/5 border border-white/5 text-muted-custom hover:text-white hover:border-white/20 transition-all"
             >
                <ArrowLeft size={20} />
             </button>
             <div>
                <h1 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                   <Sparkles size={18} className="text-purple-500" /> Influencer Hub
                </h1>
                <p className="text-[10px] font-bold text-muted-custom uppercase tracking-widest mt-1">Creator Strategy • Impact Orchestration</p>
             </div>
          </div>
          
          <div className="flex items-center gap-10">
             {/* Tab Navigation */}
             <nav className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
                {TABS.map((tab) => (
                   <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                       activeTab === tab.id 
                         ? "bg-purple-500 text-white shadow-lg shadow-purple-500/10" 
                         : "text-muted-custom hover:text-white"
                     }`}
                   >
                      {tab.icon} {tab.label}
                   </button>
                ))}
             </nav>

             <div className="h-8 w-px bg-white/10 hidden lg:block" />

             <div className="hidden lg:flex items-center gap-4">
                <div className="text-right">
                   <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">KPP Active</p>
                   <p className="text-[9px] font-bold text-muted-custom uppercase tracking-tighter mt-0.5">Content Audit Integrity</p>
                </div>
                <div className="size-10 rounded-xl border border-purple-500/20 bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                   <ShieldCheck size={20} />
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1600px] mx-auto px-10 py-12">
        <div className="min-h-[600px]">
           {activeTab === "campaigns" && <CampaignsTab />}
           {activeTab === "requests" && <RequestsTab />}
           {activeTab === "performance" && <PerformanceTab />}
        </div>
      </main>

      {/* Console Footer */}
      <footer className="border-t border-white/5 bg-black/20 mt-20">
         <div className="max-w-[1600px] mx-auto px-10 h-20 flex items-center justify-between">
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-custom">Deliverable Monitor Online</span>
               </div>
               <div className="text-[9px] font-black uppercase tracking-widest text-muted-custom/50 flex items-center gap-2">
                  <Zap size={12} /> Live Creator Engagement Stream
               </div>
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-custom">Kihumba Business Suite • v4.2.0-Impact</p>
         </div>
      </footer>
    </div>
  );
}
