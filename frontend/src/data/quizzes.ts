import { fields } from '../theme';
import { getQuestionsForScientist } from './quizQuestions';
import { scientists } from './scientists';

export type Quiz = {
  id: string;
  scientistId: string;
  name: string;
  badgeName: string;
  estimatedTime: string;
  color: string;
  mono: string;
  questionCount: number;
};

const fieldById: Record<string, (typeof fields)[number]> = Object.fromEntries(
  fields.map((f) => [f.id, f]),
);

// One quiz per scientist profile (5 questions each), matching quiz_questions.json.
export const quizzes: Quiz[] = scientists.map((s) => ({
  id: s.id,
  scientistId: s.id,
  name: s.name,
  badgeName: `${s.name.split(' ').slice(-1)[0]} Explorer`,
  estimatedTime: `${getQuestionsForScientist(s.id).length * 2} min`,
  color: fieldById[s.field]?.color ?? '#8B7BFF',
  mono: fieldById[s.field]?.mono ?? '??',
  questionCount: getQuestionsForScientist(s.id).length,
}));

export const AGE_BANDS = ['Little Explorer (6–8)', 'Junior Scientist (9–11)', 'Science Star (12+)'] as const;
export type AgeBand = (typeof AGE_BANDS)[number];

export type Difficulty = 'easy' | 'medium' | 'hard';

// Which question difficulties are in play for each age band.
export const DIFFICULTIES_FOR_AGE_BAND: Record<AgeBand, Difficulty[]> = {
  'Little Explorer (6–8)': ['easy'],
  'Junior Scientist (9–11)': ['easy', 'medium'],
  'Science Star (12+)': ['easy', 'medium', 'hard'],
};
