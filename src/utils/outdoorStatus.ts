import { CurrentConditions, HourlyForecast } from '@/api/types';
import { OutdoorStatus } from '@/components/ui/StatusBanner';

export interface OutdoorStatusResult {
  status: OutdoorStatus;
  title: string;
  description: string;
}

export function getOutdoorStatus(
  current: CurrentConditions | undefined,
  hourly: HourlyForecast[] | undefined,
  aiSummary: string | null | undefined
): OutdoorStatusResult {
  if (!current || !hourly || hourly.length === 0) {
    return {
      status: 'ready',
      title: 'Looking good!',
      description: 'We are fetching the latest weather data for you.',
    };
  }

  const aiText = aiSummary?.toLowerCase() || '';
  if (aiText.includes('flood') || aiText.includes('thunder') || aiText.includes('storm')) {
    return {
      status: 'stay_in',
      title: 'Better stay inside',
      description: 'Bad weather is nearby. Play it safe indoors today!',
    };
  }

  const next12h = hourly.slice(0, 12);
  const rainNext12h = next12h.some(
    (h) =>
      (h.precipitation_probability ?? 0) >= 50 ||
      `${h.condition} ${h.description}`.toLowerCase().includes('rain')
  );

  const next6h = hourly.slice(0, 6);
  const rainNext6h = next6h.some(
    (h) =>
      (h.precipitation_probability ?? 0) >= 40 ||
      `${h.condition} ${h.description}`.toLowerCase().includes('rain')
  );

  const wind = current.wind_speed ?? 0;

  if (rainNext6h || wind > 30) {
    return {
      status: 'caution',
      title: 'Grab your umbrella!',
      description: "It looks like it's going to rain or be very windy soon.",
    };
  }

  if (rainNext12h) {
    return {
      status: 'caution',
      title: 'Rain later today',
      description: 'You are good to go now, but rain might come later.',
    };
  }

  return {
    status: 'ready',
    title: 'Great time to play outside!',
    description: 'The weather is perfect for your outdoor activities.',
  };
}
