'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import LeftSidebar from '@/components/LeftSidebar';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import MarketRightSidebar from '@/components/marketplace/MarketRightSidebar';
import {
  Search, MapPin, ShieldCheck, Heart, ArrowUpRight, Plus,
  Star, Repeat2, Tag, Flag, Package, Truck, Filter,
  Smartphone, Shirt, Car, Armchair, Wrench, Sparkles, BookOpen,
  Dumbbell, Home as HomeIcon, MoreHorizontal
} from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'ELECTRONICS', label: 'Electronics', icon: Smartphone },
  { id: 'FASHION', label: 'Fashion', icon: Shirt },
  { id: 'VEHICLES', label: 'Vehicles', icon: Car },
  { id: 'FURNITURE', label: 'Furniture', icon: Armchair },
  { id: 'SERVICES', label: 'Services', icon: Wrench },
  { id: 'BOOKS', label: 'Books', icon: BookOpen },
  { id: 'SPORTS', label: 'Sports', icon: Dumbbell },
  { id: 'HOME_GARDEN', label: 'Home', icon: HomeIcon },
  { id: 'OTHER', label: 'Other', icon: MoreHorizontal },
];

const TRADE_TYPES = [
  { id: 'all', label: 'All' },
  { id: 'SELL', label: 'Buy' },
  { id: 'BARTER', label: 'Barter' },
  { id: 'BOTH', label: 'Buy or Trade' },
];

const COUNTIES = ["All Counties", "Nairobi", "Kiambu", "Mombasa", "Nakuru", "Uasin Gishu"];

