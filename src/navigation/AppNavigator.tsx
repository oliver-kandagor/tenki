import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import BottomTabBar from '@/components/shared/bottom-tab-bar';
import { TodayScreen } from '@/screens/TodayScreen';
import { ForecastScreen } from '@/screens/ForecastScreen';
import { AlertsScreen } from '@/screens/AlertsScreen';
import { UsageNavigator } from '@/navigation/UsageNavigator';
import { TreesNavigator } from '@/navigation/TreesNavigator';
import { LabNavigator } from '@/navigation/LabNavigator';
import type { RootTabParamList } from '@/navigation/types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="today" component={TodayScreen} />
      <Tab.Screen name="forecast" component={ForecastScreen} />
      <Tab.Screen name="alerts" component={AlertsScreen} />
      <Tab.Screen name="trees" component={TreesNavigator} />
      <Tab.Screen name="usage" component={UsageNavigator} />
      <Tab.Screen name="lab" component={LabNavigator} />
    </Tab.Navigator>
  );
}
