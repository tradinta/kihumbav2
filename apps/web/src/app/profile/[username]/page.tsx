import React from 'react';
import ProfileClient from './ProfileClient';
import { Metadata } from 'next';

interface Props {
  params: { username: string };
}

// ─── Dynamic Metadata (SEO) ───
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  
  try {
    // We fetch from the internal API URL for server-side
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const res = await fetch(`${API_BASE}/users/profile/${username}`, { next: { revalidate: 3600 } });
    
    if (!res.ok) throw new Error();
    
    const user = await res.ok ? await res.json() : null;
    
    const name = user.fullName === 'IDENTITY_LOCKED' ? 'Kihumba User' : user.fullName;

    return {
      title: `${name} (@${user.username}) on Kihumba`,
      description: user.fullName === 'IDENTITY_LOCKED' ? 'View this profile on Kihumba.' : (user.bio || `Check out ${user.fullName}'s profile on Kihumba.`),
      openGraph: {
        images: [user.avatar || ''],
      }
    };
  } catch (error) {
    return { title: 'Kihumba Profile' };
  }
}

export default async function Page({ params }: Props) {
  const { username } = await params;
  return <ProfileClient username={username} />;
}
