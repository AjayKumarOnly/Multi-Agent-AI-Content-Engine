export function Card({ title, subtitle, action, children, className = '', bodyClassName = '' }) {
  return (
    <div
      className={`rounded-xl border border-border-subtle bg-canvas-surface shadow-subtle ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-border-subtle">
          <div className="min-w-0">
            {title && (
              <h3 className="text-sm font-semibold text-ink-primary truncate">{title}</h3>
            )}
            {subtitle && (
              <p className="text-xs text-ink-muted mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={bodyClassName || 'p-4'}>{children}</div>
    </div>
  );
}
