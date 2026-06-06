import { get } from '@/api/client';
import type { Units, WeatherGeoResponse } from '@/api/types';

export interface IpLookupResponse {
  ip?: string;
  ip_hash?: string;
  ip_version?: string;
  geo?: {
    lat: number;
    lon: number;
    city?: string;
    region?: string;
    country?: string;
    timezone?: string;
  };
}

export interface WebhookSubscription {
  id: string;
  url: string;
  lat: number;
  lon: number;
  triggers: string[];
  timezone?: string;
  active?: boolean;
  createdAt?: string;
}

export interface WebhooksListResponse {
  webhooks: WebhookSubscription[];
}

export async function fetchFullWeather(
  lat: number,
  lon: number,
  units: Units,
  days = 7,
  ai = true,
  lang = 'en',
): Promise<WeatherGeoResponse> {
  return get<WeatherGeoResponse>('/v1/weather', { lat, lon, days, units, ai, lang });
}

export async function fetchForecastAlias(
  lat: number,
  lon: number,
  units: Units,
  days = 7,
  ai = false,
): Promise<WeatherGeoResponse> {
  return get<WeatherGeoResponse>('/v1/forecast', { lat, lon, days, units, ai });
}

export async function fetchForecast14(
  lat: number,
  lon: number,
  units: Units,
  days = 14,
  ai = false,
): Promise<WeatherGeoResponse> {
  return get<WeatherGeoResponse>('/v1/forecast14', { lat, lon, days, units, ai });
}

export async function fetchInsights(
  lat: number,
  lon: number,
  units: Units,
  days = 7,
  lang = 'en',
): Promise<WeatherGeoResponse> {
  return get<WeatherGeoResponse>('/v1/insights', { lat, lon, days, units, lang });
}

export async function fetchWeatherGeoFull(
  ip: 'auto' | string = 'auto',
  days = 3,
  ai = true,
  units: Units = 'metric',
): Promise<WeatherGeoResponse> {
  return get<WeatherGeoResponse>('/v1/weather-geo', { ip, days, ai, units });
}

export async function fetchIpLookup(ip: 'auto' | string = 'auto'): Promise<IpLookupResponse> {
  return get<IpLookupResponse>('/v1/ip-lookup', { ip });
}

export async function fetchWebhooks(): Promise<WebhooksListResponse> {
  return get<WebhooksListResponse>('/v1/webhooks');
}

export async function fetchCurrentLocalized(
  lat: number,
  lon: number,
  units: Units,
  lang: string,
): Promise<WeatherGeoResponse> {
  return get<WeatherGeoResponse>('/v1/current', { lat, lon, units, ai: true, lang });
}
