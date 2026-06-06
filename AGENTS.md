# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

# WeatherAI Mobile App — Agent Instructions

## Project Context

You are building a React Native mobile app for a technical interview assignment at **WeatherAI**.
The app consumes the WeatherAI REST API (`https://api.weather-ai.co`) and must demonstrate
clean architecture, state management, and a functional user experience.

The build is split into two phases:
1. **MVP** — wire up all API features, validate everything works, minimal styling. ✅ Done
2. **Design Pass** — personal, child-friendly UI; reminders; consistent design system.

You are currently on **Phase 2: Design Pass**.

**Product positioning:** Tenki is a **personal outdoor companion** (umbrella reminders, flood/rain alerts, best time to go outside, farm/tree tools) — not a generic weather widget app.

**Design source of truth:** Read and follow [`design.md`](./design.md) for every UI change. Do not invent colors, radii, or component styles in individual screens.

---

## Tech Stack

- **Framework:** React Native (Expo or bare — your choice, but Expo is faster for MVP)
- **Language:** TypeScript
- **State management:** Zustand (lightweight, no boilerplate)
- **Navigation:** React Navigation v6 (Stack + Bottom Tabs)
- **HTTP client:** Axios with an interceptor that injects the `Authorization: Bearer wai_<key>` header
- **Location:** `expo-location` (or `@react-native-community/geolocation` for bare)
- **Storage / caching:** `@react-native-async-storage/async-storage`
- **Image upload:** `expo-image-picker` + `expo-file-system`

---

## Environment & Secrets

Create a `.env` file at the root (add to `.gitignore`):

```
WEATHER_AI_API_KEY=wai_your_key_here
```

Access via `react-native-dotenv` or `expo-constants`. **Never hard-code the key.**

---

## API Reference (WeatherAI)

Base URL: `https://api.weather-ai.co`  
Auth header: `Authorization: Bearer wai_<key>`

### Weather Endpoints (All Plans)

| Method | Path | Purpose | Key Params |
|--------|------|---------|-----------|
| GET | `/v1/weather` | Current + 7-day forecast | `lat`, `lon`, `days`, `ai`, `units`, `lang` |
| GET | `/v1/current` | Current conditions only | `lat`, `lon`, `ai`, `units` |
| GET | `/v1/daily` | Day-by-day breakdown | `lat`, `lon`, `days`, `ai`, `units` |
| GET | `/v1/hourly` | Hour-by-hour breakdown | `lat`, `lon`, `days`, `ai`, `units` |
| GET | `/v1/weather-geo` | Weather via IP auto-detect | `ip=auto`, `days`, `ai` |

> Add `?ai=false` to skip Gemini AI summaries and save your AI quota (200 req/mo on Free plan).

### Trees / Forestry Endpoints (All Plans — 5 analyses/mo on Free)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/v1/trees/analyze` | Upload image → tree count + canopy health + AI observations |
| GET | `/v1/trees/history` | Paginated list of past analyses |
| GET | `/v1/trees/quota` | Remaining analyses this month |

`/v1/trees/analyze` accepts `multipart/form-data`:
- `image` (file, required) — JPEG/PNG/WEBP, max 20 MB
- `farmerId`, `county`, `landAcres`, `location`, `notes` (optional context for AI)

