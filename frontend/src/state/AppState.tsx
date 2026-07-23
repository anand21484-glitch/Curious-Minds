import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  CompletedQuizzes,
  getCompletedQuizzes,
  getLastActiveDate,
  getStreakDays,
  getUserName,
  getXpTotal,
  setCompletedQuizzes as persistCompletedQuizzes,
  setLastActiveDate,
  setStreakDays as persistStreakDays,
  setUserName as persistUserName,
  setXpTotal as persistXpTotal,
} from '../data/storage';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

type AppStateValue = {
  loading: boolean;
  userName: string | null;
  xpTotal: number;
  streakDays: number;
  streakCelebration: boolean;
  dismissStreakCelebration: () => void;
  login: (name: string) => Promise<void>;
  addXp: (amount: number) => Promise<void>;
  completedQuizzes: CompletedQuizzes;
  recordQuizCompletion: (scientistId: string, correctCount: number, total: number) => Promise<void>;
};

const AppStateContext = createContext<AppStateValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [userName, setUserNameState] = useState<string | null>(null);
  const [xpTotal, setXpTotalState] = useState(0);
  const [streakDays, setStreakDaysState] = useState(0);
  const [streakCelebration, setStreakCelebration] = useState(false);
  const [completedQuizzes, setCompletedQuizzesState] = useState<CompletedQuizzes>({});

  useEffect(() => {
    (async () => {
      const [name, xp, lastActive, streak, quizzes] = await Promise.all([
        getUserName(),
        getXpTotal(),
        getLastActiveDate(),
        getStreakDays(),
        getCompletedQuizzes(),
      ]);
      setUserNameState(name);
      setXpTotalState(xp);
      setCompletedQuizzesState(quizzes);

      const today = todayKey();
      let nextStreak = streak;
      if (name) {
        if (!lastActive) {
          nextStreak = 1;
        } else {
          const gap = daysBetween(lastActive, today);
          if (gap === 0) {
            nextStreak = streak || 1;
          } else if (gap === 1) {
            nextStreak = streak + 1;
            if (nextStreak % 5 === 0) {
              const bonusXp = xp + 100;
              setXpTotalState(bonusXp);
              await persistXpTotal(bonusXp);
              setStreakCelebration(true);
            }
          } else {
            nextStreak = 1;
          }
        }
        await persistStreakDays(nextStreak);
        await setLastActiveDate(today);
      }
      setStreakDaysState(nextStreak);
      setLoading(false);
    })();
  }, []);

  const value = useMemo<AppStateValue>(
    () => ({
      loading,
      userName,
      xpTotal,
      streakDays,
      streakCelebration,
      dismissStreakCelebration: () => setStreakCelebration(false),
      login: async (name: string) => {
        await persistUserName(name);
        await setLastActiveDate(todayKey());
        await persistStreakDays(1);
        setUserNameState(name);
        setStreakDaysState(1);
      },
      addXp: async (amount: number) => {
        const next = xpTotal + amount;
        setXpTotalState(next);
        await persistXpTotal(next);
      },
      completedQuizzes,
      recordQuizCompletion: async (scientistId: string, correctCount: number, total: number) => {
        const next = {
          ...completedQuizzes,
          [scientistId]: { correctCount, total, completedAt: todayKey() },
        };
        setCompletedQuizzesState(next);
        await persistCompletedQuizzes(next);
      },
    }),
    [loading, userName, xpTotal, streakDays, streakCelebration, completedQuizzes],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within an AppStateProvider');
  return ctx;
}
