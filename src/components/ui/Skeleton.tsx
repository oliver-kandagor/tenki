import { colors, radius } from '@/theme/tokens';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  style?: ViewStyle;
  borderRadius?: number;
  shimmer?: boolean;
}

export function Skeleton({
  width = '100%',
  height = 12,
  style,
  borderRadius: br = radius.md,
  shimmer = true,
}: SkeletonProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!shimmer) return;

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]),
    );

    loop.start();
    return () => loop.stop();
  }, [shimmer, shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.9],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height: height as any,
          borderRadius: br,
          opacity: shimmer ? opacity : 1,
        },
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Skeleton width={60} height={20} borderRadius={radius.sm} />
        <Skeleton width={80} height={24} borderRadius={radius.sm} />
      </View>
      <View style={styles.cardBody}>
        <Skeleton width="100%" height={16} borderRadius={radius.sm} style={{ marginBottom: 8 }} />
        <Skeleton width="85%" height={16} borderRadius={radius.sm} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.surface.inset,
  },
  card: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardBody: {
    gap: 8,
  },
});
