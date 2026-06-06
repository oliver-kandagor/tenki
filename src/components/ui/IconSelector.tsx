import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from '@/components/ui/SymbolView';

import { LOCATION_ICON_PRESETS, type LocationIconId } from '@/constants/onboarding';
import { type } from '@/theme/typography';
import { colors, radius, space } from '@/theme/tokens';

export const ICON_SYMBOLS: Record<LocationIconId, string> = {
  home: 'house.fill',
  work: 'briefcase.fill',
  pin: 'mappin.and.ellipse',
  beach: 'sun.max.fill',
  tree: 'tree.fill',
  farm: 'leaf.fill',
  golf: 'figure.golf',
  run: 'figure.run',
};

interface IconSelectorProps {
  value: LocationIconId;
  onChange: (icon: LocationIconId) => void;
}

export function IconSelector({ value, onChange }: IconSelectorProps) {
  return (
    <View style={styles.wrap}>
      <Text style={[type.caption, styles.label]}>Icon</Text>
      <View style={styles.grid}>
        {LOCATION_ICON_PRESETS.map((id) => {
          const selected = value === id;
          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onChange(id)}
              style={[styles.item, selected && styles.itemSelected]}
            >
              <SymbolView
                name={ICON_SYMBOLS[id] ?? 'mappin'}
                size={24}
                tintColor={selected ? colors.primary.default : colors.text.muted}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: space.md,
  },
  label: {
    marginBottom: space.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  item: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surface.inset,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemSelected: {
    borderWidth: 2,
    borderColor: colors.border.focus,
    backgroundColor: colors.surface.cardHover,
  },
});
