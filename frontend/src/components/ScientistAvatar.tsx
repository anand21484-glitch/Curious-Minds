import { StyleSheet, Text, View } from 'react-native';
import { Scientist } from '../data/scientists';
import { colors, fields, radii, softColor, typography } from '../theme';

function initialsFor(name: string): string {
  return name
    .split(' ')
    .filter((w) => /^[A-Za-z]/.test(w))
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

type Props = {
  scientist: Pick<Scientist, 'name' | 'field'>;
  size?: number;
  // 'solid': field-color fill + dark text (Home's featured story avatar).
  // 'soft': field-color-tinted fill (0.18 alpha) + field-color text (Explore/
  // Stories/Quiz list rows and the Profile hero) — the design's default badge.
  variant?: 'solid' | 'soft';
};

export default function ScientistAvatar({ scientist, size = 44, variant = 'soft' }: Props) {
  const field = fields.find((f) => f.id === scientist.field);
  const accentColor = field?.color ?? colors.gold;
  const backgroundColor = variant === 'solid' ? accentColor : softColor(field?.rgb ?? '231,185,60', 0.18);
  const textColor = variant === 'solid' ? colors.onSoft : accentColor;
  const fontSize = Math.max(11, Math.round(size * 0.32));

  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: radii.pill, backgroundColor },
      ]}
    >
      <Text style={[styles.initials, { fontSize, color: textColor }]}>{initialsFor(scientist.name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: typography.fontFamily.bodyBold,
  },
});
