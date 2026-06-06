---
name: weather-ai
description: >
  Fetch real-time weather, multi-day forecasts, hourly data, and AI-generated
  summaries from the WeatherAI REST API (https://api.weather-ai.co). Also
  handles tree/canopy analysis via image upload, usage quota checks, webhook
  subscriptions (Pro+), and SMS/USSD delivery (Scale only). Use this skill
  whenever the Tenki app needs to call any WeatherAI endpoint.
---

# WeatherAI Skill

## Overview

This skill encapsulates all interactions with the **WeatherAI REST API** (`https://api.weather-ai.co`).

It covers:
- Weather data (current, daily, hourly, forecast, AI insights)
- Account & usage quota
- Trees / Agroforestry image analysis
- Webhooks (Pro+)
- SMS / USSD delivery (Scale only)

---

## Authentication

Every request MUST include the API key as a Bearer token in the `Authorization` header.

```
Authorization: Bearer wai_<your_api_key>
```

The key is stored in `.env` as `EXPO_PUBLIC_WEATHER_AI_API_KEY` and injected via the Axios client in `src/api/client.ts`. **Never hard-code the key in source files.**

---

## Plans & Rate Limits

| Plan | Requests/mo | AI Requests/mo | Forecast days | Webhooks | SMS/USSD | Seats |
|------|-------------|----------------|---------------|----------|----------|-------|
| Free | 1,000 | 200 | 7 | ✕ | ✕ | 1 |
| Pro | 50,000 | 10,000 | 14 | ✓ (up to 10) | ✕ | 5 |
| Scale | 500,000 | 100,000 | 16 | ✓ (up to 50) | ✓ (approval req.) | 20 |

> **Quota tip:** Add `?ai=false` to any weather request to skip Gemini AI summaries and preserve AI quota.

### Rate Limit Headers

```
X-RateLimit-Limit:     50000       # monthly cap
X-RateLimit-Remaining: 49987       # requests remaining
X-RateLimit-Reset:     1717977600  # unix epoch reset time
```

---

## Error Codes

| Status | Meaning | Common Cause |
|--------|---------|--------------|
| 401 | Unauthorized | Missing, malformed, or revoked API key |
| 403 | Forbidden | Plan doesn't include this feature; SMS not yet enabled |
| 429 | Too Many Requests | Monthly quota exceeded — check `X-RateLimit-Reset` |
| 400 | Bad Request | Missing required parameters |
| 500 | Internal Error | Server-side issue — retry with exponential backoff |
| 503 | Service Unavailable | Database unreachable — fail-closed for SMS gates |

---

## Weather Endpoints

### GET /v1/weather
Full weather response: current + multi-day forecast + AI summary.

**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `lat` | float | ✓ | Latitude e.g. `-1.2921` |
| `lon` | float | ✓ | Longitude e.g. `36.8219` |
| `days` | integer | — | Forecast days (1–7 Free, 1–14 Pro, 1–16 Scale). Default: 7 |
| `ai` | boolean | — | Include AI summary. Default: `true` |
| `units` | string | — | `metric` (°C) or `imperial` (°F). Default: `metric` |
| `lang` | string | — | Language code for AI summary e.g. `en`, `sw`. Default: `en` |

**Usage in Tenki:**
```typescript
import { getWeather } from '@/api/weather';
const data = await getWeather({ lat, lon, days: 7, ai: true, units: 'metric' });
```

---

### GET /v1/forecast
Alias endpoint — same parameters and response shape as `/v1/weather`. Use for forecast-focused screens.

---

### GET /v1/current
Current conditions only (no multi-day array).

**Parameters:** Same as `/v1/weather` (`lat`, `lon`, `ai`, `units`, `lang`). `days` is ignored.

**Usage in Tenki:**
```typescript
import { getCurrent } from '@/api/weather';
const current = await getCurrent({ lat, lon, ai: true, units: 'metric' });
```

---

### GET /v1/daily
Day-by-day breakdown for the number of days requested.

**Parameters:** Same as `/v1/weather`.

**Usage in Tenki (Forecast screen - daily section):**
```typescript
import { getDaily } from '@/api/weather';
const daily = await getDaily({ lat, lon, days: 7, units: 'metric' });
```

---

### GET /v1/hourly
Hour-by-hour breakdown.

**Parameters:** Same as `/v1/weather` (`days` controls how many days of hours are returned).

**Usage in Tenki (Forecast screen - hourly section):**
```typescript
import { getHourly } from '@/api/weather';
const hourly = await getHourly({ lat, lon, days: 1, units: 'metric' });
```

---

### GET /v1/forecast14 ⚡ PRO+
14-day extended forecast. Same parameters as `/v1/weather`.

---

### GET /v1/insights ⚡ PRO+
AI-powered weather insights and recommendations beyond the standard summary.

---

### GET /v1/weather-geo
Weather via IP auto-detection (no lat/lon needed).

**Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `ip` | string | — | Set to `auto` to use the caller's IP |
| `days` | integer | — | Same as `/v1/weather` |
| `ai` | boolean | — | Include AI summary. Default: `true` |

**Usage in Tenki (IP fallback when GPS is denied):**
```typescript
import { getWeatherGeo } from '@/api/weather';
const data = await getWeatherGeo({ ip: 'auto', days: 7 });
```

---

### GET /v1/ip-lookup ⚡ PRO+
Resolve an IP address to geographic coordinates without fetching weather.

---

## Account Endpoint

### GET /v1/usage
Returns request counts, AI request counts, plan limits, and billing period start/end.

**No query parameters.**

**Usage in Tenki (Usage/You screen):**
```typescript
import { getUsage } from '@/api/account';
const usage = await getUsage();
// usage.requests_used, usage.ai_requests_used, usage.plan_limit, etc.
```

---

## Trees / Forestry Endpoints

### POST /v1/trees/analyze
Upload a farm image (drone, aerial, satellite) as `multipart/form-data`. Returns tree count, density, health breakdown, annotated overlay image, and Gemini AI agronomic observations.

**Form Fields:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | file | ✓ | JPEG, PNG, or WEBP — max 20 MB |
| `farmerId` | string | — | Your farmer/plot identifier — echoed in response |
| `county` | string | — | County or region — provides context for Gemini |
| `landAcres` | float | — | Plot size in acres — enables `tree_density_per_acre` |
| `location` | string | — | Human-readable farm name or GPS description |
| `notes` | string | — | Extra context for Gemini e.g. "Tea plantation, recently pruned" |

**Plan limits:** Free = 5/mo, Pro = 100/mo, Scale = Unlimited.

**Usage in Tenki:**
```typescript
import { analyzeTrees } from '@/api/trees';
const result = await analyzeTrees(imageUri, { farmerId, county, landAcres, notes });
```

**Response shape:**
```json
{
  "analysis_id": "Kx8mP2qRvTnZ",
  "timestamp": "2026-06-01T09:15:00.000Z",
  "farmer_id": "F-001",
  "county": "Bomet",
  "location": "Kapkimolwa Farm, Block C",
  "land_acres": 2.5,
  "total_tree_count": 84,
  "tree_density_per_acre": 33.6,
  "confidence_score": 0.87,
  "canopy_coverage_pct": 41.2,
  "tree_health": {
    "healthy": 68,
    "needs_care": 12,
    "needs_replacement": 4
  },
  "low_confidence": false,
  "tree_species_guess": "Tea (Camellia sinensis)",
  "observations": ["Dense canopy in northern quadrant..."],
  "recommendations": ["Consider thinning northern section..."],
  "original_image_url": "https://storage.googleapis.com/.../original.jpg",
  "overlay_image_url": "https://storage.googleapis.com/.../overlay.jpg",
  "cv_debug": {
    "orig_resolution": "4000x3000",
    "work_resolution": "1500x1125",
    "canopy_px": 412500,
    "peaks_detected": 91,
    "after_area_filter": 84
  }
}
```

---

### GET /v1/trees/history
Paginated list of past tree analyses for the authenticated account.

**Usage in Tenki (Trees History screen):**
```typescript
import { getTreesHistory } from '@/api/trees';
const history = await getTreesHistory({ limit: 20, cursor: nextCursor });
```

---

### GET /v1/trees/quota
Remaining tree analyses this billing period.

**Usage in Tenki (Usage/You screen):**
```typescript
import { getTreesQuota } from '@/api/trees';
const quota = await getTreesQuota();
// quota.used, quota.limit, quota.remaining
```

---

### POST /v1/forestry/count-trees
Lower-level tree count endpoint (CV only, no full Gemini analysis). Use for quick counts without full agronomic recommendations.

---

## Webhooks ⚡ PRO+

Subscribe to weather trigger events. WeatherAI POSTs to your URL when conditions are met.

### POST /v1/webhooks — Create webhook
### GET /v1/webhooks — List webhooks
### DEL /v1/webhooks/:id — Delete webhook

---

## SMS / USSD ⚡ SCALE ONLY

Programmatic SMS delivery and farmer registration. Requires Scale plan + admin compliance approval.

> **Warning:** SMS routes require (1) Scale plan and (2) `smsEnabled = true` on your account — set by admin after compliance review. Until approved, calls return `403 SMS_NOT_ENABLED`.

### POST /v1/sms/send — Send SMS
### POST /v1/sms/alert — Send weather alert via SMS
### POST /v1/sms/bomet/register — Register farmer in USSD system
### GET /v1/sms/stats — SMS delivery statistics
### GET /v1/sms/health — SMS gateway health check

---

## Firebase Callable Functions

These are Firebase HTTPS callable functions — **not plain REST**. They require an authenticated Firebase user session (no API key, but user must be signed in).

Invoke via: `httpsCallable(functions, 'functionName')(payload)`

| Function | Purpose |
|----------|---------|
| `cancelSubscription` | Cancel the active billing subscription |
| `requestSmsAccess` | Submit compliance documents for SMS access |
| `contactSales` | Send a sales inquiry |
| `getPaystackConfig` | Retrieve Paystack payment config for in-app billing |

---

## Implementation Notes for Tenki

1. **Always use `src/api/client.ts`** — the Axios instance with auth interceptor — never call `fetch` directly in screens.
2. **Cache aggressively** — use `src/utils/cache.ts` with TTLs: current weather (10 min), daily (30 min), hourly (15 min), usage (5 min).
3. **Pass `ai=false` during development** to protect the 200 AI req/mo Free quota.
4. **Tree analyses are capped at 5/mo on Free** — mock the response shape for UI iteration instead of calling the API.
5. **Handle 429 gracefully** — show "You've reached your monthly limit. Resets on [date]." — never show raw HTTP errors to users.
6. **All weather endpoints accept the same base params** — pick the most semantically appropriate one per screen (e.g. `/v1/current` for the Today screen hero, `/v1/hourly` for the hourly row).
