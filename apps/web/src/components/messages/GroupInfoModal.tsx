'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Users, ShieldCheck, Image as ImageIcon, 
  Link as LinkIcon, FileText, Info, Calendar,
  Shield, UserCheck, MessageSquare, Download,
  ExternalLink, Ghost, Copy, Check, Edit2, 
  Camera, Trash2, UserMinus, UserPlus, ShieldAlert,
  Loader2, RotateCcw, LogOut, Clock
} from 'lucide-react';
import UserIdentity from '@/components/shared/UserIdentity';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useSnackbar } from '@/context/SnackbarContext';
import { useUploads } from '@/context/UploadContext';
import type { Chat, Message, GroupMember } from '@/data/chatData';

interface GroupInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  chat: Chat;
  messages: Message[];
}

type TabType = 'overview' | 'members' | 'media' | 'links' | 'files';

export default function GroupInfoModal({ isOpen, onClose, chat, messages }: GroupInfoModalProps) {
  const { user: currentUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { enlistImage } = useUploads();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: chat.name,
    description: chat.description || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState<'avatar' | 'cover' | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadType, setUploadType] = useState<'avatar' | 'cover'>('avatar');

  // ─── Data Fetching ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      const fetchMembers = async () => {
        try {
          const data = await api.get(`/chat/rooms/${chat.id}/participants`);
          setMembers(data);
        } catch (err) {
          console.error('Failed to fetch members', err);
        }
      };
      fetchMembers();
    }
  }, [isOpen, chat.id]);

  // ─── Data Extraction ────────────────────────────────────────────────────────
  const media = useMemo(() => messages.filter(m => m.type === 'IMAGE' || m.type === 'VIDEO'), [messages]);
  const files = useMemo(() => messages.filter(m => m.type === 'FILE'), [messages]);
  const links = useMemo(() => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return messages.filter(m => m.type === 'TEXT' && m.content.match(urlRegex));
  }, [messages]);

  // Admin Logic
  const myMember = useMemo(() => 
    (members || []).find(m => m.id === currentUser?.id), 
    [members, currentUser]
  );
  const myRole = myMember?.role || 'MEMBER';
  const isAdmin = myRole === 'OWNER' || myRole === 'ADMIN';
  const isMod = myRole === 'MODERATOR' || isAdmin;
  const isOwner = myRole === 'OWNER';

  const handleUpdateGroup = async () => {
    if (!isAdmin) return;
    setIsSaving(true);
    try {
      await api.patch(`/chat/rooms/${chat.id}`, editData);
      showSnackbar('Group settings updated', 'success');
      setIsEditing(false);
    } catch (err) {
      showSnackbar('Update failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMemberAction = async (memberId: string, action: 'PROMOTE' | 'MODERATE' | 'DEMOTE' | 'KICK' | 'BAN') => {
    if (!isMod) return;
    try {
      if (action === 'KICK') {
        await api.delete(`/chat/rooms/${chat.id}/participants/${memberId}`);
        showSnackbar('Member removed', 'info');
      } else if (action === 'PROMOTE') {
        await api.patch(`/chat/rooms/${chat.id}/participants/${memberId}`, { role: 'ADMIN' });
        showSnackbar('Promoted to Admin', 'success');
      } else if (action === 'MODERATE') {
        await api.patch(`/chat/rooms/${chat.id}/participants/${memberId}`, { role: 'MODERATOR' });
        showSnackbar('Promoted to Moderator', 'success');
      } else if (action === 'DEMOTE') {
        await api.patch(`/chat/rooms/${chat.id}/participants/${memberId}`, { role: 'MEMBER' });
        showSnackbar('Privileges removed', 'info');
      }
      
      const data = await api.get(`/chat/rooms/${chat.id}/participants`);
      setMembers(data);
    } catch (err) {
      showSnackbar('Action failed', 'error');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isAdmin) return;

    setIsUploading(uploadType);
    try {
      const result = await enlistImage(file, 'fires');
      await api.patch(`/chat/rooms/${chat.id}`, { [uploadType]: result.publicUrl });
      showSnackbar(`${uploadType === 'avatar' ? 'Profile photo' : 'Cover photo'} updated`, 'success');
      
      // Update local state if it's name/desc, for photos we'd need to refresh the chat object
      // which is handled by the parent, but we can show success.
    } catch (err) {
      showSnackbar('Upload failed', 'error');
    } finally {
      setIsUploading(null);
    }
  };

  const triggerUpload = (type: 'avatar' | 'cover') => {
    setUploadType(type);
    fileInputRef.current?.click();
  };

  const [isRotating, setIsRotating] = useState(false);
  const [currentSlug, setCurrentSlug] = useState(chat.slug || chat.id);

  const handleRotateLink = async () => {
    if (!isAdmin) return;
    setIsRotating(true);
    try {
      const result = await api.post(`/chat/rooms/${chat.id}/rotate-link`, {});
      setCurrentSlug(result.slug);
      showSnackbar('Group link rotated', 'success');
    } catch (err) {
      showSnackbar('Rotation failed', 'error');
    } finally {
      setIsRotating(false);
    }
  };

  const handleCopyLink = () => {
    const link = `https://kihumba.com/g/${currentSlug}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [joinRequests, setJoinRequests] = useState<any[]>([]);
  const [memberTab, setMemberTab] = useState<'LIST' | 'REQUESTS'>('LIST');

  useEffect(() => {
    if (activeTab === 'members' && memberTab === 'REQUESTS' && isAdmin) {
      fetchJoinRequests();
    }
  }, [activeTab, memberTab]);

  const fetchJoinRequests = async () => {
    try {
      const res = await api.get(`/chat/rooms/${chat.id}/requests`);
      setJoinRequests(res);
    } catch (err) {
      console.error('Failed to fetch join requests', err);
    }
  };

  const handleResolveRequest = async (requestId: string, status: 'ACCEPTED' | 'REJECTED') => {
    try {
      await api.post(`/chat/rooms/${chat.id}/requests/${requestId}/resolve`, { status });
      setJoinRequests(prev => prev.filter(r => r.id !== requestId));
      showSnackbar(`Request ${status.toLowerCase()}`, 'success');
      // Refresh room list if needed? Usually Better Auth or our state management handles this.
    } catch (err) {
      showSnackbar('Action failed', 'error');
    }
  };

  const handleLeaveGroup = async () => {
    if (!confirm('Are you sure you want to leave this group?')) return;
    try {
      await api.post(`/chat/rooms/${chat.id}/leave`, {});
      showSnackbar('You left the group', 'success');
      onClose();
      // Redirect to messages or refresh?
      window.location.href = '/messages';
    } catch (err: any) {
      showSnackbar(err.response?.data?.message || 'Failed to leave group', 'error');
    }
  };

  const tabs: { id: TabType, label: string, icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'members', label: 'Members', icon: Users },
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
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 font-inter"
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="w-full max-w-2xl h-[80vh] bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-10 font-inter"
        >
          {/* Header & Cover */}
          <div className="relative h-48 shrink-0 bg-zinc-900 overflow-hidden">
             {chat.metadata?.cover ? (
               <img src={chat.metadata.cover} className="w-full h-full object-cover opacity-60" />
             ) : (
               <div className="w-full h-full bg-gradient-to-br from-primary-gold/10 to-transparent flex items-center justify-center">
                  <Ghost size={80} className="text-primary-gold/5" />
               </div>
             )}
             
             {isAdmin && (
               <button 
                onClick={() => triggerUpload('cover')}
                disabled={!!isUploading}
                className="absolute top-4 left-4 size-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all z-20 disabled:opacity-50"
              >
                  {isUploading === 'cover' ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
               </button>
             )}

             <button onClick={onClose} className="absolute top-4 right-4 size-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all z-20">
                <X size={20} />
             </button>

             <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-zinc-950 to-transparent flex items-end gap-5">
                <div className="size-20 rounded-2xl bg-zinc-950 border-4 border-zinc-950 shadow-2xl overflow-hidden shrink-0 relative group">
                   {chat.avatar ? (
                     <img src={chat.avatar} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full bg-primary-gold flex items-center justify-center text-black font-bold text-2xl">
                        {chat.name.charAt(0).toUpperCase()}
                     </div>
                   )}
                   {isAdmin && (
                     <div 
                      onClick={() => triggerUpload('avatar')}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                    >
                        {isUploading === 'avatar' ? <Loader2 size={20} className="animate-spin text-white" /> : <Camera size={20} className="text-white" />}
                     </div>
                   )}
                </div>
                <div className="flex-1 min-w-0 pb-1">
                   <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-white truncate tracking-tight">{chat.name}</h2>
                      {isAdmin && (
                        <button onClick={() => setIsEditing(true)} className="p-1 text-primary-gold/60 hover:text-primary-gold transition-colors">
                           <Edit2 size={16} />
                        </button>
                      )}
                   </div>
                   <p className="text-sm font-medium text-primary-gold/80 flex items-center gap-2 mt-0.5">
                      {chat.metadata?.privacy === 'PRIVATE' ? <ShieldCheck size={14} /> : <Users size={14} />}
                      {chat.metadata?.privacy || 'Public'} Group • {members.length || chat.members || 0} members
                   </p>
                </div>
             </div>

             <input 
               type="file" 
               ref={fileInputRef} 
               className="hidden" 
               accept="image/*" 
               onChange={handleFileSelect} 
             />
          </div>

          {/* Navigation */}
          <div className="flex border-b border-white/5 px-2 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-10">
             {tabs.map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex-1 flex flex-col items-center gap-1.5 py-4 transition-all relative ${
                   activeTab === tab.id ? 'text-primary-gold' : 'text-zinc-500 hover:text-zinc-300'
                 }`}
               >
                 <tab.icon size={18} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                 <span className="text-[11px] font-semibold">{tab.label}</span>
                 {activeTab === tab.id && (
                   <motion.div layoutId="info-tab" className="absolute bottom-0 inset-x-4 h-0.5 bg-primary-gold rounded-full" />
                 )}
               </button>
             ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
             {isOpen && members.length === 0 && activeTab === 'members' ? (
               <div className="h-full flex flex-col items-center justify-center gap-4 opacity-40">
                  <Loader2 size={32} className="animate-spin text-primary-gold" />
                  <p className="text-xs font-medium tracking-wide">Fetching members...</p>
               </div>
             ) : (
               <>
                 {activeTab === 'overview' && (
                   <div className="space-y-8">
                      {/* Description */}
                      <div className="space-y-3">
                         <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-zinc-500">About this group</p>
                            {isAdmin && !isEditing && (
                              <button onClick={() => setIsEditing(true)} className="text-xs font-bold text-primary-gold hover:underline">Edit</button>
                            )}
                         </div>
                         {isEditing ? (
                           <div className="space-y-4">
                              <textarea 
                                value={editData.description}
                                onChange={(e) => setEditData({...editData, description: e.target.value})}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-sm font-medium text-white outline-none focus:border-primary-gold/40 transition-all h-32"
                                placeholder="What is this group about?"
                              />
                              <div className="flex justify-end gap-3">
                                 <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-xs font-bold text-zinc-500">Cancel</button>
                                 <button 
                                   onClick={handleUpdateGroup}
                                   disabled={isSaving}
                                   className="px-6 py-2 bg-primary-gold text-black rounded-xl text-xs font-bold hover:brightness-110 disabled:opacity-50 flex items-center gap-2 transition-all shadow-lg shadow-primary-gold/10"
                                 >
                                   {isSaving && <Loader2 size={14} className="animate-spin" />}
                                   Save Changes
                                 </button>
                              </div>
                           </div>
                         ) : (
                           <p className="text-sm font-medium text-zinc-300 leading-relaxed whitespace-pre-wrap">
                              {chat.description || "No description provided."}
                           </p>
                         )}
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase">Established</p>
                            <div className="flex items-center gap-2 text-white">
                               <Calendar size={16} className="text-primary-gold" />
                               <span className="text-xs font-semibold">October 24, 2023</span>
                            </div>
                         </div>
                         <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase">Privacy</p>
                            <div className="flex items-center gap-2 text-white">
                               <Shield size={16} className="text-primary-gold" />
                               <span className="text-xs font-semibold">{chat.metadata?.privacy === 'PRIVATE' ? 'Invite Only' : 'Anyone can join'}</span>
                            </div>
                         </div>
                      </div>

                      {/* Invite Link */}
                      <div className="space-y-3">
                         <p className="text-xs font-semibold text-zinc-500">Group Invite Link</p>
                         <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary-gold/5 border border-primary-gold/10 group">
                            <p className="text-xs font-medium text-primary-gold flex-1 truncate">https://kihumba.com/g/{currentSlug}</p>
                            
                            {isAdmin && (
                              <button 
                                onClick={handleRotateLink}
                                disabled={isRotating}
                                className="size-9 rounded-xl bg-white/5 text-primary-gold flex items-center justify-center hover:bg-primary-gold/10 transition-all disabled:opacity-50"
                                title="Rotate Link"
                              >
                                <RotateCcw size={16} className={isRotating ? 'animate-spin' : ''} />
                              </button>
                            )}

                            <button 
                              onClick={handleCopyLink}
                              className="size-9 rounded-xl bg-primary-gold text-black flex items-center justify-center hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-primary-gold/20"
                            >
                              {copied ? <Check size={16} /> : <Copy size={16} />}
                            </button>
                         </div>
                      </div>

                      {/* Leave Group */}
                      {!isOwner && (
                        <div className="pt-4 border-t border-white/5">
                            <button 
                              onClick={handleLeaveGroup}
                              className="w-full h-12 rounded-2xl bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all border border-red-500/10"
                            >
                              <LogOut size={14} /> Leave Group
                            </button>
                        </div>
                      )}
                   </div>
                 )}

                  {activeTab === 'members' && (
                    <div className="space-y-6">
                       <div className="flex items-center justify-between px-1">
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => setMemberTab('LIST')}
                              className={`text-xs font-bold uppercase tracking-widest transition-all ${memberTab === 'LIST' ? 'text-primary-gold' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                              Members ({members.length})
                            </button>
                            {isAdmin && chat.metadata?.privacy === 'PRIVATE' && (
                              <button 
                                onClick={() => setMemberTab('REQUESTS')}
                                className={`text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${memberTab === 'REQUESTS' ? 'text-primary-gold' : 'text-zinc-500 hover:text-zinc-300'}`}
                              >
                                Requests {joinRequests.length > 0 && <span className="px-1.5 py-0.5 rounded-full bg-primary-gold text-black text-[8px]">{joinRequests.length}</span>}
                              </button>
                            )}
                          </div>
                          {isMod && memberTab === 'LIST' && <button className="text-xs font-bold text-primary-gold hover:underline">Manage all</button>}
                       </div>

                       {memberTab === 'LIST' ? (
                         <div className="grid grid-cols-1 gap-2">
                            {members.map(member => (
                              <div key={member.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                                 <div className="flex items-center gap-4 min-w-0 flex-1">
                                    <UserIdentity 
                                      user={{
                                         id: member.id,
                                         username: member.username || member.name,
                                         fullName: member.name,
                                         avatar: member.avatar,
                                         subscriptionTier: member.subscriptionTier,
                                         accountType: member.accountType,
                                         isVerified: member.isVerified
                                       } as any}
                                      size="md"
                                      isLink={false}
                                    />
                                 </div>
                                 
                                 <div className="flex items-center gap-3 shrink-0">
                                    {member.role && (
                                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tight ${
                                        member.role === 'OWNER' ? 'bg-primary-gold text-black' :
                                        member.role === 'ADMIN' ? 'bg-zinc-800 text-primary-gold border border-primary-gold/20' :
                                        'bg-white/5 text-zinc-400'
                                      }`}>
                                        {member.role.charAt(0) + member.role.slice(1).toLowerCase()}
                                      </span>
                                    )}

                                    {isAdmin && member.id !== currentUser?.id && (
                                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                                         <button 
                                           onClick={() => handleMemberAction(member.id, member.role === 'ADMIN' ? 'DEMOTE' : 'PROMOTE')}
                                           className="size-8 rounded-xl bg-white/5 flex items-center justify-center text-primary-gold hover:bg-primary-gold/10 transition-all"
                                           title={member.role === 'ADMIN' ? "Remove Admin" : "Make Admin"}
                                         >
                                           <ShieldAlert size={16} />
                                         </button>
                                         <button 
                                           onClick={() => handleMemberAction(member.id, member.role === 'MODERATOR' ? 'DEMOTE' : 'MODERATE')}
                                           className="size-8 rounded-xl bg-white/5 flex items-center justify-center text-blue-400 hover:bg-blue-400/10 transition-all"
                                           title={member.role === 'MODERATOR' ? "Remove Moderator" : "Make Moderator"}
                                         >
                                           <UserCheck size={16} />
                                         </button>
                                         <button 
                                           onClick={() => handleMemberAction(member.id, 'KICK')}
                                           className="size-8 rounded-xl bg-white/5 flex items-center justify-center text-red-400 hover:bg-red-400/10 transition-all"
                                           title="Remove from group"
                                         >
                                           <UserMinus size={16} />
                                         </button>
                                      </div>
                                    )}

                                    <button className="size-9 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all">
                                       <MessageSquare size={16} />
                                    </button>
                                 </div>
                              </div>
                            ))}
                         </div>
                       ) : (
                         <div className="grid grid-cols-1 gap-2">
                           {joinRequests.length === 0 ? (
                             <div className="py-12 flex flex-col items-center justify-center text-center">
                               <Clock className="size-10 text-zinc-800 mb-4" />
                               <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">No pending requests</p>
                             </div>
                           ) : (
                             joinRequests.map(req => (
                               <div key={req.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                                 <div className="flex items-center gap-4 min-w-0 flex-1">
                                    <UserIdentity 
                                      user={req.user}
                                      size="md"
                                      isLink={false}
                                    />
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <button 
                                      onClick={() => handleResolveRequest(req.id, 'REJECTED')}
                                      className="px-4 py-2 rounded-xl bg-white/5 text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-400 transition-all"
                                    >
                                      Reject
                                    </button>
                                    <button 
                                      onClick={() => handleResolveRequest(req.id, 'ACCEPTED')}
                                      className="px-4 py-2 rounded-xl bg-primary-gold text-black text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-primary-gold/10"
                                    >
                                      Accept
                                    </button>
                                 </div>
                               </div>
                             ))
                           )}
                         </div>
                       )}
                    </div>
                  )}

                 {activeTab === 'media' && (
                   <div className="grid grid-cols-3 gap-3">
                      {media.length > 0 ? media.map(m => (
                        <div key={m.id} className="aspect-square rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden group relative cursor-pointer shadow-lg">
                           <img 
                            src={m.metadata?.mediaUrl || m.mediaUrl || m.content} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                           />
                           {m.type === 'VIDEO' && (
                             <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="size-10 rounded-full bg-primary-gold/30 backdrop-blur-md flex items-center justify-center text-primary-gold">
                                   <ImageIcon size={20} />
                                </motion.div>
                             </div>
                           )}
                        </div>
                      )) : (
                        <div className="col-span-3 py-24 flex flex-col items-center justify-center opacity-30">
                           <ImageIcon size={48} className="mb-4 text-zinc-500" />
                           <p className="text-xs font-semibold tracking-wide">No shared photos or videos</p>
                        </div>
                      )}
                   </div>
                 )}

                 {activeTab === 'links' && (
                   <div className="space-y-3">
                      {links.length > 0 ? links.map(m => (
                        <div key={m.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex items-center gap-4 group">
                           <div className="size-11 rounded-2xl bg-primary-gold/10 border border-primary-gold/20 flex items-center justify-center text-primary-gold shrink-0">
                              <LinkIcon size={20} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white truncate tracking-tight">{m.content.match(/(https?:\/\/[^\s]+)/)?.[0]}</p>
                              <p className="text-[11px] font-medium text-zinc-500 mt-0.5">Shared by {m.senderName || 'Member'} • {m.time}</p>
                           </div>
                           <button className="size-10 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500 hover:text-primary-gold hover:bg-primary-gold/10 transition-all">
                              <ExternalLink size={18} />
                           </button>
                        </div>
                      )) : (
                        <div className="py-24 flex flex-col items-center justify-center opacity-30">
                           <LinkIcon size={48} className="mb-4 text-zinc-500" />
                           <p className="text-xs font-semibold tracking-wide">No shared links found</p>
                        </div>
                      )}
                   </div>
                 )}

                 {activeTab === 'files' && (
                   <div className="space-y-3">
                      {files.length > 0 ? files.map(m => (
                        <div key={m.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex items-center gap-4 group">
                           <div className="size-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                              <FileText size={20} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white truncate tracking-tight">{m.metadata?.fileName || m.content}</p>
                              <p className="text-[11px] font-medium text-zinc-500 mt-0.5">{(m.metadata?.fileSize / 1024).toFixed(1)} KB • {m.time}</p>
                           </div>
                           <button className="size-10 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all">
                              <Download size={18} />
                           </button>
                        </div>
                      )) : (
                        <div className="py-24 flex flex-col items-center justify-center opacity-30">
                           <FileText size={48} className="mb-4 text-zinc-500" />
                           <p className="text-xs font-semibold tracking-wide">No documents shared here</p>
                        </div>
                      )}
                   </div>
                 )}
               </>
             )}
          </div>
          
          <div className="p-6 border-t border-white/5 bg-zinc-950/50 backdrop-blur-xl shrink-0 flex items-center justify-between">
             <div className="flex flex-col">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Channel ID</p>
                <p className="text-xs font-bold text-primary-gold/60">{chat.id}</p>
             </div>
             <button onClick={onClose} className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white hover:bg-white/10 transition-all">Close</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
