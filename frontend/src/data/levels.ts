export type CqLevel = { name: string; emoji: string; min: number };

export const cqLevels: CqLevel[] = [
  { name: 'Young Explorer', emoji: '🔬', min: 0 },
  { name: 'Junior Scientist', emoji: '🔭', min: 150 },
  { name: 'Researcher', emoji: '⚛️', min: 400 },
  { name: 'Space Pioneer', emoji: '🚀', min: 800 },
  { name: 'Master Innovator', emoji: '🧪', min: 1400 },
  { name: 'Curious Legend', emoji: '🏆', min: 2200 },
];

export function levelForXp(xp: number) {
  let current = cqLevels[0];
  let next: CqLevel | null = null;
  for (let i = 0; i < cqLevels.length; i++) {
    if (xp >= cqLevels[i].min) current = cqLevels[i];
    else {
      next = cqLevels[i];
      break;
    }
  }
  const progress = next ? (xp - current.min) / (next.min - current.min) : 1;
  return { current, next, progress: Math.max(0, Math.min(1, progress)) };
}
