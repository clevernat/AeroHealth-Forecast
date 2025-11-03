"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getAQIColor } from "@/lib/utils";

interface MapViewProps {
  latitude: number;
  longitude: number;
  aqi: number;
}

export default function MapView({ latitude, longitude, aqi }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map only once
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        [latitude, longitude],
        10
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    // Add marker for current location
    const color = getAQIColor(aqi);
    const marker = L.circleMarker([latitude, longitude], {
      radius: 15,
      fillColor: color,
      color: "#000",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.7,
    }).addTo(mapRef.current);

    marker.bindPopup(`<b>Current Location</b><br>AQI: ${aqi}`);

    // Center map on location
    mapRef.current.setView([latitude, longitude], 10);

    return () => {
      marker.remove();
    };
  }, [latitude, longitude, aqi]);

  return (
    <div className="glass-dark rounded-3xl p-8 shadow-2xl animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
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
        <h2 className="text-3xl font-bold text-white">Map View</h2>
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
          The map shows your current location with air quality indicated by
          color.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
    </div>
  );
}
