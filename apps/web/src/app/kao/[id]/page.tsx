'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LeftSidebar from '@/components/LeftSidebar';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import {
  ArrowLeft, MapPin, Wifi, Zap, Droplets, Lock, ShieldCheck,
  Star, Clock, Camera, Calendar, MessageCircle, Phone, Heart,
  Share2, CheckCircle2, User, AlertTriangle, Check, Flame, Building2
} from 'lucide-react';

// ─── Mock Property Database ──────────────────────────────────────────────────
const PROPERTIES: Record<string, any> = {
  "1": {
    title: "Executive Bedsitter – Gate C",
    price: 12500,
    deposit: 5000,
    location: "Juja, Kiambu",
    hostelName: "Sarah Properties Complex",
    type: "Bedsitter",
    dueDate: "1st of every month",
    rating: 4.8,
    reviews: 12,
    isVerified: true,
    isIndividual: false,
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=1200",
    ],
    features: [
      { icon: "wifi", label: "Fiber Internet", sub: "Included" },
      { icon: "zap", label: "Token Meter", sub: "Prepaid" },
      { icon: "lock", label: "24/7 Security", sub: "CCTV + Guard" },
      { icon: "droplets", label: "Borehole", sub: "24hr Water" },
    ],
    communityVibe: [
      { label: "Quiet Environment", score: 85 },
      { label: "Proximity to Campus", score: 90 },
      { label: "Safety (Area)", score: 80 },
    ],
    description: "A clean, well-maintained bedsitter near Gate C. The compound has a borehole for 24-hour water supply, CCTV cameras, and a night guard. Fiber internet is available. Close to shops and matatu stage.",
    landlord: { name: "Sarah Njeri", joined: "6 months ago", verified: true, responseTime: "< 1hr" },
  },
  "2": {
    title: "Modern 1BR near Yaya",
    price: 38000,
    deposit: 38000,
    location: "Kilimani, Nairobi",
    hostelName: "Pinnacle Homes",
    type: "1 Bedroom",
    dueDate: "5th of every month",
    rating: 4.9,
    reviews: 24,
    isVerified: true,
    isIndividual: false,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200",
    ],
    features: [
      { icon: "wifi", label: "High-Speed WiFi", sub: "Included" },
      { icon: "zap", label: "KPLC Meter", sub: "Prepaid" },
      { icon: "lock", label: "Biometric Access", sub: "24/7" },
      { icon: "droplets", label: "Borehole+NCWSC", sub: "24hr Water" },
    ],
    communityVibe: [
      { label: "Night-life Access", score: 95 },
      { label: "Safety (Area)", score: 85 },
      { label: "Transport Links", score: 90 },
    ],
    description: "Premium 1-bedroom apartment in the heart of Kilimani, walking distance to Yaya Centre. Modern finishes, spacious balcony, and ample natural light. The building has an elevator and dedicated parking.",
    landlord: { name: "Pinnacle Homes Ltd", joined: "2 years ago", verified: true, responseTime: "< 30min" },
  },
  "3": {
    title: "Room available – Madaraka",
    price: 8500,
    deposit: 0,
    location: "Madaraka, Nairobi",
    hostelName: "Private Residence",
    type: "Single Room",
    dueDate: "1st of every month",
    rating: 4.5,
    reviews: 3,
    isVerified: false,
    isIndividual: true,
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=1200",
    ],
    features: [
      { icon: "wifi", label: "Shared WiFi", sub: "Cost Shared" },
      { icon: "zap", label: "Tokens", sub: "Prepaid" },
      { icon: "lock", label: "Gated Compound", sub: "Manual" },
    ],
    communityVibe: [
      { label: "Proximity to Campus", score: 85 },
      { label: "Quiet Environment", score: 70 },
      { label: "Safety (Area)", score: 65 },
    ],
    description: "Looking for a female roommate to take over my room for the next semester. Shared bathroom with one person, clean compound, near matatu stage and shops. Very friendly neighbours.",
    landlord: { name: "Brenda K.", joined: "2 weeks ago", verified: false, responseTime: "Varies" },
  },
  "4": {
    title: "Double Room – Bamburi",
    price: 18000,
    deposit: 9000,
    location: "Bamburi, Mombasa",
    hostelName: "Coast Rentals",
    type: "2 Bedroom",
    dueDate: "1st of every month",
    rating: 4.7,
    reviews: 18,
    isVerified: true,
    isIndividual: false,
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200",
    ],
    features: [
      { icon: "wifi", label: "WiFi Available", sub: "Extra Cost" },
      { icon: "zap", label: "Token Meter", sub: "Prepaid" },
      { icon: "lock", label: "Night Guard", sub: "Gated" },
    ],
    communityVibe: [
      { label: "Beach Proximity", score: 95 },
      { label: "Safety (Area)", score: 75 },
      { label: "Market Access", score: 80 },
    ],
    description: "Spacious 2-bedroom apartment in Bamburi, just 10 minutes walk from the beach. Large living room, tiled floors, and a balcony with ocean breeze. Great for young professionals.",
    landlord: { name: "Coast Rentals", joined: "1 year ago", verified: true, responseTime: "< 1hr" },
  },
  "5": {
    title: "Spacious SQ – Ruaka",
    price: 15000,
    deposit: 7500,
    location: "Ruaka, Kiambu",
    hostelName: "Private",
    type: "SQ",
    dueDate: "5th of every month",
    rating: 4.6,
    reviews: 6,
    isVerified: false,
    isIndividual: true,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200",
    ],
    features: [
      { icon: "lock", label: "Electric Fence", sub: "Gated" },
      { icon: "zap", label: "Token Meter", sub: "Prepaid" },
    ],
    communityVibe: [
      { label: "Quiet Environment", score: 90 },
      { label: "Transport Links", score: 70 },
      { label: "Safety (Area)", score: 85 },
    ],
    description: "Private entrance SQ in a quiet home compound. Own bathroom and kitchenette. Ideal for a single working professional who values privacy. Near Ruaka town centre.",
    landlord: { name: "Mark D.", joined: "3 months ago", verified: false, responseTime: "Same day" },
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const Badge = ({ children, gold, className }: { children: React.ReactNode; gold?: boolean; className?: string }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
    gold ? 'bg-primary-gold/10 text-primary-gold border-primary-gold/30' : 'bg-[var(--pill-bg)] text-muted-custom border-custom'
  } ${className ?? ''}`}>{children}</span>
);

const FeatureIcon = ({ type }: { type: string }) => {
  const iconMap: Record<string, React.ReactNode> = {
    wifi: <Wifi size={18} />,
    zap: <Zap size={18} />,
    lock: <Lock size={18} />,
    droplets: <Droplets size={18} />,
  };
  return <>{iconMap[type] || <Star size={18} />}</>;
};

// ─── Page Component ──────────────────────────────────────────────────────────
export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const property = PROPERTIES[id];

  const [activePhoto, setActivePhoto] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  if (!property) {
    return (
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
        <LeftSidebar />
        <main className="flex-1 w-full max-w-3xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
          <TopBar />
          <div className="px-4 pt-20 text-center">
            <h1 className="text-lg font-bold uppercase tracking-widest text-muted-custom">Property Not Found</h1>
            <Link href="/kao" className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary-gold hover:underline">
              <ArrowLeft size={12} /> Back to Kao
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

        {/* ─── Back + Breadcrumb ─── */}
        <div className="px-4 pt-4 pb-2 flex items-center gap-2">
          <Link href="/kao" className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary-gold hover:underline">
            <ArrowLeft size={12} /> Kao
          </Link>
          <span className="text-[9px] text-muted-custom">/</span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom truncate max-w-[200px]">{property.title}</span>
        </div>

        {/* ─── Hero Image Gallery ─── */}
        <div className="px-4 mb-6">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden card-surface">
            <AnimatePresence mode="wait">
              <motion.div key={activePhoto} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="w-full h-full">
                <Image src={property.images[activePhoto]} alt="Property" fill className="object-cover" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Top actions */}
            <div className="absolute top-3 right-3 flex gap-2">
              <button onClick={() => setIsLiked(!isLiked)} className={`size-8 rounded-lg flex items-center justify-center backdrop-blur transition-all ${isLiked ? 'bg-primary-gold text-black' : 'bg-black/30 text-white/80 hover:bg-primary-gold hover:text-black'}`}>
                <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
              </button>
              <button className="size-8 rounded-lg bg-black/30 backdrop-blur flex items-center justify-center text-white/80 hover:bg-primary-gold hover:text-black transition-all">
                <Share2 size={14} />
              </button>
            </div>

            {/* Photo counter */}
            <div className="absolute top-3 left-3">
              <Badge gold><Camera size={10} /> {property.images.length} Photos</Badge>
            </div>

            {/* Thumbnails bar */}
            <div className="absolute bottom-3 left-3 flex gap-2">
              {property.images.map((img: string, i: number) => (
                <button key={i} onClick={() => setActivePhoto(i)} className={`size-10 rounded-lg border-2 overflow-hidden relative transition-all ${activePhoto === i ? 'border-primary-gold scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <Image src={img} fill alt="Thumb" className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Title + Badges ─── */}
        <div className="px-4 mb-4">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {property.isVerified ? (
              <Badge gold><ShieldCheck size={10} /> Verified</Badge>
            ) : (
              <Badge><Clock size={10} /> Pending Verification</Badge>
            )}
            <Badge gold>{property.type}</Badge>
            {property.isIndividual && <Badge><User size={10} /> Individual</Badge>}
          </div>
          <h1 className="text-xl font-bold tracking-[0.1em] uppercase leading-tight mb-1">{property.title}</h1>
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="text-primary-gold" />
            <span className="text-[11px] font-bold text-muted-custom">{property.location}</span>
            <span className="text-muted-custom">·</span>
            <div className="flex items-center gap-0.5">
              <Star size={10} className="fill-primary-gold text-primary-gold" />
              <span className="text-[11px] font-bold">{property.rating}</span>
              <span className="text-[10px] text-muted-custom">({property.reviews})</span>
            </div>
          </div>
        </div>

        {/* ─── Price Card ─── */}
        <div className="px-4 mb-6">
          <div className="card-surface rounded-lg p-4 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom block mb-0.5">Asking Rent</span>
              <span className="text-lg font-bold text-primary-gold gold-glow">KES {property.price.toLocaleString()}<span className="text-[10px] text-muted-custom ml-1 font-bold">/mo</span></span>
            </div>
            <div className="h-8 w-px bg-[var(--border-color)]" />
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom block mb-0.5">Deposit</span>
              <span className="text-lg font-bold">{property.deposit === 0 ? 'None' : `KES ${property.deposit.toLocaleString()}`}</span>
            </div>
            <div className="h-8 w-px bg-[var(--border-color)]" />
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom block mb-0.5">Due Date</span>
              <span className="text-[11px] font-bold">{property.dueDate}</span>
            </div>
          </div>
        </div>

        {/* ─── Individual Warning ─── */}
        {property.isIndividual && (
          <div className="px-4 mb-6">
            <div className="card-surface rounded-lg p-4 border-l-2 border-l-accent-gold flex gap-3 items-start">
              <AlertTriangle size={18} className="text-accent-gold shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-accent-gold mb-1">Individual Listing</h4>
                <p className="text-[10px] text-muted-custom leading-relaxed">
                  This is an unverified listing by a private individual. <strong className="text-primary-gold">Never pay viewing fees or deposits</strong> before meeting the owner and verifying the property.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── Features Grid ─── */}
        <div className="px-4 mb-6">
          <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {property.features.map((feat: any, i: number) => (
              <div key={i} className="card-surface rounded-lg p-3 flex flex-col items-center text-center gap-1.5">
                <div className="size-8 rounded bg-primary-gold/10 flex items-center justify-center text-primary-gold border border-primary-gold/20">
                  <FeatureIcon type={feat.icon} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">{feat.label}</span>
                <span className="text-[9px] text-muted-custom">{feat.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Description ─── */}
        <div className="px-4 mb-6">
          <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-2">Description</h2>
          <p className="text-[11px] text-muted-custom font-bold leading-relaxed">{property.description}</p>
        </div>

        {/* ─── Community Vibe Bars ─── */}
        <div className="px-4 mb-6">
          <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">Community Vibe</h2>
          <div className="card-surface rounded-lg p-4 space-y-4">
            {property.communityVibe.map((life: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">{life.label}</span>
                  <span className="text-[10px] font-bold text-primary-gold">{life.score}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--pill-bg)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${life.score}%` }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.15 }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, var(--color-primary-gold), var(--color-accent-gold))' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Landlord / Lister Card ─── */}
        <div className="px-4 mb-6">
          <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">Listed By</h2>
          <div className="card-surface rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded bg-primary-gold/10 flex items-center justify-center text-primary-gold border border-primary-gold/20">
                <User size={18} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest">{property.landlord.name}</h4>
                  {property.landlord.verified && <ShieldCheck size={12} className="text-primary-gold" />}
                </div>
                <p className="text-[9px] text-muted-custom">Joined {property.landlord.joined} · Responds {property.landlord.responseTime}</p>
              </div>
            </div>

            {/* Trust Meter */}
            <div className="card-surface rounded p-3 mb-4">
              <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1">
                <span>Account Trust</span>
                <span className="text-primary-gold">{property.landlord.verified ? 'Verified' : 'New'}</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--pill-bg)' }}>
                <div className="h-full rounded-full bg-primary-gold" style={{ width: property.landlord.verified ? '80%' : '25%' }} />
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2.5 bg-primary-gold text-black rounded text-[9px] font-bold uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-1.5">
                <Phone size={12} /> View Number
              </button>
              <button className="flex-1 py-2.5 card-surface rounded text-[9px] font-bold uppercase tracking-widest text-primary-gold hover:border-primary-gold/30 transition-all active:scale-95 flex items-center justify-center gap-1.5">
                <MessageCircle size={12} /> Chat
              </button>
            </div>
          </div>
        </div>

        {/* ─── Safety Checklist ─── */}
        <div className="px-4 mb-6">
          <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">Safety Checklist</h2>
          <div className="card-surface rounded-lg p-4">
            <ul className="space-y-2.5">
              {[
                'Meet in a public, well-lit area',
                'Always bring a friend along',
                'Verify the lister has keys and access',
                'Trust your gut instinct',
                'Never pay before viewing the actual unit',
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 text-[10px] font-bold text-muted-custom">
                  <div className="size-4 rounded bg-primary-gold/10 flex items-center justify-center text-primary-gold border border-primary-gold/20 shrink-0">
                    <Check size={10} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ─── Bottom CTA Bar ─── */}
        <div className="px-4">
          <div className="card-surface rounded-lg p-3 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom block">Status</span>
              <div className="flex items-center gap-1.5">
                <span className="size-1.5 bg-primary-gold rounded-full animate-pulse" />
                <span className="text-[11px] font-bold">Available Now</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="h-8 px-4 bg-primary-gold text-black rounded text-[9px] font-bold uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 flex items-center gap-1.5 shadow-lg shadow-primary-gold/10">
                <Calendar size={12} /> Book Viewing
              </button>
              <button className="h-8 px-3 card-surface rounded text-[9px] font-bold text-muted-custom hover:border-primary-gold/30 transition-all active:scale-95">
                <Share2 size={12} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
