import React, { useContext } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { ScrollView } from 'react-native';

import Header from '@/components/screens/weather/header';
import Tabs from '@/components/screens/weather/tabs';
import HourlyCard from '@/components/screens/weather/hourly-card';
import DaysCard from '@/components/screens/weather/days-card';
import ForeCastCard from '@/components/screens/weather/forecast-card';
import MonthlyCalendar from '@/components/screens/weather/monthly-calendar';
import Chart from '@/components/screens/weather/chart';
import { MetricTile } from '@/components/ui/MetricTile';
import { RainChanceBars } from '@/components/ui/RainChanceBars';
import { SunriseSunset } from '@/components/ui/SunriseSunset';
import { Feather } from '@expo/vector-icons';
import { AIInsightCard } from '@/components/AIInsightCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WeatherTabProvider, WeatherTabContext } from '@/contexts/weather-screen-context';
import { useWeather } from '@/hooks/useWeather';
import { getWeatherImage } from '@/utils/getWeatherImage';

function WeatherScreenContent() {
  const { current, hourly, daily } = useWeather();
  const { selectedTabIndex }: any = useContext(WeatherTabContext);

  const insets = useSafeAreaInsets();
  const MIN_HEADER_HEIGHT = 140 + insets.top;
  const MAX_HEADER_HEIGHT = 340 + insets.top;

  const scrollY = useSharedValue(0);
  const headerHeight = useSharedValue(MAX_HEADER_HEIGHT);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      headerHeight.value = Math.max(MIN_HEADER_HEIGHT, MAX_HEADER_HEIGHT - event.contentOffset.y);
    },
  });

  const condition = current?.current?.condition ?? 'Clear';



  const getFeatherIconName = (cond?: any, code?: number) => {
    const text = typeof cond === 'string' ? cond : (cond?.text ?? cond?.description ?? cond?.main ?? '');
    const c = text.toLowerCase();
    if (c.includes('thunder')) return 'cloud-lightning';
    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return 'cloud-rain';
    if (c.includes('snow')) return 'cloud-snow';
    if (c.includes('cloud') || c.includes('overcast')) return 'cloud';
    if (c.includes('clear') || c.includes('sun')) return 'sun';
    if (c.includes('night') || c.includes('moon')) return 'moon';

    if (code != null) {
      if (code === 0) return 'sun';
      if (code <= 3) return 'cloud';
      if (code <= 48) return 'cloud';
      if (code <= 67) return 'cloud-rain';
      if (code <= 77) return 'cloud-snow';
      if (code <= 82) return 'cloud-rain';
      if (code <= 86) return 'cloud-snow';
      if (code <= 99) return 'cloud-lightning';
    }

    return 'cloud';
  };

  // Helper variables for widgets
  const todayDaily = daily?.[0] || {};
  const windSpeed = current?.current?.wind_speed_10m ?? current?.current?.wind_speed ?? 0;
  const pressure = current?.current?.surface_pressure ?? current?.current?.pressure ?? 0;
  const uvIndex = todayDaily.uv_index_max ?? todayDaily.uvi ?? 0;
  const rainChance = todayDaily.precipitation_probability_max ?? todayDaily.pop ?? 0;

  const rainBars = (hourly || []).slice(0, 4).map(h => {
    const timeStr = h.time ?? h.datetime ?? h.hour ?? '';
    const displayTime = timeStr.includes(' ') 
      ? timeStr.split(' ')[1] 
      : timeStr.includes('T') 
        ? timeStr.split('T')[1].substring(0, 5) 
        : timeStr;
    return {
      time: displayTime,
      chance: h.precipitation_probability ?? h.pop ?? 0
    };
  });

  const formatSunTime = (isoTime: string) => {
    if (!isoTime) return '--:--';
    const date = new Date(isoTime);
    if (isNaN(date.getTime())) return isoTime.split('T')[1]?.substring(0, 5) || isoTime;
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0B0B0E' }}>
      <Animated.View style={[{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }, { height: headerHeight as any }]}>
        <Header height={headerHeight as any} weatherCondition={condition} weatherCode={current?.current?.weather_code} />
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: MAX_HEADER_HEIGHT, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <AIInsightCard summary={current?.aiSummary ?? null} />
        <Tabs />
        
        {selectedTabIndex === 0 && (
          <VStack className="px-4 gap-4 pb-10 mt-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 8 }}>
              <HStack className="gap-4">
                {hourly?.slice(0, 24).map((h, i) => {
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
                      temperature={Math.round(h.temperature ?? h.temp ?? 0)}
                      imgUrl={getWeatherImage(cond, h.weather_code)}
                    />
                  );
                })}
              </HStack>
            </ScrollView>

            <Chart />

            <HStack className="gap-4">
              <MetricTile metric="wind" label="Wind speed" value={`${windSpeed} km/h`} />
              <MetricTile metric="rain" label="Rain chance" value={`${rainChance}%`} />
            </HStack>
            <HStack className="gap-4 mt-2">
              <MetricTile metric="pressure" label="Pressure" value={`${pressure} hpa`} />
              <MetricTile metric="temp" label="UV Index" value={`${uvIndex}`} />
            </HStack>

            <View style={{ backgroundColor: '#1C1C22', borderRadius: 16, padding: 16, marginTop: 8 }}>
              <RainChanceBars title="Chance of rain" bars={rainBars} />
            </View>

            <View style={{ marginTop: 8 }}>
              <SunriseSunset 
                sunrise={formatSunTime(todayDaily.sunrise)} 
                sunset={formatSunTime(todayDaily.sunset)} 
              />
            </View>

          </VStack>
        )}

        {selectedTabIndex === 1 && (
          <VStack className="px-4 gap-4 pb-10 mt-4">
            {daily?.slice(0, 10).map((day, i) => (
              <DaysCard
                key={i}
                name={day.date ?? ''}
                weather={typeof day.condition === 'string' ? day.condition : (day.condition as any)?.text ?? day.description ?? 'Clear'}
                highest={Math.round(day.max_temp ?? day.temp_max ?? 0)}
                lowest={Math.round(day.min_temp ?? day.temp_min ?? 0)}
                imgUrl={getWeatherImage(day.condition ?? day.description, day.weather_code)}
              />
            ))}
          </VStack>
        )}

        {selectedTabIndex === 2 && (
          <VStack className="px-4 gap-4 pb-10 mt-4">
             <MonthlyCalendar daily={daily || []} getWeatherImage={getWeatherImage} />
          </VStack>
        )}
      </Animated.ScrollView>
    </View>
  );
}

export function WeatherScreen() {
  return (
    <WeatherTabProvider>
      <WeatherScreenContent />
    </WeatherTabProvider>
  );
}
