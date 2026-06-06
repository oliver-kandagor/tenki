import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { Card } from '@/components/ui/Card';
import { type } from '@/theme/typography';
import { colors, space } from '@/theme/tokens';

export type MetricType = 'temp' | 'humidity' | 'wind' | 'pressure' | 'rain' | 'trees';

interface MetricTileProps {
  metric: MetricType;
  label: string;
  value: string;
  secondaryValue?: string;
  style?: ViewStyle;
}

export function MetricTile({ metric, label, value, secondaryValue, style }: MetricTileProps) {
  const metricColor = colors.metric[metric];

  return (
    <Card style={[styles.container, style] as any}>
      <View style={[styles.iconCircle, { backgroundColor: `${metricColor}1F` }]}>
        {/* We'll add custom icons later, for now just a colored circle placeholder */}
      </View>
      <View style={styles.textContainer}>
        <Text style={type.caption}>{label}</Text>
        <Text style={type.metric} numberOfLines={1} adjustsFontSizeToFit>
          {value}
        </Text>
        {secondaryValue && (
          <Text style={[type.body, styles.secondaryText]}>{secondaryValue}</Text>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 120,
    aspectRatio: 1,
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: space.sm,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  secondaryText: {
    color: colors.text.muted,
  },
});
