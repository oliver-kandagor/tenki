import { useCallback, useEffect } from 'react';

import { useLocation } from '@/hooks/useLocation';
import { useLocationStore } from '@/store/locationStore';
import { useWeatherStore } from '@/store/weatherStore';

export function useWeather() {
  const { lat, lon, ready, loading: locationLoading } = useLocation();
  const setLocationMeta = useLocationStore((s) => s.setLocationMeta);

  const current = useWeatherStore((s) => s.current);
  const daily = useWeatherStore((s) => s.daily);
  const hourly = useWeatherStore((s) => s.hourly);
  const units = useWeatherStore((s) => s.units);
  const loading = useWeatherStore((s) => s.loading);
  const forecastLoading = useWeatherStore((s) => s.forecastLoading);
  const error = useWeatherStore((s) => s.error);
  const fetchCurrent = useWeatherStore((s) => s.fetchCurrent);
  const fetchForecast = useWeatherStore((s) => s.fetchForecast);
  const setUnits = useWeatherStore((s) => s.setUnits);

  const refreshCurrent = useCallback(
    (force = false) => {
      if (lat == null || lon == null) return;
      void fetchCurrent(lat, lon, force);
    },
    [fetchCurrent, lat, lon],
  );

  const refreshForecast = useCallback(
    (force = false) => {
      if (lat == null || lon == null) return;
      void fetchForecast(lat, lon, force);
    },
    [fetchForecast, lat, lon],
  );

  useEffect(() => {
    if (!ready || lat == null || lon == null) return;
    void fetchCurrent(lat, lon);
    void fetchForecast(lat, lon);
  }, [ready, lat, lon, units, fetchCurrent, fetchForecast]);

  useEffect(() => {
    if (current?.location) {
      setLocationMeta(current.location);
    }
  }, [current, setLocationMeta]);

  return {
    lat,
    lon,
    ready,
    locationLoading,
    current,
    daily,
    hourly,
    units,
    loading,
    forecastLoading,
    error,
    setUnits,
    refreshCurrent,
    refreshForecast,
  };
}
