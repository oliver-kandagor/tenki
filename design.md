# Tenki — Design System

**Tenki** is a **personal outdoor companion**, not a generic weather dashboard. It answers simple questions:

- *Can I go outside?*
- *Do I need my umbrella?*
- *When is the best time today for **my** activities?*

**Source of truth:** Every screen and component must follow this file. Do not invent one-off colors, radii, or copy styles in individual screens.

**Visual inspiration:** Dark, calm UI with **violet primary** accents (see reference mockups in `/assets` and Pinterest boards). Custom icons and photography replace stock/AI-looking assets.

**Audience:** **So simple a 10-year-old boy can understand it** — clear, friendly, and engaging. Use **plain language for everyone** (short sentences, one main action per screen, big tap targets). Avoid jargon and complex weather terms.

---

## 1. Brand personality

| Trait | Means |
|--------|--------|
| **Friendly** | Talk like a helpful friend, not a scientist |
| **Calm & Cool** | Dark backgrounds, soft contrast, inspired by modern Pinterest aesthetics |
| **Personal** | “Your walk”, “Your farm”, “Your alerts” — this is a personal companion |
| **Trustworthy** | Show where data comes from and when it was updated |
| **Engaging** | Beautiful custom icons; interactive and visually pleasing so users *want* to use it |

**App name in UI:** **Tenki** (title case in headers only).

**Words we use / avoid**

| Use | Avoid |
|-----|--------|
| It's going to rain! | Precipitation expected |
| Grab your umbrella! | Carry rain gear |
| Great time to play outside! | Favorable conditions |
| Better stay inside | Adverse meteorological |
| Best time to go out | Optimal temporal window |
| Flood warning | Hydrological event |

---

## 2. Color tokens

Apply via `src/theme/tokens.ts`. **Never hard-code hex in screens** — import tokens.

### 2.1 Core palette (dark mode — default)

| Token | Hex | Usage |
|--------|-----|--------|
| `background.root` | `#0B0B0E` | Full screen behind everything |
| `background.elevated` | `#141418` | Tab bar, sticky headers |
| `surface.card` | `#1C1C22` | Cards, list rows |
| `surface.cardHover` | `#24242C` | Pressed card state |
| `surface.inset` | `#121216` | Inputs, map chrome |
| `border.subtle` | `#2A2A32` | Card borders, dividers |
| `border.focus` | `#FFFFFF` | Selected activity / focus ring |
| `text.primary` | `#F5F5F7` | Headlines, main numbers |
| `text.secondary` | `#9B9BA6` | Hints, metadata |
| `text.muted` | `#6B6B76` | Timestamps, captions |
| `primary.default` | `#8B5CF6` | Primary buttons, active tab |
| `primary.pressed` | `#7C3AED` | Button pressed |
| `primary.muted` | `#8B5CF633` | Soft glow, map dots |
| `success.default` | `#34D399` | Verified, “good to go” |
| `warning.default` | `#FBBF24` | Rain soon, moderate risk |
| `danger.default` | `#F87171` | Flood/storm, stay inside |
| `info.default` | `#60A5FA` | Tips, links |

### 2.2 Metric icon colors (fixed — do not change per screen)

Each weather number gets **one** accent color on its icon background circle:

| Metric | Token | Hex | Icon bg |
|--------|--------|-----|---------|
| Temperature | `metric.temp` | `#34D399` | 12% opacity fill |
| Humidity | `metric.humidity` | `#60A5FA` | 12% opacity fill |
| Wind | `metric.wind` | `#F87171` | 12% opacity fill |
| Pressure | `metric.pressure` | `#FB923C` | 12% opacity fill |
| Rain | `metric.rain` | `#60A5FA` | 12% opacity fill |
| Trees / nature | `metric.trees` | `#4ADE80` | 12% opacity fill |

### 2.3 Outdoor status colors

| Status | Background | Text | Example label |
|--------|------------|------|----------------|
| Ready | `#34D39922` | `#34D399` | Outdoor ready |
| Caution | `#FBBF2422` | `#FBBF24` | Take umbrella |
| Stay in | `#F8717122` | `#F87171` | Stay inside |

### 2.4 Light mode (Phase 2b — optional)

Not required for first design pass. When added, mirror token names under `light.*` in `themeStore`.

---

## 3. Typography

**Font:** System default (SF Pro / Roboto). No custom font files until brand font is chosen.

