import { fields } from '../theme';

export type QuizStatus = 'Not started' | 'In progress' | 'Completed';

export type Quiz = {
  id: string;
  name: string;
  badgeName: string;
  estimatedTime: string;
  status: QuizStatus;
  color: string;
};

// One themed quiz per Explore field (14 total), matching design/README.md's Quiz Zone hub.
export const quizzes: Quiz[] = fields.map((field) => ({
  id: field.id,
  name: field.name,
  badgeName: `${field.name} Explorer`,
  estimatedTime: '8 min',
  status: 'Not started',
  color: field.color,
}));

export const AGE_BANDS = ['8–10', '11–14', '15–18'] as const;
export type AgeBand = (typeof AGE_BANDS)[number];
