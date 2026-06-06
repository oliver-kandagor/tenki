import { useEffect } from 'react';
import * as Location from 'expo-location';

import { fetchWeatherGeo } from '@/api/weather';
import { useLocationStore } from '@/store/locationStore';

export function useLocation() {
  const {
    lat,
    lon,
    locationLabel,
    permissionDenied,
    loading,
    error,
    setCoords,
    setLocationMeta,
    setLoading,
    setError,
    setPermissionDenied,
  } = useLocationStore();

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    let cancelled = false;

    async function resolveLocation() {
      setLoading(true);
      setError(null);

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === 'granted') {
          subscription = await Location.watchPositionAsync(
            { accuracy: Location.Accuracy.Balanced, distanceInterval: 100 },
            async (position) => {
              if (cancelled) return;
              const { latitude, longitude } = position.coords;
              setCoords(latitude, longitude);
              setPermissionDenied(false);

              try {
                const reverse = await Location.reverseGeocodeAsync({
                  latitude,
                  longitude,
                });
                const place = reverse[0];
                if (place && !cancelled) {
                  const label = [place.city, place.region, place.country]
                    .filter(Boolean)
                    .join(', ');
                  if (label) {
                    setCoords(latitude, longitude, label);
                  }
                }
              } catch {
                // Reverse geocode is best-effort for MVP
              }
            }
          );
        } else {
          setPermissionDenied(true);
          const geo = await fetchWeatherGeo('auto', 1, false);
          if (cancelled) return;
          setCoords(geo.lat, geo.lon, geo.location.name);
          setLocationMeta(geo.location);
        }
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : 'Could not determine location';
        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void resolveLocation();

    return () => {
      cancelled = true;
      if (subscription) {
        subscription.remove();
      }
    };
  }, [
    setCoords,
    setError,
    setLoading,
    setLocationMeta,
    setPermissionDenied,
  ]);

  return {
    lat,
    lon,
    locationLabel,
    permissionDenied,
    loading,
    error,
    ready: lat != null && lon != null,
  };
}
