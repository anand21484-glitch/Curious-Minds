import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Card from '../../src/components/Card';
import { levelForXp } from '../../src/data/levels';
import { useAppState } from '../../src/state/AppState';
import { colors, radii, spacing, typography } from '../../src/theme';

function MetricCard({ label, value, children }: { label: string; value: string; children?: React.ReactNode }) {
  return (
    <Card style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      {children}
    </Card>
  );
}

export default function RankScreen() {
  const { xpTotal, streakDays } = useAppState();
  const { current, next, progress } = levelForXp(xpTotal);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Curiosity Dashboard</Text>

      <MetricCard label="Curiosity Level" value={`${current.emoji} ${current.name}`}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        {next && (
          <Text style={styles.metricSub}>
            {next.min - xpTotal} XP to {next.name}
          </Text>
        )}
      </MetricCard>

      <MetricCard label="Curiosity Points (XP)" value={String(xpTotal)} />
      <MetricCard label="Daily Streak" value={`${streakDays} days`} />

      <MetricCard label="Scientists Discovered" value="0 / 60" />
      <MetricCard label="Field Mastery" value="Not started" />
      <MetricCard label="Friends Leaderboard" value="No friends invited yet" />
      <MetricCard label="Fast Thinker Score" value="—" />
      <MetricCard label="Accuracy Rate" value="—" />
      <MetricCard label="Discovery Badges" value="0 / 16 unlocked" />
      <MetricCard label="Curiosity Quotient (CQ)" value="0" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.hero,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  metricCard: {
    marginBottom: spacing.sm,
  },
  metricLabel: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.microLabel,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: typography.microLabelLetterSpacing,
    marginBottom: 4,
  },
  metricValue: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.statSmall,
    color: colors.textPrimary,
  },
  metricSub: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  progressTrack: {
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.background,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: radii.pill,
  },
});