| Token | Size | Weight | Line height | Use |
|--------|------|--------|-------------|-----|
| `type.hero` | 28 | 700 | 34 | “Outdoor ready” |
| `type.title` | 22 | 700 | 28 | Screen titles |
| `type.section` | 17 | 600 | 24 | Section headers |
| `type.body` | 16 | 400 | 24 | Paragraphs, AI summary |
| `type.bodyStrong` | 16 | 600 | 24 | Card titles |
| `type.caption` | 13 | 400 | 18 | “Updated 5 min ago” |
| `type.label` | 12 | 600 | 16 | Badges, tab labels |
| `type.metric` | 32 | 700 | 38 | Big temperature number |
| `type.button` | 17 | 600 | 22 | Primary button label |

**Rules**

- Max **2 font sizes** in one card (title + value).
- AI summaries: `type.body`, `text.secondary`, max 4 lines then “Read more”.
- Numbers always `text.primary` + `type.metric` or `type.bodyStrong`.

---

## 4. Spacing & layout

| Token | Value | Use |
|--------|-------|-----|
| `space.xs` | 4 | Icon gaps |
| `space.sm` | 8 | Inside chips |
| `space.md` | 12 | Card inner padding (compact) |
| `space.lg` | 16 | Screen horizontal padding |
| `space.xl` | 20 | Between sections |
| `space.2xl` | 24 | Below hero |
| `space.3xl` | 32 | Onboarding |

| Token | Value |
|--------|-------|
| `radius.sm` | 8 |
| `radius.md` | 12 |
| `radius.lg` | 16 |
| `radius.xl` | 20 |
| `radius.pill` | 999 |

**Screen layout**

- Horizontal padding: **`space.lg` (16)** on all screens.
- Scroll content bottom padding: **100** (clear tab bar).
- Min touch target: **48×48** pt.

---

## 5. Elevation & depth

No heavy shadows. Depth = **surface color step** + **1px border**.

```
Card = surface.card + border 1px border.subtle + radius.lg
Selected card = same + border 2px border.focus
Primary button = primary.default fill, no border, radius.pill
```

**Map / hero areas:** Optional subtle gradient overlay `linear-gradient(transparent, background.root)` on bottom 40% of hero image.

---

## 6. Icons & imagery

### 6.1 Icons (custom — your assets)

- Location: `assets/icons/` — PNG or SVG via `expo-image` / `react-native-svg`.
- **Sizes:** `sm` 20, `md` 24, `lg` 32, `xl` 48 (activity grid).
- **Style:** Custom-made rounded, colorful glyphs on transparent OR on 40×40 circle with 12% metric tint (see §2.2).
- **Do not use** emoji in production UI. Use the custom-made icons to make it feel premium.
- **Tab bar:** Line-style icons, 24px; active = `primary.default` + optional dot below (see reference).

**Naming convention**

```
icon-activity-hiking.png
icon-weather-rain.png
icon-nav-today.png
icon-metric-wind.png
```

### 6.2 Photography (Pinterest / licensed)

- Hero backgrounds: `assets/images/hero/` — Pinterest-inspired moody outdoor photography, dark enough for white text overlay. This makes the app look less AI-generated and more natural/premium.
- Onboarding: **full-bleed** `onboarding-bg.jpeg` only (see §8.2); scrim **55–65%** black.
- Other heroes: `assets/images/hero/` with scrim 40–60% under text.

---

## 7. Core components

Build once under `src/components/ui/`. Screens compose these only.

### 7.1 `AppScreen`

- Safe area + `background.root`.
- Optional `title`, `subtitle`, `rightAction`.
- Handles scroll vs fixed footer CTA.

### 7.2 `Card`

| Prop | Rule |
|------|------|
| Padding | `space.lg` |
| Radius | `radius.lg` |
| Background | `surface.card` |
| Border | 1px `border.subtle` |

Variants: `default` | `inset` | `status` (tinted left border 4px).

### 7.3 `MetricTile` (2×2 grid — reference screen 2)

```
┌─────────────────┐
│  [icon circle]  │
│  Label (caption)│
│  68°F  (metric) │
│  20°C  (muted)  │
└─────────────────┘
```

- Square aspect ~1:1, min height 100.
- Icon in 40×40 circle with metric color at 12% fill.

### 7.4 `ActivityChip` / `ActivityCard` (onboarding grid)

- 2 columns, gap `space.md`.
- Each cell: icon (left aligned) + label `type.bodyStrong`.
- **Selected:** 2px `border.focus` solid white border; background `surface.cardHover`.
- **Unselected:** No border or 1px `border.subtle`.
- Height: 64px, `radius.lg`.

### 7.5 `PrimaryButton`

- Full width (minus screen padding).
- Height **52**, `radius.pill`, bg `primary.default`.
- Label `type.button`, color white.
- Pressed: `primary.pressed`, scale 0.98 (150ms).
- Disabled: 40% opacity, no press.

