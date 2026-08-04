import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  CompletedQuizzes,
  Friend,
  TfStats,
  clearAll,
  getCompletedQuizzes,
  getFriends,
  getLastActiveDate,
  getStreakDays,
  getTfStats,
  getUserName,
  getXpTotal,
  setCompletedQuizzes as persistCompletedQuizzes,
  setFriends as persistFriends,
  setLastActiveDate,
  setStreakDays as persistStreakDays,
  setTfStats as persistTfStats,
  setUserName as persistUserName,
  setXpTotal as persistXpTotal,
} from '../data/storage';

const DEFAULT_TF_STATS: TfStats = { challengesPlayed: 0, allTimeTimeSum: 0, allTimeCorrectCount: 0 };

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
  resetProgress: () => Promise<void>;
  addXp: (amount: number) => Promise<void>;
  completedQuizzes: CompletedQuizzes;
  recordQuizCompletion: (scientistId: string, correctCount: number, total: number) => Promise<void>;
  friends: Friend[];
  inviteFriend: (name: string) => Promise<void>;
  removeFriend: (id: string) => Promise<void>;
  tfStats: TfStats;
  recordTfChallenge: (xpEarned: number, timeSum: number, correctCount: number) => Promise<void>;
};

const AppStateContext = createContext<AppStateValue | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [userName, setUserNameState] = useState<string | null>(null);
  const [xpTotal, setXpTotalState] = useState(0);
  const [streakDays, setStreakDaysState] = useState(0);
  const [streakCelebration, setStreakCelebration] = useState(false);
  const [completedQuizzes, setCompletedQuizzesState] = useState<CompletedQuizzes>({});
  const [friends, setFriendsState] = useState<Friend[]>([]);
  const [tfStats, setTfStatsState] = useState<TfStats>(DEFAULT_TF_STATS);

  useEffect(() => {
    (async () => {
      const [name, xp, lastActive, streak, quizzes, friendsList, tf] = await Promise.all([
        getUserName(),
        getXpTotal(),
        getLastActiveDate(),
        getStreakDays(),
        getCompletedQuizzes(),
        getFriends(),
        getTfStats(),
      ]);
      setUserNameState(name);
      setXpTotalState(xp);
      setCompletedQuizzesState(quizzes);
      setFriendsState(friendsList);
      setTfStatsState(tf);

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
      resetProgress: async () => {
        await clearAll();
        setUserNameState(null);
        setXpTotalState(0);
        setStreakDaysState(0);
        setStreakCelebration(false);
        setCompletedQuizzesState({});
        setFriendsState([]);
        setTfStatsState(DEFAULT_TF_STATS);
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
      friends,
      inviteFriend: async (name: string) => {
        const next = [...friends, { id: `${Date.now()}`, name, joinedAt: Date.now() }];
        setFriendsState(next);
        await persistFriends(next);
      },
      removeFriend: async (id: string) => {
        const next = friends.filter((f) => f.id !== id);
        setFriendsState(next);
        await persistFriends(next);
      },
      tfStats,
      recordTfChallenge: async (xpEarned: number, timeSum: number, correctCount: number) => {
        const nextXp = xpTotal + xpEarned;
        setXpTotalState(nextXp);
        await persistXpTotal(nextXp);
        const nextTf: TfStats = {
          challengesPlayed: tfStats.challengesPlayed + 1,
          allTimeTimeSum: tfStats.allTimeTimeSum + timeSum,
          allTimeCorrectCount: tfStats.allTimeCorrectCount + correctCount,
        };
        setTfStatsState(nextTf);
        await persistTfStats(nextTf);
      },
    }),
    [loading, userName, xpTotal, streakDays, streakCelebration, completedQuizzes, friends, tfStats],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within an AppStateProvider');
  return ctx;
}
