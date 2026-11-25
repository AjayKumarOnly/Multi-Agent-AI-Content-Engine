export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 rounded-xl border border-dashed border-border-strong bg-canvas-surface/50">
      {Icon && (
        <div className="p-3 rounded-full bg-canvas-elevated text-ink-muted mb-3">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <h4 className="text-sm font-medium text-ink-primary">{title}</h4>
      {description && (
        <p className="text-xs text-ink-muted mt-1 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-md bg-canvas-elevated ${className}`} />;
}
