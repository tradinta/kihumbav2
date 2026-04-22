'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LeftSidebar from '@/components/LeftSidebar';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import {
  ArrowLeft, MapPin, Droplets, Lock, ShieldCheck,
  Star, Camera, Calendar, MessageCircle, Phone, Heart,
  Share2, User, AlertTriangle, Check, Building2,
  ShieldAlert, Loader2, Zap, CheckCircle2, Repeat2
} from 'lucide-react';
import { api } from '@/lib/api';
import { usePostContext } from '@/context/PostContext';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const Badge = ({ children, gold, className }: { children: React.ReactNode; gold?: boolean; className?: string }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
    gold ? 'bg-primary-gold/10 text-primary-gold border-primary-gold/30' : 'bg-[var(--pill-bg)] text-muted-custom border-custom'
  } ${className ?? ''}`}>{children}</span>
);

export default function KaoDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { setCreatePostOpen, setKaoQuoteTarget } = usePostContext();
  
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleQuote = () => {
    setKaoQuoteTarget(property);
    setCreatePostOpen(true);
  };

  useEffect(() => {
    async function fetchProperty() {
      try {
        const data = await api.get(`/kao/listings/${id}`);
        setProperty(data);
      } catch (err) {
        console.error("Failed to fetch property", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <Loader2 size={40} className="animate-spin text-primary-gold" />
      </div>
    );
  }

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
                {(() => {
                  const images = property.images || [];
                  const imgSrc = images[activePhoto] || property.image;
                  if (imgSrc) {
                    return <Image src={imgSrc} alt="Property" fill className="object-cover" priority />;
                  }
                  return (
                    <div className="size-full bg-zinc-900 flex flex-col items-center justify-center text-zinc-700 gap-3">
                      <Camera size={64} strokeWidth={1} className="opacity-20" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Gallery Empty</span>
                    </div>
                  );
                })()}
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* Top actions */}
            <div className="absolute top-3 right-3 flex gap-2">
              <button onClick={() => setIsLiked(!isLiked)} className={`size-8 rounded-lg flex items-center justify-center backdrop-blur transition-all ${isLiked ? 'bg-primary-gold text-black' : 'bg-black/30 text-white/80 hover:bg-primary-gold hover:text-black'}`}>
                <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
              </button>
              <button 
                onClick={handleQuote}
                className="size-8 rounded-lg bg-black/30 backdrop-blur flex items-center justify-center text-white/80 hover:bg-primary-gold hover:text-black transition-all"
                title="Quote this property"
              >
                <Repeat2 size={14} />
              </button>
              <button className="size-8 rounded-lg bg-black/30 backdrop-blur flex items-center justify-center text-white/80 hover:bg-primary-gold hover:text-black transition-all">
                <Share2 size={14} />
              </button>
            </div>

            {/* Photo counter */}
            <div className="absolute top-3 left-3">
              <Badge gold>
                <Camera size={10} /> 
                {(property.images?.length || (property.image ? 1 : 0))} Photo{((property.images?.length || 0) === 1) ? '' : 's'}
              </Badge>
            </div>

            {/* Thumbnails bar */}
            <div className="absolute bottom-3 left-3 flex gap-2">
              {(property.images || (property.image ? [property.image] : [])).map((img: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setActivePhoto(i)} 
                  className={`size-10 rounded-lg border-2 overflow-hidden relative transition-all ${activePhoto === i ? 'border-primary-gold scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
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
              <Badge><ShieldAlert size={10} /> Unverified</Badge>
            )}
            <Badge gold>{property.listingType === 'ROOMMATE' ? 'ROOMMATE SEEKER' : property.type.replace('_', ' ')}</Badge>
            {property.isIndividual && <Badge><User size={10} /> Individual</Badge>}
          </div>
          <h1 className="text-xl font-bold tracking-[0.1em] uppercase leading-tight mb-1">{property.title}</h1>
          <div className="flex items-center gap-1.5">
            <MapPin size={12} className="text-primary-gold" />
            <span className="text-[11px] font-bold text-muted-custom">{property.area}, {property.county}</span>
          </div>
        </div>

        {/* ─── Price Card ─── */}
        <div className="px-4 mb-6">
          <div className="card-surface rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom block mb-0.5">Rent</span>
              <span className="text-lg font-bold text-primary-gold gold-glow">
                KES {property.price?.toLocaleString()}<span className="text-[9px] text-muted-custom ml-1 font-bold">/mo</span>
              </span>
            </div>
            {property.listingType === 'RENTAL' && (
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom block mb-0.5">Deposit</span>
                <span className="text-lg font-bold">
                  {property.hasDeposit ? `KES ${property.depositAmount?.toLocaleString()}` : 'None'}
                </span>
              </div>
            )}
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom block mb-0.5">Extra (Service)</span>
              <span className="text-[11px] font-bold">
                {property.serviceCharge ? `KES ${property.serviceCharge?.toLocaleString()}` : '0.00'}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom block mb-0.5">Due Date</span>
              <span className="text-[11px] font-bold">{property.rentDeadline || 'N/A'}</span>
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

        {/* ─── Amenities & Utilities ─── */}
        <div className="px-4 mb-6">
          <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">Essentials</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="card-surface rounded-lg p-3 flex flex-col items-center text-center gap-1.5">
              <div className="size-8 rounded bg-primary-gold/10 flex items-center justify-center text-primary-gold border border-primary-gold/20">
                <Zap size={18} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Electricity</span>
              <span className="text-[9px] text-muted-custom">{property.electricityType === 'TOKEN' ? 'Prepaid/Token' : 'Included in Rent'}</span>
            </div>
            <div className="card-surface rounded-lg p-3 flex flex-col items-center text-center gap-1.5">
              <div className="size-8 rounded bg-primary-gold/10 flex items-center justify-center text-primary-gold border border-primary-gold/20">
                <Droplets size={18} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Water Plan</span>
              <span className="text-[9px] text-muted-custom">{property.waterType === 'INCLUDED' ? 'Included in Rent' : 'Paid Extra'}</span>
            </div>
            {property.amenities?.map((amenity: any, i: number) => (
              <div key={i} className="card-surface rounded-lg p-3 flex flex-col items-center text-center gap-1.5">
                <div className="size-8 rounded bg-primary-gold/10 flex items-center justify-center text-primary-gold border border-primary-gold/20">
                  <CheckCircle2 size={16} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">{amenity}</span>
                <span className="text-[9px] text-muted-custom">Available</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Description ─── */}
        <div className="px-4 mb-6">
          <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-2">Description</h2>
          <p className="text-[11px] text-muted-custom font-bold leading-relaxed">{property.description}</p>
        </div>

        {/* ─── Community Vibe & Proximity ─── */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
             <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60">Experience Score</h2>
             <div className="flex items-center gap-1 text-[10px] font-bold text-muted-custom">
               <MapPin size={10} className="text-primary-gold" /> {property.proximityDetails || 'No details added'}
             </div>
          </div>
          <div className="card-surface rounded-lg p-4 space-y-4">
            {[
              { label: "Safety (Security, Gate, Guards)", score: property.safetyScore * 20 },
              { label: "Friendliness & Environment", score: property.friendlinessScore * 20 },
              { label: "Proximity (Access to Roads/Socials)", score: property.proximityScore * 20 },
            ].map((life: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">{life.label}</span>
                  <span className="text-[10px] font-bold text-primary-gold">{life.score}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--pill-bg)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${life.score}%` }}
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, var(--color-primary-gold), var(--color-accent-gold))' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Landlord / Seeker Card ─── */}
        <div className="px-4 mb-6">
          <h2 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">{property.listingType === 'ROOMMATE' ? 'About the Seeker' : 'Listed By'}</h2>
          <div className="card-surface rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-lg overflow-hidden border-2 border-primary-gold">
                {property.author?.avatar ? <Image src={property.author.avatar} alt="" width={40} height={40} className="object-cover" /> : <div className="size-full flex items-center justify-center bg-primary-gold/10 text-primary-gold"><User size={20} /></div>}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest">{property.author?.username || 'Seeker'}</h4>
                  {property.author?.isVerified && <ShieldCheck size={12} className="text-primary-gold" />}
                </div>
                {property.listingType === 'ROOMMATE' ? (
                  <p className="text-[9px] text-muted-custom font-bold uppercase tracking-widest">{property.author?.gender || 'N/A'} · {property.author?.dateOfBirth ? (new Date().getFullYear() - new Date(property.author.dateOfBirth).getFullYear()) : 'N/A'} YRS</p>
                ) : (
                  <p className="text-[9px] text-muted-custom">Joined {new Date(property.author?.createdAt).toLocaleDateString()} · Responds Quickly</p>
                )}
              </div>
            </div>

            {property.listingType === 'ROOMMATE' && (
               <div className="p-3 rounded-lg bg-primary-gold/5 border border-primary-gold/10 mb-4">
                  <p className="text-[10px] text-muted-custom font-bold italic leading-relaxed">"Interested in living together? Send a request to connect and view contact details."</p>
               </div>
            )}

            <div className="flex gap-2">
              <button 
                disabled={property.listingType === 'ROOMMATE' || property.isIndividual}
                className={`flex-1 py-2.5 rounded text-[9px] font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
                  (property.listingType === 'ROOMMATE' || property.isIndividual) ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-dashed border-zinc-700' : 'bg-primary-gold text-black hover:brightness-110'
                }`}
              >
                {property.listingType === 'ROOMMATE' ? 'Contact Details Hidden' : property.isIndividual ? 'Unavailable For Contact' : <><Phone size={12} /> View Number</>}
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
                <span className={`size-1.5 rounded-full animate-pulse ${property.vacantCount > 0 || property.listingType === 'ROOMMATE' ? 'bg-primary-gold' : 'bg-red-500'}`} />
                <span className="text-[11px] font-bold">{property.listingType === 'ROOMMATE' ? 'Seeking Match' : property.vacantCount > 0 ? `${property.vacantCount} Units Available` : 'Fully Occupied'}</span>
              </div>
            </div>
            <div className="flex gap-2">
              {property.listingType === 'ROOMMATE' ? (
                <button 
                  onClick={() => router.push(`/kao?id=${property.id}&request=true`)}
                  className="h-10 px-6 rounded-lg bg-primary-gold text-black text-[10px] font-bold uppercase tracking-widest hover:brightness-110 shadow-lg shadow-primary-gold/20 flex items-center gap-2"
                >
                  <MessageCircle size={14} /> Send Request
                </button>
              ) : (
                <button 
                  disabled={property.isIndividual}
                  className={`h-8 px-4 rounded text-[9px] font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1.5 shadow-lg ${
                    property.isIndividual ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-primary-gold text-black hover:brightness-110 shadow-primary-gold/10'
                  }`}
                >
                  {property.isIndividual ? 'Individual Discovery Only' : <><Calendar size={12} /> Book Viewing</>}
                </button>
              )}
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
