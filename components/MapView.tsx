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
  const [showWind, setShowWind] = useState(true);
  const [showSources, setShowSources] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.7);
  const [windOpacity, setWindOpacity] = useState(1);
  const [sourcesOpacity, setSourcesOpacity] = useState(1);

  // Track map center and zoom for dynamic updates when user pans/zooms
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    latitude,
    longitude,
  ]);
  const [mapZoom, setMapZoom] = useState<number>(12);

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
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    mapRef.current = L.map(mapContainerRef.current, {
      zoomControl: true, // Enable zoom controls
      zoomControlOptions: {
        position: "topright" as L.ControlPosition,
      },
    }).setView([latitude, longitude], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
      minZoom: 3,
    }).addTo(mapRef.current);

    // Add event listeners to update map center and zoom when user moves/zooms the map
    const handleMoveEnd = () => {
      if (mapRef.current) {
        const center = mapRef.current.getCenter();
        const zoom = mapRef.current.getZoom();
        setMapCenter([center.lat, center.lng]);
        setMapZoom(zoom);
      }
    };

    mapRef.current.on("moveend", handleMoveEnd);
    mapRef.current.on("zoomend", handleMoveEnd);

    // Mark map as initialized - use setTimeout to ensure state update triggers after map is ready
    mapInitializedRef.current = true;
    setTimeout(() => {
      setMapInitialized(true);
    }, 100);

    return () => {
      if (mapRef.current) {
        mapRef.current.off("moveend", handleMoveEnd);
        mapRef.current.off("zoomend", handleMoveEnd);
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

        // Adjust radius based on zoom level and device
        // Higher zoom = smaller area, lower zoom = larger area
        let radius: number;
        if (mapZoom >= 13) {
          radius = isMobile ? 0.15 : 0.2; // Very zoomed in - small area
        } else if (mapZoom >= 11) {
          radius = isMobile ? 0.25 : 0.35; // Medium zoom - medium area
        } else if (mapZoom >= 9) {
          radius = isMobile ? 0.4 : 0.5; // Zoomed out - larger area
        } else {
          radius = isMobile ? 0.6 : 0.8; // Very zoomed out - very large area
        }

        const response = await fetch(
          `/api/aqi-grid?latitude=${mapCenter[0]}&longitude=${mapCenter[1]}&radius=${radius}`
        );
        const data = await response.json();

        if (data.points && data.points.length > 0 && mapRef.current) {
          // Remove old heatmap
          if (heatLayerRef.current) {
            mapRef.current.removeLayer(heatLayerRef.current);
          }

          // Create heatmap with AQI color gradient
          // Significantly increased visibility with higher opacity and larger radius
          const heatLayer = L.heatLayer(data.points, {
            radius: isMobile ? 35 : 50, // Increased from 25/40
            blur: isMobile ? 25 : 35, // Increased from 20/30
            maxZoom: 17,
            max: 80, // Lowered from 100 to make colors even more vibrant
            minOpacity: 0.6, // Increased from 0.3 for better visibility
            gradient: {
              0.0: "#00FF00", // Good (bright green)
              0.15: "#ADFF2F", // Good-Moderate transition (yellow-green)
              0.3: "#FFFF00", // Moderate (bright yellow)
              0.45: "#FFA500", // Moderate-Unhealthy (orange)
              0.6: "#FF4500", // Unhealthy for sensitive (orange-red)
              0.75: "#FF0000", // Unhealthy (bright red)
              0.85: "#8B008B", // Very unhealthy (dark magenta)
              1.0: "#800000", // Hazardous (dark red/maroon)
            },
          }).addTo(mapRef.current);

          heatLayerRef.current = heatLayer;

          // Apply initial opacity using setTimeout to ensure canvas is rendered
          setTimeout(() => {
            const container = mapRef.current?.getContainer();
            if (container) {
              const canvas = container.querySelector(".leaflet-heatmap-layer");
              if (canvas instanceof HTMLElement) {
                canvas.style.opacity = heatmapOpacity.toString();
              }
            }
          }, 100);
        }
      } catch (error) {
        console.error("Error loading heatmap:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHeatmap();
  }, [
    mapCenter,
    mapZoom,
    showHeatmap,
    isMobile,
    mapInitialized,
    heatmapOpacity,
  ]);

  // Update heatmap opacity without reloading
  useEffect(() => {
    if (!heatLayerRef.current || !mapRef.current) return;

    const container = mapRef.current.getContainer();
    if (container) {
      const canvas = container.querySelector(".leaflet-heatmap-layer");
      if (canvas instanceof HTMLElement) {
        canvas.style.opacity = heatmapOpacity.toString();
      }
    }
  }, [heatmapOpacity]);

  // Load wind data
  useEffect(() => {
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
        const response = await fetch(
          `/api/wind?latitude=${mapCenter[0]}&longitude=${mapCenter[1]}`
        );
        const data = await response.json();

        if (data.grid && data.grid.length > 0 && mapRef.current) {
          // Remove old velocity layer
          if (velocityLayerRef.current) {
            mapRef.current.removeLayer(velocityLayerRef.current);
          }

          // Create wind arrows as a simple visualization
          const windGroup = L.layerGroup();

          // Reduce particle count on mobile
          const skipFactor = isMobile ? 5 : 3;
          const fontSize = isMobile ? 20 : 24;

          data.grid.forEach((point: any, index: number) => {
            // Only show every Nth point to avoid clutter
            if (index % skipFactor !== 0) return;

            const angle = Math.atan2(point.u, point.v) * (180 / Math.PI);
            const speed = Math.sqrt(point.u * point.u + point.v * point.v);

            if (speed > 0.5) {
              const icon = L.divIcon({
                className: "wind-arrow",
                html: `<div class="wind-arrow-icon" style="transform: rotate(${angle}deg); font-size: ${fontSize}px; color: #3B82F6; text-shadow: 0 0 3px white; opacity: ${windOpacity};">➤</div>`,
                iconSize: [fontSize, fontSize],
              });

              L.marker([point.lat, point.lon], { icon }).addTo(windGroup);
            }
          });

          windGroup.addTo(mapRef.current);
          velocityLayerRef.current = windGroup;
        }
      } catch (error) {
        console.error("Error loading wind data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWind();
  }, [mapCenter, showWind, isMobile, mapInitialized, windOpacity]);

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

        // Adjust search radius based on zoom level
        // Higher zoom = smaller search area, lower zoom = larger search area
        let searchRadius: number;
        if (mapZoom >= 13) {
          searchRadius = 10; // Very zoomed in - 10km radius
        } else if (mapZoom >= 11) {
          searchRadius = 25; // Medium zoom - 25km radius
        } else if (mapZoom >= 9) {
          searchRadius = 50; // Zoomed out - 50km radius
        } else {
          searchRadius = 100; // Very zoomed out - 100km radius
        }

        const response = await fetch(
          `/api/pollution-sources?latitude=${mapCenter[0]}&longitude=${mapCenter[1]}&radius=${searchRadius}`
        );
        const data = await response.json();

        // Remove old markers
        sourceMarkersRef.current.forEach((marker) => marker.remove());
        sourceMarkersRef.current = [];

        if (data.sources && data.sources.length > 0 && mapRef.current) {
          data.sources.forEach((source: PollutionSource) => {
            const icon = getSourceIcon(
              source.type,
              source.severity,
              sourcesOpacity
            );
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
  }, [mapCenter, mapZoom, showSources, mapInitialized, sourcesOpacity]);

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
        <button
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.setView([latitude, longitude], 12);
              setMapCenter([latitude, longitude]);
            }
          }}
          className="px-4 py-2 rounded-lg font-medium transition-all bg-white/10 text-white/70 hover:bg-white/20"
        >
          🎯 Reset View
        </button>
      </div>

      {/* Opacity Controls */}
      <div className="mb-4 p-4 bg-white/5 rounded-lg border border-white/10">
        <h3 className="text-white font-medium mb-3 text-sm">
          Layer Opacity Controls
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Heatmap Opacity */}
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <label className="text-white/90 text-sm mb-2 block font-medium">
              🗺️ Heatmap
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={heatmapOpacity}
                onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider slider-heatmap"
                disabled={!showHeatmap}
              />
              <span className="text-white/70 text-xs font-bold min-w-[45px] text-right">
                {Math.round(heatmapOpacity * 100)}%
              </span>
            </div>
          </div>

          {/* Wind Opacity */}
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <label className="text-white/90 text-sm mb-2 block font-medium">
              🌬️ Wind
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={windOpacity}
                onChange={(e) => setWindOpacity(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider slider-wind"
                disabled={!showWind}
              />
              <span className="text-white/70 text-xs font-bold min-w-[45px] text-right">
                {Math.round(windOpacity * 100)}%
              </span>
            </div>
          </div>

          {/* Sources Opacity */}
          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <label className="text-white/90 text-sm mb-2 block font-medium">
              🏭 Sources
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={sourcesOpacity}
                onChange={(e) => setSourcesOpacity(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider slider-sources"
                disabled={!showSources}
              />
              <span className="text-white/70 text-xs font-bold min-w-[45px] text-right">
                {Math.round(sourcesOpacity * 100)}%
              </span>
            </div>
          </div>
        </div>
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

        {/* Wind Speed Legend */}
        {showWind && (
          <div className="mt-4">
            <h3 className="text-white font-semibold text-sm mb-2">
              Wind Speed & Direction
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                <span className="text-xl text-blue-400">➤</span>
                <span className="text-white font-medium text-sm">
                  Arrow shows wind direction
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                <span className="text-white/70 text-xs">
                  More arrows = Higher wind speed
                </span>
              </div>
            </div>
            <div className="mt-2 p-2 bg-white/5 rounded-lg">
              <p className="text-white/60 text-xs">
                💡 Tip: Wind arrows are animated and point in the direction the
                wind is blowing
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions
function getSourceIcon(
  type: string,
  severity?: string,
  opacity: number = 1
): string {
  const emoji = getSourceEmoji(type);
  const color = severity ? getSeverityColor(severity) : "#666";
  return `<div style="font-size: 24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); background: ${color}; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; opacity: ${opacity};">${emoji}</div>`;
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
