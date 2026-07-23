import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ScientistAvatar from '../../src/components/ScientistAvatar';
import { getScientistsByField, scientists } from '../../src/data/scientists';
import { colors, fields, radii, spacing, typography } from '../../src/theme';

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

const BROWSE_MODES = ['By Field', 'By State'] as const;
type BrowseMode = (typeof BROWSE_MODES)[number];

function ScientistRow({ scientistId, borderColor }: { scientistId: string; borderColor?: string }) {
  const s = scientists.find((x) => x.id === scientistId)!;
  return (
    <Pressable
      style={[styles.scientistCard, { borderColor: borderColor ?? colors.hairline }]}
      onPress={() => router.push(`/scientist/${s.id}`)}
    >
      <ScientistAvatar scientist={s} size={40} />
      <View style={styles.scientistCardText}>
        <Text style={styles.scientistName}>{s.name}</Text>
        <Text style={styles.scientistMeta}>
          {s.years} · {s.region}
        </Text>
        <Text style={styles.scientistTagline}>{s.tagline}</Text>
      </View>
    </Pressable>
  );
}

export default function ExploreScreen() {
  const [browseMode, setBrowseMode] = useState<BrowseMode>('By Field');
  const [expanded, setExpanded] = useState<string | null>('modern');
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const states = useMemo(
    () => Array.from(new Set(scientists.map((s) => s.region))).sort(),
    [],
  );

  const selectedField = fields.find((f) => f.id === selectedFieldId);
  const fieldScientists = selectedFieldId ? getScientistsByField(selectedFieldId) : [];
  const stateScientists = selectedState ? scientists.filter((s) => s.region === selectedState) : [];

  const modeToggle = (
    <View style={styles.modeToggle}>
      {BROWSE_MODES.map((mode) => {
        const active = mode === browseMode;
        return (
          <Pressable
            key={mode}
            onPress={() => setBrowseMode(mode)}
            style={[styles.modePill, active && styles.modePillActive]}
          >
            <Text style={[styles.modePillText, active && styles.modePillTextActive]}>{mode}</Text>
          </Pressable>
        );
      })}
    </View>
  );

  if (selectedFieldId) {
    return (
      <View style={styles.container}>
        <View style={styles.scroll}>
          <Pressable onPress={() => setSelectedFieldId(null)} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: selectedField?.color }]}>← Explore</Text>
          </Pressable>
          <Text style={styles.title}>{selectedField?.name}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scroll}>
          {fieldScientists.length === 0 ? (
            <Text style={styles.emptyText}>Scientist profiles for this field are coming soon.</Text>
          ) : (
            fieldScientists.map((s) => (
              <ScientistRow key={s.id} scientistId={s.id} borderColor={selectedField?.color} />
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>Explore</Text>
      {modeToggle}

      {browseMode === 'By Field' &&
        SECTIONS.map((section) => {
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
                    const count = getScientistsByField(fieldId).length;
                    return (
                      <Pressable
                        key={field.id}
                        style={styles.fieldCard}
                        onPress={() => setSelectedFieldId(field.id)}
                      >
                        <View style={[styles.fieldBadge, { backgroundColor: field.color }]}>
                          <Text style={styles.fieldBadgeText}>{field.mono}</Text>
                        </View>
                        <Text style={styles.fieldName}>{field.name}</Text>
                        <Text style={styles.fieldCount}>{count} scientists</Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}

      {browseMode === 'By State' && (
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stateChipRow}>
            {states.map((state) => {
              const active = state === selectedState;
              return (
                <Pressable
                  key={state}
                  onPress={() => setSelectedState(active ? null : state)}
                  style={[styles.stateChip, active && styles.stateChipActive]}
                >
                  <Text style={[styles.stateChipText, active && styles.stateChipTextActive]}>
                    {state}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {selectedState ? (
            stateScientists.map((s) => <ScientistRow key={s.id} scientistId={s.id} />)
          ) : (
            <Text style={styles.emptyText}>Pick a state above to see its scientists.</Text>
          )}
        </View>
      )}
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
  backButton: {
    marginBottom: spacing.sm,
  },
  backButtonText: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.body,
  },
  title: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.hero,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  modeToggle: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  modePill: {
    flex: 1,
    borderRadius: radii.pill,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  modePillActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  modePillText: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
  },
  modePillTextActive: {
    color: colors.onGold,
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
  fieldCount: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyText: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.body,
    color: colors.textSecondary,
  },
  stateChipRow: {
    marginBottom: spacing.md,
  },
  stateChip: {
    borderRadius: radii.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    marginRight: spacing.xs,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  stateChipActive: {
    backgroundColor: colors.purple,
    borderColor: colors.purple,
  },
  stateChipText: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
  },
  stateChipTextActive: {
    color: colors.textPrimary,
  },
  scientistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  scientistCardText: {
    flex: 1,
  },
  scientistName: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.body,
    color: colors.textPrimary,
  },
  scientistMeta: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.microLabel,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.xs,
  },
  scientistTagline: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.bodySmall,
    color: colors.textOnDark,
  },
});
