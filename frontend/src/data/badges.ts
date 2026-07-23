import { CompletedQuizzes } from './storage';
import { fields } from '../theme';
import { getScientistsByField } from './scientists';

export type Badge = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
};

type BadgeInputs = {
  completedQuizzes: CompletedQuizzes;
  streakDays: number;
};

const fieldsWithScientists = fields.filter((f) => getScientistsByField(f.id).length > 0);

export function computeBadges({ completedQuizzes, streakDays }: BadgeInputs): Badge[] {
  const completedIds = Object.keys(completedQuizzes);
  const hasPerfectScore = completedIds.some((id) => {
    const q = completedQuizzes[id];
    return q.total > 0 && q.correctCount === q.total;
  });

  const badges: Badge[] = [
    {
      id: 'first_quiz',
      name: 'First Quiz',
      emoji: '🎯',
      description: 'Complete your first quiz.',
      unlocked: completedIds.length >= 1,
    },
    {
      id: 'perfect_score',
      name: 'Perfect Score',
      emoji: '🌟',
      description: 'Get every question right in a quiz.',
      unlocked: hasPerfectScore,
    },
    {
      id: 'streak_3',
      name: '3-Day Streak',
      emoji: '🔥',
      description: 'Visit Curious Minds 3 days in a row.',
      unlocked: streakDays >= 3,
    },
    {
      id: 'streak_7',
      name: '7-Day Streak',
      emoji: '🔥🔥',
      description: 'Visit Curious Minds 7 days in a row.',
      unlocked: streakDays >= 7,
    },
    {
      id: 'streak_30',
      name: '30-Day Streak',
      emoji: '🔥🔥🔥',
      description: 'Visit Curious Minds 30 days in a row.',
      unlocked: streakDays >= 30,
    },
  ];

  for (const field of fieldsWithScientists) {
    const fieldScientists = getScientistsByField(field.id);
    const unlocked = fieldScientists.every((s) => Boolean(completedQuizzes[s.id]));
    badges.push({
      id: `field_master_${field.id}`,
      name: `${field.name} Master`,
      emoji: '🏅',
      description: `Complete the quiz for every scientist in ${field.name}.`,
      unlocked,
    });
  }

  return badges;
}
