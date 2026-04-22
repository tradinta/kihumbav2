'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Loader2, Check, AlertCircle, Quote } from 'lucide-react';
import { api } from '@/lib/api';

interface Props {
  isOpen: boolean;
  listingId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const RATING_CATEGORIES = [
  { id: 'safety', label: 'Safety & Security', description: 'Gating, lighting, and general safety' },
  { id: 'proximity', label: 'Proximity', description: 'Convenience to main roads & transport' },
  { id: 'water', label: 'Water Reliability', description: 'Consistency and quality of water supply' },
  { id: 'electricity', label: 'Power consistency', description: 'Tokens/Postpaid stability & brownouts' },
  { id: 'environmentFriendliness', label: 'Environment Friendliness', description: 'Landlord, Caretaker & Tenant dynamics' },
];

export default function KaoReviewModal({ isOpen, listingId, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [ratings, setRatings] = useState<Record<string, number>>({
    safety: 5,
    proximity: 5,
    water: 5,
    electricity: 5,
    environmentFriendliness: 5,
  });
  
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post(`/kao/listings/${listingId}/reviews`, {
        ...ratings,
        comment: comment.trim() || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
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
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-lg bg-[var(--bg-color)] border border-primary-gold/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-custom flex items-center justify-between bg-custom/10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary-gold/10 flex items-center justify-center border border-primary-gold/20">
              <Star size={20} className="text-primary-gold" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest gold-glow">Rate This House</h2>
              <p className="text-[10px] text-muted-custom font-bold">Help others make informed decisions</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-custom hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold flex items-center gap-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div className="space-y-4">
            {RATING_CATEGORIES.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-custom/20 border border-custom">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">{cat.label}</h4>
                  <p className="text-[8px] text-muted-custom font-bold">{cat.description}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRatings(prev => ({ ...prev, [cat.id]: star }))}
                      className="p-0.5 transition-transform active:scale-90"
                    >
                      <Star 
                        size={16} 
                        className={star <= ratings[cat.id] ? "fill-primary-gold text-primary-gold" : "text-muted-custom/30"} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom mb-2 block">Tell us more (Optional)</label>
            <div className="relative">
              <Quote className="absolute left-3 top-3 size-4 text-primary-gold/20" />
              <textarea 
                placeholder="Share your experience living here..."
                className="w-full bg-custom rounded-xl border border-custom pl-10 pr-4 py-3 text-xs font-bold outline-none focus:border-primary-gold/50 transition-all min-h-[100px] no-scrollbar"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-custom bg-custom/30">
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary-gold text-black text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary-gold/10"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : <><Check size={16} /> Submit Review</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
