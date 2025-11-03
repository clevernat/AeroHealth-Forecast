import { NextRequest, NextResponse } from "next/server";
import { cache, CACHE_TTL, generateCacheKey } from "@/lib/cache";

// Force dynamic rendering and disable caching for real-time data
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Convert wind speed and direction to U/V components
function windToUV(speed: number, direction: number) {
  const rad = (direction * Math.PI) / 180;
  return {
    u: -speed * Math.sin(rad), // east-west component
    v: -speed * Math.cos(rad), // north-south component
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");

  if (!latitude || !longitude) {
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 }
    );
  }

  try {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    // Check cache first
    const cacheKey = generateCacheKey("wind", {
      lat: lat.toFixed(4),
      lon: lon.toFixed(4),
    });

    const cachedData = cache.get<any>(cacheKey);

    if (cachedData) {
      console.log("Returning cached wind data");
      return NextResponse.json(cachedData);
    }

    // Fetch wind data from Open-Meteo
    const windUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=wind_speed_10m,wind_direction_10m&timezone=auto&forecast_days=1`;

    const response = await fetch(windUrl, {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch wind data");
    }

    const data = await response.json();

    // Create grid data for leaflet-velocity
    // We'll create a simple grid around the location
    const gridSize = 10;
    const gridSpacing = 0.1; // degrees
    const windData: Array<{
      lat: number;
      lon: number;
      u: number;
      v: number;
      speed: number;
      direction: number;
    }> = [];

    const currentSpeed = data.current.wind_speed_10m || 0;
    const currentDirection = data.current.wind_direction_10m || 0;
    const currentGusts = data.current.wind_gusts_10m || 0;

    // Create a grid of wind vectors
    // In a real implementation, you'd fetch actual grid data
    // For now, we'll use the current wind with slight variations
    for (let i = -gridSize / 2; i < gridSize / 2; i++) {
      for (let j = -gridSize / 2; j < gridSize / 2; j++) {
        const gridLat = lat + i * gridSpacing;
        const gridLon = lon + j * gridSpacing;

        // Add slight variation to make it look more realistic
        const speedVariation = (Math.random() - 0.5) * 2;
        const directionVariation = (Math.random() - 0.5) * 20;

        const speed = Math.max(0, currentSpeed + speedVariation);
        const direction = (currentDirection + directionVariation + 360) % 360;

        const { u, v } = windToUV(speed, direction);

        windData.push({
          lat: gridLat,
          lon: gridLon,
          u,
          v,
          speed,
          direction,
        });
      }
    }

    // Format for leaflet-velocity
    const velocityData = {
      header: {
        parameterUnit: "m/s",
        parameterNumber: 2,
        dx: gridSpacing,
        dy: gridSpacing,
        nx: gridSize,
        ny: gridSize,
        la1: lat - (gridSize / 2) * gridSpacing,
        la2: lat + (gridSize / 2) * gridSpacing,
        lo1: lon - (gridSize / 2) * gridSpacing,
        lo2: lon + (gridSize / 2) * gridSpacing,
      },
      data: windData.map((point) => ({
        header: {
          parameterCategory: 2,
          parameterNumber: 2,
        },
        data: [point.u, point.v],
      })),
    };

    const responseData = {
      current: {
        speed: currentSpeed,
        direction: currentDirection,
        gusts: currentGusts,
        timestamp: data.current.time,
      },
      grid: windData,
      velocity: velocityData,
    };

    // Cache the response
    cache.set(cacheKey, responseData, CACHE_TTL.WIND);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching wind data:", error);
    return NextResponse.json(
      { error: "Failed to fetch wind data" },
      { status: 500 }
    );
  }
}
