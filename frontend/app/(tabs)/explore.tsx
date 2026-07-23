import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { fields } from '../../src/theme';
import { colors, radii, spacing, typography } from '../../src/theme';

const MODERN_FIELD_IDS = [
  'math',
  'physics',
  'space',
  'medicine',
  'life',
  'engineering',
  'chemistry',
  'biotechnology',
  'pharma',
  'environment',
  'agriculture',
  'marine',
];

const SECTIONS = [
  { id: 'modern', name: 'Modern India', fieldIds: MODERN_FIELD_IDS },
  { id: 'ancient', name: 'Ancient India', fieldIds: ['ancient'] },
  { id: 'nobel', name: 'Nobel Laureates', fieldIds: ['nobel'] },
] as const;

export default function ExploreScreen() {
  const [expanded, setExpanded] = useState<string | null>('modern');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Explore</Text>

      {SECTIONS.map((section) => {
        const isOpen = expanded === section.id;
        return (
          <View key={section.id} style={styles.section}>
            <Pressable
              onPress={() => setExpanded(isOpen ? null : section.id)}
              style={styles.sectionHeader}
            >
              <Text style={styles.sectionTitle}>{section.name}</Text>
              <Text style={styles.sectionChevron}>{isOpen ? '−' : '+'}</Text>
            </Pressable>

            {isOpen && (
              <View style={styles.grid}>
                {section.fieldIds.map((fieldId) => {
                  const field = fields.find((f) => f.id === fieldId);
                  if (!field) return null;
                  return (
                    <Pressable key={field.id} style={styles.fieldCard}>
                      <View style={[styles.fieldBadge, { backgroundColor: field.color }]}>
                        <Text style={styles.fieldBadgeText}>{field.mono}</Text>
                      </View>
                      <Text style={styles.fieldName}>{field.name}</Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
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
  },
  title: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.hero,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.sectionTitle,
    color: colors.textPrimary,
  },
  sectionChevron: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.sectionTitle,
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  fieldCard: {
    width: '31%',
    backgroundColor: colors.surface,
    borderRadius: radii.cardSmall,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  fieldBadge: {
    width: 32,
    height: 32,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  fieldBadgeText: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.bodySmall,
    color: colors.onGold,
  },
  fieldName: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.microLabel,
    color: colors.textOnDark,
    textAlign: 'center',
  },
});
