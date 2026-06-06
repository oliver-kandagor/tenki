import React from 'react';
import { ScrollView, Pressable, View } from 'react-native';
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Check, ArrowLeft } from "lucide-react-native";
import { useNavigation } from '@react-navigation/native';

function PricingCard({ 
  title, 
  price, 
  features, 
  isPopular = false,
  onPress 
}: { 
  title: string, 
  price: string, 
  features: string[], 
  isPopular?: boolean,
  onPress: () => void 
}) {
  return (
    <View className={`p-5 rounded-2xl border ${isPopular ? 'bg-primary-500/10 border-primary-500' : 'bg-background-0 border-background-200'} mb-4`}>
      {isPopular && (
        <View className="bg-primary-500 self-start px-3 py-1 rounded-full mb-3">
          <Text className="text-white text-xs font-dm-sans-bold">MOST POPULAR</Text>
        </View>
      )}
      
      <Text className="font-dm-sans-bold text-typography-900 text-2xl">{title}</Text>
      <HStack className="items-baseline mt-2 mb-4">
        <Text className="font-dm-sans-bold text-typography-900 text-4xl">{price}</Text>
        <Text className="font-dm-sans-regular text-typography-500 ml-1">/mo</Text>
      </HStack>
      
      <VStack space="md" className="mb-6">
        {features.map((feature, i) => (
          <HStack key={i} space="sm" className="items-center">
            <View className="bg-primary-500/20 p-1 rounded-full">
              <Icon as={Check} size="sm" className="text-primary-500" />
            </View>
            <Text className="font-dm-sans-medium text-typography-700 flex-1">{feature}</Text>
          </HStack>
        ))}
      </VStack>
      
      <Pressable 
        className={`py-3.5 rounded-xl items-center ${isPopular ? 'bg-primary-500' : 'bg-background-900'}`}
        onPress={onPress}
      >
        <Text className={`font-dm-sans-bold text-base ${isPopular ? 'text-white' : 'text-background-0'}`}>
          Choose {title}
        </Text>
      </Pressable>
    </View>
  );
}

export function PricingScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-background-0">
      <HStack className="pt-16 pb-4 px-4 items-center bg-background-0 z-10">
        <Pressable 
          className="p-2 mr-2 bg-background-50 rounded-full" 
          onPress={() => navigation.goBack()}
        >
          <Icon as={ArrowLeft} size="md" className="text-typography-900" />
        </Pressable>
        <Text className="font-dm-sans-bold text-typography-900 text-xl flex-1 text-center pr-10">
          Upgrade Plan
        </Text>
      </HStack>
      
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <VStack className="items-center mb-8 mt-2">
          <Text className="font-dm-sans-bold text-typography-900 text-3xl text-center mb-2">
            Unlock the full power of Tenki
          </Text>
          <Text className="font-dm-sans-regular text-typography-500 text-center text-base px-4">
            Get premium AI features, longer forecasts, and more farm analyses.
          </Text>
        </VStack>

        <PricingCard 
          title="Free"
          price="$0"
          features={[
            "1,000 API requests / month",
            "200 AI summaries / month",
            "5 Tree analyses / month",
            "Basic hourly & daily forecasts"
          ]}
          onPress={() => {}}
        />

        <PricingCard 
          title="Pro"
          price="$9.99"
          isPopular={true}
          features={[
            "Unlimited API requests",
            "Unlimited AI summaries",
            "50 Tree analyses / month",
            "Extended 14-day forecasts",
            "Priority reminders & alerts"
          ]}
          onPress={() => {}}
        />
        
        <PricingCard 
          title="Farm"
          price="$29.99"
          features={[
            "Everything in Pro",
            "Unlimited Tree analyses",
            "Historical farm insights export",
            "Dedicated weather tracking for specific plots"
          ]}
          onPress={() => {}}
        />
      </ScrollView>
    </View>
  );
}
