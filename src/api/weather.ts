import { get } from '@/api/client';
import type {
    CurrentConditions,
    CurrentWeather,
    DailyForecast,
    GeoCoords,
    HourlyForecast,
    Units,
    WeatherGeoResponse,
    WeatherLocation,
} from '@/api/types';

function pickLocation(data: WeatherGeoResponse): WeatherLocation {
  const geo = data.geo;
  const loc = data.location ?? {};
  return {
    name:
      loc.name ??
      ([geo?.city, geo?.region, geo?.country].filter(Boolean).join(', ') || undefined),
    city: loc.city ?? geo?.city,
    region: loc.region ?? geo?.region,
    country: loc.country ?? geo?.country,
    lat: loc.lat ?? geo?.lat ?? data.lat,
    lon: loc.lon ?? geo?.lon ?? data.lon,
  };
}

function pickAiSummary(data: WeatherGeoResponse): string | null {
  return (
    data.ai_summary ??
    data.summary ??
    data.ai?.summary ??
    null
  );
}

export function normalizeCurrent(data: WeatherGeoResponse): CurrentWeather {
  const current = data.current ?? {};
  return {
    location: pickLocation(data),
    current: {
      ...current,
      temperature: current.temperature ?? current.temp,
    },
    aiSummary: pickAiSummary(data),
  };
}

export function normalizeDaily(data: WeatherGeoResponse): DailyForecast[] {
  const days = data.daily ?? [];
  return days.map((day) => ({
    ...day,
    max_temp: day.max_temp ?? day.temp_max,
    min_temp: day.min_temp ?? day.temp_min,
  }));
}

export function normalizeHourly(data: WeatherGeoResponse): HourlyForecast[] {
  const hours = data.hourly ?? [];
  return hours.map((hour) => ({
    ...hour,
    temperature: hour.temperature ?? hour.temp,
    time: hour.time ?? hour.datetime ?? hour.hour,
  }));
}

export async function fetchCurrent(
  lat: number,
  lon: number,
  units: Units,
  ai = true,
): Promise<CurrentWeather> {
  const data = await get<WeatherGeoResponse>('/v1/weather', {
    lat,
    lon,
    units,
    days: 1,
    ai,
  });
  return normalizeCurrent(data);
}

export async function fetchDaily(
  lat: number,
  lon: number,
  units: Units,
  days = 7,
  ai = false,
): Promise<DailyForecast[]> {
  const data = await get<WeatherGeoResponse>('/v1/weather', {
    lat,
    lon,
    days,
    units,
    ai,
  });
  return normalizeDaily(data);
}

export async function fetchHourly(
  lat: number,
  lon: number,
  units: Units,
  days = 1,
  ai = false,
): Promise<HourlyForecast[]> {
  const data = await get<WeatherGeoResponse>('/v1/weather', {
    lat,
    lon,
    days,
    units,
    ai,
  });
  return normalizeHourly(data);
}

export async function fetchWeatherGeo(
  ip: 'auto' = 'auto',
  days = 1,
  ai = false,
): Promise<GeoCoords & { location: WeatherLocation }> {
  const data = await get<WeatherGeoResponse>('/v1/weather-geo', {
    ip,
    days,
    ai,
  });
  const location = pickLocation(data);
  const lat = location.lat ?? data.lat ?? data.geo?.lat;
  const lon = location.lon ?? data.lon ?? data.geo?.lon;

  if (lat == null || lon == null) {
    throw new Error('Could not detect location from IP.');
  }

  return { lat, lon, location };
}

export function getTemperature(
  current: CurrentConditions | undefined,
): number | null {
  const value = current?.temperature ?? current?.temp;
  return value != null ? value : null;
}
