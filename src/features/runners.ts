import { fetchUsage } from '@/api/account';
import {
  fetchForecast14,
  fetchForecastAlias,
  fetchFullWeather,
  fetchInsights,
  fetchIpLookup,
  fetchWeatherGeoFull,
  fetchWebhooks,
  fetchCurrentLocalized,
} from '@/api/explore';
import { fetchTreesQuota } from '@/api/trees';
import {
  fetchCurrent,
  fetchHourly,
  normalizeCurrent,
  normalizeDaily,
  normalizeHourly,
  getTemperature,
} from '@/api/weather';
import type { Units } from '@/api/types';
import { analyzeRainWindow, pickGoldenHours } from '@/utils/hourlyInsights';
import { formatTemperature } from '@/utils/units';
import { weatherCodeToEmoji } from '@/utils/weatherIcons';

export interface LabSection {
  title: string;
  lines: string[];
}

export interface LabRunResult {
  sections: LabSection[];
  raw: unknown;
}

export interface LabRunContext {
  lat: number;
  lon: number;
  units: Units;
  compareLat?: number;
  compareLon?: number;
  compareName?: string;
}

export async function runLabFeature(
  featureId: string,
  ctx: LabRunContext,
): Promise<LabRunResult> {
  const { lat, lon, units } = ctx;

  switch (featureId) {
    case 'week-at-glance': {
      const data = await fetchFullWeather(lat, lon, units, 7, true);
      const current = normalizeCurrent(data);
      const daily = normalizeDaily(data);
      const temp = getTemperature(current.current);
      return {
        sections: [
          {
            title: 'Now',
            lines: [
              `${weatherCodeToEmoji(current.current.weather_code, current.current.condition)} ${formatTemperature(temp, units)} — ${current.current.condition ?? '—'}`,
            ],
          },
          {
            title: 'AI narrative',
            lines: [current.aiSummary ?? '(no AI summary in response)'],
          },
          {
            title: '7-day strip',
            lines: daily.slice(0, 7).map(
              (d) =>
                `${d.date ?? d.day ?? '?'}: ${formatTemperature(d.max_temp, units)} / ${formatTemperature(d.min_temp, units)} ${weatherCodeToEmoji(d.weather_code, d.condition)}`,
            ),
          },
        ],
        raw: data,
      };
    }

    case 'travel-mode': {
      const data = await fetchWeatherGeoFull('auto', 3, true, units);
      const loc = data.geo ?? data.location;
      const current = normalizeCurrent(data);
      return {
        sections: [
          {
            title: 'Detected location',
            lines: [
              [loc?.city, loc?.region, loc?.country].filter(Boolean).join(', ') || 'Unknown',
              loc?.lat != null ? `Coords: ${loc.lat}, ${loc.lon}` : '',
            ].filter(Boolean),
          },
          {
            title: 'Travel forecast AI',
            lines: [
              current.aiSummary ??
                data.ai_summary ??
                '(enable ai=true — included in this demo)',
            ],
          },
        ],
        raw: data,
      };
    }

    case 'rain-window': {
      const hourly = await fetchHourly(lat, lon, units, 1, false);
      const analysis = analyzeRainWindow(hourly);
      return {
        sections: [
          { title: 'Advice', lines: [analysis.advice] },
          {
            title: 'Rainy hours',
            lines:
              analysis.rainyHours.length > 0
                ? analysis.rainyHours.map(
                    (h) => `${h.label}${h.precip != null ? ` (${h.precip}% precip)` : ''}`,
                  )
                : ['None detected'],
          },
          {
            title: 'Dry streaks',
            lines:
              analysis.dryStreaks.length > 0
                ? analysis.dryStreaks.map((s) => `${s.start} → ${s.end} (${s.hours}h)`)
                : ['No 2+ hour dry windows'],
          },
        ],
        raw: { hourly, analysis },
      };
    }

    case 'golden-hour': {
      const hourly = await fetchHourly(lat, lon, units, 1, false);
      const picks = pickGoldenHours(hourly);
      return {
        sections: [
          {
            title: 'Top hours for field work',
            lines: picks.map(
              (p) => `${p.label} — score ${p.score} (${formatTemperature(p.temp, units)}, ${p.reason})`,
            ),
          },
        ],
        raw: { hourly, picks },
      };
    }

    case 'swahili-brief': {
      const data = await fetchCurrentLocalized(lat, lon, units, 'sw');
      const current = normalizeCurrent(data);
      return {
        sections: [
          {
            title: 'Muhtasari (AI)',
            lines: [current.aiSummary ?? data.ai_summary ?? 'Hakuna muhtasari'],
          },
          {
            title: 'Hali sasa',
            lines: [
              `${formatTemperature(getTemperature(current.current), units)} — ${current.current.condition ?? ''}`,
            ],
          },
        ],
        raw: data,
      };
    }

    case 'twin-cities': {
      const cLat = ctx.compareLat ?? -1.2921;
      const cLon = ctx.compareLon ?? 36.8219;
      const cName = ctx.compareName ?? 'Nairobi (default)';
      const [here, there] = await Promise.all([
        fetchCurrent(lat, lon, units, false),
        fetchCurrent(cLat, cLon, units, false),
      ]);
      return {
        sections: [
          {
            title: 'You (GPS)',
            lines: [
              `${formatTemperature(getTemperature(here.current), units)} ${here.current.condition ?? ''}`,
            ],
          },
          {
            title: cName,
            lines: [
              `${formatTemperature(getTemperature(there.current), units)} ${there.current.condition ?? ''}`,
            ],
          },
          {
            title: 'Delta idea',
            lines: [
              `Δ temp: ${Math.round((getTemperature(here.current) ?? 0) - (getTemperature(there.current) ?? 0))}°`,
              'Ship as: co-op dashboard comparing hub vs field.',
            ],
          },
        ],
        raw: { here, there },
      };
    }

    case 'farm-morning-brief': {
      const [weather, treesQ, usage] = await Promise.all([
        fetchCurrent(lat, lon, units, true),
        fetchTreesQuota(),
        fetchUsage(),
      ]);
      return {
        sections: [
          {
            title: 'Weather',
            lines: [
              `${formatTemperature(getTemperature(weather.current), units)} — ${weather.current.condition ?? ''}`,
              weather.aiSummary ?? '',
            ].filter(Boolean),
          },
          {
            title: 'Tree analyses left',
            lines: [
              `${treesQ.remaining} of ${treesQ.limit} remaining (resets ${new Date(treesQ.resets_at).toLocaleDateString()})`,
            ],
          },
          {
            title: 'API health',
            lines: [
              `Plan: ${usage.plan ?? treesQ.plan ?? '—'}`,
              `Requests: ${usage.requests?.used ?? usage.standard_requests?.used ?? '?'}/${usage.requests?.limit ?? usage.standard_requests?.limit ?? '?'}`,
            ],
          },
        ],
        raw: { weather, treesQ, usage },
      };
    }

    case 'insights-pro': {
      const data = await fetchInsights(lat, lon, units, 7);
      const summary =
        data.ai_summary ?? data.summary ?? data.ai?.summary ?? JSON.stringify(data).slice(0, 500);
      const daily = normalizeDaily(data);
      return {
        sections: [
          { title: 'AI insights', lines: [summary] },
          {
            title: 'Forecast snapshot',
            lines: daily.slice(0, 3).map((d) => `${d.date ?? d.day}: ${d.condition ?? '—'}`),
          },
        ],
        raw: data,
      };
    }

    case 'forecast-14': {
      const data = await fetchForecast14(lat, lon, units, 14, false);
      const daily = normalizeDaily(data);
      return {
        sections: [
          {
            title: '14-day outlook',
            lines: daily.map(
              (d) =>
                `${d.date ?? d.day ?? '?'} ${weatherCodeToEmoji(d.weather_code, d.condition)} ${formatTemperature(d.min_temp, units)}–${formatTemperature(d.max_temp, units)}`,
            ),
          },
        ],
        raw: data,
      };
    }

    case 'ip-detective': {
      const data = await fetchIpLookup('auto');
      const g = data.geo;
      return {
        sections: [
          {
            title: 'Your IP',
            lines: [
              data.ip ?? '—',
              g
                ? `${g.city}, ${g.region}, ${g.country} (${g.timezone})`
                : 'No geo block',
              g ? `Lat/lon: ${g.lat}, ${g.lon}` : '',
            ].filter(Boolean),
          },
        ],
        raw: data,
      };
    }

    case 'webhook-peek': {
      const data = await fetchWebhooks();
      const lines =
        data.webhooks?.length > 0
          ? data.webhooks.map(
              (w) =>
                `${w.triggers.join(', ')} @ ${w.lat.toFixed(2)},${w.lon.toFixed(2)} → ${w.url.slice(0, 40)}…`,
            )
          : ['No webhooks on this account'];
      return {
        sections: [{ title: 'Subscriptions', lines }],
        raw: data,
      };
    }

    case 'forecast-alias': {
      const data = await fetchForecastAlias(lat, lon, units, 7, false);
      const daily = normalizeDaily(data);
      const hourly = normalizeHourly(data);
      return {
        sections: [
          {
            title: 'Alias check',
            lines: [
              `Returned ${daily.length} daily + ${hourly.length} hourly rows`,
              'Identical handler to /v1/weather — safe to pick one URL in prod.',
            ],
          },
        ],
        raw: data,
      };
    }

    default:
      throw new Error(`Unknown lab feature: ${featureId}`);
  }
}
