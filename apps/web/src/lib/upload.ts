import { api } from "./api";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export async function uploadToR2(file: File, folder: 'avatars' | 'covers' = 'avatars') {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File is too large. Maximum size is 20MB.');
  }

  // 1. Get Presigned URL from Backend
  const { url, key, publicUrl } = await api.post('/storage/presigned-url', {
    fileName: file.name,
    contentType: file.type,
    folder,
  });

  // 2. Upload directly to R2
  const uploadResponse = await fetch(url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload file to storage server.');
  }

  // 3. Verify upload with Backend (Magic Number Check)
  try {
    await api.post('/storage/verify', { key });
  } catch (err: any) {
    throw new Error(err.data?.message || 'File verification failed. Please ensure you are uploading an actual photo.');
  }

  return publicUrl;
}