### 7.6 `SecondaryButton` / `TextButton`

- Secondary: outline `border.subtle`, height 48, `radius.pill`.
- Text: “Skip”, “Maybe later” — `text.secondary`, center, no fill.

### 7.7 `StatusBanner` (“Outdoor ready”)

```
[●] Outdoor ready
    Conditions are good for being outside today...
```

- Dot or icon + `type.hero` title.
- Body `type.body` `text.secondary`, max 3 lines.
- Tinted background from §2.3.

### 7.8 `InsightRow` (“Best window”)

- Horizontal `Card` with clock icon.
- Title: `type.bodyStrong` — “Best window”.
- Value: `type.body` — “10:30 AM – 3:00 PM”.
- Optional chevron if tappable.

### 7.9 `SegmentedProgress` (onboarding)

- 4–5 segments, height 4, gap 4, `radius.pill`.
- Filled: `primary.default`; empty: `surface.inset`.

### 7.10 `ListRow`

- Label left `text.secondary`, value right `text.primary`.
- Height min 44, divider `border.subtle` except last.

### 7.11 `TabBar` (bottom nav)

Inspired by reference — **4–5 tabs max:**

| Tab | Role |
|-----|------|
| **Today** | Home — outdoor status + brief |
| **Map** | Location / stations (future) |
| **Alerts** | Reminders & rain/flood warnings |
| **Trees** | Canopy / farm (existing feature) |
| **You** | Profile, activities, settings |

- Bar: `background.elevated`, top border `border.subtle`.
- Active: icon `primary.default` + small dot 4×4 under icon.
- Labels: `type.label`.

### 7.12 `EmptyState` / `ErrorState`

- Illustration or large icon 64px.
- Title `type.section` — human message (“We couldn’t load weather”).
- One `PrimaryButton` “Try again”.
- No stack traces, no JSON.

### 7.13 `Skeleton`

- Shimmer on `surface.inset` blocks, `radius.md`.
- Match final layout shape (not generic spinner).

### 7.14 Onboarding-only components

| Component | Role |
|-----------|------|
| `OnboardingBackground` | `ImageBackground` + scrim + safe area |
| `IntroSlide` | One intro page: `type.hero` title + `type.body` body |
| `GetStartedScreen` | Landing: brand + tagline + single `PrimaryButton` “Get started” |
| `GoogleAuthStub` | Fake Google CTA + dev caption; calls `signInWithGoogleStub()` |
| `NotificationPrefs` | Three channel rows with switches |
| `FrequencyPicker` | Daily / Weekly / Monthly selectable cards |
| `LocationEditor` | Name, optional lat/lon, `IconSelector` |
| `IconSelector` | Preset icons: home, work, pin, beach, tree, farm, golf, run |
| `OnboardingStepShell` | Progress bar + title + scroll body + footer CTAs |

### 7.15 `ReminderCard` (personal app core)

```
┌──────────────────────────────────────┐
│ 🌧️  Rain reminder          [toggle] │
│     Tell me before it rains           │
│     🔔 1 hour before                  │
└──────────────────────────────────────┘
```

- Icon + title + short description + switch.
- Tap row → edit lead time (15 min / 1 hr / morning of).

**Reminder types (plain language)**

| Type | Title | Description |
|------|--------|-------------|
| rain | Rain reminder | Tell me when to grab my umbrella |
| flood | Heavy rain & floods | Tell me when it’s too wet outside |
| wind | Strong wind | Tell me when hats fly away |
| frost | Cold morning | Tell me when to wear a warm coat |
| dry_window | Dry time | Tell me the best time to go outside |

### 7.16 `Toast` / `Snackbar`

- Bottom above tab bar, `surface.card`, `radius.lg`, 3s auto dismiss.
- Example: “Reminder saved” / “Umbrella alert on”.

---

## 8. Screen patterns

### 8.1 Today (Home) — primary screen

Structure (top → bottom):

1. **Hero** — status (“Outdoor ready”) + 1–2 sentence plain summary.
2. **Best window** — `InsightRow` (from hourly API).
3. **Right now** — big temp + condition icon + location name.
4. **Quick metrics** — 2×2 `MetricTile` grid.
5. **Umbrella hint** — only if rain in next 12h: `StatusBanner` caution “Take your umbrella”.
6. Optional: expand AI summary in `Card`.

### 8.2 First-launch onboarding flow

**Order (OnboardingStack):**

