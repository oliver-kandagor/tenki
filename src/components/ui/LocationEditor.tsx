import { StyleSheet, Text, TextInput, View } from 'react-native';

import { IconSelector } from '@/components/ui/IconSelector';
import type { SavedLocation } from '@/store/onboardingStore';
import { type } from '@/theme/typography';
import { colors, radius, space } from '@/theme/tokens';

interface LocationEditorProps {
  location: SavedLocation;
  onChange: (patch: Partial<SavedLocation>) => void;
}

export function LocationEditor({ location, onChange }: LocationEditorProps) {
  return (
    <View style={styles.wrap}>
      <Text style={type.caption}>Name</Text>
      <TextInput
        value={location.name}
        onChangeText={(name) => onChange({ name })}
        placeholder="e.g. Home"
        placeholderTextColor={colors.text.muted}
        style={styles.input}
      />
      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={type.caption}>Latitude (optional)</Text>
          <TextInput
            value={location.lat != null ? String(location.lat) : ''}
            onChangeText={(t) => onChange({ lat: t ? Number(t) : undefined })}
            keyboardType="numeric"
            placeholder="—"
            placeholderTextColor={colors.text.muted}
            style={styles.input}
          />
        </View>
        <View style={styles.half}>
          <Text style={type.caption}>Longitude (optional)</Text>
          <TextInput
            value={location.lon != null ? String(location.lon) : ''}
            onChangeText={(t) => onChange({ lon: t ? Number(t) : undefined })}
            keyboardType="numeric"
            placeholder="—"
            placeholderTextColor={colors.text.muted}
            style={styles.input}
          />
        </View>
      </View>
      <IconSelector
        value={location.icon}
        onChange={(icon) => onChange({ icon })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: space.sm,
    marginBottom: space.lg,
  },
  input: {
    backgroundColor: colors.surface.inset,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    color: colors.text.primary,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    marginTop: space.xs,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: space.md,
    marginTop: space.sm,
  },
  half: {
    flex: 1,
  },
});
