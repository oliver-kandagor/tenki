export const colors = {
  background: {
    root: '#0B0B0E',
    elevated: '#141418',
  },
  surface: {
    card: '#1C1C22',
    cardHover: '#24242C',
    inset: '#121216',
  },
  border: {
    subtle: '#2A2A32',
    focus: '#FFFFFF',
  },
  text: {
    primary: '#F5F5F7',
    secondary: '#9B9BA6',
    muted: '#6B6B76',
  },
  primary: {
    default: '#8B5CF6',
    pressed: '#7C3AED',
    muted: '#8B5CF633',
  },
  success: { default: '#34D399' },
  warning: { default: '#FBBF24' },
  danger: { default: '#F87171' },
  info: { default: '#60A5FA' },
  metric: {
    temp: '#34D399',
    humidity: '#60A5FA',
    wind: '#F87171',
    pressure: '#FB923C',
    rain: '#60A5FA',
    trees: '#4ADE80',
  },
  scrim: 'rgba(0,0,0,0.6)',
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;
