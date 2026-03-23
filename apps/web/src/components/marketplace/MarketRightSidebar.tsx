"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Building2, MapPin, ArrowUpRight, Star, Eye, TrendingUp,
  Truck, ShieldCheck, Tag, Package
} from "lucide-react";

const TRENDING_CATEGORIES = [
  { name: "Electronics", count: 342, icon: "⚡" },
  { name: "Fashion", count: 218, icon: "👗" },
  { name: "Furniture", count: 156, icon: "🪑" },
  { name: "Vehicles", count: 89, icon: "🚗" },
  { name: "Books", count: 201, icon: "📚" },
];

const TOP_SELLERS = [
  { id: "s1", name: "TechHub KE", rating: 4.9, deals: 142, verified: true, avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100" },
  { id: "s2", name: "FashionNairobi", rating: 4.7, deals: 89, verified: true, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100" },
  { id: "s3", name: "HomeGoods254", rating: 4.8, deals: 67, verified: true, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100" },
];

export default function MarketRightSidebar() {
  return (
    <aside className="hidden xl:flex flex-col w-72 pt-8 pb-12 sticky-sidebar shrink-0 overflow-y-auto no-scrollbar">
      {/* Trending Categories */}
      <div className="mb-6">
        <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3 px-1">
          Trending Categories
        </h2>
        <div className="space-y-1.5">
          {TRENDING_CATEGORIES.map((cat) => (
            <div key={cat.name} className="card-surface rounded-lg px-3 py-2 flex items-center gap-2.5 cursor-pointer hover:border-primary-gold/30 transition-all">
              <span className="text-sm">{cat.icon}</span>
              <span className="flex-1 text-[10px] font-bold uppercase tracking-widest">{cat.name}</span>
              <span className="text-[9px] font-bold text-muted-custom">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Verified Sellers */}
      <div className="mb-6">
        <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3 px-1">
          Top Verified Sellers
        </h2>
        <div className="space-y-2">
          {TOP_SELLERS.map((seller) => (
            <Link key={seller.id} href={`/marketplace/seller/${seller.id}`}>
              <div className="card-surface rounded-lg p-2.5 flex items-center gap-2.5 cursor-pointer hover:border-primary-gold/30 transition-all">
                <div className="relative shrink-0">
                  <Image src={seller.avatar} alt={seller.name} width={32} height={32} className="rounded object-cover" />
                  {seller.verified && (
                    <div className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-sm bg-primary-gold flex items-center justify-center">
                      <ShieldCheck size={8} className="text-black" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest truncate">{seller.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-0.5 text-[8px] font-bold text-primary-gold">
                      <Star size={8} className="fill-primary-gold" /> {seller.rating}
                    </span>
                    <span className="text-[8px] text-muted-custom">{seller.deals} deals</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Sacco Delivery Explainer */}
      <div className="mb-6">
        <div className="card-surface rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-8 rounded bg-primary-gold/10 flex items-center justify-center text-primary-gold border border-primary-gold/20">
              <Truck size={16} />
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest">Sacco Delivery</h3>
          </div>
          <p className="text-[9px] text-muted-custom leading-relaxed mb-3">
            Verified sellers can link up with approved Saccos for quick parcel deliveries. Money is held in escrow until the delivery driver marks your parcel as received.
          </p>
          <div className="space-y-1.5 mb-3">
            {["Pay & hold in escrow", "Sacco driver picks up parcel", "Driver delivers & confirms", "Money released to seller"].map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="size-4 rounded-sm bg-primary-gold/10 text-primary-gold text-[8px] font-bold flex items-center justify-center border border-primary-gold/20">{i + 1}</span>
                <span className="text-[9px] font-bold text-muted-custom">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Become Verified Seller CTA */}
      <div className="card-surface rounded-lg p-4 text-center">
        <div className="size-10 rounded bg-primary-gold/10 flex items-center justify-center text-primary-gold border border-primary-gold/20 mx-auto mb-2">
          <ShieldCheck size={18} />
        </div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest mb-1">Become a Verified Seller</h3>
        <p className="text-[9px] text-muted-custom mb-3 leading-relaxed">
          Get the marketplace checkmark, access Sacco delivery, and build buyer trust.
        </p>
        <button className="w-full bg-primary-gold text-black py-2.5 text-[9px] font-bold uppercase tracking-[0.2em] hover:brightness-110 transition-all rounded shadow-lg shadow-primary-gold/10 active:scale-[0.98] flex items-center justify-center gap-1">
          sellers.kihumba.com <ArrowUpRight size={10} />
        </button>
      </div>
    </aside>
  );
}
