import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { OnboardingStepShell } from '@/components/ui/OnboardingStepShell';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import type { OnboardingStackParamList } from '@/navigation/types';
import { useOnboardingStore } from '@/store/onboardingStore';
import { type } from '@/theme/typography';
import { colors, radius, space } from '@/theme/tokens';
import { SymbolView } from '@/components/ui/SymbolView';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Plan'>;

const PLANS = [
  {
    id: 'free' as const,
    name: 'Free Plan',
    price: '$0',
    icon: 'sparkles',
    features: [
      '1,000 weather requests / month',
      '200 AI summaries / month',
      '5 tree analyses / month',
    ],
  },
  {
    id: 'pro' as const,
    name: 'Pro Companion',
    price: '$9.99',
    icon: 'star.fill',
    features: [
      'Unlimited weather requests',
      'Unlimited AI summaries',
      '50 tree analyses / month',
      'Extended 14-day forecasts',
    ],
    isPopular: true,
  },
  {
    id: 'farm' as const,
    name: 'Farm / Landowner',
    price: '$29.99',
    icon: 'leaf.fill',
    features: [
      'Everything in Pro',
      'Unlimited tree analyses',
      'Historical insights export',
      'Dedicated plot tracking',
    ],
  },
];

export function PlanScreen({ navigation }: Props) {
  const selectedPlan = useOnboardingStore((s) => s.selectedPlan);
  const setSelectedPlan = useOnboardingStore((s) => s.setSelectedPlan);

  const handleContinue = () => {
    navigation.navigate('Locations');
  };

  return (
    <OnboardingStepShell
      progressStep={4}
      progressTotal={6}
      title="Choose your weather companion plan"
      subtitle="Select the plan that matches your daily routine. You can change this later."
      footer={<PrimaryButton label="Continue" onPress={handleContinue} />}
    >
      <View style={styles.list}>
        {PLANS.map((plan) => {
          const selected = selectedPlan === plan.id;
          return (
            <Pressable
              key={plan.id}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setSelectedPlan(plan.id)}
              style={[
                styles.card,
                selected && styles.cardSelected,
                plan.isPopular && !selected && styles.cardPopularBorder,
              ]}
            >
              {plan.isPopular && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>RECOMMENDED</Text>
                </View>
              )}

              <View style={styles.header}>
                <View style={styles.titleArea}>
                  <SymbolView name={plan.icon} size={20} tintColor={selected ? colors.primary.default : colors.text.secondary} />
                  <Text style={[type.bodyStrong, styles.name]}>{plan.name}</Text>
                </View>
                <View style={styles.priceArea}>
                  <Text style={type.bodyStrong}>{plan.price}</Text>
                  <Text style={[type.caption, { color: colors.text.muted }]}>/mo</Text>
                </View>
              </View>

              <View style={styles.features}>
                {plan.features.map((feat, index) => (
                  <View key={index} style={styles.featureRow}>
                    <SymbolView name="checkmark" size={12} tintColor={colors.success.default} />
                    <Text style={[type.caption, styles.featureText]}>{feat}</Text>
                  </View>
                ))}
              </View>
            </Pressable>
          );
        })}
      </View>
    </OnboardingStepShell>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: space.md,
    paddingTop: space.sm,
  },
  card: {
    backgroundColor: colors.surface.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border.subtle,
    padding: space.lg,
    position: 'relative',
    gap: space.md,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: colors.border.focus,
    backgroundColor: colors.surface.cardHover,
  },
  cardPopularBorder: {
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: colors.primary.default,
    paddingHorizontal: space.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  badgeText: {
    ...type.label,
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  name: {
    color: colors.text.primary,
  },
  priceArea: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  features: {
    gap: 6,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  featureText: {
    color: colors.text.secondary,
    flex: 1,
  },
});
