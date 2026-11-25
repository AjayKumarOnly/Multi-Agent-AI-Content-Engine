import apiClient, { USE_MOCK_API } from './api';
import { INITIAL_CONTENT_HISTORY } from '../mocks/mockData';

const STORAGE_KEY = 'maice_content_history_v1';

function loadStoredHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore storage errors
  }
  return INITIAL_CONTENT_HISTORY;
}

function saveStoredHistory(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
}

export const contentService = {
  async getHistory(params = {}) {
    if (!USE_MOCK_API) {
      const { data } = await apiClient.get('/content/history', { params });
      return data;
    }
    await new Promise((r) => setTimeout(r, 200));
    return loadStoredHistory();
  },

  async saveContent(item) {
    if (!USE_MOCK_API) {
      const { data } = await apiClient.post('/content', item);
      return data;
    }
    const items = loadStoredHistory();
    const existsIndex = items.findIndex((i) => i.id === item.id);
    const updated =
      existsIndex >= 0
        ? items.map((i, idx) => (idx === existsIndex ? item : i))
        : [item, ...items];
    saveStoredHistory(updated);
    return item;
  },

  async updateContent(id, patch) {
    if (!USE_MOCK_API) {
      const { data } = await apiClient.patch(`/content/${id}`, patch);
      return data;
    }
    const items = loadStoredHistory();
    const updated = items.map((item) => (item.id === id ? { ...item, ...patch } : item));
    saveStoredHistory(updated);
    return updated.find((i) => i.id === id);
  },

  async deleteContent(id) {
    if (!USE_MOCK_API) {
      await apiClient.delete(`/content/${id}`);
      return true;
    }
    const items = loadStoredHistory();
    const updated = items.filter((item) => item.id !== id);
    saveStoredHistory(updated);
    return true;
  },
};
