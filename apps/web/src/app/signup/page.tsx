import { Metadata } from 'next';
import SignupClient from './SignupClient';

export const metadata: Metadata = {
  title: 'Sign Up - Kihumba | The Kenyan Hub',
  description: 'Join Kihumba, the premier network for Kenyan creators, businesses, and communities. Connect locally across 47 counties.',
  openGraph: {
    title: 'Sign Up - Kihumba',
    description: 'Join Kihumba, the premier network for Kenyan creators, businesses, and communities.',
    type: 'website',
    locale: 'en_KE',
    siteName: 'Kihumba',
  },
};

export default function SignupPage() {
  return <SignupClient />;
}
