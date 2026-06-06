import { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { TreeAnalysis } from '@/api/types';
import type { TreesStackParamList } from '@/navigation/types';
import { useTreesStore } from '@/store/treesStore';

type Props = {
  navigation: NativeStackNavigationProp<TreesStackParamList, 'History'>;
};

function HistoryItem({
  item,
  onPress,
}: {
  item: TreeAnalysis;
  onPress: () => void;
}) {
  const thumb = item.overlay_image_url ?? item.original_image_url;

  return (
    <Pressable style={styles.item} onPress={onPress}>
      {thumb ? (
        <Image source={{ uri: thumb }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.thumbPlaceholder]} />
      )}
      <View style={styles.itemBody}>
        <Text style={styles.itemDate}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
        <Text style={styles.itemStats}>
          {item.total_tree_count} trees · {(item.canopy_coverage_pct ?? 0).toFixed(0)}% canopy
        </Text>
        {item.county ? <Text style={styles.itemMeta}>{item.county}</Text> : null}
      </View>
    </Pressable>
  );
}

export function HistoryScreen({ navigation }: Props) {
  const analyses = useTreesStore((s) => s.analyses);
  const nextCursor = useTreesStore((s) => s.nextCursor);
  const historyLoading = useTreesStore((s) => s.historyLoading);
  const error = useTreesStore((s) => s.error);
  const fetchHistory = useTreesStore((s) => s.fetchHistory);
  const setCurrentAnalysis = useTreesStore((s) => s.setCurrentAnalysis);

  useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  const openDetail = useCallback(
    (analysis: TreeAnalysis) => {
      setCurrentAnalysis(analysis);
      navigation.navigate('AnalysisDetail', { analysisId: analysis.analysis_id });
    },
    [navigation, setCurrentAnalysis],
  );

  const loadMore = () => {
    if (nextCursor && !historyLoading) {
      void fetchHistory(nextCursor);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={analyses}
        keyExtractor={(item) => item.analysis_id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <HistoryItem item={item} onPress={() => openDetail(item)} />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={
          <Text style={styles.heading}>Past analyses</Text>
        }
        ListEmptyComponent={
          historyLoading ? (
            <ActivityIndicator color="#208AEF" style={styles.spinner} />
          ) : (
            <Text style={styles.empty}>No analyses yet</Text>
          )
        }
        ListFooterComponent={
          historyLoading && analyses.length > 0 ? (
            <ActivityIndicator color="#208AEF" style={styles.spinner} />
          ) : null
        }
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    gap: 12,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  thumbPlaceholder: {
    backgroundColor: '#ddd',
  },
  itemBody: {
    flex: 1,
    justifyContent: 'center',
  },
  itemDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  itemStats: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  itemMeta: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  spinner: {
    marginVertical: 16,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 24,
  },
  error: {
    color: '#b00020',
    textAlign: 'center',
    padding: 8,
  },
});
