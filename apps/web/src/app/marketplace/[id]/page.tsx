import React from 'react';
import MarketListingClient from './MarketListingClient';
import { Metadata } from 'next';

interface Props {
  params: { id: string };
}

// ─── Dynamic Metadata (SEO) ───
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const res = await fetch(`${API_BASE}/marketplace/listings/${id}`, { next: { revalidate: 3600 } });
    
    if (!res.ok) throw new Error();
    
    const item = await res.json();
    
    if (!item) return { title: 'Listing Not Found | Kihumba' };

    const priceStr = `KES ${item.price.toLocaleString()}`;
    const location = `${item.area}, ${item.county}`;
    const snippet = item.description.slice(0, 60);

    return {
      title: `${item.title} — ${priceStr} | ${location} | ${snippet}... | Kihumba`,
      description: item.description.slice(0, 160),
      openGraph: {
        title: `${item.title} - ${priceStr}`,
        description: `Explore this ${item.category} item for ${priceStr} in ${location} on Kihumba.`,
        images: item.images?.[0] ? [item.images[0]] : [],
      }
    };
  } catch (error) {
    return { title: 'Marketplace Listing | Kihumba' };
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <MarketListingClient id={id} />;
}
