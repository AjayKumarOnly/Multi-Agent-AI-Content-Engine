import { useEffect, useState } from 'react';
import { ShieldAlert, Save, Sun, Moon } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { AI_MODELS, LENGTHS, PLATFORMS, TONES } from '../constants';
import { useAppData } from '../context/AppDataContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

export function SettingsPage() {
  const { settings, saveSettings } = useAppData();
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();

  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSettings(form);
      addToast({ title: 'Settings saved', description: 'Preferences persisted.', type: 'success' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-ink-primary">Settings</h2>
          <p className="text-xs text-ink-secondary mt-0.5">
            Configure profile, model routing, orchestration guardrails, and appearance.
          </p>
        </div>
        <Button type="submit" loading={saving}>
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl border border-emerald-500/25 bg-emerald-500/5 text-xs">
        <ShieldAlert className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-ink-primary">
            Backend-Managed API Credentials
          </p>
          <p className="text-ink-secondary mt-0.5">
            Gemini and Tavily API keys are stored exclusively in the Spring Boot / FastAPI backend
            environment vault and are never exposed or persisted in frontend source code.
          </p>
        </div>
      </div>

      {/* Profile */}
      <Card title="User Profile" subtitle="Account identity synced with Spring Boot JWT">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-ink-primary mb-1.5">Full Name</label>
            <input
              type="text"
              value={form.profile.name}
              onChange={(e) =>
                setForm({ ...form, profile: { ...form.profile, name: e.target.value } })
              }
              className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-3 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-primary mb-1.5">Email</label>
            <input
              type="email"
              value={form.profile.email}
              onChange={(e) =>
                setForm({ ...form, profile: { ...form.profile, email: e.target.value } })
              }
              className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-3 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-primary mb-1.5">
              Organization
            </label>
            <input
              type="text"
              value={form.profile.organization}
              onChange={(e) =>
                setForm({
                  ...form,
                  profile: { ...form.profile, organization: e.target.value },
                })
              }
              className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-3 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>
      </Card>

      {/* AI Model Preferences */}
      <Card title="AI Model Preferences" subtitle="Per-agent model routing defaults">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'defaultModel', label: 'Primary Writer Model' },
            { key: 'researcherModel', label: 'Researcher Agent Model' },
            { key: 'editorModel', label: 'Editor Agent Model' },
            { key: 'factCheckerModel', label: 'Fact-Checker Agent Model' },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-ink-primary mb-1.5">
                {field.label}
              </label>
              <select
                value={form.aiModel[field.key]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    aiModel: { ...form.aiModel, [field.key]: e.target.value },
                  })
                }
                className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-2.5 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {AI_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label} ({m.provider})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </Card>

      {/* Default Content Preferences */}
      <Card title="Default Content Preferences" subtitle="Pre-filled values in Generate Content">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-ink-primary mb-1.5">
              Default Platform
            </label>
            <select
              value={form.contentDefaults.platform}
              onChange={(e) =>
                setForm({
                  ...form,
                  contentDefaults: { ...form.contentDefaults, platform: e.target.value },
                })
              }
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
              Default Tone
            </label>
            <select
              value={form.contentDefaults.tone}
              onChange={(e) =>
                setForm({
                  ...form,
                  contentDefaults: { ...form.contentDefaults, tone: e.target.value },
                })
              }
              className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-2.5 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {TONES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-primary mb-1.5">
              Default Length
            </label>
            <select
              value={form.contentDefaults.length}
              onChange={(e) =>
                setForm({
                  ...form,
                  contentDefaults: { ...form.contentDefaults, length: e.target.value },
                })
              }
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
              Default Target Audience
            </label>
            <input
              type="text"
              value={form.contentDefaults.audience}
              onChange={(e) =>
                setForm({
                  ...form,
                  contentDefaults: { ...form.contentDefaults, audience: e.target.value },
                })
              }
              className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-3 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>
      </Card>

      {/* Orchestration Guardrails */}
      <Card
        title="Orchestration Guardrails & Budgets"
        subtitle="Revision caps, workflow timeouts, token budgets, and spend limits"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-ink-primary mb-1.5">
              Max Revision Rounds
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={form.orchestration.maxRevisionRounds}
              onChange={(e) =>
                setForm({
                  ...form,
                  orchestration: {
                    ...form.orchestration,
                    maxRevisionRounds: Number(e.target.value),
                  },
                })
              }
              className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-3 text-sm font-mono text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-primary mb-1.5">
              Workflow Timeout (s)
            </label>
            <input
              type="number"
              min={15}
              max={300}
              value={form.orchestration.workflowTimeoutSeconds}
              onChange={(e) =>
                setForm({
                  ...form,
                  orchestration: {
                    ...form.orchestration,
                    workflowTimeoutSeconds: Number(e.target.value),
                  },
                })
              }
              className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-3 text-sm font-mono text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-primary mb-1.5">
              Token Budget / Run
            </label>
            <input
              type="number"
              min={2000}
              max={100000}
              step={1000}
              value={form.orchestration.tokenBudgetPerRun}
              onChange={(e) =>
                setForm({
                  ...form,
                  orchestration: {
                    ...form.orchestration,
                    tokenBudgetPerRun: Number(e.target.value),
                  },
                })
              }
              className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-3 text-sm font-mono text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-primary mb-1.5">
              Monthly Cost Limit ($)
            </label>
            <input
              type="number"
              min={10}
              max={5000}
              value={form.orchestration.monthlyCostLimitUsd}
              onChange={(e) =>
                setForm({
                  ...form,
                  orchestration: {
                    ...form.orchestration,
                    monthlyCostLimitUsd: Number(e.target.value),
                  },
                })
              }
              className="w-full h-9 rounded-lg border border-border-subtle bg-canvas px-3 text-sm font-mono text-ink-primary focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>
      </Card>

      {/* Theme Preferences */}
      <Card title="Theme Preferences" subtitle="Switch between dark navy/charcoal and light mode">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-medium transition-colors ${
              theme === 'dark'
                ? 'border-violet-500 bg-accent-subtle text-violet-400'
                : 'border-border-subtle bg-canvas text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <Moon className="w-4 h-4" /> Dark Theme
          </button>
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-medium transition-colors ${
              theme === 'light'
                ? 'border-violet-500 bg-accent-subtle text-violet-500'
                : 'border-border-subtle bg-canvas text-ink-secondary hover:text-ink-primary'
            }`}
          >
            <Sun className="w-4 h-4" /> Light Theme
          </button>
        </div>
      </Card>
    </form>
  );
}
