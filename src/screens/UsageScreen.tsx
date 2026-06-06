import React, { useCallback, useEffect, useState, useContext } from 'react';
import { ActivityIndicator, ScrollView, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { ThemeContext } from "@/contexts/theme-context";
import { Database, Zap, Camera, Key } from "lucide-react-native";
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { fetchUsage } from '@/api/account';
import { fetchTreesQuota } from '@/api/trees';
import type { TreesQuotaResponse, UsageResponse } from '@/api/types';
import { getCache, setCache } from '@/utils/cache';

import CustomHeader from "@/components/shared/custom-header";
import RedirectCard from "@/components/screens/settings/redirect-card";
import ThemeCard from "@/components/screens/settings/theme-card";
import { SunIcon, MoonIcon } from "@/components/ui/icon";
import { QuotaBadge } from '@/components/QuotaBadge';
import { useWeather } from '@/hooks/useWeather';
import { useLocationStore } from '@/store/locationStore';
import { getWeatherImage } from '@/utils/getWeatherImage';
import type { UsageStackParamList } from '@/navigation/types';

const USAGE_CACHE_KEY = 'account:usage';
const TREES_QUOTA_CACHE_KEY = 'account:trees-quota';
const TTL = 5 * 60 * 1000;

function pickUsageSlice(
  usage: UsageResponse | null,
  key: 'requests' | 'ai_requests' | 'standard_requests' | 'ai',
): { used: number; limit: number } {
  const slice = usage?.[key];
  if (slice) {
    return { used: slice.used, limit: slice.limit };
  }
  return { used: 0, limit: 0 };
}

function formatDate(value?: string): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

export function UsageScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<UsageStackParamList>>();
  const { colorMode, setColorMode }: any = useContext(ThemeContext);
  const [usage, setUsage] = useState<UsageResponse | null>(null);
  const [treesQuota, setTreesQuota] = useState<TreesQuotaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { current } = useWeather();
  const locationLabel = useLocationStore((s) => s.locationLabel);

  const currTemp = Math.round(current?.current?.temperature ?? current?.current?.temp ?? 0);
  const conditionText = typeof current?.current?.condition === 'string' ? current?.current?.condition : current?.current?.condition?.text ?? 'Clear';
  const feelsLike = Math.round(current?.current?.feels_like ?? current?.current?.feelslike_c ?? currTemp);

  const load = useCallback(async (force = false) => {
    setError(null);
    if (!force) {
      const [cachedUsage, cachedTrees] = await Promise.all([
        getCache<UsageResponse>(USAGE_CACHE_KEY),
        getCache<TreesQuotaResponse>(TREES_QUOTA_CACHE_KEY),
      ]);
      if (cachedUsage && cachedTrees) {
        setUsage(cachedUsage);
        setTreesQuota(cachedTrees);
        setLoading(false);
        return;
      }
    }
    setLoading(true);
    try {
      const [usageData, quotaData] = await Promise.all([
        fetchUsage(),
        fetchTreesQuota(),
      ]);
      await Promise.all([
        setCache(USAGE_CACHE_KEY, usageData, TTL),
        setCache(TREES_QUOTA_CACHE_KEY, quotaData, TTL),
      ]);
      setUsage(usageData);
      setTreesQuota(quotaData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load usage');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const standard = pickUsageSlice(usage, 'requests');
  const standardAlt = pickUsageSlice(usage, 'standard_requests');
  const requests = standard.limit > 0 ? standard : standardAlt.limit > 0 ? standardAlt : standard;

  const ai = pickUsageSlice(usage, 'ai_requests');
  const aiAlt = pickUsageSlice(usage, 'ai');
  const aiRequests = ai.limit > 0 ? ai : aiAlt.limit > 0 ? aiAlt : ai;

  const periodEnd = usage?.period?.end ?? usage?.period?.reset_at ?? usage?.billing_period?.end;

  return (
    <VStack space="md" className="bg-background-0 flex-1">
      <CustomHeader
        variant="general"
        title="Settings & Usage"
        locationName={locationLabel || 'Your location'}
        temperature={currTemp}
        feelsLike={feelsLike}
        conditionText={conditionText}
        conditionIconUrl={getWeatherImage(current?.current?.condition, current?.current?.weather_code)}
        weatherCondition={conditionText}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator color="#b68cd4" style={{ marginVertical: 24 }} />
        ) : null}

        {!loading && !error && (
          <VStack className="px-4 mt-2" space="xl">
            <VStack space="md">
              <Text className="font-dm-sans-bold text-typography-900 text-lg">Account Info</Text>
              <RedirectCard title={`Plan: ${usage?.plan ?? treesQuota?.plan ?? 'Free'}`} icon={Key} />
              <RedirectCard title={`Resets: ${formatDate(periodEnd ?? treesQuota?.resets_at)}`} icon={Database} />
              
              <Pressable 
                className="bg-primary-500 rounded-xl py-3 px-4 mt-2 items-center" 
                onPress={() => navigation.navigate('Pricing')}
              >
                <Text className="font-dm-sans-bold text-white text-base">Upgrade Plan</Text>
              </Pressable>
            </VStack>

            <VStack space="md">
              <Text className="font-dm-sans-bold text-typography-900 text-lg">API Quotas</Text>
              <QuotaBadge
                label="Standard API requests"
                icon={Database}
                remaining={Math.max(0, requests.limit - requests.used)}
                limit={requests.limit}
              />
              <QuotaBadge
                label="AI summaries"
                icon={Zap}
                remaining={Math.max(0, aiRequests.limit - aiRequests.used)}
                limit={aiRequests.limit}
              />
              {treesQuota ? (
                <QuotaBadge
                  label="Tree analyses"
                  icon={Camera}
                  remaining={treesQuota.remaining}
                  limit={treesQuota.limit}
                />
              ) : null}
            </VStack>

            <VStack space="md">
              <Text className="font-dm-sans-bold text-typography-900 text-lg">Theme Preferences</Text>
              <HStack space="sm">
                <ThemeCard
                  title="Light Mode"
                  icon={SunIcon}
                  onPress={() => setColorMode("light")}
                  active={colorMode === "light"}
                />
                <ThemeCard
                  title="Dark Mode"
                  icon={MoonIcon}
                  onPress={() => setColorMode("dark")}
                  active={colorMode === "dark"}
                />
              </HStack>
            </VStack>
          </VStack>
        )}
      </ScrollView>
    </VStack>
  );
}
