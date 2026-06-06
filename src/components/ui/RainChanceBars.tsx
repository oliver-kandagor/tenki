import { colors, space } from '@/theme/tokens';
import { type } from '@/theme/typography';
import { StyleSheet, Text, View } from 'react-native';

interface RainChanceBar {
  time: string;  // "6 PM", "Monday", etc
  chance: number; // 0-100
}

interface RainChanceBarsProps {
  title?: string;
  bars: RainChanceBar[];
}

export function RainChanceBars({
  title = 'Chance of Rain',
  bars = [],
}: RainChanceBarsProps) {
  if (bars.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={type.section}>{title}</Text>
      <View style={styles.barsList}>
        {bars.map((bar, idx) => (
          <View key={idx} style={styles.barRow}>
            <Text style={styles.time}>{bar.time}</Text>
            <View style={styles.barBackground}>
              <View
                style={[
                  styles.barFill,
                  { width: `${bar.chance}%` },
                ]}
              />
            </View>
            <Text style={styles.percentage}>{bar.chance}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: space.lg,
  },
  barsList: {
    marginTop: space.md,
    gap: space.md,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  time: {
    ...type.body,
    width: 50,
    color: colors.text.secondary,
  },
  barBackground: {
    flex: 1,
    height: 24,
    backgroundColor: colors.surface.inset,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primary.default,
    borderRadius: 4,
  },
  percentage: {
    ...type.caption,
    width: 40,
    textAlign: 'right',
    color: colors.text.secondary,
  },
});
