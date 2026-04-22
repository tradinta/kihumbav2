'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LeftSidebar from '@/components/LeftSidebar';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import {
  ArrowLeft, MapPin, Heart, Share2,
  Repeat2, Truck, Phone, User, Check, Flag, AlertTriangle, Camera
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import CommentThread from '@/components/shared/CommentThread';
import UserIdentity from '@/components/shared/UserIdentity';
import { usePostContext } from '@/context/PostContext';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const Badge = ({ children, gold }: { children: React.ReactNode; gold?: boolean }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
    gold ? 'bg-primary-gold/10 text-primary-gold border-primary-gold/30' : 'bg-[var(--pill-bg)] text-muted-custom border-custom'
  }`}>{children}</span>
);

export default function MarketListingClient({ id }: { id: string }) {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { setCreatePostOpen, setMarketQuoteTarget } = usePostContext();
  
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleQuote = () => {
    setMarketQuoteTarget(item);
    setCreatePostOpen(true);
  };

  useEffect(() => {
    async function fetchItem() {
      try {
        const data = await api.get(`/marketplace/listings/${id}`);
        setItem(data);
      } catch (err) {
        console.error("Failed to fetch item", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchItem();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-xs uppercase tracking-[0.2em] text-primary-gold animate-pulse">Gathering details...</div>;
  }

  if (!item) {
    return (
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
        <LeftSidebar />
        <main className="flex-1 w-full max-w-3xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12 text-center py-20">
          <TopBar />
          <AlertTriangle size={48} className="text-primary-gold/20 mx-auto mb-4" />
          <h1 className="text-lg font-bold uppercase tracking-widest text-muted-custom">Listing Not Found</h1>
          <p className="text-[10px] text-muted-custom mt-2 mb-6">This item may have been sold or removed.</p>
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary-gold hover:underline bg-primary-gold/5 px-4 py-2 rounded-lg border border-primary-gold/20 transition-all">
            <ArrowLeft size={12} /> Back to Marketplace
          </Link>
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
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom truncate max-w-[200px]">{item.title}</span>
        </div>

        {/* Image Gallery */}
        <div className="px-4 mb-6">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden card-surface">
            <AnimatePresence mode="wait">
              <motion.div key={activePhoto} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                <Image src={item.images[activePhoto]} alt="Product" fill className="object-cover" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            <div className="absolute top-3 right-3 flex gap-2">
              <button onClick={() => setIsLiked(!isLiked)} className={`size-8 rounded-lg flex items-center justify-center backdrop-blur transition-all ${isLiked ? 'bg-primary-gold text-black' : 'bg-black/30 text-white/80 hover:bg-primary-gold hover:text-black'}`}>
                <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
              </button>
              <button 
                onClick={handleQuote}
                className="size-8 rounded-lg bg-black/30 backdrop-blur flex items-center justify-center text-white/80 hover:bg-primary-gold hover:text-black transition-all"
                title="Quote this item"
              >
                <Repeat2 size={14} />
              </button>
              <button className="size-8 rounded-lg bg-black/30 backdrop-blur flex items-center justify-center text-white/80 hover:bg-primary-gold hover:text-black transition-all">
                <Share2 size={14} />
              </button>
            </div>

            <div className="absolute top-3 left-3"><Badge gold><Camera size={10} /> {item.images.length}</Badge></div>

            <div className="absolute bottom-3 left-3 flex gap-2">
              {item.images.map((_: string, i: number) => (
                <button key={i} onClick={() => setActivePhoto(i)} className={`size-10 rounded-lg border-2 overflow-hidden relative transition-all ${activePhoto === i ? 'border-primary-gold scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <Image src={item.images[i]} fill alt="Thumb" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Title + Badges */}
        <div className="px-4 mb-4">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <Badge gold>{item.category}</Badge>
            <Badge>{item.condition}</Badge>
            {item.tradeType === 'BARTER' && <Badge gold><Repeat2 size={9} /> Barter Only</Badge>}
            {item.tradeType === 'BOTH' && <Badge gold><Repeat2 size={9} /> Buy or Trade</Badge>}
            {item.saccoDelivery && <Badge gold><Truck size={9} /> Sacco Delivery</Badge>}
          </div>
          <h1 className="text-xl font-bold tracking-[0.1em] uppercase leading-tight mb-1">{item.title}</h1>
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="text-primary-gold" />
            <span className="text-[11px] font-bold text-muted-custom">{item.area}, {item.county}</span>
          </div>
        </div>

        {/* Price + Barter Card */}
        <div className="px-4 mb-6">
          <div className="card-surface rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom block mb-0.5">
                  {item.tradeType === 'BARTER' ? 'Estimated Value' : 'Asking Price'}
                </span>
                <span className="text-lg font-bold text-primary-gold gold-glow">KES {item.price.toLocaleString()}</span>
              </div>
              {item.barterFor && (
                <div className="flex-1 ml-4 pl-4 border-l border-custom">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom block mb-0.5">Will Trade For</span>
                  <span className="text-[11px] font-bold flex items-center gap-1"><Repeat2 size={12} className="text-primary-gold" /> {item.barterFor}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="px-4 mb-6">
          <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-2">Description</h2>
          <p className="text-[11px] text-main font-bold leading-relaxed">{item.description}</p>
          
          {item.whatsIncluded && item.whatsIncluded.length > 0 && (
            <div className="mt-4">
              <h3 className="text-[8px] font-bold uppercase tracking-widest text-muted-custom mb-2">What's Included</h3>
              <div className="flex flex-wrap gap-2">
                {item.whatsIncluded.map((included: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-custom border border-custom text-[10px] font-bold flex items-center gap-2">
                    <Check size={12} className="text-primary-gold" /> {included}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-1 mt-4">
            {item.tags?.map((tag: string) => <Badge key={tag}>#{tag}</Badge>)}
          </div>
        </div>

        {/* Seller Card */}
        <div className="px-4 mb-6">
          <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">Seller</h2>
          <div className="card-surface rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <UserIdentity user={item.seller} size="md" />
              <div className="text-right">
                <span className="text-[9px] text-muted-custom block font-bold uppercase tracking-widest">Since</span>
                <span className="text-[10px] font-bold">{new Date(item.seller.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <a 
                href={item.sellerPhone ? `tel:${item.sellerPhone}` : '#'} 
                className={`flex-1 py-2.5 bg-primary-gold text-black rounded text-[9px] font-bold uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-1.5 ${!item.sellerPhone && 'opacity-50 cursor-not-allowed'}`}
                onClick={(e) => !item.sellerPhone && e.preventDefault()}
              >
                <Phone size={12} /> {item.sellerPhone || 'No Phone'}
              </a>
              <Link href={`/profile/${item.seller.username}`} className="flex-1 py-2.5 card-surface rounded text-[9px] font-bold uppercase tracking-widest text-primary-gold hover:border-primary-gold/30 transition-all active:scale-95 flex items-center justify-center gap-1.5">
                <User size={12} /> View Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Negotiation / Comments */}
        <div className="px-4 mb-6">
          <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">Community Thread</h2>
          <div className="h-[500px]">
            <CommentThread targetType="MARKET_LISTING" targetId={item.id} />
          </div>
        </div>

        {/* Safety Tips */}
        <div className="px-4 mb-6">
          <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">Safety Tips</h2>
          <div className="card-surface rounded-lg p-4">
            <ul className="space-y-2">
              {[
                'Meet in a public, well-lit place',
                'Don\'t send money before seeing the item',
                'Use Sacco escrow for deliveries',
                'Check seller\'s safety score and reviews',
                'Trust your instinct — if it\'s too good to be true, it probably is',
              ].map((tip, i) => (
                <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-muted-custom">
                  <div className="size-4 rounded bg-primary-gold/10 flex items-center justify-center text-primary-gold border border-primary-gold/20 shrink-0">
                    <Check size={10} />
                  </div>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
