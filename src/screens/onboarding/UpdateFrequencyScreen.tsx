import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { FrequencyPicker } from '@/components/ui/FrequencyPicker';
import { OnboardingStepShell } from '@/components/ui/OnboardingStepShell';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import type { OnboardingStackParamList } from '@/navigation/types';
import { useOnboardingStore } from '@/store/onboardingStore';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'UpdateFrequency'>;

export function UpdateFrequencyScreen({ navigation }: Props) {
  const updateFrequency = useOnboardingStore((s) => s.updateFrequency);
  const setUpdateFrequency = useOnboardingStore((s) => s.setUpdateFrequency);

  return (
    <OnboardingStepShell
      progressStep={3}
      progressTotal={6}
      title="When should we send your daily umbrella check?"
      subtitle="Set a time to get a daily summary and outdoor status."
      footer={
        <PrimaryButton label="Continue" onPress={() => navigation.navigate('Plan')} />
      }
    >
      <FrequencyPicker value={updateFrequency} onChange={setUpdateFrequency} />
    </OnboardingStepShell>
  );
}
