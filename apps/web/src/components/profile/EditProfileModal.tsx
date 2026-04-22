import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Camera, Image as ImageIcon, MapPin, Link as LinkIcon, Loader2, Check, CloudUpload } from 'lucide-react';
import { api } from '@/lib/api';
import { uploadToR2 } from '@/lib/upload';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUpdate: (updatedUser: any) => void;
}

type Tab = 'basic' | 'media' | 'links';

export default function EditProfileModal({ isOpen, onClose, user, onUpdate }: EditProfileModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('basic');
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user.fullName || '',
    bio: user.bio || '',
    location: user.county || '',
    website: user.website || '',
    avatar: user.avatar || '',
    coverPhoto: user.coverPhoto || '',
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'coverPhoto') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'avatar') setUploadingAvatar(true);
    else setUploadingCover(true);

    try {
      const publicUrl = await uploadToR2(file, type === 'avatar' ? 'avatars' : 'covers');
      setFormData(prev => ({ ...prev, [type]: publicUrl }));
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      if (type === 'avatar') setUploadingAvatar(false);
      else setUploadingCover(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updated = await api.patch('/users/profile', formData);
      onUpdate(updated);
      onClose();
    } catch (err) {
      console.error('Update failed', err);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'media', label: 'Media', icon: Camera },
    { id: 'links', label: 'Location & Links', icon: MapPin },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[var(--bg-color)] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-gold">Edit Identity</h2>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex-1 py-3 flex items-center justify-center gap-2 transition-all relative ${
                    activeTab === tab.id ? 'text-primary-gold' : 'text-muted-custom hover:text-white'
                  }`}
                >
                  <tab.icon size={14} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
                  )}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="p-6 h-[400px] overflow-y-auto custom-scrollbar">
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">Display Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[11px] focus:outline-none focus:border-primary-gold/50 transition-colors"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">Biography</label>
                    <textarea 
                      rows={4}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[11px] focus:outline-none focus:border-primary-gold/50 transition-colors resize-none"
                      placeholder="Tell the world about yourself..."
                    />
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div className="space-y-6">
                   <div className="space-y-4">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">Avatar Management</label>
                    <div className="flex gap-6 items-center bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="size-20 rounded-2xl bg-black/20 border border-white/10 flex items-center justify-center overflow-hidden relative group">
                            <img 
                              src={formData.avatar || '/branding/avatar-fallback.png'} 
                              className="size-full object-cover group-hover:opacity-40 transition-opacity" 
                              alt="Avatar Preview" 
                            />
                            {uploadingAvatar && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <Loader2 size={20} className="text-primary-gold animate-spin" />
                              </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                           <input 
                              type="file" 
                              ref={avatarInputRef} 
                              onChange={(e) => handleFileUpload(e, 'avatar')} 
                              className="hidden" 
                              accept="image/*,.gif"
                           />
                           <button 
                              onClick={() => avatarInputRef.current?.click()}
                              disabled={uploadingAvatar}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold uppercase tracking-widest text-primary-gold hover:bg-primary-gold/10 hover:border-primary-gold/30 transition-all disabled:opacity-50"
                           >
                              <CloudUpload size={14} />
                              {uploadingAvatar ? 'Verifying...' : 'Upload New Avatar'}
                           </button>
                           <p className="text-[8px] text-muted-custom font-medium uppercase tracking-tight">Maximum size: 20MB. GIFs allowed.</p>
                        </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">Cover Curation</label>
                    <div className="space-y-3">
                        <div className="h-32 w-full rounded-xl bg-black/20 border border-white/10 flex items-center justify-center overflow-hidden relative group">
                            <img 
                              src={formData.coverPhoto || '/branding/cover-fallback.png'} 
                              className="size-full object-cover group-hover:opacity-40 transition-opacity" 
                              alt="Cover Preview" 
                            />
                            {uploadingCover && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <Loader2 size={24} className="text-primary-gold animate-spin" />
                              </div>
                            )}
                        </div>
                        <input 
                            type="file" 
                            ref={coverInputRef} 
                            onChange={(e) => handleFileUpload(e, 'coverPhoto')} 
                            className="hidden" 
                            accept="image/*,.gif"
                        />
                        <button 
                           onClick={() => coverInputRef.current?.click()}
                           disabled={uploadingCover}
                           className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold uppercase tracking-widest text-primary-gold hover:bg-primary-gold/10 hover:border-primary-gold/30 transition-all disabled:opacity-50"
                        >
                           <ImageIcon size={14} />
                           {uploadingCover ? 'Verifying Magic Numbers...' : 'Change Cover Photo'}
                        </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'links' && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">County / Location</label>
                    <div className="relative">
                        <MapPin size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-gold/50" />
                        <input 
                            type="text" 
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-[11px] focus:outline-none"
                            placeholder="e.g. Nairobi, Kenya"
                        />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-muted-custom">Website</label>
                    <div className="relative">
                        <LinkIcon size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-gold/50" />
                        <input 
                            type="text" 
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-[11px] focus:outline-none"
                            placeholder="kihumba.com/u/you"
                        />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="flex-[2] py-3 rounded-xl bg-primary-gold text-black text-[10px] font-bold uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <><Check size={14} /> Update Profile</>}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
