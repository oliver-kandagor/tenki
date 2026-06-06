import { StyleSheet, Text, View } from 'react-native';

import type { HourlyForecast, Units } from '@/api/types';
import { formatTemperature } from '@/utils/units';
import { weatherCodeToEmoji } from '@/utils/weatherIcons';

interface HourlyRowProps {
  hour: HourlyForecast;
  units: Units;
}

function formatHourLabel(time?: string): string {
  if (!time) return '—';
  const date = new Date(time);
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  return time.length > 5 ? time.slice(11, 16) : time;
}

export function HourlyRow({ hour, units }: HourlyRowProps) {
  const temp = hour.temperature ?? hour.temp;
  const emoji = weatherCodeToEmoji(hour.weather_code, hour.condition ?? hour.description);

  return (
    <View style={styles.card}>
      <Text style={styles.time}>{formatHourLabel(hour.time)}</Text>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.temp}>{formatTemperature(temp, units)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 88,
    padding: 12,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  temp: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
});
