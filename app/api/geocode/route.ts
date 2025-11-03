import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
  boundingbox: string[];
  importance: number;
}

interface GeocodeResult {
  id: string;
  name: string;
  displayName: string;
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
  importance: number;
}

/**
 * GET /api/geocode?q=<search query>
 * 
 * Search for locations using OpenStreetMap Nominatim API
 * Returns a list of matching locations with coordinates
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Search query must be at least 2 characters" },
        { status: 400 }
      );
    }

    // Use Nominatim API (OpenStreetMap) for geocoding
    // Free, no API key required, but has usage limits
    const nominatimUrl = new URL("https://nominatim.openstreetmap.org/search");
    nominatimUrl.searchParams.set("q", query);
    nominatimUrl.searchParams.set("format", "json");
    nominatimUrl.searchParams.set("addressdetails", "1");
    nominatimUrl.searchParams.set("limit", "5");

    const response = await fetch(nominatimUrl.toString(), {
      headers: {
        "User-Agent": "AeroHealth-Forecast/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.statusText}`);
    }

    const data: NominatimResult[] = await response.json();

    // Transform results to our format
    const results: GeocodeResult[] = data.map((item) => ({
      id: `${item.osm_type}-${item.osm_id}`,
      name: item.address.city || item.address.town || item.address.village || "",
      displayName: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      city: item.address.city || item.address.town || item.address.village,
      state: item.address.state,
      country: item.address.country,
      importance: item.importance,
    }));

    return NextResponse.json(
      { results },
      {
        headers: {
          "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        },
      }
    );
  } catch (error) {
    console.error("Geocoding error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Geocoding failed",
      },
      { status: 500 }
    );
  }
}

