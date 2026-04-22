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
  Dumbbell, Home as HomeIcon, MoreHorizontal, Camera
} from 'lucide-react';
import InfiniteScroll from '@/components/shared/InfiniteScroll';

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
import UserIdentity from "@/components/shared/UserIdentity";
import ItemUploadModal from "@/components/marketplace/ItemUploadModal";

const ListingCard = ({ item }: { item: any }) => (
  <Link href={`/marketplace/${item.id}`}>
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group card-surface rounded-lg overflow-hidden cursor-pointer hover:border-primary-gold/30 transition-all duration-300"
    >
      <div className="relative h-40 overflow-hidden">
        {(() => {
          const imgSrc = item.images?.[0];
          if (imgSrc && imgSrc.length > 0) {
            return (
              <Image 
                src={imgSrc} 
                alt={item.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            );
          }
          return (
            <div className="size-full bg-zinc-900 flex flex-col items-center justify-center text-zinc-700 gap-2">
               <Camera size={32} strokeWidth={1} />
               <span className="text-[7px] font-black uppercase tracking-[0.2em]">No Photo Available</span>
            </div>
          );
        })()}
        
        {/* Trade type badge */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {item.tradeType === 'BARTER' && <Badge gold><Repeat2 size={9} /> Barter</Badge>}
          {item.tradeType === 'TRADE_CASH' && <Badge gold><Repeat2 size={9} /> Trade + Cash</Badge>}
          {item.seller?.isVerified && <Badge gold><ShieldCheck size={9} /> Verified</Badge>}
        </div>

        <button onClick={(e) => { e.preventDefault(); }} className="absolute top-2 right-2 size-7 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white/80 hover:bg-primary-gold hover:text-black transition-all">
          <Heart size={14} />
        </button>

        {/* Price */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 flex items-end justify-between">
          <span className="text-sm font-bold text-primary-gold">KES {item.price.toLocaleString()}</span>
          <Badge className="text-[7px]">{CONDITIONS[item.condition] || item.condition}</Badge>
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
          {item.tags?.slice(0, 2).map((tag: string) => <Badge key={tag}>{tag}</Badge>)}
        </div>

        {/* Seller row */}
        <div className="flex items-center justify-between border-t border-custom pt-3 mt-1">
          <UserIdentity user={item.seller} size="sm" hideHandle />
          <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-primary-gold opacity-0 group-hover:opacity-100 transition-opacity">
            View <ArrowUpRight size={10} />
          </div>
        </div>
      </div>
    </motion.div>
  </Link>
);

// ─── Main Page ───────────────────────────────────────────────────────────────
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';
import { useCallback, useEffect } from 'react';

export default function MarketplacePage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [category, setCategory] = useState('all');
  const [tradeType, setTradeType] = useState('all');
  const [county, setCounty] = useState('All Counties');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const take = 12; // Grid friendly size
  const debouncedSearch = useDebounce(searchQuery, 500);

  const fetchListings = useCallback(async (isInitial = true) => {
    if (isInitial) {
      setLoading(true);
      setSkip(0);
    }
    
    try {
      const currentSkip = isInitial ? 0 : skip;
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (tradeType !== 'all') params.append('tradeType', tradeType);
      if (county !== 'All Counties') params.append('county', county);
      if (debouncedSearch) params.append('q', debouncedSearch);
      params.append('skip', currentSkip.toString());
      params.append('take', take.toString());

      const data = await api.get(`/marketplace/listings?${params.toString()}`);
      
      if (isInitial) {
        setListings(data.items || []);
      } else {
        setListings(prev => [...prev, ...(data.items || [])]);
      }
      
      setHasMore(data.hasMore);
      setSkip(currentSkip + take);
    } catch (err) {
      console.error("Failed to fetch listings", err);
    } finally {
      setLoading(false);
    }
  }, [category, tradeType, county, debouncedSearch, skip]);

  useEffect(() => {
    fetchListings(true);
  }, [category, tradeType, county, debouncedSearch]);

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
          <button 
            onClick={() => setIsUploadOpen(true)}
            className="ml-auto h-7 px-3 rounded bg-primary-gold text-black text-[9px] font-bold uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 flex items-center gap-1"
          >
            <Plus size={12} /> Sell / Trade
          </button>
        </div>

        <ItemUploadModal 
          isOpen={isUploadOpen} 
          onClose={() => setIsUploadOpen(false)} 
          onSuccess={fetchListings} 
        />

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
            {listings.length} item{listings.length !== 1 ? 's' : ''} in {county}
          </span>
        </div>

        {/* ─── Grid ─── */}
        <div className="px-4">
          <AnimatePresence>
            {loading && skip === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-64 rounded-lg card-surface animate-pulse" />
                ))}
              </div>
            ) : listings.length > 0 ? (
              <InfiniteScroll
                hasMore={hasMore}
                isLoading={loading}
                onLoadMore={() => fetchListings(false)}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 stagger-children"
              >
                {listings.map(item => <ListingCard key={item.id} item={item} />)}
              </InfiniteScroll>
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
