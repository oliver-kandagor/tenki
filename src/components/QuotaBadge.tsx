import React from 'react';
import { View } from 'react-native';
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";

interface QuotaBadgeProps {
  label: string;
  remaining: number;
  limit: number;
  icon?: any;
}

export function QuotaBadge({ label, remaining, limit, icon }: QuotaBadgeProps) {
  const used = Math.max(0, limit - remaining);
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;

  return (
    <VStack className="p-4 bg-background-100 rounded-[18px] gap-3 flex-1 flex-col">
      <HStack className="items-center justify-between">
        <HStack className="items-center gap-3">
          {icon && (
            <Box className="p-2 bg-background-0 rounded-full items-center justify-center">
              <Icon as={icon} size="sm" className="text-primary-700" />
            </Box>
          )}
          <Text className="font-dm-sans-medium text-typography-900">{label}</Text>
        </HStack>
        <Text className="font-dm-sans-regular text-typography-600">
          {used} / {limit}
        </Text>
      </HStack>
      
      <View className="h-2 bg-background-0 rounded-full overflow-hidden w-full">
        <View 
          className="h-full bg-primary-600 rounded-full" 
          style={{ width: `${pct}%` }} 
        />
      </View>
    </VStack>
  );
}
