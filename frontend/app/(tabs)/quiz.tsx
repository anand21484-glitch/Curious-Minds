import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import PillButton from '../../src/components/PillButton';
import ScreenHeader from '../../src/components/ScreenHeader';
import { computeBadges } from '../../src/data/badges';
import { AGE_BANDS, AgeBand, DIFFICULTIES_FOR_AGE_BAND, quizzes } from '../../src/data/quizzes';
import { getQuestionsForScientist } from '../../src/data/quizQuestions';
import { getScientist } from '../../src/data/scientists';
import { useAppState } from '../../src/state/AppState';
import { colors, radii, spacing, typography } from '../../src/theme';

const TIME_FOR_DIFFICULTY: Record<string, number> = { easy: 15, medium: 25, hard: 35 };
const XP_FOR_DIFFICULTY: Record<string, number> = { easy: 10, medium: 20, hard: 30 };

export default function QuizScreen() {
  const params = useLocalSearchParams<{ scientistId?: string }>();
  const { completedQuizzes, xpTotal, streakDays, tfStats } = useAppState();
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
        badgeName={quiz.badgeName}
        color={quiz.color}
        allowedDifficulties={DIFFICULTIES_FOR_AGE_BAND[ageBand]}
        onExit={() => setActiveScientistId(null)}
      />
    );
  }

  const badges = computeBadges({ completedQuizzes, streakDays, tfChallengesPlayed: tfStats.challengesPlayed });
  const nonFieldBadges = badges.filter((b) => !b.id.startsWith('field_master_'));
  const badgesEarnedCount = nonFieldBadges.filter((b) => b.unlocked).length;
  const grandMasterUnlocked = quizzes.every((q) => Boolean(completedQuizzes[q.scientistId]));

  return (
    <View style={styles.container}>
      <ScreenHeader title="Quiz Zone" />
      <FlatList
        contentContainerStyle={styles.scroll}
        data={quizzes}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <View style={styles.xpCard}>
              <LinearGradient colors={colors.heroGradient} style={StyleSheet.absoluteFill} />
              <View>
                <Text style={styles.eyebrow}>Total XP</Text>
                <Text style={[styles.xpCardValue, { color: colors.goldText }]}>{xpTotal} XP</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.eyebrow}>Badges</Text>
                <Text style={styles.xpCardValue}>
                  {badgesEarnedCount}/{nonFieldBadges.length}
                </Text>
              </View>
            </View>

            <Text style={styles.eyebrow}>Choose your age group</Text>
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

            <Text style={styles.eyebrow}>Quiz themes</Text>
          </View>
        }
        renderItem={({ item }) => {
          const done = Boolean(completedQuizzes[item.scientistId]);
          return (
            <Pressable style={styles.themeRow} onPress={() => setActiveScientistId(item.scientistId)}>
              <View style={styles.themeIcon}>
                <Text style={[styles.themeIconText, { color: item.color }]}>{item.mono}</Text>
              </View>
              <View style={styles.themeText}>
                <Text style={styles.themeName}>{item.name}</Text>
                <Text style={styles.themeSub}>
                  {item.badgeName} · ~{item.estimatedTime}
                </Text>
              </View>
              <Text style={[styles.themeStatus, { color: done ? colors.success : colors.goldText }]}>
                {done ? 'Completed ✓' : 'Start →'}
              </Text>
            </Pressable>
          );
        }}
        ListFooterComponent={
          <View>
            <View
              style={[
                styles.bannerRow,
                { backgroundColor: grandMasterUnlocked ? 'rgba(231,185,60,0.14)' : colors.surface,
                  borderColor: grandMasterUnlocked ? 'rgba(231,185,60,0.4)' : colors.hairline },
              ]}
            >
              <Text style={styles.bannerEmoji}>👑</Text>
              <View style={styles.themeText}>
                <Text style={styles.themeName}>Curious Minds Champion</Text>
                <Text style={styles.themeSub}>
                  {grandMasterUnlocked
                    ? "Unlocked! You've mastered every theme."
                    : `Complete all ${quizzes.length} themes to unlock.`}
                </Text>
              </View>
            </View>

            <Pressable style={styles.tfBanner} onPress={() => router.push('/think-fast')}>
              <LinearGradient colors={colors.purpleGradient} style={StyleSheet.absoluteFill} />
              <Text style={styles.bannerEmoji}>⚡</Text>
              <View style={styles.themeText}>
                <Text style={styles.themeName}>Think Fast Challenge</Text>
                <Text style={styles.themeSub}>
                  Live Curious Challenge - Learn Together. Think Faster. Discover More
                </Text>
              </View>
              <Text style={styles.tfChevron}>›</Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

function QuizSession({
  scientistId,
  quizName,
  badgeName,
  color,
  allowedDifficulties,
  onExit,
}: {
  scientistId: string;
  quizName: string;
  badgeName: string;
  color: string;
  allowedDifficulties: string[];
  onExit: () => void;
}) {
  const { addXp, recordQuizCompletion } = useAppState();
  const scientist = getScientist(scientistId);
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
        <ScreenHeader title={quizName} onBack={onExit} />
        <View style={styles.scroll}>
          <Text style={styles.themeSub}>No questions at this age level yet — try Science Star.</Text>
        </View>
      </View>
    );
  }

  if (finished) {
    const resultMessage =
      correctCount === questions.length
        ? 'Perfect score! Truly curious mind.'
        : correctCount >= questions.length * 0.6
          ? 'Great work — keep exploring!'
          : 'Nice try — replay to learn more.';

    const restart = () => {
      setIndex(0);
      setSelected(null);
      setXpEarned(0);
      setCorrectCount(0);
      setFinished(false);
    };

    return (
      <View style={styles.container}>
        <ScreenHeader title="Quiz Complete" />
        <View style={[styles.scroll, styles.resultContainer]}>
          <View style={styles.resultBadge}>
            <LinearGradient colors={colors.goldIconGradient} style={StyleSheet.absoluteFill} />
            <Text style={styles.resultBadgeText}>
              {correctCount}/{questions.length}
            </Text>
          </View>
          <Text style={styles.resultMessage}>{resultMessage}</Text>
          <Text style={styles.resultXp}>You earned {xpEarned} XP this quiz.</Text>
          <View style={styles.resultBadgePill}>
            <Text style={styles.resultBadgeEmoji}>🎓</Text>
            <Text style={styles.resultBadgePillText}>Badge unlocked: {badgeName}</Text>
          </View>
          <PillButton label="Try again" onPress={restart} style={styles.tryAgainButton} />
          <Pressable onPress={onExit}>
            <Text style={styles.backToHubLink}>Back to Quiz Zone</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const question = questions[index];
  const progressPct = ((index + 1) / questions.length) * 100;

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
      <ScreenHeader
        title={quizName}
        titleSize={typography.size.headerXs}
        onBack={onExit}
        right={
          <Text style={styles.headerProgress}>
            {index + 1}/{questions.length}
          </Text>
        }
      />
      <View style={styles.scroll}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
        </View>

        <View style={styles.pillRow}>
          <View style={styles.diffPill}>
            <Text style={styles.diffPillText}>
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </Text>
          </View>
          <View style={styles.metaPill}>
            <Text style={styles.metaPillText}>Multiple Choice</Text>
          </View>
          <View style={styles.metaPill}>
            <Text style={styles.metaPillText}>+{XP_FOR_DIFFICULTY[question.difficulty] ?? 10} XP</Text>
          </View>
          <View style={styles.metaPill}>
            <Text style={styles.metaPillText}>~{TIME_FOR_DIFFICULTY[question.difficulty] ?? 20}s</Text>
          </View>
        </View>

        <Text style={styles.questionText}>{question.question}</Text>

        <View style={{ gap: spacing.sm }}>
          {question.options.map((option, i) => {
            const isSelected = selected === i;
            const isCorrect = i === question.correct;
            let bg: string = colors.surface;
            let border: string = colors.hairlineStrong;
            let dotBg = 'transparent';
            let dotBorder = 'rgba(255,255,255,0.3)';
            let mark = '';
            let textColor: string = colors.textPrimary;
            if (selected !== null) {
              if (isCorrect) {
                bg = 'rgba(231,185,60,0.16)';
                border = 'rgba(231,185,60,0.5)';
                dotBg = colors.gold;
                dotBorder = colors.gold;
                mark = '✓';
              } else if (isSelected) {
                bg = 'rgba(225,85,107,0.14)';
                border = 'rgba(225,85,107,0.5)';
                dotBg = colors.errorAlt;
                dotBorder = colors.errorAlt;
                mark = '✕';
                textColor = '#F3AEB8';
              }
            }

            return (
              <Pressable
                key={i}
                onPress={() => selectAnswer(i)}
                style={[styles.option, { backgroundColor: bg, borderColor: border }]}
              >
                <View style={[styles.optionDot, { backgroundColor: dotBg, borderColor: dotBorder }]}>
                  <Text style={styles.optionMark}>{mark}</Text>
                </View>
                <Text style={[styles.optionText, { color: textColor }]}>{option}</Text>
              </Pressable>
            );
          })}
        </View>

        {selected !== null && (
          <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
            <View style={styles.explanationCard}>
              <Text style={styles.explanationText}>{question.explanation}</Text>
            </View>
            {scientist && (
              <View style={styles.factCard}>
                <Text style={styles.factTitle}>💡 Did You Know?</Text>
                <Text style={styles.factText}>{scientist.fun_fact}</Text>
              </View>
            )}
            <Text style={styles.goalText}>Learning objective: Learn about {quizName}</Text>
            <PillButton
              label={index + 1 < questions.length ? 'Next Question' : 'See Results'}
              onPress={next}
              style={{ width: '100%' }}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  eyebrow: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: typography.microLabelLetterSpacing,
    marginBottom: spacing.sm,
  },
  xpCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: radii.card + 2,
    padding: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(231,185,60,0.3)',
    marginBottom: spacing.lg,
  },
  xpCardValue: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.statMed,
    color: colors.textPrimary,
  },
  ageBandRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  ageBandPill: {
    flex: 1,
    borderRadius: radii.cardTiny,
    paddingVertical: spacing.sm,
    paddingHorizontal: 4,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
  },
  ageBandPillActive: {
    backgroundColor: 'rgba(231,185,60,0.18)',
    borderColor: 'rgba(231,185,60,0.4)',
  },
  ageBandText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.microLabel,
    color: colors.textOnDark,
    textAlign: 'center',
  },
  ageBandTextActive: {
    color: colors.goldText,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radii.cardSmall,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  themeIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.cardTiny,
    backgroundColor: 'rgba(231,185,60,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeIconText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.bodySmall,
  },
  themeText: {
    flex: 1,
    minWidth: 0,
  },
  themeName: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.cardTitleSm,
    color: colors.textPrimary,
  },
  themeSub: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.micro,
    color: colors.textSecondary,
  },
  themeStatus: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radii.cardSmall + 2,
    padding: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  tfBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    borderRadius: radii.cardSmall + 2,
    padding: spacing.md,
    overflow: 'hidden',
  },
  bannerEmoji: {
    fontSize: 26,
  },
  tfChevron: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: 18,
    color: colors.purple,
  },
  headerProgress: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
    color: colors.textSecondary,
    width: 50,
    textAlign: 'right',
  },
  progressTrack: {
    height: 5,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.gold,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  diffPill: {
    backgroundColor: 'rgba(231,185,60,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(231,185,60,0.3)',
    borderRadius: radii.pill,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },
  diffPillText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.microLabel,
    color: colors.goldText,
  },
  metaPill: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radii.pill,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
  },
  metaPillText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.microLabel,
    color: colors.textSecondary,
  },
  questionText: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.sectionTitle - 2,
    color: colors.textPrimary,
    lineHeight: 27,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radii.cardSmall,
    padding: spacing.md,
  },
  optionDot: {
    width: 24,
    height: 24,
    borderRadius: radii.pill,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionMark: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.microLabel,
    color: colors.onGold,
  },
  optionText: {
    flex: 1,
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.body,
    lineHeight: 20,
  },
  explanationCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
    borderRadius: radii.cardSmall,
    padding: spacing.md,
  },
  explanationText: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.bodySmall,
    color: colors.textOnDark,
    lineHeight: 21,
  },
  factCard: {
    backgroundColor: 'rgba(231,185,60,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(231,185,60,0.3)',
    borderRadius: radii.cardSmall,
    padding: spacing.md,
    gap: 4,
  },
  factTitle: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
    color: colors.goldText,
  },
  factText: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.bodySmall,
    color: colors.textOnDark,
    lineHeight: 21,
  },
  goalText: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.micro,
    color: colors.textTertiary,
  },
  resultContainer: {
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.xl,
  },
  resultBadge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  resultBadgeText: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.statSmall + 4,
    color: colors.onGold,
  },
  resultMessage: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.headerLg + 1,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  resultXp: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  resultBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(231,185,60,0.3)',
    borderRadius: radii.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  resultBadgeEmoji: {
    fontSize: 20,
  },
  resultBadgePillText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.bodySmall,
    color: colors.goldText,
  },
  tryAgainButton: {
    paddingHorizontal: spacing.xl,
  },
  backToHubLink: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.bodySmall,
    color: colors.textOnDark,
    textDecorationLine: 'underline',
  },
});
