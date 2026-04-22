"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar, MapPin, Share2, Heart, Search, 
  Filter, Plus, TrendingUp, Ticket, 
  ChevronRight, CalendarDays, ExternalLink,
  Repeat2, MessageCircle, MoreVertical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LeftSidebar from "@/components/LeftSidebar";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import { usePostContext } from "@/context/PostContext";
import { api } from "@/lib/api";

interface KihumbaEvent {
  id: string;
  title: string;
  organizer: string;
  date: string;
  venue: string;
  price: string;
  image: string;
  description?: string;
  externalLink?: string;
  likes: number;
  shares: number;
}

const MOCK_EVENTS: KihumbaEvent[] = [
  {
    id: "1",
    title: "Sauti Sol Final Concert",
    organizer: "Sauti Sol",
    date: "2026-02-14T20:00:00",
    venue: "Nairobi",
    price: "KES 3,500",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
    likes: 1240,
    shares: 450
  },
  {
    id: "2",
    title: "Mombasa Food Festival",
    organizer: "Coast Eats",
    date: "2026-04-10T11:00:00",
    venue: "Mombasa",
    price: "KES 1,000",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
    likes: 850,
    shares: 120
  },
  {
    id: "3",
    title: "DJ Joe Mfalme Live",
    organizer: "B-Club",
    date: "2026-05-20T22:00:00",
    venue: "Kilimani, Nairobi",
    price: "KES 2,500",
    image: "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&q=80&w=800",
    likes: 3400,
    shares: 890
  },
  {
    id: "4",
    title: "Tech Summit 2026",
    organizer: "Kihumba Tech",
    date: "2026-06-15T09:00:00",
    venue: "KICC",
    price: "Free",
    image: "https://images.unsplash.com/photo-1540575861501-7ad0582371f3?auto=format&fit=crop&q=80&w=800",
    likes: 560,
    shares: 230
  }
];

