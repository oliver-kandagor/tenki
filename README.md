# 🌤️ Tenki — WeatherAI Mobile Companion

Tenki is a premium, personal outdoor companion mobile application built with **React Native** and **Expo SDK 56**. Instead of acting as a generic, cold weather widget, Tenki acts as a friendly companion answering simple, kid-friendly questions: *Can I go outside? Do I need my umbrella? When is the best time for my activities?*

It integrates seamlessly with the **WeatherAI REST API** (`https://api.weather-ai.co`) for weather forecasts, custom tree canopy analytics, and usage billing.

---

## 📖 Table of Contents
1. [Core Features & Screen Mapping](#-core-features--screen-mapping)
2. [Product Philosophy & Design System](#-product-philosophy--design-system)
3. [Architecture & Data Flow](#-architecture--data-flow)
4. [State Management (Zustand)](#-state-management-zustand)
5. [API Clients & Endpoints](#-api-clients--endpoints)
6. [Caching & Offline Strategy](#-caching--offline-strategy)
7. [Getting Started & Installation](#-getting-started--installation)
8. [Native Deployment & EAS Builds](#-native-deployment--eas-builds)
9. [Project Structure](#-project-structure)

---

## 📱 Core Features & Screen Mapping

### 1. The Interactive Onboarding Flow
Tenki guides new users through a fully structured, multi-step onboarding wizard to personalize their experience. The state is tracked via the `onboardingStore` and persisted using AsyncStorage.
* **Get Started Screen:** An aesthetic splash page with full-bleed moody imagery and call-to-action buttons.
* **Intro Slides (3 Slides):** Friendly swipeable slides detailing the product values.
* **Google Authentication Stub:** A secure authentication page that logs users in and establishes credentials.
* **Activities Screen:** A 2-column Pinterest-style interactive selector allowing users to highlight outdoor hobbies (Hiking, Farming, Running, Cycling, etc.). Selecting a card toggles a solid white focus border.
* **Notifications Screen:** Set channel alerts preferences (Email, SMS, or WhatsApp).
* **Update Frequency Screen:** Choose how often the companion updates details (Daily, Weekly, Monthly).
* **Plan Pricing Screen:** Highlight options between Free, Pro, and Farm tiers.
* **Saved Locations Manager:** An interactive setup screen to search for and default primary coordinates (Home, Work, or Custom).
* **Welcome Screen:** Greets the user personally by name and displays their preferences summary.
* **Success Animation Screen:** Plays a congratulatory fade-in-down checkmark when setup completes, unlocking the tab bar.

### 2. Today Screen (Home Dashboard)
Provides instant outdoor status checks alongside visual grids:
* **Location Resolution (useLocation hook):** Attempts to fetch current coordinates using `expo-location`. If denied, it uses `/v1/weather-geo?ip=auto` IP lookup fallback automatically.
* **Weather-Responsive Hero:** Loads dynamic background images matching the current weather condition code (Clear, Cloudy, Rainy, Stormy, Snow).
* **Umbrella Warning Hint:** Warns users to bring an umbrella if the rain chance is high (> 50%) within the next 12 hours.
* **Outdoor Status Banner:** Derives status thresholds using a rules engine (`src/utils/outdoorStatus.ts`):
  * `Ready` (Comfortable range, no rain in 6h)
  * `Caution` (Rain expected in 12h or moderate winds)
  * `Stay inside` (Severe storm alerts, heavy downpours, or AI-noted floods)
* **Best Outdoor Window:** Analyzes the hourly forecast to detect longest consecutive dry streaks for field or outdoor tasks.
* **2x2 Metrics Grid:** Renders visual cards with HSL-tinted circles (Temperature, Humidity, Wind speed, Atmospheric pressure).
* **Interactive Tabs Switcher:** Quickly toggle between Hourly, 10 Days, and Monthly forecast projections.
* **Rain Chance Probability Bars:** Horizontal progress indicators displaying precipitation likelihood.
* **Sunrise & Sunset Cards:** Display solar events mapped with smooth icons.
* **AI Summary Panel:** Renders Gemini AI summaries generated dynamically from the weather parameters.

### 3. Forecast Screen
Provides a deeper look into the climate patterns:
* **Hourly Carousel:** Horizontal scrolling list of hourly temperatures, rain chances, and conditions for the next 24 hours.
* **Daily Forecast:** Vertical scroll list showing minimum and maximum temp limits with custom icons.
* **Metric/Imperial Unit Selector:** Toggle between Celsius (°C) and Fahrenheit (°F) instantly. Triggers a store update and re-caches data.

### 4. Alerts & Reminders Screen
Configure customized triggers based on local weather predictions:
* **5 Alert Channels:** Toggles for Rain, Floods, Wind, Frost, and Dry Windows.
* **Lead Time Selector:** Cycle through notifications timings (`now`, `15min`, `30min`, `1hour`, `2hour`, `6hour`, `1day`).
* **Haptics:** Selection feedback fires when toggling options.
* **Trigger History:** Maintains a local database of the last 50 alerts triggered by weather criteria.

### 5. Trees & Canopy Screen (Forestry Care)
A specialized tool for farm management and canopy health:
* **Camera & Gallery Picker:** Takes a photo or picks from the library via `expo-image-picker`.
* **Multipart Image Analysis:** Sends files to `/v1/trees/analyze` with farm acres, notes, and local region details.
* **Analysis Display:** Shows total tree count, canopy density %, health summary (Healthy vs Needs Care vs Replacement), and original alongside annotated visual overlays.
* **Analyses History List:** Loads historical records with cursor-based pagination. Tapping a row opens a details screen.

### 6. Usage Quotas Screen
Tracks WeatherAI plan bounds:
* Visual progress bars representing standard API calls, AI reports, and forestry submissions.
* Displays subscription limits, reset calendar dates, and warning levels.

### 7. API Lab Screen
A playground containing 12 live experimental features (e.g. Twin Cities, Travel Mode, Swahili Weather Briefs). Allows testing raw API behaviors and bookmarking favorites.

---

## 🎨 Product Philosophy & Design System

Tenki is built upon modern aesthetic tokens (`src/theme/tokens.ts` & `typography.ts`).

### Color Hierarchy
* **Root Background:** `#0B0B0E` (Deep charcoal dark theme first)
* **Surface Cards:** `#1C1C22` (Elevated blocks with `#2A2A32` subtle borders)
* **Primary Accents:** `#8B5CF6` (Violet pill headers and buttons)
* **Status Badges:** 
  * Ready: `#34D399` (Soft Green tint)
  * Caution: `#FBBF24` (Amber Amber)
  * Stay in: `#F87171` (Danger Red)
* **Fixed Metric Icons:** Fixed colored circles (12% opacity) mapping to metrics.

### Typography Scales
* **Hero Text:** `28px` bold, line height `34`
* **Section Titles:** `17px` semi-bold, line height `24`
* **Metric Text:** `32px` bold, line height `38`
* **Body / Captions:** `16px` / `13px` weights

---

## 🏗️ Architecture & Data Flow

Tenki adopts a clean, layered front-end structure:

```
┌────────────────────────────────────────────────────────┐
│                        UI LAYER                        │
│   TodayScreen  │  ForecastScreen  │  OnboardingWizard  │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│                      LOGIC LAYER                       │
│              useWeather  │  useLocation                │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│                      STATE LAYER                       │
│        Zustand Stores (Hydrated via AsyncStorage)      │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│                     NETWORK LAYER                      │
│        Axios Client with interceptors and errors       │
└───────────────────────────┬────────────────────────────┘
                            ▼
               HTTPS (https://api.weather-ai.co)
```

---

## 🗃️ State Management (Zustand)

Zustand stores maintain real-time application values and state synchronization:
1. **`weatherStore`:** Manages current temperatures, 7-day daily models, 24h forecasts, measurement units (metric vs imperial), loading states, and error alerts.
2. **`treesStore`:** Handles photo uploading, forestry calculations, history caching, and pagination cursors.
3. **`locationStore`:** Caches current latitude/longitude coordinate numbers and city labels.
4. **`remindersStore`:** Toggles alerts, lead times, and alert histories. Uses Zustand's persist middleware with `AsyncStorage`.
5. **`onboardingStore`:** Directs onboarding completion progress, selected plans, update frequencies, and locations setup.
6. **`authStore` / `labStore`:** Coordinates Google user credentials and API lab test features.

---

## 🔌 API Clients & Endpoints

Tenki calls the WeatherAI REST endpoints using a preconfigured Axios client (`src/api/client.ts`).

### Request Interceptor
* Automatically retrieves the API key and appends the header: `Authorization: Bearer EXPO_PUBLIC_WEATHER_AI_API_KEY`.

### Response & Error Interceptor
Intercepts network errors and maps them to clean user-friendly descriptions:
* **`401`** ➔ *Invalid API key. Check your env setup.*
* **`403`** ➔ *This feature is not available on your plan.*
* **`429`** ➔ *Monthly quota exceeded. Try again after reset.*
* **`500` / `503`** ➔ *Server error. Please try again.*
* **`ERR_NETWORK` / Offline** ➔ *Network error. Check your connection.*

---

## 💾 Caching & Offline Strategy

To prevent unnecessary API bill charges, Tenki implements a Time-To-Live (TTL) cache system utilizing AsyncStorage (`src/utils/cache.ts`).

| Data Type | Cache TTL Duration | Offline Treatment |
|---|---|---|
| **Current Weather** | 10 Minutes | Falls back to cached data, displays banner |
| **Daily Forecast** | 30 Minutes | Falls back to cached data |
| **Hourly Forecast** | 15 Minutes | Falls back to cached data |
| **Usage stats** | 5 Minutes | Shows last retrieved numbers |
| **Tree Analyses** | Indefinite | Cached locally for quick view |

---

## 🚀 Getting Started & Installation

### Prerequisites
* Install Node.js v20 or newer.
* Install the [Expo Go](https://expo.dev/go) application on your mobile device.

### Setup Steps
1. **Clone the Repository:**
   ```bash
   git clone <repo-url>
   cd tenki
   ```

2. **Install Package Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file at the root:
   ```bash
   touch .env
   ```
   Add your API key inside `.env`:
   ```env
   EXPO_PUBLIC_WEATHER_AI_API_KEY=wai_your_secret_api_key_here
   ```
   *Note: Environment variables are prefixed with `EXPO_PUBLIC_` to be loaded correctly in Expo configurations.*

4. **Launch Dev Server:**
   ```bash
   npx expo start -c
   ```
   *Scan the generated QR code using your mobile device's camera or Expo Go application.*

---

## 📦 Native Deployment & EAS Builds

Tenki uses Expo Application Services (EAS) to compile native Android applications.

### APK Preview Build
To compile a test preview build:
```bash
npx eas build --platform android --profile preview
```

### Production Build
To prepare a final release build:
```bash
npx eas build --platform android --profile production
```

---

## 📂 Project Structure

```
tenki/
├── assets/                     # App media assets & images
│   ├── icons/                  # Custom icons
│   └── images/                 # Onboarding & weather hero backgrounds
├── src/
│   ├── api/                    # Axios client & endpoints
│   │   ├── client.ts           # Interceptors & normalization
│   │   ├── weather.ts          # Forecast endpoints
│   │   ├── trees.ts            # Forestry endpoints
│   │   └── account.ts          # Usage queries
│   ├── components/             # Reusable UI component elements
│   │   ├── ui/                 # Design tokens and widgets
│   │   └── shared/             # Tab Bar, custom page headers
│   ├── hooks/                  # Custom React hooks (useLocation, useWeather)
│   ├── navigation/             # Tab and stack navigator structures
│   ├── screens/                # Core screens
│   │   ├── onboarding/         # Onboarding Wizard screens
│   │   ├── TodayScreen.tsx     # Home page dashboard
│   │   ├── ForecastScreen.tsx  # Extended weather views
│   │   └── TreesScreen.tsx     # Canopy upload manager
│   ├── store/                  # Zustand state managers
│   ├── theme/                  # Color and text tokens
│   └── utils/                  # Cache engine, haptic tools, helpers
├── App.tsx                     # Main app launch script
├── app.json                    # Expo config specifications
├── tailwind.config.js          # Tailwind CSS settings
└── tsconfig.json               # TypeScript rules config
```
