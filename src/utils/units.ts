import type { Units } from '@/api/types';

export function formatTemperature(value: number | null | undefined, units: Units): string {
  if (value == null) return '—';
  const suffix = units === 'imperial' ? '°F' : '°C';
  return `${Math.round(value)}${suffix}`;
}

export function unitsLabel(units: Units): string {
  return units === 'imperial' ? 'Imperial (°F)' : 'Metric (°C)';
}
