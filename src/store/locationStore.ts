import { create } from 'zustand';

import type { WeatherLocation } from '@/api/types';

interface LocationState {
  lat: number | null;
  lon: number | null;
  locationLabel: string | null;
  permissionDenied: boolean;
  loading: boolean;
  error: string | null;
  setCoords: (lat: number, lon: number, label?: string) => void;
  setLocationMeta: (location: WeatherLocation) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPermissionDenied: (denied: boolean) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  lat: null,
  lon: null,
  locationLabel: null,
  permissionDenied: false,
  loading: true,
  error: null,
  setCoords: (lat, lon, label) =>
    set({ lat, lon, locationLabel: label ?? null, error: null }),
  setLocationMeta: (location) => {
    const label =
      location.name ??
      [location.city, location.region, location.country].filter(Boolean).join(', ');
    set((state) => ({
      locationLabel: label || state.locationLabel,
      ...(location.lat != null && location.lon != null
        ? { lat: location.lat, lon: location.lon }
        : {}),
    }));
  },
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setPermissionDenied: (permissionDenied) => set({ permissionDenied }),
}));
