export function MetricCard({ label, value, subtext, delta, deltaPositive, icon: Icon }) {
  return (
    <div className="rounded-xl border border-border-subtle bg-canvas-surface p-4 shadow-subtle hover:border-border-strong transition-colors">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-ink-secondary truncate">{label}</span>
        {Icon && (
          <span className="p-1.5 rounded-md bg-canvas-elevated text-ink-secondary">
            <Icon className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span className="text-xl font-semibold tracking-tight text-ink-primary font-mono">
          {value}
        </span>
        {delta !== undefined && (
          <span
            className={`text-[11px] font-medium font-mono px-1.5 py-0.5 rounded ${
              deltaPositive
                ? 'bg-emerald-500/10 text-emerald-500'
                : 'bg-rose-500/10 text-rose-500'
            }`}
          >
            {delta}
          </span>
        )}
      </div>
      {subtext && <p className="mt-1 text-[11px] text-ink-muted truncate">{subtext}</p>}
    </div>
  );
}
