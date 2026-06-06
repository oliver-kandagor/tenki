import React, { useEffect, useState, useCallback } from "react";
import { ScrollView, StyleSheet, View, RefreshControl } from 'react-native';
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Icon, ClockIcon } from "@/components/ui/icon";
import { CloudRain, Wind, CloudRainWind, Waves, Sunrise, Sunset } from "lucide-react-native";
import { SunIcon } from "@/components/ui/icon";
import Animated, { FadeInDown } from "react-native-reanimated";

import HourlyCard from "@/components/screens/weather/hourly-card";
import ForeCastCard from "@/components/screens/weather/forecast-card";
import RainCard from "@/components/screens/weather/rain-card";
import Chart from "@/components/screens/weather/chart";

import CustomHeader from "@/components/shared/custom-header";
import { AppScreen } from '@/components/ui/AppScreen';
import { InsightRow } from '@/components/ui/InsightRow';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { useWeather } from '@/hooks/useWeather';
import { useLocationStore } from '@/store/locationStore';
import { getHeroImage } from '@/utils/heroImageMap';
import { getOutdoorStatus } from '@/utils/outdoorStatus';
import { analyzeRainWindow } from '@/utils/hourlyInsights';
import { getWeatherImage } from '@/utils/getWeatherImage';

export function TodayScreen() {
  const locationLabel = useLocationStore((s) => s.locationLabel);
  const { current, hourly, daily, loading, error, ready, refreshCurrent, refreshForecast } = useWeather();
  const [refreshing, setRefreshing] = useState(false);

  const AnimatedVStack = Animated.createAnimatedComponent(VStack);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refreshCurrent(true), refreshForecast(true)]);
    } finally {
      setRefreshing(false);
    }
  }, [refreshCurrent, refreshForecast]);

  if (loading || (ready && !current && !error)) {
    return (
      <AppScreen title="Today" subtitle={locationLabel || 'Loading...'}>
        <Text>Loading...</Text>
      </AppScreen>
    );
  }

  if (error || !current) {
    return (
      <AppScreen title="Today" subtitle={locationLabel || 'Unknown Location'}>
        <Text style={{ marginTop: 20, color: 'white' }}>{error || 'Unable to load weather.'}</Text>
      </AppScreen>
    );
  }

  const statusResult = getOutdoorStatus(current.current, hourly ?? undefined, current.aiSummary);

  let bestWindowText = 'All day looks fine';
  if (hourly && hourly.length > 0) {
    const analysis = analyzeRainWindow(hourly);
    if (analysis.dryStreaks.length > 0) {
      const best = analysis.dryStreaks[0];
      bestWindowText = `${best.start} - ${best.end}`;
    } else if (analysis.rainyHours.length > 0) {
      bestWindowText = 'Rainy most of the day';
    }
  }

  const currTemp = Math.round(current.current.temperature ?? current.current.temp ?? 0);
  const currWind = Math.round(current.current.wind_speed ?? 0);
  const currPress = Math.round(current.current.pressure ?? current.current.surface_pressure ?? 1000);
  
  const todayDaily = daily?.[0] || {};
  const rainChance = todayDaily.precipitation_probability ?? todayDaily.precipitation_probability_max ?? todayDaily.pop ?? 0;
  const uvIndex = todayDaily.uv_index_max ?? todayDaily.uvi ?? 0;

  const WindAndPrecipitationData = [
    {
      id: 1,
      icon: Wind,
      text: "Wind speed",
      currentUpdate: `${currWind} km/h`,
      lastUpdate: current.current.wind_direction ?? "N/A",
      arrowDownIcon: true,
      arrowUpIcon: false,
    },
    {
      id: 2,
      icon: CloudRainWind,
      text: "Rain chance",
      currentUpdate: `${rainChance}%`,
      lastUpdate: "Today",
      arrowDownIcon: false,
      arrowUpIcon: true,
    },
  ];

  const PressureAndUVIndexData = [
    {
      id: 3,
      icon: Waves,
      text: "Pressure",
      currentUpdate: `${currPress} hPa`,
      lastUpdate: "Surface",
      arrowDownIcon: false,
      arrowUpIcon: true,
    },
    {
      id: 4,
      icon: SunIcon,
      text: "UV Index",
      currentUpdate: `${uvIndex}`,
      lastUpdate: "Max",
      arrowDownIcon: true,
      arrowUpIcon: false,
    },
  ];



  const formatSunTime = (isoTime: string) => {
    if (!isoTime) return '--:--';
    const date = new Date(isoTime);
    if (isNaN(date.getTime())) return isoTime.split('T')[1]?.substring(0, 5) || isoTime;
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const SunriseAndSunsetData = [
    {
      id: 5,
      icon: Sunrise,
      text: "Sunrise",
      currentUpdate: formatSunTime(todayDaily.sunrise),
      lastUpdate: "AM",
    },
    {
      id: 6,
      icon: Sunset,
      text: "Sunset",
      currentUpdate: formatSunTime(todayDaily.sunset),
      lastUpdate: "PM",
    },
  ];

  const conditionText = current.current.condition ?? current.current.description ?? 'Clear';
  const feelsLike = Math.round(current.current.feels_like ?? current.current.feelslike_c ?? currTemp);

  return (
    <View style={{ flex: 1, backgroundColor: '#0B0B0E' }}>
      <CustomHeader
        variant="general"
        title="Settings & Usage"
        locationName={locationLabel || 'Your location'}
        temperature={currTemp}
        feelsLike={feelsLike}
        conditionText={conditionText}
        conditionIconUrl={getWeatherImage(current.current.condition, current.current.weather_code)}
        weatherCondition={conditionText}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#8B5CF6" />}
        showsVerticalScrollIndicator={false}
      >
        <StatusBanner
          status={statusResult.status}
          title={statusResult.title}
          description={statusResult.description}
          style={{ marginBottom: 24 }}
        />

        <View style={{ marginBottom: 24 }}>
          <InsightRow
            title="Best window"
            value={bestWindowText}
          />
        </View>

        <VStack space="md" className="pb-5 bg-transparent">
          <AnimatedVStack space="md">
            <Animated.View entering={FadeInDown.delay(0 * 100).duration(500)}>
              <HStack space="md">
                {WindAndPrecipitationData.map((card: any) => (
                  <HourlyCard
                    key={card.id}
                    icon={card.icon}
                    text={card.text}
                    currentUpdate={card.currentUpdate}
                    lastUpdate={card.lastUpdate}
                    arrowDownIcon={card.arrowDownIcon}
                    arrowUpIcon={card.arrowUpIcon}
                  />
                ))}
              </HStack>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(1 * 100).duration(500)}>
              <HStack space="md">
                {PressureAndUVIndexData.map((card: any) => (
                  <HourlyCard
                    key={card.id}
                    icon={card.icon}
                    text={card.text}
                    currentUpdate={card.currentUpdate}
                    lastUpdate={card.lastUpdate}
                    arrowDownIcon={card.arrowDownIcon}
                    arrowUpIcon={card.arrowUpIcon}
                  />
                ))}
              </HStack>
            </Animated.View>
          </AnimatedVStack>

          {/* ---------------------------- Hourly forecast ---------------------------- */}
          {hourly && hourly.length > 0 && (
            <VStack className="py-3 rounded-2xl bg-background-100 gap-3 p-3 mt-4">
              <HStack className="gap-2 items-center">
                <Box className="h-7 w-7 bg-background-50 items-center justify-center rounded-full">
                  <Icon as={ClockIcon} className="text-typography-400" size="sm" />
                </Box>
                <Text className="font-dm-sans-regular text-typography-400">
                  Hourly forecast
                </Text>
              </HStack>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 32, paddingHorizontal: 12 }}
              >
                {hourly.slice(0, 24).map((h, i) => {
                  const cond = h.condition ?? h.description;
                  const timeStr = h.time ?? h.datetime ?? h.hour ?? '';
                  const displayTime = timeStr.includes(' ') 
                    ? timeStr.split(' ')[1] 
                    : timeStr.includes('T') 
                      ? timeStr.split('T')[1].substring(0, 5) 
                      : timeStr;
                  return (
                    <ForeCastCard
                      key={i}
                      time={displayTime}
                      imgUrl={getWeatherImage(cond, h.weather_code)}
                      temperature={Math.round(h.temperature ?? h.temp ?? 0)}
                    />
                  );
                })}
              </ScrollView>
            </VStack>
          )}

          {/* ---------------------------- Day forecast ----------------------------- */}
          <View style={{ marginTop: 16 }}>
            <Chart />
          </View>

          {/* ---------------------------- Chance of rain ---------------------------- */}
          {hourly && hourly.length > 0 && (
            <VStack className="p-3 rounded-2xl bg-background-100 gap-3 mt-4">
              <HStack className="items-center gap-2">
                <Box className="h-7 w-7 bg-background-50 items-center justify-center rounded-full">
                  <Icon as={CloudRain} className="text-typography-400" size="sm" />
                </Box>
                <Text className="font-dm-sans-regular text-typography-400">
                  Chance of rain
                </Text>
              </HStack>

              <VStack className="justify-between px-3 gap-2.5">
                {hourly.slice(0, 4).map((h, i) => {
                  const timeStr = h.time ?? h.datetime ?? h.hour ?? '';
                  const displayTime = timeStr.includes(' ') 
                    ? timeStr.split(' ')[1] 
                    : timeStr.includes('T') 
                      ? timeStr.split('T')[1].substring(0, 5) 
                      : timeStr;
                  return (
                    <RainCard 
                      key={i} 
                      time={displayTime} 
                      value={h.precipitation_chance ?? h.pop ?? 0} 
                    />
                  );
                })}
              </VStack>
            </VStack>
          )}

          {/* ---------------------------- Sunrise and Sunset ---------------------------- */}
          {current.current && (
            <HStack space="md" className="mt-4">
              {SunriseAndSunsetData.map((card: any) => (
                <HourlyCard
                  key={card.id}
                  icon={card.icon}
                  text={card.text}
                  currentUpdate={card.currentUpdate}
                  lastUpdate={card.lastUpdate}
                />
              ))}
            </HStack>
          )}

        </VStack>
      </ScrollView>
    </View>
  );
}
