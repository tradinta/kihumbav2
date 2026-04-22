'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  X, Camera, ChevronRight, ChevronLeft, MapPin, 
  Info,  ArrowLeft, Wifi, Zap, Droplets, Lock, ShieldCheck,
  Star, Clock, Calendar, MessageCircle, Phone, Heart,
  Share2, CheckCircle2, User, AlertTriangle, Check, Flame, Building2,
  Crosshair, ShieldAlert, BadgeInfo, Loader2, AlertCircle
} from 'lucide-react';

import { api } from '@/lib/api';
import Map, { Marker, MapRef } from 'react-map-gl';
import { useAuth } from '@/context/AuthContext';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 'details' | 'financials' | 'experience' | 'location' | 'media' | 'success';

const PROPERTY_TYPES = [
  { label: "Single Room", value: "SINGLE_ROOM" },
  { label: "Bedsitter", value: "BEDSITTER" },
  { label: "Studio", value: "STUDIO" },
  { label: "1 Bedroom", value: "ONE_BEDROOM" },
  { label: "2 Bedroom", value: "TWO_BEDROOM" },
  { label: "3 Bedroom", value: "THREE_BEDROOM" },
  { label: "Double Room", value: "DOUBLE_ROOM" }
];

const AMENITIES = [
  "Wifi", "24/7 Water", "Prepaid Electricity", "Security", "Parking", "Furnished", "Gym", "Borehole", "Waste Collection"
];

