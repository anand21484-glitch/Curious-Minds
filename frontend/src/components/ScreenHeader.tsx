import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme';

type Props = {
  title: string;
  titleSize?: number;
  onBack?: () => void;
  right?: React.ReactNode;
};

// Matches the design's 60px header bar: back-circle + centered title + optional
// right-side control, hairline border-bottom, used on every screen.
export default function ScreenHeader({ title, titleSize = typography.size.headerMd, onBack, right }: Props) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable onPress={onBack} style={styles.backCircle}>
          <Text style={styles.backGlyph}>‹</Text>
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}
      <Text style={[styles.title, { fontSize: titleSize }]} numberOfLines={1}>
        {title}
      </Text>
      {right ?? <View style={styles.spacer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.hairline,
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backCircle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backGlyph: {
    fontFamily: typography.fontFamily.bodySemiBold,
    fontSize: 20,
    color: colors.textPrimary,
  },
  spacer: {
    width: 34,
  },
  title: {
    fontFamily: typography.fontFamily.headingBold,
    color: colors.textPrimary,
    textAlign: 'center',
    flexShrink: 1,
  },
});
