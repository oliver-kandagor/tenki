import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import type { TreeAnalysis } from '@/api/types';
import { Feather } from '@expo/vector-icons';

interface TreeAnalysisCardProps {
  analysis: TreeAnalysis;
}

export function TreeAnalysisCard({ analysis }: TreeAnalysisCardProps) {
  const health = analysis?.tree_health || { healthy: 0, needs_care: 0, needs_replacement: 0 };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Analysis result</Text>
      <Text style={styles.meta}>
        {new Date(analysis.timestamp).toLocaleString()}
        {analysis.location ? ` · ${analysis.location}` : ''}
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{analysis.total_tree_count ?? '--'}</Text>
          <Text style={styles.statLabel}>Trees</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>
            {analysis.canopy_coverage_pct != null ? analysis.canopy_coverage_pct.toFixed(1) : '--'}%
          </Text>
          <Text style={styles.statLabel}>Canopy</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Health breakdown</Text>
      <Text style={styles.healthLine}>Healthy: {health.healthy}</Text>
      <Text style={styles.healthLine}>Needs care: {health.needs_care}</Text>
      <Text style={styles.healthLine}>Needs replacement: {health.needs_replacement}</Text>

      {analysis.observations && analysis.observations.length > 0 ? (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Observations</Text>
          {analysis.observations.map((item) => (
            <View key={item} style={styles.bulletRow}>
              <Feather name="eye" size={16} color="#8B5CF6" style={{ marginTop: 2 }} />
              <Text style={styles.bullet}>{item}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {analysis.recommendations && analysis.recommendations.length > 0 ? (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          {analysis.recommendations.map((item) => (
            <View key={item} style={styles.bulletRow}>
              <Feather name="check-circle" size={16} color="#10b981" style={{ marginTop: 2 }} />
              <Text style={styles.bullet}>{item}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {analysis.original_image_url ? (
        <>
          <Text style={styles.sectionTitle}>Original</Text>
          <Image source={{ uri: analysis.original_image_url }} style={styles.image} />
        </>
      ) : null}

      {analysis.overlay_image_url ? (
        <>
          <Text style={styles.sectionTitle}>Overlay</Text>
          <Image source={{ uri: analysis.overlay_image_url }} style={styles.image} />
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  meta: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  stat: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#b68cd4',
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  sectionContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#fff',
  },
  healthLine: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  bullet: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.9)',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 8,
  },
});
