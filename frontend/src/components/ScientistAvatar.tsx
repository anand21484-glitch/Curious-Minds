import { StyleSheet, Text, View } from 'react-native';
import { Scientist } from '../data/scientists';
import { colors, fields, radii, typography } from '../theme';

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
};

// Placeholder portrait: a field-colored circle with initials, standing in
// for real scientist illustrations until portrait art is available.
export default function ScientistAvatar({ scientist, size = 44 }: Props) {
  const field = fields.find((f) => f.id === scientist.field);
  const backgroundColor = field?.color ?? colors.gold;
  const fontSize = Math.max(11, Math.round(size * 0.36));

  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: radii.pill, backgroundColor },
      ]}
    >
      <Text style={[styles.initials, { fontSize }]}>{initialsFor(scientist.name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: typography.fontFamily.headingBold,
    color: colors.onGold,
  },
});