export default function EventsPage() {
  const { setCreatePostOpen, setQuoteTarget } = usePostContext();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CONCERTS' | 'FOOD' | 'TECH' | 'NIGHTLIFE'>('ALL');

  useEffect(() => {
      const fetchEvents = async () => {
          try {
              const queryParams = new URLSearchParams({ tab: 'EVENT', limit: '30', q: searchQuery });
              const res = await api.get(`/posts?${queryParams.toString()}`);
              setEvents(res.posts || []);
          } catch (err) {
              console.error("Failed to fetch events", err);
          } finally {
              setLoading(false);
          }
      };
      fetchEvents();
  }, [searchQuery]);

  const handleRepost = (post: any) => {
      setQuoteTarget(post);
      setCreatePostOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      <LeftSidebar />
      
      <main className="flex-1 flex flex-col min-w-0 lg:border-x border-white/5 bg-zinc-950/20">
        <TopBar />
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Hero Banner / Search Section */}
          <div className="px-6 py-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-gold/5 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse" />
             
             <div className="relative z-10 max-w-4xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="size-10 rounded-xl bg-primary-gold/20 flex items-center justify-center text-primary-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                        <Calendar size={22} />
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-[0.2em] gold-glow">Events</h1>
                </div>
                <p className="text-muted-custom text-sm font-medium tracking-wide max-w-xl leading-relaxed mb-10">
                    Discover birthdays, nightlife, concerts, and exclusive Kihumba gatherings. 
                    The heartbeat of the community, curated in real-time.
                </p>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary-gold transition-colors" size={18} />
                        <input 
                            placeholder="Search events, organizers or venues..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:border-primary-gold/40 focus:bg-white/[0.05] transition-all"
                        />
                    </div>
                    <button className="h-14 px-8 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3 hover:bg-white/[0.05] hover:border-white/20 transition-all">
                        <Filter size={18} className="text-primary-gold" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
                    </button>
                    <button 
                        onClick={() => setCreatePostOpen(true)}
                        className="h-14 px-8 rounded-2xl bg-primary-gold text-black flex items-center gap-3 font-black text-[10px] uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary-gold/10"
                    >
                        <Plus size={18} />
                        Post Event
                    </button>
                </div>
             </div>
          </div>

          {/* Events Grid */}
          <div className="px-6 pb-24">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {events.map((event) => (
                      <EventCard 
                        key={event.id} 
                        event={event} 
                        onRepost={() => handleRepost(event)} 
                      />
                  ))}
              </div>
          </div>
        </div>
        <BottomNav />
      </main>
      
      {/* Right Sidebar - Trending Events */}
      <aside className="hidden xl:flex w-80 flex-col p-8 border-l border-white/5 sticky-sidebar">
          <div className="mb-10">
              <div className="flex items-center gap-2 mb-6">
                  <TrendingUp size={16} className="text-primary-gold" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Trending Now</h3>
              </div>
              <div className="space-y-6">
                  {events.slice(0, 3).map((e) => (
                      <div key={e.id} className="flex gap-4 group cursor-pointer">
                          <div className="size-16 rounded-xl overflow-hidden border border-white/10 relative shrink-0">
                              <img src={e.image} className="size-full object-cover transition-transform group-hover:scale-110" alt="" />
                              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                          </div>
                          <div className="flex-1 min-w-0 pt-1">
                              <h4 className="text-xs font-bold text-white truncate group-hover:text-primary-gold transition-colors">{e.title}</h4>
                              <p className="text-[10px] font-bold text-primary-gold/80 uppercase tracking-widest mt-1">{e.price}</p>
                              <p className="text-[9px] text-muted-custom mt-1 italic">{e.organizer}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          <div className="mt-auto p-6 rounded-3xl bg-primary-gold/5 border border-primary-gold/10 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-primary-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Ticket size={32} className="text-primary-gold mx-auto mb-4" />
              <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Host an Event?</h4>
              <p className="text-[10px] text-muted-custom font-medium uppercase leading-relaxed mb-6">Monetize your gatherings and reach the whole tribe instantly.</p>
              <button className="w-full py-3 rounded-xl bg-primary-gold text-black font-black text-[9px] uppercase tracking-widest hover:brightness-110 transition-all">
                  Partner with Us
              </button>
          </div>
      </aside>
    </div>
  );
}

function EventCard({ event: post, onRepost }: { event: any, onRepost: () => void }) {
  const event = post.event;
  if (!event) return null;

  const dateObj = new Date(event.date);
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const dayNum = dateObj.getDate();
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

  return (
    <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative aspect-[4/5] rounded-[32px] overflow-hidden group shadow-2xl border border-white/5"
    >
        {/* Background Image */}
        <img 
            src={event.posterUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80"} 
            className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-110" 
            alt={event.title} 
        />
        
        {/* Overlays ... same as before but using event.* ... */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent opacity-40" />

        {/* Date Badge */}
        <div className="absolute top-6 left-6 z-20">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2 text-center min-w-[60px] shadow-xl">
                <p className="text-[9px] font-black text-white/60 tracking-widest leading-none mb-1">{dayName}</p>
                <p className="text-2xl font-black text-primary-gold leading-none my-1">{dayNum}</p>
                <p className="text-[9px] font-black text-white/60 tracking-widest leading-none mt-1">{monthName}</p>
            </div>
        </div>

        {/* Action Buttons (Top Right) */}
        <div className="absolute top-6 right-6 z-20 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
            <button className="size-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-red-500 transition-colors shadow-lg">
                <Heart size={18} />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); onRepost(); }}
                className="size-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-primary-gold transition-colors shadow-lg"
            >
                <Repeat2 size={18} />
            </button>
            <button className="size-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-primary-gold transition-colors shadow-lg">
                <Share2 size={18} />
            </button>
        </div>

        {/* Content Section */}
        <div className="absolute inset-x-0 bottom-0 p-8 z-20">
            <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-2 mb-3">
                    <div className="size-2 rounded-full bg-primary-gold animate-pulse" />
                    <span className="text-[9px] font-black text-white/60 uppercase tracking-[0.3em]">{event.organizer}</span>
                </div>
                
                <h3 className="text-2xl font-black text-white leading-tight tracking-tight mb-4 group-hover:text-primary-gold transition-colors duration-300">
                    {event.title}
                </h3>

                <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-primary-gold/60" />
                        <span className="text-[11px] font-bold text-white/80">{event.venue}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-2xl font-black text-primary-gold italic tracking-tight gold-glow-sm">
                        {event.price}
                    </p>
                    <Link 
                        href={event.isVerified ? `/events/${event.id}` : (event.externalLink || '#')}
                        onClick={(e: any) => e.stopPropagation()}
                        className="h-10 px-6 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-primary-gold transition-all flex items-center"
                    >
                        {event.isVerified ? "Get Tickets" : "Learn More"}
                    </Link>
                </div>
            </div>
        </div>

        {/* Bottom Interactive Bar */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-primary-gold/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
    </motion.div>
  );
}
