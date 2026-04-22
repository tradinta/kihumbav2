'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, UserPlus, MessageCircle, Ghost, Send, Loader2, 
  Search, Fingerprint, ShieldCheck, Copy, Check, Users,
  ChevronRight, Camera, Shield, Lock, Globe, Image as ImageIcon
} from 'lucide-react';
import UserIdentity from '../shared/UserIdentity';
import { useAuth } from '@/context/AuthContext';
import { useSnackbar } from '@/context/SnackbarContext';
import { api } from '@/lib/api';

interface StartChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomCreated?: (roomId: string) => void;
}

type Tab = 'identity' | 'vault' | 'group';

export default function StartChatModal({ isOpen, onClose, onRoomCreated }: StartChatModalProps) {
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  
  const [activeTab, setActiveTab] = useState<Tab>('identity');
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Manual Request State
  const [manualUsername, setManualUsername] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  // Anon State
  const [anonCode, setAnonCode] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState('');
  const [isAnonLoading, setIsAnonLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Group State
  const [selectedParticipants, setSelectedParticipants] = useState<any[]>([]);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupPrivacy, setGroupPrivacy] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [memberLimit, setMemberLimit] = useState(100);
  const [groupLogo, setGroupLogo] = useState<File | null>(null);
  const [groupCover, setGroupCover] = useState<File | null>(null);
  const [groupView, setGroupView] = useState<'list' | 'info' | 'settings' | 'success'>('list');
  const [generatedLink, setGeneratedLink] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  // Fetch Mutual Friends
  useEffect(() => {
    if (isOpen && activeTab === 'identity') {
      fetchFriends();
    }
  }, [isOpen, activeTab]);

  const fetchFriends = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.get('/users/friends');
      setFriends(data || []);
    } catch (err) {
      console.error('Failed to fetch friends', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDM = async (targetUserId: string) => {
    try {
      const room = await api.post('/chat/rooms', {
        type: 'DM',
        participants: [targetUserId]
      });
      onRoomCreated?.(room.id);
      onClose();
    } catch (err) {
      showSnackbar('Failed to connect', 'error');
    }
  };

  const handleManualRequest = async () => {
    if (!manualUsername.trim()) return;
    setIsRequesting(true);
    try {
      const profile = await api.get(`/users/profile/${manualUsername.trim()}`);
      const room = await api.post('/chat/rooms', {
        type: 'DM',
        participants: [profile.id]
      });
      showSnackbar(`Request sent to @${manualUsername}`, 'info');
      onRoomCreated?.(room.id);
      onClose();
    } catch (err: any) {
      showSnackbar(err.message || 'User not found', 'error');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleStartAnon = async () => {
    setIsAnonLoading(true);
    try {
      const room = await api.post('/chat/anon/start', {});
      setAnonCode(room.metadata.inviteCode);
      showSnackbar('Vault created', 'success');
    } catch (err: any) {
      showSnackbar(err.message || 'Creation failed', 'error');
    } finally {
      setIsAnonLoading(false);
    }
  };

  const handleJoinAnon = async () => {
    if (joinCode.length !== 5) return;
    setIsAnonLoading(true);
    try {
      const room = await api.post('/chat/anon/join', { code: joinCode });
      onRoomCreated?.(room.id);
      onClose();
    } catch (err: any) {
      showSnackbar(err.message || 'Invalid code', 'error');
    } finally {
      setIsAnonLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedParticipants.length === 0) return;
    setIsCreatingGroup(true);
    try {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let link = '';
      for (let i = 0; i < 8; i++) {
        link += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const logoUrl = groupLogo ? 'https://avatar.vercel.sh/' + groupName : null;
      const coverUrl = groupCover ? 'https://picsum.photos/800/400' : null;

      const room = await api.post('/chat/rooms', {
        type: 'GROUP',
        name: groupName,
        description: groupDescription,
        slug: link,
        avatar: logoUrl,
        metadata: {
          cover: coverUrl,
          privacy: groupPrivacy,
          memberLimit: memberLimit,
          isPublic: groupPrivacy === 'PUBLIC'
        },
        participants: selectedParticipants.map(p => p.id)
      });
      
      setGeneratedLink(link);
      setGroupView('success');
      showSnackbar(`Group ${groupName} created`, 'success');
      onRoomCreated?.(room.id);
    } catch (err: any) {
      showSnackbar(err.message || 'Creation failed', 'error');
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const toggleParticipant = (friend: any) => {
    setSelectedParticipants(prev => {
      const exists = prev.find(p => p.id === friend.id);
      if (exists) return prev.filter(p => p.id !== friend.id);
      return [...prev, friend];
    });
  };

  const copyCode = () => {
    if (!anonCode) return;
    navigator.clipboard.writeText(anonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFriends = friends.filter(f => 
    f.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 font-inter"
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#050505] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] font-inter"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-3 tracking-tight">
                   Start a new chat
                </h2>
                <p className="text-xs font-medium text-zinc-500 mt-0.5">Connect with your network or start a group</p>
              </div>
              <button onClick={onClose} className="size-10 rounded-full hover:bg-white/5 flex items-center justify-center text-zinc-400 transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex px-6 border-b border-white/5 bg-zinc-950/30">
              <button 
                onClick={() => setActiveTab('identity')}
                className={`py-4 text-[13px] font-bold flex-1 border-b-2 transition-all ${
                  activeTab === 'identity' ? 'border-primary-gold text-primary-gold' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Direct
              </button>
              <button 
                onClick={() => setActiveTab('vault')}
                className={`py-4 text-[13px] font-bold flex-1 border-b-2 transition-all ${
                  activeTab === 'vault' ? 'border-primary-gold text-primary-gold' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Vault
              </button>
              <button 
                onClick={() => setActiveTab('group')}
                className={`py-4 text-[13px] font-bold flex-1 border-b-2 transition-all ${
                  activeTab === 'group' ? 'border-primary-gold text-primary-gold' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Group
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {activeTab === 'identity' ? (
                <div className="space-y-8">
                  {/* Find by Username */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-500 ml-1">Search by username</label>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3 focus-within:border-primary-gold/40 transition-all group">
                        <span className="text-sm font-bold text-primary-gold/30">@</span>
                        <input 
                          type="text" 
                          value={manualUsername}
                          onChange={(e) => setManualUsername(e.target.value)}
                          placeholder="username..." 
                          className="flex-1 bg-transparent outline-none text-sm font-medium text-white placeholder:text-zinc-700"
                        />
                      </div>
                      <button 
                        onClick={handleManualRequest}
                        disabled={isRequesting || !manualUsername.trim()}
                        className="px-6 bg-primary-gold text-black rounded-2xl font-bold text-xs hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-primary-gold/10"
                      >
                        {isRequesting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        Find
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-white/5 w-full" />

                  {/* Mutual Friends */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-xs font-bold text-zinc-500">Your network</label>
                      <div className="flex items-center gap-2 text-xs font-semibold text-primary-gold/60">
                         <Search size={14} />
                         <input 
                          type="text" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Filter list..." 
                          className="bg-transparent outline-none w-24 placeholder:text-zinc-700" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {loading ? (
                        <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-primary-gold" /></div>
                      ) : filteredFriends.length > 0 ? (
                        filteredFriends.map((friend) => (
                          <div 
                            key={friend.id}
                            className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary-gold/30 hover:bg-white/[0.04] transition-all group cursor-pointer"
                            onClick={() => handleCreateDM(friend.id)}
                          >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <UserIdentity 
                                user={{...friend, subscriptionTier: friend.subscriptionTier, accountType: friend.accountType} as any}
                                size="md"
                                isLink={false}
                              />
                            </div>
                            <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 group-hover:bg-primary-gold group-hover:text-black transition-all">
                              <MessageCircle size={18} />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-16 flex flex-col items-center justify-center opacity-30">
                          <Users size={32} className="mb-4 text-zinc-500" />
                          <p className="text-xs font-medium">No results found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : activeTab === 'group' ? (
                <div className="space-y-6">
                  {groupView === 'list' ? (
                    <>
                      <div className="flex items-center justify-between px-1">
                        <div>
                          <label className="text-xs font-bold text-zinc-500">Add members</label>
                          <p className="text-[11px] font-medium text-zinc-600">Choose participants for your group</p>
                        </div>
                        <span className="text-xs font-bold text-primary-gold bg-primary-gold/10 px-3 py-1 rounded-full">{selectedParticipants.length} chosen</span>
                      </div>

                      {/* Selected Preview */}
                      {selectedParticipants.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto custom-scrollbar py-2 border-b border-white/5">
                          {selectedParticipants.map(p => (
                            <div key={p.id} className="relative shrink-0 cursor-pointer" onClick={() => toggleParticipant(p)}>
                              <UserIdentity 
                                user={{...p, subscriptionTier: p.isVerified ? 'PLUS' : 'FREE', accountType: 'NORMAL'} as any}
                                size="sm"
                                hideName={true}
                                isLink={false}
                              />
                              <div className="absolute -top-1 -right-1 size-4 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg">
                                <X size={10} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="space-y-4">
                        <div className="bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-3">
                          <Search size={16} className="text-zinc-600" />
                          <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search your network..." 
                            className="flex-1 bg-transparent outline-none text-sm font-medium text-white placeholder:text-zinc-700"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          {friends.map((friend) => {
                            const isSelected = selectedParticipants.some(p => p.id === friend.id);
                            return (
                              <div 
                                key={friend.id}
                                onClick={() => toggleParticipant(friend)}
                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group ${
                                  isSelected ? 'bg-primary-gold/5 border-primary-gold/40' : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                                }`}
                              >
                                <div className="flex items-center gap-4 min-w-0 flex-1">
                                  <UserIdentity 
                                    user={{...friend, subscriptionTier: friend.subscriptionTier, accountType: friend.accountType} as any}
                                    size="md"
                                    isLink={false}
                                  />
                                </div>
                                <div className={`size-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                  isSelected ? 'bg-primary-gold border-primary-gold text-black' : 'border-white/10 text-transparent group-hover:border-white/30'
                                }`}>
                                  <Check size={14} strokeWidth={3} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {selectedParticipants.length > 0 && (
                        <div className="pt-4">
                          <button 
                            onClick={() => setGroupView('info')}
                            className="w-full py-4 bg-primary-gold text-black rounded-2xl font-bold text-sm hover:brightness-110 shadow-lg shadow-primary-gold/10 transition-all flex items-center justify-center gap-2"
                          >
                            Continue to setup
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      )}
                    </>
                  ) : groupView === 'info' ? (
                    <div className="space-y-8 py-4">
                      <div className="flex flex-col items-center text-center gap-4">
                         <div className="relative group">
                            <div className="size-24 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center overflow-hidden">
                               {groupLogo ? (
                                 <img src={URL.createObjectURL(groupLogo)} className="w-full h-full object-cover" />
                               ) : (
                                 <Users size={40} className="text-zinc-600 group-hover:text-primary-gold transition-colors" />
                               )}
                               <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setGroupLogo(e.target.files?.[0] || null)} accept="image/*" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 size-8 rounded-xl bg-primary-gold text-black flex items-center justify-center shadow-xl border-4 border-[#050505]">
                               <Camera size={16} />
                            </div>
                         </div>
                         <div>
                            <h3 className="text-lg font-bold text-white tracking-tight">Name your group</h3>
                            <p className="text-xs font-medium text-zinc-500">Establish your group's visual identity</p>
                         </div>
                      </div>

                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 ml-1">Group Title</label>
                          <input 
                            type="text" 
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Enter group name..." 
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-4 text-base font-semibold text-white outline-none focus:border-primary-gold/40 transition-all placeholder:text-zinc-800"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-500 ml-1">Mission (Optional)</label>
                          <textarea 
                            value={groupDescription}
                            onChange={(e) => setGroupDescription(e.target.value)}
                            placeholder="What is this group's purpose?"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-4 text-sm font-medium text-white outline-none focus:border-primary-gold/40 transition-all placeholder:text-zinc-800 min-h-[100px] resize-none"
                          />
                        </div>

                        <div className="space-y-2">
                           <label className="text-xs font-bold text-zinc-500 ml-1">Cover Image</label>
                           <div className="h-28 w-full rounded-2xl bg-white/[0.03] border border-white/10 border-dashed flex items-center justify-center relative overflow-hidden group hover:border-primary-gold/30 transition-all">
                              {groupCover ? (
                                <img src={URL.createObjectURL(groupCover)} className="w-full h-full object-cover" />
                              ) : (
                                <div className="flex flex-col items-center gap-2">
                                  <ImageIcon size={24} className="text-zinc-700" />
                                  <p className="text-xs font-semibold text-zinc-600">Select cover photo</p>
                                </div>
                              )}
                              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setGroupCover(e.target.files?.[0] || null)} accept="image/*" />
                           </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                         <button onClick={() => setGroupView('list')} className="flex-1 py-4 border border-white/10 rounded-2xl text-xs font-bold text-zinc-500 hover:bg-white/5 transition-all">Back</button>
                         <button 
                           onClick={() => setGroupView('settings')}
                           disabled={!groupName.trim()}
                           className="flex-[2] py-4 bg-primary-gold text-black rounded-2xl font-bold text-sm hover:brightness-110 disabled:opacity-50 transition-all shadow-lg shadow-primary-gold/10"
                         >
                           Configure Settings
                         </button>
                      </div>
                    </div>
                  ) : groupView === 'settings' ? (
                    <div className="space-y-8 py-4">
                       <div className="flex flex-col items-center text-center gap-2">
                          <Shield size={32} className="text-primary-gold mb-1" />
                          <h3 className="text-lg font-bold text-white tracking-tight">Group Settings</h3>
                          <p className="text-xs font-medium text-zinc-500">Define access and limitations</p>
                       </div>

                       <div className="space-y-6">
                          <div className="space-y-4">
                             <label className="text-xs font-bold text-zinc-500 ml-1">Privacy Level</label>
                             <div className="grid grid-cols-2 gap-3">
                                <button 
                                  onClick={() => setGroupPrivacy('PUBLIC')}
                                  className={`p-4 rounded-2xl border transition-all text-left group ${groupPrivacy === 'PUBLIC' ? 'bg-primary-gold/5 border-primary-gold/40' : 'bg-white/[0.02] border-white/10 hover:border-white/20'}`}
                                >
                                   <div className="flex items-center gap-2 mb-1.5">
                                      <Globe size={14} className={groupPrivacy === 'PUBLIC' ? 'text-primary-gold' : 'text-zinc-500'} />
                                      <p className={`text-[13px] font-bold ${groupPrivacy === 'PUBLIC' ? 'text-primary-gold' : 'text-white'}`}>Public</p>
                                   </div>
                                   <p className="text-[11px] font-medium text-zinc-600 leading-normal">Anyone with the link can join instantly</p>
                                </button>
                                <button 
                                  onClick={() => setGroupPrivacy('PRIVATE')}
                                  className={`p-4 rounded-2xl border transition-all text-left group ${groupPrivacy === 'PRIVATE' ? 'bg-primary-gold/5 border-primary-gold/40' : 'bg-white/[0.02] border-white/10 hover:border-white/20'}`}
                                >
                                   <div className="flex items-center gap-2 mb-1.5">
                                      <Lock size={14} className={groupPrivacy === 'PRIVATE' ? 'text-primary-gold' : 'text-zinc-500'} />
                                      <p className={`text-[13px] font-bold ${groupPrivacy === 'PRIVATE' ? 'text-primary-gold' : 'text-white'}`}>Private</p>
                                   </div>
                                   <p className="text-[11px] font-medium text-zinc-600 leading-normal">Requires admin approval to join</p>
                                </button>
                             </div>
                          </div>

                          <div className="space-y-3">
                             <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-bold text-zinc-500">Member Limit</label>
                                <span className="text-xs font-bold text-primary-gold">{memberLimit} members</span>
                             </div>
                             <input 
                               type="range" 
                               min="2" 
                               max="1000" 
                               value={memberLimit}
                               onChange={(e) => setMemberLimit(parseInt(e.target.value))}
                               className="w-full accent-primary-gold bg-white/5 h-1.5 rounded-full cursor-pointer"
                             />
                             <div className="flex justify-between px-1">
                                <span className="text-[10px] font-bold text-zinc-700">2</span>
                                <span className="text-[10px] font-bold text-zinc-700">1000</span>
                             </div>
                          </div>
                       </div>

                       <div className="flex gap-3">
                         <button onClick={() => setGroupView('info')} className="flex-1 py-4 border border-white/10 rounded-2xl text-xs font-bold text-zinc-500 hover:bg-white/5 transition-all">Back</button>
                         <button 
                           onClick={handleCreateGroup}
                           disabled={isCreatingGroup}
                           className="flex-[2] py-4 bg-primary-gold text-black rounded-2xl font-bold text-sm hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-gold/10"
                         >
                           {isCreatingGroup ? <Loader2 size={16} className="animate-spin" /> : 'Create Group'}
                         </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8 py-10 flex flex-col items-center text-center">
                       <div className="size-20 rounded-3xl bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-2 shadow-2xl shadow-green-500/10">
                          <Check size={40} className="text-green-500" />
                       </div>
                       <div>
                          <h3 className="text-xl font-bold text-white tracking-tight">Group Created</h3>
                          <p className="text-sm font-medium text-zinc-500 mt-1 max-w-[280px]">Your secure channel is now active. Use the link below to invite more people.</p>
                       </div>
                       
                       <div className="w-full p-6 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col items-center gap-4">
                          <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">Secure Join Code</span>
                          <div className="flex items-center gap-4">
                             <span className="text-3xl font-bold tracking-tight text-primary-gold font-mono">{generatedLink}</span>
                             <button 
                               onClick={() => {
                                 navigator.clipboard.writeText(`https://kihumba.com/g/${generatedLink}`);
                                 showSnackbar('Link copied', 'success');
                               }}
                               className="size-11 rounded-2xl bg-primary-gold text-black flex items-center justify-center hover:brightness-110 transition-all shadow-lg shadow-primary-gold/20"
                             >
                               <Copy size={18} />
                             </button>
                          </div>
                       </div>

                       <button 
                         onClick={onClose}
                         className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-white hover:bg-white/10 transition-all"
                       >
                         Done
                       </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-8 py-4">
                   <div className="flex flex-col items-center text-center gap-3">
                      <div className="size-16 rounded-full bg-primary-gold/5 border border-primary-gold/20 flex items-center justify-center mb-1">
                         <Ghost size={32} className="text-primary-gold" />
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-tight">Secret Vault</h3>
                      <p className="text-sm font-medium text-zinc-500 max-w-xs leading-relaxed">
                        Start an end-to-end encrypted chat without revealing your identity.
                      </p>
                   </div>

                   <div className="space-y-4">
                      {anonCode ? (
                        <div className="p-8 rounded-3xl bg-primary-gold/5 border-2 border-dashed border-primary-gold/20 flex flex-col items-center gap-4 shadow-2xl shadow-primary-gold/5">
                           <p className="text-xs font-bold text-primary-gold/60 uppercase tracking-widest">Share this code</p>
                           <div className="flex items-center gap-6">
                              <span className="text-5xl font-bold tracking-widest text-primary-gold font-mono">{anonCode}</span>
                              <button 
                                onClick={copyCode}
                                className="size-12 rounded-2xl bg-primary-gold text-black flex items-center justify-center hover:brightness-110 transition-all shadow-lg shadow-primary-gold/20"
                              >
                                {copied ? <Check size={20} /> : <Copy size={20} />}
                              </button>
                           </div>
                           <p className="text-[11px] font-bold text-primary-gold animate-pulse tracking-wide mt-2">Waiting for partner...</p>
                        </div>
                      ) : (
                        <button 
                          onClick={handleStartAnon}
                          disabled={isAnonLoading}
                          className="w-full py-6 bg-white/[0.03] border border-white/10 rounded-2xl flex flex-col items-center gap-3 hover:bg-white/[0.05] hover:border-primary-gold/30 transition-all group"
                        >
                          {isAnonLoading ? (
                            <Loader2 size={24} className="animate-spin text-primary-gold" />
                          ) : (
                            <>
                              <div className="size-10 rounded-xl bg-primary-gold/10 flex items-center justify-center text-primary-gold group-hover:scale-110 transition-transform">
                                <Lock size={20} />
                              </div>
                              <span className="text-sm font-bold text-primary-gold">Create new vault</span>
                            </>
                          )}
                        </button>
                      )}
                   </div>

                   <div className="flex items-center gap-4">
                      <div className="h-px bg-white/5 flex-1" />
                      <span className="text-[11px] font-bold text-zinc-700">OR JOIN WITH CODE</span>
                      <div className="h-px bg-white/5 flex-1" />
                   </div>

                   <div className="space-y-4">
                      <div className="flex gap-2">
                        <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3 flex items-center focus-within:border-primary-gold/40 transition-all">
                           <input 
                              type="text" 
                              value={joinCode}
                              onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 5))}
                              placeholder="5-digit code" 
                              className="flex-1 bg-transparent outline-none text-center text-lg font-bold tracking-[0.3em] text-primary-gold placeholder:text-zinc-800 font-mono"
                           />
                        </div>
                        <button 
                          onClick={handleJoinAnon}
                          disabled={isAnonLoading || joinCode.length !== 5}
                          className="px-8 bg-primary-gold text-black rounded-2xl font-bold text-xs hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-primary-gold/10"
                        >
                          {isAnonLoading ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={16} />}
                          Enter
                        </button>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
