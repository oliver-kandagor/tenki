# Tenki — Weather App · Full Technical Specification

> **テンキ (tenki)** — Japanese for *weather*. A market-ready React Native weather app built on the WeatherAI API and Firebase, following the gluestack market UI template aesthetic.

---

## 1. The Problem Tenki Solves

Most weather apps are either too generic (no AI insights), too cluttered, or disconnected from agriculture and everyday decision-making. **Tenki** bridges that gap:

- **For urban users**: hyper-local hourly + 10-day forecasts, rain chance bars, sunrise/sunset — all in one glance.
- **For farmers / agro users** (unique differentiator): tree and canopy health analysis via drone/satellite image upload, powered by the WeatherAI Trees & Forestry API.
- **For travelers**: multi-city location cards with live temp, AQI, and wind data.

---

## 2. App Architecture Overview

```
tenki/
├── app/                        # Expo Router file-based routing
│   ├── (tabs)/
│   │   ├── index.tsx           # Weather tab (home)
│   │   ├── location.tsx        # Location manager
│   │   ├── maps.tsx            # Maps tab (react-native-maps)
│   │   └── settings.tsx        # Settings + theme toggle
│   └── _layout.tsx
├── components/
│   ├── weather/
│   │   ├── HeroHeader.tsx       # Animated city + condition banner
│   │   ├── HourlyForecast.tsx   # Horizontal scroll hourly cards
│   │   ├── DayForecastChart.tsx # 7-day area chart (gifted-charts)
│   │   ├── RainChanceBars.tsx   # Horizontal progress bars
│   │   ├── SunriseSunset.tsx    # Sunrise/sunset tiles
│   │   └── MonthlyCalendar.tsx  # react-native-calendars monthly view
│   ├── location/
│   │   ├── CityCard.tsx         # Location card (temp, AQI, wind)
│   │   └── CitySearch.tsx       # Search + voice input
│   ├── forestry/
│   │   ├── ImageUploader.tsx    # Drone/farm image picker
│   │   └── AnalysisResult.tsx   # Tree count, health, overlay image
│   └── shared/
│       ├── TabBar.tsx           # Custom bottom tab bar
│       └── AnimatedBackground.tsx # Dynamic weather scene background
├── services/
│   ├── weatherApi.ts            # WeatherAI REST client
│   ├── forestryApi.ts           # Trees & Forestry API client
│   └── firebase.ts              # Firebase config + Auth
├── store/
│   ├── weatherStore.ts          # Zustand slice — weather data
│   ├── locationStore.ts         # Saved cities
│   └── settingsStore.ts         # Theme, units, language
├── hooks/
│   ├── useWeather.ts
│   ├── useLocation.ts
│   └── useForestry.ts
├── constants/
│   └── theme.ts                 # Dark/light token system (NativeWind)
└── utils/
    ├── cache.ts                 # MMKV-backed TTL cache
    └── units.ts                 # Metric ↔ imperial conversions
```

---

## 3. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React Native 0.81 + Expo SDK 54 | Cross-platform, fast iteration |
| Router | Expo Router v6 (file-based) | Clean deep linking, tab layout |
| Language | TypeScript 5.9 | Type safety across API contracts |
| Styling | NativeWind 4 (Tailwind CSS) + gluestack-ui | Matches UI kit; dark mode built-in |
| State | Zustand + React Query (TanStack) | Server state (React Query) + UI state (Zustand) |
| Charts | react-native-gifted-charts | Area chart for 7-day forecast |
| Calendar | react-native-calendars | Monthly weather view |
| Maps | react-native-maps | Maps tab, weather layer pins |
| Animation | react-native-reanimated + @legendapp/motion | Hero background, card transitions |
| Cache | react-native-mmkv | Fast synchronous local cache |
| Backend | Firebase (Auth, Firestore, Storage) | User sessions, saved locations, analysis history |
| Weather API | WeatherAI (`https://api.weather-ai.co`) | All weather + tree analysis data |

---

## 4. Firebase Integration

### 4.1 Auth
- **Anonymous Auth** on first launch → upgrade to Email/Google on explicit sign-in.
- API key bound to Firebase UID: stored in Firestore `users/{uid}/apiKey`.

### 4.2 Firestore Schema

```
users/
  {uid}/
    profile:      { displayName, email, plan: 'free'|'pro'|'scale' }
    apiKey:       { key: 'wai_...', createdAt }
    preferences:  { units: 'metric'|'imperial', theme: 'dark'|'light', lang: 'en'|'sw' }
    
    locations/    (sub-collection)
      {locationId}: { name, lat, lon, addedAt, isPrimary }
    
    forestryAnalyses/  (sub-collection)
      {analysisId}: { analysisId, farmerId, county, treeCount, overlayUrl, createdAt }
```

### 4.3 Firebase Storage
- Drone/farm images uploaded to `gs://tenki-app/forestry/{uid}/{analysisId}/original.jpg`
- Overlay images returned by WeatherAI are cached in Storage for offline access.

