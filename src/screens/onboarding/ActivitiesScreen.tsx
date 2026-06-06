import { FlatList, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { ActivityCard } from '@/components/ui/ActivityCard';
import { OnboardingStepShell } from '@/components/ui/OnboardingStepShell';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { TextButton } from '@/components/ui/TextButton';
import { OUTDOOR_ACTIVITIES, type OutdoorActivity } from '@/constants/onboarding';
import type { OnboardingStackParamList } from '@/navigation/types';
import { useOnboardingStore } from '@/store/onboardingStore';
import { space } from '@/theme/tokens';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Activities'>;

export function ActivitiesScreen({ navigation }: Props) {
  const activities = useOnboardingStore((s) => s.activities);
  const toggleActivity = useOnboardingStore((s) => s.toggleActivity);

  const renderItem = ({ item }: { item: OutdoorActivity }) => (
    <View style={styles.cell}>
      <ActivityCard
        label={item}
        selected={activities.includes(item)}
        onPress={() => toggleActivity(item)}
      />
    </View>
  );

  return (
    <OnboardingStepShell
      scrollable={false}
      progressStep={1}
      progressTotal={6}
      title="What outdoor activities do you need weather alerts for?"
      subtitle="Pick everything that fits. We'll tailor rain, wind, and flood warnings to your routine."
      footer={
        <>
          <PrimaryButton label="Continue" onPress={() => navigation.navigate('Notifications')} />
          <TextButton label="Skip" onPress={() => navigation.navigate('Notifications')} />
        </>
      }
    >
      <FlatList
        data={[...OUTDOOR_ACTIVITIES]}
        keyExtractor={(item) => item}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={renderItem}
      />
    </OnboardingStepShell>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: space.md,
  },
  row: {
    gap: space.md,
  },
  cell: {
    flex: 1,
  },
});
