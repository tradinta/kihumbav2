"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  MessageSquare, 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  Settings,
  Users,
  Search,
  ChevronRight,
  Filter,
  BarChart3,
  Clock
} from "lucide-react";

// Modular Messaging Hub Components
import ConversationList from "./components/ConversationList";
import ChatWindow from "./components/ChatWindow";
import ContextSidebar from "./components/ContextSidebar";

export default function MessagingHub() {
  const router = useRouter();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  return (
    <div className="h-screen bg-[#020202] font-inter text-main selection:bg-primary-gold/30 flex flex-col overflow-hidden">
      
      {/* Console Header */}
      <header className="h-20 border-b border-white/5 bg-black/40 backdrop-blur-xl shrink-0 z-[60]">
        <div className="max-w-[1800px] mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
             <button 
               onClick={() => router.push("/")}
               className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-muted-custom hover:text-white hover:border-white/20 transition-all"
             >
                <ArrowLeft size={18} />
             </button>
             <div>
                <h1 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
                   <MessageSquare size={16} className="text-red-500" /> Support Hub
                </h1>
                <p className="text-[9px] font-bold text-muted-custom uppercase tracking-widest mt-0.5">Interaction Node • Agent Control</p>
             </div>
          </div>
          
          <div className="flex items-center gap-10">
             {/* Support Performance */}
             <div className="hidden lg:flex items-center gap-10">
                <div className="text-center">
                   <p className="text-[9px] font-black text-muted-custom uppercase tracking-widest mb-1">Queue Status</p>
                   <p className="text-sm font-black text-white">4 Active Tickets</p>
                </div>
                <div className="text-center">
                   <p className="text-[9px] font-black text-muted-custom uppercase tracking-widest mb-1">Avg. Response</p>
                   <p className="text-sm font-black text-emerald-500">4m 12s</p>
                </div>
                <div className="text-center">
                   <p className="text-[9px] font-black text-muted-custom uppercase tracking-widest mb-1">Online Agents</p>
                   <p className="text-sm font-black text-white">03 Agents</p>
                </div>
             </div>

             <div className="h-8 w-px bg-white/10 hidden lg:block" />

             <div className="flex items-center gap-4">
                <button className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-muted-custom hover:text-white transition-all">
                   <Settings size={18} />
                </button>
                <div className="size-10 rounded-xl border border-red-500/20 bg-red-500/10 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                   <ShieldCheck size={20} />
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* Main Orchestration Workspace */}
      <main className="flex-1 flex overflow-hidden">
         {/* Left: Tickets Ledger */}
         <aside className="w-[380px] shrink-0 h-full">
            <ConversationList activeId={activeChatId} onSelect={setActiveChatId} />
         </aside>

         {/* Centre: Engagement Node */}
         <section className="flex-1 h-full overflow-hidden flex flex-col">
            <ChatWindow chatId={activeChatId} />
         </section>

         {/* Right: Context Intelligence */}
         <aside className="shrink-0 h-full">
            <ContextSidebar chatId={activeChatId} />
         </aside>
      </main>

      {/* Hub Footer */}
      <footer className="h-12 border-t border-white/5 bg-black/20 shrink-0">
         <div className="max-w-[1800px] mx-auto px-8 h-full flex items-center justify-between">
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-custom">Support Infrastructure Healthy</span>
               </div>
               <div className="text-[8px] font-black uppercase tracking-widest text-muted-custom/50 flex items-center gap-2">
                  <BarChart3 size={10} /> Real-time SLA Monitoring Active
               </div>
            </div>
            <p className="text-[8px] font-black uppercase tracking-widest text-muted-custom">Kihumba Support • v4.2.0-Agent</p>
         </div>
      </footer>
    </div>
  );
}
