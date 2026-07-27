import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AtomWatermark from '../src/components/AtomWatermark';
import PillButton from '../src/components/PillButton';
import { colors, spacing, typography } from '../src/theme';

const SECTIONS = [
  {
    title: 'What is Curious Minds?',
    body: "Curious Minds introduces children to India's greatest scientists through engaging stories, quizzes and fun facts. From APJ Abdul Kalam to CV Raman — real heroes of science.",
  },
  {
    title: 'Why Does It Matter?',
    body: "India has produced some of the world's greatest scientific minds. Yet most children know little about them. Curious Minds brings these inspiring stories into everyday life.",
  },
  {
    title: 'How Will It Help?',
    body: 'Children who learn about real scientists develop curiosity, critical thinking, and a love for learning. These are skills that last a lifetime.',
  },
];

export default function ParentsScreen() {
  return (
    <LinearGradient colors={colors.parentsGradient} style={styles.container}>
      <AtomWatermark size={260} style={styles.watermarkTop} />
      <AtomWatermark size={180} style={styles.watermarkBottom} />

      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </Pressable>

          <Text style={styles.heading}>Message for Parents</Text>
          <Text style={styles.opening}>
            Every child is born curious. But curiosity needs fuel.
          </Text>

          {SECTIONS.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionBody}>{section.body}</Text>
            </View>
          ))}

          <Text style={styles.closing}>10 Minutes a Day.{'\n'}A Lifetime of Curiosity.</Text>

          <PillButton
            label="Start Exploring 🔬"
            onPress={() => router.replace('/')}
            style={styles.cta}
          />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  watermarkTop: {
    position: 'absolute',
    top: -60,
    right: -60,
  },
  watermarkBottom: {
    position: 'absolute',
    bottom: -40,
    left: -60,
  },
  scroll: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl * 2,
  },
  backButton: {
    marginBottom: spacing.lg,
  },
  backButtonText: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.body,
    color: colors.goldText,
  },
  heading: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.hero,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  opening: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontStyle: 'italic',
    fontSize: typography.size.cardTitle,
    color: colors.textOnDark,
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.sectionTitle,
    color: colors.gold,
    marginBottom: spacing.xs,
  },
  sectionBody: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.body,
    color: colors.textOnDark,
    lineHeight: 21,
  },
  closing: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.sectionTitle,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    lineHeight: 28,
  },
  cta: {
    width: '100%',
  },
});
