import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TreesScreen } from '@/screens/TreesScreen';
import { HistoryScreen } from '@/screens/HistoryScreen';
import { AnalysisDetailScreen } from '@/screens/AnalysisDetailScreen';
import type { TreesStackParamList } from '@/navigation/types';

const Stack = createNativeStackNavigator<TreesStackParamList>();

export function TreesNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TreesHome" component={TreesScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="AnalysisDetail" component={AnalysisDetailScreen} />
    </Stack.Navigator>
  );
}
