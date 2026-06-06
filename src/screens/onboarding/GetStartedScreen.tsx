import { StyleSheet, Text, View, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { OnboardingBackground } from '@/components/ui/OnboardingBackground';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import type { OnboardingStackParamList } from '@/navigation/types';
import { type } from '@/theme/typography';
import { space } from '@/theme/tokens';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'GetStarted'>;

export function GetStartedScreen({ navigation }: Props) {
  return (
    <OnboardingBackground>
      <View style={styles.flex}>
        <View style={styles.hero}>
          <Text style={type.hero}>Tenki</Text>
          <Text style={[type.body, styles.tagline]}>
            Your outdoor companion — plain alerts, better timing, places you care about.
          </Text>
        </View>
        <View style={styles.logos}>
          <Image source={require('../../../assets/images/react-logo.png')} style={styles.logo} resizeMode="contain" />
          <Image source={require('../../../assets/images/expo-logo.png')} style={styles.logo} resizeMode="contain" />
        </View>
        <PrimaryButton label="Get started" onPress={() => navigation.navigate('IntroSlides')} />
      </View>
    </OnboardingBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: space['3xl'],
    gap: space['2xl'],
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
  },
  tagline: {
    marginTop: space.lg,
    opacity: 0.92,
  },
  logos: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: space.lg,
    marginBottom: space.md,
  },
  logo: {
    width: 40,
    height: 40,
    opacity: 0.8,
  },
});
