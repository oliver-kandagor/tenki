import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Switch } from 'react-native';

import { IconSelector } from '@/components/ui/IconSelector';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import type { LocationIconId } from '@/constants/onboarding';
import { type } from '@/theme/typography';
import { colors, radius, space } from '@/theme/tokens';

interface SaveLocationCardProps {
  addressName?: string;
  initialName?: string;
  initialIcon?: LocationIconId;
  initialIsDefault?: boolean;
  onSave: (name: string, icon: LocationIconId, isDefault: boolean) => void;
  onCancel: () => void;
}

export function SaveLocationCard({ 
  addressName, 
  initialName = '',
  initialIcon = 'pin',
  initialIsDefault = false,
  onSave, 
  onCancel 
}: SaveLocationCardProps) {
  const [name, setName] = useState(initialName);
  const [icon, setIcon] = useState<LocationIconId>(initialIcon);
  const [isDefault, setIsDefault] = useState(initialIsDefault);

  return (
    <View style={styles.card}>
      <Text style={type.section}>Save Location</Text>
      
      <IconSelector value={icon} onChange={setIcon} />

      <Text style={[type.caption, styles.label]}>Location</Text>
      <TextInput
        style={[styles.input, styles.inputDisabled]}
        value={addressName || 'Loading address...'}
        editable={false}
      />

      <Text style={[type.caption, styles.label]}>Nickname</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Central Park"
        placeholderTextColor={colors.text.muted}
        value={name}
        onChangeText={setName}
      />

      <View style={styles.row}>
        <Text style={type.body}>Set as default location</Text>
        <Switch 
          value={isDefault} 
          onValueChange={setIsDefault}
          trackColor={{ false: colors.surface.inset, true: colors.primary.default }}
        />
      </View>

      <View style={styles.buttonRow}>
        <PrimaryButton label="Save" onPress={() => onSave(name, icon, isDefault)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.card,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
    padding: space.lg,
    paddingBottom: space.xl,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  label: {
    marginTop: space.lg,
    marginBottom: space.sm,
  },
  input: {
    backgroundColor: colors.surface.inset,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    color: colors.text.primary,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    fontSize: 16,
  },
  inputDisabled: {
    opacity: 0.7,
    backgroundColor: colors.surface.cardHover,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: space.lg,
    marginBottom: space.xl,
  },
  buttonRow: {
    marginTop: space.md,
  },
});
