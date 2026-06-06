import { StyleSheet, Text, View } from 'react-native';

import type { DailyForecast, Units } from '@/api/types';
import { formatTemperature } from '@/utils/units';
import { weatherCodeToEmoji } from '@/utils/weatherIcons';

interface DailyRowProps {
  day: DailyForecast;
  units: Units;
}

export function DailyRow({ day, units }: DailyRowProps) {
  const label = day.date ?? day.day ?? '—';
  const emoji = weatherCodeToEmoji(day.weather_code, day.condition ?? day.description);
  const max = day.max_temp ?? day.temp_max;
  const min = day.min_temp ?? day.temp_min;

  return (
    <View style={styles.row}>
      <Text style={styles.date}>{label}</Text>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.condition} numberOfLines={1}>
        {day.condition ?? day.description ?? '—'}
      </Text>
      <Text style={styles.temps}>
        {formatTemperature(max, units)} / {formatTemperature(min, units)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 8,
  },
  date: {
    width: 88,
    fontSize: 14,
    color: '#333',
  },
  emoji: {
    fontSize: 22,
    width: 28,
    textAlign: 'center',
  },
  condition: {
    flex: 1,
    fontSize: 14,
    color: '#555',
  },
  temps: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    minWidth: 96,
    textAlign: 'right',
  },
});
