import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { WeatherCard } from '@/components/WeatherCard';
import { useWeather } from '@/hooks/useWeather';
import { useLocationStore } from '@/store/locationStore';

function LoadingSkeleton() {
  return (
    <View style={styles.skeletonCard}>
      <View style={[styles.skeletonLine, { width: '50%' }]} />
      <View style={[styles.skeletonLine, { width: '30%', height: 48, marginTop: 16 }]} />
      <View style={[styles.skeletonLine, { width: '70%', marginTop: 12 }]} />
      <View style={[styles.skeletonLine, { width: '90%', marginTop: 20, height: 60 }]} />
    </View>
  );
}

export function HomeScreen() {
  const locationLabel = useLocationStore((s) => s.locationLabel);
  const {
    current,
    units,
    loading,
    error,
    locationLoading,
    ready,
    refreshCurrent,
  } = useWeather();

  const isLoading = locationLoading || loading || (ready && !current && !error);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Current weather</Text>

        {isLoading ? <LoadingSkeleton /> : null}

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.button} onPress={() => refreshCurrent(true)}>
              <Text style={styles.buttonText}>Retry</Text>
            </Pressable>
          </View>
        ) : null}

        {current && !error ? (
          <WeatherCard data={current} units={units} locationLabel={locationLabel} />
        ) : null}

        {isLoading ? (
          <ActivityIndicator style={styles.spinner} color="#208AEF" />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  content: {
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111',
  },
  skeletonCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  skeletonLine: {
    height: 14,
    backgroundColor: '#e8e8e8',
    borderRadius: 4,
  },
  errorBox: {
    backgroundColor: '#fff3f3',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ffc9c9',
  },
  errorText: {
    color: '#b00020',
    marginBottom: 12,
    fontSize: 15,
  },
  button: {
    alignSelf: 'flex-start',
    backgroundColor: '#208AEF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  spinner: {
    marginTop: 16,
  },
});
