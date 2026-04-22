'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useSnackbar } from './SnackbarContext';

export type UploadStatus = 'WAITING' | 'UPLOADING' | 'PROCESSING' | 'SUCCESS' | 'ERROR';

export interface UploadTask {
  id: string;
  file: File;
  title: string;
  description?: string;
  thumbnail: string | null;
  progress: number;
  status: UploadStatus;
  videoId?: string; 
  content?: string; 
  error?: string;
  type: 'video' | 'document';
  key?: string;
  publicUrl?: string;
  upchunkInstance?: { abort: () => void } | null;
}

interface UploadContextType {
  uploads: UploadTask[];
  enlistUpload: (file: File, title: string, description?: string, content?: string, options?: any) => Promise<string>; 
  enlistDocument: (file: File) => Promise<{ key: string, publicUrl: string }>;
  enlistImage: (file: File, folder?: 'avatars' | 'covers' | 'events' | 'thumbnails' | 'fires') => Promise<{ key: string, publicUrl: string }>;
  updateMetadata: (taskId: string, metadata: any) => Promise<void>;
  cancelUpload: (id: string) => void;
  clearUpload: (id: string) => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export function UploadProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { show } = useSnackbar();
  const [uploads, setUploads] = useState<UploadTask[]>([]);

  /**
   * Generalized Video Enlistment (Master Studio Pattern)
   */
  const enlistUpload = useCallback(async (file: File, title: string, description?: string, content?: string, options?: any) => {
    const taskId = crypto.randomUUID();

    const newTask: UploadTask = {
      id: taskId,
      file,
      title,
      description,
      content,
      progress: 0,
      status: 'WAITING',
      thumbnail: null,
      type: 'video'
    };

    setUploads((prev) => [...prev, newTask]);

    try {
      // 1. Get Upload URL
      const { uploadUrl, videoId } = await api.post('/videos/upload-url', { 
        title, 
        description: description || ''
      });
      
      setUploads(prev => prev.map(t => t.id === taskId ? { ...t, videoId } : t));

      // 2. Binary Upload via XHR for progress tracking
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const p = Math.floor((event.loaded / event.total) * 100);
          setUploads(prev => prev.map(t => t.id === taskId ? { ...t, progress: p === 100 ? 99 : p, status: 'UPLOADING' } : t));
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          setUploads(prev => prev.map(t => t.id === taskId ? { ...t, status: 'SUCCESS', progress: 100 } : t));
          
          // Trigger automatic finalization if it was from CreatePostModal
          if (options) {
             await api.post('/posts/finalize-video', { 
                videoId,
                customContent: content,
                ...options
             });
          }
        } else {
          setUploads(prev => prev.map(t => t.id === taskId ? { ...t, status: 'ERROR', error: 'Storage upload failed' } : t));
        }
      };

      xhr.onerror = () => {
        setUploads(prev => prev.map(t => t.id === taskId ? { ...t, status: 'ERROR', error: 'Network error during upload' } : t));
      };

      setUploads(prev => prev.map(t => t.id === taskId ? { ...t, upchunkInstance: { abort: () => xhr.abort() } } : t));
      
      xhr.send(file);
      return taskId;

    } catch (err: any) {
      setUploads(prev => prev.map(t => t.id === taskId ? { ...t, status: 'ERROR', error: err.message } : t));
      return taskId;
    }
  }, []);

  /**
   * Industrial Document Upload (Magic-Byte Ready)
   */
  const enlistDocument = useCallback(async (file: File): Promise<{ key: string, publicUrl: string }> => {
      const taskId = crypto.randomUUID();
      
      const newTask: UploadTask = {
          id: taskId,
          file,
          title: file.name,
          progress: 0,
          status: 'WAITING',
          thumbnail: null,
          type: 'document'
      };

      setUploads(prev => [...prev, newTask]);

      try {
          // 1. Get Presigned URL
          const { url, key, publicUrl } = await api.post('/storage/presigned-url', {
              fileName: file.name,
              contentType: file.type,
              folder: 'documents'
          });

          // 2. Upload
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', url, true);
          xhr.setRequestHeader('Content-Type', file.type);

          const uploadPromise = new Promise<{ key: string, publicUrl: string }>((resolve, reject) => {
              xhr.upload.onprogress = (event) => {
                  if (event.lengthComputable) {
                      const p = Math.floor((event.loaded / event.total) * 100);
                      setUploads(prev => prev.map(t => t.id === taskId ? { ...t, progress: p, status: 'UPLOADING' } : t));
                  }
              };

              xhr.onload = async () => {
                  if (xhr.status === 200) {
                      // 3. Verify on server (Magic Number check)
                      try {
                          await api.post('/storage/verify-document', { key });
                          setUploads(prev => prev.map(t => t.id === taskId ? { ...t, status: 'SUCCESS', progress: 100, key, publicUrl } : t));
                          resolve({ key, publicUrl });
                      } catch (err: any) {
                          setUploads(prev => prev.map(t => t.id === taskId ? { ...t, status: 'ERROR', error: 'Verification failed' } : t));
                          reject(new Error('Document verification failed.'));
                      }
                  } else {
                      setUploads(prev => prev.map(t => t.id === taskId ? { ...t, status: 'ERROR', error: 'Upload failed' } : t));
                      reject(new Error('Upload failed'));
                  }
              };

              xhr.onerror = () => reject(new Error('Network error'));
              xhr.send(file);
          });

          return uploadPromise;
      } catch (err: any) {
          setUploads(prev => prev.map(t => t.id === taskId ? { ...t, status: 'ERROR', error: err.message } : t));
          throw err;
      }
  }, []);

  /**
   * High-Fidelity Image Upload (Avatar/Cover/Events)
   */
  const enlistImage = useCallback(async (file: File, folder: 'avatars' | 'covers' | 'events' | 'thumbnails' | 'fires' = 'avatars'): Promise<{ key: string, publicUrl: string }> => {
    const taskId = crypto.randomUUID();
    
    const newTask: UploadTask = {
        id: taskId,
        file,
        title: file.name,
        progress: 0,
        status: 'WAITING',
        thumbnail: null,
        type: 'document' // Using document task type for UI consistency
    };

    setUploads(prev => [...prev, newTask]);

    try {
        const { url, key, publicUrl } = await api.post('/storage/presigned-url', {
            fileName: file.name,
            contentType: file.type,
            folder: folder
        });

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', url, true);
        xhr.setRequestHeader('Content-Type', file.type);

        const uploadPromise = new Promise<{ key: string, publicUrl: string }>((resolve, reject) => {
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const p = Math.floor((event.loaded / event.total) * 100);
                    setUploads(prev => prev.map(t => t.id === taskId ? { ...t, progress: p, status: 'UPLOADING' } : t));
                }
            };

            xhr.onload = async () => {
                if (xhr.status === 200) {
                    try {
                        // Use the Image Verification endpoint
                        await api.post('/storage/verify', { key });
                        setUploads(prev => prev.map(t => t.id === taskId ? { ...t, status: 'SUCCESS', progress: 100, key, publicUrl } : t));
                        resolve({ key, publicUrl });
                    } catch (err: any) {
                        setUploads(prev => prev.map(t => t.id === taskId ? { ...t, status: 'ERROR', error: 'Verification failed' } : t));
                        reject(new Error('Image verification failed.'));
                    }
                } else {
                    setUploads(prev => prev.map(t => t.id === taskId ? { ...t, status: 'ERROR', error: 'Upload failed' } : t));
                    reject(new Error('Upload failed'));
                }
            };
            xhr.onerror = () => reject(new Error('Network error'));
            xhr.send(file);
        });

        return uploadPromise;
    } catch (err: any) {
        setUploads(prev => prev.map(t => t.id === taskId ? { ...t, status: 'ERROR', error: err.message } : t));
        throw err;
    }
  }, []);

  const updateMetadata = useCallback(async (taskId: string, metadata: any) => {
    // Legacy support for video-only creator studio
    const task = uploads.find(t => t.id === taskId);
    if (!task || !task.videoId) return;

    await api.patch(`/videos/${task.videoId}/metadata`, metadata);
    await api.post('/posts/finalize-video', { 
        videoId: task.videoId,
        customContent: metadata.description 
    });
    setUploads(prev => prev.map(t => t.id === taskId ? { ...t, ...metadata } : t));
  }, [uploads]);

  const cancelUpload = useCallback((id: string) => {
    setUploads((prev) => {
      const task = prev.find(t => t.id === id);
      if (task?.upchunkInstance) task.upchunkInstance.abort();
      return prev.filter(t => t.id !== id);
    });
  }, []);

  const clearUpload = useCallback((id: string) => {
    setUploads((prev) => prev.filter(t => t.id !== id));
  }, []);

  return (
    <UploadContext.Provider value={{ uploads, enlistUpload, enlistDocument, enlistImage, updateMetadata, cancelUpload, clearUpload }}>
      {children}
    </UploadContext.Provider>
  );
}

export function useUploads() {
  const context = useContext(UploadContext);
  if (context === undefined) throw new Error('useUploads must be used within an UploadProvider');
  return context;
}
