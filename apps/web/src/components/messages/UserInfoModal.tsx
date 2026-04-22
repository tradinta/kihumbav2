'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  X, ShieldCheck, Image as ImageIcon, 
  Link as LinkIcon, FileText, Info,
  MessageSquare, Download, ExternalLink,
  Ghost, Copy, Check, Calendar, User,
  Heart, Share2, Shield, MoreVertical
} from 'lucide-react';
import UserIdentity from '@/components/shared/UserIdentity';
import type { Chat, Message } from '@/data/chatData';

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  chat: Chat;
  messages: Message[];
}

type TabType = 'overview' | 'media' | 'links' | 'files';

export default function UserInfoModal({ isOpen, onClose, chat, messages }: UserInfoModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [copied, setCopied] = useState(false);

  const media = useMemo(() => messages.filter(m => m.type === 'IMAGE' || m.type === 'VIDEO'), [messages]);
  const files = useMemo(() => messages.filter(m => m.type === 'FILE'), [messages]);
  const links = useMemo(() => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return messages.filter(m => m.type === 'TEXT' && m.content.match(urlRegex));
  }, [messages]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(chat.id?.toString() || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoToProfile = () => {
    if (chat.username) {
      router.push(`/profile/${chat.username}`);
      onClose();
    }
  };

  const tabs: { id: TabType, label: string, icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'links', label: 'Links', icon: LinkIcon },
    { id: 'files', label: 'Files', icon: FileText },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="w-full max-w-lg h-[75vh] card-surface border border-custom overflow-hidden flex flex-col relative z-10"
        >
          {/* Cover Area */}
          <div className="relative h-40 shrink-0 bg-page overflow-hidden">
             <div className="w-full h-full bg-gradient-to-br from-primary-gold/10 to-transparent flex items-center justify-center">
                <Ghost size={60} className="text-primary-gold/5" />
             </div>

             <button onClick={onClose} className="absolute top-4 right-4 size-10 rounded-[var(--radius-main)] bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all z-20">
                <X size={20} />
             </button>

             <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-[var(--card-bg)] to-transparent flex items-end gap-5">
                <UserIdentity 
                  user={{
                    ...chat,
                    id: chat.id?.toString(),
                    username: chat.username || chat.name,
                    fullName: chat.name,
                    avatar: chat.avatar,
                    subscriptionTier: (chat as any).subscriptionTier || (chat.isPremium ? 'PLUS' : 'FREE'),
                    accountType: chat.isAnon ? 'NORMAL' : 'NORMAL',
                    isVerified: chat.isPremium || (chat as any).isVerified
                  } as any}
                  size="lg"
                  hideHandle
                  isLink={false}
                  className="[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-main [&_p]:text-primary-gold [&_p]:font-bold [&_p]:text-[10px]"
                />
             </div>
          </div>

          {/* Navigation */}
          <div className="flex border-b border-custom px-2 bg-page/50 backdrop-blur-xl sticky top-0 z-10">
             {tabs.map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all relative ${
                   activeTab === tab.id ? 'text-primary-gold' : 'text-muted-custom hover:text-main'
                 }`}
               >
                 <tab.icon size={16} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                 <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
                 {activeTab === tab.id && (
                   <motion.div layoutId="user-info-tab" className="absolute bottom-0 inset-x-4 h-0.5 bg-primary-gold rounded-full" />
                 )}
               </button>
             ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-6 bg-page/30">
             {activeTab === 'overview' && (
               <div className="space-y-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                     <div className="p-4 rounded-[var(--radius-main)] pill-surface border border-custom space-y-1">
                        <p className="text-[8px] font-black text-muted-custom uppercase tracking-tighter">Joined</p>
                        <div className="flex items-center gap-2 text-main">
                           <Calendar size={14} className="text-primary-gold" />
                           <span className="text-[11px] font-bold">Oct 2023</span>
                        </div>
                     </div>
                     <div className="p-4 rounded-[var(--radius-main)] pill-surface border border-custom space-y-1">
                        <p className="text-[8px] font-black text-muted-custom uppercase tracking-tighter">Media</p>
                        <div className="flex items-center gap-2 text-main">
                           <ImageIcon size={14} className="text-primary-gold" />
                           <span className="text-[11px] font-bold">{media.length} items</span>
                        </div>
                     </div>
                  </div>

                  {/* About */}
                  {chat.description && (
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-muted-custom uppercase tracking-widest">Bio</p>
                       <p className="text-xs font-bold text-main leading-relaxed">
                          {chat.description}
                       </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-3 pt-4 border-t border-custom">
                     <button 
                       onClick={handleGoToProfile}
                       className="w-full h-11 rounded-[var(--radius-main)] bg-primary-gold text-black text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary-gold/10"
                     >
                        <User size={14} /> Full Profile
                     </button>
                     <button className="w-full h-11 rounded-[var(--radius-main)] pill-surface border border-custom text-main text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-page transition-all">
                        <Share2 size={14} /> Share Profile
                     </button>
                  </div>
               </div>
             )}

             {activeTab === 'media' && (
               <div className="grid grid-cols-3 gap-2">
                  {media.length > 0 ? media.map(m => (
                    <div key={m.id} className="aspect-square rounded-[var(--radius-main)] bg-page border border-custom overflow-hidden group relative cursor-pointer">
                       <img src={m.metadata?.mediaUrl || m.content} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  )) : (
                    <div className="col-span-3 py-12 flex flex-col items-center justify-center opacity-30">
                       <ImageIcon size={32} className="mb-2" />
                       <p className="text-[10px] font-bold uppercase tracking-widest">No shared media</p>
                    </div>
                  )}
               </div>
             )}

             {activeTab === 'links' && (
               <div className="space-y-2">
                  {links.length > 0 ? links.map(m => (
                    <div key={m.id} className="p-3 rounded-[var(--radius-main)] pill-surface border border-custom flex items-center gap-3 group">
                       <div className="size-8 rounded-[var(--radius-main)] bg-primary-gold/10 border border-primary-gold/20 flex items-center justify-center text-primary-gold shrink-0">
                          <LinkIcon size={14} />
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-main truncate tracking-tight">{m.content}</p>
                       </div>
                       <ExternalLink size={12} className="text-muted-custom opacity-0 group-hover:opacity-100" />
                    </div>
                  )) : (
                    <div className="py-12 flex flex-col items-center justify-center opacity-30">
                       <LinkIcon size={32} className="mb-2" />
                       <p className="text-[10px] font-bold uppercase tracking-widest">No shared links</p>
                    </div>
                  )}
               </div>
             )}

             {activeTab === 'files' && (
               <div className="space-y-2">
                  {files.length > 0 ? files.map(m => (
                    <div key={m.id} className="p-3 rounded-[var(--radius-main)] pill-surface border border-custom flex items-center gap-3 group">
                       <div className="size-8 rounded-[var(--radius-main)] bg-page border border-custom flex items-center justify-center text-main shrink-0">
                          <FileText size={14} />
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-main truncate tracking-tight">{m.metadata?.fileName || m.content}</p>
                       </div>
                       <Download size={14} className="text-muted-custom opacity-0 group-hover:opacity-100" />
                    </div>
                  )) : (
                    <div className="py-12 flex flex-col items-center justify-center opacity-30">
                       <FileText size={32} className="mb-2" />
                       <p className="text-[10px] font-bold uppercase tracking-widest">No shared files</p>
                    </div>
                  )}
               </div>
             )}
          </div>
          
          <div className="p-4 border-t border-custom bg-page/50 backdrop-blur-xl shrink-0 flex items-center justify-between">
             <div className="flex flex-col cursor-pointer" onClick={handleCopyId}>
                <p className="text-[7px] font-black text-muted-custom uppercase tracking-[0.2em]">Kihumba ID</p>
                <div className="flex items-center gap-1">
                   <p className="text-[10px] font-black text-primary-gold/60">{chat.id}</p>
                   {copied ? <Check size={8} className="text-green-500" /> : <Copy size={8} className="text-primary-gold/30" />}
                </div>
             </div>
             <button onClick={onClose} className="px-6 py-2 bg-page border border-custom rounded-[var(--radius-main)] text-[9px] font-black uppercase tracking-widest text-main hover:bg-white/5 transition-all">Close</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
