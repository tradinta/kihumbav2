"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    Calendar, MapPin, Share2, Heart, ShieldCheck, 
    Ticket, ArrowLeft, ExternalLink, Info, 
    User, CheckCircle2, Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/utils";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

export default function EventDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/posts/${id}`);
                setPost(res);
            } catch (err) {
                console.error("Event not found", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="animate-spin text-primary-gold"><Clock size={32} /></div></div>;
    if (!post || !post.event) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Event not found.</div>;

    const { event } = post;

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <TopBar />
            
            <main className="max-w-4xl mx-auto px-6 pt-24 pb-32">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-muted-custom hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Events</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Left: Visuals */}
                    <div className="lg:col-span-3 space-y-8">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="aspect-[4/5] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl relative"
                        >
                            <img 
                                src={event.posterUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80"} 
                                className="size-full object-cover"
                                alt=""
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        </motion.div>

                        <div className="space-y-4">
                            <h2 className="text-xs font-black text-primary-gold uppercase tracking-[0.3em]">Description</h2>
                            <p className="text-sm text-white/70 leading-relaxed font-medium">
                                {event.description || "No detailed description provided for this event."}
                            </p>
                        </div>
                    </div>

                    {/* Right: Info & CTA */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="space-y-2">
                             {event.isVerified && (
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-primary-gold uppercase tracking-widest bg-primary-gold/10 w-fit px-3 py-1.5 rounded-lg border border-primary-gold/20 mb-4">
                                    <ShieldCheck size={12} /> Verified Kihumba Event
                                </div>
                             )}
                             <h1 className="text-4xl font-black uppercase tracking-tight leading-none mb-2">{event.title}</h1>
                             <div className="flex items-center gap-2 text-muted-custom">
                                <User size={14} className="text-primary-gold" />
                                <span className="text-xs font-bold">Hosted by @{event.organizer}</span>
                             </div>
                        </div>

                        <div className="space-y-6 p-8 rounded-[32px] bg-white/[0.03] border border-white/10 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary-gold">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">When</p>
                                    <p className="text-sm font-bold text-white">{new Date(event.date).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary-gold">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Where</p>
                                    <p className="text-sm font-bold text-white">{event.venue}</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Price</p>
                                        <p className="text-2xl font-black text-primary-gold italic">{event.price}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Status</p>
                                        <p className="text-xs font-bold text-green-500 uppercase tracking-widest">Available</p>
                                    </div>
                                </div>

                                <button className="w-full h-16 rounded-2xl bg-primary-gold text-black font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-gold/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3">
                                    <Ticket size={20} />
                                    Get Tickets Now
                                </button>
                                <p className="text-center text-[9px] text-white/20 mt-4 uppercase font-bold tracking-widest">Secure Payment Powered by Kihumba</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="h-12 rounded-2xl border border-white/10 text-white/60 font-black text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                                <Share2 size={14} /> Share
                            </button>
                            <button className="h-12 rounded-2xl border border-white/10 text-white/60 font-black text-[10px] uppercase tracking-widest hover:text-red-500 hover:bg-red-500/5 transition-all flex items-center justify-center gap-2">
                                <Heart size={14} /> Interested
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
