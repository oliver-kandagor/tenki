# 🌤️ Tenki — WeatherAI Mobile Companion

Tenki is a premium, personal outdoor companion mobile application built with **React Native** and **Expo SDK 56**. It integrates with the **WeatherAI REST API** (`https://api.weather-ai.co`) for weather forecasts, custom tree canopy analytics, and usage billing.

This documentation describes **how the WeatherAI API is consumed** and provides a **step-by-step guide to exporting the app as an installable Android APK**.

---

## 📖 Table of Contents
1. [WeatherAI API Integration Guide](#-weatherai-api-integration-guide)
   - [Authentication](#authentication)
   - [API Client (Axios)](#api-client-axios)
   - [Endpoint Consumption & Parameters](#endpoint-consumption--parameters)
   - [Caching & Offline Architecture](#caching--offline-architecture)
   - [Error Normalization & Fail-safes](#error-normalization--fail-safes)
2. [How to Build & Export as an Installable APK](#-how-to-build--export-as-an-installable-apk)
   - [Step 1: Install EAS CLI](#step-1-install-eas-cli)
   - [Step 2: Configure Android Package in `app.json`](#step-2-configure-android-package-in-appjson)
   - [Step 3: Create EAS Build Configuration (`eas.json`)](#step-3-create-eas-build-configuration-easjson)
   - [Step 4: Login & Initialize EAS](#step-4-login--initialize-eas)
   - [Step 5: Run the APK Build](#step-5-run-the-apk-build)
   - [Step 6: Install the APK on Your Device](#step-6-install-the-apk-on-your-device)
3. [Architecture & State Management](#-architecture--state-management)
4. [Developer Setup & Local Running](#-developer-setup--local-running)
5. [Project Directory Structure](#-project-directory-structure)

---

## 🔌 WeatherAI API Integration Guide

Tenki utilizes the WeatherAI REST API for weather data, geolocation fallback, tree analysis, and quota tracking.

### Authentication
All API requests require a WeatherAI bearer key, set in your `.env` file as `EXPO_PUBLIC_WEATHER_AI_API_KEY`.
The Axios client automatically fetches this token and appends it to request headers:
```typescript
axiosClient.interceptors.request.use((config) => {
  const key = getApiKey();
  config.headers.Authorization = `Bearer ${key}`;
  return config;
});
```

### API Client (Axios)
Located at `src/api/client.ts`, the client exposes typed wrappers for common HTTP request structures:
* `get<T>(path, params)` — Query endpoints with params.
* `postForm<T>(path, formData)` — Post multipart data (image uploads).

---

### Endpoint Consumption & Parameters

#### 1. Weather Forecasts (`/v1/weather`)
Used on both the **Today (Home)** screen and the **Forecast** screen to fetch weather conditions.
* **Parameters passed:**
  * `lat` / `lon` (float): Geographic coordinates of location.
  * `days` (int): Number of days of forecast needed (e.g., `1` for TodayScreen, `7` for ForecastScreen).
  * `units` (`'metric'` | `'imperial'`): Toggle metric scale.
  * `ai` (boolean): `true` on TodayScreen to fetch Gemini AI weather summaries; `false` on forecast screens to preserve API quota.
* **UI Mapping:**
  * Maps response `current` variables to temperature, wind speed, pressure, and UV index.
  * Maps response `hourly` array to 24h cards and dry/wet window calculators.
  * Maps response `daily` array to 7-day high/low temperature lists.

#### 2. IP Geolocation Lookup (`/v1/weather-geo`)
Used as an automatic fallback if a user denies location permissions on startup.
* **Parameters passed:** `ip=auto` and `ai=false`.
* **Behavior:** Resolves the user's latitude and longitude from their IP address, allowing Tenki to display local weather updates seamlessly.

#### 3. Tree Canopy Image Analysis (`/v1/trees/analyze`)
Enables forestry canopy health tracking on the **Trees Screen**.
* **Request Format:** `multipart/form-data`
* **Fields Sent:**
  * `image` (binary): The selected image file.
  * `farmerId` / `county` / `landAcres` / `location` / `notes` (optional metadata).
* **Response Mapping:**
  * `tree_count`: Total number of trees detected in the photo.
  * `canopy_coverage_percentage`: Density of canopy.
  * `health_breakdown` (`healthy`, `needs_care`, `needs_replacement`).
  * `overlay_image_url`: Annotated overlay image from WeatherAI.
  * `ai_analysis`: A detailed bulleted list of observations and recommendations.

#### 4. Tree Analysis History (`/v1/trees/history`)
Lists previous analyses on the **History Screen**.
* **Parameters passed:** `limit` (max records per page, e.g., 20) and `cursor` (pagination offset token).
* **Behavior:** Supports endless scrolling through historical logs.

#### 5. Quotas & Limits (`/v1/usage` & `/v1/trees/quota`)
Displayed on the **Usage Screen** to render real-time progress bars tracking request balances.
* **Behavior:** Fetches billing period limits, remaining credits, and monthly reset dates.

---

### Caching & Offline Architecture
To conserve the WeatherAI free plan limits (1,000 requests/mo, 200 AI summaries/mo, 5 tree uploads/mo), Tenki implements an AsyncStorage-backed cache (`src/utils/cache.ts`).

Each data type is assigned a strict **Time-To-Live (TTL)**:
* **Current Weather:** **10 minutes**
* **Daily Forecast:** **30 minutes**
* **Hourly Forecast:** **15 minutes**
* **Usage Quotas:** **5 minutes**
* **Tree Analyses:** **Indefinite** (stored locally)

**Offline Behavior:** When a network call fails, Tenki intercepts the error and retrieves the last cached entry from AsyncStorage, ensuring the app remains usable offline.

---

### Error Normalization & Fail-safes
The Axios response interceptor intercepts raw HTTP error codes and returns human-friendly responses:
* **401:** `"Invalid API key. Check your .env configuration."`
* **403:** `"This feature is not available on your plan."`
* **429:** `"Monthly quota exceeded. Try again after reset."`
* **500 / 503:** `"Server error. Please try again."`
* **Network Failures:** `"Network error. Check your connection."`

---

## 📦 How to Build & Export as an Installable APK

To build an installable Android Application Package (APK) for testing on physical devices or sharing, use **Expo Application Services (EAS)**.

### Step 1: Install EAS CLI
Install the EAS command-line tools globally on your development machine:
```bash
npm install -g eas-cli
```

### Step 2: Configure Android Package in `app.json`
Open `app.json` in the root of the project and define a unique package identifier inside the `android` configuration object:
```json
{
  "expo": {
    "name": "tenki",
    "slug": "tenki",
    "version": "1.0.0",
    "android": {
      "package": "com.oliver.tenki",
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png"
      }
    }
  }
}
```

### Step 3: Create EAS Build Configuration (`eas.json`)
Create a file named `eas.json` in the root directory. This configures EAS to build an installable `.apk` file (distribution format) rather than a `.aab` file (which is intended for Google Play Store upload):

```json
{
  "cli": {
    "version": ">= 9.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

### Step 4: Login & Initialize EAS
1. **Login** to your Expo Account (sign up at [expo.dev](https://expo.dev) if you don't have one):
   ```bash
   eas login
   ```
2. **Initialize** EAS inside your project directory:
   ```bash
   eas project:init
   ```

### Step 5: Run the APK Build
Run the build command for Android pointing to the `preview` profile:
```bash
eas build --platform android --profile preview
```

> [!IMPORTANT]
> **React 19 Peer Dependency Troubleshooting:**
> Since this project runs on **React 19** and uses several packages built for React 18 (e.g. `lucide-react-native`, `@gluestack-ui/core`), `npm ci` may fail during the cloud build with an `ERESOLVE` peer dependency mismatch error.
> 
> To resolve this automatically, we have created an `.npmrc` file at the root of the project with:
> ```ini
> legacy-peer-deps=true
> ```
> This forces the Expo EAS Cloud build server to ignore the strict peer dependency checks and install successfully without any compilation errors.

#### What happens during the build:
1. EAS CLI uploads the project configuration to the Expo cloud build servers.
2. It will ask if you want to generate a keystore (Android signing credentials). Select **Yes** to let Expo handle it automatically.
3. The build gets queued on Expo's remote servers. You can safely close your terminal; the build process continues in the cloud.

---

### Step 6: Install the APK on Your Device
Once the build completes (usually takes 5–10 minutes):
1. The terminal will display a **QR Code** and a **Direct Download Link**.
2. **Scan the QR Code** with your Android device or copy the download link into your phone's browser.
3. Download the `.apk` file.
4. **Allow Installation from Unknown Sources:**
   * Go to Android **Settings** ➔ **Apps** ➔ **Special app access** ➔ **Install unknown apps**.
   * Toggle permissions for your browser (Chrome/Firefox) or File Manager.
5. Open the downloaded `.apk` file and tap **Install** to enjoy Tenki!

---

## 🏗️ Architecture & State Management

Tenki utilizes a decoupled, state-driven model utilizing **Zustand** stores for lightweight reactivity and persistence:
* **`weatherStore.ts`**: Coordinates active weather data, unit systems, and fetching actions.
* **`treesStore.ts`**: Manages uploaded tree counts, canopy statistics, and history pagination.
* **`remindersStore.ts`**: Toggles alerts (rain, flood, wind, frost) and lead times, persisting updates using `AsyncStorage`.
* **`onboardingStore.ts`**: Controls wizard slides progress and location coordinate caches.
* **`authStore.ts`**: Stub authentication state.

---

## 🚀 Developer Setup & Local Running

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Configure Variables:**
   Create a `.env` file in the root directory containing your WeatherAI token:
   ```env
   EXPO_PUBLIC_WEATHER_AI_API_KEY=wai_your_api_key_here
   ```
3. **Run Dev server:**
   ```bash
   npx expo start -c
   ```
   *Press `a` to run on an Android emulator or scan the QR code using the **Expo Go** application on your physical device.*

---

## 📂 Project Directory Structure

```
tenki/
├── assets/                     # App icons & onboarding hero assets
├── src/
│   ├── api/                    # Axios client and endpoint modules
│   │   ├── client.ts           # Bearer token interceptor and errors
│   │   ├── weather.ts          # Forecast endpoints
│   │   └── trees.ts            # Forestry analysis endpoints
│   ├── components/             # Reusable UI component modules
│   │   ├── ui/                 # Design system components
│   │   └── shared/             # Tab Bar & headers
│   ├── hooks/                  # Geolocation and weather lifecycle hooks
│   ├── navigation/             # Bottom tab & screen stacks
│   ├── screens/                # User dashboard screens
│   │   ├── onboarding/         # Onboarding walkthrough pages
│   │   ├── TodayScreen.tsx     # Home page dashboard
│   │   └── TreesScreen.tsx     # Canopy manager
│   ├── store/                  # Zustand state stores
│   ├── theme/                  # Theme colors and typography tokens
│   └── utils/                  # Cache engine and calculations
├── App.tsx                     # Entry point
├── app.json                    # Expo configuration
├── eas.json                    # EAS build settings (configures APK outputs)
└── tailwind.config.js          # Styling configurations
```

---

## 📱 Screenshots

The app features a modern dark theme with a card-based layout and personalized weather insights:

### Today Screen
Main dashboard showing current weather status ("Grab your umbrella!"), best window for outdoor activities, and 4-tile metric layout (wind speed, rain chance, pressure, UV index). Also displays hourly forecast and sunrise/sunset times.

<div style="display: flex; gap: 10px;">
  <img src="./assets/Screenshot%20/Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-06-06%20at%2015.07.46.png" width="250" alt="Today screen">
  <img src="./assets/Screenshot%20/Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-06-06%20at%2015.09.46.png" width="250" alt="Today screen with forecast">
</div>

### Alerts Screen
Customizable weather reminders with toggle switches for rain, heavy rain/floods, strong wind, cold mornings, and dry window notifications. Each reminder shows configurable lead time.

![Alerts Screen](./assets/Screenshot%20/Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-06-06%20at%2015.09.09.png)

### Forecast Screen
Calendar view with daily forecasts, daily high/low temperature graph, hourly breakdown, and rain probability timeline. Swipe between months for extended forecast.

<div style="display: flex; gap: 10px;">
  <img src="./assets/Screenshot%20/Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-06-06%20at%2015.09.04.png" width="250" alt="Forecast calendar">
  <img src="./assets/Screenshot%20/Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-06-06%20at%2015.09.52.png" width="250" alt="Forecast details">
</div>

### Farm & Trees Screen
Tree canopy analysis interface for forestry tracking. Upload farm images via camera or gallery with optional fields (Farmer ID, County, Notes). Displays tree count, canopy coverage %, health breakdown, and AI observations.

![Farm & Trees Screen](./assets/Screenshot%20/Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-06-06%20at%2015.09.13.png)

### Settings & Usage Screen
Account information (plan type, reset date), API quota dashboard (standard requests, AI summaries, tree analyses), and theme preferences. Shows real-time usage tracking.

![Settings & Usage Screen](./assets/Screenshot%20/Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-06-06%20at%2015.09.33.png)

### API Lab Screen
Developer sandbox for experimenting with WeatherAI endpoints. Features pre-built use cases like "Week at a Glance", "Travel Mode (IP)", "Rain Window", and "Golden Hour Pick" with cost indicators.

![API Lab Screen](./assets/Screenshot%20/Simulator%20Screenshot%20-%20iPhone%2017%20Pro%20Max%20-%202026-06-06%20at%2015.09.40.png)
