import React, { useState, useCallback } from 'react';
import { ScrollView, RefreshControl, View, Text } from 'react-native';
import Animated, { FadeInDown } from "react-native-reanimated";
import { VStack } from "@/components/ui/vstack";
import CustomHeader from "@/components/shared/custom-header";

import { AppScreen } from '@/components/ui/AppScreen';
import DaysCard from '@/components/screens/weather/days-card';
import MonthlyCalendar from '@/components/screens/weather/monthly-calendar';
import { useWeather } from '@/hooks/useWeather';
import { useLocationStore } from '@/store/locationStore';
import { type } from '@/theme/typography';
import { space } from '@/theme/tokens';
import { getHeroImage } from '@/utils/heroImageMap';
import { getWeatherImage } from '@/utils/getWeatherImage';

export function ForecastScreen() {
  const { current, daily, loading, error, refreshForecast } = useWeather();
  const locationLabel = useLocationStore((s) => s.locationLabel);
  const [refreshing, setRefreshing] = useState(false);

  const AnimatedVStack = Animated.createAnimatedComponent(VStack);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshForecast(true);
    } finally {
      setRefreshing(false);
    }
  }, [refreshForecast]);

  const isLoading = loading && !daily;



  const currTemp = Math.round(current?.current?.temperature ?? current?.current?.temp ?? 0);
  const conditionText = current?.current?.condition ?? current?.current?.description ?? 'Clear';
  const feelsLike = Math.round(current?.current?.feels_like ?? current?.current?.feelslike_c ?? currTemp);

  return (
    <View style={{ flex: 1 }} className="bg-background-0">
      <CustomHeader
        variant="general"
        title="Forecast"
        locationName={locationLabel || 'Your location'}
        temperature={currTemp}
        feelsLike={feelsLike}
        conditionText={conditionText}
        conditionIconUrl={getWeatherImage(current?.current?.condition, current?.current?.weather_code)}
        weatherCondition={conditionText}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#8B5CF6" />}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingTop: 16 }}>
          <MonthlyCalendar daily={daily || []} getWeatherImage={getWeatherImage} />

          {isLoading && <Text className="font-dm-sans-medium text-typography-900">Loading forecast...</Text>}
          {error && <Text className="font-dm-sans-medium text-red-500">{error}</Text>}
          
          {daily && daily.length > 0 && (
            <AnimatedVStack space="md" className="pb-5 mt-4">
              {daily.slice(0, 10).map((day, index) => {
                return (
                  <Animated.View
                    key={index}
                    entering={FadeInDown.delay(index * 100)}
                  >
                    <DaysCard
                      name={day.date ?? ''}
                      weather={typeof day.condition === 'string' ? day.condition : (day.condition as any)?.text ?? day.description ?? 'Clear'}
                      highest={Math.round(day.max_temp ?? day.temp_max ?? 0)}
                      lowest={Math.round(day.min_temp ?? day.temp_min ?? 0)}
                      imgUrl={getWeatherImage(day.condition ?? day.description, day.weather_code)}
                    />
                  </Animated.View>
                );
              })}
            </AnimatedVStack>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
