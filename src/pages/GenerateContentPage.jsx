import { useEffect, useState } from 'react';
import {
  Sparkles,
  Square,
  AlertCircle,
  CheckCircle2,
  Loader2,
  GitBranch,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/StatusBadge';
import { ExecutionLogsPanel } from '../components/logs/ExecutionLogsPanel';
import { ContentPreviewPanel } from '../components/preview/ContentPreviewPanel';
import { AI_MODELS, LENGTHS, PLATFORMS, TONES } from '../constants';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { useWorkflowExecution } from '../hooks/useWorkflowExecution';

export function GenerateContentPage() {
  const { settings, saveContentItem, duplicateSeed, setDuplicateSeed } = useAppData();
  const { addToast } = useToast();
  const {
    isRunning,
    agentStates,
    logs,
    result,
    setResult,
    error,
    progress,
    start,
    cancel,
  } = useWorkflowExecution();

  const [form, setForm] = useState({
    topic: '',
    platform: settings.contentDefaults?.platform || 'LinkedIn',
    audience: settings.contentDefaults?.audience || 'Software Engineers & AI Architects',
    tone: settings.contentDefaults?.tone || 'Technical',
    length: settings.contentDefaults?.length || 'Medium',
    numberOfPosts: 1,
    instructions: '',
    maxRevisions: settings.orchestration?.maxRevisionRounds ?? 2,
    model: settings.aiModel?.defaultModel || 'gemini-2.5-pro',
    scenario: 'editor_revision',
  });

  const [validationError, setValidationError] = useState('');
  const [rightTab, setRightTab] = useState('execution'); // 'execution' | 'output'

  // Sync defaults when async settings load if form is still untouched
  useEffect(() => {
    setForm((prev) => {
      if (prev.topic) return prev;
      return {
        ...prev,
        platform: settings.contentDefaults?.platform || prev.platform,
        audience: settings.contentDefaults?.audience || prev.audience,
        tone: settings.contentDefaults?.tone || prev.tone,
        length: settings.contentDefaults?.length || prev.length,
        maxRevisions: settings.orchestration?.maxRevisionRounds ?? prev.maxRevisions,
        model: settings.aiModel?.defaultModel || prev.model,
      };
    });
  }, [settings]);

  // Hydrate if user duplicated an item from Content History
  useEffect(() => {
    if (duplicateSeed) {
      setForm((prev) => ({
        ...prev,
        topic: duplicateSeed.title || prev.topic,
        platform: duplicateSeed.platform || prev.platform,
        audience: duplicateSeed.audience || prev.audience,
        tone: duplicateSeed.tone || prev.tone,
        length: duplicateSeed.length || prev.length,
        model: duplicateSeed.model || prev.model,
      }));
      setDuplicateSeed(null);
      addToast({ title: 'Loaded configuration from history item', type: 'info' });
    }
  }, [duplicateSeed, setDuplicateSeed, addToast]);

  // Automatically switch to Output tab when generation completes
  useEffect(() => {
    if (result) {
      setRightTab('output');
      addToast({
        title:
          result.status === 'Human Review Required'
            ? 'Workflow escalated to Human Review'
            : 'Content generated & verified',
        description: `Factual accuracy: ${result.factualAccuracy}% • Quality: ${result.qualityScore}/100`,
        type: result.status === 'Human Review Required' ? 'info' : 'success',
      });
    }
  }, [result, addToast]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.topic.trim() || form.topic.trim().length < 5) {
      setValidationError('Please enter a topic or content idea (at least 5 characters).');
      return;
    }
    if (!form.audience.trim()) {
      setValidationError('Please specify a target audience.');
      return;
    }
    setValidationError('');
    setRightTab('execution');
    start(form);
  };

  const handleSaveDraft = async (item) => {
    await saveContentItem({ ...item, status: item.status === 'Completed' ? 'Draft' : item.status });
    addToast({ title: 'Saved to Content History', type: 'success' });
  };

  const handleUpdateResultContent = (nextText) => {
    setResult((prev) => (prev ? { ...prev, content: nextText } : prev));
  };

  const agentOrder = ['Researcher', 'Writer', 'Editor', 'Fact-Checker'];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-ink-primary">
            Generate Content
          </h2>
          <p className="text-xs text-ink-secondary mt-0.5">
            Configure target constraints and stream live 4-agent research, drafting, editing, and fact-checking.
          </p>
        </div>
      </div>

      {/* Split-screen layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Left Panel: Content Configuration */}
        <Card
          title="Content Configuration"
          subtitle="Parameters sent to Spring Boot → FastAPI LangGraph"
          className="xl:col-span-5"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {validationError && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-xs text-rose-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-ink-primary mb-1.5">
                Topic or Content Idea <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                placeholder="e.g., Why LangGraph State Machines Outperform Linear Prompt Chains in Production"
                className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-ink-primary mb-1.5">
                  Target Platform
                </label>
                <select
                  value={form.platform}
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                  className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-2.5 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-primary mb-1.5">
                  Writing Tone
                </label>
                <select
                  value={form.tone}
                  onChange={(e) => setForm({ ...form, tone: e.target.value })}
                  className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-2.5 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {TONES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-primary mb-1.5">
                Target Audience <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.audience}
                onChange={(e) => setForm({ ...form, audience: e.target.value })}
                placeholder="e.g., Staff Engineers, CTOs, ML Platform Teams"
                className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-3 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-ink-primary mb-1.5">
                  Content Length
                </label>
                <select
                  value={form.length}
                  onChange={(e) => setForm({ ...form, length: e.target.value })}
                  className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-2.5 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {LENGTHS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-primary mb-1.5">
                  Number of Posts
                </label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={form.numberOfPosts}
                  onChange={(e) => setForm({ ...form, numberOfPosts: Number(e.target.value) })}
                  className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-3 text-sm text-ink-primary font-mono focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium text-ink-primary mb-1.5">
                  Max Revisions
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={form.maxRevisions}
                  onChange={(e) => setForm({ ...form, maxRevisions: Number(e.target.value) })}
                  className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-3 text-sm text-ink-primary font-mono focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-ink-primary mb-1.5">
                  AI Model Selection
                </label>
                <select
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-2.5 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {AI_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label} ({m.tier})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-ink-primary mb-1.5">
                  Demo Execution Path
                </label>
                <select
                  value={form.scenario}
                  onChange={(e) => setForm({ ...form, scenario: e.target.value })}
                  className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-2.5 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="editor_revision">Editor Revision Loop</option>
                  <option value="fact_check_loop">Fact-Check Correction Loop</option>
                  <option value="happy_path">Direct Approval (0 Revisions)</option>
                  <option value="human_review">Max Revisions → Human Review</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-ink-primary mb-1.5">
                Additional Instructions
              </label>
              <textarea
                rows={2}
                value={form.instructions}
                onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                placeholder="Optional: cite specific benchmarks, avoid buzzwords, include CTA..."
                className="w-full rounded-lg border border-border-subtle bg-canvas px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <Button type="submit" size="lg" loading={isRunning} className="flex-1">
                <Sparkles className="w-4 h-4" />
                {isRunning ? 'Executing Workflow...' : 'Generate Content'}
              </Button>
              {isRunning && (
                <Button type="button" variant="danger" size="lg" onClick={cancel}>
                  <Square className="w-3.5 h-3.5" />
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* Right Panel: Live Agent Execution & Generated Output */}
        <div className="xl:col-span-7 space-y-4">
          {/* Execution Progress Stepper */}
          <Card bodyClassName="p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-semibold text-ink-primary">
                  Agent Pipeline Progress
                </span>
              </div>
              <span className="text-xs font-mono text-ink-muted">{progress}%</span>
            </div>

            <div className="w-full h-1.5 rounded-full bg-canvas-elevated overflow-hidden">
              <div
                className="h-full bg-violet-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {agentOrder.map((name) => {
                const st = agentStates[name] || { status: 'Pending', duration: 0, tokens: 0 };
                return (
                  <div
                    key={name}
                    className={`p-2.5 rounded-lg border text-xs transition-colors ${
                      st.status === 'Running' || st.status === 'Revising'
                        ? 'border-violet-500 bg-accent-subtle'
                        : st.status === 'Completed'
                          ? 'border-emerald-500/30 bg-emerald-500/5'
                          : 'border-border-subtle bg-canvas'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-ink-primary truncate">{name}</span>
                      {st.status === 'Running' ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400 shrink-0" />
                      ) : st.status === 'Completed' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : null}
                    </div>
                    <div className="mt-1.5">
                      <StatusBadge status={st.status} />
                    </div>
                    <div className="mt-1.5 text-[10px] font-mono text-ink-muted">
                      {st.duration}s • {st.tokens.toLocaleString()} tok
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {error && (
            <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 text-xs text-rose-400">
              {error}
            </div>
          )}

          {/* Switcher between Live Execution Logs & Generated Output */}
          <div className="flex items-center gap-2 border-b border-border-subtle">
            <button
              type="button"
              onClick={() => setRightTab('execution')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                rightTab === 'execution'
                  ? 'border-violet-500 text-ink-primary'
                  : 'border-transparent text-ink-muted hover:text-ink-primary'
              }`}
            >
              Live Execution Logs ({logs.length})
            </button>
            <button
              type="button"
              onClick={() => setRightTab('output')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                rightTab === 'output'
                  ? 'border-violet-500 text-ink-primary'
                  : 'border-transparent text-ink-muted hover:text-ink-primary'
              }`}
            >
              Generated Output {result ? '• Ready' : ''}
            </button>
          </div>

          {rightTab === 'execution' ? (
            <ExecutionLogsPanel logs={logs} title="Real-Time SSE Execution Stream" />
          ) : result ? (
            <ContentPreviewPanel
              item={result}
              onUpdateContent={handleUpdateResultContent}
              onRegenerate={() => start(form)}
              onSaveDraft={handleSaveDraft}
            />
          ) : (
            <Card>
              <div className="py-12 text-center text-xs text-ink-muted">
                Configure your topic on the left and click <strong>Generate Content</strong> to
                produce platform-ready output with citations and fact-checking.
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
