'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Users, Lock, Globe, Shield, 
  ChevronRight, Sparkles, UserCheck,
  AlertTriangle, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import Image from 'next/image';
import LeftSidebar from "@/components/LeftSidebar";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import StatusModal from "@/components/shared/StatusModal";

interface InviteData {
  code: string;
  tribe: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    bio: string | null;
    privacy: string;
  };
  inviter: {
    id: string;
    fullName: string;
    avatar: string | null;
  };
}

export default function TribeInvitePage() {
  const { code } = useParams();
  const router = useRouter();
  const [invite, setInvite] = useState<InviteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Status Modal State
  const [modal, setModal] = useState<{ isOpen: boolean, title: string, message: string, type: 'error' | 'success' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'error'
  });

  useEffect(() => {
    if (code) fetchInvite();
  }, [code]);

  const fetchInvite = async () => {
    setIsLoading(true);
    try {
      const data = await api.get(`/tribes/invite/${code}`);
      setInvite(data);
    } catch (error: any) {
      setError(error.message || "Invalid invite link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!invite) return;
    setIsJoining(true);
    try {
      await api.post(`/tribes/${invite.tribe.id}/join`, {});
      router.push(`/tribes/${invite.tribe.slug}`);
      router.push(`/tribes/${invite.tribe.slug}`);
    } catch (error: any) {
      const message = error.message || "Failed to join tribe.";
      setModal({
        isOpen: true,
        title: 'Access Restricted',
        message: message,
        type: 'error'
      });
      if (message.includes("already a member")) {
        // Option to redirect after modal or just show modal
      }
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-color">
        <Loader2 className="text-primary-gold animate-spin" size={40} />
      </div>
    );
  }

  if (error || !invite) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-color p-6 text-center">
        <AlertTriangle size={64} className="text-red-500 mb-6 opacity-20" />
        <h1 className="text-2xl font-black text-main uppercase tracking-tighter mb-2">Gate Closed</h1>
        <p className="text-sm text-muted-custom font-medium max-w-sm mb-8">{error || "This invite link has expired or is invalid."}</p>
        <button 
          onClick={() => router.push('/tribes')}
          className="h-12 px-10 bg-white/5 border border-custom text-main rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          Explore Tribes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-screen lg:px-6 gap-6">
      <LeftSidebar />

      <main className="flex-1 w-full max-w-2xl mx-auto lg:mx-0 pt-0 lg:pt-20 pb-32 flex flex-col items-center justify-center px-4">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full card-surface p-1 rounded-sm border border-custom relative overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-primary-gold/5 blur-[100px]" />

          <div className="p-8 md:p-12 flex flex-col items-center text-center relative">
            
            {/* Inviter Info */}
            <div className="flex flex-col items-center mb-10">
               <div className="size-16 rounded-sm bg-white/5 border border-custom relative overflow-hidden mb-4 shadow-2xl">
                  {invite.inviter.avatar && <Image src={invite.inviter.avatar} alt="" fill className="object-cover" />}
               </div>
               <p className="text-[10px] font-black text-primary-gold uppercase tracking-[0.3em]">Special Invitation</p>
               <h2 className="text-xl font-bold text-main mt-2">
                 {invite.inviter.fullName} has invited you to join
               </h2>
            </div>

            {/* Tribe Preview Card */}
            <div className="w-full bg-pill-surface border border-custom rounded-sm p-8 mb-10 group hover:border-primary-gold/20 transition-all">
               <div className="size-24 rounded-sm bg-bg-color border border-custom mx-auto mb-6 relative overflow-hidden shadow-xl group-hover:scale-105 transition-transform duration-500">
                  {invite.tribe.logo && <Image src={invite.tribe.logo} alt="" fill className="object-cover" />}
               </div>
               <h3 className="text-2xl font-black text-main uppercase tracking-tight mb-2">{invite.tribe.name}</h3>
               <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-custom uppercase tracking-widest">
                     <Users size={12} className="text-primary-gold" /> Community
                  </div>
                  <div className="w-1 h-1 rounded-full bg-white/10" />
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-custom uppercase tracking-widest">
                     {invite.tribe.privacy === 'PUBLIC' ? <Globe size={12} /> : <Lock size={12} />}
                     {invite.tribe.privacy}
                  </div>
               </div>
               <p className="text-xs text-muted-custom font-medium leading-relaxed max-w-xs mx-auto opacity-80 italic">
                 "{invite.tribe.bio || "No description provided."}"
               </p>
            </div>

            {/* CTA */}
            <div className="w-full space-y-4">
               <button 
                 onClick={handleJoin}
                 disabled={isJoining}
                 className="w-full h-14 bg-primary-gold text-black rounded-sm font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50"
               >
                 {isJoining ? (
                    <Loader2 className="animate-spin" size={20} />
                 ) : (
                    <>Accept Invitation <ChevronRight size={20} strokeWidth={3} /></>
                 )}
               </button>
               <button 
                 onClick={() => router.push('/tribes')}
                 className="w-full h-14 border border-custom text-muted-custom rounded-sm font-bold text-xs uppercase tracking-widest hover:text-main hover:bg-white/5 transition-all"
               >
                 Maybe Later
               </button>
            </div>

            <p className="mt-10 text-[9px] text-muted-custom font-bold uppercase tracking-[0.2em] opacity-40">
               Protected by Kihumba Governance Standard
            </p>
          </div>
        </motion.div>

      </main>

      <BottomNav />

      <StatusModal 
        isOpen={modal.isOpen}
        onClose={() => {
          setModal(p => ({ ...p, isOpen: false }));
          if (modal.message.includes("already a member") && invite) {
            router.push(`/tribes/${invite.tribe.slug}`);
          }
        }}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
}
