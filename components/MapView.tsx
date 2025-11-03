"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { getAQIColor } from "@/lib/utils";

interface MapViewProps {
  latitude: number;
  longitude: number;
  aqi: number;
}

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

export default function MapView({ latitude, longitude, aqi }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const heatLayerRef = useRef<L.HeatLayer | null>(null);
  const velocityLayerRef = useRef<any>(null);
  const sourceMarkersRef = useRef<L.Marker[]>([]);
  const currentMarkerRef = useRef<L.CircleMarker | null>(null);
  const mapInitializedRef = useRef(false);

  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showWind, setShowWind] = useState(false);
  const [showSources, setShowSources] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Initialize map
  useEffect(() => {
    console.log("🗺️ Map initialization effect triggered");
    if (!mapContainerRef.current || mapRef.current) {
      console.log("🗺️ Skipping map init:", {
        hasContainer: !!mapContainerRef.current,
        hasMap: !!mapRef.current,
      });
      return;
    }

    console.log("🗺️ Creating map...");
    mapRef.current = L.map(mapContainerRef.current).setView(
      [latitude, longitude],
      11
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    // Mark map as initialized - use setTimeout to ensure state update triggers after map is ready
    mapInitializedRef.current = true;
    setTimeout(() => {
      setMapInitialized(true);
      console.log("🗺️ Map initialized successfully!");
    }, 100);

    return () => {
      console.log("🗺️ Cleaning up map...");
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      mapInitializedRef.current = false;
      setMapInitialized(false);
    };
  }, []);

  // Update current location marker
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove old marker
    if (currentMarkerRef.current) {
      currentMarkerRef.current.remove();
    }

    // Add new marker for current location
    const color = getAQIColor(aqi);
    const marker = L.circleMarker([latitude, longitude], {
      radius: 15,
      fillColor: color,
      color: "#fff",
      weight: 3,
      opacity: 1,
      fillOpacity: 0.8,
    }).addTo(mapRef.current);

    marker.bindPopup(`
      <div style="font-family: sans-serif;">
        <b style="font-size: 14px;">📍 Your Location</b><br>
        <span style="color: ${color}; font-weight: bold; font-size: 16px;">AQI: ${aqi}</span>
      </div>
    `);

    currentMarkerRef.current = marker;

    // Center map on location
    mapRef.current.setView([latitude, longitude], 11);
  }, [latitude, longitude, aqi]);

  // Load heatmap data
  useEffect(() => {
    console.log("🔥 Heatmap effect triggered:", {
      mapInitialized,
      hasMap: !!mapRef.current,
      showHeatmap,
    });

    if (!mapInitialized || !mapRef.current || !showHeatmap) {
      if (heatLayerRef.current && mapRef.current) {
        mapRef.current.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
      return;
    }

    const loadHeatmap = async () => {
      if (!mapRef.current) return;

      try {
        setLoading(true);

        // Adjust radius based on device
        const radius = isMobile ? 0.2 : 0.3;

        console.log("🔥 Fetching heatmap data...");
        const response = await fetch(
          `/api/aqi-grid?latitude=${latitude}&longitude=${longitude}&radius=${radius}`
        );
        const data = await response.json();
        console.log("🔥 Heatmap data received:", data.points?.length, "points");

        if (data.points && data.points.length > 0 && mapRef.current) {
          // Remove old heatmap
          if (heatLayerRef.current) {
            mapRef.current.removeLayer(heatLayerRef.current);
          }

          // Create heatmap with AQI color gradient
          // Adjust parameters for mobile
          const heatLayer = L.heatLayer(data.points, {
            radius: isMobile ? 20 : 30,
            blur: isMobile ? 15 : 25,
            maxZoom: 17,
            max: 200,
            gradient: {
              0.0: "#00E400", // Good (green)
              0.2: "#FFFF00", // Moderate (yellow)
              0.4: "#FF7E00", // Unhealthy for sensitive (orange)
              0.6: "#FF0000", // Unhealthy (red)
              0.8: "#8F3F97", // Very unhealthy (purple)
              1.0: "#7E0023", // Hazardous (maroon)
            },
          }).addTo(mapRef.current);

          heatLayerRef.current = heatLayer;
          console.log("🔥 Heatmap layer added to map!");
        }
      } catch (error) {
        console.error("Error loading heatmap:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHeatmap();
  }, [latitude, longitude, showHeatmap, isMobile, mapInitialized]);

  // Load wind data
  useEffect(() => {
    console.log("💨 Wind effect triggered:", {
      mapInitialized,
      hasMap: !!mapRef.current,
      showWind,
    });

    if (!mapInitialized || !mapRef.current || !showWind) {
      if (velocityLayerRef.current && mapRef.current) {
        mapRef.current.removeLayer(velocityLayerRef.current);
        velocityLayerRef.current = null;
      }
      return;
    }

    const loadWind = async () => {
      try {
        setLoading(true);
        console.log("💨 Fetching wind data...");
        const response = await fetch(
          `/api/wind?latitude=${latitude}&longitude=${longitude}`
        );
        const data = await response.json();
        console.log("💨 Wind data received:", data.grid?.length, "points");

        if (data.grid && data.grid.length > 0 && mapRef.current) {
          // Remove old velocity layer
          if (velocityLayerRef.current) {
            mapRef.current.removeLayer(velocityLayerRef.current);
          }

          // Create wind arrows as a simple visualization
          const windGroup = L.layerGroup();

          // Reduce particle count on mobile
          const skipFactor = isMobile ? 5 : 3;
          const fontSize = isMobile ? 16 : 20;

          let arrowCount = 0;
          data.grid.forEach((point: any, index: number) => {
            // Only show every Nth point to avoid clutter
            if (index % skipFactor !== 0) return;

            const angle = Math.atan2(point.u, point.v) * (180 / Math.PI);
            const speed = Math.sqrt(point.u * point.u + point.v * point.v);

            if (speed > 0.5) {
              const icon = L.divIcon({
                className: "wind-arrow",
                html: `<div style="transform: rotate(${angle}deg); font-size: ${fontSize}px;">➤</div>`,
                iconSize: [fontSize, fontSize],
              });

              L.marker([point.lat, point.lon], { icon }).addTo(windGroup);
              arrowCount++;
            }
          });

          windGroup.addTo(mapRef.current);
          velocityLayerRef.current = windGroup;
          console.log("💨 Wind layer added to map with", arrowCount, "arrows!");
        }
      } catch (error) {
        console.error("Error loading wind data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWind();
  }, [latitude, longitude, showWind, isMobile, mapInitialized]);

  // Load pollution sources
  useEffect(() => {
    if (!mapInitialized || !mapRef.current || !showSources) {
      sourceMarkersRef.current.forEach((marker) => marker.remove());
      sourceMarkersRef.current = [];
      return;
    }

    const loadSources = async () => {
      if (!mapRef.current) return;

      try {
        setLoading(true);
        const response = await fetch(
          `/api/pollution-sources?latitude=${latitude}&longitude=${longitude}&radius=25`
        );
        const data = await response.json();

        // Remove old markers
        sourceMarkersRef.current.forEach((marker) => marker.remove());
        sourceMarkersRef.current = [];

        if (data.sources && data.sources.length > 0 && mapRef.current) {
          data.sources.forEach((source: PollutionSource) => {
            const icon = getSourceIcon(source.type, source.severity);
            const marker = L.marker([source.latitude, source.longitude], {
              icon: L.divIcon({
                className: "pollution-source-marker",
                html: icon,
                iconSize: [30, 30],
              }),
            });

            if (mapRef.current) {
              marker.addTo(mapRef.current);
            }

            marker.bindPopup(`
              <div style="font-family: sans-serif; min-width: 200px;">
                <b style="font-size: 14px;">${getSourceEmoji(source.type)} ${
              source.name
            }</b><br>
                <span style="color: #666; font-size: 12px;">${source.type.toUpperCase()}</span><br>
                <p style="margin: 8px 0; font-size: 12px;">${
                  source.description
                }</p>
                ${
                  source.distance
                    ? `<span style="color: #999; font-size: 11px;">📍 ${source.distance} km away</span>`
                    : ""
                }
                ${
                  source.severity
                    ? `<br><span style="color: ${getSeverityColor(
                        source.severity
                      )}; font-weight: bold; font-size: 11px;">⚠️ ${source.severity.toUpperCase()} impact</span>`
                    : ""
                }
              </div>
            `);

            sourceMarkersRef.current.push(marker);
          });
        }
      } catch (error) {
        console.error("Error loading pollution sources:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSources();
  }, [latitude, longitude, showSources, mapInitialized]);

  return (
    <div className="glass-dark rounded-3xl p-8 shadow-2xl animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">Enhanced Map View</h2>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-blue-300">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-300"></div>
            <span className="text-sm font-medium">Loading...</span>
          </div>
        )}
      </div>

      {/* Debug Panel */}
      <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
        <p className="text-yellow-200 text-sm font-mono">
          DEBUG: mapInit={mapInitialized ? "✅" : "❌"} | heatmap=
          {showHeatmap ? "ON" : "OFF"} | wind={showWind ? "ON" : "OFF"} |
          sources={showSources ? "ON" : "OFF"}
        </p>
      </div>

      {/* Layer Controls */}
      <div className="mb-4 flex flex-wrap gap-3">
        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            showHeatmap
              ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg"
              : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
        >
          🗺️ {showHeatmap ? "Hide" : "Show"} Heatmap
        </button>
        <button
          onClick={() => setShowWind(!showWind)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            showWind
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
              : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
        >
          🌬️ {showWind ? "Hide" : "Show"} Wind
        </button>
        <button
          onClick={() => setShowSources(!showSources)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            showSources
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
              : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
        >
          🏭 {showSources ? "Hide" : "Show"} Sources
        </button>
      </div>

      <div
        ref={mapContainerRef}
        className="h-96 rounded-2xl border-2 border-white/20 overflow-hidden shadow-xl"
      />

      <div className="mt-6 p-5 bg-white/10 rounded-2xl border border-white/20">
        <p className="text-white/90 font-medium mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Interactive map with pollution heatmap, wind patterns, and pollution
          sources
        </p>

        {/* AQI Legend */}
        <div className="mb-4">
          <h3 className="text-white font-semibold text-sm mb-2">
            Air Quality Index
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
              <div
                className="w-5 h-5 rounded-full border-2 border-white/30"
                style={{ backgroundColor: "#00E400" }}
              ></div>
              <span className="text-white font-medium text-sm">Good</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
              <div
                className="w-5 h-5 rounded-full border-2 border-white/30"
                style={{ backgroundColor: "#FFFF00" }}
              ></div>
              <span className="text-white font-medium text-sm">Moderate</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
              <div
                className="w-5 h-5 rounded-full border-2 border-white/30"
                style={{ backgroundColor: "#FF7E00" }}
              ></div>
              <span className="text-white font-medium text-sm">
                Unhealthy (S)
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
              <div
                className="w-5 h-5 rounded-full border-2 border-white/30"
                style={{ backgroundColor: "#FF0000" }}
              ></div>
              <span className="text-white font-medium text-sm">Unhealthy</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
              <div
                className="w-5 h-5 rounded-full border-2 border-white/30"
                style={{ backgroundColor: "#8F3F97" }}
              ></div>
              <span className="text-white font-medium text-sm">
                Very Unhealthy
              </span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
              <div
                className="w-5 h-5 rounded-full border-2 border-white/30"
                style={{ backgroundColor: "#7E0023" }}
              ></div>
              <span className="text-white font-medium text-sm">Hazardous</span>
            </div>
          </div>
        </div>

        {/* Pollution Sources Legend */}
        {showSources && (
          <div>
            <h3 className="text-white font-semibold text-sm mb-2">
              Pollution Sources
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                <span className="text-xl">🏭</span>
                <span className="text-white font-medium text-sm">Factory</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                <span className="text-xl">🛣️</span>
                <span className="text-white font-medium text-sm">Highway</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                <span className="text-xl">🔥</span>
                <span className="text-white font-medium text-sm">Wildfire</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                <span className="text-xl">✈️</span>
                <span className="text-white font-medium text-sm">Airport</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                <span className="text-xl">⚓</span>
                <span className="text-white font-medium text-sm">Port</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions
function getSourceIcon(type: string, severity?: string): string {
  const emoji = getSourceEmoji(type);
  const color = severity ? getSeverityColor(severity) : "#666";
  return `<div style="font-size: 24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); background: ${color}; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">${emoji}</div>`;
}

function getSourceEmoji(type: string): string {
  switch (type) {
    case "factory":
      return "🏭";
    case "highway":
      return "🛣️";
    case "wildfire":
      return "🔥";
    case "airport":
      return "✈️";
    case "port":
      return "⚓";
    default:
      return "📍";
  }
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case "high":
      return "#FF0000";
    case "medium":
      return "#FF7E00";
    case "low":
      return "#FFFF00";
    default:
      return "#666";
  }
}
