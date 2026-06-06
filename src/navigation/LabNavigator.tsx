import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LabHomeScreen } from '@/screens/lab/LabHomeScreen';
import { LabRunScreen } from '@/screens/lab/LabRunScreen';
import type { LabStackParamList } from './types';

const Stack = createNativeStackNavigator<LabStackParamList>();

export function LabNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="LabHome" 
        component={LabHomeScreen} 
      />
      <Stack.Screen 
        name="LabRun" 
        component={LabRunScreen} 
        options={{ presentation: 'modal' }} 
      />
    </Stack.Navigator>
  );
}
