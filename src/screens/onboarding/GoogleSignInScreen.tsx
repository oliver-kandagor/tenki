import { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { GoogleAuthStub } from '@/components/ui/GoogleAuthStub';
import { OnboardingBackground } from '@/components/ui/OnboardingBackground';
import type { OnboardingStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/authStore';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'GoogleSignIn'>;

export function GoogleSignInScreen({ navigation }: Props) {
  const signInWithGoogleStub = useAuthStore((s) => s.signInWithGoogleStub);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);
    await signInWithGoogleStub();
    setLoading(false);
    navigation.navigate('Activities');
  };

  return (
    <OnboardingBackground>
      <GoogleAuthStub onContinue={handleContinue} loading={loading} />
    </OnboardingBackground>
  );
}