### Account

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/v1/usage` | Request counts, AI counts, plan limits |

### Error Codes to Handle

| Status | Meaning |
|--------|---------|
| 401 | Bad/missing API key |
| 403 | Feature not on your plan |
| 429 | Monthly quota exceeded |
| 400 | Missing required params |
| 500 | Server error — retry with backoff |

---

## Folder Structure

```
src/
├── api/
│   ├── client.ts          # Axios instance with auth interceptor + error handler
│   ├── weather.ts         # All weather endpoint functions
│   ├── trees.ts           # Trees/forestry endpoint functions
│   └── account.ts         # Usage endpoint
├── store/
│   ├── weatherStore.ts    # Zustand store — weather state
│   ├── treesStore.ts      # Zustand store — trees state
│   └── locationStore.ts   # Zustand store — GPS coordinates
├── screens/
│   ├── HomeScreen.tsx     # Current weather + AI summary
│   ├── ForecastScreen.tsx # Daily + hourly forecast
│   ├── TreesScreen.tsx    # Image upload + analysis result
│   ├── HistoryScreen.tsx  # Past tree analyses
│   └── UsageScreen.tsx    # API quota dashboard
├── components/
│   ├── WeatherCard.tsx
│   ├── HourlyRow.tsx
│   ├── DailyRow.tsx
│   ├── TreeAnalysisCard.tsx
│   └── QuotaBadge.tsx
├── hooks/
│   ├── useLocation.ts     # Get device GPS, fallback to IP geo
│   └── useWeather.ts      # Fetch + cache weather for current coords
├── utils/
│   ├── cache.ts           # AsyncStorage wrapper with TTL
│   └── units.ts           # °C / °F toggle helpers
└── navigation/
    └── AppNavigator.tsx   # Stack + Bottom Tab setup
```

---

## Phase 1 — MVP Task List

Work through these screens in order. Each screen must be functional before moving to the next.

### 1. API Client (`src/api/client.ts`)
- [ ] Create Axios instance pointing at `https://api.weather-ai.co`
- [ ] Add request interceptor to inject `Authorization: Bearer ${API_KEY}`
- [ ] Add response interceptor to normalize errors (401 → "Invalid API key", 429 → "Quota exceeded", etc.)
- [ ] Export typed helper: `get<T>(path, params)` and `postForm<T>(path, formData)`

### 2. Location Hook (`src/hooks/useLocation.ts`)
- [ ] Request `expo-location` foreground permission on mount
- [ ] If granted → return `{ lat, lon }` from device GPS
- [ ] If denied → fall back to `/v1/weather-geo?ip=auto` to get coords from IP
- [ ] Store coords in `locationStore`

### 3. Home Screen — Current Weather
- [ ] On mount, call `/v1/current?lat=&lon=&ai=true&units=metric`
- [ ] Display: location name (from response or reverse-geocode), temperature, condition description, AI summary
- [ ] Show a loading skeleton while fetching
- [ ] Show error state with retry button on failure
- [ ] Cache result in AsyncStorage with 10-minute TTL (`cache.ts`)

### 4. Forecast Screen — Daily + Hourly
- [ ] Call `/v1/daily` for 7-day forecast
- [ ] Call `/v1/hourly` for next 24 hours
- [ ] Horizontal scroll for hourly, vertical list for daily
- [ ] Show min/max temps, condition icons (use weather code to emoji map for MVP)
- [ ] Units toggle (metric / imperial) stored in Zustand, re-fetches on change

### 5. Trees Screen — Image Analysis
- [ ] Button to open image picker (camera or gallery)
- [ ] On image selected → build `FormData` with the image + optional fields
- [ ] POST to `/v1/trees/analyze`
- [ ] While uploading → show progress indicator
- [ ] On success → display:
  - Total tree count
  - Canopy coverage %
  - Health breakdown (healthy / needs care / needs replacement)
  - AI observations and recommendations (bulleted list)
  - Both original and overlay images (using `Image` component with the returned URLs)
- [ ] On error → show error message with retry

### 6. History Screen — Past Analyses
- [ ] Call `/v1/trees/history?limit=20`
- [ ] Render a FlatList of past analyses (date, tree count, canopy %, thumbnail)
- [ ] Tap an item → navigate to a detail view showing full result
- [ ] Implement cursor-based pagination (load more on scroll end)

### 7. Usage Screen — Quota Dashboard
- [ ] Call `/v1/usage`
- [ ] Call `/v1/trees/quota`
- [ ] Display:
  - Standard requests used / limit
  - AI requests used / limit
  - Tree analyses used / limit
  - Billing period reset date
- [ ] Use simple progress bars (View with width %) for MVP

