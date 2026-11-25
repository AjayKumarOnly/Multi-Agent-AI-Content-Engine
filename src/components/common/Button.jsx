import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary:
    'bg-violet-600 text-white hover:bg-violet-700 border border-violet-600 shadow-subtle focus-visible:ring-violet-500',
  secondary:
    'bg-canvas-surface text-ink-primary hover:bg-canvas-hover border border-border-subtle shadow-subtle focus-visible:ring-violet-500',
  ghost:
    'bg-transparent text-ink-secondary hover:text-ink-primary hover:bg-canvas-hover border border-transparent focus-visible:ring-violet-500',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 border border-rose-600 shadow-subtle focus-visible:ring-rose-500',
};

const SIZES = {
  sm: 'h-8 px-2.5 text-xs gap-1.5 rounded-md',
  md: 'h-9 px-3.5 text-sm gap-2 rounded-lg',
  lg: 'h-10 px-4 text-sm gap-2 rounded-lg',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-canvas disabled:opacity-50 disabled:pointer-events-none ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
      {children}
    </button>
  );
}
