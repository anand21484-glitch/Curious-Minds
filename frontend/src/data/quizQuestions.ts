import raw from './quiz_questions.json';
import { getScientistsByField } from './scientists';

export type QuizQuestion = {
  id: string;
  scientist_id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

export const quizQuestions = raw as QuizQuestion[];

export function getQuestionsForScientist(scientistId: string): QuizQuestion[] {
  return quizQuestions.filter((q) => q.scientist_id === scientistId);
}

// Pools every question from every scientist in a field — used by Think Fast
// Challenge, which needs a bigger shared pool than one scientist's 5 questions.
export function getQuestionsForField(
  fieldId: string,
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed',
): QuizQuestion[] {
  const scientistIds = new Set(getScientistsByField(fieldId).map((s) => s.id));
  const pool = quizQuestions.filter((q) => scientistIds.has(q.scientist_id));
  return difficulty === 'mixed' ? pool : pool.filter((q) => q.difficulty === difficulty);
}
