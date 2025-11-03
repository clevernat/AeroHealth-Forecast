import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface NominatimReverseResult {
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
    county?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

/**
 * GET /api/reverse-geocode?lat=<latitude>&lon=<longitude>
 * 
 * Reverse geocode coordinates to get location name
 * Uses OpenStreetMap Nominatim API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 }
      );
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { error: "Invalid latitude or longitude" },
        { status: 400 }
      );
    }

    // Use Nominatim API for reverse geocoding
    const nominatimUrl = new URL("https://nominatim.openstreetmap.org/reverse");
    nominatimUrl.searchParams.set("lat", latitude.toString());
    nominatimUrl.searchParams.set("lon", longitude.toString());
    nominatimUrl.searchParams.set("format", "json");
    nominatimUrl.searchParams.set("addressdetails", "1");

    const response = await fetch(nominatimUrl.toString(), {
      headers: {
        "User-Agent": "AeroHealth-Forecast/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.statusText}`);
    }

    const data: NominatimReverseResult = await response.json();

    // Format location name
    const city = data.address.city || data.address.town || data.address.village;
    const state = data.address.state;
    const country = data.address.country;

    let locationName = "";
    if (city && state) {
      locationName = `${city}, ${state}`;
    } else if (city && country) {
      locationName = `${city}, ${country}`;
    } else if (state && country) {
      locationName = `${state}, ${country}`;
    } else if (city) {
      locationName = city;
    } else if (country) {
      locationName = country;
    } else {
      locationName = data.display_name.split(",").slice(0, 2).join(",");
    }

    return NextResponse.json(
      {
        locationName,
        displayName: data.display_name,
        city,
        state,
        country,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=86400", // Cache for 24 hours
        },
      }
    );
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Reverse geocoding failed",
      },
      { status: 500 }
    );
  }
}

