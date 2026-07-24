import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ScientistAvatar from '../../src/components/ScientistAvatar';
import ScreenHeader from '../../src/components/ScreenHeader';
import { getScientist } from '../../src/data/scientists';
import { colors, fields, radii, softColor, spacing, typography } from '../../src/theme';

function paginateStory(text: string, targetPanels = 4): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  const perPanel = Math.max(1, Math.ceil(sentences.length / targetPanels));
  const panels: string[] = [];
  for (let i = 0; i < sentences.length; i += perPanel) {
    panels.push(sentences.slice(i, i + perPanel).join(' ').trim());
  }
  return panels.length > 0 ? panels : [text];
}

function timelineFor(name: string, years: string) {
  const parts = years.split(/[–-]/).map((p) => p.trim());
  const born = parts[0];
  const rest = parts[1];
  const entries = [{ year: born, text: `${name} is born.` }];
  if (rest) {
    entries.push({ year: rest, text: `${name} passes away.` });
  } else {
    entries.push({ year: 'Today', text: `${name} is still active today.` });
  }
  return entries;
}

export default function ScientistProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scientist = getScientist(id);
  const [panelIndex, setPanelIndex] = useState(0);
  const [saved, setSaved] = useState(false);

  if (!scientist) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Not Found" onBack={() => router.back()} />
        <Text style={styles.bodyText}>Scientist not found.</Text>
      </View>
    );
  }

  const field = fields.find((f) => f.id === scientist.field);
  const accentColor = field?.color ?? colors.gold;
  const softBg = softColor(field?.rgb ?? '231,185,60', 0.22);
  const panels = paginateStory(scientist.story);
  const timeline = timelineFor(scientist.name, scientist.years);

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={scientist.name}
        titleSize={typography.size.headerXs}
        onBack={() => router.back()}
        right={
          <Pressable onPress={() => setSaved((v) => !v)} style={styles.saveButton}>
            <Text style={[styles.saveGlyph, { color: saved ? colors.gold : colors.textPrimary }]}>
              {saved ? '★' : '☆'}
            </Text>
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroRow}>
          <ScientistAvatar scientist={scientist} size={56} />
          <View style={styles.heroText}>
            <Text style={styles.name}>{scientist.name}</Text>
            <Text style={styles.meta}>
              {scientist.years} · {scientist.region} · {field?.name}
            </Text>
          </View>
        </View>

        <View>
          <Text style={styles.eyebrow}>
            Story mode · panel {panelIndex + 1} of {panels.length}
          </Text>
          <View style={[styles.panel, { backgroundColor: softBg, borderColor: softColor(field?.rgb ?? '231,185,60', 0.35) }]}>
            <Text style={styles.panelIndexTag}>#{panelIndex + 1}</Text>
            <Text style={styles.panelText}>{panels[panelIndex]}</Text>
            <View style={styles.panelFooter}>
              <View style={styles.panelDots}>
                {panels.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.panelDot,
                      { backgroundColor: i === panelIndex ? accentColor : 'rgba(255,255,255,0.2)' },
                    ]}
                  />
                ))}
              </View>
              <View style={{ flexDirection: 'row', gap: spacing.xs }}>
                <Pressable
                  onPress={() => setPanelIndex((i) => Math.max(0, i - 1))}
                  style={[styles.panelNavButton, { opacity: panelIndex === 0 ? 0.3 : 1 }]}
                >
                  <Text style={styles.panelNavGlyph}>‹</Text>
                </Pressable>
                <Pressable
                  onPress={() => setPanelIndex((i) => Math.min(panels.length - 1, i + 1))}
                  style={[
                    styles.panelNavButton,
                    { backgroundColor: accentColor, opacity: panelIndex === panels.length - 1 ? 0.3 : 1 },
                  ]}
                >
                  <Text style={[styles.panelNavGlyph, { color: colors.onGold }]}>›</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.eyebrow}>Fun facts</Text>
          <View style={styles.factRow}>
            <View style={[styles.factDot, { backgroundColor: accentColor }]} />
            <Text style={styles.factText}>{scientist.fun_fact}</Text>
          </View>
        </View>

        <View>
          <Text style={styles.eyebrow}>Awards &amp; honors</Text>
          <View style={[styles.awardRow, { backgroundColor: softBg, borderColor: accentColor }]}>
            <View style={[styles.awardBadge, { backgroundColor: accentColor }]}>
              <Text style={styles.awardBadgeText}>★</Text>
            </View>
            <Text style={styles.awardText}>{scientist.achievement}</Text>
          </View>
        </View>

        <View>
          <Text style={styles.eyebrow}>Timeline</Text>
          {timeline.map((t, i) => (
            <View key={i} style={styles.timelineRow}>
              <View style={styles.timelineMarkerCol}>
                <View style={[styles.timelineDot, { backgroundColor: accentColor }]} />
                {i < timeline.length - 1 && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.timelineTextCol}>
                <Text style={[styles.timelineYear, { color: accentColor }]}>{t.year}</Text>
                <Text style={styles.timelineText}>{t.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.quoteCard}>
          <Text style={styles.quote}>"{scientist.quote}"</Text>
          <Text style={styles.quoteAttribution}>— {scientist.name}</Text>
        </View>

        <Pressable
          onPress={() => router.push(`/(tabs)/quiz?scientistId=${scientist.id}`)}
          style={[styles.quizCta, { backgroundColor: accentColor }]}
        >
          <Text style={styles.quizCtaText}>Take the {scientist.name} Quiz</Text>
        </Pressable>
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
    paddingBottom: spacing.xl,
    gap: spacing.xl,
  },
  saveButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backCircle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveGlyph: {
    fontSize: 18,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  heroText: {
    flex: 1,
  },
  name: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.headerLg + 2,
    color: colors.textPrimary,
  },
  meta: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.microLabel,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: typography.microLabelLetterSpacing,
    marginTop: 2,
  },
  eyebrow: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: typography.microLabelLetterSpacing,
    marginBottom: spacing.sm,
  },
  panel: {
    borderRadius: radii.cardHero,
    padding: spacing.lg,
    minHeight: 180,
    justifyContent: 'space-between',
    gap: spacing.md,
    borderWidth: 1,
  },
  panelIndexTag: {
    position: 'absolute',
    top: 14,
    right: 16,
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.microLabel,
    color: 'rgba(255,255,255,0.35)',
  },
  panelText: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.body + 2,
    color: colors.textPrimary,
    lineHeight: 25,
  },
  panelFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  panelDots: {
    flexDirection: 'row',
    gap: 6,
  },
  panelDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  panelNavButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelNavGlyph: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  factRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radii.cardTiny,
    padding: spacing.sm,
  },
  factDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 7,
  },
  factText: {
    flex: 1,
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.bodySmall,
    color: colors.textOnDark,
    lineHeight: 20,
  },
  awardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radii.cardTiny,
    padding: spacing.sm,
  },
  awardBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  awardBadgeText: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.microLabel,
    color: colors.onSoft,
  },
  awardText: {
    flex: 1,
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.bodySmall,
    color: colors.textPrimary,
    lineHeight: 19,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  timelineMarkerCol: {
    alignItems: 'center',
    flexShrink: 0,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  timelineLine: {
    width: 1,
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  timelineTextCol: {
    paddingBottom: 18,
  },
  timelineYear: {
    fontFamily: typography.fontFamily.bodyBold,
    fontSize: typography.size.micro,
  },
  timelineText: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.bodySmall,
    color: colors.textOnDark,
  },
  quoteCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
    borderRadius: radii.card,
    padding: spacing.md,
  },
  quote: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.cardTitle,
    color: colors.gold,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  quoteAttribution: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  bodyText: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.body,
    color: colors.textOnDark,
    lineHeight: 21,
    padding: spacing.lg,
  },
  quizCta: {
    alignItems: 'center',
    borderRadius: radii.pill,
    paddingVertical: spacing.md,
  },
  quizCtaText: {
    fontFamily: typography.fontFamily.headingRegular,
    fontSize: typography.size.body,
    color: colors.onGold,
  },
});
