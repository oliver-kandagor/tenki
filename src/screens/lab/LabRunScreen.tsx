import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { AppScreen } from '@/components/ui/AppScreen';
import { Card } from '@/components/ui/Card';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { TextButton } from '@/components/ui/TextButton';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Image } from 'react-native';

import { ApiError } from '@/api/client';
import { getFeatureById } from '@/features/catalog';
import { runLabFeature } from '@/features/runners';
import { useLocation } from '@/hooks/useLocation';
import { useWeatherStore } from '@/store/weatherStore';
import type { LabStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<LabStackParamList, 'LabRun'>;

export function LabRunScreen({ route, navigation }: Props) {
  const feature = getFeatureById(route.params.featureId);
  const { lat, lon, ready, loading: locationLoading } = useLocation();
  const units = useWeatherStore((s) => s.units);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [sections, setSections] = useState<{ title: string; lines: string[] }[]>([]);
  const [rawJson, setRawJson] = useState<string | null>(null);
  const [extractedIcons, setExtractedIcons] = useState<string[]>([]);
  const [showRaw, setShowRaw] = useState(false);

  // Helper to recursively find "icon", "image", "image_url" in an object
  const extractIconsFromObj = (obj: any, icons: string[] = []) => {
    if (!obj) return icons;
    if (typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        if ((key === 'icon' || key.includes('image_url') || key === 'icon_url') && typeof obj[key] === 'string') {
          icons.push(obj[key]);
        } else if (typeof obj[key] === 'object') {
          extractIconsFromObj(obj[key], icons);
        }
      });
    }
    return icons;
  };

  const run = useCallback(async () => {
    if (!feature || lat == null || lon == null) return;

    setLoading(true);
    setError(null);
    setStatusCode(null);
    setSections([]);
    setRawJson(null);

    try {
      const result = await runLabFeature(feature.id, {
        lat,
        lon,
        units,
        compareLat: route.params.compareLat,
        compareLon: route.params.compareLon,
        compareName: route.params.compareName,
      });
      setSections(result.sections);
      setRawJson(JSON.stringify(result.raw, null, 2));
      setExtractedIcons(Array.from(new Set(extractIconsFromObj(result.raw))));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setStatusCode(err.status);
      } else {
        setError(err instanceof Error ? err.message : 'Failed');
      }
    } finally {
      setLoading(false);
    }
  }, [feature, lat, lon, units, route.params]);

  useEffect(() => {
    navigation.setOptions({ title: feature?.title ?? 'Run' });
  }, [navigation, feature]);

  useEffect(() => {
    if (ready && feature) {
      void run();
    }
  }, [ready, feature, run]);

  if (!feature) {
    return (
      <AppScreen title="Unknown Feature">
        <Text style={{ color: '#fff' }}>The requested feature could not be found.</Text>
      </AppScreen>
    );
  }

  return (
    <AppScreen 
      title={feature.title} 
      subtitle={feature.endpoint}
      onRefresh={run}
      refreshing={loading}
      onBack={() => navigation.goBack()}
    >
      <VStack space="xl" className="pt-4">
        {/* Hero Emoji Icon */}
        <View style={styles.heroContainer}>
          <Text style={styles.heroEmoji}>{feature.emoji}</Text>
        </View>

        {/* Product Pitch Banner */}
        <StatusBanner 
          status="ready" 
          description={feature.productPitch} 
          title="Product Idea" 
        />

        {locationLoading || !ready ? (
          <ActivityIndicator color="#8B5CF6" style={styles.spinner} />
        ) : null}

        {error ? (
          <Card style={styles.errorCard}>
            <HStack space="md" className="items-center">
              <Feather name="alert-triangle" size={24} color="#ef4444" />
              <VStack className="flex-1">
                <Text style={styles.errorTitle}>
                  {statusCode === 403 ? 'Not on your plan' : 'Error'}
                </Text>
                <Text style={styles.errorText}>{error}</Text>
              </VStack>
            </HStack>
            {statusCode === 403 && (
              <Text style={styles.errorHint}>
                This is expected on the Free tier. Star it anyway if you want it for Pro users later!
              </Text>
            )}
            <PrimaryButton label="Retry" onPress={() => void run()} style={{ marginTop: 16 }} />
          </Card>
        ) : null}

        {/* Dynamic Data Sections */}
        {sections.map((section, idx) => (
          <Card key={section.title} style={styles.dataCard}>
            <HStack space="sm" className="items-center mb-3">
              <Feather name={idx === 0 ? "zap" : idx === 1 ? "activity" : "layers"} size={20} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </HStack>
            <VStack space="sm">
              {section.lines.map((line, i) => (
                <Text key={`${section.title}-${i}`} style={styles.line}>
                  {line}
                </Text>
              ))}
            </VStack>
          </Card>
        ))}

        {/* Display extracted API icons/images */}
        {extractedIcons.length > 0 && (
          <Card style={styles.dataCard}>
            <HStack space="sm" className="items-center mb-3">
              <Feather name="image" size={20} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>API Icons / Images</Text>
            </HStack>
            <HStack space="md" className="flex-wrap">
              {extractedIcons.map((icon, i) => (
                <View key={`icon-${i}`} style={styles.extractedIconWrapper}>
                  {icon.startsWith('http') ? (
                    <Image source={{ uri: icon }} style={styles.extractedImage} />
                  ) : (
                    <Text style={styles.extractedText}>{icon}</Text>
                  )}
                </View>
              ))}
            </HStack>
          </Card>
        )}

        {/* Raw JSON Code Block */}
        {rawJson ? (
          <VStack space="md" className="mt-4">
            <TextButton 
              label={showRaw ? 'Hide raw API response' : 'View raw API response'} 
              onPress={() => setShowRaw((v) => !v)} 
            />
            {showRaw && (
              <View style={styles.rawContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <Text style={styles.raw}>{rawJson}</Text>
                </ScrollView>
              </View>
            )}
          </VStack>
        ) : null}

        <View style={styles.bottomSpacer} />
      </VStack>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  heroEmoji: { 
    fontSize: 72, 
    textAlign: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  spinner: { marginVertical: 20 },
  errorCard: {
    borderColor: '#ef4444',
    borderWidth: 1,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  errorTitle: { fontWeight: '700', color: '#ef4444', fontSize: 18 },
  errorText: { color: '#e0e0e0', lineHeight: 20, marginTop: 4 },
  errorHint: { fontSize: 13, color: '#a0a0a0', marginTop: 12, fontStyle: 'italic' },
  dataCard: {
    backgroundColor: '#1C1C22',
    borderWidth: 1,
    borderColor: '#333',
    padding: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  line: { fontSize: 15, color: '#d0d0d0', lineHeight: 24 },
  rawContainer: {
    backgroundColor: '#000',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    padding: 16,
  },
  raw: {
    fontSize: 12,
    fontFamily: 'Menlo',
    color: '#a78bfa',
    lineHeight: 18,
  },
  extractedIconWrapper: {
    backgroundColor: '#0B0B0E',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 8,
  },
  extractedImage: {
    width: 64,
    height: 64,
    borderRadius: 4,
  },
  extractedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 40,
  }
});
