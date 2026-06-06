import { TextStyle } from 'react-native';

import { colors } from '@/theme/tokens';

export const type = {
  hero: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34, color: colors.text.primary },
  title: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28, color: colors.text.primary },
  section: { fontSize: 17, fontWeight: '600' as const, lineHeight: 24, color: colors.text.primary },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24, color: colors.text.primary },
  bodyStrong: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24, color: colors.text.primary },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18, color: colors.text.secondary },
  label: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16, color: colors.text.secondary },
  metric: { fontSize: 32, fontWeight: '700' as const, lineHeight: 38, color: colors.text.primary },
  button: { fontSize: 17, fontWeight: '600' as const, lineHeight: 22, color: '#FFFFFF' },
} satisfies Record<string, TextStyle>;
