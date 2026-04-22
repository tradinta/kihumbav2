"use client";

import { Search, Filter, MessageSquare, Clock, User, CheckCircle2 } from "lucide-react";

const MOCK_CHATS = [
  { id: "CHT-001", user: "Kuria Kamau", lastMsg: "When is my 5G router being delivered?", time: "4m", status: "Open", agent: "Agent 01", unread: true },
  { id: "CHT-002", user: "Amara Okeke", lastMsg: "The event ticket QR isn't loading.", time: "12m", status: "Pending", agent: "Agent 03", unread: false },
  { id: "CHT-003", user: "John Doe", lastMsg: "Thank you for the quick support!", time: "45m", status: "Closed", agent: "Agent 01", unread: false },
  { id: "CHT-004", user: "Sarah Wanjiku", lastMsg: "My payment failed on the marketplace.", time: "1h", status: "Open", agent: "Unassigned", unread: true },
];

export default function ConversationList({ activeId, onSelect }: any) {
  return (
    <div className="flex flex-col h-full bg-white/[0.01] border-r border-white/5">
      <div className="p-6 space-y-4">
        <h2 className="text-xs font-black uppercase tracking-widest text-muted-custom">Inbound Support</h2>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5 focus-within:border-primary-gold/30 transition-all">
          <Search size={14} className="text-muted-custom" />
          <input 
            type="text" 
            placeholder="Search tickets..." 
            className="bg-transparent border-none text-[10px] font-black focus:outline-none w-full uppercase tracking-widest" 
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
           <FilterButton label="All" active />
           <FilterButton label="Open" />
           <FilterButton label="Pending" />
           <FilterButton label="Unassigned" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {MOCK_CHATS.map((chat) => (
          <button 
            key={chat.id}
            onClick={() => onSelect(chat.id)}
            className={`w-full p-6 text-left border-b border-white/5 transition-all hover:bg-white/[0.02] relative group ${
              activeId === chat.id ? "bg-white/[0.03] border-l-2 border-l-primary-gold" : ""
            }`}
          >
            {chat.unread && (
              <div className="absolute top-6 right-6 size-2 rounded-full bg-primary-gold shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
            )}
            
            <div className="flex justify-between items-start mb-2">
               <h3 className="text-[11px] font-black text-white uppercase tracking-tight">{chat.user}</h3>
               <span className="text-[9px] font-bold text-muted-custom uppercase">{chat.time} ago</span>
            </div>
            
            <p className="text-[10px] font-medium text-muted-custom line-clamp-1 mb-3 group-hover:text-muted-custom/80">
               {chat.lastMsg}
            </p>

            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <div className={`size-1.5 rounded-full ${
                    chat.status === 'Open' ? 'bg-emerald-500' : 
                    chat.status === 'Pending' ? 'bg-amber-500' : 'bg-muted-custom'
                  }`} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-custom">{chat.status}</span>
               </div>
               <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-black text-muted-custom uppercase">
                  <User size={10} /> {chat.agent}
               </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function FilterButton({ label, active = false }: any) {
  return (
    <button className={`whitespace-nowrap px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
      active ? "bg-primary-gold text-black border-primary-gold" : "bg-white/5 border-white/10 text-muted-custom hover:border-white/20"
    }`}>
      {label}
    </button>
  );
}
