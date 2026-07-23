import raw from './quiz_questions.json';

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
