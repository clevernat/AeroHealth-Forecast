"use client";

import { AQIData } from "@/types";
import { AQI_CATEGORIES } from "@/lib/constants";
import { formatPollutantName } from "@/lib/utils";

interface AQICardProps {
  data: AQIData;
  onPollutantClick: (pollutant: string) => void;
}

export default function AQICard({ data, onPollutantClick }: AQICardProps) {
  const categoryInfo = AQI_CATEGORIES[data.category];

  return (
    <div className="glass-dark rounded-3xl p-8 shadow-2xl card-hover animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          Air Quality
        </h2>
      </div>

      {/* AQI Display */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <div
            className="w-40 h-40 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20"
            style={{
              backgroundColor: categoryInfo.color,
              boxShadow: `0 0 60px ${categoryInfo.color}80, 0 0 100px ${categoryInfo.color}40`,
            }}
          >
            <div className="text-center">
              <div className="text-5xl font-bold text-white drop-shadow-lg">
                {data.aqi}
              </div>
              <div className="text-sm font-bold text-white drop-shadow-md mt-1">
                AQI
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-bold text-white mb-2 drop-shadow-md">
            {categoryInfo.label}
          </div>
          <div className="text-sm text-white/90 max-w-xs mx-auto leading-relaxed">
            {categoryInfo.healthImplications}
          </div>
        </div>
      </div>

      {/* Primary Pollutant */}
      <div className="mb-6 p-5 bg-white/10 rounded-2xl border border-white/20">
        <p className="text-white/80 text-sm mb-2 font-medium">
          Primary Pollutant
        </p>
        <button
          onClick={() => onPollutantClick(data.primaryPollutant)}
          className="text-xl font-bold text-white hover:text-blue-200 transition-colors flex items-center gap-2"
        >
          {formatPollutantName(data.primaryPollutant)}
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>

      {/* Pollutants Grid */}
      <div className="grid grid-cols-2 gap-3">
        {data.pollutants.pm2_5 !== undefined && (
          <button
            onClick={() => onPollutantClick("pm2_5")}
            className="p-4 bg-white/10 hover:bg-white/15 rounded-xl border border-white/20 hover:border-white/30 transition-all text-left group"
          >
            <div className="text-xs text-white/90 mb-1 group-hover:text-white transition-colors font-medium">
              PM2.5
            </div>
            <div className="text-lg font-bold text-white">
              {data.pollutants.pm2_5.toFixed(1)}
            </div>
            <div className="text-xs text-white/70 font-medium">µg/m³</div>
          </button>
        )}
        {data.pollutants.pm10 !== undefined && (
          <button
            onClick={() => onPollutantClick("pm10")}
            className="p-4 bg-white/10 hover:bg-white/15 rounded-xl border border-white/20 hover:border-white/30 transition-all text-left group"
          >
            <div className="text-xs text-white/90 mb-1 group-hover:text-white transition-colors font-medium">
              PM10
            </div>
            <div className="text-lg font-bold text-white">
              {data.pollutants.pm10.toFixed(1)}
            </div>
            <div className="text-xs text-white/70 font-medium">µg/m³</div>
          </button>
        )}
        {data.pollutants.ozone !== undefined && (
          <button
            onClick={() => onPollutantClick("ozone")}
            className="p-4 bg-white/10 hover:bg-white/15 rounded-xl border border-white/20 hover:border-white/30 transition-all text-left group"
          >
            <div className="text-xs text-white/90 mb-1 group-hover:text-white transition-colors font-medium">
              Ozone
            </div>
            <div className="text-lg font-bold text-white">
              {data.pollutants.ozone.toFixed(1)}
            </div>
            <div className="text-xs text-white/70 font-medium">ppb</div>
          </button>
        )}
        {data.pollutants.no2 !== undefined && (
          <button
            onClick={() => onPollutantClick("no2")}
            className="p-4 bg-white/10 hover:bg-white/15 rounded-xl border border-white/20 hover:border-white/30 transition-all text-left group"
          >
            <div className="text-xs text-white/90 mb-1 group-hover:text-white transition-colors font-medium">
              NO₂
            </div>
            <div className="text-lg font-bold text-white">
              {data.pollutants.no2.toFixed(1)}
            </div>
            <div className="text-xs text-white/70 font-medium">ppb</div>
          </button>
        )}
        {data.pollutants.so2 !== undefined && (
          <button
            onClick={() => onPollutantClick("so2")}
            className="p-4 bg-white/10 hover:bg-white/15 rounded-xl border border-white/20 hover:border-white/30 transition-all text-left group"
          >
            <div className="text-xs text-white/90 mb-1 group-hover:text-white transition-colors font-medium">
              SO₂
            </div>
            <div className="text-lg font-bold text-white">
              {data.pollutants.so2.toFixed(1)}
            </div>
            <div className="text-xs text-white/70 font-medium">ppb</div>
          </button>
        )}
        {data.pollutants.co !== undefined && (
          <button
            onClick={() => onPollutantClick("co")}
            className="p-4 bg-white/10 hover:bg-white/15 rounded-xl border border-white/20 hover:border-white/30 transition-all text-left group"
          >
            <div className="text-xs text-white/90 mb-1 group-hover:text-white transition-colors font-medium">
              CO
            </div>
            <div className="text-lg font-bold text-white">
              {data.pollutants.co.toFixed(1)}
            </div>
            <div className="text-xs text-white/70 font-medium">ppm</div>
          </button>
        )}
      </div>
    </div>
  );
}