### 8. Navigation (`src/navigation/AppNavigator.tsx`)
- [ ] Bottom tab navigator with 4 tabs: Home, Forecast, Trees, Usage
- [ ] Stack navigator wrapping Trees tab (Trees List → Analysis Detail)

---

## Caching Strategy (MVP)

Use a simple TTL cache in AsyncStorage:

```typescript
// utils/cache.ts
interface CacheEntry<T> { data: T; expiresAt: number; }

export async function setCache<T>(key: string, data: T, ttlMs: number) {
  const entry: CacheEntry<T> = { data, expiresAt: Date.now() + ttlMs };
  await AsyncStorage.setItem(key, JSON.stringify(entry));
}

export async function getCache<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  const entry: CacheEntry<T> = JSON.parse(raw);
  if (Date.now() > entry.expiresAt) { await AsyncStorage.removeItem(key); return null; }
  return entry.data;
}
```

| Data | TTL |
|------|-----|
| Current weather | 10 minutes |
| Daily forecast | 30 minutes |
| Hourly forecast | 15 minutes |
| Tree analysis results | Indefinite (store locally) |
| Usage / quota | 5 minutes |

---

## State Shape (Zustand)

```typescript
// weatherStore.ts
interface WeatherState {
  current: CurrentWeather | null;
  daily: DailyForecast[] | null;
  hourly: HourlyForecast[] | null;
  units: 'metric' | 'imperial';
  loading: boolean;
  error: string | null;
  fetchCurrent: (lat: number, lon: number) => Promise<void>;
  fetchForecast: (lat: number, lon: number) => Promise<void>;
  setUnits: (units: 'metric' | 'imperial') => void;
}

// treesStore.ts
interface TreesState {
  analyses: TreeAnalysis[];
  currentAnalysis: TreeAnalysis | null;
  uploading: boolean;
  error: string | null;
  analyze: (imageUri: string, meta?: TreeMeta) => Promise<void>;
  fetchHistory: (cursor?: string) => Promise<void>;
}
```

---

## MVP Acceptance Criteria

Before moving to Phase 2 (design), verify every item:

- [ ] App launches without crash on Android physical device
- [ ] GPS location is fetched; IP fallback works when permission denied
- [ ] Current weather loads and displays temperature + AI summary
- [ ] 7-day daily forecast renders correctly
- [ ] Hourly forecast horizontal scroll works
- [ ] Units toggle switches between °C and °F and re-fetches
- [ ] Image picker opens (camera + gallery)
- [ ] Tree image uploads successfully and result displays (count, health, overlays)
- [ ] Trees history list loads with pagination
- [ ] Usage/quota screen shows correct numbers
- [ ] 10-minute weather cache works (no network call on re-open within TTL)
- [ ] All API errors show user-friendly messages (no raw JSON crashes)
- [ ] No API key visible in source code or committed to git

---

## Phase 2 — Design Pass (ACTIVE)

### Rules (always)

1. **Follow [`design.md`](./design.md)** — tokens, components, copy tone, spacing.
2. **Plain-language copy** — So simple a 10-year-old boy can understand it. Use conversational, personal language ("Grab your umbrella!", "It's going to rain!").
3. **Visually Engaging** — Use custom icons and Pinterest-inspired hero images to make the app feel personal, premium, and less AI-generated.
4. **Compose screens from `src/components/ui/*`** — no inline StyleSheet colors except in theme files.
4. **Custom icons** — `assets/icons/` (user-provided); no emoji in production UI (Lab tab exempt).
5. **Hero images** — Pinterest/licensed assets under `assets/images/` with scrim for text legibility.
6. **Personal features first** — reminders, outdoor status, best window; raw API JSON never shown to users.

### Visual direction (from reference mockup)

- Dark charcoal background (`#0B0B0E`), elevated cards (`#1C1C22`).
- **Violet primary** (`#8B5CF6`) pill buttons and active tab state.
- 2×2 **metric tiles** with colored icon circles (temp/humidity/wind/pressure).
- **Status hero** — “Outdoor ready” / “Take your umbrella” / “Stay inside”.
- **Activity onboarding grid** — 2 columns, white border on selected items.
- Bottom tabs with **purple dot** on active item.

