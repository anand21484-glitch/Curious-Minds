import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  userName: 'curiousMinds.userName',
  xpTotal: 'curiousMinds.xpTotal',
  streakDays: 'curiousMinds.streakDays',
  lastActiveDate: 'curiousMinds.lastActiveDate',
  completedQuizzes: 'curiousMinds.completedQuizzes',
  friends: 'curiousMinds.friends',
} as const;

export type CompletedQuiz = { correctCount: number; total: number; completedAt: string };
export type CompletedQuizzes = Record<string, CompletedQuiz>;

export type Friend = { id: string; name: string; joinedAt: number };

export async function getUserName(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.userName);
}

export async function setUserName(name: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.userName, name);
}

export async function getXpTotal(): Promise<number> {
  const raw = await AsyncStorage.getItem(KEYS.xpTotal);
  return raw ? Number(raw) : 0;
}

export async function setXpTotal(xp: number): Promise<void> {
  await AsyncStorage.setItem(KEYS.xpTotal, String(xp));
}

export async function getStreakDays(): Promise<number> {
  const raw = await AsyncStorage.getItem(KEYS.streakDays);
  return raw ? Number(raw) : 0;
}

export async function setStreakDays(days: number): Promise<void> {
  await AsyncStorage.setItem(KEYS.streakDays, String(days));
}

export async function getLastActiveDate(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.lastActiveDate);
}

export async function setLastActiveDate(isoDate: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.lastActiveDate, isoDate);
}

export async function getCompletedQuizzes(): Promise<CompletedQuizzes> {
  const raw = await AsyncStorage.getItem(KEYS.completedQuizzes);
  return raw ? JSON.parse(raw) : {};
}

export async function setCompletedQuizzes(quizzes: CompletedQuizzes): Promise<void> {
  await AsyncStorage.setItem(KEYS.completedQuizzes, JSON.stringify(quizzes));
}

export async function getFriends(): Promise<Friend[]> {
  const raw = await AsyncStorage.getItem(KEYS.friends);
  return raw ? JSON.parse(raw) : [];
}

export async function setFriends(friends: Friend[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.friends, JSON.stringify(friends));
}
