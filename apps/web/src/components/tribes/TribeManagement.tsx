'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Shield, Users, Lock, Globe, Eye, 
  Settings, Check, X, Camera, Plus,
  Share2, Copy, Trash2, ShieldCheck,
  AlertTriangle, MessageSquare, Info,
  ExternalLink, UserCheck, UserX,
  FileText, Gavel, BarChart3, Rocket,
  Repeat2, Upload, Image as ImageIcon
} from 'lucide-react';
import { api } from '@/lib/api';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadToR2 } from '@/lib/upload';
import StatusModal from '../shared/StatusModal';

interface Tribe {
  id: string;
  name: string;
  slug: string;
  bio: string;
  privacy: 'PUBLIC' | 'PRIVATE' | 'SECRET';
  postVisibility: 'EVERYONE' | 'MEMBERS';
  logo: string | null;
  cover: string | null;
  rules: string[];
}

interface JoinRequest {
  id: string;
  status: string;
  user: {
    id: string;
    username: string;
    fullName: string;
    avatar: string | null;
  };
  answers: any;
  createdAt: string;
}

export default function TribeManagement({ tribe, onUpdate }: { tribe: Tribe, onUpdate: () => void }) {
  const [formData, setFormData] = useState({
    name: tribe.name,
    bio: tribe.bio || '',
    privacy: tribe.privacy,
    postVisibility: tribe.postVisibility || 'EVERYONE',
    rules: tribe.rules || [],
    logo: tribe.logo,
    cover: tribe.cover
  });
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [newRule, setNewRule] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [isGeneratingInvite, setIsGeneratingInvite] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // New state for Preview flow
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Status Modal State
  const [modal, setModal] = useState<{ isOpen: boolean, title: string, message: string, type: 'error' | 'success' }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'error'
  });

  useEffect(() => {
    fetchRequests();
  }, [tribe.id]);

  const fetchRequests = async () => {
    try {
      const data = await api.get(`/tribes/${tribe.id}/join-requests`);
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.patch(`/tribes/${tribe.id}/settings`, formData);
      setModal({
        isOpen: true,
        title: 'System Updated',
        message: 'Tribe settings have been synchronized successfully.',
        type: 'success'
      });
      onUpdate();
    } catch (error: any) {
      setModal({
        isOpen: true,
        title: 'Update Failed',
        message: error.message || 'Failed to update settings',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRespond = async (requestId: string, approve: boolean) => {
    try {
      await api.post(`/tribes/join-requests/${requestId}/respond`, { approve });
      setRequests(prev => prev.filter(r => r.id !== requestId));
      onUpdate();
    } catch (error: any) {
      setModal({
        isOpen: true,
        title: 'Action Failed',
        message: error.message || 'Failed to respond to request',
        type: 'error'
      });
    }
  };

  const handleGenerateInvite = async () => {
    setIsGeneratingInvite(true);
    try {
      const data = await api.post(`/tribes/${tribe.id}/invite`, {});
      const link = `${window.location.origin}/tribes/invite/${data.code}`;
      setInviteLink(link);
    } catch (error: any) {
      setModal({
        isOpen: true,
        title: 'Generation Failed',
        message: error.message || 'Failed to generate invite',
        type: 'error'
      });
    } finally {
      setIsGeneratingInvite(false);
    }
  };

  const addRule = () => {
    if (!newRule.trim()) return;
    setFormData(p => ({ ...p, rules: [...p.rules, newRule.trim()] }));
    setNewRule('');
  };

  const removeRule = (index: number) => {
    setFormData(p => ({ ...p, rules: p.rules.filter((_, i) => i !== index) }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'logo') {
        setLogoFile(file);
        setLogoPreview(reader.result as string);
      } else {
        setCoverFile(file);
        setCoverPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const [uploadProgress, setUploadProgress] = useState<{ type: 'logo' | 'cover', progress: number } | null>(null);

  const performUpload = async (type: 'logo' | 'cover') => {
    const file = type === 'logo' ? logoFile : coverFile;
    if (!file) return;

    const isLogo = type === 'logo';
    if (isLogo) setIsUploadingLogo(true);
    else setIsUploadingCover(true);
    setUploadProgress({ type, progress: 10 });

    try {
      const interval = setInterval(() => {
        setUploadProgress(prev => prev ? { ...prev, progress: Math.min(prev.progress + 15, 90) } : null);
      }, 100);

      const publicUrl = await uploadToR2(file, isLogo ? 'avatars' : 'covers');
      clearInterval(interval);
      setUploadProgress({ type, progress: 100 });
      
      setFormData(f => ({ ...f, [type]: publicUrl }));
      
      // Clear local states
      if (isLogo) {
        setLogoFile(null);
        setLogoPreview(null);
      } else {
        setCoverFile(null);
        setCoverPreview(null);
      }

      setTimeout(() => setUploadProgress(null), 1000);
      setModal({ isOpen: true, title: 'Asset Deployed', message: `Your ${type} is now cloud-synced and ready to save.`, type: 'success' });
    } catch (error: any) {
      setModal({ isOpen: true, title: 'Upload Failed', message: error.message || 'Cloud storage error.', type: 'error' });
      setUploadProgress(null);
    } finally {
      if (isLogo) setIsUploadingLogo(false);
      else setIsUploadingCover(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      
      {/* SECTION: BASIC INFO */}
      <section className="card-surface p-8 rounded-sm border border-custom">
        <h3 className="text-xs font-black uppercase tracking-widest text-main mb-8 flex items-center gap-3">
          <Settings size={16} className="text-primary-gold" /> Identity & Profile
        </h3>
        
        <div className="space-y-6 max-w-2xl">
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom mb-2 block">Tribe Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
              className="w-full bg-pill-surface border border-custom rounded-sm p-4 text-sm font-bold focus:border-primary-gold/40 focus:outline-none transition-all"
            />
            <p className="text-[9px] text-muted-custom mt-2 uppercase tracking-widest opacity-50 font-bold">Username: @{tribe.slug} (Immutable)</p>
          </div>

          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom mb-2 block">Mission Statement / Bio</label>
            <textarea 
              value={formData.bio}
              onChange={(e) => setFormData(p => ({ ...p, bio: e.target.value }))}
              placeholder="What defines this tribe?"
              className="w-full bg-pill-surface border border-custom rounded-sm p-4 text-sm font-medium h-32 focus:border-primary-gold/40 focus:outline-none transition-all resize-none"
            />
          </div>

          <div className="pt-4 flex gap-4">
             <button 
               disabled={isSaving}
               onClick={handleSave}
               className="h-10 px-8 bg-primary-gold text-black rounded-sm font-black text-[10px] uppercase tracking-widest disabled:opacity-50 hover:scale-[1.02] transition-all active:scale-95"
             >
               {isSaving ? 'Synchronizing...' : 'Save Profile'}
             </button>
          </div>
        </div>
      </section>

      {/* SECTION: VISUAL IDENTITY */}
      <section className="card-surface p-8 rounded-sm border border-custom">
        <h3 className="text-xs font-black uppercase tracking-widest text-main mb-8 flex items-center gap-3">
          <Camera size={16} className="text-primary-gold" /> Visual Identity
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
           <div className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom block">Tribe Logo / Emoji</label>
              <div className="flex items-center gap-6">
                 <div className="size-24 rounded-lg bg-pill-surface border-2 border-custom flex items-center justify-center text-4xl relative overflow-hidden group/logo">
                    {logoPreview ? (
                       <Image src={logoPreview} alt="" fill className="object-cover" />
                    ) : formData.logo && (formData.logo.startsWith('http') || formData.logo.startsWith('/')) ? (
                       <Image src={formData.logo} alt="" fill className="object-cover" />
                    ) : (
                       formData.logo || '🌍'
                    )}
                    
                    <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity z-10 ${uploadProgress?.type === 'logo' ? 'opacity-100' : 'opacity-0'}`}>
                       <div className="size-8 border-2 border-primary-gold border-t-transparent rounded-full animate-spin mb-2" />
                       <span className="text-[8px] font-black text-primary-gold uppercase tracking-tighter">{uploadProgress?.progress}%</span>
                    </div>

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center">
                       <button onClick={() => logoInputRef.current?.click()} className="p-2 bg-primary-gold text-black rounded-sm shadow-xl"><Camera size={16} /></button>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex gap-2">
                       <input 
                         type="text" 
                         placeholder="Emoji (e.g. 🚀)" 
                         value={(logoPreview || (formData.logo && (formData.logo.startsWith('http') || formData.logo.startsWith('/')))) ? '' : (formData.logo || '')}
                         onChange={(e) => setFormData(f => ({ ...f, logo: e.target.value }))}
                         className="h-10 w-32 bg-pill-surface border border-custom rounded-sm px-4 text-[11px] font-bold outline-none focus:border-primary-gold/40 transition-all"
                       />
                       <button 
                         onClick={() => logoInputRef.current?.click()}
                         className="h-10 px-6 bg-white/5 border border-custom rounded-sm text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                       >
                         <ImageIcon size={14} /> {logoPreview ? 'Change Photo' : 'Select Photo'}
                       </button>
                    </div>
                    {logoPreview && (
                       <button 
                         onClick={() => performUpload('logo')}
                         disabled={isUploadingLogo}
                         className="w-full h-10 bg-primary-gold text-black rounded-sm text-[9px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2"
                       >
                         <Upload size={14} /> {isUploadingLogo ? 'Uploading...' : 'Confirm Cloud Upload'}
                       </button>
                    )}
                    <p className="text-[9px] text-muted-custom uppercase font-bold opacity-40">Recommended: 512x512px PNG/JPG</p>
                 </div>
                 <input 
                   type="file" ref={logoInputRef} className="hidden" accept="image/*" 
                   onChange={(e) => handleFileSelect(e, 'logo')}
                 />
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom block">Cover Banner</label>
              <div className="relative h-24 rounded-sm border-2 border-custom bg-pill-surface overflow-hidden group/cover">
                 {coverPreview ? (
                    <Image src={coverPreview} alt="" fill className="object-cover" />
                 ) : formData.cover ? (
                    <Image src={formData.cover} alt="" fill className="object-cover opacity-60 group-hover/cover:scale-105 transition-transform duration-700" />
                 ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-10"><ImageIcon size={48} /></div>
                 )}

                 {/* Upload Progress Overlay */}
                 <div className={`absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center transition-all z-20 ${uploadProgress?.type === 'cover' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-3">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${uploadProgress?.progress}%` }}
                         className="h-full bg-primary-gold shadow-[0_0_15px_rgba(255,184,0,0.5)]"
                       />
                    </div>
                    <span className="text-[9px] font-black text-primary-gold uppercase tracking-widest">Deploying to Cloud... {uploadProgress?.progress}%</span>
                 </div>

                 <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/cover:bg-black/60 transition-all">
                    <button 
                      onClick={() => coverInputRef.current?.click()}
                      className="h-9 px-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-sm text-[9px] font-black uppercase tracking-widest text-white hover:bg-black/80 transition-all flex items-center gap-2"
                    >
                      <Camera size={14} /> {coverPreview ? 'Change Selection' : 'Change Cover'}
                    </button>
                 </div>
                 <input 
                   type="file" ref={coverInputRef} className="hidden" accept="image/*" 
                   onChange={(e) => handleFileSelect(e, 'cover')}
                 />
              </div>
              {coverPreview && (
                 <button 
                   onClick={() => performUpload('cover')}
                   disabled={isUploadingCover}
                   className="mt-2 w-full h-10 bg-primary-gold text-black rounded-sm text-[9px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-gold/10"
                 >
                   <Upload size={14} /> {isUploadingCover ? 'Syncing...' : 'Confirm Cover Upload'}
                 </button>
              )}
              <p className="text-[9px] text-muted-custom uppercase font-bold opacity-40">Recommended: 1200x400px</p>
           </div>
        </div>
      </section>

      {/* SECTION: VISIBILITY & GOVERNANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <section className="card-surface p-8 rounded-sm border border-custom h-full">
            <h3 className="text-xs font-black uppercase tracking-widest text-main mb-8 flex items-center gap-3">
              <Lock size={16} className="text-primary-gold" /> Visibility Control
            </h3>

            <div className="space-y-6">
               <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom mb-4 block">Tribe Privacy</label>
                  <div className="space-y-2">
                     {[
                        { id: 'PUBLIC', label: 'Public', sub: 'Anyone can see and join instantly.', icon: <Globe size={14} /> },
                        { id: 'PRIVATE', label: 'Private', sub: 'Visible, but requires approval to join.', icon: <Lock size={14} /> },
                        { id: 'SECRET', label: 'Secret', sub: 'Hidden from discovery. Invite only.', icon: <Shield size={14} /> }
                     ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setFormData(f => ({ ...f, privacy: p.id as any }))}
                          className={`w-full p-4 rounded-sm border text-left transition-all flex items-center gap-4 ${
                            formData.privacy === p.id ? 'border-primary-gold bg-primary-gold/5' : 'border-custom bg-pill-surface hover:border-white/10'
                          }`}
                        >
                           <div className={formData.privacy === p.id ? 'text-primary-gold' : 'text-muted-custom'}>
                              {p.icon}
                           </div>
                           <div>
                              <p className={`text-[10px] font-bold uppercase tracking-widest ${formData.privacy === p.id ? 'text-primary-gold' : 'text-main'}`}>{p.label}</p>
                              <p className="text-[9px] text-muted-custom font-medium uppercase tracking-widest opacity-60 mt-0.5">{p.sub}</p>
                           </div>
                        </button>
                     ))}
                  </div>
               </div>

               <div className="pt-4 border-t border-custom">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted-custom mb-4 block">Post Visibility</label>
                  <div className="flex gap-4">
                     {[
                        { id: 'EVERYONE', label: 'Everyone', icon: <Eye size={12} /> },
                        { id: 'MEMBERS', label: 'Members Only', icon: <ShieldCheck size={12} /> }
                     ].map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setFormData(f => ({ ...f, postVisibility: v.id as any }))}
                          className={`flex-1 p-3 rounded-sm border font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                            formData.postVisibility === v.id ? 'border-primary-gold bg-primary-gold/5 text-primary-gold' : 'border-custom bg-pill-surface text-muted-custom hover:border-white/10'
                          }`}
                        >
                           {v.icon} {v.label}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         <section className="card-surface p-8 rounded-sm border border-custom h-full">
            <h3 className="text-xs font-black uppercase tracking-widest text-main mb-8 flex items-center gap-3">
              <Gavel size={16} className="text-primary-gold" /> Community Rules
            </h3>

            <div className="space-y-4">
               <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Add a new rule..."
                    value={newRule}
                    onChange={(e) => setNewRule(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addRule()}
                    className="flex-1 bg-pill-surface border border-custom rounded-sm px-4 text-[10px] font-bold focus:border-primary-gold/40 focus:outline-none"
                  />
                  <button onClick={addRule} className="p-2.5 bg-primary-gold text-black rounded-sm hover:scale-105 transition-all"><Plus size={16} /></button>
               </div>

               <div className="space-y-2 mt-4 max-h-[200px] overflow-y-auto no-scrollbar">
                  {formData.rules.map((rule, i) => (
                    <div key={i} className="group p-3 bg-pill-surface border border-custom rounded-sm flex items-center justify-between">
                       <div className="flex gap-3">
                          <span className="text-[10px] font-black text-primary-gold opacity-50">{i + 1}</span>
                          <p className="text-[10px] text-muted-custom font-medium leading-relaxed">{rule}</p>
                       </div>
                       <button onClick={() => removeRule(i)} className="text-red-500/40 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><X size={14} /></button>
                    </div>
                  ))}
                  {formData.rules.length === 0 && (
                    <p className="text-[10px] text-muted-custom italic text-center py-8">No rules set yet.</p>
                  )}
               </div>
            </div>
         </section>
      </div>

      {/* SECTION: JOIN REQUESTS */}
      <section className="card-surface p-8 rounded-sm border border-custom">
        <h3 className="text-xs font-black uppercase tracking-widest text-main mb-8 flex items-center gap-3">
          <Users size={16} className="text-primary-gold" /> Membership Pipeline
        </h3>

        <div className="space-y-4">
           {requests.length > 0 ? (
             requests.map((req) => (
                <div key={req.id} className="p-4 bg-pill-surface border border-custom rounded-sm flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="size-10 rounded-sm bg-white/5 relative overflow-hidden shrink-0">
                         {req.user.avatar && <Image src={req.user.avatar} alt="" fill className="object-cover" />}
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-main uppercase tracking-widest">{req.user.fullName}</p>
                         <p className="text-[9px] text-muted-custom font-bold uppercase tracking-widest">@{req.user.username}</p>
                      </div>
                   </div>

                   <div className="flex gap-2">
                      <button 
                        onClick={() => handleRespond(req.id, false)}
                        className="h-8 px-4 border border-red-500/20 text-red-500 rounded-sm font-bold text-[9px] uppercase tracking-widest hover:bg-red-500/5 transition-all"
                      >
                        Decline
                      </button>
                      <button 
                        onClick={() => handleRespond(req.id, true)}
                        className="h-8 px-4 bg-primary-gold text-black rounded-sm font-bold text-[9px] uppercase tracking-widest hover:scale-105 transition-all"
                      >
                        Approve
                      </button>
                   </div>
                </div>
             ))
           ) : (
             <div className="py-20 text-center border border-dashed border-custom rounded-sm">
                <p className="text-[10px] text-muted-custom font-black uppercase tracking-[0.3em] opacity-40 italic">Zero Pending Requests</p>
             </div>
           )}
        </div>
      </section>

      {/* SECTION: GROWTH ENGINE */}
      <section className="card-surface p-10 rounded-sm border border-custom relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Rocket size={120} />
        </div>

        <div className="relative">
           <div className="flex items-center gap-4 mb-10">
              <div className="size-12 rounded-sm bg-primary-gold/10 flex items-center justify-center text-primary-gold">
                 <Rocket size={24} />
              </div>
              <div>
                 <h3 className="text-sm font-black uppercase tracking-[0.2em] text-main">Growth & Expansion</h3>
                 <p className="text-[10px] text-muted-custom font-bold uppercase tracking-widest mt-1">Acquire and onboard new members</p>
              </div>
           </div>

           <div className="max-w-2xl bg-white/5 border border-custom rounded-sm p-8">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-primary-gold mb-4">Unique Invitation Link</h4>
              <p className="text-[11px] text-muted-custom font-medium leading-relaxed mb-8">
                Distribute this specialized link to potential members. Anyone joining via this link will be tracked as your direct referral.
              </p>

              <div className="flex gap-2">
                 <div className="flex-1 bg-black/40 border border-custom rounded-sm px-6 flex items-center overflow-hidden">
                    <span className="text-[11px] font-bold text-primary-gold/60 truncate">{inviteLink || "NO_LINK_GENERATED"}</span>
                 </div>
                 
                 <button 
                   onClick={handleGenerateInvite}
                   disabled={isGeneratingInvite}
                   className="h-12 px-8 bg-white/5 border border-custom text-main rounded-sm font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
                 >
                   {isGeneratingInvite ? (
                      <div className="size-4 border-2 border-main/30 border-t-main rounded-full animate-spin" />
                   ) : inviteLink ? <Repeat2 size={16} /> : <Plus size={16} />}
                   {inviteLink ? 'Regenerate' : 'Create Link'}
                 </button>

                 {inviteLink && (
                   <button 
                     onClick={() => {
                       navigator.clipboard.writeText(inviteLink);
                       setModal({ isOpen: true, title: 'Copied', message: 'Invite link is on your clipboard.', type: 'success' });
                     }}
                     className="h-12 px-6 bg-primary-gold text-black rounded-sm hover:scale-[1.02] transition-all flex items-center justify-center"
                   >
                     <Copy size={20} />
                   </button>
                 )}
              </div>
           </div>
        </div>
      </section>

      <StatusModal 
        isOpen={modal.isOpen}
        onClose={() => setModal(p => ({ ...p, isOpen: false }))}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
}
