import apiClient, { USE_MOCK_API } from './api';

const SETTINGS_KEY = 'maice_settings_v1';

export const DEFAULT_SETTINGS = {
  profile: {
    name: 'Alex Rivera',
    email: 'alex.rivera@contentengine.ai',
    organization: 'Platform AI Lab',
  },
  aiModel: {
    defaultModel: 'gemini-2.5-pro',
    researcherModel: 'gemini-2.5-flash',
    editorModel: 'claude-3.5-sonnet',
    factCheckerModel: 'gemini-2.5-pro',
  },
  contentDefaults: {
    platform: 'LinkedIn',
    tone: 'Technical',
    length: 'Medium',
    audience: 'Software Engineers & Technical Leaders',
  },
  orchestration: {
    maxRevisionRounds: 2,
    workflowTimeoutSeconds: 90,
    tokenBudgetPerRun: 15000,
    monthlyCostLimitUsd: 100,
  },
};

export const settingsService = {
  async getSettings() {
    if (!USE_MOCK_API) {
      const { data } = await apiClient.get('/settings');
      return data;
    }
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  },

  async saveSettings(settings) {
    if (!USE_MOCK_API) {
      const { data } = await apiClient.put('/settings', settings);
      return data;
    }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return settings;
  },
};
