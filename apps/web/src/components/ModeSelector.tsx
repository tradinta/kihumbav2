import Link from "next/link";
import { motion } from "framer-motion";

type Mode = "feed" | "sparks" | "videos";

interface ModeSelectorProps {
  activeMode: Mode;
}

export default function ModeSelector({ activeMode }: ModeSelectorProps) {
  const modes: { id: Mode; label: string; href: string }[] = [
    { id: "feed", label: "FEED", href: "/" },
    { id: "sparks", label: "SPARKS", href: "/sparks" },
    { id: "videos", label: "VIDEOS", href: "/videos" },
  ];

  return (
    <div className="w-full px-4 mb-10">
      <div className="max-w-[850px] mx-auto relative flex items-center h-12 bg-zinc-100/5 rounded-md p-1 gap-1 border border-white/5 shadow-inner">
        {modes.map((mode) => {
          const isActive = activeMode === mode.id;
          return (
            <Link
              key={mode.id}
              href={mode.href}
              className={`relative flex-1 flex items-center justify-center h-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 z-10 ${
                isActive ? "text-primary-gold" : "text-muted-custom hover:text-zinc-300"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill-majestic"
                  className="absolute inset-0 bg-white shadow-[0_2px_15px_rgba(0,0,0,0.1)] rounded-sm border border-white"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative z-20">{mode.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export type { Mode };
