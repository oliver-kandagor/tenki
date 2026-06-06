import { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View, ViewToken } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { IntroSlide } from '@/components/ui/IntroSlide';
import { OnboardingBackground } from '@/components/ui/OnboardingBackground';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { TextButton } from '@/components/ui/TextButton';
import { INTRO_SLIDES } from '@/constants/onboarding';
import type { OnboardingStackParamList } from '@/navigation/types';
import { useOnboardingStore } from '@/store/onboardingStore';
import { colors, space } from '@/theme/tokens';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'IntroSlides'>;

const { width: screenWidth } = Dimensions.get('window');
const slideWidth = screenWidth - space.lg * 2;

export function IntroSlidesScreen({ navigation }: Props) {
  const [index, setIndex] = useState(0);
  const setIntroSlideIndex = useOnboardingStore((s) => s.setIntroSlideIndex);
  const listRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const i = viewableItems[0]?.index ?? 0;
    setIndex(i);
    setIntroSlideIndex(i);
  }).current;

  const isLast = index === INTRO_SLIDES.length - 1;

  const goNext = () => {
    if (isLast) {
      navigation.navigate('GoogleSignIn');
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  return (
    <OnboardingBackground>
      <View style={styles.flex}>
        <FlatList
          ref={listRef}
          data={[...INTRO_SLIDES]}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => String(i)}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          renderItem={({ item }) => (
            <View style={{ width: slideWidth }}>
              <IntroSlide title={item.title} body={item.body} />
            </View>
          )}
        />
        <View style={styles.dots}>
          {INTRO_SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <PrimaryButton label={isLast ? 'Continue' : 'Next'} onPress={goNext} />
        {!isLast ? (
          <TextButton label="Skip intro" onPress={() => navigation.navigate('GoogleSignIn')} />
        ) : null}
      </View>
    </OnboardingBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    paddingTop: space.lg,
    paddingBottom: space['2xl'],
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: space.sm,
    marginVertical: space.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface.inset,
  },
  dotActive: {
    backgroundColor: colors.primary.default,
    width: 20,
  },
});
