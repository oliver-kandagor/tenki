import * as Haptics from 'expo-haptics';
import { create } from 'zustand';

import { analyzeTreeImage, fetchTreesHistory } from '@/api/trees';
import type { TreeAnalysis, TreeMeta } from '@/api/types';
import { getCache, setCache } from '@/utils/cache';

const HISTORY_CACHE_KEY = 'trees:history:first-page';

interface TreesState {
  analyses: TreeAnalysis[];
  currentAnalysis: TreeAnalysis | null;
  nextCursor: string | null;
  historyLoading: boolean;
  uploading: boolean;
  error: string | null;
  analyze: (imageUri: string, meta?: TreeMeta) => Promise<void>;
  fetchHistory: (cursor?: string, refresh?: boolean) => Promise<void>;
  setCurrentAnalysis: (analysis: TreeAnalysis | null) => void;
  clearError: () => void;
}

export const useTreesStore = create<TreesState>((set, get) => ({
  analyses: [],
  currentAnalysis: null,
  nextCursor: null,
  historyLoading: false,
  uploading: false,
  error: null,

  clearError: () => set({ error: null }),

  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),

  analyze: async (imageUri, meta) => {
    set({ uploading: true, error: null });
    try {
      const result = await analyzeTreeImage(imageUri, meta);
      const cacheKey = `trees:analysis:${result.analysis_id}`;
      await setCache(cacheKey, result, Number.MAX_SAFE_INTEGER);
      set((state) => ({
        currentAnalysis: result,
        analyses: [result, ...state.analyses.filter((a) => a.analysis_id !== result.analysis_id)],
        uploading: false,
      }));
      // Haptic feedback on successful completion
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Tree analysis failed';
      set({ uploading: false, error: message });
      throw error;
    }
  },

  fetchHistory: async (cursor, refresh = false) => {
    if (!cursor && !refresh) {
      const cached = await getCache<{ analyses: TreeAnalysis[]; next_cursor?: string }>(
        HISTORY_CACHE_KEY,
      );
      if (cached) {
        set({
          analyses: cached.analyses,
          nextCursor: cached.next_cursor ?? null,
        });
        return;
      }
    }

    set({ historyLoading: true, error: null });
    try {
      const response = await fetchTreesHistory(20, cursor);
      set((state) => ({
        analyses: cursor
          ? [...state.analyses, ...response.analyses]
          : response.analyses,
        nextCursor: response.next_cursor ?? null,
        historyLoading: false,
      }));

      if (!cursor) {
        await setCache(HISTORY_CACHE_KEY, response, 5 * 60 * 1000);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load history';
      set({ historyLoading: false, error: message });
    }
  },
}));
