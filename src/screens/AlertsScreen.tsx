import { StyleSheet, View, Text, ScrollView, RefreshControl } from 'react-native';
import * as Haptics from 'expo-haptics';

import CustomHeader from "@/components/shared/custom-header";
import { ReminderCard } from '@/components/ui/ReminderCard';
import { Card } from '@/components/ui/Card';
import { useRemindersStore } from '@/store/remindersStore';
import { space } from '@/theme/tokens';
import { type } from '@/theme/typography';
import { colors } from '@/theme/tokens';
import LocationCard from '@/components/screens/location/location-card';
import { useWeather } from '@/hooks/useWeather';
import { useLocationStore } from '@/store/locationStore';
import { getWeatherImage } from '@/utils/getWeatherImage';

const leadTimeLabels = {
  now: 'Right now',
  '15min': '15 mins before',
  '30min': '30 mins before',
  '1hour': '1 hour before',
  '2hour': '2 hours before',
  '6hour': '6 hours before',
  '1day': '1 day before',
};

export function AlertsScreen() {
  const enabled = useRemindersStore((s) => s.enabled);
  const leadTimes = useRemindersStore((s) => s.leadTimes);
  const history = useRemindersStore((s) => s.history);
  const toggleReminder = useRemindersStore((s) => s.toggleReminder);
  const setLeadTime = useRemindersStore((s) => s.setLeadTime);

  const { current } = useWeather();
  const locationLabel = useLocationStore((s) => s.locationLabel);

  const currTemp = Math.round(current?.current?.temperature ?? current?.current?.temp ?? 0);
  const conditionText = typeof current?.current?.condition === 'string' ? current?.current?.condition : current?.current?.condition?.text ?? 'Clear';
  const feelsLike = Math.round(current?.current?.feels_like ?? current?.current?.feelslike_c ?? currTemp);

  const handleToggle = (key: 'rain' | 'flood' | 'wind' | 'frost' | 'dry_window') => {
    toggleReminder(key);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleLeadTimePress = (type: 'rain' | 'flood' | 'wind' | 'frost' | 'dry_window') => {
    const times = ['now', '15min', '30min', '1hour', '2hour', '6hour', '1day'] as const;
    const currentIndex = times.indexOf(leadTimes[type]);
    const nextIndex = (currentIndex + 1) % times.length;
    setLeadTime(type, times[nextIndex]);
    Haptics.selectionAsync();
  };

  return (
    <View style={{ flex: 1 }} className="bg-background-0">
      <CustomHeader
        variant="general"
        title="Alerts"
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
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <ReminderCard
            title="Rain reminder"
            description="Tell me when to grab my umbrella"
            iconName="cloud-rain"
            enabled={enabled.rain}
            leadTime={leadTimeLabels[leadTimes.rain]}
            onToggle={() => handleToggle('rain')}
            onLeadTimePress={() => handleLeadTimePress('rain')}
          />
          <ReminderCard
            title="Heavy rain & floods"
            description="Tell me when it's too wet outside"
            iconName="alert-triangle"
            enabled={enabled.flood}
            leadTime={leadTimeLabels[leadTimes.flood]}
            onToggle={() => handleToggle('flood')}
            onLeadTimePress={() => handleLeadTimePress('flood')}
          />
          <ReminderCard
            title="Strong wind"
            description="Tell me when hats fly away"
            iconName="wind"
            enabled={enabled.wind}
            leadTime={leadTimeLabels[leadTimes.wind]}
            onToggle={() => handleToggle('wind')}
            onLeadTimePress={() => handleLeadTimePress('wind')}
          />
          <ReminderCard
            title="Cold morning"
            description="Tell me when to wear a warm coat"
            iconName="thermometer"
            enabled={enabled.frost}
            leadTime={leadTimeLabels[leadTimes.frost]}
            onToggle={() => handleToggle('frost')}
            onLeadTimePress={() => handleLeadTimePress('frost')}
          />
          <ReminderCard
            title="Dry time"
            description="Tell me the best time to go outside"
            iconName="sun"
            enabled={enabled.dry_window}
            leadTime={leadTimeLabels[leadTimes.dry_window]}
            onToggle={() => handleToggle('dry_window')}
            onLeadTimePress={() => handleLeadTimePress('dry_window')}
          />
        </View>

        {/* Recent History */}
        {history.length > 0 && (
          <View style={[styles.section, { marginTop: space['2xl'] }]}>
            <Text style={type.section}>Recent alerts</Text>
            <ScrollView style={{ marginTop: space.md }}>
              {history.slice(0, 5).map((item) => (
                <Card key={item.id} style={styles.historyCard}>
                  <View style={styles.historyContent}>
                    <Text style={type.bodyStrong}>{item.type}</Text>
                    <Text style={[type.caption, { color: colors.text.muted }]}>
                      {new Date(item.triggeredAt).toLocaleTimeString()}
                    </Text>
                  </View>
                  <Text style={[type.caption, { color: colors.text.secondary, flex: 1 }]}>
                    {item.message}
                  </Text>
                </Card>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Saved Locations from LocationCard */}
        <View style={[styles.section, { marginTop: space['2xl'], paddingBottom: 100 }]}>
          <Text style={type.section}>Saved locations</Text>
          <View style={{ marginTop: space.md, gap: 16 }}>
            <LocationCard
              id={1}
              name="Tokyo"
              time="10:30 AM"
              temperature={22}
              weather="Partly Cloudy"
              AQI={45}
              wind="12km/h"
              highest={25}
              lowest={18}
              isSelected={true}
              setSelectedCard={() => {}}
            />
            <LocationCard
              id={2}
              name="New York"
              time="8:30 PM"
              temperature={14}
              weather="Clear"
              AQI={30}
              wind="8km/h"
              highest={16}
              lowest={10}
              isSelected={false}
              setSelectedCard={() => {}}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: space.md,
  },
  historyCard: {
    marginBottom: space.md,
    padding: space.md,
  },
  historyContent: {
    marginBottom: space.sm,
  },
});
