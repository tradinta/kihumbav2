import VideosPage from './VideosClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Theater — Cinematic Wide Discovery | Kihumba',
  description: 'Immerse yourself in high-fidelity storytelling. Watch the latest cinematic videos and long-form content from Kihumba’s elite creators.',
};

export default function Page() {
  return <VideosPage />;
}