### 4.4 Callable Functions (from WeatherAI docs)
```typescript
// Cancel subscription
httpsCallable(functions, 'cancelSubscription')()

// Request SMS access (Scale plan)
httpsCallable(functions, 'requestSmsAccess')({ reason: '...' })

// Get Paystack config for in-app upgrade
httpsCallable(functions, 'getPaystackConfig')()
```

---

## 5. WeatherAI API Integration

### 5.1 Auth Header (every request)
```typescript
const headers = { Authorization: `Bearer ${apiKey}` };
```

### 5.2 Endpoint Map → Screen Map

| Endpoint | Screen / Component |
|---|---|
| `GET /v1/weather?lat&lon&days=7&ai=true` | Home hero + day chart |
| `GET /v1/hourly?lat&lon` | HourlyForecast horizontal scroll |
| `GET /v1/forecast14` (Pro) | 10 Days tab — extended list |
| `GET /v1/daily?lat&lon` | Day forecast cards |
| `GET /v1/insights` (Pro) | AI Insight card on home screen |
| `GET /v1/weather-geo?lat&lon` | Maps tab — nearby city pins |
| `GET /v1/ip-lookup` | Auto-detect city on first launch |
| `GET /v1/usage` | Settings → Plan & Usage tile |
| `POST /v1/trees/analyze` | Forestry tab — image upload |
| `GET /v1/trees/history` | Forestry tab — past analyses list |

### 5.3 AI Summary Toggle
```typescript
// Respect AI quota — add ?ai=false on background refreshes
const url = isBackgroundRefresh
  ? `/v1/weather?lat=${lat}&lon=${lon}&ai=false`
  : `/v1/weather?lat=${lat}&lon=${lon}&ai=true`;
```

### 5.4 Rate Limit Handling
```typescript
// Read headers after every response
const remaining = response.headers.get('X-RateLimit-Remaining');
const reset = response.headers.get('X-RateLimit-Reset');

if (response.status === 429) {
  const resetDate = new Date(Number(reset) * 1000);
  showToast(`Quota exceeded. Resets ${resetDate.toLocaleDateString()}`);
}
```

---

## 6. Caching Strategy (Offline-First)

```typescript
// utils/cache.ts  — MMKV-backed TTL
const CACHE_TTL = {
  current:  5  * 60 * 1000,  // 5 min
  hourly:   30 * 60 * 1000,  // 30 min
  daily:    60 * 60 * 1000,  // 1 hour
  forecast: 3  * 60 * 60 * 1000, // 3 hours
};
```

React Query `staleTime` mirrors these TTLs. When offline, stale cache serves as fallback and a banner `"Showing cached data"` appears.

---

## 7. Screen-by-Screen Breakdown

### 7.1 Weather Tab (Home)

**Visual**: Full-bleed animated scene background matching condition (rain, sun, storm, snow). Powered by Lottie or SVG + reanimated.

**Sections (scrollable)**:
1. **Hero Header** — City name, date/time, large temperature, feels-like, condition label + icon
2. **Tab Switcher** — Hourly / 10 Days / Monthly (purple pill active state)
3. *If Hourly selected*:
   - Horizontal scroll of hourly cards (icon + temp)
   - 7-day area chart (DayForecastChart)
   - Chance of Rain progress bars (6–9 PM)
   - Sunrise / Sunset tiles
4. *If 10 Days selected*:
   - Collapsible day rows (icon, condition, high/low)
5. *If Monthly selected*:
   - react-native-calendars grid with weather emoji per date

**AI Insight Card** (Pro+): Gemini-generated summary from `/v1/insights` shown below the chart as a glassy card.

---

### 7.2 Location Tab

- Search bar with voice input (expo-speech)
- City cards showing: local time, current temp, high/low, condition, AQI, wind
- Pull-to-refresh updates all cards in parallel
- Long-press → Delete city
- Primary location highlighted with purple card

Data source: `/v1/weather?lat&lon` per saved city, paralleled via `Promise.all`.

---

### 7.3 Maps Tab

- react-native-maps full-screen dark map
- Search bar overlaid at top
- Pins for nearby cities pulled from `/v1/weather-geo`
- Tapping a pin shows a bottom sheet with quick forecast (react-native-bottom-sheet)

---

### 7.4 Settings Tab

- **General Info**: display name, email, plan badge
- **Settings**: units (metric/imperial), language (en/sw for Swahili support)
- **Preferences**: notifications toggle, AI summaries toggle, background refresh
- **Theme**: Light Mode / Dark Mode toggle (persisted in Zustand + Firestore)
- **Plan & Usage**: progress bar showing requests used / monthly cap, upgrade CTA

---

### 7.5 Forestry Screen (FAB on Weather tab)

A floating action button (leaf icon) opens the Forestry sheet:

1. **Image picker** — camera or gallery (expo-image-picker)
2. **Metadata form** — farmerId, county, landAcres, notes
3. **Upload + Analyze** → `POST /v1/trees/analyze` (multipart)
4. **Result card**:
   - Overlay image (annotated tree crowns)
   - Stats: tree count, density/acre, canopy %, confidence
   - Health donut: Healthy / Needs Care / Needs Replacement
   - AI observations + recommendations list
