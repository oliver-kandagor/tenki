import "./global.css";
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from '@/navigation/AppNavigator';
import OnboardingNavigator from '@/navigation/OnboardingNavigator';
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { ThemeContext, ThemeProvider as SourceThemeProvider } from "@/contexts/theme-context";
import { useFonts } from "expo-font";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { useAuthStore } from '@/store/authStore';
import { useOnboardingStore } from '@/store/onboardingStore';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { colors } from '@/theme/tokens';

function RootNavigator() {
  const onboardingHydrated = useOnboardingStore((s) => s.hydrated);
  const authHydrated = useAuthStore((s) => s.hydrated);
  const hasCompletedOnboarding = useOnboardingStore((s) => s.hasCompletedOnboarding);

  const ready = onboardingHydrated && authHydrated;
  
  const [fontsLoaded] = useFonts({
    "dm-sans-regular": DMSans_400Regular,
    "dm-sans-medium": DMSans_500Medium,
    "dm-sans-bold": DMSans_700Bold,
  });

  if (!ready || !fontsLoaded) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.primary.default} />
      </View>
    );
  }

  if (!hasCompletedOnboarding) {
    return <OnboardingNavigator />;
  }

  return <AppNavigator />;
}

export default function App() {
  const hydrateOnboarding = useOnboardingStore((s) => s.hydrate);
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  useEffect(() => {
    const init = async () => {
      await Promise.all([hydrateOnboarding(), hydrateAuth()]);
    };
    void init();
  }, [hydrateOnboarding, hydrateAuth]);

  return (
    <SafeAreaProvider>
      <SourceThemeProvider>
        <ThemeContext.Consumer>
          {({ colorMode }: any) => (
            <GluestackUIProvider mode={colorMode}>
              <ThemeProvider>
                <NavigationContainer>
                  <RootNavigator />
                  <StatusBar style={colorMode === "dark" ? "light" : "dark"} />
                </NavigationContainer>
              </ThemeProvider>
            </GluestackUIProvider>
          )}
        </ThemeContext.Consumer>
      </SourceThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    backgroundColor: colors.background.root,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
