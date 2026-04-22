"use client";

import { CreditCard, Phone, Lock } from "lucide-react";

export default function SettlementStage({ data, updateData }: any) {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-4xl font-black tracking-tighter leading-none mb-4">Payout Architecture.</h2>
        <p className="text-sm font-medium text-muted-custom">Connect your commercial bank or M-Pesa Till for automated settlements.</p>
      </div>

      <div className="space-y-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Primary Settlement Channel</label>
            <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1"><Lock size={10} /> Encrypted Payout</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => updateData({ settlementType: 'Bank' })}
              className={`p-6 rounded-2xl border flex items-center gap-4 transition-all ${
                data.settlementType === 'Bank' ? "border-primary-gold bg-primary-gold/5" : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <div className={`size-10 rounded-lg flex items-center justify-center ${
                data.settlementType === 'Bank' ? "bg-primary-gold/10 text-primary-gold" : "bg-white/5 text-muted-custom"
              }`}><CreditCard size={20} /></div>
              <p className="text-[11px] font-black uppercase tracking-widest">Commercial Bank</p>
            </button>
            <button 
              onClick={() => updateData({ settlementType: 'M-Pesa' })}
              className={`p-6 rounded-2xl border flex items-center gap-4 transition-all ${
                data.settlementType === 'M-Pesa' ? "border-primary-gold bg-primary-gold/5" : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <div className={`size-10 rounded-lg flex items-center justify-center ${
                data.settlementType === 'M-Pesa' ? "bg-primary-gold/10 text-primary-gold" : "bg-white/5 text-muted-custom"
              }`}><Phone size={20} /></div>
              <p className="text-[11px] font-black uppercase tracking-widest">M-Pesa Till</p>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Institution Name</label>
            <select 
              value={data.bankName}
              onChange={(e) => updateData({ bankName: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm font-black text-main focus:outline-none transition-all appearance-none"
            >
              <option>Safaricom (M-Pesa)</option>
              <option>Equity Bank</option>
              <option>KCB Bank</option>
              <option>Standard Chartered</option>
            </select>
          </div>
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Account Number / Till</label>
            <input 
              type="text" 
              placeholder="Enter verified details" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm font-black text-main focus:outline-none focus:border-primary-gold/50 transition-all"
              value={data.accountNo}
              onChange={(e) => updateData({ accountNo: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