5. **History** — past analyses from Firestore `forestryAnalyses/`

---

## 8. State Management Flow

```
┌─────────────────────────────────────────────────┐
│                 React Query Cache                │
│  (weather, hourly, forecast, insights, forestry) │
│        TTL-backed, MMKV persistence              │
└──────────────────────┬──────────────────────────┘
                       │ data
┌──────────────────────▼──────────────────────────┐
│                   Zustand Store                  │
│  weatherStore  │  locationStore  │ settingsStore │
│  (active city) │  (saved cities) │ (theme/units) │
└──────────────────────┬──────────────────────────┘
                       │ sync
┌──────────────────────▼──────────────────────────┐
│                    Firestore                     │
│         (preferences, locations, analyses)       │
└─────────────────────────────────────────────────┘
```

---

## 9. Design System (preserving gluestack UI)

### Color Tokens
```typescript
// constants/theme.ts
export const colors = {
  dark: {
    bg:          '#0A0A0F',
    surface:     '#13131A',
    surfaceHigh: '#1E1E2A',
    primary:     '#8B5CF6',   // purple pill / active
    primarySoft: '#6D4EAD',
    text:        '#FFFFFF',
    textMuted:   '#9CA3AF',
    rain:        '#C4B5FD',
  },
  light: {
    bg:          '#F0F4FF',
    surface:     '#FFFFFF',
    surfaceHigh: '#E8EEFF',
    primary:     '#7C3AED',
    text:        '#111827',
    textMuted:   '#6B7280',
  }
};
```

### Typography
- **Display**: `DM Sans` (700) — city names, large temps
- **Body**: `DM Sans` (400/500) — descriptions, labels
- **Mono**: `JetBrains Mono` — debug/AQI numbers

### Animated Background
Weather condition → background scene:
| Condition | Background |
|---|---|
| Thunderstorm | Dark blue + lightning SVG pulse |
| Rain | Blue-grey gradient + falling rain particles |
| Sunny | Warm amber gradient + sun glow |
| Cloudy | Steel grey gradient + drifting clouds |
| Snow | White/blue gradient + snowflake particles |

---

## 10. Unique Market-Ready Features (Beyond the Brief)

1. **Swahili AI Summaries** — Pass `lang=sw` to WeatherAI for East African users (relevant for Kenya/Tanzania market)
2. **Farmer Mode** — Toggle in settings that surfaces the Forestry FAB and agro-specific weather metrics (humidity, soil moisture proxy from rain accumulation)
3. **Weather Webhooks** (Pro) — UI to register a webhook URL or phone number for rain alerts via `/v1/webhooks`
4. **AQI Badge** — Color-coded air quality badge on every city card (green < 50, yellow 51–100, red 101+)
5. **Offline Banner** — Detects network via `@react-native-community/netinfo`, shows a soft warning when serving stale cache
6. **Plan Upgrade Flow** — Locked Pro/Scale features show a purple "Upgrade" banner; taps call `getPaystackConfig` Firebase callable and open an in-app payment sheet

---

## 11. Project Setup Commands

```bash
# Bootstrap
npx create-expo-app tenki --template expo-template-blank-typescript
cd tenki

# Core deps
npx expo install expo-router expo-location expo-image-picker \
  expo-linear-gradient expo-blur expo-haptics

# UI
npx expo install nativewind @gluestack-ui/core
pnpm add zustand @tanstack/react-query react-native-mmkv

# Charts & Maps
pnpm add react-native-gifted-charts react-native-maps \
  react-native-calendars react-native-svg

# Firebase
pnpm add firebase @react-native-firebase/app \
  @react-native-firebase/auth @react-native-firebase/firestore \
  @react-native-firebase/storage @react-native-firebase/functions

# Animation
pnpm add react-native-reanimated @legendapp/motion

# Bottom sheet
pnpm add @gorhom/bottom-sheet react-native-gesture-handler

# Build APK
eas build --platform android --profile preview
```

---

## 12. Environment Variables (.env)

```env
EXPO_PUBLIC_WEATHER_AI_KEY=wai_your_key_here
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

---

## 13. Folder Conventions

- All API calls go through `services/` — never inline `fetch` in components
- All env vars accessed via `constants/env.ts` — never `process.env` directly in components
- NativeWind classes in JSX; component-level `StyleSheet` only for dynamic/animated styles
- Zustand stores are slices — one file per domain
- React Query keys are centralized in `constants/queryKeys.ts`

---

## 14. Submission Checklist

- [ ] GitHub repo with clean commit history (feature branches → main)
- [ ] `README.md` with setup, .env template, and APK download link
- [ ] EAS build → APK on Firebase App Distribution
- [ ] All 4 tabs functional with real WeatherAI data
- [ ] Offline mode working (cached data)
- [ ] Dark + Light theme toggle persisted
- [ ] Forestry image upload working end-to-end
- [ ] No hardcoded API keys in repo

---

*Tenki — built for the WeatherAI technical assessment. Good luck, Oliver.*