### Folder structure (UI)

```
src/
├── theme/
│   ├── tokens.ts              # colors, spacing, radius (from design.md §2–4)
│   ├── typography.ts          # text styles
│   └── ThemeProvider.tsx      # React context + Navigation theme
├── components/
│   └── ui/                    # design system — use these in screens
│       ├── AppScreen.tsx      # safe area, title, scroll, footer CTA
│       ├── Card.tsx
│       ├── PrimaryButton.tsx
│       ├── SecondaryButton.tsx
│       ├── TextButton.tsx
│       ├── MetricTile.tsx
│       ├── ActivityCard.tsx
│       ├── StatusBanner.tsx
│       ├── InsightRow.tsx
│       ├── ReminderCard.tsx
│       ├── ListRow.tsx
│       ├── SegmentedProgress.tsx
│       ├── EmptyState.tsx
│       ├── ErrorState.tsx
│       ├── Skeleton.tsx
│       └── Toast.tsx
├── store/
│   ├── themeStore.ts          # optional light mode later
│   ├── remindersStore.ts      # rain/flood/wind/frost/dry_window toggles
│   └── activitiesStore.ts     # user outdoor activities (onboarding)
└── screens/
    ├── onboarding/            # GetStarted → Intro×3 → Google stub → prefs (design.md §8.2)
    ├── TodayScreen.tsx        # replaces Home (§8.1 design.md)
    ├── AlertsScreen.tsx       # reminder toggles + history
    └── ... (existing screens refactored to ui/*)
```

### Interactive UI components (Well-Structured & Visually Engaging)

The app must feel premium, modern, and engaging enough that users *want* to use it daily. Use smooth interactions and distinct visual states based on Pinterest inspiration.

| Component | Visual & Interaction Spec | Notes |
|-----------|---------------------------|--------|
| `PrimaryButton` | **Look:** Pill-shaped (`radius.pill`), vibrant `primary.default` (purple).<br>**Feel:** Press scale 0.98 (150ms). Disabled state is 40% opacity. | The single, obvious call to action (e.g. "Continue"). |
| `ActivityCard` | **Look:** 64px height, dark charcoal bg (`surface.cardHover`). Left-aligned custom icon + text.<br>**Feel:** When selected, smoothly apply a 2px solid white border (`border.focus`). | Interactive grid format, heavily inspired by modern reference apps. |
| `ReminderCard` | **Look:** Personal, friendly rows with toggles and clear icons.<br>**Feel:** Switch toggles smoothly. Tap row to show lead time picker. | E.g. "Tell me before it rains!" |
| `MetricTile` | **Look:** 2×2 grid cards, soft 12% tinted icon circles matching the metric (temp=green, wind=red).<br>**Feel:** Optional tap to expand. | Clean, spaced out, avoiding overwhelming data. |
| `StatusBanner` | **Look:** Large hero text, tinted background, easy-to-read friendly text.<br>**Feel:** Non-tappable. Acts as the headline of the day. | Driven by weather + rules engine. |
| `InsightRow` | **Look:** Horizontal card, bold "Best window" text with a time range.<br>**Feel:** Tap to scroll hourly forecast. | Very helpful for planning out activities. |
| `Card` | **Look:** Elevated dark surface (`surface.card`), 1px subtle border, `radius.lg`.<br>**Feel:** Opacity 0.9 on press if actionable. | Foundation of all content lists. |
| Pull-to-refresh | Native refresh control with `primary.default` tint. | Standard interaction for data screens. |
| `Skeleton` | Shimmering `surface.inset` blocks matching final layout. | No basic spinners; keep it premium. |
| Tab bar | 4–5 tabs max. Active tab has a colored icon and dot indicator below. | Today, Map (later), Alerts, Trees, You |

