'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LeftSidebar from '@/components/LeftSidebar';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import {
  ArrowLeft, MapPin, ShieldCheck, Heart, Share2, Star,
  Repeat2, Truck, Package, Phone, MessageCircle, Flag,
  Check, Send, User, Clock, Navigation, AlertTriangle, Camera
} from 'lucide-react';

// ─── Mock data ───────────────────────────────────────────────────────────────
const LISTINGS: Record<string, any> = {
  m1: {
    title: "iPhone 14 Pro Max 256GB", price: 95000, category: "ELECTRONICS", tradeType: "SELL",
    barterFor: null, condition: "Like New", county: "Nairobi", area: "Westlands",
    description: "Barely used iPhone 14 Pro Max, 256GB Deep Purple. Battery health 97%. Comes with original box, charger, and unused EarPods. No scratches, always had a case and screen protector. Reason for selling: upgrading to 16.",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1000",
    ],
    seller: { id: "s1", name: "TechHub KE", verified: true, safetyScore: 92, rating: 4.9, deals: 142, responseTime: "< 5min", joined: "1 year ago", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100" },
    tags: ["Warranty", "Box Included", "Original"], saccoDelivery: true, flagCount: 0,
  },
  m2: {
    title: "Nike Air Jordan 1 Retro", price: 12000, category: "FASHION", tradeType: "BOTH",
    barterFor: "Adidas Yeezy 350 or equivalent sneakers (Size 42-44)", condition: "Good", county: "Nairobi", area: "CBD",
    description: "Authentic Nike Air Jordan 1 Retro High OG. Size 43. Worn about 10 times — still very clean. Minor creasing on the toe box. Will trade for Yeezy 350s or similar value sneakers in my size.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000",
    ],
    seller: { id: "s2", name: "SneakerHeadKE", verified: false, safetyScore: 68, rating: 4.2, deals: 14, responseTime: "~2hrs", joined: "3 months ago", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100" },
    tags: ["Original", "Size 43"], saccoDelivery: false, flagCount: 0,
  },
  m3: {
    title: "Samsung 55\" Smart TV", price: 45000, category: "ELECTRONICS", tradeType: "SELL",
    barterFor: null, condition: "New", county: "Kiambu", area: "Ruaka",
    description: "Brand new, sealed box Samsung 55\" 4K UHD Smart TV (2024 model). Comes with official Samsung Kenya warranty card. Selling because I bought two by mistake.",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=1000",
    ],
    seller: { id: "s3", name: "HomeGoods254", verified: true, safetyScore: 88, rating: 4.8, deals: 67, responseTime: "< 30min", joined: "8 months ago", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100" },
    tags: ["Sealed Box", "Official Warranty"], saccoDelivery: true, flagCount: 0,
  },
  m4: {
    title: "Vintage Leather Armchair", price: 28000, category: "FURNITURE", tradeType: "BARTER",
    barterFor: "Standing desk or ergonomic office chair of similar value", condition: "Good", county: "Nairobi", area: "Kilimani",
    description: "Beautiful vintage brown leather armchair in great condition. Very comfortable and sturdy. I'm redecorating and need a standing desk instead. Open to trading for any quality office furniture.",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000",
    ],
    seller: { id: "s4", name: "Amara K.", verified: false, safetyScore: 55, rating: 4.0, deals: 3, responseTime: "Same day", joined: "1 month ago", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100" },
    tags: ["Real Leather", "Heavy"], saccoDelivery: false, flagCount: 1,
  },
  m5: {
    title: "Toyota Vitz 2015 — Clean!", price: 750000, category: "VEHICLES", tradeType: "SELL",
    barterFor: null, condition: "Good", county: "Nairobi", area: "Langata",
    description: "Toyota Vitz 2015 model, 1300cc. Very clean, well-maintained, low mileage (68,000km). Full service history. Lady-owned. Reason: upgrading. Serious buyers only. Test drives at Langata by appointment.",
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1000",
    ],
    seller: { id: "s5", name: "Motor254", verified: true, safetyScore: 95, rating: 4.9, deals: 89, responseTime: "< 15min", joined: "2 years ago", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100" },
    tags: ["1300cc", "Low Mileage", "Service History"], saccoDelivery: false, flagCount: 0,
  },
  m6: {
    title: "PS5 + 3 Games Bundle", price: 68000, category: "ELECTRONICS", tradeType: "BOTH",
    barterFor: "Gaming laptop or MacBook Air M2", condition: "Like New", county: "Mombasa", area: "Nyali",
    description: "PlayStation 5 Disc Edition with 2 controllers and 3 games (FIFA 24, Spider-Man 2, God of War Ragnarok). Used for about 4 months. Everything works perfectly. Willing to trade for a decent gaming laptop or MacBook Air M2.",
    images: [
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=1000",
    ],
    seller: { id: "s6", name: "GameZone", verified: true, safetyScore: 84, rating: 4.6, deals: 34, responseTime: "< 1hr", joined: "6 months ago", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100" },
    tags: ["2 Controllers", "3 Games", "Barely Used"], saccoDelivery: true, flagCount: 0,
  },
};

const SACCO_DRIVERS = [
  { name: "James M.", sacco: "Umoinner Sacco", route: "Westlands → CBD → Eastlands", eta: "2hrs", rating: 4.7, trips: 234 },
  { name: "Lucy W.", sacco: "Forward Travellers", route: "Kiambu → Westlands → Langata", eta: "3hrs", rating: 4.9, trips: 189 },
  { name: "Peter K.", sacco: "2NK Sacco", route: "Ruaka → CBD → South B", eta: "4hrs", rating: 4.5, trips: 312 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const Badge = ({ children, gold }: { children: React.ReactNode; gold?: boolean }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
    gold ? 'bg-primary-gold/10 text-primary-gold border-primary-gold/30' : 'bg-[var(--pill-bg)] text-muted-custom border-custom'
  }`}>{children}</span>
);

const SafetyMeter = ({ score, large }: { score: number; large?: boolean }) => {
  const color = score >= 80 ? '#c5a059' : score >= 60 ? '#e2c27d' : '#a07d3a';
  return (
    <div className="flex items-center gap-2">
      <div className={`${large ? 'w-20 h-1.5' : 'w-12 h-1'} rounded-full overflow-hidden`} style={{ backgroundColor: 'var(--pill-bg)' }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className={`${large ? 'text-[10px]' : 'text-[8px]'} font-bold`} style={{ color }}>{score}/100</span>
    </div>
  );
};

// ─── Page ────────────────────────────────────────────────────────────────────
export default function MarketListingPage() {
  const params = useParams();
  const id = params.id as string;
  const item = LISTINGS[id];

  const [activePhoto, setActivePhoto] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ from: string; text: string; time: string }[]>([
    { from: 'seller', text: 'Hi! Yes it\'s still available. When can you come check it out?', time: '2:30 PM' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showReport, setShowReport] = useState(false);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, { from: 'buyer', text: chatInput, time: 'Now' }]);
    setChatInput('');
  };

  if (!item) {
    return (
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
        <LeftSidebar />
        <main className="flex-1 w-full max-w-3xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
          <TopBar />
          <div className="px-4 pt-20 text-center">
            <h1 className="text-lg font-bold uppercase tracking-widest text-muted-custom">Listing Not Found</h1>
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
          <p className="text-[11px] text-muted-custom font-bold leading-relaxed">{item.description}</p>
          <div className="flex flex-wrap gap-1 mt-3">
            {item.tags.map((tag: string) => <Badge key={tag}>{tag}</Badge>)}
          </div>
        </div>

        {/* Seller Card */}
        <div className="px-4 mb-6">
          <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">Seller</h2>
          <div className="card-surface rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative shrink-0">
                <Image src={item.seller.avatar} alt="" width={40} height={40} className="rounded object-cover" />
                {item.seller.verified && (
                  <div className="absolute -bottom-0.5 -right-0.5 size-4 rounded-sm bg-primary-gold flex items-center justify-center">
                    <ShieldCheck size={10} className="text-black" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <Link href={`/marketplace/seller/${item.seller.id}`} className="text-[11px] font-bold uppercase tracking-widest hover:text-primary-gold transition-colors">{item.seller.name}</Link>
                  {item.seller.verified && <Badge gold>Verified</Badge>}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-0.5 text-[9px] font-bold text-primary-gold"><Star size={9} className="fill-primary-gold" /> {item.seller.rating}</span>
                  <span className="text-[9px] text-muted-custom">{item.seller.deals} deals</span>
                  <span className="text-[9px] text-muted-custom"><Clock size={9} className="inline" /> {item.seller.responseTime}</span>
                </div>
              </div>
            </div>

            {/* Safety Score */}
            <div className="card-surface rounded p-3 mb-4">
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1">
                <span>Safety Score</span>
                <span className="text-primary-gold">{item.seller.safetyScore >= 80 ? 'Trusted' : item.seller.safetyScore >= 60 ? 'Moderate' : 'New'}</span>
              </div>
              <SafetyMeter score={item.seller.safetyScore} large />
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2.5 bg-primary-gold text-black rounded text-[9px] font-bold uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-1.5">
                <Phone size={12} /> Contact
              </button>
              <Link href={`/marketplace/seller/${item.seller.id}`} className="flex-1 py-2.5 card-surface rounded text-[9px] font-bold uppercase tracking-widest text-primary-gold hover:border-primary-gold/30 transition-all active:scale-95 flex items-center justify-center gap-1.5">
                View Store
              </Link>
            </div>
          </div>
        </div>

        {/* Negotiation Chat */}
        <div className="px-4 mb-6">
          <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">Negotiate</h2>
          <div className="card-surface rounded-lg overflow-hidden">
            <div className="p-3 border-b border-custom flex items-center gap-2">
              <MessageCircle size={12} className="text-primary-gold" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">Chat with seller — agree on price before paying</span>
            </div>
            <div className="p-3 space-y-2 max-h-48 overflow-y-auto no-scrollbar">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] px-3 py-1.5 rounded-lg text-[10px] font-bold ${
                    msg.from === 'buyer' ? 'bg-primary-gold/15 text-primary-gold' : 'card-surface'
                  }`}>
                    {msg.text}
                    <span className="block text-[7px] text-muted-custom mt-0.5">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-custom flex gap-2">
              <input type="text" placeholder="Make an offer or ask a question…" className="flex-1 bg-transparent outline-none text-[10px] font-bold placeholder:text-muted-custom/50 px-2"
                value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} />
              <button onClick={sendMessage} className="size-7 rounded bg-primary-gold text-black flex items-center justify-center hover:brightness-110 transition-all active:scale-90">
                <Send size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Sacco Delivery Panel */}
        {item.saccoDelivery && (
          <div className="px-4 mb-6">
            <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">Sacco Delivery</h2>
            <div className="card-surface rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Truck size={14} className="text-primary-gold" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Drivers Heading Your Way</span>
              </div>
              <div className="space-y-2 mb-4">
                {SACCO_DRIVERS.map((driver, i) => (
                  <div key={i} className="card-surface rounded p-2.5 flex items-center gap-2.5">
                    <div className="size-8 rounded bg-primary-gold/10 flex items-center justify-center text-primary-gold border border-primary-gold/20">
                      <User size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold">{driver.name}</span>
                        <span className="text-[8px] text-muted-custom">({driver.sacco})</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Navigation size={8} className="text-primary-gold/60" />
                        <span className="text-[8px] text-muted-custom truncate">{driver.route}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[9px] font-bold text-primary-gold block">ETA {driver.eta}</span>
                      <span className="text-[7px] text-muted-custom flex items-center gap-0.5 justify-end"><Star size={7} className="fill-primary-gold text-primary-gold" /> {driver.rating} · {driver.trips}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Escrow CTA */}
              <div className="card-surface rounded p-3 border-l-2 border-l-primary-gold">
                <div className="flex items-center gap-2 mb-1">
                  <Package size={12} className="text-primary-gold" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Pay & Hold — Escrow Protection</span>
                </div>
                <p className="text-[9px] text-muted-custom leading-relaxed mb-2">
                  Your money is held securely until the delivery driver marks the parcel as received. Full refund if anything goes wrong.
                </p>
                <button className="w-full py-2 bg-primary-gold text-black rounded text-[9px] font-bold uppercase tracking-widest hover:brightness-110 transition-all active:scale-95">
                  Pay KES {item.price.toLocaleString()} — Hold in Escrow
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Report / Flag */}
        <div className="px-4 mb-6">
          <button onClick={() => setShowReport(!showReport)} className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-muted-custom hover:text-accent-gold transition-colors">
            <Flag size={10} /> Report this listing
          </button>
          {showReport && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 card-surface rounded-lg p-3">
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-2 block">Reason</span>
              <div className="space-y-1.5 mb-3">
                {['Suspected scam', 'Fake / misleading photos', 'Offensive content', 'Already sold', 'Wrong category', 'Other'].map(reason => (
                  <button key={reason} className="w-full text-left px-3 py-1.5 rounded text-[10px] font-bold card-surface hover:border-primary-gold/30 transition-all border border-custom">
                    {reason}
                  </button>
                ))}
              </div>
              <button className="w-full py-2 rounded text-[9px] font-bold uppercase tracking-widest bg-accent-gold/10 text-accent-gold border border-accent-gold/30 hover:bg-accent-gold/20 transition-all">
                Submit Report
              </button>
            </motion.div>
          )}
        </div>

        {/* Safety Checklist */}
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
