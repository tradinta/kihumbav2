'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Home, Search, Bed } from 'lucide-react';
import type { ProfileProperty } from '@/data/profileData';

interface Props {
  properties: ProfileProperty[];
}

export default function ProfileKao({ properties }: Props) {
  return (
    <div className="px-4 space-y-6">
      {/* Listed Properties */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">Listed Properties ({properties.length})</h3>
        {properties.length === 0 ? (
          <div className="card-surface rounded-lg py-10 text-center">
            <Home size={24} className="text-primary-gold/20 mx-auto mb-2" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-custom">No properties listed</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {properties.map((prop, i) => (
              <Link key={prop.id} href={`/kao/${prop.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="card-surface rounded-lg overflow-hidden group hover:border-primary-gold/30 transition-all cursor-pointer"
                >
                  <div className="relative h-32 overflow-hidden">
                    <Image src={prop.image} alt={prop.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2.5 pt-8">
                      <span className="text-[10px] font-bold text-primary-gold">KES {prop.price.toLocaleString()}/mo</span>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest truncate group-hover:text-primary-gold transition-colors">{prop.title}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="flex items-center gap-1 text-[8px] text-muted-custom">
                        <MapPin size={8} className="text-primary-gold/50" /> {prop.area}, {prop.county}
                      </span>
                      <span className="flex items-center gap-1 text-[8px] text-muted-custom">
                        <Bed size={8} className="text-primary-gold/50" /> {prop.bedrooms}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* Saved Searches */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h3 className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-gold/60 mb-3">Saved Searches</h3>
        <div className="space-y-2">
          {['2BR in Kilimani under 40k', 'Studio in Westlands', '1BR with 24/7 water'].map((search, i) => (
            <div key={i} className="card-surface rounded-lg p-3 flex items-center gap-2 hover:border-primary-gold/20 transition-all cursor-pointer">
              <Search size={12} className="text-primary-gold/40" />
              <span className="text-[10px] font-bold text-muted-custom">{search}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
