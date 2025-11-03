import { NextRequest, NextResponse } from "next/server";
import { PollenData } from "@/types";
import { getPollenCategory } from "@/lib/utils";

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
    // Fetch pollen data from Open-Meteo with cache-busting and real-time settings
    const pollenUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=auto&forecast_days=5`;

    const response = await fetch(pollenUrl, {
      cache: "no-store", // Disable Next.js caching for real-time data
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch pollen data");
    }

    const data = await response.json();

    // Process current pollen data (first hour)
    const currentIndex = 0;

    // Aggregate tree pollen (alder, birch, olive)
    const treePollen = [
      data.hourly.alder_pollen?.[currentIndex] || 0,
      data.hourly.birch_pollen?.[currentIndex] || 0,
      data.hourly.olive_pollen?.[currentIndex] || 0,
    ];
    const treeLevel = Math.max(...treePollen);

    // Grass pollen
    const grassLevel = data.hourly.grass_pollen?.[currentIndex] || 0;

    // Weed pollen (mugwort, ragweed)
    const weedPollen = [
      data.hourly.mugwort_pollen?.[currentIndex] || 0,
      data.hourly.ragweed_pollen?.[currentIndex] || 0,
    ];
    const weedLevel = Math.max(...weedPollen);

    const currentData: PollenData = {
      tree: {
        level: treeLevel,
        category: getPollenCategory(treeLevel),
      },
      grass: {
        level: grassLevel,
        category: getPollenCategory(grassLevel),
      },
      weed: {
        level: weedLevel,
        category: getPollenCategory(weedLevel),
      },
      timestamp: data.hourly.time[currentIndex],
    };

    // Process hourly forecast
    const hourlyForecast = [];
    for (let i = 0; i < Math.min(24, data.hourly.time.length); i++) {
      const treePollenHourly = [
        data.hourly.alder_pollen?.[i] || 0,
        data.hourly.birch_pollen?.[i] || 0,
        data.hourly.olive_pollen?.[i] || 0,
      ];
      const treeLevelHourly = Math.max(...treePollenHourly);

      const grassLevelHourly = data.hourly.grass_pollen?.[i] || 0;

      const weedPollenHourly = [
        data.hourly.mugwort_pollen?.[i] || 0,
        data.hourly.ragweed_pollen?.[i] || 0,
      ];
      const weedLevelHourly = Math.max(...weedPollenHourly);

      hourlyForecast.push({
        timestamp: data.hourly.time[i],
        tree: treeLevelHourly,
        grass: grassLevelHourly,
        weed: weedLevelHourly,
      });
    }

    // Process daily forecast
    const dailyForecast = [];
    const hoursPerDay = 24;

    for (let day = 0; day < 7; day++) {
      const startIdx = day * hoursPerDay;
      const endIdx = Math.min(startIdx + hoursPerDay, data.hourly.time.length);

      if (startIdx >= data.hourly.time.length) break;

      // For pollen data, we'll create entries even if data is null (will show as 0)
      // This is because pollen data availability varies by location and season

      // Calculate peak pollen for each type
      let peakTree = 0;
      let peakGrass = 0;
      let peakWeed = 0;

      for (let i = startIdx; i < endIdx; i++) {
        const treePollenDay = [
          data.hourly.alder_pollen?.[i] || 0,
          data.hourly.birch_pollen?.[i] || 0,
          data.hourly.olive_pollen?.[i] || 0,
        ];
        peakTree = Math.max(peakTree, ...treePollenDay);

        peakGrass = Math.max(peakGrass, data.hourly.grass_pollen?.[i] || 0);

        const weedPollenDay = [
          data.hourly.mugwort_pollen?.[i] || 0,
          data.hourly.ragweed_pollen?.[i] || 0,
        ];
        peakWeed = Math.max(peakWeed, ...weedPollenDay);
      }

      dailyForecast.push({
        date: data.hourly.time[startIdx].split("T")[0],
        tree: peakTree,
        grass: peakGrass,
        weed: peakWeed,
      });
    }

    return NextResponse.json({
      current: currentData,
      hourly: hourlyForecast,
      daily: dailyForecast,
    });
  } catch (error) {
    console.error("Error fetching pollen data:", error);
    return NextResponse.json(
      { error: "Failed to fetch pollen data" },
      { status: 500 }
    );
  }
}
