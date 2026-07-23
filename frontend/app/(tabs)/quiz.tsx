import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { AGE_BANDS, AgeBand, quizzes } from '../../src/data/quizzes';
import { colors, radii, spacing, typography } from '../../src/theme';

const STATUS_COLOR: Record<string, string> = {
  'Not started': colors.textSecondary,
  'In progress': colors.gold,
  Completed: colors.success,
};

export default function QuizScreen() {
  const [ageBand, setAgeBand] = useState<AgeBand>(AGE_BANDS[1]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Zone</Text>

      <View style={styles.ageBandRow}>
        {AGE_BANDS.map((band) => {
          const active = band === ageBand;
          return (
            <Pressable
              key={band}
              onPress={() => setAgeBand(band)}
              style={[styles.ageBandPill, active && styles.ageBandPillActive]}
            >
              <Text style={[styles.ageBandText, active && styles.ageBandTextActive]}>{band}</Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={quizzes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable style={[styles.card, { borderColor: item.color }]}>
            <View style={[styles.badge, { backgroundColor: item.color }]} />
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardBadge}>{item.badgeName}</Text>
            <View style={styles.cardFooter}>
              <Text style={styles.cardTime}>~{item.estimatedTime}</Text>
              <Text style={[styles.cardStatus, { color: STATUS_COLOR[item.status] }]}>
                {item.status}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.hero,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  ageBandRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  ageBandPill: {
    flex: 1,
    borderRadius: radii.pill,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  ageBandPillActive: {
    backgroundColor: colors.purple,
    borderColor: colors.purple,
  },
  ageBandText: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.bodySmall,
    color: colors.textSecondary,
  },
  ageBandTextActive: {
    color: colors.textPrimary,
  },
  list: {
    paddingBottom: spacing.lg,
  },
  row: {
    gap: spacing.sm,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: radii.pill,
    marginBottom: spacing.xs,
  },
  cardName: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.body,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  cardBadge: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.microLabel,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTime: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.microLabel,
    color: colors.textSecondary,
  },
  cardStatus: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.microLabel,
  },
});
