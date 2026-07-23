import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Card from '../../src/components/Card';
import PillButton from '../../src/components/PillButton';
import { factOfTheDay, scientistOfTheDay } from '../../src/data/dailyContent';
import { useAppState } from '../../src/state/AppState';
import { colors, radii, spacing, typography } from '../../src/theme';

const MISSION_TABS = ['Learn', 'Explore', 'Discover'] as const;

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function HomeScreen() {
  const { userName, xpTotal, streakDays, streakCelebration, dismissStreakCelebration, addXp } =
    useAppState();
  const [missionTab, setMissionTab] = useState<(typeof MISSION_TABS)[number]>('Learn');
  const scientist = scientistOfTheDay();
  const { fact } = factOfTheDay();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.topBar}>
          <Text style={styles.greeting}>
            {greeting()}, {userName}!
          </Text>
          {streakDays > 0 && (
            <View style={styles.streakPill}>
              <Text style={styles.streakPillText}>{streakDays}-day streak</Text>
            </View>
          )}
        </View>

        <Card style={styles.missionCard}>
          <Text style={styles.sectionTitle}>Today's Mission</Text>
          <View style={styles.missionTabs}>
            {MISSION_TABS.map((tab) => {
              const active = tab === missionTab;
              return (
                <Pressable
                  key={tab}
                  onPress={() => setMissionTab(tab)}
                  style={[styles.missionTab, active && styles.missionTabActive]}
                >
                  <Text style={[styles.missionTabText, active && styles.missionTabTextActive]}>
                    {tab}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <PillButton
            label="Continue Learning"
            onPress={() => addXp(10)}
            style={styles.continueButton}
          />
        </Card>

        <Pressable onPress={() => router.push(`/scientist/${scientist.id}`)}>
          <Card style={styles.sectionCardSpacing}>
            <Text style={styles.sectionTitle}>Story of the Day</Text>
            <Text style={styles.storyName}>{scientist.name}</Text>
            <Text style={styles.bodyText}>{scientist.tagline}</Text>
          </Card>
        </Pressable>

        <Card style={styles.sectionCardSpacing}>
          <Text style={styles.sectionTitle}>Daily Discovery</Text>
          <Text style={styles.bodyText}>{fact}</Text>
        </Card>

        <Text style={styles.xpFooter}>{xpTotal} Curiosity Points earned so far</Text>
      </ScrollView>

      <Modal visible={streakCelebration} transparent animationType="fade">
        <View style={styles.celebrationBackdrop}>
          <Card style={styles.celebrationCard}>
            <Text style={styles.celebrationEmoji}>🎉</Text>
            <Text style={styles.celebrationTitle}>{streakDays}-Day Streak!</Text>
            <Text style={styles.bodyText}>+100 XP Bonus</Text>
            <PillButton label="Nice!" onPress={dismissStreakCelebration} style={styles.continueButton} />
          </Card>
        </View>
      </Modal>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  greeting: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.sectionTitle,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  streakPill: {
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.sm,
  },
  streakPillText: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.microLabel,
    color: colors.gold,
  },
  missionCard: {},
  sectionCardSpacing: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.cardTitle,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  missionTabs: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  missionTab: {
    flex: 1,
    borderRadius: radii.pill,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  missionTabActive: {
    backgroundColor: colors.gold,
  },
  missionTabText: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
  },
  missionTabTextActive: {
    color: colors.onGold,
  },
  continueButton: {
    width: '100%',
  },
  bodyText: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.body,
    color: colors.textOnDark,
    lineHeight: 20,
  },
  storyName: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.body,
    color: colors.gold,
    marginBottom: 4,
  },
  xpFooter: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  celebrationBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,11,46,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  celebrationCard: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  celebrationEmoji: {
    fontSize: 40,
    marginBottom: spacing.xs,
  },
  celebrationTitle: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.sectionTitle,
    color: colors.gold,
    marginBottom: spacing.xs,
  },
});
