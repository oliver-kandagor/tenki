import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { TreeAnalysisCard } from '@/components/TreeAnalysisCard';
import type { TreesStackParamList } from '@/navigation/types';
import { useTreesStore } from '@/store/treesStore';

type Props = NativeStackScreenProps<TreesStackParamList, 'AnalysisDetail'>;

export function AnalysisDetailScreen({ route }: Props) {
  const currentAnalysis = useTreesStore((s) => s.currentAnalysis);
  const analyses = useTreesStore((s) => s.analyses);

  const analysis =
    currentAnalysis?.analysis_id === route.params.analysisId
      ? currentAnalysis
      : analyses.find((a) => a.analysis_id === route.params.analysisId);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {analysis ? (
        <TreeAnalysisCard analysis={analysis} />
      ) : (
        <View style={styles.missing}>
          <Text style={styles.missingText}>Analysis not found</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingText: {
    color: '#888',
    fontSize: 16,
  },
});
