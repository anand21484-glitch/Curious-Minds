import { fields } from '../theme';
import { getQuestionsForScientist } from './quizQuestions';
import { scientists } from './scientists';

export type QuizStatus = 'Not started' | 'In progress' | 'Completed';

export type Quiz = {
  id: string;
  scientistId: string;
  name: string;
  badgeName: string;
  estimatedTime: string;
  status: QuizStatus;
  color: string;
  questionCount: number;
};

const colorByField: Record<string, string> = Object.fromEntries(fields.map((f) => [f.id, f.color]));

// One quiz per scientist profile (5 questions each), matching quiz_questions.json.
export const quizzes: Quiz[] = scientists.map((s) => ({
  id: s.id,
  scientistId: s.id,
  name: s.name,
  badgeName: `${s.name.split(' ').slice(-1)[0]} Explorer`,
  estimatedTime: `${getQuestionsForScientist(s.id).length * 2} min`,
  status: 'Not started',
  color: colorByField[s.field] ?? '#8B7BFF',
  questionCount: getQuestionsForScientist(s.id).length,
}));

export const AGE_BANDS = ['8–10', '11–14', '15–18'] as const;
export type AgeBand = (typeof AGE_BANDS)[number];
