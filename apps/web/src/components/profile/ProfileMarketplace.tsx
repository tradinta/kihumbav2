'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShieldCheck, Star, Repeat2, ArrowUpRight, ShoppingBag, TrendingUp, CheckCircle } from 'lucide-react';
import type { ProfileListing, ProfileReview, ProfileUser } from '@/data/profileData';

interface Props {
  user: ProfileUser;
  listings: ProfileListing[];
  reviews: ProfileReview[];
}

export default function ProfileMarketplace({ user, listings, reviews }: Props) {
  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0';

  return (
    <div className="px-4 space-y-6">
      {/* Verified Seller Card */}
      {user.isVerifiedSeller && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="card-surface rounded-lg p-4 flex items-center justify-between border-primary-gold/20"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-primary-gold/10 flex items-center justify-center">
              <ShieldCheck size={20} className="text-primary-gold" />
            </div>
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary-gold">Verified Seller</h3>
              <p className="text-[9px] text-muted-custom font-bold">Trusted by the Kihumba community</p>
            </div>
          </div>
          <Link href={`/marketplace/seller/s1`}>
            <button className="h-7 px-3 bg-primary-gold text-black rounded text-[8px] font-bold uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-1">
              Storefront <ArrowUpRight size={8} />
            </button>
          </Link>
        </motion.div>
      )}

      {/* Deal Stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-2"
      >
        <div className="card-surface rounded-lg p-3 text-center">
          <TrendingUp size={12} className="text-primary-gold mx-auto mb-1" />
          <span className="text-sm font-bold block">{user.stats.deals}</span>
          <span className="text-[7px] font-bold uppercase tracking-widest text-muted-custom">Deals Done</span>
        </div>
        <div className="card-surface rounded-lg p-3 text-center">
          <CheckCircle size={12} className="text-primary-gold mx-auto mb-1" />
          <span className="text-sm font-bold block">98%</span>
          <span className="text-[7px] font-bold uppercase tracking-widest text-muted-custom">Success Rate</span>
        </div>
        <div className="card-surface rounded-lg p-3 text-center">
          <Star size={12} className="text-primary-gold mx-auto mb-1" />
          <span className="text-sm font-bold block">{avgRating}</span>
          <span className="text-[7px] font-bold uppercase tracking-widest text-muted-custom">Avg Rating</span>
        </div>
      </motion.div>

      {/* Active Listings */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">Active Listings ({listings.length})</h3>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {listings.map(item => (
            <Link key={item.id} href={`/marketplace/${item.id}`} className="shrink-0">
              <div className="w-44 card-surface rounded-lg overflow-hidden group hover:border-primary-gold/30 transition-all cursor-pointer">
                <div className="relative h-28 overflow-hidden">
                  <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  {item.tradeType === 'BOTH' && (
                    <span className="absolute top-1.5 left-1.5 bg-primary-gold/90 text-black px-1.5 py-0.5 rounded text-[7px] font-bold uppercase flex items-center gap-0.5">
                      <Repeat2 size={7} /> Trade
                    </span>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-5">
                    <span className="text-[10px] font-bold text-primary-gold">KES {item.price.toLocaleString()}</span>
                  </div>
                </div>
                <div className="p-2">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest truncate group-hover:text-primary-gold transition-colors">{item.title}</h4>
                  <span className="text-[7px] text-muted-custom">{item.condition}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Reviews */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">Reviews ({reviews.length})</h3>
        <div className="space-y-2">
          {reviews.map((review, i) => (
            <div key={i} className="card-surface rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <Link href={`/profile/${review.author.toLowerCase().replace(/\s+/g, '_').replace('.', '')}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <img src={review.avatar} className="size-6 rounded-full object-cover" alt="" />
                  <span className="text-[10px] font-bold hover:text-primary-gold transition-colors">{review.author}</span>
                </Link>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} size={8} className="fill-primary-gold text-primary-gold" />
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-muted-custom font-bold leading-relaxed">{review.comment}</p>
              <span className="text-[8px] text-muted-custom/60 mt-1 block">{review.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
