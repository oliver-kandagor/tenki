import type { HourlyForecast } from '@/api/types';

function hourLabel(time?: string): string {
  if (!time) return '—';
  const d = new Date(time);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleString([], { weekday: 'short', hour: 'numeric' });
  }
  return time;
}

function isRainy(hour: HourlyForecast): boolean {
  const text = `${hour.condition ?? ''} ${hour.description ?? ''}`.toLowerCase();
  if (text.includes('rain') || text.includes('drizzle') || text.includes('thunder')) {
    return true;
  }
  const precip = hour.precipitation_probability;
  return precip != null && precip >= 50;
}

export interface RainWindowResult {
  rainyHours: { label: string; precip?: number }[];
  dryStreaks: { start: string; end: string; hours: number }[];
  advice: string;
}

export function analyzeRainWindow(hourly: HourlyForecast[]): RainWindowResult {
  const rainyHours = hourly
    .filter(isRainy)
    .map((h) => ({
      label: hourLabel(h.time),
      precip: h.precipitation_probability,
    }));

  const dryStreaks: RainWindowResult['dryStreaks'] = [];
  let streakStart: string | null = null;
  let streakLen = 0;

  const flush = () => {
    if (streakStart && streakLen >= 2) {
      const endIdx = hourly.findIndex((h) => hourLabel(h.time) === streakStart) + streakLen - 1;
      dryStreaks.push({
        start: streakStart,
        end: hourLabel(hourly[endIdx]?.time),
        hours: streakLen,
      });
    }
    streakStart = null;
    streakLen = 0;
  };

  for (const h of hourly) {
    const label = hourLabel(h.time);
    if (!isRainy(h)) {
      if (!streakStart) streakStart = label;
      streakLen += 1;
    } else {
      flush();
    }
  }
  flush();

  let advice: string;
  if (rainyHours.length === 0) {
    advice = 'No significant rain in the next 24h — good window for field work.';
  } else if (dryStreaks.length > 0) {
    const best = dryStreaks.sort((a, b) => b.hours - a.hours)[0];
    advice = `Longest dry spell: ${best.start} → ${best.end} (${best.hours}h). Plan spraying then.`;
  } else {
    advice = 'Wet period ahead — postpone outdoor chemical application.';
  }

  return { rainyHours, dryStreaks, advice };
}

export interface GoldenHourPick {
  label: string;
  score: number;
  temp?: number;
  reason: string;
}

export function pickGoldenHours(hourly: HourlyForecast[]): GoldenHourPick[] {
  const scored = hourly.map((h) => {
    const temp = h.temperature ?? h.temp ?? 20;
    const precip = h.precipitation_probability ?? 0;
    const rainy = isRainy(h);

    let score = 100;
    if (rainy) score -= 50;
    score -= precip * 0.4;
    if (temp < 10 || temp > 35) score -= 20;
    if (temp >= 18 && temp <= 28) score += 10;

    const reasons: string[] = [];
    if (!rainy && precip < 20) reasons.push('low rain risk');
    if (temp >= 18 && temp <= 28) reasons.push('comfortable temp');

    return {
      label: hourLabel(h.time),
      score: Math.round(score),
      temp,
      reason: reasons.join(', ') || 'marginal conditions',
    };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 5);
}
