'use client';

import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  Crosshair, Minus, Plus, Layers, Navigation, SlidersHorizontal,
  MapPin, Star, ShieldCheck, Flame, X, ChevronUp, ChevronDown, ArrowUpRight
} from 'lucide-react';

// ─── Custom Price Marker using DivIcon ───────────────────────────────────────
const createPriceIcon = (price: number, isActive: boolean, isVerified: boolean) => {
  const priceStr = price >= 1000 ? `${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}k` : price.toString();
  return L.divIcon({
    className: 'kao-price-marker',
    html: `
      <div style="
        display:flex; align-items:center; gap:4px;
        padding: 4px 8px;
        background: ${isActive ? '#c5a059' : 'rgba(0,0,0,0.85)'};
        color: ${isActive ? '#000' : '#c5a059'};
        border: 1.5px solid ${isActive ? '#e2c27d' : 'rgba(197,160,89,0.4)'};
        border-radius: 8px;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.05em;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        cursor: pointer;
        transition: all 0.2s;
        font-family: Inter, system-ui, sans-serif;
      ">
        ${isVerified ? '<span style="color:#c5a059;font-size:8px;">✓</span>' : ''}
        KES ${priceStr}
      </div>
      <div style="
        width:8px; height:8px;
        background: ${isActive ? '#c5a059' : 'rgba(0,0,0,0.85)'};
        border-right: 1.5px solid ${isActive ? '#e2c27d' : 'rgba(197,160,89,0.4)'};
        border-bottom: 1.5px solid ${isActive ? '#e2c27d' : 'rgba(197,160,89,0.4)'};
        transform: rotate(45deg);
        margin: -5px auto 0;
      "></div>
    `,
    iconSize: [80, 36],
    iconAnchor: [40, 40],
  });
};

// ─── Map Controller for programmatic actions ─────────────────────────────────
function MapController({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, zoom ?? map.getZoom(), { duration: 1.2 });
  }, [center, zoom]);
  return null;
}

// ─── Click handler to set radius search center ──────────────────────────────
function RadiusClickHandler({ onMapClick, enabled }: { onMapClick: (latlng: L.LatLng) => void; enabled: boolean }) {
  useMapEvents({
    click(e) {
      if (enabled) onMapClick(e.latlng);
    },
  });
  return null;
}

// ─── Types ───────────────────────────────────────────────────────────────────
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
  area?: string;
  county?: string;
  managedBy?: string;
}

interface KaoMapProps {
  items: MapItem[];
}

