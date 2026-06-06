import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import LottieView from 'lottie-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useOnboardingStore } from '@/store/onboardingStore';
import { OnboardingStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Success'>;

export function SuccessScreen({ navigation }: Props) {
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  const handleAnimationFinish = async () => {
    // Navigate away by completing onboarding which will unmount this navigator entirely
    await completeOnboarding();
  };

  return (
    <View style={styles.container}>
      <BlurView style={StyleSheet.absoluteFill} tint="dark" intensity={80} />
      <View style={styles.content}>
        <LottieView
          source={require('../../../assets/images/c58a21a6-1150-11ee-955d-a3bc559ba335.json')}
          autoPlay
          loop={false}
          onAnimationFinish={handleAnimationFinish}
          style={styles.animation}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 200,
    height: 200,
  },
});
