import { NextRequest, NextResponse } from "next/server";
import { cache, CACHE_TTL, generateCacheKey } from "@/lib/cache";

// Force dynamic rendering and disable caching for real-time data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");
  const radius = searchParams.get("radius") || "0.5"; // degrees (~55km)

  if (!latitude || !longitude) {
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 }
    );
  }

  try {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const rad = parseFloat(radius);

    // Check cache first
    const cacheKey = generateCacheKey("aqi-grid", {
      lat: lat.toFixed(4),
      lon: lon.toFixed(4),
      radius: rad,
    });

    const cachedData = cache.get<{
      points: Array<[number, number, number]>;
      center: [number, number];
      radius: number;
    }>(cacheKey);

    if (cachedData) {
      console.log("Returning cached AQI grid data");
      return NextResponse.json(cachedData);
    }

    // Create a grid of points around the user's location
    const gridPoints: Array<[number, number, number]> = [];
    const gridSize = 5; // 5x5 grid
    const step = (rad * 2) / gridSize;

    // Fetch AQI data for grid points
    const promises = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const gridLat = lat - rad + i * step;
        const gridLon = lon - rad + j * step;

        const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${gridLat}&longitude=${gridLon}&current=us_aqi&timezone=auto`;

        promises.push(
          fetch(aqiUrl, {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          })
            .then((res) => res.json())
            .then((data) => {
              const aqi = data.current?.us_aqi || 0;
              return [gridLat, gridLon, aqi] as [number, number, number];
            })
            .catch(() => [gridLat, gridLon, 0] as [number, number, number])
        );
      }
    }

    const results = await Promise.all(promises);

    // Filter out points with 0 AQI (failed requests)
    const validPoints = results.filter(([, , aqi]) => aqi > 0);

    const responseData = {
      points: validPoints,
      center: [lat, lon] as [number, number],
      radius: rad,
    };

    // Cache the response
    cache.set(cacheKey, responseData, CACHE_TTL.AQI_GRID);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching grid AQI data:", error);
    return NextResponse.json(
      { error: "Failed to fetch grid AQI data" },
      { status: 500 }
    );
  }
}
