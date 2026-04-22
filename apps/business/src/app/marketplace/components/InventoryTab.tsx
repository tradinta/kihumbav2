"use client";

import { useState } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Package, 
  AlertTriangle,
  Tag,
  Eye,
  Edit3,
  Trash2
} from "lucide-react";

const MOCK_PRODUCTS = [
  { id: "PROD-101", name: "Premium Leather Tote", stock: 45, price: "KES 4,500", status: "Active", category: "Bags" },
  { id: "PROD-202", name: "Organic Cotton Tee", stock: 0, price: "KES 1,200", status: "Out of Stock", category: "Apparel" },
  { id: "PROD-303", name: "Recycled Glass Vase", stock: 12, price: "KES 2,800", status: "Active", category: "Home" },
];

export default function InventoryTab() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-white">Inventory Management</h2>
          <p className="text-xs font-bold text-muted-custom uppercase tracking-widest mt-1">Control your product vault and stock levels.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 focus-within:border-primary-gold/30 transition-all">
            <Search size={16} className="text-muted-custom" />
            <input 
              type="text" 
              placeholder="Search products / SKUs..." 
              className="bg-transparent border-none text-[11px] font-black focus:outline-none w-48 uppercase tracking-widest" 
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-gold text-black text-[11px] font-black uppercase tracking-widest hover:brightness-110 transition-all">
            <Plus size={16} /> New Product
          </button>
        </div>
      </div>

      <div className="border border-white/5 rounded-3xl overflow-hidden bg-white/[0.01]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-custom">Product / SKU</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-custom">Status</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-custom">Category</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-custom text-right">Stock</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-custom text-right">Price</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-custom text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_PRODUCTS.map((prod) => (
              <tr key={prod.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-primary-gold border border-white/5">
                      <Package size={18} />
                    </div>
                    <div>
                      <p className="text-[12px] font-black text-white">{prod.name}</p>
                      <p className="text-[9px] font-bold text-muted-custom font-mono mt-0.5 tracking-tighter">{prod.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className={`size-1.5 rounded-full ${
                      prod.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 
                      prod.status === 'Out of Stock' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]' : 
                      'bg-muted-custom'
                    }`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{prod.status}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="px-2 py-0.5 rounded border border-white/10 text-[9px] font-black uppercase tracking-widest text-muted-custom">
                    {prod.category}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className={`text-[11px] font-black ${prod.stock === 0 ? 'text-red-500' : 'text-white'}`}>{prod.stock} Units</span>
                    {prod.stock <= 5 && prod.stock > 0 && <AlertTriangle size={14} className="text-amber-500" />}
                  </div>
                </td>
                <td className="px-8 py-6 text-right text-[12px] font-black text-emerald-500">{prod.price}</td>
                <td className="px-8 py-6 text-center">
                  <div className="flex justify-center gap-1">
                    <button className="p-2.5 rounded-xl hover:bg-white/5 text-muted-custom hover:text-white transition-all">
                      <Edit3 size={18} />
                    </button>
                    <button className="p-2.5 rounded-xl hover:bg-white/5 text-muted-custom hover:text-white transition-all">
                      <Eye size={18} />
                    </button>
                    <button className="p-2.5 rounded-xl hover:bg-red-500/10 text-muted-custom hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stock Alerts */}
      <div className="p-6 rounded-3xl border border-red-500/20 bg-red-500/5 flex items-start gap-4">
         <AlertTriangle size={20} className="text-red-500 shrink-0 mt-1" />
         <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">Critical Stock Warning</h4>
            <p className="text-[11px] font-medium text-main/70 leading-relaxed uppercase">
               **2 Products** are currently out of stock. **14 Products** are below the reorder threshold. 
               Revenue impact is estimated at **-KES 140k/week**.
            </p>
         </div>
      </div>
    </div>
  );
}
