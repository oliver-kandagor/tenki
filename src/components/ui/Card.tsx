import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radius, space } from '@/theme/tokens';

interface CardProps {
  children: React.ReactNode;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function Card({ children, selected, onPress, style }: CardProps) {
  const content = (
    <View style={[styles.card, selected && styles.selected, style]}>{children}</View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: space.lg,
  },
  selected: {
    borderWidth: 2,
    borderColor: colors.border.focus,
    backgroundColor: colors.surface.cardHover,
  },
  pressed: {
    opacity: 0.9,
  },
});
