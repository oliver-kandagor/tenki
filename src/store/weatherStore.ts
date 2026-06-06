import { create } from 'zustand';

import { fetchCurrent, fetchDaily, fetchHourly } from '@/api/weather';
import type {
  CurrentWeather,
  DailyForecast,
  HourlyForecast,
  Units,
} from '@/api/types';
import { getCache, setCache } from '@/utils/cache';

const CACHE_KEYS = {
  current: (lat: number, lon: number, units: Units) =>
    `weather:current:${lat.toFixed(3)}:${lon.toFixed(3)}:${units}`,
  daily: (lat: number, lon: number, units: Units) =>
    `weather:daily:${lat.toFixed(3)}:${lon.toFixed(3)}:${units}`,
  hourly: (lat: number, lon: number, units: Units) =>
    `weather:hourly:${lat.toFixed(3)}:${lon.toFixed(3)}:${units}`,
};

const TTL = {
  current: 10 * 60 * 1000,
  daily: 30 * 60 * 1000,
  hourly: 15 * 60 * 1000,
};

interface WeatherState {
  current: CurrentWeather | null;
  daily: DailyForecast[] | null;
  hourly: HourlyForecast[] | null;
  units: Units;
  loading: boolean;
  forecastLoading: boolean;
  error: string | null;
  fetchCurrent: (lat: number, lon: number, force?: boolean) => Promise<void>;
  fetchForecast: (lat: number, lon: number, force?: boolean) => Promise<void>;
  setUnits: (units: Units) => void;
  clearError: () => void;
}

export const useWeatherStore = create<WeatherState>((set, get) => ({
  current: null,
  daily: null,
  hourly: null,
  units: 'metric',
  loading: false,
  forecastLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  setUnits: (units) => set({ units }),

  fetchCurrent: async (lat, lon, force = false) => {
    const { units } = get();
    const cacheKey = CACHE_KEYS.current(lat, lon, units);

    if (!force) {
      const cached = await getCache<CurrentWeather>(cacheKey);
      if (cached) {
        set({ current: cached, loading: false, error: null });
        return;
      }
    }

    set({ loading: true, error: null });
    try {
      const data = await fetchCurrent(lat, lon, units, true);
      await setCache(cacheKey, data, TTL.current);
      set({ current: data, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load weather';
      set({ loading: false, error: message });
    }
  },

  fetchForecast: async (lat, lon, force = false) => {
    const { units } = get();
    const dailyKey = CACHE_KEYS.daily(lat, lon, units);
    const hourlyKey = CACHE_KEYS.hourly(lat, lon, units);

    if (!force) {
      const [cachedDaily, cachedHourly] = await Promise.all([
        getCache<DailyForecast[]>(dailyKey),
        getCache<HourlyForecast[]>(hourlyKey),
      ]);
      if (cachedDaily && cachedHourly) {
        set({ daily: cachedDaily, hourly: cachedHourly, forecastLoading: false });
        return;
      }
    }

    set({ forecastLoading: true, error: null });
    try {
      const [daily, hourly] = await Promise.all([
        fetchDaily(lat, lon, units, 7, false),
        fetchHourly(lat, lon, units, 1, false),
      ]);
      await Promise.all([
        setCache(dailyKey, daily, TTL.daily),
        setCache(hourlyKey, hourly, TTL.hourly),
      ]);
      set({ daily, hourly, forecastLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load forecast';
      set({ forecastLoading: false, error: message });
    }
  },
}));
