import { NextResponse } from "next/server";
import { cache, CACHE_TTL, generateCacheKey } from "@/lib/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Major U.S. cities representing different regions (state capitals + major metros)
// This provides a representative sample of AQI across the nation
const SAMPLE_LOCATIONS = [
  // Northeast
  { name: "New York, NY", lat: 40.7128, lon: -74.006, fips: "36061" },
  { name: "Boston, MA", lat: 42.3601, lon: -71.0589, fips: "25025" },
  { name: "Philadelphia, PA", lat: 39.9526, lon: -75.1652, fips: "42101" },
  { name: "Albany, NY", lat: 42.6526, lon: -73.7562, fips: "36001" },

  // Southeast
  { name: "Atlanta, GA", lat: 33.749, lon: -84.388, fips: "13121" },
  { name: "Miami, FL", lat: 25.7617, lon: -80.1918, fips: "12086" },
  { name: "Charlotte, NC", lat: 35.2271, lon: -80.8431, fips: "37119" },
  { name: "Nashville, TN", lat: 36.1627, lon: -86.7816, fips: "47037" },
  { name: "New Orleans, LA", lat: 29.9511, lon: -90.0715, fips: "22071" },

  // Midwest
  { name: "Chicago, IL", lat: 41.8781, lon: -87.6298, fips: "17031" },
  { name: "Detroit, MI", lat: 42.3314, lon: -83.0458, fips: "26163" },
  { name: "Minneapolis, MN", lat: 44.9778, lon: -93.265, fips: "27053" },
  { name: "St. Louis, MO", lat: 38.627, lon: -90.1994, fips: "29510" },
  { name: "Indianapolis, IN", lat: 39.7684, lon: -86.1581, fips: "18097" },

  // Southwest
  { name: "Houston, TX", lat: 29.7604, lon: -95.3698, fips: "48201" },
  { name: "Dallas, TX", lat: 32.7767, lon: -96.797, fips: "48113" },
  { name: "Phoenix, AZ", lat: 33.4484, lon: -112.074, fips: "04013" },
  { name: "San Antonio, TX", lat: 29.4241, lon: -98.4936, fips: "48029" },

  // West
  { name: "Los Angeles, CA", lat: 34.0522, lon: -118.2437, fips: "06037" },
  { name: "San Francisco, CA", lat: 37.7749, lon: -122.4194, fips: "06075" },
  { name: "Seattle, WA", lat: 47.6062, lon: -122.3321, fips: "53033" },
  { name: "Portland, OR", lat: 45.5152, lon: -122.6784, fips: "41051" },
  { name: "Denver, CO", lat: 39.7392, lon: -104.9903, fips: "08031" },
  { name: "Las Vegas, NV", lat: 36.1699, lon: -115.1398, fips: "32003" },

  // Mountain
  { name: "Salt Lake City, UT", lat: 40.7608, lon: -111.891, fips: "49035" },
  { name: "Boise, ID", lat: 43.615, lon: -116.2023, fips: "16001" },

  // Alaska & Hawaii
  { name: "Anchorage, AK", lat: 61.2181, lon: -149.9003, fips: "02020" },
  { name: "Honolulu, HI", lat: 21.3099, lon: -157.8581, fips: "15003" },
];

interface CountyAQI {
  fips: string;
  name: string;
  aqi: number;
  category: string;
  latitude: number;
  longitude: number;
}

/**
 * Calculate AQI from pollutant concentrations
 */
function calculateAQI(pm25: number, pm10: number, o3: number): number {
  // Simplified AQI calculation using PM2.5 as primary indicator
  // Full implementation would use EPA breakpoints for all pollutants

  if (pm25 <= 12.0) return Math.round((50 / 12.0) * pm25);
  if (pm25 <= 35.4)
    return Math.round(50 + ((100 - 50) / (35.4 - 12.1)) * (pm25 - 12.1));
  if (pm25 <= 55.4)
    return Math.round(100 + ((150 - 100) / (55.4 - 35.5)) * (pm25 - 35.5));
  if (pm25 <= 150.4)
    return Math.round(150 + ((200 - 150) / (150.4 - 55.5)) * (pm25 - 55.5));
  if (pm25 <= 250.4)
    return Math.round(200 + ((300 - 200) / (250.4 - 150.5)) * (pm25 - 150.5));
  return Math.round(300 + ((500 - 300) / (500.4 - 250.5)) * (pm25 - 250.5));
}

function getAQICategory(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

/**
 * GET /api/national-aqi
 *
 * Fetches AQI data for major U.S. cities/counties
 * Returns a sample dataset representing national air quality
 */
export async function GET() {
  try {
    // Check cache first
    const cacheKey = generateCacheKey("national-aqi", {});
    const cachedData = cache.get<{ counties: CountyAQI[]; timestamp: string }>(
      cacheKey
    );

    if (cachedData) {
      console.log("Returning cached national AQI data");
      return NextResponse.json(cachedData);
    }

    const counties: CountyAQI[] = [];

    // Fetch AQI for each sample location
    // In production, this would be parallelized with Promise.all
    // For now, we'll fetch a subset to avoid rate limiting
    const locationsToFetch = SAMPLE_LOCATIONS.slice(0, 15); // Limit to 15 for performance

    for (const location of locationsToFetch) {
      try {
        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.lat}&longitude=${location.lon}&current=pm2_5,pm10,ozone&timezone=America/New_York`;

        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          const pm25 = data.current?.pm2_5 || 0;
          const pm10 = data.current?.pm10 || 0;
          const o3 = data.current?.ozone || 0;

          const aqi = calculateAQI(pm25, pm10, o3);

          counties.push({
            fips: location.fips,
            name: location.name,
            aqi,
            category: getAQICategory(aqi),
            latitude: location.lat,
            longitude: location.lon,
          });
        }

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error fetching AQI for ${location.name}:`, error);
      }
    }

    const responseData = {
      counties,
      timestamp: new Date().toISOString(),
      count: counties.length,
      coverage: "Major U.S. cities representing national air quality",
    };

    // Cache for 30 minutes
    cache.set(cacheKey, responseData, 30 * 60);

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, max-age=1800",
      },
    });
  } catch (error) {
    console.error("Error fetching national AQI:", error);
    return NextResponse.json(
      { error: "Failed to fetch national AQI data" },
      { status: 500 }
    );
  }
}
