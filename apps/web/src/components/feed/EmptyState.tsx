interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center animate-fade-in-up">
      <div className="size-20 rounded-full pill-surface border border-custom flex items-center justify-center mb-5">
        <span className="material-symbols-outlined text-[36px] text-primary-gold/50">{icon}</span>
      </div>
      <h3 className="text-base font-bold text-main mb-1.5">{title}</h3>
      <p className="text-sm text-muted-custom max-w-xs leading-relaxed">{description}</p>
    </div>
  );
}