export default function KaoUploadModal({ isOpen, onClose, onSuccess, defaultType = 'RENTAL' }: { isOpen: boolean, onClose: () => void, onSuccess: () => void, defaultType?: 'RENTAL' | 'ROOMMATE' }) {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    description: '',
    seekerBio: '', // New field for Roommate bio
    type: 'BEDSITTER',
    price: '',
    hasDeposit: false,
    depositAmount: '',
    serviceCharge: '',
    electricityType: 'TOKEN',
    waterType: 'INCLUDED',
    rentDeadline: '',
    county: '',
    area: '',
    lat: -1.286389,
    lng: 36.817223,
    amenities: [] as string[],
    safetyScore: 5,
    friendlinessScore: 5,
    proximityScore: 5,
    proximityDetails: '',
    isIndividual: true,
    listingType: defaultType,
    preferredGender: 'ANY',
    maxRoommates: 1,
    lifestyle: [] as string[],
  });

  const [tagInput, setTagInput] = useState('');

  // Sync defaultType when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm(prev => ({ ...prev, listingType: defaultType }));
    }
  }, [isOpen, defaultType]);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const uploadMapRef = useRef<MapRef>(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5 - selectedFiles.length);
      setSelectedFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleLocationSearch = async (query: string) => {
    setLocationSearch(query);
    if (query.length < 3) { setSearchResults([]); return; }
    try {
      const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=ke&limit=5`);
      const data = await res.json();
      setSearchResults(data.features || []);
    } catch { setSearchResults([]); }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      let imageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        const uploadSlots = await api.post('/marketplace/upload-urls', {
          count: selectedFiles.length,
          contentType: 'image/jpeg'
        });

        const uploads = await Promise.all(uploadSlots.map((slot: any, i: number) =>
          fetch(slot.url, { method: 'PUT', body: selectedFiles[i], headers: { 'Content-Type': selectedFiles[i].type } })
        ));

        const failed = uploads.filter(r => !r.ok);
        if (failed.length > 0) {
          throw new Error(`${failed.length} image(s) failed to upload. Please try again.`);
        }

        imageUrls = uploadSlots.map((slot: any) => slot.publicUrl);
      }

      const payload: any = {
        title: form.title,
        description: form.listingType === 'ROOMMATE' ? form.seekerBio : form.description,
        type: form.type,
        county: form.county,
        area: form.area,
        lat: form.lat,
        lng: form.lng,
        electricityType: form.electricityType,
        waterType: form.waterType,
        amenities: form.amenities,
        safetyScore: form.safetyScore,
        friendlinessScore: form.friendlinessScore,
        proximityScore: form.proximityScore,
        isIndividual: form.isIndividual,
        hasDeposit: form.hasDeposit,
        images: imageUrls,
        listingType: form.listingType,
        preferredGender: form.preferredGender,
        maxRoommates: form.maxRoommates,
        lifestyle: form.lifestyle,
      };
      if (form.price) payload.price = parseFloat(form.price);
      if (form.depositAmount) payload.depositAmount = parseFloat(form.depositAmount);
      if (form.serviceCharge) payload.serviceCharge = parseFloat(form.serviceCharge);
      if (form.rentDeadline) payload.rentDeadline = form.rentDeadline;
      if (form.proximityDetails) payload.proximityDetails = form.proximityDetails;

      await api.post('/kao/listings', payload);
      setStep('success');
    } catch (err: any) {
      console.error('Publish error:', err);
      setError(err.message || 'Something went wrong. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} 
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-[var(--bg-color)] border border-primary-gold/20 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-custom flex items-center justify-between bg-custom/10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary-gold/10 flex items-center justify-center border border-primary-gold/20">
              <Building2 size={20} className="text-primary-gold" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest gold-glow">List Your Property</h2>
              <p className="text-[10px] text-muted-custom font-bold">Step {
                step === 'details' ? '1' : 
                step === 'financials' ? '2' :
                step === 'experience' ? '3' :
                step === 'location' ? '4' : '5'
              } of 5</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-custom hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6">
          <AnimatePresence mode="wait">
            {step === 'details' && (
              <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="p-4 rounded-xl bg-primary-gold/5 border border-primary-gold/10 flex gap-4">
                  <Info size={20} className="text-primary-gold shrink-0" />
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-primary-gold mb-1">Individual Listing</h4>
                    <p className="text-[10px] text-muted-custom/80 leading-relaxed font-medium">To protect your privacy, <span className="text-white">individual contact details are hidden.</span> Interested parties will discover your property through the platform discovery engine.</p>
                  </div>
                </div>

                <div className="flex gap-2 mb-6">
                  {['RENTAL', 'ROOMMATE'].map(type => (
                    <button 
                      key={type}
                      onClick={() => setForm({...form, listingType: type as any})}
                      className={`flex-1 h-10 rounded-lg border text-[9px] font-bold uppercase tracking-widest transition-all ${
                        form.listingType === type 
                          ? 'bg-primary-gold/15 text-primary-gold border-primary-gold/30' 
                          : 'bg-white/5 border-white/5 text-muted-custom'
                      }`}
                    >
                      {type === 'RENTAL' ? 'Find Rental' : 'Find Roommate'}
                    </button>
                  ))}
                </div>

                {form.listingType === 'ROOMMATE' && (
                  <div className="p-4 rounded-xl bg-primary-gold/5 border border-primary-gold/20 mb-6 flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primary-gold/20 flex items-center justify-center text-primary-gold">
                       <User size={16} />
                    </div>
                    <p className="text-[9px] font-bold text-primary-gold uppercase tracking-widest leading-relaxed">Roommate seeking posts are <span className="text-white">socially visible</span>. People will submit requests to live with you.</p>
                  </div>
                )}

                <div className="space-y-4">
                  {form.listingType === 'ROOMMATE' && (
                    <div className="p-4 rounded-xl bg-primary-gold/5 border border-primary-gold/20 mb-6">
                       <div className="flex items-center gap-3 mb-4">
                          <div className="size-12 rounded-full border-2 border-primary-gold overflow-hidden bg-black/40">
                             {user?.avatar ? <Image src={user.avatar} alt="" width={48} height={48} className="object-cover" /> : <div className="size-full flex items-center justify-center bg-primary-gold/10 text-primary-gold"><User size={24} /></div>}
                          </div>
                          <div>
                             <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary-gold">Privacy-First Identity</h4>
                             <p className="text-[8px] font-bold text-muted-custom uppercase mt-1">Shared with seekers: <span className="text-main">{user?.gender || 'N/A'} • {user?.dateOfBirth ? (new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear()) : 'N/A'} YRS</span></p>
                          </div>
                       </div>
                       <p className="text-[8px] font-bold text-muted-custom/60 uppercase italic leading-relaxed">Your full name and contact details remain hidden until you accept a request.</p>
                    </div>
                  )}

                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">{form.listingType === 'ROOMMATE' ? 'Headline (e.g. Seeking Girl Roommate at Moi Uni)' : 'Property Title'}</label>
                    <input type="text" placeholder={form.listingType === 'ROOMMATE' ? "e.g. Female Roommate wanted in Ruiru" : "e.g. Spacious Studio near Juja City Mall"} className="w-full bg-custom rounded-lg border border-custom px-4 py-3 text-xs font-bold outline-none focus:border-primary-gold/50 transition-all "
                      value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                  </div>
                  
                  {form.listingType === 'ROOMMATE' ? (
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">About the Seeker (Your Bio)</label>
                      <textarea placeholder="e.g. I am a 2nd year student at Moi University, I love quiet spaces and I'm very tidy..." className="w-full bg-custom rounded-lg border border-custom px-4 py-3 text-xs font-bold outline-none h-32 resize-none "
                        value={form.seekerBio} onChange={e => setForm({...form, seekerBio: e.target.value})} />
                    </div>
                  ) : (
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">Property Description</label>
                      <textarea placeholder="Tell us more about the property, security, rules, or anything unique..." className="w-full bg-custom rounded-lg border border-custom px-4 py-3 text-xs font-bold outline-none h-32 resize-none "
                        value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                    </div>
                  )}

                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">Property Type</label>
                    <select className="w-full bg-custom rounded-lg border border-custom px-4 py-3 text-xs font-bold outline-none "
                      value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                      {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  
                  {form.listingType === 'ROOMMATE' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-2">
                       <div>
                          <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">Preferred Gender</label>
                          <div className="flex gap-2">
                            {['MALE', 'FEMALE', 'ANY'].map(g => (
                              <button key={g} onClick={() => setForm({...form, preferredGender: g})}
                                className={`flex-1 py-2.5 rounded-lg border text-[9px] font-bold uppercase tracking-widest transition-all ${
                                  form.preferredGender === g ? 'bg-primary-gold text-black border-primary-gold' : 'bg-custom/50 border-custom text-muted-custom'
                                }`}
                              >
                                {g}
                              </button>
                            ))}
                          </div>
                       </div>
                       <div>
                           <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">Lifestyle & Rules</label>
                           <div className="flex gap-2 mb-3">
                              <input 
                                type="text" 
                                placeholder="Add a rule or lifestyle tag (e.g. Non-smoker, Quiet)" 
                                className="flex-1 bg-custom rounded-lg border border-custom px-4 py-2.5 text-[10px] font-bold outline-none focus:border-primary-gold/50 transition-all"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (tagInput.trim()) {
                                      setForm({...form, lifestyle: [...form.lifestyle, tagInput.trim()]});
                                      setTagInput('');
                                    }
                                  }
                                }}
                              />
                              <button 
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (tagInput.trim()) {
                                    setForm({...form, lifestyle: [...form.lifestyle, tagInput.trim()]});
                                    setTagInput('');
                                  }
                                }}
                                className="px-4 rounded-lg bg-primary-gold text-black text-[9px] font-bold uppercase tracking-widest hover:brightness-110 transition-all"
                              >
                                Add
                              </button>
                           </div>
                           <div className="flex flex-wrap gap-2">
                             {form.lifestyle.map((tag, idx) => (
                               <div key={idx} className="pl-3 pr-2 py-1.5 rounded-lg border border-primary-gold/30 bg-primary-gold/10 text-primary-gold text-[8px] font-bold uppercase tracking-widest flex items-center gap-2">
                                 {tag}
                                 <button 
                                   onClick={() => setForm({...form, lifestyle: form.lifestyle.filter((_, i) => i !== idx)})}
                                   className="size-4 rounded-full hover:bg-primary-gold/20 flex items-center justify-center transition-all"
                                 >
                                   <X size={10} />
                                 </button>
                               </div>
                             ))}
                             {form.lifestyle.length === 0 && (
                               <p className="text-[9px] text-muted-custom italic lowercase">No tags added yet. Type above and click add.</p>
                             )}
                           </div>
                        </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {step === 'financials' && (
              <motion.div key="financials" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">Monthly Rent</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-custom">KES</span>
                      <input type="number" placeholder="0.00" className="w-full bg-custom rounded-lg border border-custom pl-12 pr-4 py-3 text-xs font-bold outline-none "
                        value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">Rent Deadline / Cycle</label>
                    <input type="text" placeholder="e.g. 5th of every month" className="w-full bg-custom rounded-lg border border-custom px-4 py-3 text-xs font-bold outline-none "
                      value={form.rentDeadline} onChange={e => setForm({...form, rentDeadline: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-6">
                  {form.listingType === 'RENTAL' && (
                    <>
                    <div className={`flex items-center justify-between p-5 rounded-xl border transition-all duration-300 ${
                      form.hasDeposit ? 'bg-primary-gold/10 border-primary-gold shadow-[0_0_20px_rgba(255,184,0,0.1)]' : 'bg-custom/40 border-custom'
                    }`}>
                      <div className="flex items-center gap-4">
                        <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${
                          form.hasDeposit ? 'bg-primary-gold text-black' : 'bg-orange-500/10 text-orange-500'
                        }`}>
                          <ShieldAlert size={20} />
                        </div>
                        <div>
                          <span className={`text-[11px] font-bold uppercase tracking-[0.2em] block ${form.hasDeposit ? 'text-primary-gold' : 'text-main'}`}>Deposit Required</span>
                          <span className="text-[9px] text-muted-custom font-bold uppercase mt-0.5">Is a security deposit needed?</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setForm({...form, hasDeposit: !form.hasDeposit})}
                        className={`w-14 h-7 rounded-full p-1 transition-all relative ${form.hasDeposit ? 'bg-primary-gold' : 'bg-white/10'}`}
                      >
                        <div className={`size-5 rounded-full bg-white shadow-lg transition-all transform ${form.hasDeposit ? 'translate-x-7' : 'translate-x-0'}`} />
                      </button>
                    </div>

                  {form.hasDeposit && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">Deposit Amount</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-custom">KES</span>
                        <input type="number" placeholder="0.00" className="w-full bg-custom rounded-lg border border-custom pl-12 pr-4 py-3 text-xs font-bold outline-none "
                          value={form.depositAmount} onChange={e => setForm({...form, depositAmount: e.target.value})} />
                      </div>
                    </motion.div>
                  )}
                  </>
                )}

                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">Other Charges (Service Charge, etc.)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-custom">KES</span>
                      <input type="number" placeholder="Optional" className="w-full bg-custom rounded-lg border border-custom pl-12 pr-4 py-3 text-xs font-bold outline-none "
                        value={form.serviceCharge} onChange={e => setForm({...form, serviceCharge: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-2 block">Electricity</label>
                      <div className="flex gap-2">
                        {['TOKEN', 'INCLUDED'].map(type => (
                          <button key={type} onClick={() => setForm({...form, electricityType: type})}
                            className={`flex-1 py-2 rounded-lg border text-[9px] font-bold uppercase tracking-widest transition-all ${
                              form.electricityType === type ? 'bg-primary-gold text-black border-primary-gold' : 'bg-custom/50 border-custom text-muted-custom'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-2 block">Water</label>
                      <div className="flex gap-2">
                        {['INCLUDED', 'PAID_EXTRA'].map(type => (
                          <button key={type} onClick={() => setForm({...form, waterType: type})}
                            className={`flex-1 py-2 rounded-lg border text-[9px] font-bold uppercase tracking-widest transition-all ${
                              form.waterType === type ? 'bg-primary-gold text-black border-primary-gold' : 'bg-custom/50 border-custom text-muted-custom'
                            }`}
                          >
                            {type.replace('_', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'experience' && (
              <motion.div key="experience" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-4 block">Select Amenities</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {AMENITIES.map(amenity => (
                      <button 
                        key={amenity}
                        onClick={() => {
                          const current = form.amenities;
                          setForm({...form, amenities: current.includes(amenity) ? current.filter(a => a !== amenity) : [...current, amenity]});
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[10px] font-bold transition-all ${
                          form.amenities.includes(amenity) ? 'bg-primary-gold/10 border-primary-gold text-primary-gold' : 'bg-custom border-custom text-muted-custom'
                        }`}
                      >
                        {form.amenities.includes(amenity) ? <Check size={12} /> : <div className="size-3" />}
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    { key: 'safetyScore', label: 'Safety Score', desc: 'Gated, guards, lighting' },
                    { key: 'friendlinessScore', label: 'Social Score', desc: 'Environment friendliness' },
                    { key: 'proximityScore', label: 'Access Score', desc: 'Proximity to road/shops' }
                  ].map(({ key, label, desc }) => (
                    <div key={key}>
                      <div className="flex justify-between items-end mb-3">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-widest text-main block">{label}</label>
                          <span className="text-[8px] font-bold text-muted-custom uppercase mt-1 block">{desc}</span>
                        </div>
                        <span className="text-[11px] font-bold text-primary-gold tracking-widest bg-primary-gold/10 px-2 py-0.5 rounded border border-primary-gold/20">{(form as any)[key]}/5</span>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {[1, 2, 3, 4, 5].map(val => (
                          <button
                            key={val}
                            onClick={() => setForm({...form, [key]: val})}
                            className={`h-10 rounded-lg border text-xs font-bold transition-all ${
                              (form as any)[key] === val
                                ? 'bg-primary-gold text-black border-primary-gold shadow-[0_0_15px_rgba(255,184,0,0.2)]'
                                : (form as any)[key] > val 
                                  ? 'bg-primary-gold/20 border-primary-gold/30 text-primary-gold'
                                  : 'bg-custom border-custom text-muted-custom hover:border-white/20'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-3 block">Proximity Details</label>
                    <input type="text" placeholder="e.g. 2 mins walk to Stage, opposite Quickmart" className="w-full bg-custom rounded-lg border border-custom px-4 py-3 text-xs font-bold outline-none "
                      value={form.proximityDetails} onChange={e => setForm({...form, proximityDetails: e.target.value})} />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'location' && (
              <motion.div key="location" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="relative">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">Search Location</label>
                  <input
                    type="text"
                    placeholder="Search e.g. Juja, Kilimani, Ruaka..."
                    className="w-full bg-custom rounded-lg border border-custom px-4 py-3 text-xs font-bold outline-none  focus:border-primary-gold/50"
                    value={locationSearch}
                    onChange={e => handleLocationSearch(e.target.value)}
                  />
                  {searchResults.length > 0 && (
                    <div className="absolute z-50 mt-1 w-full bg-[var(--bg-color)] border border-custom rounded-lg shadow-2xl max-h-48 overflow-y-auto">
                      {searchResults.map((r: any) => (
                        <button
                          key={r.id}
                          onClick={() => {
                            const [lng, lat] = r.center;
                            setForm({...form, lat, lng, area: r.text || ''});
                            uploadMapRef.current?.flyTo({ center: [lng, lat], zoom: 15, duration: 1500 });
                            setSearchResults([]);
                            setLocationSearch(r.place_name);
                          }}
                          className="w-full text-left px-4 py-2.5 text-[10px] font-bold hover:bg-primary-gold/10 flex items-center gap-2 border-b border-custom last:border-0 transition-colors"
                        >
                          <MapPin size={12} className="text-primary-gold shrink-0" />
                          <span className="truncate">{r.place_name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="h-64 w-full rounded-xl overflow-hidden border border-custom relative">
                  {MAPBOX_TOKEN ? (
                    <Map
                      ref={uploadMapRef}
                      initialViewState={{ latitude: form.lat, longitude: form.lng, zoom: 12 }}
                      mapStyle="mapbox://styles/mapbox/dark-v11"
                      mapboxAccessToken={MAPBOX_TOKEN}
                      onClick={(e) => setForm({...form, lat: e.lngLat.lat, lng: e.lngLat.lng})}
                    >
                      <Marker latitude={form.lat} longitude={form.lng} anchor="bottom">
                        <MapPin size={24} className="text-primary-gold" />
                      </Marker>
                    </Map>
                  ) : (
                    <div className="w-full h-full bg-custom flex items-center justify-center text-muted-custom text-[10px] font-bold uppercase">Mapbox Token Missing</div>
                  )}
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10 text-[8px] font-bold uppercase tracking-widest text-white">Tap Map to Move Pin</div>
                  
                  <button 
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(pos => {
                          const lat = pos.coords.latitude;
                          const lng = pos.coords.longitude;
                          setForm({...form, lat, lng});
                          uploadMapRef.current?.flyTo({ center: [lng, lat], zoom: 15, duration: 1500 });
                        });
                      }
                    }}
                    className="absolute bottom-4 right-4 bg-primary-gold text-black px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 transition-all"
                  >
                    <Crosshair size={14} /> My Location
                  </button>
                </div>

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-medium text-blue-500 flex items-center gap-3">
                  <AlertCircle size={18} />
                  <span>Please verify the exact location of the property on the map above.</span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">County</label>
                    <select className="w-full bg-custom rounded-lg border border-custom px-4 py-3 text-xs font-bold outline-none focus:border-primary-gold/50"
                      value={form.county} onChange={e => setForm({...form, county: e.target.value})}>
                      <option value="" disabled className="text-muted-custom">Select County (Required)</option>
                      {['Nairobi', 'Kiambu', 'Mombasa', 'Nakuru', 'Uasin Gishu', 'Machakos', 'Kajiado'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">Area / Estate</label>
                    <input type="text" placeholder="e.g. Ruiru, Juja, Westlands" className="w-full bg-custom rounded-lg border border-custom px-4 py-3 text-xs font-bold outline-none "
                      value={form.area} onChange={e => setForm({...form, area: e.target.value})} />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'media' && (
              <motion.div key="media" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="border-2 border-dashed border-custom rounded-xl p-12 text-center bg-custom/20 hover:bg-custom/40 hover:border-primary-gold/30 transition-all relative group">
                  <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} disabled={selectedFiles.length >= 5} />
                  <Camera size={40} className="text-primary-gold/40 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-custom">Add Property Photos (Max 5)</p>
                  <p className="text-[9px] text-muted-custom/60 mt-2 uppercase tracking-widest">Industry standard quality · 1:1 or 4:3 works best</p>
                </div>

                {previews.length > 0 && (
                  <div className="grid grid-cols-5 gap-3">
                    {previews.map((src, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-custom group">
                        <img src={src} className="w-full h-full object-cover" />
                        <button onClick={() => { setSelectedFiles(prev => prev.filter((_, idx) => idx !== i)); setPreviews(prev => prev.filter((_, idx) => idx !== i)); }} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={16} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-12 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} className="text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-widest mb-2">Listing Published</h3>
                <p className="text-[11px] text-muted-custom max-w-xs font-medium">
                  Your property <span className="text-primary-gold font-bold">{form.title}</span> is now live. 
                  It will appear on the map and in search results.
                </p>
                {selectedFiles.length > 0 && (
                  <p className="text-[10px] text-emerald-500 font-bold mt-3">
                    ✓ {selectedFiles.length} photo{selectedFiles.length > 1 ? 's' : ''} uploaded
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {error && (
          <div className="mx-6 mb-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-400 flex items-center gap-2">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {step === 'success' ? (
          <div className="px-6 py-4 border-t border-custom bg-custom/30">
            <button 
              onClick={() => { onSuccess(); onClose(); }}
              className="w-full py-3 rounded-lg bg-primary-gold text-black text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Check size={16} /> Done
            </button>
          </div>
        ) : (
        <div className="px-6 py-4 border-t border-custom bg-custom/30 flex gap-4">
          {step !== 'details' && (
            <button onClick={() => {
              const stages: Step[] = ['details', 'financials', 'experience', 'location', 'media'];
              setStep(stages[stages.indexOf(step) - 1]);
            }} disabled={loading}
              className="px-6 py-3 rounded-xl border border-custom text-[10px] font-bold uppercase tracking-widest text-muted-custom hover:text-white transition-all flex items-center gap-2">
              <ChevronLeft size={16} /> Back
            </button>
          )}
          
          <button 
            onClick={() => {
              if (step === 'media') handleSubmit();
              else {
                const stages: Step[] = ['details', 'financials', 'experience', 'location', 'media'];
                setStep(stages[stages.indexOf(step) + 1]);
              }
            }}
            disabled={loading || 
              (step === 'details' && !form.title.trim()) ||
              (step === 'location' && !form.county)}
            className="flex-1 py-3 rounded-xl bg-primary-gold text-black text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Publishing...</> : 
             step === 'media' ? <><Check size={16} /> Publish Listing</> : 
             <><ChevronRight size={16} /> Continue</>}
          </button>
        </div>
        )}
      </motion.div>
    </div>
  );
}
