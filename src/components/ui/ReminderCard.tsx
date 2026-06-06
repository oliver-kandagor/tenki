import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Card } from '@/components/ui/Card';
import { colors, space } from '@/theme/tokens';
import { type } from '@/theme/typography';

interface ReminderCardProps {
  title: string;
  description: string;
  leadTime?: string;
  iconName: React.ComponentProps<typeof Feather>['name'];
  enabled: boolean;
  onToggle: (value: boolean) => void;
  onPress?: () => void;
  onLeadTimePress?: () => void;
}

export function ReminderCard({
  title,
  description,
  leadTime,
  iconName,
  enabled,
  onToggle,
  onPress,
  onLeadTimePress,
}: ReminderCardProps) {
  return (
    <Card onPress={onPress} style={styles.container}>
      <View style={styles.row}>
        <View style={styles.iconCircle}>
          <Feather name={iconName} size={16} color={colors.primary.default} />
        </View>
        <View style={styles.textContainer}>
          <Text style={type.bodyStrong}>{title}</Text>
          <Text style={[type.body, { color: colors.text.secondary }]}>
            {description}
          </Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: colors.surface.inset, true: colors.primary.default }}
          thumbColor="#FFFFFF"
        />
      </View>
      {leadTime && (
        <Pressable onPress={onLeadTimePress} style={styles.leadTimeContainer}>
          <Text style={type.caption}>🔔 {leadTime}</Text>
        </Pressable>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: space.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    marginRight: space.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    paddingRight: space.md,
  },
  leadTimeContainer: {
    marginTop: space.md,
    paddingTop: space.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
});
