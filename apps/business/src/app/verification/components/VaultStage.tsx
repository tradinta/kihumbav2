"use client";

import { Plus } from "lucide-react";

export default function VaultStage({ data, updateData }: any) {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-4xl font-black tracking-tighter leading-none mb-4">The Regulatory Vault.</h2>
        <p className="text-sm font-medium text-muted-custom">Upload scanned legal documentation to finalize your trust profile.</p>
      </div>

      <div className="space-y-6">
        <UploadZone title="Certificate of Incorporation" desc="PDF/JPG • Required for Corporate entities" />
        <UploadZone title="KRA PIN Certificate" desc="Latest format with verifiable QR code" />
        <UploadZone title="Director National ID (Front/Back)" desc="Clear, high-resolution scan or photo" />
        <div className="space-y-4 pt-6">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-custom">KRA PIN Number</label>
          <input 
            type="text" 
            placeholder="e.g. P051XXXXXXX" 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm font-black text-main focus:outline-none focus:border-primary-gold/50 transition-all font-mono"
            value={data.kraPin}
            onChange={(e) => updateData({ kraPin: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

function UploadZone({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-8 rounded-2xl border border-dashed border-white/10 bg-white/[0.01] flex flex-col items-center justify-center text-center gap-4 group cursor-pointer hover:bg-white/[0.03] hover:border-primary-gold/30 transition-all">
      <div className="size-12 rounded-full bg-white/5 flex items-center justify-center text-muted-custom group-hover:text-primary-gold transition-colors">
        <Plus size={24} />
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-main">{title}</p>
        <p className="text-[10px] font-bold text-muted-custom mt-1 uppercase tracking-widest">{desc}</p>
      </div>
    </div>
  );
}
