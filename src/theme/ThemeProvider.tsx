import { DarkTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { ReactNode } from 'react';

import { colors } from '@/theme/tokens';

const tenkiDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary.default,
    background: colors.background.root,
    card: colors.surface.card,
    text: colors.text.primary,
    border: colors.border.subtle,
    notification: colors.primary.default,
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <NavThemeProvider value={tenkiDarkTheme}>{children}</NavThemeProvider>;
}
