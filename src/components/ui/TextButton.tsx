import { Pressable, StyleSheet, Text } from 'react-native';

import { type } from '@/theme/typography';
import { colors, space } from '@/theme/tokens';

interface TextButtonProps {
  label: string;
  onPress: () => void;
}

export function TextButton({ label, onPress }: TextButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={styles.wrap}
      hitSlop={8}
    >
      <Text style={[type.body, styles.label]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space.sm,
  },
  label: {
    color: colors.text.secondary,
  },
});
