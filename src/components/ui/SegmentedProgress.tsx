import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { colors, radius, space } from '@/theme/tokens';

interface SegmentedProgressProps {
  total: number;
  current: number;
}

export function SegmentedProgress({ total, current }: SegmentedProgressProps) {
  return (
    <View style={styles.row} accessibilityRole="progressbar">
      {Array.from({ length: total }, (_, i) => (
        <Segment key={i} filled={i < current} />
      ))}
    </View>
  );
}

function Segment({ filled }: { filled: boolean }) {
  const fillWidth = useSharedValue(filled ? 1 : 0);

  useEffect(() => {
    fillWidth.value = withTiming(filled ? 1 : 0, { duration: 500 });
  }, [filled, fillWidth]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${fillWidth.value * 100}%`,
    };
  });

  return (
    <View style={styles.segmentBackground}>
      <Animated.View style={[styles.segmentFilled, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: space.sm,
    marginBottom: space.xl,
  },
  segmentBackground: {
    flex: 1,
    height: 10,
    backgroundColor: colors.surface.inset,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  segmentFilled: {
    height: '100%',
    backgroundColor: colors.primary.default,
    borderRadius: radius.pill,
  },
});
