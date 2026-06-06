export const OUTDOOR_ACTIVITIES = [
  'Running',
  'Cycling',
  'Gardening',
  'Golf',
  'Beach',
  'Hiking',
  'Kids sports',
  'Dog walking',
  'Surfing',
  'Sailing',
  'Farming',
  'Flying',
] as const;

export type OutdoorActivity = (typeof OUTDOOR_ACTIVITIES)[number];

export const ACTIVITY_METADATA: Record<OutdoorActivity, { icon: any; color: string }> = {
  'Running': { icon: 'figure.run', color: '#ff6b6b' },
  'Cycling': { icon: 'bicycle', color: '#feca57' },
  'Gardening': { icon: 'leaf.fill', color: '#1dd1a1' },
  'Golf': { icon: 'figure.golf', color: '#48dbfb' },
  'Beach': { icon: 'sun.max.fill', color: '#feca57' },
  'Hiking': { icon: 'figure.hiking', color: '#c8d6e5' },
  'Kids sports': { icon: 'soccerball', color: '#1dd1a1' },
  'Dog walking': { icon: 'pawprint.fill', color: '#c8d6e5' },
  'Surfing': { icon: 'figure.surfing', color: '#48dbfb' },
  'Sailing': { icon: 'sailboat.fill', color: '#c8d6e5' },
  'Farming': { icon: 'leaf.fill', color: '#1dd1a1' },
  'Flying': { icon: 'airplane', color: '#c8d6e5' },
};

export const INTRO_SLIDES = [
  {
    title: 'Weather changes fast',
    body: 'Plans outside can fall apart when rain or wind shows up without warning.',
  },
  {
    title: 'Guessing is stressful',
    body: 'Checking five apps still leaves you unsure about umbrellas, floods, or the best hour to go out.',
  },
  {
    title: 'Tenki has your back',
    body: 'Plain-language alerts and timing built around what you actually do outdoors.',
  },
] as const;

export const LOCATION_ICON_PRESETS = [
  'home',
  'work',
  'pin',
  'beach',
  'tree',
  'farm',
  'golf',
  'run',
] as const;

export type LocationIconId = (typeof LOCATION_ICON_PRESETS)[number];

export const ONBOARDING_BG = require('../../assets/images/onboarding-bg.jpeg');
