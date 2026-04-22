"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Users, Search, Plus, TrendingUp, Shield, 
  MapPin, MessageSquare, ChevronRight, Filter,
  Bell, Star, Zap, LayoutGrid, List, MoreHorizontal,
  ArrowUpRight, Heart, Share2, Award, Clock, Sparkles,
  School, Map, Fingerprint, Rocket
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import LeftSidebar from '@/components/LeftSidebar';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import AdSidebar from "@/components/AdSidebar";

interface Tribe {
  id: string;
  internalId: string;
  name: string;
  slug: string;
  bio: string;
  category: string;
  logo: string | null;
  cover: string | null;
  privacy: string;
  _count: {
    members: number;
  };
}

export default function TribesPage() {
  const [tribes, setTribes] = useState<Tribe[]>([]);
  const [suggestedTribes, setSuggestedTribes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTribes();
    fetchSuggestions();
  }, []);

  const fetchTribes = async () => {
    setIsLoading(true);
    try {
      const data = await api.get('/tribes');
      setTribes(data);
    } catch (error) {
      console.error("Failed to fetch tribes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const data = await api.get('/tribes/suggested');
      setSuggestedTribes(data);
    } catch (error) {
      console.error("Failed to fetch suggested tribes:", error);
    }
  };

  const filteredTribes = tribes.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-6xl mx-auto lg:mx-0 pt-0 lg:pt-4 pb-32 lg:pb-12">
        <TopBar />
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 px-4 py-8 border-b border-custom">
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-sm bg-primary-gold/10 flex items-center justify-center border border-primary-gold/20 shadow-[0_0_20px_rgba(255,184,0,0.05)]">
               <Users className="text-primary-gold" size={32} />
            </div>
            <div>
               <h1 className="text-2xl font-bold tracking-tight gold-glow uppercase">The Tribes</h1>
               <p className="text-[10px] text-muted-custom font-bold uppercase tracking-widest mt-1">Industrial discovery of shared passion and purpose.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group min-w-[200px] md:min-w-[300px]">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-custom group-focus-within:text-primary-gold transition-colors">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Find a hub..." 
                className="w-full h-12 pill-surface rounded-sm border border-custom focus:border-primary-gold/40 focus:outline-none transition-all text-xs font-bold uppercase tracking-wider pl-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link href="/tribes/create">
              <button className="h-12 px-6 bg-primary-gold text-black rounded-sm font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-primary-gold/20">
                <Plus size={18} strokeWidth={3} />
                Create
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 px-4">
          
          <div className="space-y-12">

            {/* RECOMMENDED HUBS */}
            {suggestedTribes.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-8">
                  <Sparkles className="text-primary-gold" size={16} />
                  <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-main">Recommended for You</h2>
                </div>

                <div className="flex overflow-x-auto pb-4 gap-6 no-scrollbar">
                  {suggestedTribes.map(tribe => (
                    <Link 
                      key={tribe.id} 
                      href={`/tribes/${tribe.slug}`} 
                      className="min-w-[280px] h-40 rounded-sm overflow-hidden border border-primary-gold/10 card-surface relative group shrink-0"
                    >
                      <Image 
                        src={tribe.cover || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"} 
                        alt={tribe.name} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-30" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                      
                      <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                        <div className="size-10 rounded-sm bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center relative overflow-hidden shrink-0 shadow-lg">
                           {tribe.logo && (tribe.logo.startsWith('http') || tribe.logo.startsWith('/')) ? (
                             <img src={tribe.logo} className="size-full object-cover" alt="" />
                           ) : (
                             <span className="text-xl">{tribe.logo || '🌍'}</span>
                           )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold tracking-tight text-white mb-0.5 group-hover:text-primary-gold transition-colors truncate">{tribe.name}</h3>
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-1.5">
                              {tribe.friendAvatars.map((av: string, idx: number) => (
                                <div key={idx} className="size-4 rounded-full border border-black overflow-hidden bg-pill-surface">
                                  <img src={av || '/branding/avatar-fallback.png'} className="size-full object-cover" />
                                </div>
                              ))}
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-widest text-primary-gold whitespace-nowrap">
                              {tribe.friendCount} {tribe.friendCount === 1 ? 'friend' : 'friends'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
            
            {/* ACTIVE HUBS (Live Data) */}
            <section>
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-2">
                    <Rocket className="text-primary-gold" size={16} />
                    <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-main">Active Communities</h2>
                 </div>
                 <div className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">
                    {isLoading ? "Fetching Hubs..." : `${filteredTribes.length} Hubs Online`}
                 </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="h-48 rounded-sm bg-white/5 animate-pulse border border-custom" />
                   ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredTribes.map(tribe => (
                    <Link key={tribe.id} href={`/tribes/${tribe.slug}`} className="group relative block h-48 rounded-sm overflow-hidden border border-custom card-surface">
                      <Image 
                        src={tribe.cover || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"} 
                        alt={tribe.name} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-40 group-hover:opacity-60" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      
                      <div className="absolute top-4 right-4">
                         <div className="px-2 py-1 rounded-sm bg-black/40 backdrop-blur-md border border-white/10">
                            <span className="text-[8px] font-black uppercase tracking-widest text-primary-gold">{tribe.privacy}</span>
                         </div>
                      </div>

                      <div className="absolute bottom-6 left-6 right-6">
                         <div className="flex items-center gap-4 mb-3">
                            <div className="size-12 rounded-sm bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform shadow-xl">
                               {tribe.logo && (tribe.logo.startsWith('http') || tribe.logo.startsWith('/')) ? (
                                 <img src={tribe.logo} className="size-full object-cover" alt="" />
                               ) : (
                                 <span className="text-2xl">{tribe.logo || '🌍'}</span>
                               )}
                            </div>
                            <div>
                               <h3 className="text-lg font-bold tracking-tight text-white mb-0.5 group-hover:text-primary-gold transition-colors">{tribe.name}</h3>
                               <p className="text-[9px] text-muted-custom font-bold uppercase tracking-widest flex items-center gap-2">
                                  <Users size={10} className="text-primary-gold" /> {tribe._count?.members || 0} Members
                               </p>
                            </div>
                         </div>
                      </div>
                    </Link>
                  ))}
                  
                  {filteredTribes.length === 0 && (
                    <div className="col-span-2 py-20 text-center border border-dashed border-custom rounded-sm">
                       <Search size={32} className="text-muted-custom opacity-20 mx-auto mb-4" />
                       <h3 className="text-xs font-bold uppercase tracking-widest text-muted-custom">No Hubs Found</h3>
                       <p className="text-[9px] text-muted-custom font-medium mt-1">Try a different keyword or create your own hub.</p>
                    </div>
                  )}
                </div>
              )}
            </section>

          </div>

          <aside className="space-y-8 sticky-sidebar">
            <AdSidebar type="GENERAL" />
            
            {/* PLATFORM MISSION */}
            <div className="card-surface p-6 rounded-sm border border-custom">
               <div className="flex items-center gap-2 mb-6">
                  <Shield className="text-primary-gold" size={16} />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-main">Hub Governance</h3>
               </div>
               <p className="text-[10px] text-muted-custom font-medium leading-relaxed mb-6">
                  Kihumba Tribes are defined by shared purpose and passion. We strictly enforce a literal definition of community to prevent sectarian division.
               </p>
               <Link href="/tribes/create" className="w-full">
                 <button className="w-full h-11 bg-primary-gold/10 text-primary-gold border border-primary-gold/20 rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-primary-gold hover:text-black transition-all">Start a Tribe</button>
               </Link>
            </div>
          </aside>

        </div>
      </main>
      <BottomNav />
    </div>
  );
}
