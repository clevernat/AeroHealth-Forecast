"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import Leaflet to avoid SSR issues
const L = typeof window !== "undefined" ? require("leaflet") : null;

interface CountyAQI {
  fips: string;
  name: string;
  aqi: number;
  category: string;
  latitude: number;
  longitude: number;
}

interface NationalAQIData {
  counties: CountyAQI[];
  timestamp: string;
  count: number;
  coverage: string;
}

export default function NationalMap() {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const geoJsonLayerRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aqiData, setAqiData] = useState<NationalAQIData | null>(null);
  const [viewMode, setViewMode] = useState<"counties" | "markers">("markers");
  const [selectedCounty, setSelectedCounty] = useState<CountyAQI | null>(null);
  const [countiesGeoJSON, setCountiesGeoJSON] = useState<any>(null);
  const [loadingGeoJSON, setLoadingGeoJSON] = useState(false);

  // Get AQI color
  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) return "#00e400"; // Good - Green
    if (aqi <= 100) return "#ffff00"; // Moderate - Yellow
    if (aqi <= 150) return "#ff7e00"; // Unhealthy for Sensitive - Orange
    if (aqi <= 200) return "#ff0000"; // Unhealthy - Red
    if (aqi <= 300) return "#8f3f97"; // Very Unhealthy - Purple
    return "#7e0023"; // Hazardous - Maroon
  };

  // Initialize map
  useEffect(() => {
    if (!L || !mapContainerRef.current || mapRef.current) return;

    // Fix Leaflet default icon issue with webpack
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });

    // Create map centered on continental US
    mapRef.current = L.map(mapContainerRef.current, {
      center: [39.8283, -98.5795], // Geographic center of US
      zoom: 4,
      minZoom: 3,
      maxZoom: 10,
    });

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(mapRef.current);

    // Add legend
    const legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      div.style.background = "white";
      div.style.padding = "12px";
      div.style.borderRadius = "8px";
      div.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
      div.style.fontFamily = "Arial, sans-serif";
      div.style.fontSize = "13px";
      div.style.lineHeight = "1.5";
      div.style.minWidth = "180px";
      div.style.zIndex = "1000";

      const grades = [0, 51, 101, 151, 201, 301];
      const labels = [
        "Good",
        "Moderate",
        "Unhealthy for Sensitive",
        "Unhealthy",
        "Very Unhealthy",
        "Hazardous",
      ];

      let html =
        "<div style='margin: 0 0 8px 0; font-weight: bold; font-size: 14px; color: #000;'>AQI Legend</div>";

      for (let i = 0; i < grades.length; i++) {
        html +=
          '<div style="display: flex; align-items: center; margin: 4px 0; white-space: nowrap;">' +
          '<div style="background:' +
          getAQIColor(grades[i] + 1) +
          '; width: 20px; height: 20px; display: inline-block; margin-right: 8px; border-radius: 3px; flex-shrink: 0;"></div>' +
          '<div style="font-size: 13px; color: #333; flex: 1;">' +
          labels[i] +
          "</div></div>";
      }

      div.innerHTML = html;
      return div;
    };
    legend.addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Fetch national AQI data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/national-aqi");
        if (!response.ok) {
          throw new Error("Failed to fetch national AQI data");
        }

        const data: NationalAQIData = await response.json();
        setAqiData(data);
      } catch (err) {
        console.error("Error fetching national AQI:", err);
        setError("Failed to load national air quality data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add markers to map
  useEffect(() => {
    if (!L || !mapRef.current || !aqiData || viewMode !== "markers") {
      // Remove markers if switching away
      if (markersLayerRef.current && mapRef.current) {
        mapRef.current.removeLayer(markersLayerRef.current);
        markersLayerRef.current = null;
      }
      return;
    }

    // Remove old markers
    if (markersLayerRef.current) {
      mapRef.current.removeLayer(markersLayerRef.current);
    }

    // Create marker layer group
    const markersLayer = L.layerGroup();

    aqiData.counties.forEach((county) => {
      const color = getAQIColor(county.aqi);

      const marker = L.circleMarker([county.latitude, county.longitude], {
        radius: 12,
        fillColor: color,
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8,
      });

      marker.bindPopup(`
        <div style="font-family: sans-serif; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${county.name}</h3>
          <div style="margin: 4px 0;">
            <strong>AQI:</strong> 
            <span style="color: ${color}; font-weight: bold; font-size: 18px;">${county.aqi}</span>
          </div>
          <div style="margin: 4px 0;">
            <strong>Category:</strong> ${county.category}
          </div>
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee; font-size: 11px; color: #666;">
            Click marker for detailed forecast
          </div>
        </div>
      `);

      marker.on("click", () => {
        setSelectedCounty(county);
      });

      marker.addTo(markersLayer);
    });

    markersLayer.addTo(mapRef.current);
    markersLayerRef.current = markersLayer;
  }, [aqiData, viewMode]);

  // Load GeoJSON when switching to counties view
  useEffect(() => {
    if (viewMode !== "counties" || countiesGeoJSON) return;

    const fetchGeoJSON = async () => {
      try {
        setLoadingGeoJSON(true);
        const response = await fetch("/api/counties-geojson");
        if (!response.ok) {
          throw new Error("Failed to fetch counties GeoJSON");
        }
        const data = await response.json();
        setCountiesGeoJSON(data);
      } catch (err) {
        console.error("Error fetching counties GeoJSON:", err);
        setError("Failed to load county boundaries");
      } finally {
        setLoadingGeoJSON(false);
      }
    };

    fetchGeoJSON();
  }, [viewMode, countiesGeoJSON]);

  // Render county choropleth
  useEffect(() => {
    if (
      !L ||
      !mapRef.current ||
      !countiesGeoJSON ||
      !aqiData ||
      viewMode !== "counties"
    ) {
      // Remove GeoJSON layer if switching away
      if (geoJsonLayerRef.current && mapRef.current) {
        mapRef.current.removeLayer(geoJsonLayerRef.current);
        geoJsonLayerRef.current = null;
      }
      return;
    }

    // Remove old GeoJSON layer
    if (geoJsonLayerRef.current) {
      mapRef.current.removeLayer(geoJsonLayerRef.current);
    }

    // Create a map of FIPS to AQI for quick lookup
    const fipsToAQI: Record<string, CountyAQI> = {};
    aqiData.counties.forEach((county) => {
      fipsToAQI[county.fips] = county;
    });

    // Style function for counties
    const style = (feature: any) => {
      const fips = feature.id || feature.properties.GEO_ID?.slice(-5);
      const countyData = fipsToAQI[fips];

      // Default to light gray if no data
      const fillColor = countyData ? getAQIColor(countyData.aqi) : "#cccccc";

      return {
        fillColor: fillColor,
        weight: 1,
        opacity: 0.5,
        color: "white",
        fillOpacity: countyData ? 0.6 : 0.2,
      };
    };

    // Create GeoJSON layer
    const geoJsonLayer = L.geoJSON(countiesGeoJSON, {
      style: style,
      onEachFeature: (feature: any, layer: any) => {
        const fips = feature.id || feature.properties.GEO_ID?.slice(-5);
        const countyData = fipsToAQI[fips];

        if (countyData) {
          layer.bindPopup(`
            <div style="font-family: sans-serif; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${
                countyData.name
              }</h3>
              <div style="margin: 4px 0;">
                <strong>AQI:</strong>
                <span style="color: ${getAQIColor(
                  countyData.aqi
                )}; font-weight: bold; font-size: 18px;">${
            countyData.aqi
          }</span>
              </div>
              <div style="margin: 4px 0;">
                <strong>Category:</strong> ${countyData.category}
              </div>
            </div>
          `);

          layer.on("click", () => {
            setSelectedCounty(countyData);
          });
        } else {
          const countyName = feature.properties.NAME || "Unknown County";
          const stateName = feature.properties.STATE || "";
          layer.bindPopup(`
            <div style="font-family: sans-serif;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${countyName}</h3>
              <p style="margin: 0; color: #666; font-size: 12px;">No AQI data available for this county</p>
            </div>
          `);
        }
      },
    });

    geoJsonLayer.addTo(mapRef.current);
    geoJsonLayerRef.current = geoJsonLayer;
  }, [countiesGeoJSON, aqiData, viewMode]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="glass-light rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              🗺️ National Air Quality Map
            </h2>
            <p className="text-white/80 text-sm">
              Real-time air quality across major U.S. cities and regions
            </p>
            {aqiData && (
              <p className="text-white/60 text-xs mt-1">
                Showing {aqiData.count} locations • Updated{" "}
                {new Date(aqiData.timestamp).toLocaleTimeString()}
              </p>
            )}
            {viewMode === "counties" && (
              <p className="text-yellow-300/80 text-sm mt-2 flex items-center gap-1">
                ℹ️ County view shows all U.S. counties. Colored counties have
                real-time AQI data from major cities.
              </p>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("markers")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === "markers"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              📍 City Markers
            </button>
            <button
              onClick={() => setViewMode("counties")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === "counties"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              🗺️ County View
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="glass-light rounded-2xl p-4 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white font-medium">
                Loading national air quality data...
              </p>
            </div>
          </div>
        )}

        {loadingGeoJSON && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white font-medium">
                Loading county boundaries...
              </p>
              <p className="text-white/60 text-sm mt-2">
                This may take a moment (3000+ counties)
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl z-10">
            <div className="glass-light p-6 rounded-xl max-w-md text-center">
              <p className="text-red-400 font-medium mb-2">⚠️ Error</p>
              <p className="text-white/80 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div
          ref={mapContainerRef}
          className="w-full h-[600px] rounded-xl overflow-hidden"
          style={{ background: "#1a1a2e" }}
        />
      </div>

      {/* Selected County Info */}
      {selectedCounty && (
        <div className="glass-light rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {selectedCounty.name}
              </h3>
              <p className="text-white/60 text-sm">
                Detailed Air Quality Information
              </p>
            </div>
            <button
              onClick={() => setSelectedCounty(null)}
              className="text-white/60 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/60 text-sm mb-1">Current AQI</p>
              <p
                className="text-3xl font-bold"
                style={{ color: getAQIColor(selectedCounty.aqi) }}
              >
                {selectedCounty.aqi}
              </p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-white/60 text-sm mb-1">Category</p>
              <p className="text-white font-medium">
                {selectedCounty.category}
              </p>
            </div>
          </div>

          <p className="text-white/60 text-sm mt-4">
            💡 Tip: Use the location search in the main dashboard to get
            detailed hourly and daily forecasts for this area.
          </p>
        </div>
      )}
    </div>
  );
}
