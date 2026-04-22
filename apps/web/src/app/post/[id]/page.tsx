import React from 'react';
import PostDetailClient from './PostDetailClient';
import { Metadata } from 'next';

interface Props {
  params: { id: string };
}

// ─── Dynamic Metadata (SEO) ───
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const res = await fetch(`${API_BASE}/posts/${id}`, { next: { revalidate: 3600 } });
    
    if (!res.ok) throw new Error();
    
    const post = await res.json();
    
    if (!post) return { title: 'Post Not Found | Kihumba' };

    const authorName = post.author?.fullName || post.author?.username || 'User';
    const snippet = post.content?.slice(0, 60) || 'Discussion on Kihumba';

    return {
      title: `${authorName} on Kihumba: "${snippet}..."`,
      description: post.content || `Check out this discussion by ${authorName} on Kihumba.`,
      openGraph: {
        images: post.media?.[0]?.url ? [post.media[0].url] : [],
      }
    };
  } catch (error) {
    return { title: 'Kihumba Discussion' };
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <PostDetailClient postId={id} />;
}
