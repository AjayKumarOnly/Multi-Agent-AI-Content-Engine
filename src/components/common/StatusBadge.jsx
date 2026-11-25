const STATUS_STYLES = {
  Pending: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  Running: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  Completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25',
  Approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25',
  Verified: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25',
  Revising: 'bg-amber-500/10 text-amber-500 border-amber-500/25',
  'Revision Requested': 'bg-amber-500/10 text-amber-500 border-amber-500/25',
  Unresolved: 'bg-amber-500/10 text-amber-500 border-amber-500/25',
  'Human Review Required': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Escalated: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Failed: 'bg-rose-500/10 text-rose-500 border-rose-500/25',
  Unsupported: 'bg-rose-500/10 text-rose-500 border-rose-500/25',
  Draft: 'bg-sky-500/10 text-sky-400 border-sky-500/25',
};

const DOT_STYLES = {
  Pending: 'bg-zinc-400',
  Running: 'bg-violet-400 animate-pulse',
  Completed: 'bg-emerald-500',
  Approved: 'bg-emerald-500',
  Verified: 'bg-emerald-500',
  Revising: 'bg-amber-500 animate-pulse',
  'Revision Requested': 'bg-amber-500',
  Unresolved: 'bg-amber-500',
  'Human Review Required': 'bg-amber-400',
  Escalated: 'bg-amber-400',
  Failed: 'bg-rose-500',
  Unsupported: 'bg-rose-500',
  Draft: 'bg-sky-400',
};

export function StatusBadge({ status, className = '' }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  const dot = DOT_STYLES[status] || DOT_STYLES.Pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border whitespace-nowrap ${style} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}
