'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Home, AlertTriangle, ChevronDown, Copy, Check } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    console.error('[Kihumba Error]', error);
  }, [error]);

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const copyError = () => {
    const info = `Kihumba Error Report\n---\nMessage: ${error.message}\nDigest: ${error.digest ?? 'N/A'}\nTime: ${new Date().toISOString()}\nStack:\n${error.stack ?? 'No stack trace'}`;
    navigator.clipboard.writeText(info);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow — slightly red-tinted gold */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(197,160,89,0.05) 0%, rgba(160,80,60,0.03) 50%, transparent 70%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 max-w-md w-full text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15, type: 'spring', stiffness: 140 }}
          className="mx-auto mb-8 size-24 rounded-full border-2 border-accent-gold/20 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(197,160,89,0.08) 0%, rgba(160,80,60,0.04) 100%)' }}
        >
          <AlertTriangle size={38} className="text-accent-gold/60" strokeWidth={1.2} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xl font-bold tracking-[0.2em] uppercase text-primary-gold gold-glow mb-2"
        >
          Something Broke
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-[11px] font-bold text-muted-custom leading-relaxed mb-8 max-w-xs mx-auto"
        >
          An unexpected error occurred while loading this page. This has been logged — try refreshing, or head back home.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col gap-2 mb-6"
        >
          <button
            onClick={() => reset()}
            className="w-full py-3 bg-primary-gold text-black rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] hover:brightness-110 transition-all active:scale-[0.98] shadow-lg shadow-primary-gold/10 flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} /> Try Again
          </button>

          <a href="/">
            <button className="w-full py-2.5 card-surface rounded-lg text-[9px] font-bold uppercase tracking-widest text-muted-custom hover:text-primary-gold hover:border-primary-gold/30 transition-all flex items-center justify-center gap-1.5">
              <Home size={12} /> Go Home
            </button>
          </a>
        </motion.div>

        {/* Error details (collapsible) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="mx-auto flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.2em] text-muted-custom/50 hover:text-muted-custom transition-colors mb-2"
          >
            Technical Details <ChevronDown size={10} className={`transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          </button>

          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="card-surface rounded-lg p-3 text-left overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[8px] font-bold uppercase tracking-widest text-muted-custom">Error Message</span>
                <button onClick={copyError} className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-primary-gold hover:underline">
                  {copied ? <><Check size={8} /> Copied</> : <><Copy size={8} /> Copy</>}
                </button>
              </div>
              <p className="text-[10px] font-mono text-accent-gold/80 break-all mb-2">{error.message}</p>
              {error.digest && (
                <p className="text-[9px] text-muted-custom"><span className="font-bold">Digest:</span> {error.digest}</p>
              )}
              {error.stack && (
                <details className="mt-2">
                  <summary className="text-[8px] font-bold uppercase tracking-widest text-muted-custom/50 cursor-pointer hover:text-muted-custom">
                    Stack trace
                  </summary>
                  <pre className="mt-1 text-[8px] font-mono text-muted-custom/60 whitespace-pre-wrap break-all max-h-32 overflow-y-auto no-scrollbar">
                    {error.stack}
                  </pre>
                </details>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="h-px bg-[var(--border-color)] mt-6 mb-4"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-custom/40"
        >
          Kihumba · {time}
        </motion.p>
      </motion.div>
    </div>
  );
}
