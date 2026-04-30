interface Props {
  readingMinutes?: number;
  updatedDate?: string; // e.g. "18.04.2026"
}

export function PageFooterStamp({ readingMinutes = 2, updatedDate = "18.04.2026" }: Props) {
  return (
    <div className="mt-16 flex items-center gap-4 border-t border-white/10 pt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/30">
      <span>Updated {updatedDate}</span>
      <span className="h-px w-4 bg-white/20" />
      <span>{readingMinutes} min read</span>
    </div>
  );
}
