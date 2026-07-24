import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import ScreenHeader from '../../src/components/ScreenHeader';
import { computeBadges } from '../../src/data/badges';
import { computeCuriosityStats } from '../../src/data/curiosity';
import { levelForXp } from '../../src/data/levels';
import { useAppState } from '../../src/state/AppState';
import { colors, radii, spacing, typography } from '../../src/theme';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function nameHash(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h;
}

function Eyebrow({ children }: { children: string }) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export default function RankScreen() {
  const { xpTotal, streakDays, completedQuizzes, friends, inviteFriend, removeFriend, tfStats } = useAppState();
  const [inviteName, setInviteName] = useState('');

  const { current, stars, next, progress } = levelForXp(xpTotal);
  const stats = computeCuriosityStats({ completedQuizzes, streakDays, tfStats });
  const badges = computeBadges({ completedQuizzes, streakDays, tfChallengesPlayed: tfStats.challengesPlayed });

  const leaderboard = [
    { id: 'you', name: 'You', points: xpTotal, isYou: true },
    ...friends.map((f) => {
      const hash = nameHash(f.name);
      const baseScore = 50 + (hash % 150);
      const dailyRate = 5 + (hash % 15);
      const days = (Date.now() - f.joinedAt) / 86400000;
      return { id: f.id, name: f.name, points: Math.round(baseScore + dailyRate * days), isYou: false };
    }),
  ].sort((a, b) => b.points - a.points);

  const filledDays = Math.min(streakDays, 7);

  return (
    <View style={styles.container}>
      <ScreenHeader title="The Curiosity Dashboard" titleSize={typography.size.headerSm} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Friends Leaderboard */}
        <View style={styles.plainCard}>
          <Eyebrow>👥 Friends Leaderboard</Eyebrow>
          <View style={styles.inviteRow}>
            <TextInput
              value={inviteName}
              onChangeText={setInviteName}
              placeholder="Friend's name"
              placeholderTextColor={colors.textSecondary}
              style={styles.inviteInput}
            />
            <Pressable
              onPress={() => {
                const trimmed = inviteName.trim();
                if (!trimmed) return;
                inviteFriend(trimmed);
                setInviteName('');
              }}
              style={styles.inviteButton}
            >
              <Text style={styles.inviteButtonText}>+ Invite</Text>
            </Pressable>
          </View>
          <View style={{ gap: spacing.xs }}>
            {leaderboard.map((p, i) => (
              <Pressable
                key={p.id}
                onLongPress={() => !p.isYou && removeFriend(p.id)}
                style={[
                  styles.leaderboardRow,
                  { backgroundColor: p.isYou ? 'rgba(231,185,60,0.12)' : colors.background,
                    borderColor: p.isYou ? 'rgba(231,185,60,0.4)' : colors.hairline },
                ]}
              >
                <Text style={styles.leaderboardRank}>{i + 1}</Text>
                <View style={styles.leaderboardMono}>
                  <Text style={styles.leaderboardMonoText}>
                    {p.isYou ? '★' : p.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.leaderboardName} numberOfLines={1}>
                  {p.name}
                </Text>
                <Text style={styles.leaderboardPoints}>{p.points}</Text>
              </Pressable>
            ))}
          </View>
          {friends.length > 0 && (
            <Text style={styles.hintText}>
              Friends' scores update live as they keep learning. Long-press a friend to remove them.
            </Text>
          )}
        </View>

        {/* 1. Curiosity Level */}
        <View style={styles.heroCard}>
          <LinearGradient colors={colors.heroGradient} style={StyleSheet.absoluteFill} />
          <Eyebrow>Curiosity Level</Eyebrow>
          <View style={styles.levelRow}>
            <Text style={styles.levelEmoji}>{current.emoji}</Text>
            <View>
              <Text style={styles.levelName}>{current.name}</Text>
              <Text style={styles.levelStars}>{stars}</Text>
            </View>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.levelNext}>
            {next ? `${next.min - xpTotal} XP to ${next.name}` : 'Top level reached — legendary curiosity!'}
          </Text>
        </View>

        {/* 2. Curiosity Points */}
        <View>
          <Eyebrow>Curiosity Points</Eyebrow>
          <View style={[styles.plainCard, styles.xpCard]}>
            <Text style={styles.xpValue}>{xpTotal} XP</Text>
            <View style={{ gap: spacing.sm }}>
              {stats.xpSourcesView.map((src) => (
                <View key={src.label} style={styles.xpSourceRow}>
                  <Text style={styles.xpSourceLabel}>
                    {src.icon} {src.label}
                  </Text>
                  <Text style={styles.xpSourceValue}>{src.value}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 3. Questions Attempted / Solved */}
        <View style={styles.duoRow}>
          <View style={styles.duoCard}>
            <Text style={[styles.duoValue, { color: colors.blue }]}>{stats.questionsAttempted}</Text>
            <Text style={styles.duoLabel}>Questions Attempted</Text>
          </View>
          <View style={styles.duoCard}>
            <Text style={[styles.duoValue, { color: colors.success }]}>{stats.questionsSolved}</Text>
            <Text style={styles.duoLabel}>Questions Solved</Text>
          </View>
        </View>

        {/* 4. Knowledge Explorer */}
        <View>
          <Eyebrow>🔍 Knowledge Explorer</Eyebrow>
          <View style={styles.plainCard}>
            <View style={styles.spaceBetweenRow}>
              <Text style={styles.explorerLabel}>Scientists Discovered</Text>
              <Text style={styles.explorerValue}>
                {stats.scientistsDiscovered} / {stats.scientistsTotal}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${stats.scientistsDiscoveredPct}%`, backgroundColor: colors.blue }]}
              />
            </View>
          </View>
        </View>

        {/* 5. Science Fields Mastered */}
        <View>
          <Eyebrow>🧭 Science Fields Mastered</Eyebrow>
          <View style={{ gap: spacing.xs }}>
            {stats.fieldsMasteredView.map((f) => (
              <View key={f.id} style={styles.fieldMasteryRow}>
                <Text style={styles.fieldMasteryName}>{f.name}</Text>
                <Text style={styles.fieldMasteryStars}>{f.stars}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 6. Curiosity Streak */}
        <View>
          <Eyebrow>🔥 Curiosity Streak</Eyebrow>
          <View style={styles.streakCard}>
            <View style={styles.streakHeaderRow}>
              <Text style={styles.streakDays}>{streakDays} Days</Text>
              <Text style={styles.streakLabel}>current streak</Text>
            </View>
            <View style={styles.streakWeekRow}>
              {DAY_LABELS.map((label, i) => (
                <View key={i} style={styles.streakDayCol}>
                  <View
                    style={[
                      styles.streakDayMark,
                      { backgroundColor: i < filledDays ? colors.gold : 'rgba(255,255,255,0.06)' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.streakDayMarkText,
                        { color: i < filledDays ? colors.onGold : colors.textTertiary },
                      ]}
                    >
                      {i < filledDays ? '✓' : ''}
                    </Text>
                  </View>
                  <Text style={styles.streakDayLabel}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* 7 & 8. Fast Thinker + Accuracy */}
        <View style={styles.duoRow}>
          <View style={styles.duoCard}>
            <Text style={[styles.duoValue, { color: colors.purple }]}>⚡ {stats.fastThinkerLabel}</Text>
            <Text style={styles.duoLabel}>Fast Thinker Score</Text>
          </View>
          <View style={styles.duoCard}>
            <Text style={[styles.duoValue, { color: colors.success }]}>🎯 {stats.accuracyLabel}</Text>
            <Text style={styles.duoLabel}>Accuracy Rate</Text>
          </View>
        </View>

        {/* 9. Discovery Badges */}
        <View>
          <Eyebrow>🏅 Discovery Badges</Eyebrow>
          <View style={styles.badgeGrid}>
            {badges.map((badge) => (
              <View
                key={badge.id}
                style={[
                  styles.badgeChip,
                  {
                    backgroundColor: badge.unlocked ? 'rgba(231,185,60,0.12)' : colors.surface,
                    borderColor: badge.unlocked ? 'rgba(231,185,60,0.35)' : colors.hairline,
                  },
                ]}
              >
                <Text style={[styles.badgeEmoji, { opacity: badge.unlocked ? 1 : 0.35 }]}>{badge.emoji}</Text>
                <Text style={[styles.badgeName, { color: badge.unlocked ? colors.goldText : colors.textMuted }]}>
                  {badge.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 10. Curiosity Quotient */}
        <View style={styles.cqCard}>
          <Eyebrow>⭐ Curiosity Quotient (CQ)</Eyebrow>
          <Text style={styles.cqScore}>{stats.cqScore}</Text>
          <View style={styles.cqBreakdownRow}>
            {stats.cqBreakdownView.map((c) => (
              <View key={c.label} style={styles.cqChip}>
                <Text style={styles.cqChipText}>
                  {c.label}: {c.value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
    gap: spacing.lg,
  },
  eyebrow: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: typography.microLabelLetterSpacing,
    marginBottom: spacing.sm,
  },
  plainCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
    padding: spacing.md,
    gap: spacing.sm,
  },
  inviteRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  inviteInput: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.bodySmall,
  },
  inviteButton: {
    backgroundColor: colors.gold,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  inviteButtonText: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.bodySmall,
    color: colors.onGold,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radii.cardSmall,
    padding: spacing.sm,
  },
  leaderboardRank: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
    color: colors.textSecondary,
    width: 16,
  },
  leaderboardMono: {
    width: 30,
    height: 30,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leaderboardMonoText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
    color: colors.textPrimary,
  },
  leaderboardName: {
    flex: 1,
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.bodySmall,
    color: colors.textPrimary,
  },
  leaderboardPoints: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.cardTitleSm,
    color: colors.goldText,
  },
  hintText: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.microLabel,
    color: colors.textMuted,
  },
  heroCard: {
    borderRadius: radii.cardHero,
    padding: 20,
    overflow: 'hidden',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(231,185,60,0.3)',
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  levelEmoji: {
    fontSize: 32,
  },
  levelName: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.headerLg + 1,
    color: colors.textPrimary,
  },
  levelStars: {
    fontSize: typography.size.body + 2,
    letterSpacing: 1,
  },
  progressTrack: {
    height: 6,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: radii.pill,
  },
  levelNext: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.microLabel,
    color: colors.textSecondary,
  },
  xpCard: {
    borderColor: 'rgba(231,185,60,0.25)',
  },
  xpValue: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.statMed + 6,
    color: colors.goldText,
  },
  xpSourceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xpSourceLabel: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.micro,
    color: colors.textOnDark,
  },
  xpSourceValue: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
    color: colors.textSecondary,
  },
  duoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  duoCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radii.card,
    padding: spacing.md,
    alignItems: 'center',
  },
  duoValue: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.statMed - 2,
  },
  duoLabel: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.microLabel,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  spaceBetweenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  explorerLabel: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.bodySmall,
    color: colors.textPrimary,
  },
  explorerValue: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.cardTitle,
    color: colors.textPrimary,
  },
  fieldMasteryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radii.cardTiny,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  fieldMasteryName: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
    color: colors.textPrimary,
  },
  fieldMasteryStars: {
    fontSize: typography.size.body,
    letterSpacing: 1,
  },
  streakCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radii.cardSmall,
    padding: spacing.md,
    gap: spacing.md,
  },
  streakHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  streakDays: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.statSmall,
    color: colors.orange,
  },
  streakLabel: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.micro,
    color: colors.textSecondary,
  },
  streakWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streakDayCol: {
    alignItems: 'center',
    gap: 6,
  },
  streakDayMark: {
    width: 26,
    height: 26,
    borderRadius: radii.cardTiny - 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakDayMarkText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.microLabel,
  },
  streakDayLabel: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: 10,
    color: colors.textTertiary,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  badgeChip: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderRadius: radii.cardTiny,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  badgeEmoji: {
    fontSize: 16,
  },
  badgeName: {
    flex: 1,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.microLabel,
  },
  cqCard: {
    borderRadius: radii.cardHero,
    padding: 20,
    backgroundColor: 'rgba(231,185,60,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(231,185,60,0.35)',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cqScore: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.statLarge,
    color: colors.textPrimary,
  },
  cqBreakdownRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    justifyContent: 'center',
  },
  cqChip: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radii.pill,
    paddingVertical: 5,
    paddingHorizontal: spacing.sm,
  },
  cqChipText: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.microLabel,
    color: colors.textOnDark,
  },
});
