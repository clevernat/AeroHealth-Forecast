"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  AQIData,
  PollenData,
  HourlyForecast as HourlyForecastType,
  DailyForecast as DailyForecastType,
} from "@/types";
import { getUserLocation } from "@/lib/utils";
import AQICard from "@/components/AQICard";
import PollenCard from "@/components/PollenCard";
import InfoModal from "@/components/InfoModal";
import HourlyForecast from "@/components/HourlyForecast";
import DailyForecast from "@/components/DailyForecast";

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => <div className="text-center p-8">Loading map...</div>,
});

export default function Home() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [pollenData, setPollenData] = useState<PollenData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastType[]>(
    []
  );
  const [dailyForecast, setDailyForecast] = useState<DailyForecastType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalInfo, setModalInfo] = useState<{
    type: "pollutant" | "allergen";
    id: string;
  } | null>(null);
  const [activeView, setActiveView] = useState<
    "dashboard" | "hourly" | "daily" | "map"
  >("dashboard");

  useEffect(() => {
    async function fetchLocation() {
      try {
        const position = await getUserLocation();
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(coords);
      } catch (err) {
        // Default to a sample location (e.g., New York City) if geolocation fails
        console.error("Geolocation error:", err);
        setLocation({ latitude: 40.7128, longitude: -74.006 });
      }
    }

    fetchLocation();
  }, []);

  useEffect(() => {
    if (!location) return;

    async function fetchData(loc: { latitude: number; longitude: number }) {
      setLoading(true);
      setError(null);

      try {
        // Fetch AQI data
        const aqiResponse = await fetch(
          `/api/aqi?latitude=${loc.latitude}&longitude=${loc.longitude}`
        );
        if (!aqiResponse.ok) throw new Error("Failed to fetch AQI data");
        const aqiJson = await aqiResponse.json();
        setAqiData(aqiJson.current);
        setHourlyForecast(aqiJson.hourly);
        setDailyForecast(aqiJson.daily);

        // Fetch pollen data
        const pollenResponse = await fetch(
          `/api/pollen?latitude=${loc.latitude}&longitude=${loc.longitude}`
        );
        if (!pollenResponse.ok) throw new Error("Failed to fetch pollen data");
        const pollenJson = await pollenResponse.json();
        setPollenData(pollenJson.current);

        // Merge pollen data into forecasts
        setHourlyForecast((prev) =>
          prev.map((item, index) => ({
            ...item,
            pollen: pollenJson.hourly[index] || item.pollen,
          }))
        );

        setDailyForecast((prev) =>
          prev.map((item, index) => ({
            ...item,
            peakPollen: pollenJson.daily[index] || item.peakPollen,
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData(location);
  }, [location]);

  const handlePollutantClick = (pollutant: string) => {
    setModalInfo({ type: "pollutant", id: pollutant });
  };

  const handleAllergenClick = (allergen: string) => {
    setModalInfo({ type: "allergen", id: allergen });
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <div className="glass-dark rounded-3xl p-12 max-w-md mx-auto animate-fadeIn">
            <div className="relative">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h2 className="mt-6 text-2xl font-bold text-white drop-shadow-lg">
              AeroHealth Forecast
            </h2>
            <p className="mt-3 text-white/90 text-base font-medium">
              Loading air quality and pollen data...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="glass-dark rounded-3xl p-12 max-w-md mx-auto text-center animate-fadeIn border border-white/20">
          <div className="w-20 h-20 bg-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-400/30">
            <svg
              className="w-10 h-10 text-red-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">
            Oops!
          </h2>
          <p className="text-red-200 mb-8 text-base font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-200 border border-white/20"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center animate-fadeIn">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl border-2 border-white/30">
              <svg
                className="w-12 h-12 text-white drop-shadow-lg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-white drop-shadow-2xl">
            AeroHealth Forecast
          </h1>
          <p className="text-xl text-white font-semibold mb-2 drop-shadow-lg">
            Real-time Air Quality & Allergen Monitoring
          </p>
          {location && (
            <div className="inline-flex items-center gap-2 glass-dark px-5 py-2.5 rounded-full text-sm text-white font-medium mt-3 border border-white/20">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </div>
          )}
        </header>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fadeIn">
          {[
            {
              id: "dashboard",
              label: "Dashboard",
              icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
            },
            {
              id: "hourly",
              label: "24-Hour",
              icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
            },
            {
              id: "daily",
              label: "5-Day",
              icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
            },
            {
              id: "map",
              label: "Map",
              icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
            },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`group relative px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 border ${
                activeView === view.id
                  ? "glass-dark text-white shadow-2xl scale-105 border-white/30"
                  : "glass text-white hover:text-white hover:scale-105 border-white/20 hover:border-white/30"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={view.icon}
                />
              </svg>
              {view.label}
              {activeView === view.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl -z-10"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeView === "dashboard" && aqiData && pollenData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AQICard data={aqiData} onPollutantClick={handlePollutantClick} />
            <PollenCard
              data={pollenData}
              onAllergenClick={handleAllergenClick}
            />
          </div>
        )}

        {activeView === "hourly" && hourlyForecast.length > 0 && (
          <HourlyForecast data={hourlyForecast} />
        )}

        {activeView === "daily" && dailyForecast.length > 0 && (
          <DailyForecast data={dailyForecast} />
        )}

        {activeView === "map" && location && aqiData && (
          <MapView
            latitude={location.latitude}
            longitude={location.longitude}
            aqi={aqiData.aqi}
          />
        )}

        {/* Info Modal */}
        {modalInfo && (
          <InfoModal
            type={modalInfo.type}
            id={modalInfo.id}
            onClose={() => setModalInfo(null)}
          />
        )}
      </div>
    </main>
  );
}
