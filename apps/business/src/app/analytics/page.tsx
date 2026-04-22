"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  BarChart3, 
  Users, 
  ArrowLeft, 
  Target, 
  PieChart, 
  Zap, 
  FileText,
  Calendar,
  Filter,
  ShieldCheck,
  TrendingUp,
  Download
} from "lucide-react";

// Modular Analytics Tabs
import AudienceTab from "./components/AudienceTab";
import EngagementTab from "./components/EngagementTab";
import AdsTab from "./components/AdsTab";

type AnalyticsTab = "audience" | "engagement" | "ads" | "reports";

export default function AnalyticsConsole() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("audience");

  const TABS: { id: AnalyticsTab; label: string; icon: any }[] = [
    { id: "audience", label: "Audience & Growth", icon: <Users size={16} /> },
    { id: "engagement", label: "Engagement Pulse", icon: <PieChart size={16} /> },
    { id: "ads", label: "Ad Intelligence", icon: <Target size={16} /> },
    { id: "reports", label: "Exports & Reports", icon: <FileText size={16} /> },
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
                   <BarChart3 size={18} className="text-primary-gold" /> Intelligence Console
                </h1>
                <p className="text-[10px] font-bold text-muted-custom uppercase tracking-widest mt-1">Platform Analytics • Data Stewardship</p>
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
                         ? "bg-primary-gold text-black shadow-lg shadow-primary-gold/10" 
                         : "text-muted-custom hover:text-white"
                     }`}
                   >
                      {tab.icon} {tab.label}
                   </button>
                ))}
             </nav>

             <div className="h-8 w-px bg-white/10 hidden lg:block" />

             <div className="hidden lg:flex items-center gap-4">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                   <Download size={14} /> Export Raw Data
                </button>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1600px] mx-auto px-10 py-12">
        
        {/* Global Performance Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div>
              <h2 className="text-4xl font-black tracking-tighter text-white">Cross-Platform Intelligence</h2>
              <div className="flex items-center gap-3 mt-3">
                 <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase">
                    <TrendingUp size={12} /> Positive Trajectory
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase">
                    <ShieldCheck size={12} /> Audit Verified
                 </div>
                 <span className="text-[10px] font-bold text-muted-custom uppercase tracking-widest">Last Updated: Just Now</span>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-muted-custom hover:text-white transition-all">
                 <Calendar size={14} /> Last 30 Days
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-muted-custom hover:text-white transition-all">
                 <Filter size={14} /> Filter Source
              </button>
           </div>
        </div>

        <div className="min-h-[600px]">
           {activeTab === "audience" && <AudienceTab />}
           {activeTab === "engagement" && <EngagementTab />}
           {activeTab === "ads" && <AdsTab />}
           
           {activeTab === "reports" && (
             <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="size-20 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-muted-custom">
                   <FileText size={40} />
                </div>
                <div>
                   <h3 className="text-xl font-black text-white uppercase tracking-tight">Report Generator</h3>
                   <p className="text-[11px] font-bold text-muted-custom uppercase tracking-widest mt-2">Schedule automated exports to your business email.</p>
                </div>
                <button className="px-8 py-4 rounded-xl bg-primary-gold text-black text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary-gold/10">
                   Schedule New Report
                </button>
             </div>
           )}
        </div>
      </main>

      {/* Console Footer */}
      <footer className="border-t border-white/5 bg-black/20 mt-20">
         <div className="max-w-[1600px] mx-auto px-10 h-20 flex items-center justify-between">
            <div className="flex items-center gap-8">
               <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-custom">Intelligence Stream Online</span>
               </div>
               <div className="text-[9px] font-black uppercase tracking-widest text-muted-custom/50 flex items-center gap-2">
                  <ShieldCheck size={12} /> ISO/IEC 27001 Compliance Verified
               </div>
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-custom">Kihumba Intelligence • v4.2.0-Audit</p>
         </div>
      </footer>
    </div>
  );
}
