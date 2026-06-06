import type { CurrentConditions } from '@/api/types';

export type WeatherCondition = 
  | 'clear'
  | 'cloudy'
  | 'rainy'
  | 'thunderstorm'
  | 'snow'
  | 'default';

/**
 * Maps weather condition codes from WeatherAI to hero background image assets.
 * Reference: https://www.weatherapi.com/docs/
 */
const CONDITION_CODE_MAP: Record<number, WeatherCondition> = {
  // Sunny / Clear
  1000: 'clear',
  1003: 'cloudy',
  1006: 'cloudy',
  1009: 'cloudy',
  
  // Rainy
  1030: 'cloudy',
  1063: 'rainy',
  1069: 'rainy',
  1072: 'rainy',
  1150: 'rainy',
  1153: 'rainy',
  1168: 'rainy',
  1171: 'rainy',
  1180: 'rainy',
  1183: 'rainy',
  1186: 'rainy',
  1189: 'rainy',
  1192: 'rainy',
  1195: 'rainy',
  1198: 'rainy',
  1201: 'rainy',
  1204: 'rainy',
  1207: 'rainy',
  1210: 'snow',
  1213: 'snow',
  1216: 'snow',
  1219: 'snow',
  1222: 'snow',
  1225: 'snow',
  
  // Thunderstorm
  1226: 'thunderstorm',
  1237: 'thunderstorm',
  1240: 'thunderstorm',
  1243: 'thunderstorm',
  1246: 'thunderstorm',
  1249: 'thunderstorm',
  1252: 'thunderstorm',
  1255: 'thunderstorm',
  1258: 'thunderstorm',
  1261: 'thunderstorm',
  1264: 'thunderstorm',
  1273: 'thunderstorm',
  1276: 'thunderstorm',
  1279: 'thunderstorm',
  1282: 'thunderstorm',
};

const HERO_IMAGES: Record<WeatherCondition, any> = {
  clear: require('../../assets/images/hero/home-bg.png'),
  cloudy: require('../../assets/images/hero/home-bg.png'),
  rainy: require('../../assets/images/hero/home-bg.png'),
  thunderstorm: require('../../assets/images/hero/home-bg.png'),
  snow: require('../../assets/images/hero/home-bg.png'),
  default: require('../../assets/images/hero/home-bg.png'),
};

/**
 * Determines the hero background image based on current weather conditions.
 * Falls back to 'default' if condition code is unknown.
 */
export function getHeroImage(weather: CurrentConditions | null | undefined): any {
  if (!weather) {
    return HERO_IMAGES.default;
  }

  const conditionCode = weather.weather_code ?? 1000;
  const condition = CONDITION_CODE_MAP[conditionCode] || 'default';
  return HERO_IMAGES[condition];
}

/**
 * Get a descriptive condition label for the weather.
 */
export function getWeatherConditionLabel(weather: CurrentConditions | null | undefined): string {
  if (!weather) return 'Weather';
  
  const conditionCode = weather.weather_code ?? 1000;
  const condition = CONDITION_CODE_MAP[conditionCode] || 'default';
  
  return condition.charAt(0).toUpperCase() + condition.slice(1);
}
