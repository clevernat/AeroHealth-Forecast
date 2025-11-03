"use client";

import { useState, useEffect, useRef } from "react";

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

interface LocationSearchProps {
  onLocationSelect: (latitude: number, longitude: number, locationName: string) => void;
  onUseCurrentLocation: () => void;
  currentLocationName?: string;
  isLoadingLocation?: boolean;
}

export default function LocationSearch({
  onLocationSelect,
  onUseCurrentLocation,
  currentLocationName,
  isLoadingLocation = false,
}: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(async () => {
      setIsSearching(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/geocode?q=${encodeURIComponent(searchQuery)}`
        );

        if (!response.ok) {
          throw new Error("Failed to search locations");
        }

        const data = await response.json();
        setResults(data.results || []);
        setShowResults(true);
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to search locations. Please try again.");
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  const handleSelectLocation = (result: GeocodeResult) => {
    const locationName = result.city
      ? `${result.city}, ${result.state || result.country}`
      : result.displayName.split(",").slice(0, 2).join(",");

    onLocationSelect(result.latitude, result.longitude, locationName);
    setSearchQuery("");
    setShowResults(false);
    setResults([]);
  };

  return (
    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
      {/* Current Location Display */}
      {currentLocationName && (
        <div className="flex items-center gap-2 glass-dark px-4 py-2.5 rounded-xl text-sm text-white font-medium border border-white/20">
          <svg
            className="w-4 h-4 text-blue-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="truncate max-w-[200px]">{currentLocationName}</span>
        </div>
      )}

      {/* Search Input */}
      <div ref={searchRef} className="relative flex-1 max-w-md">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city, address, or ZIP code..."
            className="w-full px-4 py-2.5 pl-10 pr-10 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showResults && results.length > 0 && (
          <div className="absolute z-50 w-full mt-2 glass-dark border border-white/20 rounded-xl shadow-2xl overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectLocation(result)}
                  className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm truncate">
                        {result.city || result.name || "Unknown Location"}
                      </div>
                      <div className="text-white/60 text-xs truncate mt-0.5">
                        {result.displayName}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {showResults && results.length === 0 && !isSearching && searchQuery.length >= 2 && (
          <div className="absolute z-50 w-full mt-2 glass-dark border border-white/20 rounded-xl shadow-2xl p-4">
            <p className="text-white/60 text-sm text-center">
              No locations found. Try a different search.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="absolute z-50 w-full mt-2 glass-dark border border-red-400/30 rounded-xl shadow-2xl p-4">
            <p className="text-red-300 text-sm text-center">{error}</p>
          </div>
        )}
      </div>

      {/* Use Current Location Button */}
      <button
        onClick={onUseCurrentLocation}
        disabled={isLoadingLocation}
        className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 whitespace-nowrap"
      >
        {isLoadingLocation ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Locating...</span>
          </>
        ) : (
          <>
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
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Use My Location</span>
          </>
        )}
      </button>
    </div>
  );
}

