import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Search,
  PenTool,
  FileCheck2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

const AGENT_ICONS = {
  Researcher: Search,
  Writer: PenTool,
  Editor: FileCheck2,
  'Fact-Checker': ShieldCheck,
  UserInput: PlayCircle,
  FinalOutput: CheckCircle2,
  HumanReview: AlertTriangle,
};

export function AgentNode({ data }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = AGENT_ICONS[data.agentKey] || Search;
  const isTerminal = data.isTerminal;
  const isActive = data.isActive;
  const status = data.status || 'Pending';

  if (isTerminal) {
    const terminalBorder =
      data.agentKey === 'HumanReview'
        ? isActive
          ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-500/10'
          : 'border-amber-500/40 bg-canvas-surface'
        : isActive
          ? 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-500/10'
          : 'border-border-subtle bg-canvas-surface';

    return (
      <div
        className={`px-3.5 py-2.5 rounded-xl border shadow-subtle min-w-[160px] transition-all ${terminalBorder}`}
      >
        <Handle type="target" position={Position.Left} className="!bg-border-strong !w-2 !h-2" />
        <Handle type="source" position={Position.Right} className="!bg-border-strong !w-2 !h-2" />
        <div className="flex items-center gap-2">
          <Icon
            className={`w-4 h-4 ${
              data.agentKey === 'HumanReview'
                ? 'text-amber-500'
                : data.agentKey === 'FinalOutput'
                  ? 'text-emerald-500'
                  : 'text-violet-400'
            }`}
          />
          <div>
            <p className="text-xs font-semibold text-ink-primary">{data.label}</p>
            <p className="text-[10px] text-ink-muted">{data.subtitle}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-[235px] rounded-xl border bg-canvas-surface shadow-card transition-all ${
        isActive
          ? 'border-violet-500 ring-2 ring-violet-500/30'
          : status === 'Completed'
            ? 'border-emerald-500/40'
            : status === 'Revising'
              ? 'border-amber-500/50'
              : status === 'Failed'
                ? 'border-rose-500/50'
                : 'border-border-subtle'
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-violet-500 !w-2.5 !h-2.5" />
      <Handle type="source" position={Position.Right} className="!bg-violet-500 !w-2.5 !h-2.5" />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!bg-amber-500 !w-2 !h-2"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!bg-amber-500 !w-2 !h-2"
      />

      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-lg bg-accent-subtle text-violet-400 shrink-0">
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-ink-primary truncate">{data.label}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
            className="p-1 rounded text-ink-muted hover:text-ink-primary hover:bg-canvas-hover"
            aria-label="Toggle agent execution details"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2">
          <StatusBadge status={status} />
          <span className="text-[11px] font-mono text-ink-muted">
            Rev: <strong className="text-ink-primary">{data.revisions ?? 0}</strong>
          </span>
        </div>

        <div className="mt-2.5 grid grid-cols-2 gap-2 pt-2 border-t border-border-subtle text-[11px] font-mono">
          <div>
            <span className="text-ink-muted block text-[10px]">Duration</span>
            <span className="text-ink-primary">{data.duration ?? 0}s</span>
          </div>
          <div>
            <span className="text-ink-muted block text-[10px]">Tokens</span>
            <span className="text-ink-primary">{(data.tokens ?? 0).toLocaleString()}</span>
          </div>
        </div>

        {expanded && (
          <div className="mt-2.5 pt-2 border-t border-border-subtle text-[11px] text-ink-secondary space-y-1">
            <p className="font-medium text-ink-primary">Execution Detail</p>
            <p className="leading-relaxed">
              {data.details || data.role || 'Waiting for upstream agent handoff.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
