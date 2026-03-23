"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  MapPin,
  ArrowUpRight,
  Star,
  Eye,
  TrendingUp,
  Flame,
} from "lucide-react";

const AD_LISTINGS = [
  {
    id: "ad-1",
    title: "3BR Penthouse — Westlands",
    price: "KES 85,000/mo",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=400",
    location: "Westlands, Nairobi",
    tag: "Premium",
    views: "2.1k",
  },
  {
    id: "ad-2",
    title: "Modern Studio — Kilimani",
    price: "KES 45,000/mo",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400",
    location: "Kilimani, Nairobi",
    tag: "Hot",
    views: "1.8k",
  },
  {
    id: "ad-3",
    title: "4BR Villa — Karen",
    price: "KES 150,000/mo",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400",
    location: "Karen, Nairobi",
    tag: "Exclusive",
    views: "956",
  },
];

const QUICK_STATS = [
  { label: "Active Listings", value: "2,847", icon: Building2 },
  { label: "Avg Rent Nairobi", value: "KES 22k", icon: TrendingUp },
  { label: "New This Week", value: "134", icon: Flame },
];

export default function KaoRightSidebar() {
  return (
    <aside className="hidden xl:flex flex-col w-72 pt-8 pb-12 sticky-sidebar shrink-0 overflow-y-auto no-scrollbar">
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3 px-1">
          Kao Market Pulse
        </h2>
        <div className="space-y-2">
          {QUICK_STATS.map((stat) => (
            <div
              key={stat.label}
              className="card-surface rounded-lg px-3 py-2.5 flex items-center gap-3"
            >
              <div className="size-7 rounded bg-primary-gold/10 flex items-center justify-center text-primary-gold border border-primary-gold/20">
                <stat.icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-custom truncate">
                  {stat.label}
                </p>
                <p className="text-xs font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promoted Listings */}
      <div className="mb-6">
        <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3 px-1">
          Promoted Homes
        </h2>
        <div className="space-y-3">
          {AD_LISTINGS.map((ad) => (
            <Link key={ad.id} href={`/kao/${ad.id}`}>
              <div className="card-surface rounded-lg overflow-hidden group cursor-pointer hover:border-primary-gold/30 transition-all">
                <div className="relative h-28 overflow-hidden">
                  <Image
                    src={ad.image}
                    alt={ad.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-2 left-2 bg-primary-gold/90 text-black text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded">
                    {ad.tag}
                  </span>
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="text-[10px] font-bold text-primary-gold">
                      {ad.price}
                    </span>
                  </div>
                </div>
                <div className="p-2.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest truncate group-hover:text-primary-gold transition-colors">
                    {ad.title}
                  </h4>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1">
                      <MapPin size={9} className="text-primary-gold/50" />
                      <span className="text-[9px] text-muted-custom truncate">
                        {ad.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-muted-custom">
                      <Eye size={9} />
                      {ad.views}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Agent CTA */}
      <div className="card-surface rounded-lg p-4 text-center">
        <div className="size-10 rounded bg-primary-gold/10 flex items-center justify-center text-primary-gold border border-primary-gold/20 mx-auto mb-3">
          <Building2 size={18} />
        </div>
        <h3 className="text-[10px] font-bold uppercase tracking-widest mb-1">
          Are you a Landlord?
        </h3>
        <p className="text-[9px] text-muted-custom mb-3 leading-relaxed">
          List your apartments and reach thousands of Kenyans looking for homes.
        </p>
        <button className="w-full bg-primary-gold text-black py-2.5 text-[9px] font-bold uppercase tracking-[0.2em] hover:brightness-110 transition-all rounded shadow-lg shadow-primary-gold/10 active:scale-[0.98] flex items-center justify-center gap-1">
          Join kao.kihumba.com <ArrowUpRight size={10} />
        </button>
      </div>
    </aside>
  );
}
