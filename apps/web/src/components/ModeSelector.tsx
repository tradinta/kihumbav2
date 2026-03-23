"use client";

type Mode = "feed" | "sparks" | "videos";

interface ModeSelectorProps {
  activeMode: Mode;
  onModeChange: (mode: Mode) => void;
}

export default function ModeSelector({ activeMode, onModeChange }: ModeSelectorProps) {
  const modes: { id: Mode; label: string }[] = [
    { id: "feed", label: "Feed" },
    { id: "sparks", label: "Sparks" },
    { id: "videos", label: "Videos" },
  ];

  return (
    <div className="px-4 sticky top-0 lg:relative z-40 bg-page pb-4">
      <div className="flex h-11 items-center justify-center rounded-lg pill-surface p-1 border border-custom">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            aria-label={`Switch to ${mode.label}`}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all rounded ${
              activeMode === mode.id
                ? "bg-[var(--card-bg)] shadow-sm text-primary-gold border border-custom"
                : "text-muted-custom border border-transparent"
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export type { Mode };
