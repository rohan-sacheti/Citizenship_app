import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppSettings, UserProgress, DynamicAnswers, defaultDynamicAnswers } from '../data/types';

interface AppContextType {
  settings: AppSettings;
  progress: UserProgress;
  updateSettings: (settings: Partial<AppSettings>) => void;
  updateDynamicAnswers: (answers: Partial<DynamicAnswers>) => void;
  recordAnswer: (questionId: number, isCorrect: boolean) => void;
  markDifficulty: (questionId: number, difficulty: 'easy' | 'hard' | undefined) => void;
  resetProgress: () => void;
}

const defaultSettings: AppSettings = {
  is6520Mode: false,
  dynamicAnswers: defaultDynamicAnswers,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const SETTINGS_KEY = 'uscis-civics-settings';
const PROGRESS_KEY = 'uscis-civics-progress';

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  }, [settings]);

  // Persist progress
  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save progress:', e);
    }
  }, [progress]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateDynamicAnswers = (answers: Partial<DynamicAnswers>) => {
    setSettings(prev => ({
      ...prev,
      dynamicAnswers: { ...prev.dynamicAnswers, ...answers },
    }));
  };

  const recordAnswer = (questionId: number, isCorrect: boolean) => {
    setProgress(prev => {
      const existing = prev[questionId] || {
        seenCount: 0,
        correctCount: 0,
        incorrectCount: 0,
        lastSeenAt: '',
      };
      return {
        ...prev,
        [questionId]: {
          ...existing,
          seenCount: existing.seenCount + 1,
          correctCount: existing.correctCount + (isCorrect ? 1 : 0),
          incorrectCount: existing.incorrectCount + (isCorrect ? 0 : 1),
          lastSeenAt: new Date().toISOString(),
        },
      };
    });
  };

  const markDifficulty = (questionId: number, difficulty: 'easy' | 'hard' | undefined) => {
    setProgress(prev => {
      const existing = prev[questionId] || {
        seenCount: 0,
        correctCount: 0,
        incorrectCount: 0,
        lastSeenAt: '',
      };
      return {
        ...prev,
        [questionId]: {
          ...existing,
          difficulty,
        },
      };
    });
  };

  const resetProgress = () => {
    setProgress({});
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        progress,
        updateSettings,
        updateDynamicAnswers,
        recordAnswer,
        markDifficulty,
        resetProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
