"use client";

import { useState } from "react";
import { 
  ShoppingBag, 
  Truck, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Search,
  ChevronRight,
  Package,
  ArrowUpRight
} from "lucide-react";

const MOCK_ORDERS = [
  { id: "ORD-8821", customer: "John Kamau", total: "KES 14,200", status: "Processing", date: "Apr 19, 2026", items: 3 },
  { id: "ORD-8822", customer: "Amara Okeke", total: "KES 2,500", status: "Shipped", date: "Apr 19, 2026", items: 1 },
  { id: "ORD-8823", customer: "Sarah Wanjiku", total: "KES 5,800", status: "Delivered", date: "Apr 18, 2026", items: 2 },
  { id: "ORD-8824", customer: "Michael Chen", total: "KES 1,200", status: "Cancelled", date: "Apr 17, 2026", items: 1 },
];

export default function OrdersTab() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Fulfillment Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <OrderMetric label="Total Orders" value="1,240" sub="+12% this week" icon={<ShoppingBag size={18} />} />
        <OrderMetric label="Processing" value="45" sub="Awaiting Pick-up" icon={<Clock size={18} />} color="text-amber-500" />
        <OrderMetric label="In Transit" value="18" sub="via Fleet Sync" icon={<Truck size={18} />} color="text-blue-500" />
        <OrderMetric label="Delivered" value="1,177" sub="98% Success Rate" icon={<CheckCircle2 size={18} />} color="text-emerald-500" />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-custom">Order Ledger</h3>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-custom" />
                <input 
                  type="text" 
                  placeholder="Filter by Order ID / Name..." 
                  className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black focus:outline-none focus:border-primary-gold/30 w-64 uppercase tracking-widest"
                />
             </div>
          </div>
        </div>

        <div className="border border-white/5 rounded-3xl overflow-hidden bg-white/[0.01]">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom">Order ID</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom">Status</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom">Customer</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom">Items</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom text-right">Total</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MOCK_ORDERS.map((ord) => (
                <tr key={ord.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 font-mono font-bold text-white tracking-tighter">{ord.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`size-1.5 rounded-full ${
                        ord.status === 'Delivered' ? 'bg-emerald-500' : 
                        ord.status === 'Shipped' ? 'bg-blue-500' : 
                        ord.status === 'Processing' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">{ord.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <p className="font-black text-white">{ord.customer}</p>
                     <p className="text-[9px] font-bold text-muted-custom uppercase mt-0.5 tracking-widest">{ord.date}</p>
                  </td>
                  <td className="px-6 py-4 font-black text-muted-custom uppercase">{ord.items} Items</td>
                  <td className="px-6 py-4 text-right font-black text-emerald-500">{ord.total}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 rounded-xl hover:bg-white/5 text-muted-custom hover:text-white transition-all">
                       <ArrowUpRight size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Logistics Coordination */}
      <div className="p-6 rounded-3xl border border-blue-500/20 bg-blue-500/5 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
               <Package size={24} />
            </div>
            <div>
               <h4 className="text-xs font-black uppercase tracking-widest text-white">Bulk Fulfillment Ready</h4>
               <p className="text-[10px] font-bold text-muted-custom uppercase tracking-widest mt-0.5">14 Orders can be processed for afternoon dispatch.</p>
            </div>
         </div>
         <button className="px-6 py-3 rounded-xl bg-blue-500 text-black text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all">
            Generate Shipping Labels
         </button>
      </div>
    </div>
  );
}

function OrderMetric({ label, value, sub, icon, color = "text-white" }: any) {
  return (
    <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-3">
      <div className="flex items-center justify-between text-muted-custom">
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        {icon}
      </div>
      <div>
        <p className={`text-2xl font-black tracking-tighter ${color}`}>{value}</p>
        <p className="text-[10px] font-bold text-muted-custom uppercase mt-1 tracking-widest">{sub}</p>
      </div>
    </div>
  );
}
