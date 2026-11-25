import { useEffect, useState } from 'react';
import {
  Activity,
  Clock,
  Cpu,
  Coins,
  CheckCircle2,
  ShieldCheck,
  Repeat,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { MetricCard } from '../components/common/MetricCard';
import { Card } from '../components/common/Card';
import { DemoBanner } from '../components/common/DemoBanner';
import { Skeleton } from '../components/common/EmptyState';
import { analyticsService } from '../services/analyticsService';
import { formatCurrency, formatDuration, formatNumber } from '../utils/formatters';

export function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');
  const [agentFilter, setAgentFilter] = useState('All');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    analyticsService.getMetrics({ dateRange, agent: agentFilter }).then((res) => {
      if (!active) return;
      setData(res);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [dateRange, agentFilter]);

  const filteredTokens =
    data?.tokenBreakdown?.filter((row) => agentFilter === 'All' || row.agent === agentFilter) ||
    [];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-ink-primary">
            Performance Analytics
          </h2>
          <p className="text-xs text-ink-secondary mt-0.5">
            Observability metrics for API latency, token consumption, agent rejection rates, and cost.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            aria-label="Filter by date range"
            className="h-9 px-3 rounded-lg border border-border-subtle bg-canvas-surface text-xs text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            aria-label="Filter by agent"
            className="h-9 px-3 rounded-lg border border-border-subtle bg-canvas-surface text-xs text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="All">All Agents</option>
            <option value="Researcher">Researcher</option>
            <option value="Writer">Writer</option>
            <option value="Editor">Editor</option>
            <option value="Fact-Checker">Fact-Checker</option>
          </select>
        </div>
      </div>

      <DemoBanner
        label="Demo Observability Metrics"
        description="Analytics figures below represent simulated system telemetry for the selected window."
      />

      {loading || !data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <>
          {/* KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <MetricCard
              label="Total API Requests"
              value={formatNumber(data.summary.totalRequests)}
              icon={Activity}
              subtext={`Window: ${dateRange}`}
            />
            <MetricCard
              label="Average API Latency"
              value={formatDuration(data.summary.avgLatency)}
              icon={Clock}
              subtext="End-to-end workflow"
            />
            <MetricCard
              label="Input / Output Tokens"
              value={`${formatNumber(data.summary.inputTokens)} / ${formatNumber(data.summary.outputTokens)}`}
              icon={Cpu}
              subtext="Prompt vs completion"
            />
            <MetricCard
              label="Inference Cost / Post"
              value={formatCurrency(data.summary.costPerPost)}
              icon={Coins}
              subtext="Blended model rate"
            />
            <MetricCard
              label="Workflow Success Rate"
              value={`${data.summary.successRate}%`}
              delta={`${data.summary.failureRate}% fail`}
              deltaPositive
              icon={CheckCircle2}
            />
            <MetricCard
              label="Avg Revision Count"
              value={data.summary.avgRevisions}
              icon={Repeat}
              subtext="Editor + Fact-Checker loops"
            />
            <MetricCard
              label="Factual Accuracy Score"
              value={`${data.summary.factualAccuracy}%`}
              icon={ShieldCheck}
              subtext="Verified claims ratio"
            />
            <MetricCard
              label="Human Review Rate"
              value={`${data.summary.humanReviewRate}%`}
              icon={Activity}
              subtext="Max-revision escalations"
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <Card
              title="Agent-Wise Execution Duration (s)"
              subtitle="Average latency trend across workflow stages"
              className="xl:col-span-2"
            >
              <div className="h-[270px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.latencyTrend} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border-subtle)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    {(agentFilter === 'All' || agentFilter === 'Researcher') && (
                      <Line type="monotone" dataKey="researcher" name="Researcher" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                    )}
                    {(agentFilter === 'All' || agentFilter === 'Writer') && (
                      <Line type="monotone" dataKey="writer" name="Writer" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                    )}
                    {(agentFilter === 'All' || agentFilter === 'Editor') && (
                      <Line type="monotone" dataKey="editor" name="Editor" stroke="#f59e0b" strokeWidth={2} dot={false} />
                    )}
                    {(agentFilter === 'All' || agentFilter === 'Fact-Checker') && (
                      <Line type="monotone" dataKey="factChecker" name="Fact-Checker" stroke="#10b981" strokeWidth={2} dot={false} />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card
              title="Workflow Outcome Distribution"
              subtitle="Completed vs. Human Review vs. Failed"
            >
              <div className="h-[270px] w-full flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.outcomeDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="48%"
                      innerRadius={58}
                      outerRadius={86}
                      paddingAngle={3}
                    >
                      {data.outcomeDistribution.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border-subtle)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <Card
              title="Input vs. Output Token Consumption by Agent"
              subtitle="Total tokens processed per specialized agent"
            >
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredTokens} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                    <XAxis dataKey="agent" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border-subtle)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="input" name="Input Tokens" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="output" name="Output Tokens" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card
              title="Agent Rejection & Revision Trigger Rates"
              subtitle="Percentage of drafts routed back for correction"
            >
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.rejectionRates} layout="vertical" margin={{ top: 12, right: 24, left: 20, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} />
                    <XAxis type="number" unit="%" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="agent" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border-subtle)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="rate" name="Rejection Rate (%)" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
