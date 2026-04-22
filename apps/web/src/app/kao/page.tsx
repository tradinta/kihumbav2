'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, HomeIcon, User, ShieldCheck, 
  Camera, ArrowUpRight, LayoutGrid, Map as MapIcon,
  ChevronDown, Zap, Heart, Building, Repeat2, Check, X, AlertCircle
} from 'lucide-react';
import { api } from '@/lib/api';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import LeftSidebar from '@/components/LeftSidebar';
import TopBar from '@/components/TopBar';
import KaoRightSidebar from '@/components/kao/KaoRightSidebar';
import KaoUploadModal from '@/components/kao/KaoUploadModal';
import BottomNav from '@/components/BottomNav';
import { usePostContext } from '@/context/PostContext';
import dynamic from 'next/dynamic';

const KaoMap = dynamic(() => import('@/components/kao/KaoMap'), { ssr: false });

// ─── UI Components ───
const Badge = ({ children, className, gold }: { children: React.ReactNode, className?: string, gold?: boolean }) => (
  <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest flex items-center gap-1 border transition-all ${
    gold
      ? 'bg-primary-gold/10 text-primary-gold border-primary-gold/30'
      : 'bg-white/5 text-muted-custom border-white/5'
  } ${className ?? ''}`}>
    {children}
  </span>
);

// ─── Constants ───────────────────────────────────────────────────────────────
const HOUSE_TYPES = [
  { label: "All Types", icon: <LayoutGrid size={12} /> },
  { label: "Single Room", icon: <User size={12} /> },
  { label: "SQ", icon: <ShieldCheck size={12} /> },
  { label: "Bedsitter", icon: <HomeIcon size={12} /> },
  { label: "Studio", icon: <Zap size={12} /> },
  { label: "1 Bedroom", icon: <Building size={12} /> },
  { label: "2 Bedroom", icon: <Building size={12} /> },
  { label: "3 Bedroom", icon: <Building size={12} /> }
];

const GENDER_FILTERS = [
  { label: "All Genders", icon: <User size={12} /> },
  { label: "Male Only", icon: <User size={12} className="text-blue-400" /> },
  { label: "Female Only", icon: <User size={12} className="text-pink-400" /> }
];

const LIFESTYLE_FILTERS = [
  { label: "Non-smoker", icon: <Zap size={12} /> },
  { label: "Pet Friendly", icon: <Heart size={12} /> },
  { label: "Student", icon: <Building size={12} /> },
  { label: "Working", icon: <Zap size={12} /> }
];

const COUNTIES = ["All Counties", "Nairobi", "Kiambu", "Mombasa", "Nakuru", "Uasin Gishu"];

// ─── Listing Card ────────────────────────────────────────────────────────────
const ListingCard = ({ listing, onQuote, onViewInMap, onRequest }: { listing: any, onQuote: (listing: any) => void, onViewInMap?: (listing: any) => void, onRequest?: (listing: any) => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    className="group card-surface rounded-xl overflow-hidden cursor-pointer hover:border-primary-gold/30 transition-all duration-300 flex flex-col h-full shadow-2xl relative"
  >
    {listing.listingType === 'ROOMMATE' && (
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
         <div className="size-10 rounded-full border-2 border-primary-gold overflow-hidden shadow-xl bg-black/40 backdrop-blur-md">
            {listing.author?.avatar ? (
              <Image src={listing.author.avatar} alt="" width={40} height={40} className="object-cover" />
            ) : (
              <div className="size-full flex items-center justify-center text-primary-gold bg-primary-gold/10"><User size={20} /></div>
            )}
         </div>
         <div className="flex flex-col">
            <span className="text-[9px] font-bold text-white uppercase tracking-widest drop-shadow-lg">{listing.author?.username || 'Seeker'}</span>
            <Badge gold className="scale-75 origin-left">Seeking Roommate</Badge>
         </div>
      </div>
    )}

    <Link href={`/kao/${listing.id}`} className="block relative h-48 overflow-hidden bg-black/5">
      {(() => {
        const imgSrc = listing.images?.[0] || listing.image;
        if (imgSrc && imgSrc.length > 0) {
          return <Image src={imgSrc} alt={listing.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />;
        }
        return (
          <div className="w-full h-full bg-black/5 flex flex-col items-center justify-center text-muted-custom gap-1">
             <Camera size={32} strokeWidth={1} />
             <span className="text-[7px] font-bold uppercase tracking-[0.2em]">No Photo</span>
          </div>
        );
      })()}

      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 z-20">
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuote(listing); }} 
          className="size-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-primary-gold hover:bg-primary-gold hover:text-black transition-all"
        >
          <Repeat2 size={14} />
        </button>
      </div>

      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-10 flex items-end justify-between">
        <span className="text-base font-bold text-primary-gold gold-glow">
          KES {listing.price?.toLocaleString()}<span className="text-[10px] text-white/50 ml-1 font-bold">/MO</span>
        </span>
        {listing.listingType === 'RENTAL' && <Badge gold={!listing.isIndividual}>{listing.isIndividual ? 'Individual' : 'Agency'}</Badge>}
      </div>
    </Link>

    <div className="p-4 flex-1 flex flex-col">
      <div className="flex-1 min-w-0 mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider truncate text-main group-hover:text-primary-gold transition-colors">{listing.title}</h3>
        <div className="flex items-center gap-1.5 mt-2 opacity-80">
          <MapPin size={10} className="text-primary-gold" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-custom truncate">{listing.area}, {listing.county}</span>
        </div>
        
        {listing.listingType === 'ROOMMATE' && (
           <div className="flex flex-wrap gap-1 mt-3">
              {listing.lifestyle?.map((tag: string) => (
                <span key={tag} className="px-1.5 py-0.5 rounded-md pill-surface text-[7px] font-bold text-muted-custom uppercase border border-custom">{tag}</span>
              ))}
           </div>
        )}
      </div>

      <div className="flex gap-2">
        {listing.listingType === 'ROOMMATE' ? (
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRequest?.(listing); }}
            className="flex-1 h-9 rounded-lg bg-primary-gold text-black text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95"
          >
            Submit Request <ArrowUpRight size={12} />
          </button>
        ) : (
          <Link 
            href={`/kao/${listing.id}`}
            className="flex-1 h-9 rounded-lg pill-surface border border-custom text-[9px] font-bold uppercase tracking-widest text-main flex items-center justify-center gap-2 hover:brightness-95 transition-all"
          >
            View More <ArrowUpRight size={12} />
          </Link>
        )}
        
        {onViewInMap && (
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onViewInMap(listing); }}
            className={`size-9 rounded-lg flex items-center justify-center transition-all active:scale-95 border ${
              listing.listingType === 'ROOMMATE' ? 'pill-surface border-custom text-primary-gold hover:brightness-95' : 'bg-primary-gold text-black border-primary-gold shadow-lg shadow-primary-gold/20'
            }`}
          >
            <MapIcon size={14} />
          </button>
        )}
      </div>
    </div>
  </motion.div>
);

// ─── Request Modal ────────────────────────────────────────────────────────────
const SubmitRequestModal = ({ listing, isOpen, onClose }: { listing: any, isOpen: boolean, onClose: () => void }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    try {
      setSending(true);
      await api.post(`/kao/listings/${listing.id}/requests`, { message });
      onClose();
    } catch (err) {
      console.error("Failed to send request", err);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-sm bg-[var(--bg-color)] border border-custom rounded-2xl overflow-hidden shadow-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
           <div className="size-12 rounded-full border-2 border-primary-gold overflow-hidden">
              {listing.author?.avatar ? (
                <Image src={listing.author.avatar} alt="" width={48} height={48} className="object-cover" />
              ) : (
                <div className="size-full flex items-center justify-center bg-primary-gold/10 text-primary-gold"><User size={24} /></div>
              )}
           </div>
           <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white">Send Request</h3>
              <p className="text-[10px] text-muted-custom font-medium mt-1">To: <span className="text-primary-gold font-bold">{listing.author?.username}</span></p>
           </div>
        </div>

        <div className="space-y-4">
           <div>
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-custom block mb-2">Message</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell them a bit about yourself..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white outline-none focus:border-primary-gold/30 transition-all resize-none"
              />
           </div>

           <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 h-11 rounded-2xl border border-white/10 text-[10px] font-bold uppercase tracking-widest text-muted-custom hover:bg-white/5 transition-all">Cancel</button>
              <button 
                onClick={handleSubmit}
                disabled={sending}
                className="flex-2 h-11 rounded-2xl bg-primary-gold text-black text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Confirm Request'}
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function KaoPage() {
  const [activeTab, setActiveTab] = useState<'RENTAL' | 'ROOMMATE'>('RENTAL');
  const [viewMode, setViewMode]   = useState<'grid' | 'map'>('grid');
  const [filterType, setFilterType]     = useState('All Types');
  const [filterGender, setFilterGender] = useState('All Genders');
  const [filterLifestyle, setFilterLifestyle] = useState<string[]>([]);
  const [filterCounty, setFilterCounty] = useState('All Counties');
  const [filterPrice, setFilterPrice] = useState('Any Price');
  const [searchQuery, setSearchQuery]   = useState('');
  const { setCreatePostOpen, setKaoQuoteTarget } = usePostContext();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isHubOpen, setIsHubOpen] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [circleResults, setCircleResults] = useState<any[] | null>(null);
  const [focusedListing, setFocusedListing] = useState<any | null>(null);
  const [requestTarget, setRequestTarget] = useState<any | null>(null);
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(false);
  const initialLoadRef = useRef(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Update URL helper
  const updateQuery = useCallback((params: Record<string, string | number | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) current.delete(key);
      else current.set(key, String(value));
    });
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.replace(`${pathname}${query}`, { scroll: false });
  }, [searchParams, router, pathname]);

  // Sync tab/view changes to URL
  useEffect(() => {
    updateQuery({ 
      view: viewMode,
      type: activeTab === 'ROOMMATE' ? 'roommate' : null,
      verified: isVerifiedOnly ? 'true' : null
    });
  }, [viewMode, activeTab, isVerifiedOnly]);

  // Load initial state from URL
  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;

    const view = searchParams.get('view');
    if (view === 'map' || view === 'grid') setViewMode(view as any);

    const type = searchParams.get('type');
    if (type === 'roommate') setActiveTab('ROOMMATE');
    else if (type === 'rental') setActiveTab('RENTAL');
    
    const verified = searchParams.get('verified');
    if (verified === 'true') setIsVerifiedOnly(true);

    const id = searchParams.get('id');
    if (id && listings.length > 0) {
      const found = listings.find(l => l.id === id);
      if (found) setFocusedListing(found);
    }
  }, [listings.length, searchParams]);

  // Handle map movement for URL sync (debounced)
  const handleMapMove = useCallback((lat: number, lng: number, zoom: number) => {
    if (viewMode === 'map') {
      updateQuery({ lat: lat.toFixed(6), lng: lng.toFixed(6), z: zoom.toFixed(1) });
    }
  }, [viewMode, updateQuery]);

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('listingType', activeTab);
      if (filterType !== 'All Types') params.append('type', filterType);
      if (filterCounty !== 'All Counties') params.append('county', filterCounty);
      if (searchQuery) params.append('search', searchQuery);
      
      if (filterPrice !== 'Any Price') {
        const price = filterPrice.replace('Max ', '').replace('KES ', '').replace(',', '');
        params.append('maxPrice', price);
      }

      if (isVerifiedOnly) params.append('isVerified', 'true');

      if (activeTab === 'ROOMMATE') {
        if (filterGender !== 'All Genders') {
          const gender = filterGender === 'Male Only' ? 'MALE' : 'FEMALE';
          params.append('preferredGender', gender);
        }
        if (filterLifestyle.length > 0) {
          params.append('lifestyle', filterLifestyle.join(','));
        }
      }

      const data = await api.get(`/kao/listings?${params.toString()}`);
      setListings(data);
    } catch (err) {
      console.error("Failed to fetch listings", err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, filterType, filterCounty, searchQuery, filterGender, filterLifestyle, filterPrice, isVerifiedOnly]);

  useEffect(() => {
    setLoading(true);
    fetchListings();
  }, [fetchListings]);

  const Skeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 animate-pulse">
      {[1,2,3,4,5,6].map(i => (
        <div key={i} className="h-[360px] rounded-xl bg-white/5 border border-white/5 flex flex-col p-4 gap-4">
          <div className="w-full h-48 rounded-lg bg-white/5" />
          <div className="h-4 w-2/3 bg-white/5 rounded" />
          <div className="h-3 w-1/2 bg-white/5 rounded" />
          <div className="mt-auto flex gap-2">
            <div className="h-9 flex-1 bg-white/5 rounded-lg" />
            <div className="h-9 flex-1 bg-white/5 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );

  const filteredListings = circleResults || listings;

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-3xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
        <TopBar />

        {/* ─── Modern Decluttered Header ─── */}
        <div className="px-4 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-custom mb-8">
          <div className="flex flex-col gap-2">
             <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-[0.2em] uppercase text-primary-gold gold-glow">Kao</h1>
                <Badge gold>Discovery</Badge>
             </div>
             <p className="text-[10px] text-muted-custom font-bold uppercase tracking-[0.2em]">Find your next home in Kenya</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative h-12 pill-surface rounded-xl p-1 flex items-center border border-custom overflow-hidden w-64">
              <motion.div 
                layoutId="tab-bg"
                className="absolute h-10 bg-primary-gold rounded-lg shadow-[0_0_20px_rgba(255,200,0,0.3)]"
                initial={false}
                animate={{ x: activeTab === 'RENTAL' ? 0 : '100%', width: 'calc(50% - 4px)' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <button onClick={() => setActiveTab('RENTAL')} className={`relative flex-1 h-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${activeTab === 'RENTAL' ? 'text-black' : 'text-muted-custom'}`}>
                Rentals
              </button>
              <button onClick={() => setActiveTab('ROOMMATE')} className={`relative flex-1 h-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${activeTab === 'ROOMMATE' ? 'text-black' : 'text-muted-custom'}`}>
                Roommates
              </button>
            </div>

            <button 
              onClick={() => setIsHubOpen(true)}
              className="h-12 px-6 rounded-xl bg-white/5 border border-custom text-[10px] font-bold uppercase tracking-widest text-muted-custom hover:text-primary-gold hover:border-primary-gold/30 transition-all flex items-center gap-2"
            >
              <LayoutGrid size={16} /> My Hub
            </button>

            <button 
              onClick={() => setIsUploadOpen(true)}
              className="size-12 rounded-xl bg-primary-gold text-black flex items-center justify-center hover:brightness-110 transition-all active:scale-95 shadow-xl shadow-primary-gold/10"
            >
              <Zap size={18} />
            </button>
          </div>
        </div>

        {/* ─── Streamlined Filter Bar ─── */}
        <div className="px-4 pb-8">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <div className="flex p-1 pill-surface rounded-lg border border-custom shrink-0">
               <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary-gold text-black shadow-lg' : 'text-muted-custom'}`}><LayoutGrid size={16} /></button>
               <button onClick={() => setViewMode('map')}  className={`p-2 rounded-md transition-all ${viewMode === 'map'  ? 'bg-primary-gold text-black shadow-lg' : 'text-muted-custom'}`}><MapIcon size={16} /></button>
            </div>

            <div className="h-8 w-px bg-white/10 shrink-0 mx-1" />

            {/* Type Dropdown */}
            <div className="relative shrink-0">
               <select
                 value={filterType}
                 onChange={(e) => setFilterType(e.target.value)}
                 className="h-11 pl-4 pr-10 rounded-lg text-[10px] font-bold uppercase tracking-widest pill-surface text-main border border-custom outline-none appearance-none cursor-pointer focus:border-primary-gold/30 transition-all min-w-[140px]"
               >
                 {HOUSE_TYPES.map(t => <option key={t.label} value={t.label} className="bg-[var(--card-bg)]">{t.label}</option>)}
               </select>
               <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-custom pointer-events-none" />
            </div>

            {/* County Dropdown */}
            <div className="relative shrink-0">
               <select
                 value={filterCounty}
                 onChange={(e) => setFilterCounty(e.target.value)}
                 className="h-11 pl-4 pr-10 rounded-lg text-[10px] font-bold uppercase tracking-widest pill-surface text-main border border-custom outline-none appearance-none cursor-pointer focus:border-primary-gold/30 transition-all min-w-[140px]"
               >
                 {COUNTIES.map(c => <option key={c} value={c} className="bg-[var(--card-bg)]">{c}</option>)}
               </select>
               <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-custom pointer-events-none" />
            </div>

            {/* Price Dropdown */}
            <div className="relative shrink-0">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-gold text-[10px] font-bold uppercase tracking-widest pointer-events-none">KES</span>
               <select
                 value={filterPrice}
                 onChange={(e) => setFilterPrice(e.target.value)}
                 className="h-11 pl-12 pr-10 rounded-lg text-[10px] font-bold uppercase tracking-widest pill-surface text-main border border-custom outline-none appearance-none cursor-pointer focus:border-primary-gold/30 transition-all min-w-[140px]"
               >
                 <option value="Any Price" className="bg-[var(--card-bg)]">Any Price</option>
                 <option value="Max 5,000" className="bg-[var(--card-bg)]">Max 5,000</option>
                 <option value="Max 10,000" className="bg-[var(--card-bg)]">Max 10,000</option>
                 <option value="Max 15,000" className="bg-[var(--card-bg)]">Max 15,000</option>
                 <option value="Max 20,000" className="bg-[var(--card-bg)]">Max 20,000</option>
                 <option value="Max 30,000" className="bg-[var(--card-bg)]">Max 30,000</option>
                 <option value="Max 50,000" className="bg-[var(--card-bg)]">Max 50,000</option>
               </select>
               <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-custom pointer-events-none" />
            </div>

            {activeTab === 'ROOMMATE' && (
               <div className="relative shrink-0">
                  <select
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                    className="h-11 pl-4 pr-10 rounded-lg text-[10px] font-bold uppercase tracking-widest pill-surface text-main border border-custom outline-none appearance-none cursor-pointer focus:border-primary-gold/30 transition-all min-w-[120px]"
                  >
                    {GENDER_FILTERS.map(g => <option key={g.label} value={g.label} className="bg-[var(--card-bg)]">{g.label}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-custom pointer-events-none" />
               </div>
            )}

            {/* Verified Filter */}
            <button 
              onClick={() => setIsVerifiedOnly(!isVerifiedOnly)}
              className={`h-11 px-4 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all flex items-center gap-2 shrink-0 ${
                isVerifiedOnly 
                  ? 'bg-primary-gold/10 border-primary-gold text-primary-gold' 
                  : 'pill-surface border-custom text-muted-custom hover:text-white'
              }`}
            >
              <ShieldCheck size={14} className={isVerifiedOnly ? 'text-primary-gold' : 'text-muted-custom'} />
              Verified Only
            </button>
          </div>
        </div>

        {/* ─── Content Area ─── */}
        {loading ? (
          <div className="px-4"><Skeleton /></div>
        ) : viewMode === 'grid' ? (
          <div className="px-4">
            <AnimatePresence mode="wait">
              {filteredListings.length > 0 ? (
                <div key="results" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 stagger-children">
                  {filteredListings.map(item => (
                    <ListingCard 
                      key={item.id} 
                      listing={item} 
                      onQuote={(listing) => {
                        setKaoQuoteTarget(listing);
                        setCreatePostOpen(true);
                      }}
                      onViewInMap={(listing) => {
                        setFocusedListing(listing);
                        setViewMode('map');
                        updateQuery({ view: 'map', id: listing.id, lat: listing.lat, lng: listing.lng });
                      }}
                      onRequest={(listing) => setRequestTarget(listing)}
                    />
                  ))}
                </div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="py-20 flex flex-col items-center text-center card-surface rounded-xl border-dashed border-2 border-white/5"
                >
                  <div className="size-16 rounded-full bg-primary-gold/5 flex items-center justify-center text-primary-gold/20 mb-4">
                    <Search size={32} />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white">No Properties Found</h3>
                  <p className="text-[10px] text-muted-custom mt-2 max-w-[200px] leading-relaxed">
                    We couldn't find anything matching your filters.
                  </p>
                  <button 
                    onClick={() => { setFilterType('All Types'); setFilterCounty('All Counties'); setSearchQuery(''); }} 
                    className="mt-6 h-9 px-6 rounded-lg border border-primary-gold/30 text-primary-gold text-[10px] font-bold uppercase tracking-widest hover:bg-primary-gold/10 transition-all"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="h-[calc(100vh-280px)] px-4 relative">
             <div className="size-full rounded-xl overflow-hidden border border-white/5 shadow-2xl relative">
                <KaoMap 
                  items={listings} 
                  onMapMove={handleMapMove}
                  initialFocusItem={focusedListing}
                />
             </div>
          </div>
        )}
      </main>

      <KaoHubModal 
        isOpen={isHubOpen} 
        onClose={() => setIsHubOpen(false)} 
      />

      <KaoUploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        defaultType={activeTab}
        onSuccess={() => {
          setIsUploadOpen(false);
          fetchListings();
        }} 
      />

      <SubmitRequestModal 
        isOpen={!!requestTarget} 
        listing={requestTarget} 
        onClose={() => setRequestTarget(null)} 
      />

      <BottomNav />
    </div>
  );
}

// ─── Kao Hub (Dashboard) ──────────────────────────────────────────────────────
const KaoHubModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'requests'>('listings');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.get('/kao/me').then(res => {
        setData(res);
        setLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStatusUpdate = async (id: string, status: 'ACCEPTED' | 'DECLINED') => {
     try {
       await api.post(`/kao/requests/${id}/status`, { status });
       // Refresh
       const res = await api.get('/kao/me');
       setData(res);
     } catch (err) {
       console.error("Failed to update status", err);
     }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-end">
       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
       <motion.div 
         initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
         className="relative w-full max-w-xl h-full bg-[var(--bg-color)] border-l border-custom shadow-2xl flex flex-col"
       >
          <div className="p-8 border-b border-custom flex items-center justify-between">
             <div className="flex flex-col gap-1">
                <h2 className="text-xl font-bold uppercase tracking-[0.15em] text-primary-gold gold-glow">Kao Hub</h2>
                <p className="text-[9px] font-bold uppercase tracking-wider text-muted-custom">Manage your real estate & social discovery</p>
             </div>
             <button onClick={onClose} className="size-10 rounded-xl bg-white/5 border border-custom flex items-center justify-center text-muted-custom hover:text-white transition-all"><X size={20} /></button>
          </div>

          <div className="p-4 bg-white/5 flex gap-2">
             <button onClick={() => setActiveTab('listings')} className={`flex-1 h-12 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'listings' ? 'bg-primary-gold text-black shadow-lg shadow-primary-gold/20' : 'text-muted-custom hover:text-white'}`}>My Listings</button>
             <button onClick={() => setActiveTab('requests')} className={`flex-1 h-12 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'requests' ? 'bg-primary-gold text-black shadow-lg shadow-primary-gold/20' : 'text-muted-custom hover:text-white'}`}>My Requests</button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
             {loading ? (
               <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />)}
               </div>
             ) : activeTab === 'listings' ? (
               <div className="space-y-4">
                  {data?.listings.map((l: any) => (
                    <div key={l.id} className="p-4 rounded-2xl card-surface border-custom group hover:border-primary-gold/30 transition-all flex items-center gap-4">
                       <div className="size-16 rounded-xl overflow-hidden bg-black/20 relative">
                          {l.images?.[0] && <Image src={l.images[0]} alt="" fill className="object-cover" />}
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                             <h3 className="text-[11px] font-bold uppercase tracking-widest truncate">{l.title}</h3>
                             <Badge gold={l.listingType === 'ROOMMATE'}>{l.listingType}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-[9px] font-bold text-muted-custom uppercase">
                             <span>KES {l.price?.toLocaleString()}</span>
                             <span>•</span>
                             <span>{l.area}</span>
                          </div>
                       </div>
                       <div className="text-[10px] font-bold text-primary-gold bg-primary-gold/10 px-3 py-1.5 rounded-lg">
                          {l.requests?.length || 0} REQUESTS
                       </div>
                    </div>
                  ))}
               </div>
             ) : (
               <div className="space-y-8">
                  <div className="space-y-4">
                     <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-custom px-2">Incoming Requests</h3>
                     {data?.receivedRequests.map((r: any) => (
                       <div key={r.id} className="p-5 rounded-2xl card-surface border-custom">
                          <div className="flex items-center gap-3 mb-4">
                             <div className="size-10 rounded-full border-2 border-primary-gold overflow-hidden">
                                {r.sender?.avatar ? <Image src={r.sender.avatar} alt="" width={40} height={40} className="object-cover" /> : <div className="size-full flex items-center justify-center bg-primary-gold/10 text-primary-gold"><User size={20} /></div>}
                             </div>
                             <div className="flex-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white">{r.sender?.username}</span>
                                <div className="text-[8px] font-bold text-muted-custom uppercase mt-0.5">{r.sender?.gender} • {r.sender?.dateOfBirth ? (new Date().getFullYear() - new Date(r.sender.dateOfBirth).getFullYear()) : 'N/A'} YRS</div>
                             </div>
                             <Badge gold={r.status === 'ACCEPTED'} className={r.status === 'PENDING' ? 'bg-orange-500/10 text-orange-500 border-orange-500/30' : ''}>{r.status}</Badge>
                          </div>
                          <p className="text-[10px] text-muted-custom leading-relaxed mb-4 italic">"{r.message || 'No message provided'}"</p>
                          <div className="flex items-center gap-2">
                             <span className="text-[9px] font-bold text-muted-custom uppercase">For: {r.listing?.title}</span>
                          </div>
                          {r.status === 'PENDING' && (
                             <div className="flex gap-2 mt-4 pt-4 border-t border-custom">
                                <button onClick={() => handleStatusUpdate(r.id, 'ACCEPTED')} className="flex-1 h-9 rounded-lg bg-primary-gold text-black text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">Accept</button>
                                <button onClick={() => handleStatusUpdate(r.id, 'DECLINED')} className="flex-1 h-9 rounded-lg pill-surface border border-custom text-[9px] font-bold uppercase tracking-widest text-muted-custom">Decline</button>
                             </div>
                          )}
                       </div>
                     ))}
                  </div>

                  <div className="space-y-4">
                     <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-custom px-2">Sent Requests</h3>
                     {data?.sentRequests.map((r: any) => (
                        <div key={r.id} className="p-4 rounded-xl pill-surface border border-custom flex items-center gap-4">
                           <div className="size-12 rounded-lg bg-black/20 relative overflow-hidden">
                              {r.listing?.images?.[0] && <Image src={r.listing.images[0]} alt="" fill className="object-cover" />}
                           </div>
                           <div className="flex-1 min-w-0">
                              <h4 className="text-[10px] font-bold uppercase tracking-widest truncate mb-1">{r.listing?.title}</h4>
                              <span className="text-[8px] font-bold text-muted-custom uppercase">Sent to {r.receiver?.username}</span>
                           </div>
                           <Badge gold={r.status === 'ACCEPTED'}>{r.status}</Badge>
                        </div>
                     ))}
                  </div>
               </div>
             )}
          </div>
       </motion.div>
    </div>
  );
};
