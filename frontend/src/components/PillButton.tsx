import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radii, spacing, typography } from '../theme';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'gold' | 'outline';
  style?: ViewStyle;
};

export default function PillButton({ label, onPress, variant = 'gold', style }: Props) {
  const isGold = variant === 'gold';
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        isGold ? styles.gold : styles.outline,
        style,
      ]}
    >
      <Text style={[styles.label, isGold ? styles.labelOnGold : styles.labelOutline]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gold: {
    backgroundColor: colors.gold,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  label: {
    fontFamily: typography.fontFamily.headingBold,
    fontSize: typography.size.body,
  },
  labelOnGold: {
    color: colors.onGold,
  },
  labelOutline: {
    color: colors.textPrimary,
  },
});
