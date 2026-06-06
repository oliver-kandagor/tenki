import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { type } from '@/theme/typography';
import { colors, radius, space } from '@/theme/tokens';

export type OutdoorStatus = 'ready' | 'caution' | 'stay_in';

interface StatusBannerProps {
  status: OutdoorStatus;
  title: string;
  description: string;
  style?: ViewStyle;
}

export function StatusBanner({ status, title, description, style }: StatusBannerProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'ready':
        return colors.success.default;
      case 'caution':
        return colors.warning.default;
      case 'stay_in':
        return colors.danger.default;
    }
  };

  const getBackgroundColor = () => {
    switch (status) {
      case 'ready':
        return 'rgba(52, 211, 153, 0.13)'; // ~22 hex
      case 'caution':
        return 'rgba(251, 191, 36, 0.13)';
      case 'stay_in':
        return 'rgba(248, 113, 113, 0.13)';
    }
  };

  const statusColor = getStatusColor();

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }, style]}>
      <View style={styles.headerRow}>
        <View style={[styles.dot, { backgroundColor: statusColor }]} />
        <Text style={[type.hero, { color: statusColor }]}>{title}</Text>
      </View>
      <Text style={[type.body, styles.description]} numberOfLines={3}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    padding: space.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space.sm,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: space.md,
  },
  description: {
    color: colors.text.secondary,
  },
});
