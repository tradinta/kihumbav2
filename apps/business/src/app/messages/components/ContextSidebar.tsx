"use client";

import { 
  User, 
  ShoppingBag, 
  Calendar, 
  MapPin, 
  Activity, 
  History, 
  ExternalLink,
  ShieldCheck,
  CreditCard
} from "lucide-react";

export default function ContextSidebar({ chatId }: any) {
  if (!chatId) return null;

  return (
    <div className="w-[380px] bg-white/[0.01] border-l border-white/5 h-full overflow-y-auto custom-scrollbar p-8 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Customer Profile */}
      <div className="space-y-6 text-center">
         <div className="size-24 rounded-3xl bg-white/5 border border-white/5 mx-auto flex items-center justify-center text-primary-gold text-4xl font-black">
            KK
         </div>
         <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Kuria Kamau</h3>
            <p className="text-[10px] font-bold text-muted-custom uppercase tracking-widest mt-1">Platinum Member • Nairobi, KE</p>
         </div>
      </div>

      {/* Commercial Pulse */}
      <div className="space-y-4">
         <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Commercial Pulse</h4>
         <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
               <p className="text-[9px] font-black text-muted-custom uppercase tracking-widest mb-1">LTV</p>
               <p className="text-sm font-black text-white uppercase tracking-tight">KES 124k</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
               <p className="text-[9px] font-black text-muted-custom uppercase tracking-widest mb-1">Orders</p>
               <p className="text-sm font-black text-white uppercase tracking-tight">14 Units</p>
            </div>
         </div>
      </div>

      {/* Integration Links */}
      <div className="space-y-6">
         <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Connected Ecosystem</h4>
         
         {/* Marketplace Context */}
         <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4 group">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3 text-emerald-500">
                  <ShoppingBag size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Marketplace History</span>
               </div>
               <ExternalLink size={14} className="text-muted-custom group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-3">
               <div className="flex justify-between items-center text-[11px] font-medium text-main">
                  <span className="text-muted-custom">Last Order</span>
                  <span>#ORD-98210</span>
               </div>
               <div className="flex justify-between items-center text-[11px] font-medium text-main">
                  <span className="text-muted-custom">Status</span>
                  <span className="text-emerald-500 font-black uppercase text-[9px]">Shipped</span>
               </div>
            </div>
         </div>

         {/* Events Context */}
         <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4 group">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3 text-blue-500">
                  <Calendar size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Event Attendance</span>
               </div>
               <ExternalLink size={14} className="text-muted-custom group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-3">
               <div className="flex justify-between items-center text-[11px] font-medium text-main">
                  <span className="text-muted-custom">Last Event</span>
                  <span>Nairobi Tech Fest</span>
               </div>
               <div className="flex justify-between items-center text-[11px] font-medium text-main">
                  <span className="text-muted-custom">Check-in</span>
                  <span className="text-blue-500 font-black uppercase text-[9px]">Verified</span>
               </div>
            </div>
         </div>
      </div>

      {/* Support Metadata */}
      <div className="space-y-4">
         <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Support Metadata</h4>
         <div className="space-y-2">
            <div className="flex items-center gap-3 text-muted-custom">
               <Activity size={14} />
               <span className="text-[10px] font-bold uppercase">Customer Health: 9.8/10</span>
            </div>
            <div className="flex items-center gap-3 text-muted-custom">
               <ShieldCheck size={14} />
               <span className="text-[10px] font-bold uppercase">KPP Verified Profile</span>
            </div>
            <div className="flex items-center gap-3 text-muted-custom">
               <CreditCard size={14} />
               <span className="text-[10px] font-bold uppercase">Stored Payment Active</span>
            </div>
         </div>
      </div>

    </div>
  );
}
