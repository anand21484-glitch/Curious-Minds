import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Card from '../../src/components/Card';
import { getScientist } from '../../src/data/scientists';
import { colors, fields, radii, spacing, typography } from '../../src/theme';

export default function ScientistProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scientist = getScientist(id);

  if (!scientist) {
    return (
      <View style={styles.container}>
        <Text style={styles.bodyText}>Scientist not found.</Text>
      </View>
    );
  }

  const field = fields.find((f) => f.id === scientist.field);
  const accentColor = field?.color ?? colors.gold;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={[styles.backButtonText, { color: accentColor }]}>← Back</Text>
      </Pressable>

      <Card style={[styles.hero, { borderColor: accentColor }]}>
        <View style={[styles.badge, { backgroundColor: accentColor }]}>
          <Text style={styles.badgeText}>
            {scientist.name
              .split(' ')
              .map((w) => w[0])
              .slice(0, 2)
              .join('')}
          </Text>
        </View>
        <Text style={styles.name}>{scientist.name}</Text>
        <Text style={styles.meta}>
          {scientist.years} · {scientist.region} · {field?.name}
        </Text>
        <Text style={styles.tagline}>{scientist.tagline}</Text>
      </Card>

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Story</Text>
        <Text style={styles.bodyText}>{scientist.story}</Text>
      </Card>

      <Card style={[styles.sectionCard, { borderColor: accentColor }]}>
        <Text style={styles.sectionTitle}>Curiosity Corner</Text>
        <Text style={styles.bodyText}>{scientist.fun_fact}</Text>
      </Card>

      <Card style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Biggest Achievement</Text>
        <Text style={styles.bodyText}>{scientist.achievement}</Text>
      </Card>

      <Card style={styles.sectionCard}>
        <Text style={styles.quote}>"{scientist.quote}"</Text>
        <Text style={styles.quoteAttribution}>— {scientist.name}</Text>
      </Card>

      <Pressable onPress={() => router.push(`/(tabs)/quiz?scientistId=${scientist.id}`)}>
        <Card style={[styles.quizCta, { backgroundColor: accentColor }]}>
          <Text style={styles.quizCtaText}>Take the {scientist.name} Quiz</Text>
        </Card>
      </Pressable>
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
    paddingBottom: spacing.xl,
  },
  backButton: {
    marginBottom: spacing.md,
  },
  backButtonText: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.body,
  },
  hero: {
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  badgeText: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.sectionTitle,
    color: colors.onGold,
  },
  name: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.hero,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  meta: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.microLabel,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: typography.microLabelLetterSpacing,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  tagline: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.body,
    color: colors.textOnDark,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  sectionCard: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.cardTitle,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  bodyText: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.body,
    color: colors.textOnDark,
    lineHeight: 21,
  },
  quote: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.cardTitle,
    color: colors.gold,
    fontStyle: 'italic',
  },
  quoteAttribution: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  quizCta: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  quizCtaText: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.body,
    color: colors.onGold,
  },
});
