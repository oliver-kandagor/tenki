import { StyleSheet, Text, View } from 'react-native';

import { type } from '@/theme/typography';
import { space } from '@/theme/tokens';

interface IntroSlideProps {
  title: string;
  body: string;
}

export function IntroSlide({ title, body }: IntroSlideProps) {
  return (
    <View style={styles.wrap}>
      <Text style={type.hero}>{title}</Text>
      <Text style={[type.body, styles.body]}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: space['3xl'],
  },
  body: {
    marginTop: space.lg,
    opacity: 0.92,
  },
});
