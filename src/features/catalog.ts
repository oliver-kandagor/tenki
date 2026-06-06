export type PlanTier = 'free' | 'pro' | 'scale';
export type AiCost = 'none' | 'optional' | 'always';

export interface LabFeature {
  id: string;
  title: string;
  tagline: string;
  emoji: string;
  endpoint: string;
  plan: PlanTier;
  aiCost: AiCost;
  /** Product idea if you promote this from lab → main app */
  productPitch: string;
  category: 'weather' | 'geo' | 'agri' | 'account' | 'pro';
}

export const LAB_FEATURES: LabFeature[] = [
  {
    id: 'week-at-glance',
    title: 'Week at a Glance',
    tagline: 'One API call: now + 7 days + AI narrative',
    emoji: '📦',
    endpoint: 'GET /v1/weather',
    plan: 'free',
    aiCost: 'always',
    productPitch: 'Replace Home + Forecast with a single dashboard screen.',
    category: 'weather',
  },
  {
    id: 'travel-mode',
    title: 'Travel Mode (IP)',
    tagline: 'Weather without GPS — great for VPN/travel sim',
    emoji: '✈️',
    endpoint: 'GET /v1/weather-geo?ip=auto',
    plan: 'free',
    aiCost: 'optional',
    productPitch: 'Onboarding screen before location permission.',
    category: 'geo',
  },
  {
    id: 'rain-window',
    title: 'Rain Window',
    tagline: 'Scan hourly data for the next dry spell',
    emoji: '🌧️',
    endpoint: 'GET /v1/hourly (client logic)',
    plan: 'free',
    aiCost: 'none',
    productPitch: '"Best time to spray fields" widget — no AI quota.',
    category: 'weather',
  },
  {
    id: 'golden-hour',
    title: 'Golden Hour Pick',
    tagline: 'Score each hour for outdoor farm work',
    emoji: '🌤️',
    endpoint: 'GET /v1/hourly (client logic)',
    plan: 'free',
    aiCost: 'none',
    productPitch: 'Push notification: "Good conditions 4–6pm".',
    category: 'agri',
  },
  {
    id: 'swahili-brief',
    title: 'Habari ya Hali',
    tagline: 'AI summary in Swahili via ?lang=sw',
    emoji: '🇰🇪',
    endpoint: 'GET /v1/current?lang=sw',
    plan: 'free',
    aiCost: 'always',
    productPitch: 'Language toggle on Home for East Africa users.',
    category: 'weather',
  },
  {
    id: 'twin-cities',
    title: 'Twin Cities',
    tagline: 'Compare your GPS vs a pinned farm/co-op',
    emoji: '⚖️',
    endpoint: 'GET /v1/current × 2',
    plan: 'free',
    aiCost: 'optional',
    productPitch: 'Buyers comparing delivery hub vs field conditions.',
    category: 'weather',
  },
  {
    id: 'farm-morning-brief',
    title: 'Farm Morning Brief',
    tagline: 'Weather AI + tree quota + usage in one card',
    emoji: '🌾',
    endpoint: 'Multiple',
    plan: 'free',
    aiCost: 'always',
    productPitch: 'Daily home screen for smallholder cooperatives.',
    category: 'agri',
  },
  {
    id: 'insights-pro',
    title: 'AI Agronomic Insights',
    tagline: 'Enhanced Gemini risks & recommendations',
    emoji: '🧠',
    endpoint: 'GET /v1/insights',
    plan: 'pro',
    aiCost: 'always',
    productPitch: 'Premium tab — frost/drought flags for Pro users.',
    category: 'pro',
  },
  {
    id: 'forecast-14',
    title: 'Two-Week Outlook',
    tagline: 'Extended horizon for planning inputs',
    emoji: '📆',
    endpoint: 'GET /v1/forecast14',
    plan: 'pro',
    aiCost: 'optional',
    productPitch: 'Scroll beyond 7 days on Forecast screen.',
    category: 'pro',
  },
  {
    id: 'ip-detective',
    title: 'IP Detective',
    tagline: 'Resolve any IP to city + coordinates',
    emoji: '🔍',
    endpoint: 'GET /v1/ip-lookup',
    plan: 'pro',
    aiCost: 'none',
    productPitch: 'Support tool — debug farmer SMS delivery regions.',
    category: 'geo',
  },
  {
    id: 'webhook-peek',
    title: 'Alert Subscriptions',
    tagline: 'List rain/frost/wind webhooks on your account',
    emoji: '🔔',
    endpoint: 'GET /v1/webhooks',
    plan: 'pro',
    aiCost: 'none',
    productPitch: 'In-app alert manager (pairs with push later).',
    category: 'pro',
  },
  {
    id: 'forecast-alias',
    title: 'Forecast Alias',
    tagline: 'Same data as /v1/weather via /v1/forecast',
    emoji: '🔗',
    endpoint: 'GET /v1/forecast',
    plan: 'free',
    aiCost: 'optional',
    productPitch: 'Usually skip — use for legacy API compatibility only.',
    category: 'weather',
  },
];

export function getFeatureById(id: string): LabFeature | undefined {
  return LAB_FEATURES.find((f) => f.id === id);
}
