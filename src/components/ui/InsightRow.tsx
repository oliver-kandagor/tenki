import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { type } from '@/theme/typography';
import { colors, space } from '@/theme/tokens';

interface InsightRowProps {
  title: string;
  value: string;
  onPress?: () => void;
}

export function InsightRow({ title, value, onPress }: InsightRowProps) {
  return (
    <Card onPress={onPress} style={styles.container}>
      <View style={styles.iconCircle} />
      <View style={styles.textContainer}>
        <Text style={type.bodyStrong}>{title}</Text>
        <Text style={[type.body, { color: colors.text.secondary }]}>{value}</Text>
      </View>
      {onPress && (
        <View style={styles.chevronPlaceholder} />
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: space.md,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    marginRight: space.md,
  },
  textContainer: {
    flex: 1,
  },
  chevronPlaceholder: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.border.subtle,
  },
});