1. **Get Started** — landing with single large pill CTA; no login; feels pressable (`PrimaryButton` scale 0.98).
2. **Intro slides (×3)** — swipeable: problem → pain → Tenki as solution (`IntroSlide`).
3. **Google sign-in** — dev stub: tap = continue (`GoogleAuthStub`; no real OAuth in MVP).
4. **Activities** — title *“What do you do outdoors regularly?”*, subtitle, **5-segment progress (step 1/5)**, 2-column grid, white border when selected, Continue + Skip.
5. **Notification preferences** — enable alerts; toggles for **Email**, **SMS/Message**, **WhatsApp** (UI-only stubs OK).
6. **Update frequency** — **Daily** / **Weekly** / **Monthly** (`FrequencyPicker` chips/cards).
7. **Saved locations** — Home, Work, Custom; name + optional lat/lon + **icon picker** (`LocationEditor` + `IconSelector`).
8. **Welcome (optional)** — short confirmation; **5/5** progress; completes onboarding → main app.

**Activities (fixed list):** Running, Cycling, Gardening, Golf, Beach, Hiking, Kids sports, Dog walking, Surfing, Sailing, Farming, Flying.

**Onboarding background (onboarding screens only)**

- Asset: `assets/images/onboarding-bg.jpeg` (source: `assets/images/_ (4).jpeg`).
- Layout: `ImageBackground` with `resizeMode="cover"`, full bleed.
- **Scrim:** `rgba(0,0,0,0.55)`–`0.65` overlay (`colors.scrim` ≈ 60%) for text readability.
- Content: inside `SafeAreaView`; horizontal padding `space.lg`.
- Do **not** use this photo on Home, Forecast, or tab screens.

**Persistence:** `onboardingStore` (AsyncStorage key `@tenki/onboarding`) — activities, channels, frequency, locations, `hasCompletedOnboarding`.

### 8.3 Alerts

- List of `ReminderCard` with toggles.
- “Test alert” secondary button (dev only).
- Section: “What happened today” — past notifications log (local).

### 8.4 Forecast

- Horizontal **hour pills** (time + small icon + temp).
- Vertical **day rows** — day name, icon, hi/lo plain words.
- Units toggle in header as `SecondaryButton` chip.

### 8.5 Station detail (optional — reference screen 2)

- Header: place name + “Updated X ago”.
- `ListRow` station metadata.
- `MetricTile` grid.
- Trust footer: verified source with `success` check icon.

### 8.6 Trees / Farm

- Keep analysis flow; wrap in `AppScreen` + `Card`.
- Results: big numbers + simple health labels (“Healthy trees”, “Need help”).

---

## 9. Motion & interaction

| Interaction | Spec |
|-------------|------|
| Button press | Scale 0.98, 150ms |
| Card press | Opacity 0.9, 100ms |
| Screen enter | Fade + slide up 8px, 250ms |
| Pull to refresh | Native refresh control, tint `primary.default` |
| Toggle | System switch tinted `primary.default` |
| List scroll | Bounce enabled, no horizontal unless hourly |

**Haptics:** Light impact on reminder toggle save, success on analysis complete.

---

## 10. Copy & accessibility

- **Reading level:** Plain language for everyone (roughly grade 6–8 max; no idioms).
- **Sentence length:** ≤ 12 words in banners.
- **Accessibility:** All icons have `accessibilityLabel`; contrast ≥ 4.5:1 for body text on cards.
- **Numbers:** Always show units in words once per screen (“68 degrees” in voice-over label even if UI shows `68°F`).

---

## 11. File & asset checklist

```
assets/
  icons/          # custom nav, weather, activities, metrics
  images/hero/    # Pinterest-sourced heroes (license tracked)
  images/onboard/
src/theme/
  tokens.ts
  typography.ts
  ThemeProvider.tsx
src/components/ui/
  (components listed in §7)
```

---

## 12. Implementation order (design pass)

1. `tokens` + `ThemeProvider` + navigation theme.
2. `AppScreen`, `Card`, `PrimaryButton`, `MetricTile`, `StatusBanner`.
3. Refactor **Today** (Home) to match §8.1.
4. **Alerts** screen + reminder store.
5. Onboarding + activity preferences.
6. Forecast, Trees, Usage, Lab — apply same components.
7. Swap emoji → custom icons; add hero images.

---

## 13. Reference alignment (mockup)

Your Pinterest reference reinforces:

- Dark charcoal canvas, **violet CTA** buttons (pill shape).
- **Activity grid** with white border selection.
- **2×2 metric cards** with colored icon circles.
- **Outdoor ready** conversational headline.
- **Best window** time range card.
- Bottom nav with **dot indicator** on active tab.

Tenki adapts this language for **Kenya/East Africa context** (WeatherAI API, farming, Swahili option) while keeping the same visual DNA.