// ─── Badge mini-component ────────────────────────────────────────────────────
const Badge = ({ children, gold }: { children: React.ReactNode; gold?: boolean }) => (
  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border ${
    gold ? 'bg-primary-gold/10 text-primary-gold border-primary-gold/30' : 'bg-[var(--pill-bg)] text-muted-custom border-custom'
  }`}>{children}</span>
);

// ═════════════════════════════════════════════════════════════════════════════
export default function KaoMap({ items }: KaoMapProps) {
  const defaultCenter: [number, number] = [-1.286389, 36.817223];

  // Radius search
  const [radiusMode, setRadiusMode] = useState(false);
  const [radiusCenter, setRadiusCenter] = useState<[number, number] | null>(null);
  const [radiusKm, setRadiusKm] = useState(5);

  // Active marker
  const [activeId, setActiveId] = useState<string | null>(null);

  // Floating panel
  const [panelOpen, setPanelOpen] = useState(true);

  // Tile style
  const [darkTiles, setDarkTiles] = useState(true);

  // Fly target
  const [flyTo, setFlyTo] = useState<[number, number] | undefined>(undefined);
  const [flyZoom, setFlyZoom] = useState<number | undefined>(undefined);

  // Geolocation
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  const handleLocateMe = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(loc);
          setFlyTo(loc);
          setFlyZoom(14);
        },
        () => {
          // Fallback to Nairobi
          setFlyTo(defaultCenter);
          setFlyZoom(12);
        }
      );
    }
  }, []);

  // Filter items within radius
  const visibleItems = useMemo(() => {
    if (!radiusCenter) return items;
    return items.filter(item => {
      const dist = L.latLng(radiusCenter[0], radiusCenter[1]).distanceTo(L.latLng(item.lat, item.lng));
      return dist <= radiusKm * 1000;
    });
  }, [items, radiusCenter, radiusKm]);

  const handleRadiusClick = useCallback((latlng: L.LatLng) => {
    setRadiusCenter([latlng.lat, latlng.lng]);
  }, []);

  const clearRadius = useCallback(() => {
    setRadiusCenter(null);
    setRadiusMode(false);
  }, []);

  const tileUrl = darkTiles
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const tileAttribution = darkTiles
    ? '&copy; <a href="https://carto.com/">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  return (
    <div className="relative h-[calc(100vh-260px)] w-full rounded-lg overflow-hidden card-surface z-0">
      {/* ═══ Map ═══ */}
      <MapContainer center={defaultCenter} zoom={11} className="h-full w-full z-0" zoomControl={false}>
        <TileLayer attribution={tileAttribution} url={tileUrl} />
        <MapController center={flyTo} zoom={flyZoom} />
        <RadiusClickHandler onMapClick={handleRadiusClick} enabled={radiusMode} />

        {/* Radius circle */}
        {radiusCenter && (
          <Circle
            center={radiusCenter}
            radius={radiusKm * 1000}
            pathOptions={{
              color: '#c5a059',
              fillColor: '#c5a059',
              fillOpacity: 0.08,
              weight: 2,
              dashArray: '8, 4',
            }}
          />
        )}

        {/* User location marker */}
        {userLocation && (
          <Circle
            center={userLocation}
            radius={60}
            pathOptions={{ color: '#c5a059', fillColor: '#c5a059', fillOpacity: 0.6, weight: 2 }}
          />
        )}

        {/* Property Markers */}
        {visibleItems.map(item => (
          <Marker
            key={item.id}
            position={[item.lat, item.lng]}
            icon={createPriceIcon(item.price, activeId === item.id, item.isVerified ?? false)}
            eventHandlers={{
              click: () => setActiveId(item.id === activeId ? null : item.id),
            }}
          >
            <Popup className="kao-popup" closeButton={false} autoPan={false}>
              <Link href={`/kao/${item.id}`}>
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 8, padding: 10, minWidth: 180, fontFamily: 'Inter, system-ui, sans-serif', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                    {item.isVerified && <ShieldCheck size={10} color="#c5a059" />}
                    {item.isPopular && <Flame size={10} color="#c5a059" />}
                    <span style={{ fontSize: 9, fontWeight: 800, color: '#c5a059', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{item.type}</span>
                  </div>
                  <h4 style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 2, lineHeight: 1.3 }}>{item.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 6 }}>
                    <MapPin size={9} color="rgba(197,160,89,0.6)" />
                    <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{item.area}, {item.county}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#c5a059' }}>KES {item.price.toLocaleString()}<span style={{ fontSize: 9, color: 'var(--text-muted)', marginLeft: 2 }}>/mo</span></span>
                    {item.rating && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 9, fontWeight: 800, color: 'var(--text-muted)' }}>
                        <Star size={9} fill="#c5a059" color="#c5a059" /> {item.rating}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* ═══ Floating Controls — Top Left ═══ */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-1.5">
        {/* Locate me */}
        <button
          onClick={handleLocateMe}
          title="Find my location"
          className="size-8 rounded-lg card-surface flex items-center justify-center text-primary-gold hover:bg-primary-gold/10 transition-all active:scale-90 shadow-md"
        >
          <Crosshair size={16} />
        </button>

        {/* Toggle tile style */}
        <button
          onClick={() => setDarkTiles(!darkTiles)}
          title={darkTiles ? 'Light map' : 'Dark map'}
          className="size-8 rounded-lg card-surface flex items-center justify-center text-primary-gold hover:bg-primary-gold/10 transition-all active:scale-90 shadow-md"
        >
          <Layers size={16} />
        </button>
      </div>

      {/* ═══ Radius Search Control — Top Right ═══ */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col items-end gap-2">
        {/* Toggle radius mode */}
        <button
          onClick={() => {
            if (radiusMode) { clearRadius(); } else { setRadiusMode(true); }
          }}
          className={`h-8 px-3 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
            radiusMode
              ? 'bg-primary-gold text-black'
              : 'card-surface text-primary-gold hover:bg-primary-gold/10'
          }`}
        >
          <Navigation size={12} />
          {radiusMode ? (radiusCenter ? 'Clear Radius' : 'Tap Map to Set Center') : 'Circle Search'}
        </button>

        {/* Radius slider (visible when circle is dropped) */}
        {radiusCenter && (
          <div className="card-surface rounded-lg p-2.5 shadow-lg min-w-[180px]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[8px] font-bold uppercase tracking-widest text-muted-custom">Radius</span>
              <span className="text-[10px] font-bold text-primary-gold">{radiusKm} km</span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #c5a059 0%, #c5a059 ${((radiusKm - 1) / 19) * 100}%, var(--pill-bg) ${((radiusKm - 1) / 19) * 100}%, var(--pill-bg) 100%)`,
              }}
            />
            <div className="flex justify-between text-[7px] font-bold text-muted-custom mt-0.5">
              <span>1 km</span>
              <span>20 km</span>
            </div>
            <div className="mt-2 text-[9px] font-bold text-primary-gold text-center">
              {visibleItems.length} listing{visibleItems.length !== 1 ? 's' : ''} in range
            </div>
          </div>
        )}
      </div>

      {/* ═══ Results Count Badge — Top Center ═══ */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="card-surface rounded-lg px-3 py-1.5 shadow-md flex items-center gap-2">
          <MapPin size={10} className="text-primary-gold" />
          <span className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">
            {visibleItems.length} propert{visibleItems.length !== 1 ? 'ies' : 'y'} visible
          </span>
        </div>
      </div>

      {/* ═══ Floating Listing Panel — Bottom ═══ */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000]">
        {/* Toggle button */}
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          className="mx-auto mb-1 flex items-center gap-1 px-3 py-1 card-surface rounded-t-lg text-[8px] font-bold uppercase tracking-widest text-primary-gold shadow-md border-b-0"
          style={{ display: 'table', margin: '0 auto' }}
        >
          {panelOpen ? <ChevronDown size={10} /> : <ChevronUp size={10} />}
          {panelOpen ? 'Hide' : `Show ${visibleItems.length} Listings`}
        </button>

        {panelOpen && visibleItems.length > 0 && (
          <div className="pb-2 px-2">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {visibleItems.map(item => (
                <Link key={item.id} href={`/kao/${item.id}`}>
                  <div
                    onClick={() => {
                      setActiveId(item.id);
                      setFlyTo([item.lat, item.lng]);
                      setFlyZoom(15);
                    }}
                    className={`flex-shrink-0 w-52 card-surface rounded-lg p-2.5 cursor-pointer transition-all hover:border-primary-gold/30 ${
                      activeId === item.id ? 'border-primary-gold/50 ring-1 ring-primary-gold/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {item.isVerified && <Badge gold><ShieldCheck size={8} /></Badge>}
                      <span className="text-[8px] font-bold uppercase tracking-widest text-muted-custom">{item.type}</span>
                      <span className="ml-auto flex items-center gap-0.5 text-[8px] font-bold text-muted-custom">
                        <Star size={8} className="fill-primary-gold text-primary-gold" /> {item.rating}
                      </span>
                    </div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest truncate mb-0.5">{item.title}</h4>
                    <div className="flex items-center gap-1 mb-1.5">
                      <MapPin size={8} className="text-primary-gold/50" />
                      <span className="text-[8px] text-muted-custom truncate">{item.area}, {item.county}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-custom pt-1.5">
                      <span className="text-[10px] font-bold text-primary-gold">KES {item.price.toLocaleString()}<span className="text-[8px] text-muted-custom ml-0.5">/mo</span></span>
                      <ArrowUpRight size={10} className="text-primary-gold" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ═══ Custom CSS for Leaflet overrides ═══ */}
      <style jsx global>{`
        .kao-price-marker { background: transparent !important; border: none !important; }
        .kao-popup .leaflet-popup-content-wrapper { background: transparent !important; box-shadow: none !important; border: none !important; border-radius: 0 !important; padding: 0 !important; }
        .kao-popup .leaflet-popup-content { margin: 0 !important; }
        .kao-popup .leaflet-popup-tip { display: none !important; }
        .leaflet-control-attribution { font-size: 8px !important; opacity: 0.5; }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px; height: 14px;
          background: #c5a059;
          border-radius: 50%;
          border: 2px solid #000;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        }
        input[type="range"]::-moz-range-thumb {
          width: 14px; height: 14px;
          background: #c5a059;
          border-radius: 50%;
          border: 2px solid #000;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
