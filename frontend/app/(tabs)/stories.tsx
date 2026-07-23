import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { scientists } from '../../src/data/scientists';
import { colors, fields, radii, spacing, typography } from '../../src/theme';

export default function StoriesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Featured Stories</Text>
      <FlatList
        data={scientists}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const field = fields.find((f) => f.id === item.field);
          return (
            <Pressable
              style={[styles.card, { borderColor: field?.color ?? colors.hairline }]}
              onPress={() => router.push(`/scientist/${item.id}`)}
            >
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardMeta}>{item.years}</Text>
              <Text style={styles.cardTagline}>{item.tagline}</Text>
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
    padding: spacing.lg,
  },
  title: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.hero,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  list: {
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.card,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  cardTitle: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.body,
    color: colors.textPrimary,
  },
  cardMeta: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: typography.size.microLabel,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.xs,
  },
  cardTagline: {
    fontFamily: typography.fontFamily.bodyRegular,
    fontSize: typography.size.bodySmall,
    color: colors.textOnDark,
  },
});
