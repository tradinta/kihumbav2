"use client";

import { useState } from "react";
import { ShoppingBag, Store, Monitor, LayoutGrid, Ticket, ChevronRight, Check, AlertCircle, ShoppingCart } from "lucide-react";

export const MARKETPLACE_FORMAT_DATA: Record<string, { name: string; desc: string; icon: any; specs: string }> = {
  "product-card": { name: "Product Card", desc: "Native marketplace format with price & rating.", icon: ShoppingBag, specs: "Requires valid Marketplace Product ID" },
  "store-card": { name: "Store Card", desc: "Seller brand card with logo & rating.", icon: Store, specs: "Store Sync mandatory" },
  "banner": { name: "Horizontal Banner", desc: "Standard 728x90px or 320x50px promo graphic.", icon: Monitor, specs: "Max 2MB • JPG/PNG/GIF" },
  "carousel": { name: "Product Carousel", desc: "Multiple products from the same seller (up to 10).", icon: LayoutGrid, specs: "Minimum 3 products required" },
  "offer-card": { name: "Offer Card", desc: "Discount/coupon format for checkout pages.", icon: Ticket, specs: "Requires active Promotion Code" },
};

const MARKETPLACE_CTA_OPTIONS = ["Buy Now", "Add to Cart", "View Store", "Claim Offer", "Compare"];

export default function MarketplaceMaterialStage({ 
  allowedFormats, 
  selected, 
  onSelect 
}: { 
  allowedFormats: string[], 
  selected: string | null, 
  onSelect: (id: string) => void 
}) {
  const [itemId, setItemId] = useState("");
  const [cta, setCta] = useState(MARKETPLACE_CTA_OPTIONS[0]);

  return (
    <div className="space-y-12">
      {/* Format Selection Grid */}
      <div className="space-y-4">
        <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom">Select Commerce Ad Format</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allowedFormats.map((fId) => {
            const f = MARKETPLACE_FORMAT_DATA[fId];
            return (
              <button 
                key={fId}
                onClick={() => onSelect(fId)}
                className={`flex flex-col gap-4 p-5 rounded-xl border transition-all text-left group ${
                  selected === fId 
                   ? "border-primary-gold bg-primary-gold/5" 
                   : "border-custom hover:border-white/20 bg-white/[0.02]"
                }`}
              >
                <div className={`size-12 rounded-lg border flex items-center justify-center transition-all ${
                  selected === fId 
                    ? "border-primary-gold/40 text-primary-gold" 
                    : "border-white/10 text-muted-custom group-hover:text-main"
                }`}>
                  <f.icon size={24} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest">{f.name}</p>
                  <p className="text-[10px] font-medium text-muted-custom mt-1 leading-relaxed">{f.desc}</p>
                  <p className="text-[8px] font-black text-primary-gold/60 uppercase mt-3">{f.specs}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sync Section (Conditional on Format Selection) */}
      {selected && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pt-8 border-t border-custom">
          <div className="md:col-span-7 space-y-8">
             <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-muted-custom mb-3">
                  {selected === 'store-card' ? 'Store ID' : selected === 'offer-card' ? 'Promotion ID' : 'Marketplace Product ID'}
                </label>
                <div className="flex gap-2">
                   <input 
                     type="text" 
                     value={itemId}
                     onChange={(e) => setItemId(e.target.value)}
                     placeholder={selected === 'store-card' ? "e.g. STORE-X92" : "e.g. PROD-8821-SOLAR"} 
                     className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm font-black text-main focus:outline-none focus:border-primary-gold/50 transition-all font-mono"
                   />
                   <button className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                      Verify
                   </button>
                </div>
                {itemId && (
                   <div className="mt-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-3">
                      <div className="size-10 bg-white/10 rounded-md shrink-0 flex items-center justify-center text-muted-custom">
                         <ShoppingCart size={20} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-main uppercase">Linked: Portable Solar Generator</p>
                         <p className="text-[9px] font-bold text-muted-custom">Price: KES 45,000 • Stock: 14 units</p>
                      </div>
                      <Check className="text-emerald-500 ml-auto" size={16} />
                   </div>
                )}
             </div>

             <div className="p-6 rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-white/5 transition-all">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-custom">Marketplace Render Engine</p>
                <div className="w-full aspect-square max-w-[200px] bg-black rounded-lg border border-white/5 flex items-center justify-center">
                   <p className="text-[9px] font-black uppercase text-white/20">Product UI Preview</p>
                </div>
             </div>
          </div>

          <div className="md:col-span-5 space-y-8">
             <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-muted-custom mb-3">Conversion CTA</label>
                <div className="grid grid-cols-1 gap-2">
                   {MARKETPLACE_CTA_OPTIONS.map((option) => (
                      <button 
                        key={option}
                        onClick={() => setCta(option)}
                        className={`px-4 py-3 rounded-lg border text-left text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between group ${
                           cta === option 
                             ? "bg-primary-gold text-black border-primary-gold" 
                             : "bg-white/5 border-white/10 text-muted-custom hover:border-white/20"
                        }`}
                      >
                         {option}
                         <ChevronRight size={14} className={cta === option ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"} />
                      </button>
                   ))}
                </div>
             </div>

             <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-start gap-3">
                <AlertCircle size={16} className="text-blue-500 shrink-0" />
                <p className="text-[9px] font-bold text-blue-500/80 leading-relaxed">
                   Marketplace ads automatically sync with your live inventory. If an item goes out of stock, the campaign is auto-paused.
                </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
