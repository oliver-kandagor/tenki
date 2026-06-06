import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CustomHeader from "@/components/shared/custom-header";
import { TreeAnalysisCard } from '@/components/TreeAnalysisCard';
import { Feather } from '@expo/vector-icons';
import type { TreesStackParamList } from '@/navigation/types';
import { useTreesStore } from '@/store/treesStore';
import { useWeather } from '@/hooks/useWeather';
import { useLocationStore } from '@/store/locationStore';
import { getWeatherImage } from '@/utils/getWeatherImage';

type Props = {
  navigation: NativeStackNavigationProp<TreesStackParamList, 'TreesHome'>;
};

export function TreesScreen({ navigation }: Props) {
  const [farmerId, setFarmerId] = useState('');
  const [county, setCounty] = useState('');
  const [notes, setNotes] = useState('');

  const uploading = useTreesStore((s) => s.uploading);
  const error = useTreesStore((s) => s.error);
  const currentAnalysis = useTreesStore((s) => s.currentAnalysis);
  const analyze = useTreesStore((s) => s.analyze);
  const clearError = useTreesStore((s) => s.clearError);

  const { current } = useWeather();
  const locationLabel = useLocationStore((s) => s.locationLabel);

  const currTemp = Math.round(current?.current?.temperature ?? current?.current?.temp ?? 0);
  const conditionText = typeof current?.current?.condition === 'string' ? current?.current?.condition : current?.current?.condition?.text ?? 'Clear';
  const feelsLike = Math.round(current?.current?.feels_like ?? current?.current?.feelslike_c ?? currTemp);

  const pickImage = async (source: 'camera' | 'library') => {
    clearError();

    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera access is required to take photos.');
        return;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Photo library access is required.');
        return;
      }
    }

    const result =
      source === 'camera'
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
          });

    if (result.canceled || !result.assets[0]?.uri) {
      return;
    }

    try {
      await analyze(result.assets[0].uri, {
        farmerId: farmerId || undefined,
        county: county || undefined,
        notes: notes || undefined,
      });
    } catch {
      // Error stored in Zustand
    }
  };

  return (
    <View style={{ flex: 1 }} className="bg-background-0">
      <CustomHeader
        variant="general"
        title="Farm & Trees"
        locationName={locationLabel || 'Your location'}
        temperature={currTemp}
        feelsLike={feelsLike}
        conditionText={conditionText}
        conditionIconUrl={getWeatherImage(current?.current?.condition, current?.current?.weather_code)}
        weatherCondition={conditionText}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.content, { paddingHorizontal: 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Analysis</Text>
          <Pressable onPress={() => navigation.navigate('History')}>
            <Text style={styles.link}>History</Text>
          </Pressable>
        </View>

        <Text style={styles.hint}>
          Upload a farm image for tree count and canopy health (5 analyses/mo on Free).
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Farmer ID (optional)"
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={farmerId}
          onChangeText={setFarmerId}
        />
        <TextInput
          style={styles.input}
          placeholder="County (optional)"
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={county}
          onChangeText={setCounty}
        />
        <TextInput
          style={[styles.input, styles.notes]}
          placeholder="Notes for AI (optional)"
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <View style={styles.actions}>
          <Pressable
            style={styles.button}
            disabled={uploading}
            onPress={() => void pickImage('camera')}
          >
            <Feather name="camera" size={20} color="#fff" style={{ marginBottom: 4 }} />
            <Text style={styles.buttonText}>Camera</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonSecondary]}
            disabled={uploading}
            onPress={() => void pickImage('library')}
          >
            <Feather name="image" size={20} color="#fff" style={{ marginBottom: 4 }} />
            <Text style={styles.buttonText}>Gallery</Text>
          </Pressable>
        </View>

        {uploading ? (
          <View style={styles.uploading}>
            <ActivityIndicator color="#208AEF" />
            <Text style={styles.uploadingText}>Analyzing image…</Text>
          </View>
        ) : null}

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retry} onPress={() => void pickImage('library')}>
              <Text style={styles.buttonText}>Retry</Text>
            </Pressable>
          </View>
        ) : null}

        {currentAnalysis && !uploading ? (
          <TreeAnalysisCard analysis={currentAnalysis} />
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  link: {
    color: '#b68cd4',
    fontWeight: '600',
    fontSize: 16,
  },
  hint: {
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    fontSize: 15,
  },
  notes: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  uploading: {
    alignItems: 'center',
    padding: 20,
  },
  uploadingText: {
    marginTop: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 12,
  },
  retry: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(239,68,68,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
