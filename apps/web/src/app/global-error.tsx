'use client';

import { Inter } from "next/font/google";

const inter = Inter({ 
  subsets: ["latin"],
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-primary-gold text-xl font-black uppercase tracking-widest mb-4">
            Critical System Error
          </h2>
          <p className="text-zinc-500 text-xs font-medium mb-8 max-w-xs">
            A root-level error occurred. The application was unable to recover automatically.
          </p>
          <button
            onClick={() => reset()}
            className="px-8 py-3 bg-primary-gold text-black rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] hover:brightness-110 transition-all"
          >
            Reset Application
          </button>
        </div>
      </body>
    </html>
  );
}
