import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { OnboardingStackParamList } from '@/navigation/types';
import { ActivitiesScreen } from '@/screens/onboarding/ActivitiesScreen';
import { GetStartedScreen } from '@/screens/onboarding/GetStartedScreen';
import { GoogleSignInScreen } from '@/screens/onboarding/GoogleSignInScreen';
import { IntroSlidesScreen } from '@/screens/onboarding/IntroSlidesScreen';
import { LocationsScreen } from '@/screens/onboarding/LocationsScreen';
import { NotificationsScreen } from '@/screens/onboarding/NotificationsScreen';
import { UpdateFrequencyScreen } from '@/screens/onboarding/UpdateFrequencyScreen';
import { PlanScreen } from '@/screens/onboarding/PlanScreen';
import { WelcomeScreen } from '@/screens/onboarding/WelcomeScreen';
import { SuccessScreen } from '@/screens/onboarding/SuccessScreen';
import { colors } from '@/theme/tokens';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.root },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="GetStarted" component={GetStartedScreen} />
      <Stack.Screen name="IntroSlides" component={IntroSlidesScreen} />
      <Stack.Screen name="GoogleSignIn" component={GoogleSignInScreen} />
      <Stack.Screen name="Activities" component={ActivitiesScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="UpdateFrequency" component={UpdateFrequencyScreen} />
      <Stack.Screen name="Plan" component={PlanScreen} />
      <Stack.Screen name="Locations" component={LocationsScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen 
        name="Success" 
        component={SuccessScreen} 
        options={{
          presentation: 'transparentModal',
          animation: 'fade'
        }}
      />
    </Stack.Navigator>
  );
}
