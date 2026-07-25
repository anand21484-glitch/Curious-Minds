import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Card from '../../src/components/Card';
import PillButton from '../../src/components/PillButton';
import { factOfTheDay } from '../../src/data/dailyContent';
import { useAppState } from '../../src/state/AppState';
import { colors, radii, spacing, typography } from '../../src/theme';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function HomeScreen() {
  const { userName, streakDays, streakCelebration, dismissStreakCelebration, addXp } =
    useAppState();
  const { fact } = factOfTheDay();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoMark}>
            <Text style={styles.logoText}>CM</Text>
          </View>
          <Text style={styles.headerTitle}>Hi, {userName}</Text>
        </View>
        {streakDays > 0 && (
          <View style={styles.streakPill}>
            <View style={styles.streakDot} />
            <Text style={styles.streakPillText}>{streakDays}-day streak</Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.heroCard, styles.cardGradientBorder]}>
          <LinearGradient colors={colors.heroGradient} style={StyleSheet.absoluteFill} />
          <View style={styles.heroGlow} />
          <Text style={styles.heroTitle}>Stay Curious.</Text>
          <Text style={styles.heroBody}>
            Every invention, every medicine, every satellite, and every great discovery began with
            someone asking a simple question: "Why?"
          </Text>
          <Pressable onPress={() => router.push('/mission')} style={styles.heroCta}>
            <Text style={styles.heroCtaText}>Our Mission →</Text>
          </Pressable>
        </View>

        <View style={styles.greetingCard}>
          <LinearGradient colors={colors.greetingGradient} style={StyleSheet.absoluteFill} />
          <Text style={styles.greetingTitle}>
            {greeting()}, {userName}!
          </Text>
          <View>
            <Text style={styles.eyebrow}>Today's Mission</Text>
            <View style={styles.missionTabs}>
              {['Learn', 'Explore', 'Discover'].map((label) => (
                <View key={label} style={styles.missionTab}>
                  <Text style={styles.missionTabText}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
          <Text style={styles.greetingSub}>One question can change the world.</Text>
          <Pressable onPress={() => addXp(10)} style={styles.continueButton}>
            <Text style={styles.continueButtonText}>▶ Continue Learning</Text>
          </Pressable>
        </View>

        <View>
          <Text style={styles.eyebrow}>Daily Discovery</Text>
          <View style={styles.discoveryCard}>
            <LinearGradient colors={colors.discoveryGradient} style={StyleSheet.absoluteFill} />
            <Text style={styles.discoveryTitle}>🌙 Did you know?</Text>
            <Text style={styles.discoveryBody}>{fact}</Text>
          </View>
        </View>
      </ScrollView>

      <Modal visible={streakCelebration} transparent animationType="fade">
        <View style={styles.celebrationBackdrop}>
          <View style={styles.celebrationCard}>
            <LinearGradient colors={colors.heroGradient} style={StyleSheet.absoluteFill} />
            <Text style={styles.celebrationEmoji}>🎉 🥳 🎊</Text>
            <Text style={styles.celebrationTitle}>{streakDays}-Day Streak!</Text>
            <Text style={styles.celebrationBody}>
              You've shown up and stayed curious for {streakDays} days in a row. Keep the streak
              alive!
            </Text>
            <View style={styles.celebrationXpPill}>
              <Text style={styles.celebrationXpStar}>⭐</Text>
              <Text style={styles.celebrationXpText}>+100 XP Bonus</Text>
            </View>
            <PillButton label="Awesome!" onPress={dismissStreakCelebration} style={styles.celebrationButton} />
          </View>
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
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 1,
  },
  logoMark: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-6deg' }],
  },
  logoText: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: 15,
    color: colors.onGold,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.headerMd,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(231,185,60,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(231,185,60,0.3)',
    borderRadius: radii.pill,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
  },
  streakDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.gold,
  },
  streakPillText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
    color: colors.goldText,
  },
  scroll: {
    padding: spacing.lg,
    gap: spacing.xl,
  },
  cardGradientBorder: {
    borderWidth: 1,
    borderColor: 'rgba(231,185,60,0.3)',
  },
  heroCard: {
    borderRadius: radii.cardHero,
    padding: 20,
    overflow: 'hidden',
    gap: 10,
  },
  heroGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(231,185,60,0.12)',
  },
  heroTitle: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.statMed + 4,
    color: colors.textPrimary,
    lineHeight: 32,
  },
  heroBody: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.body,
    color: colors.textOnDark,
    lineHeight: 22,
  },
  heroCta: {
    alignSelf: 'flex-start',
    backgroundColor: colors.gold,
    borderRadius: radii.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    marginTop: 4,
  },
  heroCtaText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
    color: colors.onSoft,
  },
  greetingCard: {
    borderRadius: radii.cardHero,
    padding: 20,
    overflow: 'hidden',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
  },
  greetingTitle: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.headerLg + 1,
    color: colors.textPrimary,
  },
  eyebrow: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: typography.microLabelLetterSpacing,
    marginBottom: spacing.sm,
  },
  missionTabs: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  missionTab: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radii.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: 4,
  },
  missionTabText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
    color: colors.textOnDark,
  },
  greetingSub: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: colors.purple,
    borderRadius: radii.pill,
    paddingVertical: 13,
    alignItems: 'center',
  },
  continueButtonText: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.cardTitleSm,
    color: colors.textPrimary,
  },
  discoveryCard: {
    borderRadius: radii.cardHero,
    padding: 18,
    overflow: 'hidden',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(78,168,255,0.3)',
  },
  discoveryTitle: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.cardTitleSm,
    color: colors.blue,
  },
  discoveryBody: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.body,
    color: colors.textOnDark,
    lineHeight: 22,
  },
  celebrationBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(8,6,26,0.86)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  celebrationCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: radii.cardHero,
    padding: 24,
    overflow: 'hidden',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(231,185,60,0.4)',
  },
  celebrationEmoji: {
    fontSize: 34,
  },
  celebrationTitle: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.statSmall,
    color: colors.textPrimary,
  },
  celebrationBody: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.bodySmall,
    color: colors.textOnDark,
    textAlign: 'center',
    lineHeight: 21,
  },
  celebrationXpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(231,185,60,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(231,185,60,0.4)',
    borderRadius: radii.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  celebrationXpStar: {
    fontSize: 18,
  },
  celebrationXpText: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.cardTitleSm,
    color: colors.goldText,
  },
  celebrationButton: {
    width: '100%',
    marginTop: 6,
  },
});
