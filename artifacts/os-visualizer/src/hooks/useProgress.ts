import { useState, useEffect, useCallback } from 'react';
import { ProgressState } from '../types';

const PROGRESS_KEY = 'os-visualizer-progress';

const defaultState: ProgressState = {
  completedTopics: [],
  quizScores: {},
};

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() => {
    try {
      const stored = localStorage.getItem(PROGRESS_KEY);
      if (stored) {
        return JSON.parse(stored) as ProgressState;
      }
    } catch (e) {
      console.error('Failed to parse progress from localStorage', e);
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  const markComplete = useCallback((topicId: string) => {
    setProgress((prev) => {
      if (prev.completedTopics.includes(topicId)) return prev;
      return { ...prev, completedTopics: [...prev.completedTopics, topicId] };
    });
  }, []);

  const unmarkComplete = useCallback((topicId: string) => {
    setProgress((prev) => {
      if (!prev.completedTopics.includes(topicId)) return prev;
      return { ...prev, completedTopics: prev.completedTopics.filter(id => id !== topicId) };
    });
  }, []);

  const saveQuizScore = useCallback((topicId: string, score: number) => {
    setProgress((prev) => {
      return {
        ...prev,
        quizScores: {
          ...prev.quizScores,
          [topicId]: Math.max(prev.quizScores[topicId] || 0, score)
        }
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(defaultState);
  }, []);

  return {
    completedTopics: progress.completedTopics,
    quizScores: progress.quizScores,
    markComplete,
    unmarkComplete,
    saveQuizScore,
    resetProgress,
  };
}
