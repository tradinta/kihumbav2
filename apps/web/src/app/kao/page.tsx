'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import LeftSidebar from '@/components/LeftSidebar';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import KaoRightSidebar from '@/components/kao/KaoRightSidebar';
import { 
  Search, MapPin, Home as HomeIcon, Filter, ChevronDown,
  Zap, ShieldCheck, Heart, LayoutGrid, Map as MapIcon,
  User, Flame, Star, Wifi, Camera, Building, ArrowUpRight, Plus
} from 'lucide-react';

const KaoMap = dynamic(() => import('@/components/kao/KaoMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[calc(100vh-260px)] w-full rounded-lg card-surface flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <MapPin size={32} className="text-primary-gold/40 animate-pulse" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-custom">Loading Map…</span>
      </div>
    </div>
  )
});

// ─── Constants ───────────────────────────────────────────────────────────────
const HOUSE_TYPES = ["All Types", "Single Room", "SQ", "Bedsitter", "Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom"];
const COUNTIES    = ["All Counties", "Nairobi", "Kiambu", "Mombasa", "Nakuru", "Uasin Gishu"];

const MOCK_LISTINGS = [
  { id:"1", title:"Executive Bedsitter – Gate C",       type:"Bedsitter",  listingType:"RENTAL",   county:"Kiambu",  area:"Juja",     price:12500, rating:4.8, image:"https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800", tags:["Student Friendly","Fiber Internet"], managedBy:"Sarah Properties", isVerified:true,  isPopular:true,  wifi:true,  electricity:"token", lat:-1.1026, lng:37.0142 },
  { id:"2", title:"Modern 1BR near Yaya",               type:"1 Bedroom",  listingType:"RENTAL",   county:"Nairobi", area:"Kilimani", price:38000, rating:4.9, image:"https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800", tags:["Elevator","Borehole"],              managedBy:"Pinnacle Homes",  isVerified:true,  isPopular:false, wifi:true,  electricity:"token", lat:-1.2884, lng:36.7905 },
  { id:"3", title:"Room available – Madaraka",           type:"Single Room",listingType:"ROOMMATE", county:"Nairobi", area:"Madaraka", price:8500,  rating:4.5, image:"https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800", tags:["Near Uni","Female Only"],            managedBy:"Brenda K.",       isVerified:false, isPopular:true,  wifi:true,  electricity:"included", lat:-1.3094, lng:36.8188 },
  { id:"4", title:"Double Room – Bamburi",               type:"2 Bedroom",  listingType:"RENTAL",   county:"Mombasa", area:"Bamburi",  price:18000, rating:4.7, image:"https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800", tags:["Near Beach","Fresh Air"],            managedBy:"Coast Rentals",   isVerified:true,  isPopular:true,  wifi:true,  electricity:"token", lat:-3.9924, lng:39.7126 },
  { id:"5", title:"Spacious SQ – Ruaka",                 type:"SQ",         listingType:"RENTAL",   county:"Kiambu",  area:"Ruaka",    price:15000, rating:4.6, image:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800", tags:["Secure","Private Entrance"],        managedBy:"Mark D.",         isVerified:false, isPopular:false, wifi:false, electricity:"token", lat:-1.2057, lng:36.7828 },
];

// ─── Micro Badge ─────────────────────────────────────────────────────────────
const Badge = ({ children, gold, className }: { children: React.ReactNode; gold?: boolean; className?: string }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
    gold
      ? 'bg-primary-gold/10 text-primary-gold border-primary-gold/30'
      : 'bg-[var(--pill-bg)] text-muted-custom border-custom'
  } ${className ?? ''}`}>
    {children}
  </span>
);

// ─── Listing Card ────────────────────────────────────────────────────────────
const ListingCard = ({ listing }: { listing: typeof MOCK_LISTINGS[0] }) => (
  <Link href={`/kao/${listing.id}`}>
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group card-surface rounded-lg overflow-hidden cursor-pointer hover:border-primary-gold/30 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <Image src={listing.image} alt={listing.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {listing.isVerified && <Badge gold><ShieldCheck size={10} /> Verified</Badge>}
          {listing.isPopular && <Badge gold><Flame size={10} /> Hot</Badge>}
          {listing.listingType === 'ROOMMATE' && <Badge gold><User size={10} /> Roommate</Badge>}
        </div>

        {/* Fave */}
        <button onClick={(e) => e.preventDefault()} className="absolute top-2 right-2 size-7 rounded-full bg-black/30 backdrop-blur flex items-center justify-center text-white/80 hover:bg-primary-gold hover:text-black transition-all">
          <Heart size={14} />
        </button>

        {/* Price Strip */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 flex items-end justify-between">
          <span className="text-sm font-bold text-primary-gold">KES {listing.price.toLocaleString()}<span className="text-[10px] text-white/50 ml-1">/mo</span></span>
          <div className="flex items-center gap-1">
            <Star size={10} className="fill-primary-gold text-primary-gold" />
            <span className="text-[10px] font-bold text-white/80">{listing.rating}</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-[11px] font-bold uppercase tracking-widest truncate group-hover:text-primary-gold transition-colors">{listing.title}</h3>
        <div className="flex items-center gap-1 mt-1 mb-2">
          <MapPin size={10} className="text-primary-gold/60" />
          <span className="text-[10px] text-muted-custom">{listing.area}, {listing.county}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {listing.tags.slice(0, 2).map(tag => <Badge key={tag}>{tag}</Badge>)}
          {listing.wifi && <Badge><Wifi size={9} /> WiFi</Badge>}
          {listing.electricity === 'token' && <Badge><Zap size={9} /> Token</Badge>}
        </div>

        <div className="flex items-center justify-between border-t border-custom pt-2">
          <div className="flex items-center gap-1.5">
            <div className="size-5 rounded bg-primary-gold/10 flex items-center justify-center text-primary-gold border border-primary-gold/20">
              <User size={10} />
            </div>
            <span className="text-[9px] font-bold text-muted-custom truncate max-w-[70px]">{listing.managedBy}</span>
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
export default function KaoPage() {
  const [activeTab, setActiveTab] = useState<'RENTAL' | 'ROOMMATE'>('RENTAL');
  const [viewMode, setViewMode]   = useState<'grid' | 'map'>('grid');
  const [filterType, setFilterType]     = useState('All Types');
  const [filterCounty, setFilterCounty] = useState('All Counties');
  const [searchQuery, setSearchQuery]   = useState('');

  const filteredListings = useMemo(() => {
    return MOCK_LISTINGS.filter(item => {
      const matchType   = filterType   === 'All Types'    || item.type   === filterType;
      const matchCounty = filterCounty === 'All Counties' || item.county === filterCounty;
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.area.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTab    = item.listingType === activeTab;
      return matchType && matchCounty && matchSearch && matchTab;
    });
  }, [filterType, filterCounty, searchQuery, activeTab]);

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-3xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
        <TopBar />

        {/* ─── Kao Header ─── */}
        <div className="px-4 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-lg font-bold tracking-[0.2em] uppercase text-primary-gold gold-glow">Kao</h1>
            <Badge gold>Beta</Badge>
          </div>
          <p className="text-[10px] text-muted-custom font-bold uppercase tracking-widest">Find your next home in Kenya</p>
        </div>

        {/* ─── Search Bar ─── */}
        <div className="px-4 mb-4">
          <div className="card-surface rounded-lg px-3 py-2 flex items-center gap-2">
            <Search size={14} className="text-primary-gold/60 shrink-0" />
            <input
              type="text"
              placeholder="Search area, e.g. Juja, Ruaka, Kilimani…"
              className="flex-1 bg-transparent outline-none text-[11px] font-bold placeholder:text-muted-custom/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* ─── Controls Row ─── */}
        <div className="px-4 flex flex-wrap items-center gap-2 mb-4">
          {/* Rental / Roommate Tabs */}
          <div className="card-surface rounded-lg p-0.5 flex">
            <button
              onClick={() => setActiveTab('RENTAL')}
              className={`px-3 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest transition-all ${
                activeTab === 'RENTAL' ? 'bg-primary-gold/15 text-primary-gold border border-primary-gold/30' : 'text-muted-custom border border-transparent'
              }`}
            >Find Rental</button>
            <button
              onClick={() => setActiveTab('ROOMMATE')}
              className={`px-3 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest transition-all ${
                activeTab === 'ROOMMATE' ? 'bg-primary-gold/15 text-primary-gold border border-primary-gold/30' : 'text-muted-custom border border-transparent'
              }`}
            >Find Roommate</button>
          </div>

          {/* View Toggle */}
          <div className="card-surface rounded-lg p-0.5 flex ml-auto">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-primary-gold/15 text-primary-gold' : 'text-muted-custom'}`}><LayoutGrid size={14} /></button>
            <button onClick={() => setViewMode('map')}  className={`p-1.5 rounded transition-all ${viewMode === 'map'  ? 'bg-primary-gold/15 text-primary-gold' : 'text-muted-custom'}`}><MapIcon size={14} /></button>
          </div>
        </div>

        {/* ─── Filter Pills (Horizontal scroll) ─── */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-4 pb-4">
          {HOUSE_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`shrink-0 px-3 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest transition-all border ${
                filterType === t
                  ? 'bg-primary-gold/15 text-primary-gold border-primary-gold/30'
                  : 'card-surface text-muted-custom border-custom hover:border-primary-gold/20'
              }`}
            >{t}</button>
          ))}

          {/* County */}
          <select
            value={filterCounty}
            onChange={(e) => setFilterCounty(e.target.value)}
            className="shrink-0 px-3 py-1.5 rounded text-[9px] font-bold uppercase tracking-widest card-surface text-muted-custom border-custom outline-none bg-transparent cursor-pointer"
          >
            {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* ─── Results Counter + List CTA ─── */}
        <div className="px-4 flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-custom">
            {filteredListings.length} listing{filteredListings.length !== 1 ? 's' : ''} found
          </span>
          <div className="flex items-center gap-2">
            <button className="h-7 px-3 rounded bg-primary-gold text-black text-[9px] font-bold uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 flex items-center gap-1">
              <Plus size={12} /> List as Individual
            </button>
            <button className="h-7 px-3 rounded card-surface text-[9px] font-bold uppercase tracking-widest text-muted-custom border-custom hover:border-primary-gold/30 transition-all flex items-center gap-1">
              Agent Portal <ArrowUpRight size={10} />
            </button>
          </div>
        </div>

        {/* ─── Content Area ─── */}
        {viewMode === 'grid' ? (
          <div className="px-4">
            <AnimatePresence>
              {filteredListings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 stagger-children">
                  {filteredListings.map(item => <ListingCard key={item.id} listing={item} />)}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 flex flex-col items-center text-center card-surface rounded-lg">
                  <Search size={28} className="text-primary-gold/30 mb-3" />
                  <h3 className="text-xs font-bold uppercase tracking-widest">Bado… No Results</h3>
                  <p className="text-[10px] text-muted-custom mt-1">Try changing your filters or search query.</p>
                  <button onClick={() => { setFilterType('All Types'); setFilterCounty('All Counties'); setSearchQuery(''); }} className="mt-4 h-7 px-4 rounded bg-primary-gold text-black text-[9px] font-bold uppercase tracking-widest hover:brightness-110 transition-all active:scale-95">
                    Reset Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="px-4">
            <KaoMap items={filteredListings} />
          </div>
        )}
      </main>

      <KaoRightSidebar />
      <BottomNav />
    </div>
  );
}
