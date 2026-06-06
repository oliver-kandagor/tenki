# Tenki — WeatherAI Mobile (MVP)

React Native (Expo SDK 56) app for the WeatherAI technical assignment. It consumes the [WeatherAI REST API](https://api.weather-ai.co) for weather, tree canopy analysis, and usage quotas.

## Prerequisites

- Node.js 20+
- [Expo Go](https://expo.dev/go) or a development build on a physical Android device (recommended for GPS and camera)
- A WeatherAI API key (`wai_…`) from [weather-ai.co](https://weather-ai.co)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure your API key:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set:

   ```
   EXPO_PUBLIC_WEATHER_AI_API_KEY=wai_your_key_here
   ```

   The key is loaded at build time via Expo’s `EXPO_PUBLIC_` env vars and is **not** committed to git.

3. Start the dev server:

   ```bash
   npx expo start
   ```

4. Open on Android (scan QR with Expo Go) or press `a` for an emulator.

## Features (Phase 1 MVP)

| Tab | Description |
|-----|-------------|
| **Home** | Current weather + AI summary (10 min cache) |
| **Forecast** | 7-day daily + 24h hourly scroll; metric/imperial toggle |
| **Trees** | Image upload (camera/gallery) → `/v1/trees/analyze`; history stack |
| **Lab** | 12 experimental API ideas — star favorites, run live, see product pitches |
| **Usage** | Standard / AI / tree analysis quotas |

Location: GPS via `expo-location`, with IP fallback (`/v1/weather-geo?ip=auto`) when permission is denied.

## Project structure

```
src/
├── api/           # Axios client + WeatherAI endpoints
├── store/         # Zustand (weather, trees, location)
├── screens/       # Home, Forecast, Trees, History, Usage
├── components/    # Cards, rows, quota bars
├── hooks/         # useLocation, useWeather
├── navigation/    # Bottom tabs + Trees stack
└── utils/         # TTL cache, units, weather emoji map
```

## API Lab (pick what to ship)

Open the **Lab** tab to try creative prototypes built on WeatherAI endpoints:

- **Free / no AI:** Rain Window, Golden Hour, Forecast alias check
- **Free + AI:** Week at a Glance, Travel Mode, Swahili brief, Twin Cities, Farm Morning Brief
- **Pro (403 on Free):** Insights, 14-day forecast, IP lookup, Webhooks

Star ★ features you like — shortlist is saved locally so you can decide what becomes a real screen.

## Tips

- Free plan: 1,000 req/mo, 200 AI req/mo, 5 tree analyses/mo. Use `?ai=false` in development where possible (forecast endpoints already skip AI).
- Tree analysis uses real quota — test uploads sparingly.

## Android APK (submission)

```bash
npx eas build --platform android --profile preview
```

Or follow [Expo’s Android build docs](https://docs.expo.dev/build/setup/).

## License

See [LICENSE](LICENSE).
