import { AQICategory, PollenCategory, Pollutant, PollutantLevels } from '@/types';
import { AQI_CATEGORIES, POLLEN_CATEGORIES } from './constants';

/**
 * Get AQI category based on AQI value
 */
export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy_sensitive';
  if (aqi <= 200) return 'unhealthy';
  if (aqi <= 300) return 'very_unhealthy';
  return 'hazardous';
}

/**
 * Get pollen category based on pollen level
 */
export function getPollenCategory(level: number): PollenCategory {
  if (level <= 2.4) return 'low';
  if (level <= 4.8) return 'moderate';
  if (level <= 7.2) return 'high';
  return 'very_high';
}

/**
 * Determine the primary pollutant from pollutant levels
 */
export function getPrimaryPollutant(pollutants: PollutantLevels): Pollutant {
  const pollutantAQIs: { pollutant: Pollutant; aqi: number }[] = [];

  if (pollutants.pm2_5 !== undefined) {
    pollutantAQIs.push({ pollutant: 'pm2_5', aqi: calculatePM25AQI(pollutants.pm2_5) });
  }
  if (pollutants.pm10 !== undefined) {
    pollutantAQIs.push({ pollutant: 'pm10', aqi: calculatePM10AQI(pollutants.pm10) });
  }
  if (pollutants.ozone !== undefined) {
    pollutantAQIs.push({ pollutant: 'ozone', aqi: calculateOzoneAQI(pollutants.ozone) });
  }
  if (pollutants.no2 !== undefined) {
    pollutantAQIs.push({ pollutant: 'no2', aqi: calculateNO2AQI(pollutants.no2) });
  }
  if (pollutants.so2 !== undefined) {
    pollutantAQIs.push({ pollutant: 'so2', aqi: calculateSO2AQI(pollutants.so2) });
  }
  if (pollutants.co !== undefined) {
    pollutantAQIs.push({ pollutant: 'co', aqi: calculateCOAQI(pollutants.co) });
  }

  if (pollutantAQIs.length === 0) return 'pm2_5';

  // Return the pollutant with the highest AQI
  pollutantAQIs.sort((a, b) => b.aqi - a.aqi);
  return pollutantAQIs[0].pollutant;
}

/**
 * Calculate AQI for PM2.5 (µg/m³)
 */
function calculatePM25AQI(concentration: number): number {
  const breakpoints = [
    { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },
    { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
    { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
    { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
    { cLow: 250.5, cHigh: 500.4, iLow: 301, iHigh: 500 },
  ];
  return calculateAQI(concentration, breakpoints);
}

/**
 * Calculate AQI for PM10 (µg/m³)
 */
function calculatePM10AQI(concentration: number): number {
  const breakpoints = [
    { cLow: 0, cHigh: 54, iLow: 0, iHigh: 50 },
    { cLow: 55, cHigh: 154, iLow: 51, iHigh: 100 },
    { cLow: 155, cHigh: 254, iLow: 101, iHigh: 150 },
    { cLow: 255, cHigh: 354, iLow: 151, iHigh: 200 },
    { cLow: 355, cHigh: 424, iLow: 201, iHigh: 300 },
    { cLow: 425, cHigh: 604, iLow: 301, iHigh: 500 },
  ];
  return calculateAQI(concentration, breakpoints);
}

/**
 * Calculate AQI for Ozone (ppb)
 */
function calculateOzoneAQI(concentration: number): number {
  const breakpoints = [
    { cLow: 0, cHigh: 54, iLow: 0, iHigh: 50 },
    { cLow: 55, cHigh: 70, iLow: 51, iHigh: 100 },
    { cLow: 71, cHigh: 85, iLow: 101, iHigh: 150 },
    { cLow: 86, cHigh: 105, iLow: 151, iHigh: 200 },
    { cLow: 106, cHigh: 200, iLow: 201, iHigh: 300 },
  ];
  return calculateAQI(concentration, breakpoints);
}

/**
 * Calculate AQI for NO2 (ppb)
 */
function calculateNO2AQI(concentration: number): number {
  const breakpoints = [
    { cLow: 0, cHigh: 53, iLow: 0, iHigh: 50 },
    { cLow: 54, cHigh: 100, iLow: 51, iHigh: 100 },
    { cLow: 101, cHigh: 360, iLow: 101, iHigh: 150 },
    { cLow: 361, cHigh: 649, iLow: 151, iHigh: 200 },
    { cLow: 650, cHigh: 1249, iLow: 201, iHigh: 300 },
    { cLow: 1250, cHigh: 2049, iLow: 301, iHigh: 500 },
  ];
  return calculateAQI(concentration, breakpoints);
}

/**
 * Calculate AQI for SO2 (ppb)
 */
function calculateSO2AQI(concentration: number): number {
  const breakpoints = [
    { cLow: 0, cHigh: 35, iLow: 0, iHigh: 50 },
    { cLow: 36, cHigh: 75, iLow: 51, iHigh: 100 },
    { cLow: 76, cHigh: 185, iLow: 101, iHigh: 150 },
    { cLow: 186, cHigh: 304, iLow: 151, iHigh: 200 },
    { cLow: 305, cHigh: 604, iLow: 201, iHigh: 300 },
    { cLow: 605, cHigh: 1004, iLow: 301, iHigh: 500 },
  ];
  return calculateAQI(concentration, breakpoints);
}

/**
 * Calculate AQI for CO (ppm)
 */
function calculateCOAQI(concentration: number): number {
  const breakpoints = [
    { cLow: 0.0, cHigh: 4.4, iLow: 0, iHigh: 50 },
    { cLow: 4.5, cHigh: 9.4, iLow: 51, iHigh: 100 },
    { cLow: 9.5, cHigh: 12.4, iLow: 101, iHigh: 150 },
    { cLow: 12.5, cHigh: 15.4, iLow: 151, iHigh: 200 },
    { cLow: 15.5, cHigh: 30.4, iLow: 201, iHigh: 300 },
    { cLow: 30.5, cHigh: 50.4, iLow: 301, iHigh: 500 },
  ];
  return calculateAQI(concentration, breakpoints);
}

/**
 * Generic AQI calculation using EPA formula
 */
function calculateAQI(
  concentration: number,
  breakpoints: Array<{ cLow: number; cHigh: number; iLow: number; iHigh: number }>
): number {
  for (const bp of breakpoints) {
    if (concentration >= bp.cLow && concentration <= bp.cHigh) {
      const aqi =
        ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (concentration - bp.cLow) + bp.iLow;
      return Math.round(aqi);
    }
  }
  // If concentration is above all breakpoints, return max AQI
  return 500;
}

/**
 * Get color for AQI value
 */
export function getAQIColor(aqi: number): string {
  const category = getAQICategory(aqi);
  return AQI_CATEGORIES[category].color;
}

/**
 * Get color for pollen level
 */
export function getPollenColor(level: number): string {
  const category = getPollenCategory(level);
  return POLLEN_CATEGORIES[category].color;
}

/**
 * Format pollutant name for display
 */
export function formatPollutantName(pollutant: Pollutant): string {
  const names: Record<Pollutant, string> = {
    pm2_5: 'PM2.5',
    pm10: 'PM10',
    ozone: 'Ozone',
    no2: 'NO₂',
    so2: 'SO₂',
    co: 'CO',
  };
  return names[pollutant];
}

/**
 * Get user's geolocation
 */
export function getUserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
}

