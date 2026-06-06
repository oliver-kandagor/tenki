import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { UpdateFrequency } from '@/store/onboardingStore';
import { type } from '@/theme/typography';
import { colors, radius, space } from '@/theme/tokens';

const OPTIONS: { id: UpdateFrequency; label: string; hint: string }[] = [
  { id: 'daily', label: 'Daily', hint: 'Quick check each morning' },
  { id: 'weekly', label: 'Weekly', hint: 'One roundup for the week ahead' },
  { id: 'monthly', label: 'Monthly', hint: 'Light touch — big picture only' },
];

interface FrequencyPickerProps {
  value: UpdateFrequency;
  onChange: (value: UpdateFrequency) => void;
}

export function FrequencyPicker({ value, onChange }: FrequencyPickerProps) {
  return (
    <View style={styles.list}>
      {OPTIONS.map((opt) => {
        const selected = value === opt.id;
        return (
          <Pressable
            key={opt.id}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => onChange(opt.id)}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <Text style={[type.bodyStrong, selected && styles.chipLabelSelected]}>{opt.label}</Text>
            <Text style={type.caption}>{opt.hint}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: space.md,
  },
  chip: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: space.lg,
    gap: space.xs,
  },
  chipSelected: {
    borderWidth: 2,
    borderColor: colors.border.focus,
    backgroundColor: colors.surface.cardHover,
  },
  chipLabelSelected: {
    color: colors.text.primary,
  },
});
