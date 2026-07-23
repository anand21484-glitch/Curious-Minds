import { StyleSheet, View } from 'react-native';

type Props = {
  size?: number;
  style?: object;
};

// Subtle decorative atom mark: three tilted orbit rings around a nucleus,
// built from plain Views so no SVG dependency is needed.
export default function AtomWatermark({ size = 220, style }: Props) {
  const ring = (rotate: string) => ({
    position: 'absolute' as const,
    width: size,
    height: size * 0.4,
    top: size * 0.3,
    left: 0,
    borderRadius: size,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.14)',
    transform: [{ rotate }],
  });

  return (
    <View style={[{ width: size, height: size }, styles.container, style]} pointerEvents="none">
      <View style={ring('0deg')} />
      <View style={ring('60deg')} />
      <View style={ring('120deg')} />
      <View
        style={[
          styles.nucleus,
          {
            width: size * 0.12,
            height: size * 0.12,
            borderRadius: size,
            top: size / 2 - (size * 0.12) / 2,
            left: size / 2 - (size * 0.12) / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nucleus: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
});
