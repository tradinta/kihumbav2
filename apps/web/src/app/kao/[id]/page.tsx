import React from 'react';
import KaoDetailClient from './KaoDetailClient';
import { Metadata } from 'next';

interface Props {
  params: { id: string };
}

// ─── Dynamic Metadata (SEO) ───
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const res = await fetch(`${API_BASE}/kao/listings/${id}`, { next: { revalidate: 3600 } });
    
    if (!res.ok) throw new Error();
    
    const property = await res.json();
    
    if (!property) return { title: 'Property Not Found | Kihumba' };

    const priceStr = `KES ${property.price.toLocaleString()}/mo`;
    const location = `${property.area}, ${property.county}`;
    const snippet = property.description.slice(0, 60);

    return {
      title: `${property.title} — ${priceStr} | ${location} | ${snippet}... | Kihumba`,
      description: property.description.slice(0, 160),
      openGraph: {
        title: `${property.title} in ${property.area}`,
        description: `View this ${property.type.toLowerCase()} for ${priceStr} on Kihumba KAO.`,
        images: property.images?.[0] ? [property.images[0]] : [],
      }
    };
  } catch (error) {
    return { title: 'Property Details | Kihumba KAO' };
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <KaoDetailClient id={id} />;
}
