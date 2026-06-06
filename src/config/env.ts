/** Loaded from `.env` as EXPO_PUBLIC_WEATHER_AI_API_KEY (see .env.example). */
export const API_KEY = process.env.EXPO_PUBLIC_WEATHER_AI_API_KEY ?? '';

export function getApiKey(): string {
  if (!API_KEY) {
    throw new Error(
      'Missing API key. Set EXPO_PUBLIC_WEATHER_AI_API_KEY in your .env file.',
    );
  }
  return API_KEY;
}
