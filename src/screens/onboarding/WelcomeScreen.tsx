import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { OnboardingStepShell } from '@/components/ui/OnboardingStepShell';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import type { OnboardingStackParamList } from '@/navigation/types';
import { useOnboardingStore } from '@/store/onboardingStore';
import { type } from '@/theme/typography';
import { space, colors, radius } from '@/theme/tokens';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  const activities = useOnboardingStore((s) => s.activities);
  const [language, setLanguage] = useState<'en' | 'sw' | null>(null);

  const handleFinish = () => {
    navigation.navigate('Success');
  };

  return (
    <OnboardingStepShell
      progressStep={6}
      progressTotal={6}
      title="You're all set"
      subtitle="Tenki will use your activities and places to keep alerts useful — not noisy."
      footer={<PrimaryButton label="Open Tenki" disabled={!language} onPress={handleFinish} />}
    >
      <View style={styles.body}>
        <Text style={type.body}>
          {activities.length > 0
            ? `Tracking ${activities.length} outdoor ${activities.length === 1 ? 'activity' : 'activities'} for you.`
            : 'You can add activities anytime from settings later.'}
        </Text>

        <View style={styles.langSection}>
          <Text style={type.section}>Language / Lugha</Text>
          <View style={styles.langRow}>
            <Pressable
              style={[styles.langCard, language === 'en' && styles.langCardSelected]}
              onPress={() => setLanguage('en')}
            >
              <Text style={type.bodyStrong}>English</Text>
            </Pressable>
            <Pressable
              style={[styles.langCard, language === 'sw' && styles.langCardSelected]}
              onPress={() => setLanguage('sw')}
            >
              <Text style={type.bodyStrong}>Kiswahili</Text>
            </Pressable>
          </View>
        </View>
        <Text style={[type.caption, styles.hint]}>
          Pull to refresh on Home and Forecast once you land in the app.
        </Text>
      </View>
    </OnboardingStepShell>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: space.lg,
    paddingTop: space.md,
  },
  hint: {
    marginTop: space['2xl'],
    textAlign: 'center',
    color: colors.text.muted,
  },
  langSection: {
    marginTop: space.xl,
    gap: space.md,
  },
  langRow: {
    flexDirection: 'row',
    gap: space.md,
  },
  langCard: {
    flex: 1,
    height: 64,
    borderRadius: radius.lg,
    backgroundColor: colors.surface.inset,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langCardSelected: {
    borderWidth: 2,
    borderColor: colors.border.focus,
    backgroundColor: colors.surface.cardHover,
  },
});
