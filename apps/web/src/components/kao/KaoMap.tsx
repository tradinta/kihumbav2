'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Map, { Marker, Popup, Source, Layer, NavigationControl, MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';
import {
  Crosshair, Layers, Navigation, MapPin, Star, ShieldCheck, 
  ChevronUp, ChevronDown, ArrowUpRight, X, Search, Maximize2, Minimize2,
  SlidersHorizontal, Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const Badge = ({ children, gold, className }: { children: React.ReactNode; gold?: boolean; className?: string }) => (
  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${
    gold ? 'bg-primary-gold/10 text-primary-gold border-primary-gold/30' : 'bg-[var(--pill-bg)] text-muted-custom border-custom'
  } ${className || ''}`}>{children}</span>
);

// Generates a GeoJSON circle for Mapbox Source
const getCircleGeoJSON = (center: [number, number], radiusKm: number) => {
  const points = 64;
  const coords = {
    latitude: center[1],
    longitude: center[0]
  };
  const km = radiusKm;
  const ret = [];
  const distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
  const distanceY = km / 110.574;

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    ret.push([coords.longitude + x, coords.latitude + y]);
  }
  ret.push(ret[0]);

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [ret]
    }
  } as any;
};

interface MapItem {
  id: string;
  title: string;
  price: number;
  lat: number;
  lng: number;
  type: string;
  rating?: number;
  isVerified?: boolean;
  isPopular?: boolean;
  isIndividual?: boolean;
  area?: string;
  county?: string;
  images?: string[];
}

interface KaoMapProps {
  items: MapItem[];
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onCircleResults?: (results: MapItem[]) => void;
  initialFocusItem?: MapItem | null;
  onMapMove?: (lat: number, lng: number, zoom: number) => void;
  initialLat?: number;
  initialLng?: number;
  initialZoom?: number;
}

export default function KaoMap({ items, isFullscreen, onToggleFullscreen, onCircleResults, initialFocusItem, onMapMove, initialLat, initialLng, initialZoom }: KaoMapProps) {
  const { theme } = useTheme();
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    latitude: initialLat || -1.286389,
    longitude: initialLng || 36.817223,
    zoom: initialZoom || 12,
    pitch: 45,
    bearing: 0
  });

  const mapStyle = theme === 'white' ? 'mapbox://styles/mapbox/light-v11' : 'mapbox://styles/mapbox/dark-v11';

  // UI States
  const [activeId, setActiveId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [radiusMode, setRadiusMode] = useState(false);
  const [radiusCenter, setRadiusCenter] = useState<[number, number] | null>(null);
  const [radiusKm, setRadiusKm] = useState(5);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Radius filters
  const [radiusFilterType, setRadiusFilterType] = useState('All');
  const [radiusMaxPrice, setRadiusMaxPrice] = useState(0); // 0 = no limit

  // Location search
  const [placeSearch, setPlaceSearch] = useState('');
  const [placeResults, setPlaceResults] = useState<any[]>([]);

  const handlePlaceSearch = useCallback(async (query: string) => {
    setPlaceSearch(query);
    if (query.length < 3) { setPlaceResults([]); return; }
    try {
      const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=ke&limit=5`);
      const data = await res.json();
      setPlaceResults(data.features || []);
    } catch { setPlaceResults([]); }
  }, []);

  // Handle initial focus
  useEffect(() => {
    if (initialFocusItem && mapRef.current) {
      setActiveId(initialFocusItem.id);
      mapRef.current.flyTo({
        center: [initialFocusItem.lng, initialFocusItem.lat],
        zoom: 15,
        duration: 2000,
        pitch: 45
      });
    }
  }, [initialFocusItem]);

  // Filter items within radius + type + price
  const visibleItems = useMemo(() => {
    let filtered = items;

    // Radius filter
    if (radiusCenter) {
      filtered = filtered.filter(item => {
        const R = 6371;
        const dLat = (item.lat - radiusCenter[1]) * Math.PI / 180;
        const dLon = (item.lng - radiusCenter[0]) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(radiusCenter[1] * Math.PI / 180) * Math.cos(item.lat * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c <= radiusKm;
      });
    }

    // Type filter
    if (radiusFilterType !== 'All') {
      filtered = filtered.filter(item => 
        item.type.toLowerCase().replace(/[_ ]/g, '') === radiusFilterType.toLowerCase().replace(/[_ ]/g, '')
      );
    }

    // Price filter
    if (radiusMaxPrice > 0) {
      filtered = filtered.filter(item => item.price <= radiusMaxPrice);
    }

    if (radiusCenter) {
      return filtered.slice(0, 5);
    }

    return filtered;
  }, [items, radiusCenter, radiusKm, radiusFilterType, radiusMaxPrice]);

  const handleLocateMe = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const loc: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        setUserLocation(loc);
        mapRef.current?.flyTo({ center: loc, zoom: 14, duration: 2000 });
      });
    }
  }, []);

  const handleMapClick = (e: any) => {
    if (radiusMode) {
      setRadiusCenter([e.lngLat.lng, e.lngLat.lat]);
    } else {
      setActiveId(null);
    }
  };

  // 3D Buildings Layer logic
  const onMapLoad = useCallback((e: any) => {
    const map = e.target;
    const layers = map.getStyle().layers;
    const labelLayerId = layers.find(
      (layer: any) => layer.type === 'symbol' && layer.layout['text-field']
    )?.id;

    map.addLayer(
      {
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': '#222',
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.6
        }
      },
      labelLayerId
    );
  }, []);

  return (
    <div className={`relative w-full rounded-lg overflow-hidden card-surface z-0 ${isFullscreen ? 'h-screen' : 'h-[calc(100vh-260px)]'}`}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => {
          setViewState(evt.viewState);
          onMapMove?.(evt.viewState.latitude, evt.viewState.longitude, evt.viewState.zoom);
        }}
        onClick={handleMapClick}
        mapStyle={mapStyle}
        mapboxAccessToken={MAPBOX_TOKEN}
        onLoad={onMapLoad}
        terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
      >
        <Source id="mapbox-dem" type="raster-dem" url="mapbox://mapbox.mapbox-terrain-dem-v1" tileSize={512} />
        
        {/* Radius Search Circle */}
        {radiusCenter && (
          <Source id="radius-source" type="geojson" data={getCircleGeoJSON(radiusCenter, radiusKm)}>
            <Layer
              id="radius-fill"
              type="fill"
              paint={{
                'fill-color': '#c5a059',
                'fill-opacity': 0.05
              }}
            />
            <Layer
              id="radius-outline"
              type="line"
              paint={{
                'line-color': '#c5a059',
                'line-width': 2,
                'line-dasharray': [2, 1]
              }}
            />
          </Source>
        )}

        {/* User Location Marker */}
        {userLocation && (
          <Marker longitude={userLocation[0]} latitude={userLocation[1]}>
             <div className="relative">
                <div className="size-4 rounded-full bg-primary-gold/40 border-2 border-primary-gold animate-ping absolute inset-0" />
                <div className="size-4 rounded-full bg-primary-gold border-2 border-black relative z-10 shadow-lg" />
             </div>
          </Marker>
        )}

        {/* Listing Markers */}
        {visibleItems.map(item => (
          <Marker 
            key={item.id} 
            longitude={item.lng} 
            latitude={item.lat} 
            anchor="bottom"
            onClick={e => {
              e.originalEvent.stopPropagation();
              setActiveId(item.id);
            }}
          >
            <div className={`cursor-pointer transition-all duration-300 transform ${activeId === item.id ? 'scale-110 -translate-y-1' : 'hover:scale-105'}`}>
              <div className={`px-2 py-1 rounded-lg border-2 shadow-2xl flex items-center gap-1.5 font-bold text-[10px] whitespace-nowrap ${
                activeId === item.id 
                  ? 'bg-primary-gold text-black border-white/50' 
                  : item.isIndividual ? 'bg-zinc-900 text-orange-400 border-orange-400/30' : 'bg-black/80 text-primary-gold border-primary-gold/40'
              }`}>
                {item.isVerified && <ShieldCheck size={10} />}
                {item.isIndividual && <Star size={10} fill="currentColor" />}
                KES {item.price >= 1000 ? `${(item.price / 1000).toFixed(1)}k` : item.price}
              </div>
              <div className={`w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] mx-auto -mt-0.5 ${
                activeId === item.id ? 'border-t-white/50' : item.isIndividual ? 'border-t-orange-400/30' : 'border-t-primary-gold/40'
              }`} />
            </div>
          </Marker>
        ))}

        {/* Detail Popup */}
        {activeId && (
          <Popup
            longitude={visibleItems.find(i => i.id === activeId)?.lng || 0}
            latitude={visibleItems.find(i => i.id === activeId)?.lat || 0}
            anchor="top"
            onClose={() => setActiveId(null)}
            closeButton={false}
            className="kao-popup"
            maxWidth="240px"
          >
            {(() => {
              const item = visibleItems.find(i => i.id === activeId);
              if (!item) return null;
              return (
                <Link href={`/kao/${item.id}`}>
                  <div className="p-3 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden group">
                    <div className="flex items-center gap-1.5 mb-2">
                       <Badge gold={item.isVerified}>{item.type.replace('_', ' ')}</Badge>
                       {item.isPopular && <Badge gold>Popular</Badge>}
                    </div>
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-white mb-1 group-hover:text-primary-gold transition-colors">{item.title}</h4>
                    <div className="flex items-center gap-1 mb-3">
                      <MapPin size={10} className="text-primary-gold/60" />
                      <span className="text-[9px] font-bold text-muted-custom truncate">{item.area}, {item.county}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-xs font-black text-primary-gold">KES {item.price.toLocaleString()}</span>
                      <ArrowUpRight size={12} className="text-primary-gold opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </div>
                </Link>
              );
            })()}
          </Popup>
        )}

        <NavigationControl position="bottom-right" />
      </Map>

      {/* ─── UI Overlays ─── */}

      {/* Location Search Bar */}
      <div className="absolute top-3 left-14 right-48 z-30">
        <div className="relative">
          <div className="card-surface rounded-xl shadow-xl border border-white/10 flex items-center gap-2 px-3 py-2">
            <Search size={14} className="text-primary-gold shrink-0" />
            <input
              type="text"
              placeholder="Search location e.g. Juja, Westlands..."
              value={placeSearch}
              onChange={e => handlePlaceSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[11px] font-bold placeholder:text-muted-custom/50"
            />
            {placeSearch && (
              <button onClick={() => { setPlaceSearch(''); setPlaceResults([]); }} className="text-muted-custom hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>
          {placeResults.length > 0 && (
            <div className="absolute mt-1 w-full bg-[var(--bg-color)] border border-custom rounded-xl shadow-2xl max-h-48 overflow-y-auto z-50">
              {placeResults.map((r: any) => (
                <button
                  key={r.id}
                  onClick={() => {
                    const [lng, lat] = r.center;
                    mapRef.current?.flyTo({ center: [lng, lat], zoom: 15, duration: 1500 });
                    setPlaceSearch(r.place_name);
                    setPlaceResults([]);
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
      </div>

      <div className="absolute top-3 left-3 flex flex-col gap-2">
        <button
          onClick={handleLocateMe}
          className="size-9 rounded-xl card-surface flex items-center justify-center text-primary-gold hover:bg-primary-gold/10 transition-all active:scale-90 shadow-xl border border-white/5"
        >
          <Crosshair size={18} />
        </button>
        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className="size-9 rounded-xl card-surface flex items-center justify-center text-primary-gold hover:bg-primary-gold/10 transition-all active:scale-90 shadow-xl border border-white/5"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        )}
      </div>

      <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
        <button
          onClick={() => {
            if (radiusMode) { setRadiusCenter(null); setRadiusMode(false); } else { setRadiusMode(true); }
          }}
          className={`h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl active:scale-95 border ${
            radiusMode ? 'bg-primary-gold text-black border-white/20' : 'card-surface text-primary-gold hover:bg-primary-gold/10 border-white/5'
          }`}
        >
          <Navigation size={14} />
          {radiusMode ? (radiusCenter ? 'Clear Search' : 'Tap Map to Start') : 'Circle Search'}
        </button>

        {radiusCenter && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="card-surface rounded-2xl p-4 shadow-2xl min-w-[220px] max-w-[260px] border border-white/10 backdrop-blur-md space-y-4"
          >
            {/* Radius Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-custom">Radius</span>
                <span className="text-xs font-black text-primary-gold">{radiusKm} KM</span>
              </div>
              <input
                type="range" min={1} max={20} value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-zinc-800 accent-primary-gold"
              />
            </div>

            {/* Type Filter */}
            <div>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-custom block mb-2">Looking For</span>
              <div className="flex flex-wrap gap-1">
                {['All', 'Bedsitter', 'Studio', '1 BR', '2 BR', 'SQ', 'Single'].map(t => (
                  <button
                    key={t}
                    onClick={() => setRadiusFilterType(t)}
                    className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all border ${
                      radiusFilterType === t
                        ? 'bg-primary-gold text-black border-primary-gold'
                        : 'bg-transparent text-muted-custom border-white/10 hover:border-primary-gold/30'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-custom">Max Budget</span>
                <span className="text-[10px] font-black text-primary-gold">
                  {radiusMaxPrice === 0 ? 'No Limit' : `KES ${radiusMaxPrice.toLocaleString()}`}
                </span>
              </div>
              <input
                type="range" min={0} max={100000} step={5000} value={radiusMaxPrice}
                onChange={(e) => setRadiusMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-zinc-800 accent-primary-gold"
              />
              <div className="flex justify-between text-[7px] font-black text-white/20 mt-1 uppercase tracking-widest">
                <span>Any</span>
                <span>100K</span>
              </div>
            </div>

            {/* Results Count */}
            <div className="pt-2 border-t border-white/5 text-center flex flex-col gap-3">
              <div>
                <span className="text-[10px] font-black text-primary-gold">{visibleItems.length}</span>
                <span className="text-[9px] font-bold text-muted-custom ml-1">match{visibleItems.length !== 1 ? 'es' : ''} found</span>
              </div>
              
              {visibleItems.length > 0 && onCircleResults && (
                <button 
                  onClick={() => onCircleResults(visibleItems)}
                  className="w-full h-8 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-primary-gold hover:bg-primary-gold hover:text-black transition-all flex items-center justify-center gap-2"
                >
                  View Results in Grid <ArrowUpRight size={10} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Active Listing Card */}
      <AnimatePresence>
        {activeId && (() => {
          const item = visibleItems.find(i => i.id === activeId);
          if (!item) return null;
          return (
            <motion.div 
              initial={{ y: 100, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-6 inset-x-4 z-40 flex justify-center pointer-events-none"
            >
              <div className="w-full max-w-sm card-surface rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-primary-gold/20 flex flex-col pointer-events-auto group/active">
                <div className="relative aspect-[16/10] overflow-hidden">
                   {(() => {
                      // Extremely robust check for image source
                      const rawImages = item.images || (item as any).imageUrls || [];
                      const firstImage = rawImages[0];
                      let imgSrc = typeof firstImage === 'string' ? firstImage : firstImage?.url || (item as any).image;
                      
                      if (imgSrc && imgSrc.length > 0) {
                        return (
                          <img 
                            src={imgSrc} 
                            className="size-full object-cover group-hover/active:scale-110 transition-transform duration-700"
                            alt={item.title}
                          />
                        );
                      }
                      return (
                        <div className="size-full bg-zinc-900 flex flex-col items-center justify-center text-zinc-700 gap-2">
                           <Camera size={40} strokeWidth={1} />
                           <span className="text-[8px] font-black uppercase tracking-[0.2em]">No Photo Available</span>
                        </div>
                      );
                    })()}

                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                   
                   <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                      <Badge gold={item.isVerified}>{item.type}</Badge>
                   </div>
                   
                   <button 
                     onClick={() => setActiveId(null)}
                     className="absolute top-4 right-4 size-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                   >
                     <X size={14} />
                   </button>

                   <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="text-right shrink-0">
                         <span className="text-xl font-black text-primary-gold gold-glow">KES {item.price.toLocaleString()}</span>
                      </div>
                      <Badge gold={item.isVerified} className="backdrop-blur-md bg-black/40">{item.type}</Badge>
                   </div>
                </div>

                <div className="p-3 bg-black/40 backdrop-blur-xl border-t border-white/5 flex gap-2">
                   <Link 
                     href={`/kao/${item.id}`}
                     className="flex-1 h-11 rounded-lg bg-primary-gold text-black text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary-gold/10"
                   >
                     View Property <ArrowUpRight size={14} />
                   </Link>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      <style jsx global>{`
        .kao-popup .mapboxgl-popup-content {
          padding: 0;
          background: transparent;
          box-shadow: none;
          border-radius: 12px;
        }
        .kao-popup .mapboxgl-popup-tip {
          border-top-color: #0a0a0a;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
