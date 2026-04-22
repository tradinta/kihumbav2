"use client";

import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  FileText,
  CreditCard,
  Zap,
  ShieldCheck
} from "lucide-react";

const SALES_HISTORY = [
  { id: "STL-901", amount: "KES 14,200", status: "Settled", date: "Apr 19, 2026", type: "Order #8821" },
  { id: "STL-902", amount: "KES 2,500", status: "Settled", date: "Apr 19, 2026", type: "Order #8822" },
  { id: "STL-903", amount: "KES 5,800", status: "In Escrow", date: "Apr 18, 2026", type: "Order #8823" },
];

export default function FinancialsTab() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Commerce Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FinanceMetric label="Net Sales (30d)" value="KES 1.8M" delta="+15%" icon={<DollarSign size={18} />} />
        <FinanceMetric label="Total Escrow" value="KES 420k" sub="Pending Delivery" icon={<Clock size={18} />} color="text-amber-500" />
        <FinanceMetric label="Platform Fees" value="KES 90k" sub="5% Average" icon={<ShieldCheck size={18} />} />
        <FinanceMetric label="Ready for Payout" value="KES 1.2M" sub="Verified Balance" icon={<Zap size={18} />} color="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settlement Ledger */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-custom">Commerce Settlement Ledger</h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary-gold hover:underline transition-all flex items-center gap-1">
              <FileText size={14} /> View Tax Invoice
            </button>
          </div>

          <div className="border border-white/5 rounded-3xl overflow-hidden bg-white/[0.01]">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom">Settlement ID</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom">Type</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom">Status</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom">Date</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {SALES_HISTORY.map((stl) => (
                  <tr key={stl.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 font-mono font-bold text-white tracking-tighter">{stl.id}</td>
                    <td className="px-6 py-4 font-black text-muted-custom uppercase">{stl.type}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`size-1.5 rounded-full ${
                          stl.status === 'Settled' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'
                        }`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">{stl.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-custom font-black uppercase tracking-widest">{stl.date}</td>
                    <td className="px-6 py-4 text-right font-black text-white">{stl.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Security Panel */}
        <div className="space-y-6">
           <h3 className="text-xs font-black uppercase tracking-widest text-muted-custom">Payout Integrity</h3>
           <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-6">
              <div className="flex items-center gap-4">
                 <div className="size-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 size={24} />
                 </div>
                 <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-white">Commercial Bank Verified</h4>
                    <p className="text-[10px] font-bold text-muted-custom uppercase tracking-widest mt-0.5">Equity Bank • **** 8291</p>
                 </div>
              </div>
              
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                 <p className="text-[9px] font-black uppercase tracking-widest text-muted-custom">Escrow Protocol</p>
                 <p className="text-[11px] font-medium text-main/80 leading-relaxed uppercase">
                    Funds for **3 Orders** are currently locked in escrow until customer confirms delivery or 7 days elapse.
                 </p>
              </div>

              <button className="w-full py-4 rounded-xl bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-emerald-500/10">
                Disburse Verified Balance
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function FinanceMetric({ label, value, delta, sub, icon, color = "text-white" }: any) {
  return (
    <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-3">
      <div className="flex items-center justify-between text-muted-custom">
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        {icon}
      </div>
      <div>
        <div className="flex items-baseline gap-2">
           <p className={`text-2xl font-black tracking-tighter ${color}`}>{value}</p>
           {delta && <span className="text-[10px] font-black text-emerald-500 uppercase">{delta}</span>}
        </div>
        <p className="text-[10px] font-bold text-muted-custom uppercase mt-1 tracking-widest">{sub || "Historical Aggregate"}</p>
      </div>
    </div>
  );
}
