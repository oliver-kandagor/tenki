import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { type } from '@/theme/typography';
import { space } from '@/theme/tokens';

interface GoogleAuthStubProps {
  onContinue: () => void;
  loading?: boolean;
}

export function GoogleAuthStub({ onContinue, loading }: GoogleAuthStubProps) {
  return (
    <View style={styles.wrap}>
      <Text style={type.title}>Sign in to save your plan</Text>
      <Text style={[type.body, styles.sub]}>
        Use Google so your activities, alerts, and places stay on this device. Dev build uses a
        tap-to-continue stub — no real OAuth yet.
      </Text>
      <PrimaryButton
        label={loading ? 'Signing in…' : 'Continue with Google'}
        onPress={onContinue}
        disabled={loading}
        style={styles.btn}
      />
      <Text style={type.caption}>Tap once to continue in development.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
  },
  sub: {
    marginTop: space.md,
    marginBottom: space['2xl'],
  },
  btn: {
    marginBottom: space.lg,
  },
});
