import { StyleSheet, Switch, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import type { NotificationChannels } from '@/store/onboardingStore';
import { type } from '@/theme/typography';
import { colors, space } from '@/theme/tokens';

const CHANNELS: { key: keyof NotificationChannels; title: string; description: string }[] = [
  { key: 'email', title: 'Email', description: 'Daily or weekly summaries in your inbox' },
  { key: 'sms', title: 'SMS / Message', description: 'Short texts when rain or floods are likely' },
  { key: 'whatsapp', title: 'WhatsApp', description: 'Friendly alerts on WhatsApp (UI stub)' },
];

interface NotificationPrefsProps {
  values: NotificationChannels;
  onChange: (key: keyof NotificationChannels, value: boolean) => void;
}

export function NotificationPrefs({ values, onChange }: NotificationPrefsProps) {
  return (
    <View style={styles.list}>
      {CHANNELS.map((ch) => (
        <Card key={ch.key} style={styles.row}>
          <View style={styles.rowInner}>
            <View style={styles.textCol}>
              <Text style={type.bodyStrong}>{ch.title}</Text>
              <Text style={type.caption}>{ch.description}</Text>
            </View>
            <Switch
              value={values[ch.key]}
              onValueChange={(v) => onChange(ch.key, v)}
              trackColor={{ false: colors.surface.inset, true: colors.primary.default }}
              thumbColor={colors.text.primary}
            />
          </View>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: space.md,
  },
  row: {
    paddingVertical: space.md,
  },
  rowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  textCol: {
    flex: 1,
    gap: space.xs,
  },
});
