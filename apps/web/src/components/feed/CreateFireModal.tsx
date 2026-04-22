'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Upload, Loader2, Scissors, Check } from 'lucide-react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { api } from '@/lib/api';
import { getCroppedImg } from '@/lib/cropImage';

interface CreateFireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateFireModal({ isOpen, onClose, onSuccess }: CreateFireModalProps) {
  const [step, setStep] = useState(1);
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Crop state
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_area: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImageSrc(URL.createObjectURL(selectedFile));
      setStep(2); // Move to cropping step
    }
  };

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedBlob) {
        setCroppedImage(croppedBlob);
        setPreviewUrl(URL.createObjectURL(croppedBlob));
        setStep(3); // Move to captioning/draggable step
      }
    } catch (e) {
      console.error(e);
      alert('Failed to crop image.');
    }
  };

  const handleSkipCrop = () => {
    if (imageSrc) {
      setPreviewUrl(imageSrc);
      setCroppedImage(null); // Use original file
      setStep(3);
    }
  };

  const handleUpload = async () => {
    const fileToUpload = croppedImage || file;
    if (!fileToUpload) return;
    setIsSubmitting(true);

    try {
      const { url: uploadUrl, publicUrl } = await api.post('/storage/presigned-url', {
        fileName: fileToUpload instanceof Blob && !(fileToUpload instanceof File) ? `fire-${Date.now()}.jpg` : (fileToUpload as File).name,
        contentType: fileToUpload.type || 'image/jpeg',
        folder: 'fires'
      });

      await fetch(uploadUrl, {
        method: 'PUT',
        body: fileToUpload,
        headers: { 'Content-Type': fileToUpload.type || 'image/jpeg' },
      });

      await api.post('/fires', {
        mediaUrl: publicUrl,
        content,
      });

      onSuccess?.();
      onClose();
      
      // Reset
      setStep(1);
      setContent('');
      setFile(null);
      setImageSrc(null);
      setCroppedImage(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error(err);
      alert('Failed to ignite your fire. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-md" 
        onClick={onClose} 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-xs bg-[var(--card-bg)] rounded-lg overflow-hidden shadow-2xl border border-[var(--border-color)]"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-md bg-primary-gold/10 flex items-center justify-center text-primary-gold border border-primary-gold/20">
              <Flame size={14} />
            </div>
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-main)]">Ignite Fire</h2>
              <p className="text-[7px] text-[var(--text-muted)] font-bold tracking-widest uppercase">24 Hour Lifetime</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-[var(--border-color)] rounded-md transition-colors text-[var(--text-muted)]">
            <X size={14} />
          </button>
        </div>

        <div className="p-3">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-2"
              >
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-[4/5] rounded-md border-2 border-dashed border-[var(--border-color)] hover:border-primary-gold/40 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer bg-[var(--bg-color)] group"
                >
                  <div className="size-10 rounded-full bg-[var(--card-bg)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-primary-gold transition-all border border-[var(--border-color)]">
                    <Upload size={18} />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">Select Media</p>
                    <p className="text-[7px] text-[var(--text-muted)] mt-1 uppercase tracking-tighter opacity-60">High Fidelity Photos Only</p>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <div className="relative aspect-[4/5] w-full rounded-md overflow-hidden bg-black border border-[var(--border-color)]">
                  <Cropper
                    image={imageSrc || ''}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 5}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 py-2 rounded-md text-[8px] font-black uppercase tracking-widest border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-color)]"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleSkipCrop}
                    className="flex-1 py-2 rounded-md text-[8px] font-black uppercase tracking-widest border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-color)]"
                  >
                    Skip
                  </button>
                  <button 
                    onClick={handleCropSave}
                    className="flex-[2] py-2 rounded-md bg-primary-gold text-black text-[8px] font-black uppercase tracking-widest hover:brightness-110 flex items-center justify-center gap-2 shadow-lg shadow-primary-gold/10"
                  >
                    <Scissors size={12} />
                    Confirm
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {/* Preview */}
                <div className="relative aspect-[4/5] rounded-md overflow-hidden border border-[var(--border-color)] shadow-xl bg-[var(--bg-color)]">
                   {previewUrl && <img src={previewUrl} className="size-full object-cover" alt="Preview" />}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                   
                   {/* Draggable Caption Overlay Preview */}
                   <motion.div 
                     drag 
                     dragMomentum={false}
                     className="absolute bottom-6 left-0 right-0 cursor-move z-20 px-4"
                   >
                      <div className="text-white text-xs font-black text-center leading-tight drop-shadow-md px-2 py-1.5 bg-black/40 backdrop-blur-md rounded-md border border-white/10">
                        {content || "Your Fire..."}
                      </div>
                   </motion.div>
                </div>

                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-0.5">Caption</label>
                    <textarea 
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Add a vibe..."
                      className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-md p-2 text-[10px] text-[var(--text-main)] focus:border-primary-gold outline-none transition-all h-12 resize-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setStep(2)}
                      className="flex-1 py-2 rounded-md text-[8px] font-black uppercase tracking-widest border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-color)]"
                    >
                      Recrop
                    </button>
                    <button 
                      onClick={handleUpload}
                      disabled={isSubmitting || !file}
                      className="flex-[2] py-2 rounded-md bg-primary-gold text-black text-[8px] font-black uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-primary-gold/10"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={10} className="animate-spin" />
                          IGNITING...
                        </>
                      ) : (
                        <>
                          <Check size={12} />
                          IGNITE FIRE
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
