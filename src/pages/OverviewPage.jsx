import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Coins,
  Cpu,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { MetricCard } from '../components/common/MetricCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { DemoBanner } from '../components/common/DemoBanner';
import { useAppData } from '../context/AppDataContext';
import {
  AGENT_OVERVIEW_STATS,
  OVERVIEW_ACTIVITY_SERIES,
  RECENT_WORKFLOW_EXECUTIONS,
} from '../mocks/mockData';
import {
  formatCurrency,
  formatDateTime,
  formatDuration,
  formatNumber,
} from '../utils/formatters';

export function OverviewPage() {
  const navigate = useNavigate();
  const { history } = useAppData();

  const metrics = useMemo(() => {
    const basePosts = 148 + history.length;
    const completed = history.filter((h) => h.status === 'Completed').length + 142;
    const avgAccuracy = history.length
      ? (
          history.reduce((acc, item) => acc + (item.factualAccuracy || 92), 0) /
          history.length
        ).toFixed(1)
      : '95.2';
    const avgExec = history.length
      ? (
          history.reduce((acc, item) => acc + (item.executionTime || 18), 0) /
          history.length
        ).toFixed(1)
      : '18.2';
    const totalTokens =
      1420000 + history.reduce((acc, item) => acc + (item.tokens?.total || 0), 0);
    const totalCost =
      6.42 + history.reduce((acc, item) => acc + (item.cost || 0), 0);

    return {
      totalPosts: basePosts,
      completedWorkflows: completed,
      avgAccuracy: `${avgAccuracy}%`,
      avgExecutionTime: formatDuration(Number(avgExec)),
      totalTokens: formatNumber(totalTokens),
      totalCost: formatCurrency(totalCost),
    };
  }, [history]);

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-ink-primary">
            System Overview
          </h2>
          <p className="text-xs text-ink-secondary mt-0.5">
            Real-time orchestration health, agent throughput, and content quality telemetry.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="secondary" onClick={() => navigate('/workflow')}>
            Inspect Workflow
          </Button>
          <Button onClick={() => navigate('/generate')}>
            <Sparkles className="w-4 h-4" />
            Generate New Content
          </Button>
        </div>
      </div>

      <DemoBanner
        label="Demo Telemetry Active"
        description="Overview aggregates combine simulated historical baselines with your live session drafts."
      />

      {/* 6 Compact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <MetricCard
          label="Total Generated Posts"
          value={metrics.totalPosts}
          delta="+14.2%"
          deltaPositive
          subtext="Last 30 days"
          icon={FileText}
        />
        <MetricCard
          label="Completed Workflows"
          value={metrics.completedWorkflows}
          delta="94.6%"
          deltaPositive
          subtext="Success rate"
          icon={CheckCircle2}
        />
        <MetricCard
          label="Avg Factual Accuracy"
          value={metrics.avgAccuracy}
          delta="+2.1%"
          deltaPositive
          subtext="Fact-Checker score"
          icon={ShieldCheck}
        />
        <MetricCard
          label="Avg Execution Time"
          value={metrics.avgExecutionTime}
          delta="-1.4s"
          deltaPositive
          subtext="End-to-end latency"
          icon={Clock}
        />
        <MetricCard
          label="Total Tokens"
          value={metrics.totalTokens}
          subtext="Input + Output"
          icon={Cpu}
        />
        <MetricCard
          label="Total Inference Cost"
          value={metrics.totalCost}
          subtext="Blended model spend"
          icon={Coins}
        />
      </div>

      {/* Main Grid: Activity Chart + Agent Performance */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card
          title="Content Generation Activity"
          subtitle="Daily generated posts vs. completed workflows (Demo Data)"
          className="xl:col-span-2"
        >
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={OVERVIEW_ACTIVITY_SERIES} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="postsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="wfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="workflows"
                  name="Workflows"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#wfGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="posts"
                  name="Generated Posts"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  fill="url(#postsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          title="Agent Performance Overview"
          subtitle="Average latency, success & token footprint"
          action={
            <button
              type="button"
              onClick={() => navigate('/analytics')}
              className="text-xs text-violet-400 hover:underline inline-flex items-center gap-1"
            >
              Details <ArrowRight className="w-3 h-3" />
            </button>
          }
        >
          <div className="space-y-3">
            {AGENT_OVERVIEW_STATS.map((agent) => (
              <div
                key={agent.agent}
                className="p-3 rounded-lg border border-border-subtle bg-canvas flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-ink-primary">{agent.agent}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                      {agent.successRate}% ok
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-muted mt-1 font-mono">
                    {agent.avgDuration}s avg • {agent.avgTokens.toLocaleString()} tok
                  </p>
                </div>
                {agent.rejectionRate > 0 && (
                  <span className="text-[11px] font-mono text-amber-500 shrink-0">
                    {agent.rejectionRate}% reject
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Grid: Recent Workflow Executions & Recent Generated Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Card
          title="Recent Workflow Executions"
          subtitle="Latest LangGraph state machine runs"
          action={
            <button
              type="button"
              onClick={() => navigate('/workflow')}
              className="text-xs text-violet-400 hover:underline inline-flex items-center gap-1"
            >
              Open Graph <ArrowRight className="w-3 h-3" />
            </button>
          }
          bodyClassName="p-0"
        >
          <div className="divide-y divide-border-subtle">
            {RECENT_WORKFLOW_EXECUTIONS.map((wf) => (
              <div
                key={wf.id}
                className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-canvas-hover/40 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-ink-muted">{wf.id}</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-canvas-elevated text-ink-secondary">
                      {wf.platform}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-ink-primary truncate mt-1">
                    {wf.topic}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block font-mono text-[11px] text-ink-muted">
                    <div>{wf.duration}s</div>
                    <div>{wf.revisions} rev</div>
                  </div>
                  <StatusBadge status={wf.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Recent Generated Content"
          subtitle="Verified outputs ready for publishing"
          action={
            <button
              type="button"
              onClick={() => navigate('/history')}
              className="text-xs text-violet-400 hover:underline inline-flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          }
          bodyClassName="p-0"
        >
          <div className="divide-y divide-border-subtle">
            {history.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-canvas-hover/40 transition-colors cursor-pointer"
                onClick={() => navigate('/history')}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-ink-primary truncate">{item.title}</p>
                  <p className="text-[11px] text-ink-muted mt-0.5">
                    {item.platform} • {item.tone} • {formatDateTime(item.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-xs font-mono text-emerald-500">
                    {item.factualAccuracy}% acc
                  </span>
                  <StatusBadge status={item.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
