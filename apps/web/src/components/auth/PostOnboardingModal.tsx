"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  Image as ImageIcon, 
  X, 
  ChevronRight, 
  Check, 
  Loader2, 
  MapPin, 
  User as UserIcon,
  Sparkles
} from "lucide-react";
import { useSnackbar } from "@/context/SnackbarContext";
import { useAuth } from "@/context/AuthContext";
import { useUploads } from "@/context/UploadContext";
import { api } from "@/lib/api";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useRef } from "react";

export default function PostOnboardingModal() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { showSnackbar } = useSnackbar();
  const { enlistImage } = useUploads();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState({ avatar: false, cover: false });

  // Form State
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [county, setCounty] = useState("");

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Re-check location if it was skipped
  const [needsLocation, setNeedsLocation] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(prev => ({ ...prev, [type]: true }));
    try {
      const folder = type === 'avatar' ? 'avatars' : 'covers';
      const { publicUrl } = await enlistImage(file, folder);
      if (type === 'avatar') setAvatar(publicUrl);
      else setCoverPhoto(publicUrl);
      showSnackbar(`${type === 'avatar' ? 'Profile' : 'Cover'} photo uploaded!`, "success");
    } catch (err) {
      showSnackbar("Upload failed. Try again.", "error");
    } finally {
      setIsUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  useEffect(() => {
    if (isLoading) return;

    const isWelcome = searchParams.get("welcome") === "true";
    if (isWelcome && isAuthenticated) {
      setIsOpen(true);
      // If user has no country, they probably skipped locality stage
      if (!user?.county && !user?.countyId) setNeedsLocation(true);
    }
  }, [searchParams, isAuthenticated, isLoading, user]);

  const handleClose = () => {
    setIsOpen(false);
    // Clear the query param using Next.js router
    const params = new URLSearchParams(searchParams.toString());
    params.delete("welcome");
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await api.patch('/users/profile', {
        bio,
        avatar,
        coverPhoto,
      });

      showSnackbar("Profile updated successfully!", "success");
      // If user has no county, take them to step 2 to ask for it
      if (!user?.county && !county) setStep(2);
      else handleClose();
    } catch (err: any) {
      console.error("Profile update failed:", err);
      showSnackbar(err.response?.data?.message || "Failed to update profile.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveLocation = async () => {
    if (!county) {
        showSnackbar("Please select a county", "error");
        return;
    }
    setIsSubmitting(true);
    try {
      await api.patch('/users/profile', { county });
      showSnackbar("Location updated!", "success");
      handleClose();
    } catch (err: any) {
      showSnackbar("Failed to update location.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-[var(--card-bg)] border border-[var(--border-color)] rounded-sm overflow-hidden shadow-2xl relative"
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors z-30"
        >
          <X size={20} />
        </button>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <div className="mb-6 text-center">
                <div className="size-12 bg-primary-gold/10 rounded-sm flex items-center justify-center text-primary-gold mx-auto mb-4">
                  <Sparkles size={24} />
                </div>
                <h2 className="text-2xl font-bold mb-1">Final Touches</h2>
                <p className="text-[11px] text-[var(--text-muted)] font-medium uppercase tracking-widest">Architect your digital presence</p>
              </div>

              <div className="space-y-8 mb-10">
                {/* Photos Section */}
                <div className="relative">
                   {/* Hidden Inputs */}
                   <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'avatar')} />
                   <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'cover')} />

                   {/* Cover Photo Placeholder */}
                   <div 
                    onClick={() => !isUploading.cover && coverInputRef.current?.click()}
                    className="h-32 w-full bg-[var(--pill-bg)] rounded-2xl border border-dashed border-white/10 flex items-center justify-center relative overflow-hidden group cursor-pointer"
                   >
                      {coverPhoto ? (
                        <img src={coverPhoto} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-[var(--text-muted)] group-hover:text-primary-gold transition-colors">
                          <ImageIcon size={24} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Add Cover Photo</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {isUploading.cover ? <Loader2 size={24} className="animate-spin text-white" /> : <Camera size={20} className="text-white" />}
                      </div>
                   </div>

                   {/* Avatar Placeholder */}
                   <div 
                    onClick={() => !isUploading.avatar && avatarInputRef.current?.click()}
                    className="absolute -bottom-6 left-8 size-20 rounded-sm bg-[var(--card-bg)] border-4 border-[var(--card-bg)] shadow-xl relative overflow-hidden group cursor-pointer"
                   >
                      <div className="w-full h-full bg-[var(--pill-bg)] flex items-center justify-center overflow-hidden">
                        {avatar ? (
                          <img src={avatar} className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon size={24} className="text-[var(--text-muted)]" />
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {isUploading.avatar ? <Loader2 size={20} className="animate-spin text-white" /> : <Camera size={16} className="text-white" />}
                      </div>
                   </div>
                </div>

                <div className="pt-6 space-y-2">
                  <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Biosignature</label>
                  <textarea 
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-[var(--pill-bg)] border border-white/5 rounded-sm p-4 text-[13px] font-medium focus:outline-none focus:border-primary-gold transition-all h-28 resize-none"
                  />
                </div>
              </div>

              <button 
                onClick={handleSave}
                disabled={isSubmitting}
                className="w-full bg-primary-gold text-black rounded-sm py-3.5 font-bold text-[11px] uppercase tracking-widest hover:brightness-105 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary-gold/10"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <>Save & Continue <ChevronRight size={16} /></>}
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
               <div className="mb-8 text-center">
                <div className="size-12 bg-blue-500/10 rounded-sm flex items-center justify-center text-blue-400 mx-auto mb-4">
                  <MapPin size={24} />
                </div>
                <h2 className="text-2xl font-bold mb-1">Wait, one more thing...</h2>
                <p className="text-[11px] text-[var(--text-muted)] font-medium uppercase tracking-widest">Location missing from registry</p>
              </div>

              <div className="space-y-6 mb-8">
                <div className="space-y-2">
                   <label className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] ml-1">Select Home County</label>
                   <select 
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                      className="w-full h-12 bg-[var(--pill-bg)] border border-white/5 rounded-sm px-4 text-[13px] font-bold outline-none focus:border-primary-gold/30 transition-all text-white appearance-none cursor-pointer"
                   >
                      <option value="" disabled className="bg-[var(--card-bg)]">Choose your county...</option>
                      {["Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo Marakwet", "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado", "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia", "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit", "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi", "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua", "Nyeri", "Samburu", "Siaya", "Taita Taveta", "Tana River", "Tharaka Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu", "Vihiga", "Wajir", "West Pokot"].map(c => (
                        <option key={c} value={c} className="bg-[var(--card-bg)]">{c}</option>
                      ))}
                   </select>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                   <button 
                      onClick={handleSaveLocation}
                      disabled={isSubmitting || !county}
                      className="w-full bg-primary-gold text-black rounded-sm py-4 font-bold text-[11px] uppercase tracking-widest hover:brightness-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                      {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Complete Profile Establishment"}
                   </button>
                   <button 
                      onClick={handleClose}
                      className="w-full bg-white/5 text-[var(--text-muted)] rounded-sm py-4 font-bold text-[11px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                   >
                      Remain Anonymous (Skip)
                   </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
