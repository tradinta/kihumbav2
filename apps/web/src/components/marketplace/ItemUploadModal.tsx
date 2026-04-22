"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Camera, ChevronRight, ChevronLeft, Tag as TagIcon, 
  MapPin, Phone, Package, Info, Loader2, Check, AlertCircle 
} from 'lucide-react';
import { api } from '@/lib/api';
import Image from 'next/image';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 'details' | 'trade' | 'media';

const CATEGORIES = [
  "ELECTRONICS", "FASHION", "VEHICLES", "FURNITURE", 
  "SERVICES", "BEAUTY", "BOOKS", "SPORTS", "HOME_GARDEN", "OTHER"
];

const CONDITIONS = [
  { id: 'NEW', label: 'New / Sealed' },
  { id: 'LIKE_NEW', label: 'Like New / Mint' },
  { id: 'GOOD', label: 'Good / Used' },
  { id: 'FAIR', label: 'Fair / Heavily Used' },
  { id: 'FOR_PARTS', label: 'For Parts / Not Working' },
];

export default function ItemUploadModal({ isOpen, onClose, onSuccess }: Props) {
  const [step, setStep] = useState<Step>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'ELECTRONICS',
    condition: 'GOOD',
    county: 'Nairobi',
    area: '',
    tradeType: 'BUY', // BUY, BARTER, TRADE_CASH
    barterFor: '',
    whatsIncluded: [] as string[],
    tags: [] as string[],
    sellerPhone: '',
  });

  const [tempIncluded, setTempIncluded] = useState('');
  const [tempTag, setTempTag] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5 - selectedFiles.length);
      setSelectedFiles(prev => [...prev, ...files]);
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (step === 'details') setStep('trade');
    else if (step === 'trade') setStep('media');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Get upload URLs if we have images
      let imageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        const uploadSlots = await api.post('/marketplace/upload-urls', {
          count: selectedFiles.length,
          contentType: selectedFiles[0].type
        });

        // 2. Upload files in parallel
        await Promise.all(uploadSlots.map((slot: any, i: number) => {
          return fetch(slot.url, {
            method: 'PUT',
            body: selectedFiles[i],
            headers: { 'Content-Type': selectedFiles[i].type }
          });
        }));

        imageUrls = uploadSlots.map((slot: any) => slot.publicUrl);
      }

      // 3. Create Listing
      await api.post('/marketplace/listings', {
        ...form,
        price: parseFloat(form.price),
        images: imageUrls,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} 
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-lg bg-[var(--bg-color)] border border-primary-gold/20 rounded-xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-custom flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded bg-primary-gold/10 flex items-center justify-center border border-primary-gold/20">
              <Package size={16} className="text-primary-gold" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest gold-glow">New Marketplace Listing</h2>
              <p className="text-[9px] text-muted-custom font-bold">Step {step === 'details' ? '1' : step === 'trade' ? '2' : '3'} of 3</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-custom hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto no-scrollbar">
          {error && (
            <div className="mb-4 p-3 rounded bg-accent-gold/10 border border-accent-gold/20 flex items-center gap-2 text-accent-gold text-[10px] font-bold">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 'details' && (
              <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">Item Title</label>
                  <input type="text" placeholder="e.g. MacBook Pro M1 2021" className="w-full bg-custom rounded-lg border border-custom px-4 py-2.5 text-xs font-bold outline-none focus:border-primary-gold/50 transition-all"
                    value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">Description</label>
                  <textarea 
                    placeholder="Describe your item in detail (min 10 characters)..." 
                    rows={3}
                    className="w-full bg-custom rounded-lg border border-custom px-4 py-2.5 text-xs font-medium outline-none focus:border-primary-gold/50 transition-all resize-none"
                    value={form.description} 
                    onChange={e => setForm({...form, description: e.target.value})} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">Category</label>
                    <select className="w-full bg-custom rounded-lg border border-custom px-4 py-2.5 text-xs font-bold outline-none capitalize"
                      value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">Condition</label>
                    <select className="w-full bg-custom rounded-lg border border-custom px-4 py-2.5 text-xs font-bold outline-none"
                      value={form.condition} onChange={e => setForm({...form, condition: e.target.value})}>
                      {CONDITIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">What's Included</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" placeholder="e.g. Charger, Original Box" className="flex-1 bg-custom rounded-lg border border-custom px-4 py-2 text-xs font-bold outline-none"
                      value={tempIncluded} onChange={e => setTempIncluded(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), form.whatsIncluded.length < 5 && tempIncluded.trim() && (setForm({...form, whatsIncluded: [...form.whatsIncluded, tempIncluded.trim()]}), setTempIncluded('')))} />
                    <button onClick={() => form.whatsIncluded.length < 5 && tempIncluded.trim() && (setForm({...form, whatsIncluded: [...form.whatsIncluded, tempIncluded.trim()]}), setTempIncluded(''))} 
                      className="px-3 rounded bg-primary-gold/10 text-primary-gold border border-primary-gold/20 text-[10px] font-bold">+</button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {form.whatsIncluded.map((item, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-custom border border-custom text-[9px] font-bold flex items-center gap-1">
                        {item} <X size={10} className="cursor-pointer" onClick={() => setForm({...form, whatsIncluded: form.whatsIncluded.filter((_, idx) => idx !== i)})} />
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'trade' && (
              <motion.div key="trade" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">Asking Price (KES)</label>
                    <input type="number" placeholder="0.00" className="w-full bg-custom rounded-lg border border-custom px-4 py-2.5 text-xs font-bold outline-none focus:border-primary-gold/50 transition-all"
                      value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">Trade Type</label>
                    <select className="w-full bg-custom rounded-lg border border-custom px-4 py-2.5 text-xs font-bold outline-none"
                      value={form.tradeType} onChange={e => setForm({...form, tradeType: e.target.value})}>
                      <option value="BUY">Selling Only</option>
                      <option value="BARTER">Barter / Swap Only</option>
                      <option value="TRADE_CASH">Trade + Cash</option>
                    </select>
                  </div>
                </div>

                {form.tradeType !== 'BUY' && (
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">What will you trade for?</label>
                    <input type="text" placeholder="e.g. Any decent Android phone" className="w-full bg-custom rounded-lg border border-custom px-4 py-2.5 text-xs font-bold outline-none focus:border-primary-gold/50 transition-all"
                      value={form.barterFor} onChange={e => setForm({...form, barterFor: e.target.value})} />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">County</label>
                    <input type="text" value={form.county} readOnly className="w-full bg-custom rounded-lg border border-custom px-4 py-2.5 text-xs font-bold opacity-50 outline-none" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">Area / Estate</label>
                    <input type="text" placeholder="e.g. Westlands" className="w-full bg-custom rounded-lg border border-custom px-4 py-2.5 text-xs font-bold outline-none focus:border-primary-gold/50 transition-all"
                      value={form.area} onChange={e => setForm({...form, area: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">Contact Phone (Optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 size-4 text-primary-gold/40" />
                    <input type="text" placeholder="254..." className="w-full bg-custom rounded-lg border border-custom pl-10 pr-4 py-2.5 text-xs font-bold outline-none"
                      value={form.sellerPhone} onChange={e => setForm({...form, sellerPhone: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-1.5 block">Tags (Search Keywords)</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" placeholder="e.g. apple, iphone, tech" className="flex-1 bg-custom rounded-lg border border-custom px-4 py-2 text-xs font-bold outline-none"
                      value={tempTag} onChange={e => setTempTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), form.tags.length < 5 && tempTag.trim() && (setForm({...form, tags: [...form.tags, tempTag.trim()]}), setTempTag('')))} />
                    <button onClick={() => form.tags.length < 5 && tempTag.trim() && (setForm({...form, tags: [...form.tags, tempTag.trim()]}), setTempTag(''))} 
                      className="px-3 rounded bg-primary-gold/10 text-primary-gold border border-primary-gold/20 text-[10px] font-bold">+</button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {form.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-primary-gold/5 border border-primary-gold/20 text-[9px] font-bold text-primary-gold flex items-center gap-1">
                        #{tag} <X size={10} className="cursor-pointer" onClick={() => setForm({...form, tags: form.tags.filter((_, idx) => idx !== i)})} />
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'media' && (
              <motion.div key="media" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div className="border-2 border-dashed border-custom rounded-xl p-8 text-center bg-custom/50 hover:bg-custom/80 hover:border-primary-gold/30 transition-all relative">
                  <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} disabled={selectedFiles.length >= 5} />
                  <Camera size={32} className="text-primary-gold/40 mx-auto mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-custom">Add Photos (Max 5)</p>
                  <p className="text-[8px] text-muted-custom/60 mt-1 uppercase tracking-widest">Industry standard quality · Up to 10MB each</p>
                </div>

                {previews.length > 0 && (
                  <div className="grid grid-cols-5 gap-2">
                    {previews.map((src, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-custom group">
                        <Image src={src} alt="" fill className="object-cover" />
                        <button onClick={() => removeFile(i)} className="absolute top-1 right-1 size-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-4 rounded-lg bg-primary-gold/5 border border-primary-gold/10 flex gap-3">
                  <Info size={16} className="text-primary-gold shrink-0" />
                  <p className="text-[9px] text-muted-custom font-bold leading-relaxed uppercase tracking-wider">
                    Photos help you sell faster! Professional sellers can manage high-volume uploads via <span className="text-primary-gold">sellers.kihumba.com</span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-custom bg-custom/20 flex gap-3">
          {step !== 'details' && (
            <button onClick={() => setStep(step === 'media' ? 'trade' : 'details')} disabled={loading}
              className="px-4 py-2.5 rounded-lg border border-custom text-[9px] font-bold uppercase tracking-widest text-muted-custom hover:text-white transition-all">
              <ChevronLeft size={16} className="mr-1 inline" /> Back
            </button>
          )}
          
          <button 
            onClick={step === 'media' ? handleSubmit : handleNext}
            disabled={loading || (step === 'details' && !form.title.trim())}
            className="flex-1 py-2.5 rounded-lg bg-primary-gold text-black text-[9px] font-bold uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Publishing...</> : 
             step === 'media' ? <><Check size={16} /> Publish Listing</> : 
             <><ChevronRight size={16} /> Continue</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
