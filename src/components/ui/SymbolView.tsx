import React from 'react';
import { Platform, View } from 'react-native';
import { SymbolView as ExpoSymbolView } from 'expo-symbols';
import * as Lucide from 'lucide-react-native';

const MAP: Record<string, keyof typeof Lucide> = {
  'house.fill': 'Home',
  'briefcase.fill': 'Briefcase',
  'mappin.and.ellipse': 'MapPin',
  'sun.max.fill': 'Sun',
  'tree.fill': 'Trees',
  'leaf.fill': 'Leaf',
  'figure.golf': 'Activity',
  'figure.run': 'Activity',
  'chevron.left': 'ChevronLeft',
  'magnifyingglass': 'Search',
  'plus.circle.fill': 'PlusCircle',
  'mappin': 'MapPin',
  'checkmark': 'Check',
  'sparkles': 'Sparkles',
  'star.fill': 'Star',
  'star': 'Star',
};

export interface SymbolViewWrapperProps {
  name: string;
  size?: number;
  tintColor?: string;
  type?: any;
  style?: any;
}

export function SymbolView({ name, size = 24, tintColor = '#FFFFFF', ...props }: SymbolViewWrapperProps) {
  if (Platform.OS === 'ios') {
    return (
      <ExpoSymbolView
        name={name as any}
        size={size}
        tintColor={tintColor}
        {...props}
      />
    );
  }

  // Android / Web fallback
  const lucideName = MAP[name] || 'HelpCircle';
  const LucideIcon = Lucide[lucideName] as React.ComponentType<any>;

  if (!LucideIcon) {
    return <View style={{ width: size, height: size }} />;
  }

  return (
    <LucideIcon
      size={size}
      color={tintColor}
      style={props.style}
    />
  );
}
