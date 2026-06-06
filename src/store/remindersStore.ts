import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ReminderType = 'rain' | 'flood' | 'wind' | 'frost' | 'dry_window';

export type LeadTime = 'now' | '15min' | '30min' | '1hour' | '2hour' | '6hour' | '1day';

interface ReminderState {
  enabled: Record<ReminderType, boolean>;
  leadTimes: Record<ReminderType, LeadTime>;
  history: Array<{
    id: string;
    type: ReminderType;
    triggeredAt: string;
    message: string;
  }>;

  // Actions
  toggleReminder: (type: ReminderType) => void;
  setLeadTime: (type: ReminderType, leadTime: LeadTime) => void;
  addToHistory: (type: ReminderType, message: string) => void;
  clearHistory: () => void;
}

const STORAGE_KEY = '@tenki/reminders';

export const useRemindersStore = create<ReminderState>()(
  persist(
    (set) => ({
      enabled: {
        rain: true,
        flood: true,
        wind: false,
        frost: false,
        dry_window: true,
      },
      leadTimes: {
        rain: '1hour',
        flood: '30min',
        wind: '1hour',
        frost: '30min',
        dry_window: '1hour',
      },
      history: [],

      toggleReminder: (type) =>
        set((state) => ({
          enabled: {
            ...state.enabled,
            [type]: !state.enabled[type],
          },
        })),

      setLeadTime: (type, leadTime) =>
        set((state) => ({
          leadTimes: {
            ...state.leadTimes,
            [type]: leadTime,
          },
        })),

      addToHistory: (type, message) =>
        set((state) => ({
          history: [
            {
              id: `${type}-${Date.now()}`,
              type,
              triggeredAt: new Date().toISOString(),
              message,
            },
            ...state.history.slice(0, 49), // Keep last 50
          ],
        })),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
