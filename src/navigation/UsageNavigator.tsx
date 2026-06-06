// Force metro reload
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UsageScreen } from '@/screens/UsageScreen';
import { PricingScreen } from '@/screens/PricingScreen';
import type { UsageStackParamList } from '@/navigation/types';

const Stack = createNativeStackNavigator<UsageStackParamList>();

export function UsageNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UsageHome" component={UsageScreen} />
      <Stack.Screen name="Pricing" component={PricingScreen} />
    </Stack.Navigator>
  );
}
