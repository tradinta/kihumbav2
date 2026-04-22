import SparksClient from './SparksClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sparks — Short-form Inspiration | Kihumba',
  description: 'Quick bursts of creativity and culture. Discover the most trending short-form sparks and cinematic moments from the Kihumba community.',
};

export default function Page() {
  return <SparksClient />;
}
