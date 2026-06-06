import { StyleSheet, Text, View } from 'react-native';

import type { CurrentWeather, Units } from '@/api/types';
import { getTemperature } from '@/api/weather';
import { formatTemperature } from '@/utils/units';
import { weatherCodeToEmoji } from '@/utils/weatherIcons';

interface WeatherCardProps {
  data: CurrentWeather;
  units: Units;
  locationLabel?: string | null;
}

export function WeatherCard({ data, units, locationLabel }: WeatherCardProps) {
  const temp = getTemperature(data.current);
  const condition =
    data.current.condition ?? data.current.description ?? 'Current conditions';
  const emoji = weatherCodeToEmoji(data.current.weather_code, condition);
  const place =
    locationLabel ??
    data.location.name ??
    [data.location.city, data.location.region].filter(Boolean).join(', ') ??
    'Your location';

  return (
    <View style={styles.card}>
      <Text style={styles.location}>{place}</Text>
      <View style={styles.row}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.temp}>{formatTemperature(temp, units)}</Text>
      </View>
      <Text style={styles.condition}>{condition}</Text>
      {data.aiSummary ? (
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>AI summary</Text>
          <Text style={styles.summary}>{data.aiSummary}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  location: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emoji: {
    fontSize: 48,
  },
  temp: {
    fontSize: 42,
    fontWeight: '700',
    color: '#111',
  },
  condition: {
    fontSize: 18,
    color: '#333',
    marginTop: 4,
  },
  summaryBox: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#208AEF',
    marginBottom: 6,
  },
  summary: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
});
