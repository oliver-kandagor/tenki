import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { LabFeature } from '@/features/catalog';

interface FeatureCardProps {
  feature: LabFeature;
  shortlisted: boolean;
  onPress: () => void;
  onToggleShortlist: () => void;
}

const PLAN_COLORS: Record<string, string> = {
  free: '#2e7d32',
  pro: '#6a1b9a',
  scale: '#e65100',
};

const AI_LABELS: Record<string, string> = {
  none: 'No AI quota',
  optional: 'AI optional',
  always: 'Uses AI quota',
};

export function FeatureCard({
  feature,
  shortlisted,
  onPress,
  onToggleShortlist,
}: FeatureCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Pressable style={styles.tapArea} onPress={onPress}>
          <Text style={styles.emoji}>{feature.emoji}</Text>
          <View style={styles.body}>
            <Text style={styles.title}>{feature.title}</Text>
            <Text style={styles.tagline}>{feature.tagline}</Text>
            <Text style={styles.endpoint}>{feature.endpoint}</Text>
          </View>
        </Pressable>
        <Pressable style={styles.star} onPress={onToggleShortlist} hitSlop={8}>
          <Text style={styles.starText}>{shortlisted ? '★' : '☆'}</Text>
        </Pressable>
      </View>
      <View style={styles.badges}>
        <View style={[styles.badge, { backgroundColor: PLAN_COLORS[feature.plan] }]}>
          <Text style={styles.badgeText}>{feature.plan.toUpperCase()}</Text>
        </View>
        <View style={styles.badgeMuted}>
          <Text style={styles.badgeMutedText}>{AI_LABELS[feature.aiCost]}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C22',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tapArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  emoji: {
    fontSize: 28,
    marginRight: 10,
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  tagline: {
    fontSize: 14,
    color: '#a0a0a0',
    marginTop: 4,
    lineHeight: 20,
  },
  endpoint: {
    fontSize: 12,
    color: '#8B5CF6',
    marginTop: 6,
    fontFamily: 'Menlo',
  },
  star: {
    padding: 4,
  },
  starOn: {},
  starText: {
    fontSize: 22,
    color: '#f5a623',
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  badgeMuted: {
    backgroundColor: '#2A2A35',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeMutedText: {
    fontSize: 11,
    color: '#a0a0a0',
  },
});
