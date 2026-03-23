'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import LeftSidebar from '@/components/LeftSidebar';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import {
  ArrowLeft, MapPin, ShieldCheck, Star, Clock, Package,
  MessageCircle, Truck, Repeat2, ArrowUpRight, Heart
} from 'lucide-react';

// ─── Mock Sellers ────────────────────────────────────────────────────────────
const SELLERS: Record<string, any> = {
  s1: {
    name: "TechHub KE",
    bio: "Kenya's trusted source for authentic electronics. All items come with warranty and receipt. We verify every product before listing.",
    verified: true, rating: 4.9, deals: 142, responseTime: "< 5min", joined: "Jan 2025", safetyScore: 92,
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200",
    banner: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
    county: "Nairobi", area: "Westlands",
    catalogue: [
      { id: "m1", title: "iPhone 14 Pro Max 256GB", price: 95000, image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=400", condition: "Like New", tradeType: "SELL" },
      { id: "m3", title: "Samsung 55\" Smart TV", price: 45000, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400", condition: "New", tradeType: "SELL" },
      { id: "m6", title: "PS5 + 3 Games Bundle", price: 68000, image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=400", condition: "Like New", tradeType: "BOTH" },
    ],
    reviews: [
      { author: "James M.", rating: 5, comment: "Super legit. Got my iPhone sealed with warranty card. Highly recommend!", time: "1 week ago" },
      { author: "Grace W.", rating: 5, comment: "Fast responses, item exactly as described. Will buy again.", time: "2 weeks ago" },
      { author: "Kevin O.", rating: 4, comment: "Good seller. Delivery took a bit longer than expected but item was perfect.", time: "1 month ago" },
    ],
  },
  s2: {
    name: "SneakerHeadKE",
    bio: "Authentic sneakers at fair prices. Open to trades!",
    verified: false, rating: 4.2, deals: 14, responseTime: "~2hrs", joined: "Dec 2025", safetyScore: 68,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    banner: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=1200",
    county: "Nairobi", area: "CBD",
    catalogue: [
      { id: "m2", title: "Nike Air Jordan 1 Retro", price: 12000, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400", condition: "Good", tradeType: "BOTH" },
    ],
    reviews: [
      { author: "Peter K.", rating: 4, comment: "Shoes were legit. Met at Kencom.", time: "3 weeks ago" },
    ],
  },
  s3: {
    name: "HomeGoods254",
    bio: "Quality home appliances and electronics at the best prices. Official distributor for Samsung and LG in Ruaka area.",
    verified: true, rating: 4.8, deals: 67, responseTime: "< 30min", joined: "Jul 2025", safetyScore: 88,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
    banner: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200",
    county: "Kiambu", area: "Ruaka",
    catalogue: [
      { id: "m3", title: "Samsung 55\" Smart TV", price: 45000, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=400", condition: "New", tradeType: "SELL" },
    ],
    reviews: [
      { author: "Linda A.", rating: 5, comment: "Genuine Samsung TV, still sealed. Great seller!", time: "2 weeks ago" },
      { author: "Brian N.", rating: 5, comment: "Amazing service. Quick delivery via Sacco.", time: "1 month ago" },
    ],
  },
};

const Badge = ({ children, gold }: { children: React.ReactNode; gold?: boolean }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
    gold ? 'bg-primary-gold/10 text-primary-gold border-primary-gold/30' : 'bg-[var(--pill-bg)] text-muted-custom border-custom'
  }`}>{children}</span>
);

const SafetyMeter = ({ score }: { score: number }) => {
  const color = score >= 80 ? '#c5a059' : score >= 60 ? '#e2c27d' : '#a07d3a';
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--pill-bg)' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1 }} className="h-full rounded-full" style={{ backgroundColor: color }} />
      </div>
      <span className="text-[10px] font-bold" style={{ color }}>{score}/100</span>
    </div>
  );
};

export default function SellerStorefrontPage() {
  const params = useParams();
  const id = params.id as string;
  const seller = SELLERS[id];

  if (!seller) {
    return (
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
        <LeftSidebar />
        <main className="flex-1 w-full max-w-3xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
          <TopBar />
          <div className="px-4 pt-20 text-center">
            <h1 className="text-lg font-bold uppercase tracking-widest text-muted-custom">Seller Not Found</h1>
            <Link href="/marketplace" className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary-gold hover:underline">
              <ArrowLeft size={12} /> Back to Marketplace
            </Link>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-3xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
        <TopBar />

        {/* Breadcrumb */}
        <div className="px-4 pt-4 pb-2 flex items-center gap-2">
          <Link href="/marketplace" className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary-gold hover:underline">
            <ArrowLeft size={12} /> Marketplace
          </Link>
          <span className="text-[9px] text-muted-custom">/</span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">Seller</span>
          <span className="text-[9px] text-muted-custom">/</span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom truncate">{seller.name}</span>
        </div>

        {/* Banner + Avatar */}
        <div className="px-4 mb-6">
          <div className="relative h-32 md:h-40 rounded-lg overflow-hidden card-surface">
            <Image src={seller.banner} alt="Store banner" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>
          <div className="relative -mt-8 ml-4 flex items-end gap-3">
            <div className="relative shrink-0">
              <Image src={seller.avatar} alt={seller.name} width={64} height={64} className="rounded-lg border-2 border-[var(--bg-color)] object-cover" />
              {seller.verified && (
                <div className="absolute -bottom-1 -right-1 size-5 rounded bg-primary-gold flex items-center justify-center shadow">
                  <ShieldCheck size={12} className="text-black" />
                </div>
              )}
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold uppercase tracking-widest">{seller.name}</h1>
                {seller.verified && <Badge gold>Verified Seller</Badge>}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin size={10} className="text-primary-gold/60" />
                <span className="text-[9px] text-muted-custom">{seller.area}, {seller.county}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="px-4 mb-6">
          <p className="text-[11px] text-muted-custom font-bold leading-relaxed">{seller.bio}</p>
        </div>

        {/* Stats Row */}
        <div className="px-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: 'Rating', value: seller.rating, sub: <span className="flex items-center gap-0.5"><Star size={10} className="fill-primary-gold text-primary-gold" /> {seller.rating}</span> },
              { label: 'Completed', value: seller.deals, sub: `${seller.deals} deals` },
              { label: 'Response', value: seller.responseTime, sub: seller.responseTime },
              { label: 'Joined', value: seller.joined, sub: seller.joined },
            ].map((stat, i) => (
              <div key={i} className="card-surface rounded-lg p-3 text-center">
                <span className="text-[8px] font-bold uppercase tracking-widest text-muted-custom block mb-1">{stat.label}</span>
                <span className="text-[11px] font-bold">{typeof stat.sub === 'string' ? stat.sub : stat.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Score */}
        <div className="px-4 mb-6">
          <div className="card-surface rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60">Safety Score</span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-primary-gold">{seller.safetyScore >= 80 ? 'Trusted' : seller.safetyScore >= 60 ? 'Moderate' : 'New'}</span>
            </div>
            <SafetyMeter score={seller.safetyScore} />
          </div>
        </div>

        {/* Catalogue */}
        <div className="px-4 mb-6">
          <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">Catalogue ({seller.catalogue.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {seller.catalogue.map((item: any) => (
              <Link key={item.id} href={`/marketplace/${item.id}`}>
                <motion.div whileHover={{ y: -4 }} className="group card-surface rounded-lg overflow-hidden cursor-pointer hover:border-primary-gold/30 transition-all">
                  <div className="relative h-32 overflow-hidden">
                    <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 left-2 flex gap-1">
                      {item.tradeType === 'BOTH' && <Badge gold><Repeat2 size={8} /></Badge>}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6">
                      <span className="text-[10px] font-bold text-primary-gold">KES {item.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="p-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest truncate group-hover:text-primary-gold transition-colors">{item.title}</h4>
                    <span className="text-[8px] text-muted-custom">{item.condition}</span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="px-4 mb-6">
          <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">Reviews ({seller.reviews.length})</h2>
          <div className="space-y-2">
            {seller.reviews.map((review: any, i: number) => (
              <div key={i} className="card-surface rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded bg-primary-gold/10 flex items-center justify-center text-primary-gold border border-primary-gold/20">
                      <span className="text-[8px] font-bold">{review.author.charAt(0)}</span>
                    </div>
                    <span className="text-[10px] font-bold">{review.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} size={8} className="fill-primary-gold text-primary-gold" />
                    ))}
                  </div>
                </div>
                <p className="text-[10px] text-muted-custom font-bold leading-relaxed">{review.comment}</p>
                <span className="text-[8px] text-muted-custom mt-1 block">{review.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="px-4 mb-6">
          <div className="card-surface rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck size={14} className="text-primary-gold" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">
                {seller.verified ? 'Sacco delivery available' : 'Meetup only'}
              </span>
            </div>
            <button className="h-7 px-3 bg-primary-gold text-black rounded text-[9px] font-bold uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 flex items-center gap-1">
              <MessageCircle size={10} /> Contact Seller
            </button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
