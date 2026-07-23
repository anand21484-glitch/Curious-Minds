import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  userName: 'curiousMinds.userName',
  xpTotal: 'curiousMinds.xpTotal',
  streakDays: 'curiousMinds.streakDays',
  lastActiveDate: 'curiousMinds.lastActiveDate',
} as const;

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
