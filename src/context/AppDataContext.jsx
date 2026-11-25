import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { contentService } from '../services/contentService';
import { DEFAULT_SETTINGS, settingsService } from '../services/settingsService';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [duplicateSeed, setDuplicateSeed] = useState(null);

  useEffect(() => {
    let active = true;
    Promise.all([contentService.getHistory(), settingsService.getSettings()]).then(
      ([items, loadedSettings]) => {
        if (!active) return;
        setHistory(items);
        setSettings(loadedSettings);
        setHistoryLoading(false);
      }
    );
    return () => {
      active = false;
    };
  }, []);

  const saveContentItem = useCallback(async (item) => {
    const saved = await contentService.saveContent(item);
    setHistory((prev) => {
      const idx = prev.findIndex((i) => i.id === saved.id);
      if (idx >= 0) return prev.map((i, k) => (k === idx ? saved : i));
      return [saved, ...prev];
    });
    return saved;
  }, []);

  const updateContentItem = useCallback(async (id, patch) => {
    const updated = await contentService.updateContent(id, patch);
    setHistory((prev) => prev.map((item) => (item.id === id ? { ...item, ...updated } : item)));
    return updated;
  }, []);

  const deleteContentItem = useCallback(async (id) => {
    await contentService.deleteContent(id);
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const saveSettings = useCallback(async (nextSettings) => {
    const saved = await settingsService.saveSettings(nextSettings);
    setSettings(saved);
    return saved;
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        history,
        historyLoading,
        saveContentItem,
        updateContentItem,
        deleteContentItem,
        settings,
        saveSettings,
        duplicateSeed,
        setDuplicateSeed,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
