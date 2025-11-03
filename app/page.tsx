"use client";

import { useState, useEffect, useCallback } from "react";
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
import NotificationBanner from "@/components/NotificationBanner";
import LocationSearch from "@/components/LocationSearch";
import HealthProfile, { HealthConditions } from "@/components/HealthProfile";
import ActivityRecommendations from "@/components/ActivityRecommendations";
import ShareAQI from "@/components/ShareAQI";
import CommunityReports from "@/components/CommunityReports";
import PublicHealthDashboard from "@/components/PublicHealthDashboard";

// Dynamically import MapView and HistoricalData to avoid SSR issues
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => <div className="text-center p-8">Loading map...</div>,
});

const HistoricalData = dynamic(() => import("@/components/HistoricalData"), {
  ssr: false,
  loading: () => (
    <div className="text-center p-8">Loading historical data...</div>
  ),
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
    | "dashboard"
    | "hourly"
    | "daily"
    | "map"
    | "history"
    | "health"
    | "community"
  >("dashboard");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pollutionSources, setPollutionSources] = useState<any[]>([]);
  const [locationName, setLocationName] = useState<string>("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [healthConditions, setHealthConditions] = useState<HealthConditions>({
    asthma: false,
    allergies: false,
    heartDisease: false,
    copd: false,
    pregnancy: false,
    children: false,
    elderly: false,
  });

  // Fetch location name from coordinates
  const fetchLocationName = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(
          `/api/reverse-geocode?lat=${latitude}&lon=${longitude}`
        );
        if (response.ok) {
          const data = await response.json();
          setLocationName(data.locationName || "Unknown Location");
        }
      } catch (err) {
        console.error("Reverse geocoding error:", err);
        setLocationName(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      }
    },
    []
  );

  useEffect(() => {
    async function fetchLocation() {
      try {
        const position = await getUserLocation();
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(coords);
        fetchLocationName(coords.latitude, coords.longitude);
      } catch (err) {
        // Default to a sample location (e.g., New York City) if geolocation fails
        console.error("Geolocation error:", err);
        const defaultCoords = { latitude: 40.7128, longitude: -74.006 };
        setLocation(defaultCoords);
        setLocationName("New York City, NY");
      }
    }

    fetchLocation();
  }, [fetchLocationName]);

  // Fetch data function (memoized with useCallback)
  const fetchData = useCallback(
    async (
      loc: { latitude: number; longitude: number },
      isManualRefresh = false
    ) => {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        // Add timestamp to prevent caching and ensure real-time data
        const timestamp = new Date().getTime();

        // Fetch all data in parallel for faster loading
        const [aqiResponse, pollenResponse, sourcesResponse] =
          await Promise.all([
            fetch(
              `/api/aqi?latitude=${loc.latitude}&longitude=${loc.longitude}&t=${timestamp}`,
              {
                cache: "no-store",
                headers: {
                  "Cache-Control": "no-cache",
                },
              }
            ),
            fetch(
              `/api/pollen?latitude=${loc.latitude}&longitude=${loc.longitude}&t=${timestamp}`,
              {
                cache: "no-store",
                headers: {
                  "Cache-Control": "no-cache",
                },
              }
            ),
            fetch(
              `/api/pollution-sources?latitude=${loc.latitude}&longitude=${loc.longitude}&radius=50`
            ).catch(() => null), // Don't fail if pollution sources fail
          ]);

        // Process AQI data
        if (!aqiResponse.ok) throw new Error("Failed to fetch AQI data");
        const aqiJson = await aqiResponse.json();
        setAqiData(aqiJson.current);
        setHourlyForecast(aqiJson.hourly);
        setDailyForecast(aqiJson.daily);

        // Process pollen data
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

        // Process pollution sources
        if (sourcesResponse && sourcesResponse.ok) {
          const sourcesJson = await sourcesResponse.json();
          setPollutionSources(sourcesJson.sources || []);
        }

        // Update last updated timestamp
        setLastUpdated(new Date());
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    []
  );

  // Initial data fetch when location is available
  useEffect(() => {
    if (!location) return;
    fetchData(location);
  }, [location, fetchData]);

  // Auto-refresh every 30 minutes
  useEffect(() => {
    if (!location) return;

    const intervalId = setInterval(() => {
      console.log("Auto-refreshing data...");
      fetchData(location);
    }, 30 * 60 * 1000); // 30 minutes in milliseconds

    return () => clearInterval(intervalId);
  }, [location, fetchData]);

  // Manual refresh handler
  const handleManualRefresh = () => {
    if (location && !isRefreshing) {
      fetchData(location, true);
    }
  };

  const handlePollutantClick = (pollutant: string) => {
    setModalInfo({ type: "pollutant", id: pollutant });
  };

  const handleAllergenClick = (allergen: string) => {
    setModalInfo({ type: "allergen", id: allergen });
  };

  // Handle location search selection
  const handleLocationSelect = (
    latitude: number,
    longitude: number,
    name: string
  ) => {
    const newLocation = { latitude, longitude };
    console.log(`📍 Location selected: ${name} [${latitude}, ${longitude}]`);
    setLocation(newLocation);
    setLocationName(name);
    // Fetch data in background without showing loading screen
    // This allows instant map update while data loads
    fetchData(newLocation, true); // Use manual refresh mode to avoid full loading screen
  };

  // Handle "Use My Current Location" button
  const handleUseCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const position = await getUserLocation();
      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setLocation(coords);
      fetchLocationName(coords.latitude, coords.longitude);
      fetchData(coords);
    } catch (err) {
      console.error("Geolocation error:", err);
      setError("Failed to get your location. Please try searching instead.");
    } finally {
      setIsLoadingLocation(false);
    }
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
          <p className="text-xl text-white font-semibold mb-6 drop-shadow-lg">
            Real-time Air Quality & Allergen Monitoring
          </p>

          {/* Location Search */}
          <div className="mb-6 flex justify-center">
            <LocationSearch
              onLocationSelect={handleLocationSelect}
              onUseCurrentLocation={handleUseCurrentLocation}
              currentLocationName={locationName}
              isLoadingLocation={isLoadingLocation}
            />
          </div>

          {/* Health Profile, Share, and Community Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <HealthProfile onProfileChange={setHealthConditions} />
            {aqiData && location && (
              <>
                <ShareAQI
                  aqi={aqiData.aqi}
                  category={aqiData.category}
                  location={locationName}
                  pollutants={aqiData.pollutants}
                />
                <CommunityReports
                  latitude={location.latitude}
                  longitude={location.longitude}
                  locationName={locationName}
                />
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-4">
            {lastUpdated && (
              <div className="inline-flex items-center gap-2 glass-dark px-5 py-2.5 rounded-full text-sm text-white/80 font-medium border border-white/20">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}

            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border transition-all duration-200 ${
                isRefreshing
                  ? "glass-dark text-white/50 border-white/10 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-white/30 hover:shadow-xl hover:scale-105"
              }`}
            >
              <svg
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {isRefreshing ? "Refreshing..." : "Refresh Data"}
            </button>
          </div>
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
              label: `${dailyForecast.length}-Day`,
              icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
            },
            {
              id: "map",
              label: "Map",
              icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
            },
            {
              id: "history",
              label: "History",
              icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
            },
            {
              id: "health",
              label: "Health",
              icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
            },
            {
              id: "community",
              label: "Public Health",
              icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
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

        {/* Notifications */}
        {aqiData && (
          <NotificationBanner
            aqi={aqiData.aqi}
            pollutionSources={pollutionSources}
          />
        )}

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

        {activeView === "history" && location && (
          <HistoricalData
            latitude={location.latitude}
            longitude={location.longitude}
          />
        )}

        {activeView === "health" && aqiData && (
          <ActivityRecommendations
            aqi={aqiData.aqi}
            category={aqiData.category}
            healthConditions={healthConditions}
            pollutants={aqiData.pollutants}
          />
        )}

        {activeView === "community" && dailyForecast.length > 0 && aqiData && (
          <PublicHealthDashboard
            dailyForecast={dailyForecast.map((day) => ({
              date: day.date,
              peakAQI: day.peakAQI,
              avgAQI: day.avgAQI,
            }))}
            currentAQI={aqiData.aqi}
            location={locationName}
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
