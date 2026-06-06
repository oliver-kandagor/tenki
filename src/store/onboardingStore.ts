import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import type { LocationIconId, OutdoorActivity } from '@/constants/onboarding';

export const ONBOARDING_STORAGE_KEY = '@tenki/onboarding';

export type UpdateFrequency = 'daily' | 'weekly' | 'monthly';

export interface NotificationChannels {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
}

export interface SavedLocation {
  id: string;
  name: string;
  lat?: number;
  lon?: number;
  icon: LocationIconId;
  preset?: 'home' | 'work' | 'custom';
  isDefault?: boolean;
}

interface OnboardingPersisted {
  hasCompletedOnboarding: boolean;
  introSlideIndex: number;
  activities: OutdoorActivity[];
  notificationChannels: NotificationChannels;
  updateFrequency: UpdateFrequency;
  locations: SavedLocation[];
  selectedPlan: 'free' | 'pro' | 'farm';
}

interface OnboardingState extends OnboardingPersisted {
  hydrated: boolean;
  setIntroSlideIndex: (index: number) => void;
  toggleActivity: (activity: OutdoorActivity) => void;
  setActivities: (activities: OutdoorActivity[]) => void;
  setNotificationChannel: (key: keyof NotificationChannels, value: boolean) => void;
  setUpdateFrequency: (frequency: UpdateFrequency) => void;
  setSelectedPlan: (plan: 'free' | 'pro' | 'farm') => void;
  setLocations: (locations: SavedLocation[]) => void;
  upsertLocation: (location: SavedLocation) => void;
  removeLocation: (id: string) => void;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
  hydrate: () => Promise<void>;
}

const defaultState: OnboardingPersisted = {
  hasCompletedOnboarding: false,
  introSlideIndex: 0,
  activities: [],
  notificationChannels: { email: true, sms: false, whatsapp: false },
  updateFrequency: 'daily',
  locations: [],
  selectedPlan: 'free',
};

async function persist(state: OnboardingPersisted) {
  await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(state));
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...defaultState,
  hydrated: false,

  setIntroSlideIndex: (introSlideIndex) => {
    set({ introSlideIndex });
    void persist({ ...pickPersisted(get()), introSlideIndex });
  },

  toggleActivity: (activity) => {
    const current = get().activities;
    const next = current.includes(activity)
      ? current.filter((a) => a !== activity)
      : [...current, activity];
    set({ activities: next });
    void persist({ ...pickPersisted(get()), activities: next });
  },

  setActivities: (activities) => {
    set({ activities });
    void persist({ ...pickPersisted(get()), activities });
  },

  setNotificationChannel: (key, value) => {
    const notificationChannels = { ...get().notificationChannels, [key]: value };
    set({ notificationChannels });
    void persist({ ...pickPersisted(get()), notificationChannels });
  },

  setUpdateFrequency: (updateFrequency) => {
    set({ updateFrequency });
    void persist({ ...pickPersisted(get()), updateFrequency });
  },

  setSelectedPlan: (selectedPlan) => {
    set({ selectedPlan });
    void persist({ ...pickPersisted(get()), selectedPlan });
  },

  setLocations: (locations) => {
    set({ locations });
    void persist({ ...pickPersisted(get()), locations });
  },

  upsertLocation: (location) => {
    let currentLocations = get().locations.filter((l) => l.id !== location.id);
    if (location.isDefault) {
      currentLocations = currentLocations.map((l) => ({ ...l, isDefault: false }));
    }
    const locations = [...currentLocations, location];
    set({ locations });
    void persist({ ...pickPersisted(get()), locations });
  },

  removeLocation: (id) => {
    const locations = get().locations.filter((l) => l.id !== id);
    set({ locations });
    void persist({ ...pickPersisted(get()), locations });
  },

  completeOnboarding: async () => {
    set({ hasCompletedOnboarding: true });
    await persist({ ...pickPersisted(get()), hasCompletedOnboarding: true });
  },

  resetOnboarding: async () => {
    set({ ...defaultState, hydrated: true });
    await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
  },

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<OnboardingPersisted>;
        set({
          ...defaultState,
          ...parsed,
          activities: parsed.activities ?? [],
          notificationChannels: {
            ...defaultState.notificationChannels,
            ...parsed.notificationChannels,
          },
          locations: parsed.locations ?? [],
          selectedPlan: parsed.selectedPlan ?? 'free',
          hydrated: true,
        });
        return;
      }
    } catch {
      // ignore
    }
    set({ hydrated: true });
  },
}));

function pickPersisted(state: OnboardingState): OnboardingPersisted {
  return {
    hasCompletedOnboarding: state.hasCompletedOnboarding,
    introSlideIndex: state.introSlideIndex,
    activities: state.activities,
    notificationChannels: state.notificationChannels,
    updateFrequency: state.updateFrequency,
    locations: state.locations,
    selectedPlan: state.selectedPlan,
  };
}
