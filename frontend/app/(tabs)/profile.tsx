import Constants from 'expo-constants';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenHeader from '../../src/components/ScreenHeader';
import { computeBadges } from '../../src/data/badges';
import { computeCuriosityStats } from '../../src/data/curiosity';
import { levelForXp } from '../../src/data/levels';
import { useAppState } from '../../src/state/AppState';
import { colors, radii, spacing, typography } from '../../src/theme';

const PRIVACY_POLICY_URL = 'https://anand21484-glitch.github.io/TheYoungLegends.co.in/privacy-policy.html';

function Eyebrow({ children }: { children: string }) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export default function ProfileScreen() {
  const { userName, xpTotal, streakDays, completedQuizzes, tfStats, resetProgress, resetStats } = useAppState();

  const { current } = levelForXp(xpTotal);
  const stats = computeCuriosityStats({ completedQuizzes, streakDays, tfStats });
  const badges = computeBadges({ completedQuizzes, streakDays, tfChallengesPlayed: tfStats.challengesPlayed });
  const unlockedBadges = badges.filter((b) => b.unlocked).length;

  const handleReset = () => {
    Alert.alert(
      'Reset Progress',
      'This will clear all your XP, badges and progress. Your name will be kept. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetStats();
          },
        },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          resetProgress();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="👤 Profile" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>{current.emoji}</Text>
          </View>
          <Text style={styles.helloText}>Hello, {userName}! 👋</Text>
          <Text style={styles.levelText}>Level: {current.name}</Text>
        </View>

        <View>
          <Eyebrow>📊 My Progress</Eyebrow>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>⭐ XP Points</Text>
              <Text style={styles.rowValue}>{xpTotal}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>🏆 Badges</Text>
              <Text style={styles.rowValue}>
                {unlockedBadges}/{badges.length}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>🔥 Day Streak</Text>
              <Text style={styles.rowValue}>{streakDays}</Text>
            </View>
            <View style={[styles.row, styles.rowLast]}>
              <Text style={styles.rowLabel}>🔬 Scientists</Text>
              <Text style={styles.rowValue}>
                {stats.scientistsDiscovered}/{stats.scientistsTotal}
              </Text>
            </View>
          </View>
        </View>

        <View>
          <Eyebrow>⚙️ Settings</Eyebrow>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>📱 App Version</Text>
              <Text style={styles.rowValue}>{Constants.expoConfig?.version ?? '1.0.0'}</Text>
            </View>
            <Pressable
              style={styles.row}
              onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
            >
              <Text style={styles.rowLabel}>🔒 Privacy Policy</Text>
              <Text style={styles.rowChevron}>›</Text>
            </Pressable>
            <Pressable
              style={[styles.row, styles.rowLast]}
              onPress={() =>
                Alert.alert('Rate the App', "Thanks for the love! This will be ready once we're live on the app stores.")
              }
            >
              <Text style={styles.rowLabel}>⭐ Rate the App</Text>
              <Text style={styles.rowChevron}>›</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <Pressable onPress={handleReset} style={styles.resetButton}>
            <Text style={styles.resetText}>🔄 Reset Progress</Text>
          </Pressable>
          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>🚪 Log Out</Text>
          </Pressable>
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
    gap: spacing.xl,
  },
  eyebrow: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: typography.microLabelLetterSpacing,
    marginBottom: spacing.sm,
  },
  heroCard: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.lg,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: radii.pill,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  helloText: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.headerLg + 1,
    color: colors.textPrimary,
  },
  levelText: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: radii.card,
    paddingHorizontal: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.bodySmall,
    color: colors.textOnDark,
  },
  rowValue: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.bodySmall,
    color: colors.textPrimary,
  },
  rowChevron: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.cardTitle,
    color: colors.textTertiary,
  },
  buttonGroup: {
    gap: spacing.sm,
  },
  resetButton: {
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.orange,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm + 1,
  },
  resetText: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.cardTitleSm,
    color: colors.orange,
  },
  logoutButton: {
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.errorAlt,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm + 1,
  },
  logoutText: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.cardTitleSm,
    color: colors.errorAlt,
  },
});
