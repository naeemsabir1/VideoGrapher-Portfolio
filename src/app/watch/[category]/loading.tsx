export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[var(--text-primary)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[var(--accent-terra)] animate-pulse opacity-80" />
        <p className="text-[var(--text-secondary)] font-medium text-sm animate-pulse">Loading reel...</p>
      </div>
    </div>
  );
}
