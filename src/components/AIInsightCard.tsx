import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';

interface AIInsightCardProps {
  summary: string | null;
}

export function AIInsightCard({ summary }: AIInsightCardProps) {
  if (!summary) return null;

  return (
    <View style={{ marginHorizontal: 16, marginTop: 16, marginBottom: 8, padding: 16, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
      <HStack className="items-center mb-2 gap-2">
        <Feather name="cpu" size={20} color="#b68cd4" />
        <Text className="text-primary-800 font-bold text-base" style={{ color: '#b68cd4' }}>
          WeatherAI Companion
        </Text>
      </HStack>
      <Text className="text-white text-sm leading-5 opacity-90">
        {summary}
      </Text>
    </View>
  );
}
