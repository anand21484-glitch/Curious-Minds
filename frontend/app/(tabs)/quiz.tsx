import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Card from '../../src/components/Card';
import PillButton from '../../src/components/PillButton';
import ScientistAvatar from '../../src/components/ScientistAvatar';
import { AGE_BANDS, AgeBand, DIFFICULTIES_FOR_AGE_BAND, quizzes } from '../../src/data/quizzes';
import { getQuestionsForScientist } from '../../src/data/quizQuestions';
import { getScientist } from '../../src/data/scientists';
import { useAppState } from '../../src/state/AppState';
import { colors, radii, spacing, typography } from '../../src/theme';

const STATUS_COLOR: Record<string, string> = {
  'Not started': colors.textSecondary,
  'In progress': colors.gold,
  Completed: colors.success,
};

const XP_FOR_DIFFICULTY: Record<string, number> = { easy: 10, medium: 20, hard: 30 };

export default function QuizScreen() {
  const params = useLocalSearchParams<{ scientistId?: string }>();
  const [ageBand, setAgeBand] = useState<AgeBand>(AGE_BANDS[2]);
  const [activeScientistId, setActiveScientistId] = useState<string | null>(null);

  useEffect(() => {
    if (params.scientistId) setActiveScientistId(params.scientistId);
  }, [params.scientistId]);

  if (activeScientistId) {
    const quiz = quizzes.find((q) => q.scientistId === activeScientistId);
    if (!quiz) {
      setActiveScientistId(null);
      return null;
    }
    return (
      <QuizSession
        scientistId={activeScientistId}
        quizName={quiz.name}
        color={quiz.color}
        allowedDifficulties={DIFFICULTIES_FOR_AGE_BAND[ageBand]}
        onExit={() => setActiveScientistId(null)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Zone</Text>

      <View style={styles.ageBandRow}>
        {AGE_BANDS.map((band) => {
          const active = band === ageBand;
          return (
            <Pressable
              key={band}
              onPress={() => setAgeBand(band)}
              style={[styles.ageBandPill, active && styles.ageBandPillActive]}
            >
              <Text style={[styles.ageBandText, active && styles.ageBandTextActive]}>{band}</Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={quizzes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, { borderColor: item.color }]}
            onPress={() => setActiveScientistId(item.scientistId)}
          >
            <View style={styles.badge}>
              {(() => {
                const scientist = getScientist(item.scientistId);
                return scientist ? <ScientistAvatar scientist={scientist} size={32} /> : null;
              })()}
            </View>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardBadge}>{item.badgeName}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardTime}>~{item.estimatedTime}</Text>
              <Text style={[styles.cardStatus, { color: STATUS_COLOR[item.status] }]}>
                {item.status}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

function QuizSession({
  scientistId,
  quizName,
  color,
  allowedDifficulties,
  onExit,
}: {
  scientistId: string;
  quizName: string;
  color: string;
  allowedDifficulties: string[];
  onExit: () => void;
}) {
  const { addXp, recordQuizCompletion } = useAppState();
  const questions = getQuestionsForScientist(scientistId).filter((q) =>
    allowedDifficulties.includes(q.difficulty),
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{quizName}</Text>
        <Text style={styles.cardBadge}>No questions at this age level yet — try Science Star.</Text>
        <PillButton label="Back to Quiz Zone" onPress={onExit} style={{ marginTop: spacing.lg }} />
      </View>
    );
  }

  if (finished) {
    return (
      <View style={styles.container}>
        <Card style={styles.resultCard}>
          <Text style={styles.title}>{quizName} — Done!</Text>
          <Text style={styles.resultScore}>
            {correctCount} / {questions.length} correct
          </Text>
          <Text style={styles.cardBadge}>You earned {xpEarned} XP this quiz</Text>
          <PillButton label="Back to Quiz Zone" onPress={onExit} style={{ marginTop: spacing.lg }} />
        </Card>
      </View>
    );
  }

  const question = questions[index];

  const selectAnswer = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === question.correct) {
      const xp = XP_FOR_DIFFICULTY[question.difficulty] ?? 10;
      setXpEarned((prev) => prev + xp);
      setCorrectCount((prev) => prev + 1);
      addXp(xp);
    }
  };

  const next = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setSelected(null);
    } else {
      recordQuizCompletion(scientistId, correctCount, questions.length);
      setFinished(true);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={onExit} style={styles.backButton}>
        <Text style={[styles.backButtonText, { color }]}>← Back to Quiz Zone</Text>
      </Pressable>

      <Card style={[styles.questionCard, { borderColor: color }]}>
        <View style={styles.questionMetaRow}>
          <Text style={[styles.difficultyPill, { color }]}>{question.difficulty.toUpperCase()}</Text>
          <Text style={styles.questionMeta}>
            +{XP_FOR_DIFFICULTY[question.difficulty] ?? 10} XP
          </Text>
          <Text style={styles.questionMeta}>
            {index + 1} / {questions.length}
          </Text>
        </View>
        <Text style={styles.questionText}>{question.question}</Text>

        {question.options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrect = i === question.correct;
          let backgroundColor: string = colors.background;
          if (selected !== null && isCorrect) backgroundColor = colors.success;
          else if (selected !== null && isSelected && !isCorrect) backgroundColor = colors.error;

          return (
            <Pressable
              key={i}
              onPress={() => selectAnswer(i)}
              style={[styles.option, { backgroundColor }]}
            >
              <Text style={styles.optionText}>{option}</Text>
            </Pressable>
          );
        })}

        {selected !== null && <Text style={styles.explanation}>{question.explanation}</Text>}
      </Card>

      {selected !== null && (
        <PillButton
          label={index + 1 < questions.length ? 'Next Question' : 'See Results'}
          onPress={next}
          style={styles.nextButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.hero,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  ageBandRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  ageBandPill: {
    flex: 1,
    borderRadius: radii.cardSmall,
    paddingVertical: spacing.xs,
    paddingHorizontal: 4,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  ageBandPillActive: {
    backgroundColor: colors.purple,
    borderColor: colors.purple,
  },
  ageBandText: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.microLabel,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  ageBandTextActive: {
    color: colors.textPrimary,
  },
  list: {
    paddingBottom: spacing.lg,
  },
  row: {
    gap: spacing.sm,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  badge: {
    marginBottom: spacing.xs,
  },
  cardName: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.body,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  cardBadge: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.microLabel,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTime: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.microLabel,
    color: colors.textSecondary,
  },
  cardStatus: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.microLabel,
  },
  backButton: {
    marginBottom: spacing.md,
  },
  backButtonText: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.body,
  },
  questionCard: {
    borderWidth: 2,
  },
  questionMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  difficultyPill: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.microLabel,
    letterSpacing: typography.microLabelLetterSpacing,
  },
  questionMeta: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.microLabel,
    color: colors.textSecondary,
  },
  questionText: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.cardTitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  option: {
    borderRadius: radii.cardSmall,
    padding: spacing.md,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  optionText: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.body,
    color: colors.textPrimary,
  },
  explanation: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.bodySmall,
    color: colors.textOnDark,
    marginTop: spacing.sm,
    lineHeight: 19,
  },
  nextButton: {
    marginTop: spacing.lg,
  },
  resultCard: {
    alignItems: 'center',
  },
  resultScore: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.statSmall,
    color: colors.gold,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
});
