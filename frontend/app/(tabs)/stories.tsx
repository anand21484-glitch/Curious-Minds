import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenHeader from '../../src/components/ScreenHeader';
import { scientists } from '../../src/data/scientists';
import { colors, fields, radii, softColor, spacing, typography } from '../../src/theme';

const FIELD_EMOJI: Record<string, string> = {
  math: '🔢',
  physics: '⚛️',
  space: '🚀',
  medicine: '🩺',
  life: '🌿',
  engineering: '⚙️',
  chemistry: '⚗️',
  biotechnology: '🧬',
  pharma: '💊',
  environment: '🌍',
  agriculture: '🌾',
  marine: '🌊',
  ancient: '🏛️',
  nobel: '🏆',
};

export default function StoriesScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Featured Stories" />
      <FlatList
        data={scientists}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => {
          const field = fields.find((f) => f.id === item.field);
          return (
            <Pressable
              style={[styles.card, { borderColor: softColor(field?.rgb ?? '231,185,60', 0.35) }]}
              onPress={() => router.push(`/scientist/${item.id}`)}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.episode, { color: field?.color }]}>EPISODE {index + 1}</Text>
                <Text style={styles.emoji}>{FIELD_EMOJI[item.field] ?? '📖'}</Text>
              </View>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.subtitle}>{item.tagline}</Text>
              <View style={[styles.cta, { backgroundColor: field?.color }]}>
                <Text style={styles.ctaText}>Read the story →</Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.cardHero,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    gap: spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  episode: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.microLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  emoji: {
    fontSize: 20,
  },
  title: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.cardTitle,
    color: colors.textPrimary,
    lineHeight: 21,
  },
  subtitle: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.micro,
    color: colors.textSecondary,
  },
  cta: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    marginTop: 4,
  },
  ctaText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
    color: colors.onSoft,
  },
});
