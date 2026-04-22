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
  Zap
} from "lucide-react";

const PAYOUT_HISTORY = [
  { id: "PAY-001", amount: "KES 1.2M", status: "Settled", date: "Apr 18, 2026", method: "Commercial Bank" },
  { id: "PAY-002", amount: "KES 450k", status: "Processing", date: "Apr 19, 2026", method: "M-Pesa Till" },
  { id: "PAY-003", amount: "KES 890k", status: "Pending", date: "Apr 20, 2026", method: "Commercial Bank" },
];

export default function FinancialsTab() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* Revenue Architecture Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FinanceMetric label="Gross Ticket Revenue" value="KES 6.4M" delta="+12%" icon={<DollarSign size={18} />} />
        <FinanceMetric label="Settled Funds" value="KES 4.8M" sub="75% Disbursed" icon={<Zap size={18} />} color="text-emerald-500" />
        <FinanceMetric label="In Escrow" value="KES 1.2M" sub="Pending Event Audit" icon={<Clock size={18} />} color="text-amber-500" />
        <FinanceMetric label="Net Profit (Est)" value="KES 5.1M" delta="+8%" icon={<TrendingUp size={18} />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Payout Ledger */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-custom">Settlement Ledger</h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary-gold hover:underline transition-all flex items-center gap-1">
              <FileText size={14} /> Export Report
            </button>
          </div>

          <div className="border border-white/5 rounded-3xl overflow-hidden bg-white/[0.01]">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom">Settlement ID</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom">Status</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom">Method</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom">Date</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-muted-custom text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {PAYOUT_HISTORY.map((pay) => (
                  <tr key={pay.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 font-mono font-bold text-white tracking-tighter">{pay.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`size-1.5 rounded-full ${
                          pay.status === 'Settled' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                          pay.status === 'Processing' ? 'bg-amber-500' : 'bg-muted-custom'
                        }`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">{pay.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 text-muted-custom">
                          <CreditCard size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{pay.method}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-muted-custom font-black uppercase tracking-widest">{pay.date}</td>
                    <td className="px-6 py-4 text-right font-black text-white">{pay.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payout Configuration */}
        <div className="space-y-6">
           <h3 className="text-xs font-black uppercase tracking-widest text-muted-custom">Payout Architecture</h3>
           <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.01] space-y-6">
              <div className="flex items-center gap-4">
                 <div className="size-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 size={24} />
                 </div>
                 <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-white">Bank Account Verified</h4>
                    <p className="text-[10px] font-bold text-muted-custom uppercase tracking-widest mt-0.5">Equity Bank • **** 8291</p>
                 </div>
              </div>
              
              <div className="space-y-3">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-custom">
                    <span>Platform Commission</span>
                    <span className="text-white">5%</span>
                 </div>
                 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-gold w-[5%]" />
                 </div>
              </div>

              <button className="w-full py-4 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-all">
                Request Instant Payout
              </button>
              
              <p className="text-[9px] font-medium text-muted-custom text-center leading-relaxed italic">
                *Settlements are processed automatically every Monday and Thursday for events with over 80% audit completion.
              </p>
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