### Screen → feature map (Phase 2)

| Screen | User question (child-friendly) | API / logic |
|--------|--------------------------------|-------------|
| **Today** | Can I go outside? Need umbrella? | `/v1/current`, hourly rain window, status rules |
| **Forecast** | What’s the week look like? | `/v1/daily`, `/v1/hourly` |
| **Alerts** | Remind me about rain & floods | Local notifications + hourly/daily checks |
| **Trees** | How healthy is my land? | `/v1/trees/*` |
| **You** | My activities & settings | AsyncStorage + usage `/v1/usage` |
| **Lab** | Try API ideas (dev) | Existing lab — keep dark theme |

### Outdoor status rules (implement in `src/utils/outdoorStatus.ts`)

Derive banner from weather data — simple words only:

- **Ready** — no rain next 6h, wind & temp in comfort range.
- **Caution** — rain &lt; 12h or moderate wind → “Take your umbrella”.
- **Stay in** — thunder, flood keywords in AI summary, or very heavy rain %.

### Reminder types (`remindersStore`)

| id | Default on? | Trigger (MVP) |
|----|-------------|----------------|
| `rain` | yes | Hourly precip ≥ 50% within lead time |
| `flood` | yes | Daily rain very high or AI mentions flood |
| `wind` | no | Wind speed above threshold |
| `frost` | no | Temp below threshold |
| `dry_window` | yes | Longest dry streak from hourly (Lab logic) |

Use `expo-notifications` — request permission on Alerts screen, not on launch.

### Phase 2 task checklist

- [x] `src/theme/*` + `ThemeProvider` wired in `App.tsx` (design.md §2–4)
- [ ] All `src/components/ui/*` per design.md §7 (onboarding subset done §7.14)
- [ ] Navigation theme dark + tab icons (custom when assets ready)
- [ ] **Today** screen (status + best window + metrics + umbrella hint) — design.md §8.1
- [x] **Onboarding** full first-launch flow — design.md §8.2:
  1. Get Started → 2. Intro slides (3) → 3. Google stub (`authStore`) → 4. Activities → 5. Notification channels → 6. Update frequency → 7. Saved locations → 8. Welcome → main tabs
  - Stores: `onboardingStore`, `authStore`; reset via `ONBOARDING_STORAGE_KEY` / `resetOnboarding()`
- [ ] **Alerts** screen + `remindersStore` + notification scheduling
- [ ] Refactor Forecast, Trees, Usage, Lab to design system
- [ ] Replace emoji with `assets/icons/*`
- [ ] Add hero/scrim images from `assets/images/hero/`
- [ ] Pull-to-refresh + skeletons on data screens
- [ ] Haptics on save/toggle (expo-haptics)

### Phase 2 — Do NOT

- Show raw JSON, endpoint paths, or “API error 403” to end users (Lab may show JSON behind toggle).
- Use light gray `#f7f7f7` MVP backgrounds — app is **dark-first**.
- Add new colors outside `tokens.ts`.
- Use scientific jargon in user-visible strings.

---

## Submission Checklist

- [ ] Public GitHub repo with clean commit history (feat/fix/chore prefixes)
- [ ] README with setup steps (`npm install`, `.env` config, `expo start`)
- [ ] APK built via `eas build --platform android --profile preview` or `expo build:android`
- [ ] APK uploaded to Google Drive with public link
- [ ] Reply to Claire's email with: repo link + APK link

---

## Notes

- The Free plan gives you **1,000 req/mo** and **200 AI req/mo**. Use `?ai=false` during development to protect your AI quota.
- Tree analysis is capped at **5 analyses/mo** on Free — test with real images sparingly; mock the response shape for UI iteration.
- All weather endpoints (`/v1/weather`, `/v1/forecast`, `/v1/current`, `/v1/daily`, `/v1/hourly`) delegate to the same handler — pick the most semantically appropriate one per screen.
- The Trees overlay image URL (`overlay_image_url`) is a signed GCS URL — render it directly in an `<Image>` component.