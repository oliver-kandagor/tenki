import { colors, space } from '@/theme/tokens';
import { type } from '@/theme/typography';
import { StyleSheet, Text, View } from 'react-native';

interface SunriseSunsetProps {
  sunrise?: string; // HH:MM format
  sunset?: string;  // HH:MM format
}

export function SunriseSunset({ sunrise = '--:--', sunset = '--:--' }: SunriseSunsetProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tile}>
        <Text style={styles.icon}>🌅</Text>
        <Text style={styles.label}>Sunrise</Text>
        <Text style={type.bodyStrong}>{sunrise}</Text>
      </View>
      <View style={styles.tile}>
        <Text style={styles.icon}>🌇</Text>
        <Text style={styles.label}>Sunset</Text>
        <Text style={type.bodyStrong}>{sunset}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: space.md,
  },
  tile: {
    flex: 1,
    backgroundColor: colors.surface.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: space.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 32,
    marginBottom: space.sm,
  },
  label: {
    ...type.caption,
    color: colors.text.secondary,
    marginBottom: space.xs,
  },
});
