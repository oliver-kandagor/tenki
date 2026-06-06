import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { NotificationPrefs } from '@/components/ui/NotificationPrefs';
import { OnboardingStepShell } from '@/components/ui/OnboardingStepShell';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { TextButton } from '@/components/ui/TextButton';
import type { OnboardingStackParamList } from '@/navigation/types';
import { useOnboardingStore } from '@/store/onboardingStore';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Notifications'>;

export function NotificationsScreen({ navigation }: Props) {
  const channels = useOnboardingStore((s) => s.notificationChannels);
  const setNotificationChannel = useOnboardingStore((s) => s.setNotificationChannel);

  return (
    <OnboardingStepShell
      progressStep={2}
      progressTotal={6}
      title="Which weather events should we remind you about?"
      subtitle="Get a heads-up before bad weather hits. (Delivery is stubbed in this build — your choices are saved)."
      footer={
        <>
          <PrimaryButton
            label="Continue"
            onPress={() => navigation.navigate('UpdateFrequency')}
          />
          <TextButton label="Skip" onPress={() => navigation.navigate('UpdateFrequency')} />
        </>
      }
    >
      <NotificationPrefs values={channels} onChange={setNotificationChannel} />
    </OnboardingStepShell>
  );
}
