import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export const AUTH_STORAGE_KEY = '@tenki/auth';

interface AuthState {
  isSignedIn: boolean;
  hydrated: boolean;
  signInWithGoogleStub: () => Promise<void>;
  signOut: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isSignedIn: false,
  hydrated: false,

  signInWithGoogleStub: async () => {
    set({ isSignedIn: true });
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ isSignedIn: true }));
  },

  signOut: async () => {
    set({ isSignedIn: false });
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  },

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { isSignedIn?: boolean };
        set({ isSignedIn: Boolean(parsed.isSignedIn), hydrated: true });
        return;
      }
    } catch {
      // ignore corrupt storage
    }
    set({ hydrated: true });
  },
}));
