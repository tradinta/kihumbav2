import Home from './FeedClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Hub — Your Curated Feed | Kihumba',
  description: 'Connect with the pulse of the community. Explore trending stories, creative sparks, and the latest updates in a premium, high-fidelity social environment.',
};

export default function Page() {
  return <Home />;
}
