"use client";

import { Plus, Trash2, Ticket, Users, DollarSign, Award } from "lucide-react";

export default function EventTicketingStage({ data, updateData }: any) {
  const addTier = () => {
    updateData({ 
      tickets: [...data.tickets, { tier: 'New Tier', price: 0, perks: '', capacity: 100 }] 
    });
  };

  const removeTier = (index: number) => {
    const newTickets = [...data.tickets];
    newTickets.splice(index, 1);
    updateData({ tickets: newTickets });
  };

  const updateTier = (index: number, updates: any) => {
    const newTickets = [...data.tickets];
    newTickets[index] = { ...newTickets[index], ...updates };
    updateData({ tickets: newTickets });
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-black tracking-tighter">Ticketing Architecture</h2>
            <p className="text-sm font-medium text-muted-custom mt-1">Configure your revenue tiers and attendee capacity.</p>
         </div>
         <button 
           onClick={addTier}
           className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
         >
            <Plus size={16} /> Add Tier
         </button>
      </div>

      <div className="space-y-4">
        {data.tickets.map((ticket: any, idx: number) => (
          <div key={idx} className="p-8 rounded-2xl border border-custom bg-white/[0.02] space-y-8 relative group overflow-hidden">
             <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                   <div className="size-10 rounded-lg bg-primary-gold/10 border border-primary-gold/20 flex items-center justify-center text-primary-gold">
                      <Ticket size={20} />
                   </div>
                   <input 
                     type="text" 
                     className="bg-transparent border-none text-lg font-black text-main focus:outline-none w-48"
                     value={ticket.tier}
                     onChange={(e) => updateTier(idx, { tier: e.target.value })}
                   />
                </div>
                <button 
                  onClick={() => removeTier(idx)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-muted-custom hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                   <Trash2 size={18} />
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <div className="space-y-3">
                   <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
                      <DollarSign size={10} /> Unit Price
                   </label>
                   <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-muted-custom">KES</span>
                      <input 
                        type="number" 
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm font-black text-main focus:outline-none"
                        value={ticket.price}
                        onChange={(e) => updateTier(idx, { price: Number(e.target.value) })}
                      />
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
                      <Users size={10} /> Total Capacity
                   </label>
                   <input 
                     type="number" 
                     className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm font-black text-main focus:outline-none"
                     value={ticket.capacity}
                     onChange={(e) => updateTier(idx, { capacity: Number(e.target.value) })}
                   />
                </div>

                <div className="space-y-3">
                   <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom flex items-center gap-2">
                      <Award size={10} /> Perks / Access
                   </label>
                   <input 
                     type="text" 
                     placeholder="e.g. VIP Lounge, 1 Drink" 
                     className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm font-black text-main focus:outline-none"
                     value={ticket.perks}
                     onChange={(e) => updateTier(idx, { perks: e.target.value })}
                   />
                </div>
             </div>
             
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none grayscale group-hover:grayscale-0 transition-all group-hover:opacity-[0.05]">
                <Ticket size={150} />
             </div>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 flex items-start gap-4">
         <Users size={20} className="text-blue-500 shrink-0 mt-1" />
         <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">Capacity Prediction</h4>
            <p className="text-[11px] font-medium text-main/70 leading-relaxed uppercase">
               Total Venue Capacity: **{data.tickets.reduce((acc: number, curr: any) => acc + (curr.capacity || 0), 0).toLocaleString()} Attendees**. 
               Revenue Potential: **KES {data.tickets.reduce((acc: number, curr: any) => acc + ((curr.price || 0) * (curr.capacity || 0)), 0).toLocaleString()}**.
            </p>
         </div>
      </div>
    </div>
  );
}
