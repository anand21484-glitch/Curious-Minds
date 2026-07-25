import { scientists } from './scientists';

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function factOfTheDay(date: Date = new Date()) {
  const scientist = scientists[(dayOfYear(date) + 7) % scientists.length];
  return { scientist, fact: scientist.fun_fact };
}
