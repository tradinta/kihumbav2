'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl, GeolocateControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';
import { 
  MapPin, Star, ShieldCheck, Flame, ChevronRight, 
  Layers, Sun, Moon, Crosshair 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// Theme Style URLs - These would ideally be custom styles created in Mapbox Studio
const STYLES = {
  LIGHT: 'mapbox://styles/mapbox/light-v11',
  GOLD: 'mapbox://styles/mapbox/dark-v11', // In reality, this would be a custom Kihumba Gold style
};

interface MapItem {
  id: string;
  title: string;
  price?: number;
  lat: number;
  lng: number;
  type: string;
  rating?: number;
  isVerified?: boolean;
  isPopular?: boolean;
  area?: string;
  county?: string;
  image?: string;
}

interface MapboxMapProps {
  items: MapItem[];
  center?: { lat: number; lng: number };
  onThemeToggle?: (theme: 'LIGHT' | 'GOLD') => void;
}

const PriceMarker = ({ item, isActive, onClick }: { item: MapItem; isActive: boolean; onClick: () => void }) => {
  const priceStr = item.price 
    ? (item.price >= 1000 ? `${(item.price / 1000).toFixed(item.price % 1000 === 0 ? 0 : 1)}k` : item.price.toString())
    : 'Contact';

  return (
    <Marker latitude={item.lat} longitude={item.lng} anchor="bottom">
      <div 
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        className={`px-2.5 py-1.5 rounded-lg border-2 transition-all cursor-pointer font-bold text-[10px] flex items-center gap-1 shadow-lg ${
          isActive 
            ? 'bg-primary-gold text-black border-white scale-110 z-50' 
            : 'bg-black/90 text-primary-gold border-primary-gold/30 hover:border-primary-gold'
        }`}
      >
        {item.isVerified && <ShieldCheck size={10} className={isActive ? 'text-black' : 'text-primary-gold'} />}
        KES {priceStr}
      </div>
      {/* Arrow Down */}
      <div className={`mx-auto w-2 h-2 rotate-45 -mt-1 border-r-2 border-b-2 ${
        isActive ? 'bg-primary-gold border-white' : 'bg-black/90 border-primary-gold/30'
      }`} />
    </Marker>
  );
};

export default function MapboxMap({ items, center }: MapboxMapProps) {
  const [viewState, setViewState] = useState({
    latitude: center?.lat || -1.286389,
    longitude: center?.lng || 36.817223,
    zoom: 12,
    pitch: 45, // Default 3D perspective
    bearing: 0
  });

  const [activeItem, setActiveItem] = useState<MapItem | null>(null);
  const [theme, setTheme] = useState<'LIGHT' | 'GOLD'>('LIGHT');

  const toggleTheme = () => {
    const newTheme = theme === 'LIGHT' ? 'GOLD' : 'LIGHT';
    setTheme(newTheme);
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-full w-full rounded-xl card-surface flex flex-col items-center justify-center p-8 text-center">
        <MapPin size={32} className="text-primary-gold/20 mb-4" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-primary-gold">Mapbox Token Required</h3>
        <p className="text-[10px] text-muted-custom mt-2 max-w-xs">Please add NEXT_PUBLIC_MAPBOX_TOKEN to your .env file to enable premium maps.</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden border border-custom shadow-2xl z-0 group">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={STYLES[theme]}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
      >
        {/* Controls */}
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" trackUserLocation showUserHeading />
        
        {/* Markers */}
        {items.map(item => (
          <PriceMarker 
            key={item.id} 
            item={item} 
            isActive={activeItem?.id === item.id} 
            onClick={() => setActiveItem(item)}
          />
        ))}

        {/* Selected Property Popup */}
        <AnimatePresence>
          {activeItem && (
            <Popup
              latitude={activeItem.lat}
              longitude={activeItem.lng}
              anchor="top"
              onClose={() => setActiveItem(null)}
              closeButton={false}
              maxWidth="240px"
              className="z-[100]"
            >
              <div className="bg-[var(--bg-color)] border border-primary-gold/30 rounded-lg overflow-hidden shadow-2xl">
                {activeItem.image && (
                  <div className="relative h-24">
                    <img src={activeItem.image} alt={activeItem.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 flex gap-1">
                      {activeItem.isVerified && <div className="size-5 rounded bg-primary-gold flex items-center justify-center"><ShieldCheck size={12} className="text-black" /></div>}
                      {activeItem.isPopular && <div className="size-5 rounded bg-orange-500 flex items-center justify-center"><Flame size={12} className="text-white" /></div>}
                    </div>
                  </div>
                )}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-primary-gold">{activeItem.type}</span>
                    {activeItem.rating && (
                      <div className="flex items-center gap-0.5 text-[8px] font-bold text-muted-custom">
                        <Star size={8} className="fill-primary-gold text-primary-gold" /> {activeItem.rating}
                      </div>
                    )}
                  </div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest truncate text-white mb-2">{activeItem.title}</h4>
                  <div className="flex items-center justify-between border-t border-white/10 pt-2">
                    <span className="text-[11px] font-bold text-primary-gold">
                      {activeItem.price ? `KES ${activeItem.price.toLocaleString()}` : 'Contact'}
                    </span>
                    <Link href={`/kao/${activeItem.id}`} className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-white/60 hover:text-primary-gold transition-colors">
                      Details <ChevronRight size={10} />
                    </Link>
                  </div>
                </div>
              </div>
            </Popup>
          )}
        </AnimatePresence>
      </Map>

      {/* Floating Theme Toggle */}
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        <button 
          onClick={toggleTheme}
          className="size-9 rounded-lg bg-[var(--bg-color)]/80 backdrop-blur-md border border-primary-gold/20 flex items-center justify-center text-primary-gold hover:bg-primary-gold hover:text-black transition-all shadow-xl"
        >
          {theme === 'LIGHT' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      {/* Map Branding Overlay */}
      <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/40 backdrop-blur-sm border border-white/5 pointer-events-none">
        <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/50">Enhanced with Mapbox Vector Engine</span>
      </div>

      <style jsx global>{`
        .mapboxgl-popup-content {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .mapboxgl-popup-tip {
          border-bottom-color: rgba(197, 160, 89, 0.3) !important;
        }
      `}</style>
    </div>
  );
}
