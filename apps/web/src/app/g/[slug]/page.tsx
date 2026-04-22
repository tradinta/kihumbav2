'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, Shield, Globe, Lock, ArrowRight, 
  Loader2, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '@/components/TopBar';

export default function GroupJoinPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'JOINED' | 'REQUESTED' | 'ALREADY_MEMBER'>('IDLE');

  useEffect(() => {
    if (!slug) return;
    
    const fetchPreview = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/chat/rooms/preview/${slug}`);
        setRoom(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load group invitation');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPreview();
  }, [slug]);

  const handleJoin = async () => {
    if (!user) {
      router.push(`/login?redirect=/g/${slug}`);
      return;
    }

    setJoining(true);
    try {
      const res = await api.post(`/chat/rooms/${room.id}/join`, {});
      if (res.status === 'JOINED') {
        setStatus('JOINED');
        setTimeout(() => router.push(`/messages/${room.id}`), 1500);
      } else if (res.status === 'REQUEST_SENT' || res.status === 'REQUEST_PENDING') {
        setStatus('REQUESTED');
      } else if (res.status === 'ALREADY_MEMBER') {
        setStatus('ALREADY_MEMBER');
        setTimeout(() => router.push(`/messages/${room.id}`), 1000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to join group');
    } finally {
      setJoining(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Loader2 className="size-10 text-primary-gold animate-spin mb-4" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Scanning invitation...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="size-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6 border border-red-500/20">
          <AlertCircle size={40} />
        </div>
        <h1 className="text-2xl font-black text-white mb-2 tracking-tighter">Invitation Invalid</h1>
        <p className="text-zinc-500 text-sm max-w-sm mb-8">{error || "This link might have expired or been revoked by the group admin."}</p>
        <button onClick={() => router.push('/messages')} className="h-12 px-8 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all">
          Go to Messages
        </button>
      </div>
    );
  }

  const isPrivate = room.privacy === 'PRIVATE';

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="shrink-0 pt-2 px-4">
        <TopBar />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          {/* Card */}
          <div className="card-surface rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl relative">
            {/* Glossy Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary-gold/5 to-transparent pointer-events-none" />
            
            {/* Header/Cover */}
            <div className="h-32 bg-zinc-900 relative">
               <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
               <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                 <div className="size-24 rounded-[2rem] bg-zinc-950 border-4 border-black overflow-hidden shadow-xl">
                   {room.avatar ? (
                     <img src={room.avatar} className="w-full h-full object-cover" alt="" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-primary-gold/10 text-primary-gold">
                       <Users size={32} />
                     </div>
                   )}
                 </div>
               </div>
            </div>

            <div className="pt-16 pb-8 px-8 flex flex-col items-center text-center">
               <div className="flex items-center gap-2 mb-2">
                 <h1 className="text-2xl font-black text-white tracking-tighter">{room.name}</h1>
                 {room.isVerified && <Sparkles size={16} className="text-primary-gold" />}
               </div>
               
               <div className="flex items-center gap-4 mb-6">
                 <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                   <Users size={12} className="text-primary-gold" />
                   {room.participantCount} / {room.memberLimit}
                 </div>
                 <div className="w-1 h-1 rounded-full bg-zinc-800" />
                 <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                   {isPrivate ? <Lock size={12} className="text-orange-500" /> : <Globe size={12} className="text-blue-500" />}
                   {isPrivate ? 'Private Group' : 'Public Group'}
                 </div>
               </div>

               {room.description ? (
                 <p className="text-zinc-400 text-sm mb-8 leading-relaxed italic">
                   "{room.description}"
                 </p>
               ) : (
                 <p className="text-zinc-600 text-sm mb-8 italic">
                   This group hasn't shared its mission yet.
                 </p>
               )}

               <div className="w-full space-y-3">
                 <AnimatePresence mode="wait">
                   {status === 'JOINED' || status === 'ALREADY_MEMBER' ? (
                     <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-14 w-full rounded-2xl bg-green-500 text-black font-black uppercase tracking-widest flex items-center justify-center gap-3">
                       <CheckCircle2 size={20} /> Welcome to the group
                     </motion.div>
                   ) : status === 'REQUESTED' ? (
                     <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-14 w-full rounded-2xl bg-primary-gold/10 border border-primary-gold/20 text-primary-gold font-black uppercase tracking-widest flex items-center justify-center gap-3">
                       Request Pending Review
                     </motion.div>
                   ) : (
                     <button 
                       onClick={handleJoin}
                       disabled={joining || room.isFull}
                       className={`h-14 w-full rounded-2xl font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl ${
                         room.isFull 
                           ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                           : 'bg-primary-gold text-black hover:brightness-110 shadow-primary-gold/20'
                       }`}
                     >
                       {joining ? (
                         <Loader2 className="animate-spin" size={20} />
                       ) : (
                         <>
                           {isPrivate ? 'Request Access' : 'Join Group'}
                           <ArrowRight size={20} />
                         </>
                       )}
                     </button>
                   )}
                 </AnimatePresence>

                 {!user && (
                   <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                     Login required to join
                   </p>
                 )}
                 {room.isFull && !joining && (
                   <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
                     <Shield size={10} /> This group is at maximum capacity
                   </p>
                 )}
               </div>
            </div>

            {/* Admin Notice */}
            <div className="p-4 bg-zinc-950/50 border-t border-white/5 flex items-center justify-center gap-2">
              <Shield size={12} className="text-primary-gold" />
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Identity verification strictly enforced</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
