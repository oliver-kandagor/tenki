import { ImageBackground, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ONBOARDING_BG } from '@/constants/onboarding';
import { colors, space } from '@/theme/tokens';

interface OnboardingBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  withSafeArea?: boolean;
}

export function OnboardingBackground({
  children,
  style,
  withSafeArea = true,
}: OnboardingBackgroundProps) {
  const content = (
    <ImageBackground source={ONBOARDING_BG} style={styles.bg} resizeMode="cover">
      <View style={styles.scrim} />
      <View style={[styles.content, style]}>{children}</View>
    </ImageBackground>
  );

  if (withSafeArea) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {content}
      </SafeAreaView>
    );
  }

  return <View style={styles.safe}>{content}</View>;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background.root,
  },
  bg: {
    flex: 1,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.scrim,
  },
  content: {
    flex: 1,
    paddingHorizontal: space.lg,
  },
});
