import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const SHORTLIST_KEY = 'lab:shortlist';
const PINS_KEY = 'lab:pins';

export interface SavedPin {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface LabState {
  shortlist: string[];
  pins: SavedPin[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  toggleShortlist: (featureId: string) => Promise<void>;
  addPin: (name: string, lat: number, lon: number) => Promise<void>;
  removePin: (id: string) => Promise<void>;
}

async function loadJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const useLabStore = create<LabState>((set, get) => ({
  shortlist: [],
  pins: [],
  hydrated: false,

  hydrate: async () => {
    const [shortlist, pins] = await Promise.all([
      loadJson<string[]>(SHORTLIST_KEY, []),
      loadJson<SavedPin[]>(PINS_KEY, []),
    ]);
    set({ shortlist, pins, hydrated: true });
  },

  toggleShortlist: async (featureId) => {
    const next = get().shortlist.includes(featureId)
      ? get().shortlist.filter((id) => id !== featureId)
      : [...get().shortlist, featureId];
    set({ shortlist: next });
    await AsyncStorage.setItem(SHORTLIST_KEY, JSON.stringify(next));
  },

  addPin: async (name, lat, lon) => {
    const pin: SavedPin = {
      id: `${Date.now()}`,
      name,
      lat,
      lon,
    };
    const pins = [...get().pins, pin];
    set({ pins });
    await AsyncStorage.setItem(PINS_KEY, JSON.stringify(pins));
  },

  removePin: async (id) => {
    const pins = get().pins.filter((p) => p.id !== id);
    set({ pins });
    await AsyncStorage.setItem(PINS_KEY, JSON.stringify(pins));
  },
}));
