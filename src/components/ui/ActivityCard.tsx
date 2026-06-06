import { StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import { Card } from '@/components/ui/Card';
import { type } from '@/theme/typography';
import { space } from '@/theme/tokens';
import { ACTIVITY_METADATA, type OutdoorActivity } from '@/constants/onboarding';

interface ActivityCardProps {
  label: OutdoorActivity;
  selected: boolean;
  onPress: () => void;
}

export function ActivityCard({ label, selected, onPress }: ActivityCardProps) {
  const metadata = ACTIVITY_METADATA[label] || { icon: 'star.fill', color: '#FFFFFF' };

  return (
    <Card selected={selected} onPress={onPress} style={styles.card}>
      <View style={[styles.iconContainer, selected && styles.iconContainerSelected]}>
        <SymbolView
          name={metadata.icon as any}
          size={24}
          tintColor={selected ? '#1c1c1e' : metadata.color}
          type="monochrome"
        />
      </View>
      <Text style={[type.bodyStrong, styles.label]} numberOfLines={1}>
        {label}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    paddingVertical: 0,
    paddingHorizontal: space.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#3A3A3C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: space.md,
  },
  iconContainerSelected: {
    backgroundColor: '#FFFFFF',
  },
  label: {
    flex: 1,
    color: '#FFFFFF',
  },
});
