import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ScientistAvatar from '../../src/components/ScientistAvatar';
import ScreenHeader from '../../src/components/ScreenHeader';
import {
  getAncientScientists,
  getModernScientistsByField,
  getNobelLaureates,
  scientists,
} from '../../src/data/scientists';
import { colors, fields, radii, softColor, spacing, typography } from '../../src/theme';

const MODERN_FIELD_IDS: string[] = fields
  .filter((f) => f.id !== 'ancient' && f.id !== 'nobel')
  .map((f) => f.id);

const BANNERS = [
  { id: 'modern', name: 'Modern Scientists', mono: 'Mo', color: '#4EA8FF', rgb: '78,168,255' },
  { id: 'ancient', name: 'Ancient Indian Scientists', mono: 'An', color: '#F2B84B', rgb: '242,184,75' },
  { id: 'nobel', name: 'Nobel Laureates', mono: 'Nb', color: '#7CD9FF', rgb: '124,217,255' },
] as const;

const BROWSE_MODES = ['By Field', 'By State'] as const;
type BrowseMode = (typeof BROWSE_MODES)[number];

type Drill = { type: 'root' } | { type: 'modernGrid' } | { type: 'field'; fieldId: string } | { type: 'nobel' };

function ScientistRow({ scientistId }: { scientistId: string }) {
  const s = scientists.find((x) => x.id === scientistId)!;
  return (
    <Pressable style={styles.scientistRow} onPress={() => router.push(`/scientist/${s.id}`)}>
      <ScientistAvatar scientist={s} size={42} />
      <View style={styles.scientistRowText}>
        <Text style={styles.scientistName}>{s.name}</Text>
        <Text style={styles.scientistYears}>{s.years}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

export default function ExploreScreen() {
  const [browseMode, setBrowseMode] = useState<BrowseMode>('By Field');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [drill, setDrill] = useState<Drill>({ type: 'root' });

  const states = useMemo(() => Array.from(new Set(scientists.map((s) => s.region))).sort(), []);
  const stateScientists = selectedState ? scientists.filter((s) => s.region === selectedState) : [];

  const modernCount = MODERN_FIELD_IDS.reduce((sum, id) => sum + getModernScientistsByField(id).length, 0);
  const ancientCount = getAncientScientists().length;
  const nobelCount = getNobelLaureates().length;
  const bannerCount = (id: string) => (id === 'modern' ? modernCount : id === 'nobel' ? nobelCount : ancientCount);

  // ── Modern fields grid ──
  if (drill.type === 'modernGrid') {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Modern Scientists" onBack={() => setDrill({ type: 'root' })} />
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.grid}>
            {MODERN_FIELD_IDS.map((fieldId) => {
              const field = fields.find((f) => f.id === fieldId)!;
              const count = getModernScientistsByField(fieldId).length;
              return (
                <Pressable
                  key={fieldId}
                  style={[styles.gridCard, { borderColor: softColor(field.rgb, 0.4) }]}
                  onPress={() => setDrill({ type: 'field', fieldId })}
                >
                  <View style={[styles.gridIcon, { backgroundColor: softColor(field.rgb, 0.18) }]}>
                    <Text style={[styles.gridIconText, { color: field.color }]}>{field.mono}</Text>
                  </View>
                  <Text style={styles.gridName}>{field.name}</Text>
                  <Text style={styles.gridCount}>{count} scientists</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }

  // ── Field / Nobel scientist list ──
  if (drill.type === 'field' || drill.type === 'nobel') {
    const field = drill.type === 'field' ? fields.find((f) => f.id === drill.fieldId) : undefined;
    const list =
      drill.type === 'nobel'
        ? getNobelLaureates()
        : drill.fieldId === 'ancient'
          ? getAncientScientists()
          : getModernScientistsByField(drill.fieldId);
    const title = drill.type === 'nobel' ? 'Nobel Laureates' : field?.name ?? '';
    const goBack = () =>
      drill.type === 'field' && drill.fieldId !== 'ancient' && MODERN_FIELD_IDS.includes(drill.fieldId)
        ? setDrill({ type: 'modernGrid' })
        : setDrill({ type: 'root' });

    return (
      <View style={styles.container}>
        <ScreenHeader title={title} onBack={goBack} />
        <ScrollView contentContainerStyle={styles.scroll}>
          {drill.type === 'field' && drill.fieldId === 'ancient' && (
            <View style={[styles.banner, { borderColor: 'rgba(242,184,75,0.35)' }]}>
              <Text style={[styles.bannerTitle, { color: '#F2B84B' }]}>
                The Curious Minds of Ancient India
              </Text>
              <Text style={styles.bannerBody}>
                Before telescopes...{'\n'}Before microscopes...{'\n'}Before computers...{'\n'}
                <Text style={styles.bannerBodyStrong}>There were curious minds.</Text>
              </Text>
            </View>
          )}
          {drill.type === 'nobel' && (
            <View style={[styles.banner, { borderColor: 'rgba(124,217,255,0.35)' }]}>
              <Text style={[styles.bannerTitle, { color: '#7CD9FF' }]}>
                Nobel Prize Winning Scientists from India
              </Text>
              <Text style={styles.bannerBody}>
                Four Indian minds. Four Nobel Prizes.{'\n'}
                <Text style={styles.bannerBodyStrong}>Proof that curiosity can change the world.</Text>
              </Text>
            </View>
          )}

          {list.length === 0 ? (
            <Text style={styles.emptyText}>Scientist profiles for this field are coming soon.</Text>
          ) : (
            list.map((s) => <ScientistRow key={s.id} scientistId={s.id} />)
          )}
        </ScrollView>
      </View>
    );
  }

  // ── Root: 3 category banners, or the By-State browser ──
  return (
    <View style={styles.container}>
      <ScreenHeader title="Explore Fields" />
      <ScrollView contentContainerStyle={styles.scroll}>
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

        {browseMode === 'By Field' &&
          BANNERS.map((b) => (
            <Pressable
              key={b.id}
              style={[styles.categoryRow, { borderColor: softColor(b.rgb, 0.4) }]}
              onPress={() =>
                setDrill(b.id === 'modern' ? { type: 'modernGrid' } : b.id === 'nobel' ? { type: 'nobel' } : { type: 'field', fieldId: 'ancient' })
              }
            >
              <View style={[styles.categoryIcon, { backgroundColor: softColor(b.rgb, 0.18) }]}>
                <Text style={[styles.categoryIconText, { color: b.color }]}>{b.mono}</Text>
              </View>
              <View style={styles.categoryText}>
                <Text style={styles.categoryName}>{b.name}</Text>
                <Text style={styles.categoryCount}>{bannerCount(b.id)} scientists</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}

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
    gap: spacing.sm,
  },
  modeToggle: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  modePill: {
    flex: 1,
    borderRadius: radii.pill,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
  },
  modePillActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  modePillText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
  },
  modePillTextActive: {
    color: colors.onGold,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radii.cardSmall + 4,
    padding: spacing.md,
    marginBottom: spacing.xs,
  },
  categoryIcon: {
    width: 46,
    height: 46,
    borderRadius: radii.cardTiny,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconText: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.cardTitleSm + 1,
  },
  categoryText: {
    flex: 1,
  },
  categoryName: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.cardTitle,
    color: colors.textPrimary,
  },
  categoryCount: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.micro,
    color: colors.textTertiary,
  },
  chevron: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: 18,
    color: colors.textTertiary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radii.cardSmall + 4,
    padding: spacing.md,
    gap: spacing.sm,
  },
  gridIcon: {
    width: 42,
    height: 42,
    borderRadius: radii.cardTiny,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridIconText: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.cardTitleSm,
  },
  gridName: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.cardTitleSm + 1,
    color: colors.textPrimary,
  },
  gridCount: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.micro,
    color: colors.textTertiary,
  },
  banner: {
    borderRadius: radii.cardSmall + 4,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: 4,
    alignItems: 'center',
  },
  bannerTitle: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.cardTitle + 3,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  bannerBody: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.body,
    color: '#C9C3E8',
    textAlign: 'center',
    lineHeight: 24,
  },
  bannerBodyStrong: {
    fontFamily: typography.fontFamily.bodyBold,
    color: '#fff',
  },
  scientistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radii.cardSmall,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  scientistRowText: {
    flex: 1,
    minWidth: 0,
  },
  scientistName: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.cardTitleSm,
    color: colors.textPrimary,
  },
  scientistYears: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.micro,
    color: colors.textSecondary,
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
    borderColor: colors.hairlineStrong,
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
});
