import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Cache for 1 hour

/**
 * GET /api/counties-geojson
 * 
 * Fetches U.S. counties GeoJSON data from Plotly's public dataset
 * This is a simplified version for performance
 */
export async function GET() {
  try {
    // Fetch from Plotly's public dataset (simplified counties)
    const response = await fetch(
      "https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json",
      {
        headers: {
          "User-Agent": "AeroHealth-Forecast/2.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch counties GeoJSON: ${response.statusText}`);
    }

    const geojson = await response.json();

    return NextResponse.json(geojson, {
      headers: {
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error fetching counties GeoJSON:", error);
    return NextResponse.json(
      { error: "Failed to fetch counties GeoJSON" },
      { status: 500 }
    );
  }
}

