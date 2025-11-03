// Location types
export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
}

// AQI (Air Quality Index) types
export interface AQIData {
  aqi: number;
  category: AQICategory;
  primaryPollutant: Pollutant;
  pollutants: PollutantLevels;
  timestamp: string;
}

export interface PollutantLevels {
  pm2_5?: number;
  pm10?: number;
  ozone?: number;
  no2?: number;
  so2?: number;
  co?: number;
}

export type Pollutant = 'pm2_5' | 'pm10' | 'ozone' | 'no2' | 'so2' | 'co';

export type AQICategory = 'good' | 'moderate' | 'unhealthy_sensitive' | 'unhealthy' | 'very_unhealthy' | 'hazardous';

export interface AQICategoryInfo {
  label: string;
  color: string;
  textColor: string;
  range: [number, number];
  description: string;
  healthImplications: string;
}

// Pollen types
export interface PollenData {
  tree: PollenLevel;
  grass: PollenLevel;
  weed: PollenLevel;
  timestamp: string;
}

export interface PollenLevel {
  level: number;
  category: PollenCategory;
}

export type PollenCategory = 'low' | 'moderate' | 'high' | 'very_high';

export interface PollenCategoryInfo {
  label: string;
  color: string;
  textColor: string;
  range: [number, number];
  description: string;
}

// Forecast types
export interface HourlyForecast {
  timestamp: string;
  aqi: number;
  pollen: {
    tree: number;
    grass: number;
    weed: number;
  };
}

export interface DailyForecast {
  date: string;
  peakAQI: number;
  peakPollen: {
    tree: number;
    grass: number;
    weed: number;
  };
  avgAQI: number;
}

// Educational content types
export interface PollutantInfo {
  name: string;
  description: string;
  sources: string[];
  healthImpacts: string[];
  unit: string;
}

export interface AllergenInfo {
  name: string;
  description: string;
  commonSources: string[];
  peakSeasons: string[];
  healthImpacts: string[];
}

// API Response types
export interface OpenMeteoAQIResponse {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    pm2_5?: number[];
    pm10?: number[];
    us_aqi?: number[];
    european_aqi?: number[];
  };
}

export interface OpenMeteoPollenResponse {
  latitude: number;
  longitude: number;
  hourly: {
    time: string[];
    alder_pollen?: number[];
    birch_pollen?: number[];
    grass_pollen?: number[];
    mugwort_pollen?: number[];
    olive_pollen?: number[];
    ragweed_pollen?: number[];
  };
}

