import { NextRequest, NextResponse } from "next/server";
import { cache, CACHE_TTL, generateCacheKey } from "@/lib/cache";

// Force dynamic rendering and disable caching for real-time data
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PollutionSource {
  id: string;
  type: "factory" | "highway" | "wildfire" | "airport" | "port";
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  severity?: "low" | "medium" | "high";
  distance?: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");
  const radius = searchParams.get("radius") || "25"; // km

  if (!latitude || !longitude) {
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 }
    );
  }

  try {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const radiusKm = parseFloat(radius);

    // Check cache first
    const cacheKey = generateCacheKey("pollution-sources", {
      lat: lat.toFixed(4),
      lon: lon.toFixed(4),
      radius: radiusKm,
    });

    const cachedData = cache.get<{
      sources: PollutionSource[];
      center: { latitude: number; longitude: number };
      radius: number;
      count: number;
    }>(cacheKey);

    if (cachedData) {
      console.log("Returning cached pollution sources data");
      return NextResponse.json(cachedData);
    }

    const sources: PollutionSource[] = [];

    // Calculate bounding box once for all queries
    const bbox = calculateBBox(lat, lon, radiusKm);

    // 1. Fetch highways from OpenStreetMap Overpass API
    try {
      const overpassQuery = `
        [out:json][timeout:25];
        (
          way["highway"~"motorway|trunk|primary"](${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon});
        );
        out center;
      `;

      const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
        overpassQuery
      )}`;

      const highwayResponse = await fetch(overpassUrl, {
        headers: {
          "User-Agent": "AeroHealth-Forecast/1.0",
        },
      });

      if (highwayResponse.ok) {
        const highwayData = await highwayResponse.json();

        // Process highways and add to sources
        highwayData.elements
          ?.slice(0, 10)
          .forEach((element: any, index: number) => {
            if (element.center) {
              const distance = calculateDistance(
                lat,
                lon,
                element.center.lat,
                element.center.lon
              );

              sources.push({
                id: `highway-${element.id}`,
                type: "highway",
                name:
                  element.tags?.name ||
                  `Highway ${element.tags?.ref || index + 1}`,
                latitude: element.center.lat,
                longitude: element.center.lon,
                description: `${
                  element.tags?.highway || "Road"
                } - High traffic area`,
                severity:
                  element.tags?.highway === "motorway" ? "high" : "medium",
                distance: Math.round(distance * 10) / 10,
              });
            }
          });
      }
    } catch (error) {
      console.error("Error fetching highways:", error);
    }

    // 2. Fetch wildfire data from NASA FIRMS
    try {
      const nasaApiKey = process.env.NASA_FIRMS_API_KEY;

      if (nasaApiKey && nasaApiKey !== "your_map_key_here") {
        // Use real NASA FIRMS API
        // FIRMS provides data for MODIS (last 24h) and VIIRS (last 24h)
        // We'll use VIIRS NOAA-20 for better resolution
        const firmsUrl = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${nasaApiKey}/VIIRS_NOAA20_NRT/${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon}/1`;

        const firmsResponse = await fetch(firmsUrl, {
          headers: {
            "User-Agent": "AeroHealth-Forecast/1.0",
          },
        });

        if (firmsResponse.ok) {
          const csvData = await firmsResponse.text();
          const wildfires = parseNASAFIRMSData(csvData, lat, lon);
          sources.push(...wildfires);
        } else {
          console.warn("NASA FIRMS API request failed, using fallback data");
          // Fallback to mock data
          const mockWildfires = generateMockWildfires(lat, lon, radiusKm);
          sources.push(...mockWildfires);
        }
      } else {
        // No API key configured, use mock data
        console.info(
          "NASA FIRMS API key not configured, using simulated wildfire data"
        );
        const mockWildfires = generateMockWildfires(lat, lon, radiusKm);
        sources.push(...mockWildfires);
      }
    } catch (error) {
      console.error("Error fetching wildfire data:", error);
      // Fallback to mock data on error
      const mockWildfires = generateMockWildfires(lat, lon, radiusKm);
      sources.push(...mockWildfires);
    }

    // 3. Add industrial areas (airports, ports) from OpenStreetMap
    try {
      const industrialQuery = `
        [out:json][timeout:25];
        (
          node["aeroway"="aerodrome"](${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon});
          node["industrial"](${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon});
          way["landuse"="industrial"](${bbox.minLat},${bbox.minLon},${bbox.maxLat},${bbox.maxLon});
        );
        out center;
      `;

      const industrialUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
        industrialQuery
      )}`;

      const industrialResponse = await fetch(industrialUrl, {
        headers: {
          "User-Agent": "AeroHealth-Forecast/1.0",
        },
      });

      if (industrialResponse.ok) {
        const industrialData = await industrialResponse.json();

        industrialData.elements
          ?.slice(0, 5)
          .forEach((element: any, index: number) => {
            const elementLat = element.lat || element.center?.lat;
            const elementLon = element.lon || element.center?.lon;

            if (elementLat && elementLon) {
              const distance = calculateDistance(
                lat,
                lon,
                elementLat,
                elementLon
              );

              const isAirport = element.tags?.aeroway === "aerodrome";
              sources.push({
                id: `industrial-${element.id}`,
                type: isAirport ? "airport" : "factory",
                name:
                  element.tags?.name ||
                  (isAirport
                    ? `Airport ${index + 1}`
                    : `Industrial Area ${index + 1}`),
                latitude: elementLat,
                longitude: elementLon,
                description: isAirport
                  ? "Airport - Aircraft emissions"
                  : "Industrial area - Manufacturing emissions",
                severity: "medium",
                distance: Math.round(distance * 10) / 10,
              });
            }
          });
      }
    } catch (error) {
      console.error("Error fetching industrial areas:", error);
    }

    // Sort by distance
    sources.sort((a, b) => (a.distance || 0) - (b.distance || 0));

    const responseData = {
      sources,
      center: { latitude: lat, longitude: lon },
      radius: radiusKm,
      count: sources.length,
    };

    // Cache the response
    // Use different TTL for wildfires vs infrastructure
    const hasWildfires = sources.some((s) => s.type === "wildfire");
    const ttl = hasWildfires
      ? CACHE_TTL.WILDFIRES
      : CACHE_TTL.POLLUTION_SOURCES;
    cache.set(cacheKey, responseData, ttl);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching pollution sources:", error);
    return NextResponse.json(
      { error: "Failed to fetch pollution sources" },
      { status: 500 }
    );
  }
}

// Helper function to calculate bounding box
function calculateBBox(lat: number, lon: number, radiusKm: number) {
  const latDelta = radiusKm / 111; // 1 degree latitude ≈ 111 km
  const lonDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLon: lon - lonDelta,
    maxLon: lon + lonDelta,
  };
}

// Helper function to calculate distance between two points (Haversine formula)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Parse NASA FIRMS CSV data
function parseNASAFIRMSData(
  csvData: string,
  userLat: number,
  userLon: number
): PollutionSource[] {
  const fires: PollutionSource[] = [];
  const lines = csvData.split("\n");

  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const columns = line.split(",");
    if (columns.length < 10) continue;

    // NASA FIRMS CSV format:
    // latitude,longitude,bright_ti4,scan,track,acq_date,acq_time,satellite,confidence,version,bright_ti5,frp,daynight
    const fireLat = parseFloat(columns[0]);
    const fireLon = parseFloat(columns[1]);
    const brightness = parseFloat(columns[2]); // Brightness temperature (Kelvin)
    const acqDate = columns[5];
    const acqTime = columns[6];
    const satellite = columns[7];
    const confidence = columns[8]; // low, nominal, high
    const frp = parseFloat(columns[11]); // Fire Radiative Power (MW)

    if (isNaN(fireLat) || isNaN(fireLon)) continue;

    const distance = calculateDistance(userLat, userLon, fireLat, fireLon);

    // Determine severity based on FRP and confidence
    let severity: "low" | "medium" | "high" = "medium";
    if (confidence === "high" && frp > 100) {
      severity = "high";
    } else if (confidence === "low" || frp < 10) {
      severity = "low";
    }

    fires.push({
      id: `wildfire-${i}-${acqDate}-${acqTime}`,
      type: "wildfire",
      name: `Active Fire (${satellite})`,
      latitude: fireLat,
      longitude: fireLon,
      description: `Fire detected at ${acqTime.slice(0, 2)}:${acqTime.slice(
        2,
        4
      )} UTC on ${acqDate}. FRP: ${frp.toFixed(
        1
      )} MW. Confidence: ${confidence}`,
      severity,
      distance: Math.round(distance * 10) / 10,
    });
  }

  return fires;
}

// Mock wildfire data generator (fallback when NASA FIRMS API is not available)
function generateMockWildfires(
  lat: number,
  lon: number,
  radiusKm: number
): PollutionSource[] {
  // Only generate mock fires during fire season or in fire-prone areas
  const month = new Date().getMonth();
  const isFireSeason = month >= 5 && month <= 9; // June to October

  if (!isFireSeason) {
    return [];
  }

  // Simulate 0-2 wildfires
  const fireCount = Math.random() > 0.7 ? Math.floor(Math.random() * 2) : 0;
  const fires: PollutionSource[] = [];

  for (let i = 0; i < fireCount; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radiusKm;
    const fireLat = lat + (distance / 111) * Math.cos(angle);
    const fireLon =
      lon +
      (distance / (111 * Math.cos((lat * Math.PI) / 180))) * Math.sin(angle);

    fires.push({
      id: `wildfire-mock-${i}`,
      type: "wildfire",
      name: `Simulated Fire ${i + 1}`,
      latitude: fireLat,
      longitude: fireLon,
      description:
        "Simulated wildfire data (NASA FIRMS API key not configured)",
      severity: "high",
      distance: Math.round(distance * 10) / 10,
    });
  }

  return fires;
}
