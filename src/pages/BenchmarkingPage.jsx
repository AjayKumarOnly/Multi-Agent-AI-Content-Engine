import { useEffect, useMemo, useState } from 'react';
import { Scale, Play, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { DemoBanner } from '../components/common/DemoBanner';
import { benchmarkService } from '../services/benchmarkService';
import { calculateDeltaPercent, formatCurrency } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

export function BenchmarkingPage() {
  const { addToast } = useToast();
  const [topic, setTopic] = useState(
    'How Retrieval-Augmented Generation Reduces LLM Hallucinations in Enterprise Search'
  );
  const [criteria, setCriteria] = useState(
    'Technical Accuracy, Source Grounding, Executive Readability'
  );
  const [benchmark, setBenchmark] = useState(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    benchmarkService.getLatestBenchmark().then(setBenchmark);
  }, []);

  const handleRun = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setRunning(true);
    try {
      const res = await benchmarkService.runBenchmark({ topic, criteria });
      setBenchmark(res);
      addToast({ title: 'Benchmark comparison complete', type: 'success' });
    } finally {
      setRunning(false);
    }
  };

  const rows = useMemo(() => {
    if (!benchmark) return [];
    const s = benchmark.singlePrompt;
    const m = benchmark.multiAgent;
    return [
      {
        metric: 'Factual Accuracy',
        single: `${s.factualAccuracy}%`,
        multi: `${m.factualAccuracy}%`,
        ...calculateDeltaPercent(s.factualAccuracy, m.factualAccuracy, false),
      },
      {
        metric: 'Content Quality Score',
        single: `${s.contentQuality}/100`,
        multi: `${m.contentQuality}/100`,
        ...calculateDeltaPercent(s.contentQuality, m.contentQuality, false),
      },
      {
        metric: 'Research Coverage',
        single: `${s.researchCoverage}%`,
        multi: `${m.researchCoverage}%`,
        ...calculateDeltaPercent(s.researchCoverage, m.researchCoverage, false),
      },
      {
        metric: 'Unsupported Claim Rate',
        single: `${s.unsupportedClaimRate}%`,
        multi: `${m.unsupportedClaimRate}%`,
        ...calculateDeltaPercent(s.unsupportedClaimRate, m.unsupportedClaimRate, true),
      },
      {
        metric: 'Token Consumption',
        single: s.tokens.toLocaleString(),
        multi: m.tokens.toLocaleString(),
        ...calculateDeltaPercent(s.tokens, m.tokens, true),
      },
      {
        metric: 'Execution Latency',
        single: `${s.latency}s`,
        multi: `${m.latency}s`,
        ...calculateDeltaPercent(s.latency, m.latency, true),
      },
      {
        metric: 'Inference Cost',
        single: formatCurrency(s.cost),
        multi: formatCurrency(m.cost),
        ...calculateDeltaPercent(s.cost, m.cost, true),
      },
    ];
  }, [benchmark]);

  const qualityChartData = useMemo(() => {
    if (!benchmark) return [];
    const s = benchmark.singlePrompt;
    const m = benchmark.multiAgent;
    return [
      { name: 'Factual Accuracy (%)', single: s.factualAccuracy, multi: m.factualAccuracy },
      { name: 'Content Quality', single: s.contentQuality, multi: m.contentQuality },
      { name: 'Research Coverage (%)', single: s.researchCoverage, multi: m.researchCoverage },
      { name: 'Unsupported Claims (%)', single: s.unsupportedClaimRate, multi: m.unsupportedClaimRate },
    ];
  }, [benchmark]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-ink-primary">
          Benchmarking: Single-Prompt vs. Multi-Agent
        </h2>
        <p className="text-xs text-ink-secondary mt-0.5">
          Evaluate quality, factual grounding, latency, and cost trade-offs on identical prompts.
        </p>
      </div>

      <DemoBanner
        label="Simulated Benchmark Harness"
        description="Percentages are computed dynamically from actual benchmark outputs, highlighting both quality gains and latency/cost trade-offs."
      />

      {/* Run Benchmark Form */}
      <Card title="Run Head-to-Head Benchmark" subtitle="Execute both pipelines on the same topic">
        <form onSubmit={handleRun} className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
          <div className="lg:col-span-5">
            <label className="block text-xs font-medium text-ink-primary mb-1.5">
              Benchmark Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-3 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="lg:col-span-5">
            <label className="block text-xs font-medium text-ink-primary mb-1.5">
              Evaluation Criteria
            </label>
            <input
              type="text"
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-3 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="lg:col-span-2">
            <Button type="submit" loading={running} className="w-full">
              <Play className="w-3.5 h-3.5" />
              Run Benchmark
            </Button>
          </div>
        </form>
      </Card>

      {benchmark && (
        <>
          {/* Comparison Table + Chart */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            <Card
              title="Metric Comparison & Delta"
              subtitle="Computed from latest run"
              className="xl:col-span-7"
              bodyClassName="p-0 overflow-x-auto"
            >
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border-subtle bg-canvas-elevated/50 text-ink-muted">
                    <th className="py-2.5 px-4 font-medium">Metric</th>
                    <th className="py-2.5 px-4 font-medium">Single-Prompt LLM</th>
                    <th className="py-2.5 px-4 font-medium">Multi-Agent Workflow</th>
                    <th className="py-2.5 px-4 font-medium text-right">Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {rows.map((r) => (
                    <tr key={r.metric} className="hover:bg-canvas-hover/40">
                      <td className="py-2.5 px-4 font-medium text-ink-primary">{r.metric}</td>
                      <td className="py-2.5 px-4 font-mono text-ink-secondary">{r.single}</td>
                      <td className="py-2.5 px-4 font-mono font-semibold text-ink-primary">
                        {r.multi}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <span
                          className={`inline-flex items-center gap-0.5 font-mono text-[11px] px-1.5 py-0.5 rounded ${
                            r.improved
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-rose-500/10 text-rose-500'
                          }`}
                        >
                          {r.pct > 0 ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {r.pct > 0 ? `+${r.pct}%` : `${r.pct}%`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card
              title="Quality & Grounding Comparison"
              subtitle="Higher accuracy & coverage vs. lower unsupported claims"
              className="xl:col-span-5"
            >
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={qualityChartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
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
                    <Bar dataKey="single" name="Single-Prompt" fill="#71717a" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="multi" name="Multi-Agent" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Side-by-Side Content Previews */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card
              title="Single-Prompt LLM Output"
              subtitle={`${benchmark.singlePrompt.latency}s • ${benchmark.singlePrompt.tokens.toLocaleString()} tokens • ${formatCurrency(benchmark.singlePrompt.cost)}`}
            >
              <div className="text-xs leading-relaxed text-ink-secondary whitespace-pre-wrap bg-canvas p-3.5 rounded-lg border border-border-subtle">
                {benchmark.singlePrompt.preview}
              </div>
            </Card>

            <Card
              title="Multi-Agent Workflow Output"
              subtitle={`${benchmark.multiAgent.latency}s • ${benchmark.multiAgent.tokens.toLocaleString()} tokens • ${formatCurrency(benchmark.multiAgent.cost)}`}
              action={
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-500">
                  <Scale className="w-3.5 h-3.5" /> Verified
                </span>
              }
            >
              <div className="text-xs leading-relaxed text-ink-primary whitespace-pre-wrap bg-canvas p-3.5 rounded-lg border border-violet-500/30">
                {benchmark.multiAgent.preview}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
