"use client";

import { Building2, CheckCircle2 } from "lucide-react";

export default function ProfileStage({ data, updateData }: any) {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-4xl font-black tracking-tighter leading-none mb-4">Establish your legal entity.</h2>
        <p className="text-sm font-medium text-muted-custom">Identify your organization and sector to ensure platform compliance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EntityOption 
          active={data.entityType === 'Company'} 
          onClick={() => updateData({ entityType: 'Company' })}
          title="Corporate Entity" 
          desc="For Ltd, PLC, and NGOs." 
          icon={<Building2 size={24} />} 
        />
        <EntityOption 
          active={data.entityType === 'Individual'} 
          onClick={() => updateData({ entityType: 'Individual' })}
          title="Sole Proprietor" 
          desc="For individual creators and micro-shops." 
          icon={<CheckCircle2 size={24} />} 
        />
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Legal Registered Name</label>
          <input 
            type="text" 
            placeholder="As per Certificate of Incorporation" 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm font-black text-main focus:outline-none focus:border-primary-gold/50 transition-all"
            value={data.legalName}
            onChange={(e) => updateData({ legalName: e.target.value })}
          />
        </div>
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Trading Name (DBA)</label>
          <input 
            type="text" 
            placeholder="How customers will see your store" 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm font-black text-main focus:outline-none focus:border-primary-gold/50 transition-all"
            value={data.tradeName}
            onChange={(e) => updateData({ tradeName: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

function EntityOption({ title, desc, icon, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col gap-4 p-6 rounded-2xl border text-left transition-all group ${
        active ? "border-primary-gold bg-primary-gold/5" : "border-white/10 bg-white/[0.02] hover:border-white/20"
      }`}
    >
      <div className={`size-12 rounded-xl border flex items-center justify-center transition-all ${
        active ? "border-primary-gold/40 text-primary-gold" : "border-white/10 text-muted-custom group-hover:text-main"
      }`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest">{title}</p>
        <p className="text-[10px] font-medium text-muted-custom mt-1 leading-relaxed">{desc}</p>
      </div>
    </button>
  );
}
