import { CompletedQuizzes, TfStats } from './storage';
import { fields } from '../theme';
import { getScientistsByField, scientists } from './scientists';
import { quizzes } from './quizzes';

export type FieldMastery = { id: string; name: string; color: string; stars: string };

type Inputs = {
  completedQuizzes: CompletedQuizzes;
  streakDays: number;
  tfStats?: TfStats;
};

const fieldsWithScientists = fields.filter((f) => getScientistsByField(f.id).length > 0);

function starString(starCount: number): string {
  return '⭐'.repeat(starCount) + '☆'.repeat(5 - starCount);
}

export function computeCuriosityStats({ completedQuizzes, streakDays, tfStats }: Inputs) {
  const completedIds = Object.keys(completedQuizzes);
  const questionsAttempted = completedIds.reduce((sum, id) => sum + completedQuizzes[id].total, 0);
  const questionsSolved = completedIds.reduce((sum, id) => sum + completedQuizzes[id].correctCount, 0);
  const accuracyLabel = questionsAttempted > 0 ? `${Math.round((questionsSolved / questionsAttempted) * 100)}%` : '—';
  const fastThinkerLabel =
    tfStats && tfStats.allTimeCorrectCount > 0
      ? `${(tfStats.allTimeTimeSum / tfStats.allTimeCorrectCount).toFixed(1)}s`
      : '—';

  const scientistsTotal = scientists.length;
  const scientistsDiscovered = completedIds.length;
  const scientistsDiscoveredPct = Math.round((scientistsDiscovered / (scientistsTotal || 1)) * 100);

  const fieldsMasteredView: FieldMastery[] = fieldsWithScientists.map((field) => {
    const fieldScientists = getScientistsByField(field.id);
    const completedInField = fieldScientists.filter((s) => completedQuizzes[s.id]);
    const frac =
      completedInField.length === 0
        ? 0
        : completedInField.reduce((sum, s) => {
            const q = completedQuizzes[s.id];
            return sum + (q.total > 0 ? q.correctCount / q.total : 0);
          }, 0) / completedInField.length;
    const starCount = frac > 0 ? Math.max(1, Math.round(frac * 5)) : 0;
    return { id: field.id, name: field.name, color: field.color, stars: starString(starCount) };
  });

  const quizzesCompleted = completedIds.length;
  const xpSourcesView = [
    { icon: '✅', label: 'Quizzes completed', value: quizzesCompleted },
    { icon: '📊', label: 'Questions attempted', value: questionsAttempted },
    { icon: '🎯', label: 'Questions solved', value: questionsSolved },
    { icon: '🔥', label: 'Daily streak (days)', value: streakDays },
  ];

  const quizzesRatio = quizzesCompleted / (quizzes.length || 1);
  const accuracyRatio = questionsAttempted > 0 ? questionsSolved / questionsAttempted : 0;
  const consistencyRatio = Math.min(1, streakDays / 30);
  const explorationRatio = scientistsDiscovered / (scientistsTotal || 1);
  // "Stories read" isn't tracked separately from quiz completion in this app,
  // so it reuses the exploration ratio rather than inventing a new signal.
  const storiesRatio = explorationRatio;
  const cqScore = Math.round(
    storiesRatio * 150 + quizzesRatio * 250 + accuracyRatio * 250 + consistencyRatio * 150 + explorationRatio * 200,
  );
  const cqBreakdownView = [
    { label: 'Stories', value: `${Math.round(storiesRatio * 100)}%` },
    { label: 'Quizzes', value: `${Math.round(quizzesRatio * 100)}%` },
    { label: 'Accuracy', value: `${Math.round(accuracyRatio * 100)}%` },
    { label: 'Consistency', value: `${Math.round(consistencyRatio * 100)}%` },
    { label: 'Exploration', value: `${Math.round(explorationRatio * 100)}%` },
  ];

  return {
    xpSourcesView,
    questionsAttempted,
    questionsSolved,
    accuracyLabel,
    fastThinkerLabel,
    scientistsTotal,
    scientistsDiscovered,
    scientistsDiscoveredPct,
    fieldsMasteredView,
    cqScore,
    cqBreakdownView,
  };
}
