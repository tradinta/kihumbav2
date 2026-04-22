import MarketplaceClient from './MarketplaceClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace — Premium Curated Commerce | Kihumba',
  description: 'Trade with confidence. Buy and sell premium goods in a secure, high-fidelity marketplace. Discover unique products from verified community members.',
};

export default function Page() {
  return <MarketplaceClient />;
}
