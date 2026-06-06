import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { SymbolView } from 'expo-symbols';

import { OnboardingBackground } from '@/components/ui/OnboardingBackground';
import { SegmentedProgress } from '@/components/ui/SegmentedProgress';
import { type } from '@/theme/typography';
import { space } from '@/theme/tokens';

interface OnboardingStepShellProps {
  progressStep: number;
  progressTotal?: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  scrollable?: boolean;
}

export function OnboardingStepShell({
  progressStep,
  progressTotal = 5,
  title,
  subtitle,
  children,
  footer,
  scrollable = true,
}: OnboardingStepShellProps) {
  const navigation = useNavigation();

  const body = scrollable ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={styles.scroll}>{children}</View>
  );

  return (
    <OnboardingBackground>
      <View style={styles.flex}>
        <View style={styles.headerRow}>
          {__DEV__ && navigation.canGoBack() && (
            <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
              <SymbolView name="chevron.left" size={24} tintColor="#FFFFFF" />
            </Pressable>
          )}
          <View style={styles.progressContainer}>
            <SegmentedProgress total={progressTotal} current={progressStep} />
          </View>
        </View>
        <Text style={type.title}>{title}</Text>
        {subtitle ? <Text style={[type.body, styles.sub]}>{subtitle}</Text> : null}
        <View style={styles.scroll}>
          {body}
        </View>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>
    </OnboardingBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    paddingTop: space.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space.lg,
  },
  backBtn: {
    padding: space.xs,
    marginRight: space.sm,
  },
  progressContainer: {
    flex: 1,
  },
  sub: {
    marginTop: space.sm,
    marginBottom: space.lg,
    opacity: 0.9,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: space.xl,
  },
  footer: {
    paddingBottom: space.lg,
    gap: space.sm,
  },
});
