"use client";

import { useState } from "react";
import { 
  Send, 
  Smile, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video, 
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2
} from "lucide-react";

const MOCK_MESSAGES = [
  { id: 1, sender: "customer", text: "Hi, I ordered a 5G router yesterday and I haven't received a confirmation email.", time: "10:15 AM" },
  { id: 2, sender: "agent", text: "Hello! Let me check that for you. Do you have your order ID?", time: "10:16 AM" },
  { id: 3, sender: "customer", text: "Yes, it's #ORD-98210.", time: "10:17 AM" },
];

export default function ChatWindow({ chatId }: any) {
  const [msg, setMsg] = useState("");

  if (!chatId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
         <div className="size-20 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-muted-custom">
            <Zap size={40} className="animate-pulse" />
         </div>
         <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Support Node Ready</h3>
            <p className="text-[11px] font-bold text-muted-custom uppercase tracking-widest mt-2">Select a ticket to begin customer orchestration.</p>
         </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-black/20">
      {/* Chat Header */}
      <div className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-xl">
         <div className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-primary-gold font-black">KK</div>
            <div>
               <h2 className="text-sm font-black text-white uppercase tracking-tight">Kuria Kamau</h2>
               <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                  <ShieldCheck size={12} /> Verified Customer
               </p>
            </div>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-muted-custom uppercase">
               <Clock size={12} /> SLA: 12m Remaining
            </div>
            <div className="h-6 w-px bg-white/10" />
            <button className="p-2 rounded-lg hover:bg-white/5 text-muted-custom hover:text-white transition-all"><Phone size={18} /></button>
            <button className="p-2 rounded-lg hover:bg-white/5 text-muted-custom hover:text-white transition-all"><Video size={18} /></button>
            <button className="p-2 rounded-lg hover:bg-white/5 text-muted-custom hover:text-white transition-all"><MoreVertical size={18} /></button>
         </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
         {MOCK_MESSAGES.map((m) => (
           <div key={m.id} className={`flex ${m.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-lg space-y-2 ${m.sender === 'agent' ? 'text-right' : 'text-left'}`}>
                 <div className={`p-5 rounded-2xl text-[13px] font-medium leading-relaxed ${
                   m.sender === 'agent' 
                     ? 'bg-primary-gold text-black rounded-tr-none font-bold' 
                     : 'bg-white/5 border border-white/10 text-white rounded-tl-none'
                 }`}>
                    {m.text}
                 </div>
                 <p className="text-[9px] font-black text-muted-custom uppercase tracking-widest flex items-center gap-2 justify-end">
                    {m.time} {m.sender === 'agent' && <CheckCircle2 size={10} className="text-emerald-500" />}
                 </p>
              </div>
           </div>
         ))}
      </div>

      {/* Internal Note Banner */}
      <div className="px-8 py-2 bg-amber-500/5 border-t border-amber-500/10 flex items-center gap-3">
         <Zap size={14} className="text-amber-500" />
         <p className="text-[10px] font-black text-amber-500/80 uppercase tracking-widest">
            Note: Customer has a high lifetime value (KES 120k). Prioritize resolution.
         </p>
      </div>

      {/* Message Composer */}
      <div className="p-8 border-t border-white/5 bg-black/40">
         <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-primary-gold/30 transition-all">
            <button className="p-3 text-muted-custom hover:text-white transition-colors"><Smile size={20} /></button>
            <button className="p-3 text-muted-custom hover:text-white transition-colors"><Paperclip size={20} /></button>
            <input 
               type="text" 
               placeholder="Type support response or use '/' for templates..." 
               className="flex-1 bg-transparent border-none text-[12px] font-medium text-white focus:outline-none placeholder:text-muted-custom/50 px-2"
               value={msg}
               onChange={(e) => setMsg(e.target.value)}
            />
            <button className="size-12 rounded-xl bg-primary-gold text-black flex items-center justify-center hover:brightness-110 transition-all shadow-lg shadow-primary-gold/10">
               <Send size={20} />
            </button>
         </div>
         <div className="flex items-center gap-6 mt-4">
            <button className="text-[9px] font-black text-muted-custom uppercase tracking-widest hover:text-primary-gold transition-colors flex items-center gap-1.5">
               <Zap size={12} className="text-primary-gold" /> Template: Confirm Delivery
            </button>
            <button className="text-[9px] font-black text-muted-custom uppercase tracking-widest hover:text-primary-gold transition-colors flex items-center gap-1.5">
               <Zap size={12} className="text-primary-gold" /> Template: Refund Policy
            </button>
         </div>
      </div>
    </div>
  );
}
