import { useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { FeatureCard } from '@/components/lab/FeatureCard';
import { LAB_FEATURES, type LabFeature } from '@/features/catalog';
import { useLocationStore } from '@/store/locationStore';
import { useLabStore } from '@/store/labStore';
import type { LabStackParamList } from '@/navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<LabStackParamList, 'LabHome'>;
};

type Filter = 'all' | 'shortlist' | 'free' | 'pro' | 'agri';

export function LabHomeScreen({ navigation }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const [pinName, setPinName] = useState('');
  const [pinLat, setPinLat] = useState('');
  const [pinLon, setPinLon] = useState('');

  const shortlist = useLabStore((s) => s.shortlist);
  const pins = useLabStore((s) => s.pins);
  const hydrate = useLabStore((s) => s.hydrate);
  const toggleShortlist = useLabStore((s) => s.toggleShortlist);
  const addPin = useLabStore((s) => s.addPin);
  const removePin = useLabStore((s) => s.removePin);

  const lat = useLocationStore((s) => s.lat);
  const lon = useLocationStore((s) => s.lon);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const filtered = useMemo(() => {
    let list: LabFeature[] = LAB_FEATURES;
    if (filter === 'shortlist') {
      list = list.filter((f) => shortlist.includes(f.id));
    } else if (filter === 'free') {
      list = list.filter((f) => f.plan === 'free');
    } else if (filter === 'pro') {
      list = list.filter((f) => f.plan === 'pro');
    } else if (filter === 'agri') {
      list = list.filter((f) => f.category === 'agri');
    }
    return list;
  }, [filter, shortlist]);

  const openFeature = (featureId: string, extra?: { compareLat?: number; compareLon?: number; compareName?: string }) => {
    navigation.navigate('LabRun', { featureId, ...extra });
  };

  const savePin = () => {
    const plat = parseFloat(pinLat);
    const plon = parseFloat(pinLon);
    if (!pinName.trim() || Number.isNaN(plat) || Number.isNaN(plon)) return;
    void addPin(pinName.trim(), plat, plon);
    setPinName('');
    setPinLat('');
    setPinLon('');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>API Lab</Text>
        <Text style={styles.subtitle}>
          Try creative WeatherAI ideas. Star ★ the ones you want in the real app — Pro
          features show a friendly error on Free plans.
        </Text>

        <View style={styles.filters}>
          {(['all', 'shortlist', 'free', 'pro', 'agri'] as Filter[]).map((f) => (
            <Pressable
              key={f}
              style={[styles.chip, filter === f && styles.chipOn]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.chipText, filter === f && styles.chipTextOn]}>
                {f === 'agri' ? 'Agri' : f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {filtered.map((feature) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            shortlisted={shortlist.includes(feature.id)}
            onPress={() => openFeature(feature.id)}
            onToggleShortlist={() => void toggleShortlist(feature.id)}
          />
        ))}

        <Text style={styles.sectionTitle}>Saved pins (for Twin Cities)</Text>
        <Text style={styles.hint}>
          GPS: {lat != null && lon != null ? `${lat.toFixed(4)}, ${lon.toFixed(4)}` : 'waiting…'}
        </Text>
        {pins.map((p) => (
          <View key={p.id} style={styles.pinRow}>
            <Pressable
              style={styles.pinInfo}
              onPress={() =>
                openFeature('twin-cities', {
                  compareLat: p.lat,
                  compareLon: p.lon,
                  compareName: p.name,
                })
              }
            >
              <Text style={styles.pinName}>{p.name}</Text>
              <Text style={styles.pinCoords}>
                {p.lat.toFixed(4)}, {p.lon.toFixed(4)} — tap to compare
              </Text>
            </Pressable>
            <Pressable onPress={() => void removePin(p.id)}>
              <Text style={styles.remove}>✕</Text>
            </Pressable>
          </View>
        ))}
        <TextInput
          style={styles.input}
          placeholder="Pin name (e.g. Bomet co-op)"
          value={pinName}
          onChangeText={setPinName}
        />
        <View style={styles.pinInputs}>
          <TextInput
            style={[styles.input, styles.half]}
            placeholder="Lat"
            value={pinLat}
            onChangeText={setPinLat}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.half]}
            placeholder="Lon"
            value={pinLon}
            onChangeText={setPinLon}
            keyboardType="numeric"
          />
        </View>
        <Pressable style={styles.addPin} onPress={savePin}>
          <Text style={styles.addPinText}>Save pin</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0B0B0E' },
  content: { padding: 16, paddingBottom: 40 },
  heading: { fontSize: 26, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 14, color: '#a0a0a0', marginTop: 8, marginBottom: 16, lineHeight: 20 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#1C1C22',
    borderWidth: 1,
    borderColor: '#333',
  },
  chipOn: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  chipText: { fontSize: 13, color: '#a0a0a0' },
  chipTextOn: { color: '#fff', fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 24, marginBottom: 8, color: '#fff' },
  hint: { fontSize: 13, color: '#888', marginBottom: 10 },
  pinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C22',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  pinInfo: { flex: 1 },
  pinName: { fontWeight: '600', color: '#fff' },
  pinCoords: { fontSize: 12, color: '#888', marginTop: 2 },
  remove: { fontSize: 18, color: '#666', padding: 8 },
  input: {
    backgroundColor: '#1C1C22',
    borderWidth: 1,
    borderColor: '#333',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    fontSize: 15,
  },
  pinInputs: { flexDirection: 'row', gap: 8 },
  half: { flex: 1 },
  addPin: {
    backgroundColor: '#8B5CF6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  addPinText: { color: '#fff', fontWeight: '600' },
});
