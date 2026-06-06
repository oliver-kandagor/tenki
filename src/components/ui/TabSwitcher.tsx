import { colors, space } from '@/theme/tokens';
import { type } from '@/theme/typography';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

export type TabOption = 'hourly' | 'days10' | 'monthly';

interface TabSwitcherProps {
  active: TabOption;
  onChange: (tab: TabOption) => void;
  style?: ViewStyle;
}

const tabs: { id: TabOption; label: string }[] = [
  { id: 'hourly', label: 'Hourly' },
  { id: 'days10', label: '10 Days' },
  { id: 'monthly', label: 'Monthly' },
];

export function TabSwitcher({ active, onChange, style }: TabSwitcherProps) {
  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.id}
          onPress={() => onChange(tab.id)}
          style={({ pressed }) => [
            styles.tab,
            active === tab.id && styles.tabActive,
            pressed && styles.tabPressed,
          ]}
        >
          <Text
            style={[
              type.bodyStrong,
              active === tab.id ? styles.textActive : styles.textInactive,
            ]}
          >
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: space.md,
    backgroundColor: colors.surface.inset,
    borderRadius: 999,
    padding: space.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary.default,
  },
  tabPressed: {
    opacity: 0.8,
  },
  textActive: {
    color: '#FFFFFF',
  },
  textInactive: {
    color: colors.text.secondary,
  },
});
