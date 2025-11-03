import { NextRequest, NextResponse } from "next/server";
import { AQIData, HourlyForecast, DailyForecast } from "@/types";
import { getAQICategory, getPrimaryPollutant } from "@/lib/utils";

// Force dynamic rendering and disable caching for real-time data
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    // Fetch air quality data from Open-Meteo with cache-busting and real-time settings
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi&timezone=auto&forecast_days=7`;

    const response = await fetch(aqiUrl, {
      cache: "no-store", // Disable Next.js caching for real-time data
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch air quality data");
    }

    const data = await response.json();

    // Process current AQI data (first hour)
    const currentIndex = 0;
    const currentAQI = data.hourly.us_aqi[currentIndex] || 0;

    const pollutants = {
      pm2_5: data.hourly.pm2_5?.[currentIndex],
      pm10: data.hourly.pm10?.[currentIndex],
      ozone: data.hourly.ozone?.[currentIndex],
      no2: data.hourly.nitrogen_dioxide?.[currentIndex],
      so2: data.hourly.sulphur_dioxide?.[currentIndex],
      co: data.hourly.carbon_monoxide?.[currentIndex],
    };

    const currentData: AQIData = {
      aqi: currentAQI,
      category: getAQICategory(currentAQI),
      primaryPollutant: getPrimaryPollutant(pollutants),
      pollutants,
      timestamp: data.hourly.time[currentIndex],
    };

    // Process 24-hour forecast
    const hourlyForecast: HourlyForecast[] = [];
    for (let i = 0; i < Math.min(24, data.hourly.time.length); i++) {
      hourlyForecast.push({
        timestamp: data.hourly.time[i],
        aqi: data.hourly.us_aqi[i] || 0,
        pollutants: {
          pm2_5: data.hourly.pm2_5?.[i] || 0,
          pm10: data.hourly.pm10?.[i] || 0,
          ozone: data.hourly.ozone?.[i] || 0,
          no2: data.hourly.nitrogen_dioxide?.[i] || 0,
          so2: data.hourly.sulphur_dioxide?.[i] || 0,
          co: data.hourly.carbon_monoxide?.[i] || 0,
        },
        pollen: {
          tree: 0,
          grass: 0,
          weed: 0,
        },
      });
    }

    // Process 7-day forecast
    const dailyForecast: DailyForecast[] = [];
    const hoursPerDay = 24;

    for (let day = 0; day < 7; day++) {
      const startIdx = day * hoursPerDay;
      const endIdx = Math.min(startIdx + hoursPerDay, data.hourly.time.length);

      if (startIdx >= data.hourly.time.length) break;

      const dayAQIs = data.hourly.us_aqi
        .slice(startIdx, endIdx)
        .filter((v: number) => v !== null);

      if (dayAQIs.length === 0) continue;

      const peakAQI = Math.max(...dayAQIs);
      const avgAQI = Math.round(
        dayAQIs.reduce((a: number, b: number) => a + b, 0) / dayAQIs.length
      );

      dailyForecast.push({
        date: data.hourly.time[startIdx].split("T")[0],
        peakAQI,
        avgAQI,
        peakPollen: {
          tree: 0,
          grass: 0,
          weed: 0,
        },
      });
    }

    return NextResponse.json({
      current: currentData,
      hourly: hourlyForecast,
      daily: dailyForecast,
    });
  } catch (error) {
    console.error("Error fetching AQI data:", error);
    return NextResponse.json(
      { error: "Failed to fetch air quality data" },
      { status: 500 }
    );
  }
}
