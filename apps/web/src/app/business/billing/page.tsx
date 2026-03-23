"use client";

import { motion } from "framer-motion";
import { 
  Wallet,
  ArrowRightLeft,
  CircleDollarSign,
  Download,
  CreditCard,
  Building2
} from "lucide-react";
import { businessData } from "@/data/businessData";

export default function BillingManager() {
  const { wallet } = businessData;

  const demoTransactions = [
    { id: "tx1", date: "Nov 03, 2024", type: "Ad Spend", desc: "November Flash Sale (Feed)", amount: -12500, status: "Deducted" },
    { id: "tx2", date: "Nov 02, 2024", type: "Deposit", desc: "M-Pesa Top Up", amount: 50000, status: "Completed" },
    { id: "tx3", date: "Oct 28, 2024", type: "Campaign", desc: "Payout to Kamau_n", amount: -25000, status: "Paid" },
    { id: "tx4", date: "Oct 25, 2024", type: "Ad Spend", desc: "Luxury Estate Boost", amount: -45000, status: "Deducted" },
    { id: "tx5", date: "Oct 15, 2024", type: "Deposit", desc: "Corporate Bank Transfer", amount: 200000, status: "Completed" },
  ];

  const StatusPill = ({ status }: { status: string }) => {
    let styles = "bg-custom text-muted-custom border-custom";
    if (status === "Completed") styles = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    if (status === "Deducted" || status === "Paid") styles = "bg-blue-500/10 text-blue-500 border-blue-500/20";
    
    return (
      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${styles}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-main">Billing & Wallet</h1>
          <p className="text-[11px] font-bold text-muted-custom uppercase tracking-widest mt-1">
            Manage your Business Ad Account balance
          </p>
        </div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[var(--pill-bg)] border border-custom rounded-lg text-[10px] font-bold uppercase tracking-widest hover:border-custom-hover transition-colors flex items-center gap-2">
            <Download size={14} /> Invoices
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20">
            <ArrowRightLeft size={14} /> Add Funds
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Wallet Balance Card */}
        <div className="lg:col-span-2 card-surface p-6 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-transparent relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:opacity-20 transition-all">
            <Wallet size={120} className="text-blue-500" />
          </div>
          
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-blue-500 mb-8 flex items-center gap-2 relative z-10">
            Ad Account Balance
          </h2>
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-between sm:items-end gap-6">
             <div>
               <span className="text-sm font-bold text-muted-custom mb-1 block">Available KES</span>
               <div className="flex items-baseline gap-2">
                 <span className="text-5xl font-black tracking-tight">{(wallet.availableBalanceKES / 1000).toFixed(1)}k</span>
               </div>
             </div>
             
             <div className="flex gap-4 border-t sm:border-t-0 sm:border-l border-blue-500/20 pt-4 sm:pt-0 sm:pl-6">
                <div>
                  <span className="block text-[9px] uppercase font-bold text-blue-500 tracking-widest mb-0.5">YTD Ad Spend</span>
                  <span className="block text-sm font-bold opacity-80">KES {(wallet.totalSpentYTD / 1000).toFixed(1)}k</span>
                </div>
                <div className="w-px bg-blue-500/20 hidden sm:block" />
                <div>
                  <span className="block text-[9px] uppercase font-bold text-blue-500 tracking-widest mb-0.5">Last Deposit</span>
                  <span className="block text-sm font-bold opacity-80">+ KES {wallet.lastDepositAmount.toLocaleString()}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="card-surface p-6 rounded-2xl border border-custom flex flex-col">
           <h2 className="text-[12px] font-bold uppercase tracking-widest text-main mb-6 flex items-center gap-2">
             Payment Methods
           </h2>
           
           <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--pill-bg)] border border-custom">
                 <div className="flex items-center gap-3">
                    <CircleDollarSign size={16} className="text-emerald-500" />
                    <div>
                      <p className="text-[11px] font-bold">M-Pesa Paybill</p>
                      <p className="text-[9px] font-bold text-muted-custom uppercase tracking-widest">Default</p>
                    </div>
                 </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--pill-bg)] border border-custom opacity-50">
                 <div className="flex items-center gap-3">
                    <CreditCard size={16} />
                    <div>
                      <p className="text-[11px] font-bold">Visa ending in 4242</p>
                      <p className="text-[9px] font-bold text-muted-custom uppercase tracking-widest">Corporate</p>
                    </div>
                 </div>
              </div>
           </div>
           
           <button className="w-full mt-4 py-2 border border-custom text-[10px] uppercase font-bold tracking-widest text-muted-custom rounded-lg hover:text-main hover:border-custom-hover transition-all">
             Add Method
           </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="card-surface rounded-2xl border border-custom overflow-hidden">
        <div className="p-5 border-b border-custom flex justify-between items-center bg-[var(--pill-bg)]">
          <h3 className="text-[12px] font-bold uppercase tracking-widest text-main">Transaction History</h3>
          <button className="text-[9px] uppercase font-bold tracking-widest text-blue-500 hover:text-main transition-colors flex items-center gap-1">
            <Download size={12} /> Export CSV
          </button>
        </div>
        
        <div className="w-full overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-custom/50">
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-custom">Date</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-custom">Description</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-custom">Type</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-custom text-right">Amount</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-custom text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {demoTransactions.map((tx, i) => (
                <motion.tr 
                  key={tx.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-custom/50 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <span className="text-[11px] font-bold text-muted-custom">{tx.date}</span>
                  </td>
                  
                  <td className="p-4">
                    <span className="text-[12px] font-bold text-main block">{tx.desc}</span>
                  </td>
                  
                  <td className="p-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-custom border border-custom px-2 py-0.5 rounded bg-[var(--pill-bg)]">
                      {tx.type}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <span className={`text-[12px] font-black ${tx.amount > 0 ? "text-emerald-400" : "text-main"}`}>
                      {tx.amount > 0 ? "+" : ""}KES {Math.abs(tx.amount).toLocaleString()}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end">
                      <StatusPill status={tx.status} />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
