import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, Alert, Pressable, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';

import { SaveLocationCard } from '@/components/ui/SaveLocationCard';
import { ICON_SYMBOLS } from '@/components/ui/IconSelector';
import type { OnboardingStackParamList } from '@/navigation/types';
import { useOnboardingStore } from '@/store/onboardingStore';
import { type } from '@/theme/typography';
import { colors, radius, space } from '@/theme/tokens';
import { SymbolView } from 'expo-symbols';
import { BlurView } from 'expo-blur';
import { PrimaryButton } from '@/components/ui/PrimaryButton';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Locations'>;

const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1a1824' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1824' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8d85b1' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#a78bfa' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#2a263c' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1e1b2b' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#100e16' }],
  },
];

export function LocationsScreen({ navigation }: Props) {
  const locations = useOnboardingStore((s) => s.locations);
  const upsertLocation = useOnboardingStore((s) => s.upsertLocation);
  const mapRef = useRef<MapView>(null);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [selectedCoord, setSelectedCoord] = useState<{ latitude: number; longitude: number } | null>(null);
  const [addressName, setAddressName] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const results = await Location.geocodeAsync(searchQuery);
      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        mapRef.current?.animateToRegion(newRegion);
        setSelectedCoord({ latitude, longitude });
        setEditingLocation(null);
        setAddressName(undefined);
        const reverse = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (reverse.length > 0) {
          const res = reverse[0];
          setAddressName([res.street, res.city, res.region].filter(Boolean).join(', ') || 'Unknown Location');
        }
      } else {
        Alert.alert('No results', 'Could not find that location.');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to search location.');
    }
  };

  const handleMapPress = async (e: any) => {
    const coord = e.nativeEvent.coordinate;
    setSelectedCoord(coord);
    setEditingLocation(null);
    setAddressName(undefined);
    try {
      const reverse = await Location.reverseGeocodeAsync(coord);
      if (reverse.length > 0) {
        const res = reverse[0];
        setAddressName([res.street, res.city, res.region].filter(Boolean).join(', ') || 'Unknown Location');
      }
    } catch {
      setAddressName('Unknown Location');
    }
  };

  const handleSave = (name: string, icon: any, isDefault: boolean) => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter a name for this location.');
      return;
    }
    if (!selectedCoord) return;

    upsertLocation({
      id: editingLocation ? editingLocation.id : Date.now().toString(),
      name,
      icon,
      lat: selectedCoord.latitude,
      lon: selectedCoord.longitude,
      isDefault,
    });
    
    setSelectedCoord(null);
    setEditingLocation(null);
    Alert.alert('Saved!', `${name} has been added to your locations.`);
  };

  const handleCardPress = async (item: any) => {
    if (item.lat && item.lon) {
      const coord = { latitude: item.lat, longitude: item.lon };
      mapRef.current?.animateToRegion({
        ...coord,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      setSelectedCoord(coord);
      setEditingLocation(item);
      setAddressName(undefined);
      try {
        const reverse = await Location.reverseGeocodeAsync(coord);
        if (reverse.length > 0) {
          const res = reverse[0];
          setAddressName([res.street, res.city, res.region].filter(Boolean).join(', ') || 'Unknown Location');
        }
      } catch {
        setAddressName('Unknown Location');
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        region={region}
        onPress={handleMapPress}
        customMapStyle={DARK_MAP_STYLE}
        userInterfaceStyle="dark"
        showsUserLocation
      >
        {selectedCoord && <Marker coordinate={selectedCoord} />}
      </MapView>

      <View style={styles.topBar}>
        <View style={styles.searchContainer}>
          <SymbolView name="magnifyingglass" size={20} tintColor={colors.text.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search city or address"
            placeholderTextColor={colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      {selectedCoord ? (
        <View style={styles.bottomCardContainer}>
          <SaveLocationCard 
            key={editingLocation ? editingLocation.id : 'new'}
            addressName={addressName}
            initialName={editingLocation?.name}
            initialIcon={editingLocation?.icon}
            initialIsDefault={editingLocation?.isDefault}
            onSave={handleSave} 
            onCancel={() => {
              setSelectedCoord(null);
              setEditingLocation(null);
            }} 
          />
        </View>
      ) : (
        <View style={styles.carouselContainer}>
          <Text style={[type.label, styles.carouselTitle]}>Saved Locations</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselScrollView}
          >
            {locations.map((item) => (
              <Pressable 
                key={item.id} 
                style={[styles.savedCard, item.isDefault && styles.savedCardDefaultBorder]}
                onPress={() => handleCardPress(item)}
              >
                <View style={styles.savedCardInner}>
                  <View style={styles.iconCircle}>
                    <SymbolView name={ICON_SYMBOLS[item.icon as keyof typeof ICON_SYMBOLS] ?? 'mappin'} size={24} tintColor={colors.primary.default} />
                  </View>
                  <View style={styles.savedCardText}>
                    <Text style={styles.savedCardName} numberOfLines={1}>{item.name}</Text>
                    {item.isDefault && (
                      <Text style={styles.savedCardDefault}>Default</Text>
                    )}
                  </View>
                </View>
              </Pressable>
            ))}

            <View style={styles.addCard}>
              <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={styles.addCardInner}>
                <SymbolView name="plus.circle.fill" size={32} tintColor={colors.primary.default} />
                <Text style={styles.addCardText}>Tap anywhere on map</Text>
                <Text style={styles.addCardSubtext}>to add a new location</Text>
              </View>
            </View>
          </ScrollView>
          <View style={styles.continueWrap}>
            <PrimaryButton label="Continue" onPress={() => navigation.navigate('Welcome')} />
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.root,
  },
  topBar: {
    position: 'absolute',
    top: 60, // approximate safe area
    left: space.md,
    right: space.md,
    flexDirection: 'row',
    gap: space.md,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.card,
    borderRadius: radius.pill,
    paddingHorizontal: space.md,
    height: 50,
    borderWidth: 1,
    borderColor: colors.border.subtle,
  },
  searchInput: {
    flex: 1,
    marginLeft: space.sm,
    color: colors.text.primary,
    fontSize: 16,
  },
  bottomCardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  carouselContainer: {
    position: 'absolute',
    bottom: space.xl,
    left: 0,
    right: 0,
  },
  continueWrap: {
    paddingHorizontal: space.lg,
    marginTop: space.lg,
  },
  carouselTitle: {
    marginLeft: space.md,
    marginBottom: space.sm,
    color: colors.text.primary,
  },
  carouselScrollView: {
    flexDirection: 'row',
    paddingHorizontal: space.md,
    gap: space.md,
  },
  addCard: {
    width: 240,
    height: 120,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border.subtle,
    borderStyle: 'dashed',
  },
  addCardInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: space.md,
  },
  addCardText: {
    ...type.bodyStrong,
    color: colors.text.primary,
    marginTop: space.sm,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
  addCardSubtext: {
    ...type.caption,
    color: '#D1D1D6', // lighter for better contrast
    marginTop: 4,
    textAlign: 'center',
    fontSize: 14,
  },
  savedCard: {
    width: 240,
    height: 120,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.surface.card,
  },
  savedCardDefaultBorder: {
    borderColor: colors.primary.default,
    borderWidth: 2,
  },
  savedCardInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: space.lg,
    gap: space.md,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedCardText: {
    flex: 1,
  },
  savedCardName: {
    ...type.title,
    color: colors.text.primary,
    fontSize: 20,
  },
  savedCardDefault: {
    ...type.bodyStrong,
    color: colors.primary.default,
    marginTop: 2,
  },
});
