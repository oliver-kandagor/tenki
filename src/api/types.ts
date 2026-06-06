export type Units = 'metric' | 'imperial';

export interface GeoCoords {
  lat: number;
  lon: number;
}

export interface WeatherLocation {
  name?: string;
  city?: string;
  region?: string;
  country?: string;
  lat?: number;
  lon?: number;
}

export interface CurrentConditions {
  temperature?: number;
  temp?: number;
  feels_like?: number;
  feelslike_c?: number;
  condition?: string;
  description?: string;
  weather_code?: number;
  humidity?: number;
  wind_speed?: number;
  wind_speed_10m?: number;
  precipitation?: number;
  pressure?: number;
  surface_pressure?: number;
  wind_direction?: string;
  sunrise?: string;
  sunset?: string;
}

export interface DailyForecast {
  date?: string;
  day?: string;
  max_temp?: number;
  min_temp?: number;
  temp_max?: number;
  temp_min?: number;
  condition?: string;
  description?: string;
  weather_code?: number;
  precipitation_probability?: number;
  precipitation_probability_max?: number;
  pop?: number;
  uv_index_max?: number;
  uvi?: number;
  sunrise?: string;
  sunset?: string;
}

export interface HourlyForecast {
  time?: string;
  datetime?: string;
  hour?: string;
  temperature?: number;
  temp?: number;
  condition?: string;
  description?: string;
  weather_code?: number;
  precipitation_probability?: number;
  precipitation_chance?: number;
  pop?: number;
}

export interface WeatherGeoResponse {
  lat?: number;
  lon?: number;
  location?: WeatherLocation;
  geo?: {
    lat?: number;
    lon?: number;
    city?: string;
    region?: string;
    country?: string;
  };
  current?: CurrentConditions;
  daily?: DailyForecast[];
  hourly?: HourlyForecast[];
  ai_summary?: string;
  summary?: string;
  ai?: { summary?: string };
}

export interface CurrentWeather {
  location: WeatherLocation;
  current: CurrentConditions;
  aiSummary: string | null;
}

export interface TreeHealth {
  healthy: number;
  needs_care: number;
  needs_replacement: number;
}

export interface TreeAnalysis {
  analysis_id: string;
  timestamp: string;
  farmer_id?: string;
  county?: string;
  location?: string;
  land_acres?: number;
  total_tree_count: number;
  tree_density_per_acre?: number;
  confidence_score?: number;
  canopy_coverage_pct: number;
  tree_health: TreeHealth;
  low_confidence?: boolean;
  tree_species_guess?: string;
  observations: string[];
  recommendations: string[];
  original_image_url?: string;
  overlay_image_url?: string;
}

export interface TreeMeta {
  farmerId?: string;
  county?: string;
  landAcres?: number;
  location?: string;
  notes?: string;
}

export interface TreesHistoryResponse {
  analyses: TreeAnalysis[];
  next_cursor?: string | null;
}

export interface TreesQuotaResponse {
  plan: string;
  used: number;
  limit: number;
  remaining: number;
  unlimited: boolean;
  resets_at: string;
}

export interface UsageQuotaSlice {
  used: number;
  limit: number;
}

export interface UsageResponse {
  plan?: string;
  requests?: UsageQuotaSlice;
  ai_requests?: UsageQuotaSlice;
  standard_requests?: UsageQuotaSlice;
  ai?: UsageQuotaSlice;
  period?: {
    start?: string;
    end?: string;
    reset_at?: string;
  };
  billing_period?: {
    start?: string;
    end?: string;
  };
}
