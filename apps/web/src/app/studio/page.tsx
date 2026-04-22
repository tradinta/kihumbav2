"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudioPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/studio/overview');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="size-10 border-2 border-primary-gold border-t-transparent animate-spin rounded-full" />
    </div>
  );
}
