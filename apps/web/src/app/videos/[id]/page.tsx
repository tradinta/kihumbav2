import React from 'react';
import VideoDetailClient from './VideoDetailClient';
import { Metadata } from 'next';

interface Props {
  params: { id: string };
}

// ─── Dynamic Metadata (SEO) ───
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const res = await fetch(`${API_BASE}/videos/${id}`, { next: { revalidate: 3600 } });
    
    if (!res.ok) throw new Error();
    
    const video = await res.json();
    
    if (!video) return { title: 'Video Not Found | Kihumba' };

    const authorName = video.author?.fullName || video.author?.username || 'Creator';
    const description = video.description || 'Discover this high-fidelity cinematic moment on Kihumba.';
    const snippet = description.slice(0, 60);

    return {
      title: `${video.title} — ${authorName} | ${snippet}... | Kihumba`,
      description: description.slice(0, 160),
      openGraph: {
        title: `${video.title} by ${authorName}`,
        description: description,
        images: video.thumbnailUrl ? [video.thumbnailUrl] : [],
        type: 'video.other',
      }
    };
  } catch (error) {
    return { title: 'Cinematic Theater | Kihumba' };
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <VideoDetailClient videoId={id} />;
}