const CONDITIONS: Record<string, string> = {
  NEW: 'New', LIKE_NEW: 'Like New', GOOD: 'Good', FAIR: 'Fair', FOR_PARTS: 'For Parts'
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_LISTINGS = [
  {
    id: "m1", title: "iPhone 14 Pro Max 256GB", price: 95000, category: "ELECTRONICS", tradeType: "SELL",
    barterFor: null, condition: "LIKE_NEW", county: "Nairobi", area: "Westlands",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=600",
    seller: { name: "TechHub KE", verified: true, safetyScore: 92, rating: 4.9, avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100" },
    tags: ["Warranty", "Box Included"], saccoDelivery: true, flagCount: 0,
  },
  {
    id: "m2", title: "Nike Air Jordan 1 Retro", price: 12000, category: "FASHION", tradeType: "BOTH",
    barterFor: "Adidas Yeezy or equivalent", condition: "GOOD", county: "Nairobi", area: "CBD",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
    seller: { name: "SneakerHeadKE", verified: false, safetyScore: 68, rating: 4.2, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100" },
    tags: ["Original", "Size 43"], saccoDelivery: false, flagCount: 0,
  },
  {
    id: "m3", title: "Samsung 55\" Smart TV", price: 45000, category: "ELECTRONICS", tradeType: "SELL",
    barterFor: null, condition: "NEW", county: "Kiambu", area: "Ruaka",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=600",
    seller: { name: "HomeGoods254", verified: true, safetyScore: 88, rating: 4.8, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100" },
    tags: ["Sealed Box", "Official Warranty"], saccoDelivery: true, flagCount: 0,
  },
  {
    id: "m4", title: "Vintage Leather Armchair", price: 28000, category: "FURNITURE", tradeType: "BARTER",
    barterFor: "Standing desk or office chair", condition: "GOOD", county: "Nairobi", area: "Kilimani",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600",
    seller: { name: "Amara K.", verified: false, safetyScore: 55, rating: 4.0, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100" },
    tags: ["Real Leather", "Heavy"], saccoDelivery: false, flagCount: 1,
  },
  {
    id: "m5", title: "Toyota Vitz 2015 — Clean!", price: 750000, category: "VEHICLES", tradeType: "SELL",
    barterFor: null, condition: "GOOD", county: "Nairobi", area: "Langata",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600",
    seller: { name: "Motor254", verified: true, safetyScore: 95, rating: 4.9, avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100" },
    tags: ["1300cc", "Low Mileage"], saccoDelivery: false, flagCount: 0,
  },
  {
    id: "m6", title: "PS5 + 3 Games Bundle", price: 68000, category: "ELECTRONICS", tradeType: "BOTH",
    barterFor: "Gaming laptop or MacBook Air", condition: "LIKE_NEW", county: "Mombasa", area: "Nyali",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=600",
    seller: { name: "GameZone", verified: true, safetyScore: 84, rating: 4.6, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100" },
    tags: ["2 Controllers", "Barely Used"], saccoDelivery: true, flagCount: 0,
  },
];

// ─── Badge ───────────────────────────────────────────────────────────────────
const Badge = ({ children, gold, className }: { children: React.ReactNode; gold?: boolean; className?: string }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
    gold ? 'bg-primary-gold/10 text-primary-gold border-primary-gold/30' : 'bg-[var(--pill-bg)] text-muted-custom border-custom'
  } ${className ?? ''}`}>{children}</span>
);

// ─── Safety Score Meter ──────────────────────────────────────────────────────
const SafetyMeter = ({ score }: { score: number }) => {
  const color = score >= 80 ? '#c5a059' : score >= 60 ? '#e2c27d' : '#a07d3a';
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--pill-bg)' }}>
        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-[8px] font-bold" style={{ color }}>{score}</span>
    </div>
  );
};

// ─── Listing Card ────────────────────────────────────────────────────────────
const ListingCard = ({ item }: { item: typeof MOCK_LISTINGS[0] }) => (
  <Link href={`/marketplace/${item.id}`}>
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group card-surface rounded-lg overflow-hidden cursor-pointer hover:border-primary-gold/30 transition-all duration-300"
    >
      <div className="relative h-40 overflow-hidden">
        <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        
        {/* Trade type badge */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {item.tradeType === 'BARTER' && <Badge gold><Repeat2 size={9} /> Barter</Badge>}
          {item.tradeType === 'BOTH' && <Badge gold><Repeat2 size={9} /> Buy/Trade</Badge>}
          {item.seller.verified && <Badge gold><ShieldCheck size={9} /> Verified</Badge>}
          {item.saccoDelivery && <Badge gold><Truck size={8} /> Delivery</Badge>}
        </div>

        <button onClick={(e) => { e.preventDefault(); }} className="absolute top-2 right-2 size-7 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white/80 hover:bg-primary-gold hover:text-black transition-all">
          <Heart size={14} />
        </button>

        {/* Price */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 flex items-end justify-between">
          <span className="text-sm font-bold text-primary-gold">KES {item.price.toLocaleString()}</span>
          <Badge className="text-[7px]">{CONDITIONS[item.condition]}</Badge>
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-[11px] font-bold uppercase tracking-widest truncate group-hover:text-primary-gold transition-colors">{item.title}</h3>
        
        {item.barterFor && (
          <div className="mt-1 mb-1.5 px-2 py-1 rounded bg-primary-gold/5 border border-primary-gold/15">
            <span className="text-[8px] font-bold text-primary-gold flex items-center gap-1"><Repeat2 size={8} /> Will trade for: {item.barterFor}</span>
          </div>
        )}

        <div className="flex items-center gap-1 mt-1 mb-2">
          <MapPin size={10} className="text-primary-gold/60" />
          <span className="text-[10px] text-muted-custom">{item.area}, {item.county}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 2).map(tag => <Badge key={tag}>{tag}</Badge>)}
        </div>

        {/* Seller row */}
        <div className="flex items-center justify-between border-t border-custom pt-2">
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <Image src={item.seller.avatar} alt="" width={20} height={20} className="rounded object-cover" />
              {item.seller.verified && (
                <div className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-sm bg-primary-gold flex items-center justify-center">
                  <ShieldCheck size={6} className="text-black" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold truncate max-w-[60px]">{item.seller.name}</span>
              <SafetyMeter score={item.seller.safetyScore} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-primary-gold opacity-0 group-hover:opacity-100 transition-opacity">
            View <ArrowUpRight size={10} />
          </div>
        </div>
      </div>
    </motion.div>
  </Link>
);

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function MarketplacePage() {
  const [category, setCategory] = useState('all');
  const [tradeType, setTradeType] = useState('all');
  const [county, setCounty] = useState('Nairobi'); // Default to user's county
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return MOCK_LISTINGS.filter(item => {
      const matchCat = category === 'all' || item.category === category;
      const matchTrade = tradeType === 'all' || item.tradeType === tradeType;
      const matchCounty = county === 'All Counties' || item.county === county;
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.area.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchTrade && matchCounty && matchSearch;
    });
  }, [category, tradeType, county, searchQuery]);

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-3xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
        <TopBar />

        {/* ─── Header ─── */}
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-lg font-bold tracking-[0.2em] uppercase text-primary-gold gold-glow">Marketplace</h1>
            <Badge gold>Beta</Badge>
          </div>
          <p className="text-[10px] text-muted-custom font-bold uppercase tracking-widest">Buy, sell, barter — powered by community trust</p>
        </div>

        {/* ─── Search ─── */}
        <div className="px-4 mb-4">
          <div className="card-surface rounded-lg px-3 py-2 flex items-center gap-2">
            <Search size={14} className="text-primary-gold/60 shrink-0" />
            <input type="text" placeholder="Search items, e.g. iPhone, chair, sneakers…" className="flex-1 bg-transparent outline-none text-[11px] font-bold placeholder:text-muted-custom/50" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>

        {/* ─── County + Trade Type Controls ─── */}
        <div className="px-4 flex flex-wrap items-center gap-2 mb-4">
          {/* County selector */}
          <div className="card-surface rounded-lg px-2 py-1 flex items-center gap-1">
            <MapPin size={10} className="text-primary-gold" />
            <select value={county} onChange={(e) => setCounty(e.target.value)} className="bg-transparent outline-none text-[9px] font-bold uppercase tracking-widest cursor-pointer">
              {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Trade Type */}
          <div className="card-surface rounded-lg p-0.5 flex">
            {TRADE_TYPES.map(t => (
              <button key={t.id} onClick={() => setTradeType(t.id)}
                className={`px-2.5 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest transition-all ${
                  tradeType === t.id ? 'bg-primary-gold/15 text-primary-gold border border-primary-gold/30' : 'text-muted-custom border border-transparent'
                }`}
              >{t.label}</button>
            ))}
          </div>

          {/* Sell button */}
          <button className="ml-auto h-7 px-3 rounded bg-primary-gold text-black text-[9px] font-bold uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 flex items-center gap-1">
            <Plus size={12} /> Sell / Trade
          </button>
        </div>

        {/* ─── Category Pills ─── */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-4 pb-4">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setCategory(cat.id)}
              className={`shrink-0 px-3 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest transition-all border flex items-center gap-1.5 ${
                category === cat.id
                  ? 'bg-primary-gold/15 text-primary-gold border-primary-gold/30'
                  : 'card-surface text-muted-custom border-custom hover:border-primary-gold/20'
              }`}
            >
              <cat.icon size={12} />
              {cat.label}
            </button>
          ))}
        </div>

        {/* ─── Results ─── */}
        <div className="px-4 flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-custom">
            {filtered.length} item{filtered.length !== 1 ? 's' : ''} in {county}
          </span>
        </div>

        {/* ─── Grid ─── */}
        <div className="px-4">
          <AnimatePresence>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 stagger-children">
                {filtered.map(item => <ListingCard key={item.id} item={item} />)}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 flex flex-col items-center text-center card-surface rounded-lg">
                <Search size={28} className="text-primary-gold/30 mb-3" />
                <h3 className="text-xs font-bold uppercase tracking-widest">No Items Found</h3>
                <p className="text-[10px] text-muted-custom mt-1">Try changing your filters or county.</p>
                <button onClick={() => { setCategory('all'); setCounty('All Counties'); setTradeType('all'); setSearchQuery(''); }}
                  className="mt-4 h-7 px-4 rounded bg-primary-gold text-black text-[9px] font-bold uppercase tracking-widest hover:brightness-110 transition-all active:scale-95">
                  Reset Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <MarketRightSidebar />
      <BottomNav />
    </div>
  );
}
