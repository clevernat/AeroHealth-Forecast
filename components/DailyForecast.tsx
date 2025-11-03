"use client";

import { DailyForecast as DailyForecastType } from "@/types";
import { getAQICategory, getPollenCategory } from "@/lib/utils";
import { AQI_CATEGORIES, POLLEN_CATEGORIES } from "@/lib/constants";
import { format } from "date-fns";

interface DailyForecastProps {
  data: DailyForecastType[];
}

export default function DailyForecast({ data }: DailyForecastProps) {
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
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white">5-Day Forecast</h2>
      </div>

      <div className="space-y-4">
        {data.map((day, index) => {
          const aqiCategory = getAQICategory(day.peakAQI);
          const aqiInfo = AQI_CATEGORIES[aqiCategory];

          const treeCategory = getPollenCategory(day.peakPollen.tree);
          const grassCategory = getPollenCategory(day.peakPollen.grass);
          const weedCategory = getPollenCategory(day.peakPollen.weed);

          return (
            <div
              key={index}
              className="bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {format(new Date(day.date), "EEEE, MMM d")}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-white/90 mb-3 text-sm">
                    Air Quality
                  </h4>
                  <div
                    className="rounded-xl p-4 text-center border-2 border-white/20"
                    style={{
                      backgroundColor: aqiInfo.color,
                      boxShadow: `0 0 30px ${aqiInfo.color}40`,
                    }}
                  >
                    <div className="text-3xl font-bold text-white drop-shadow-lg">
                      {day.peakAQI}
                    </div>
                    <div className="text-sm font-bold text-white drop-shadow-md mt-1">
                      {aqiInfo.label}
                    </div>
                    <div className="text-xs text-white/90 mt-2 font-medium">
                      Avg: {day.avgAQI}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white/90 mb-3 text-sm">
                    Pollen Levels
                  </h4>
                  <div className="space-y-2">
                    <div
                      className="rounded-xl p-3 text-sm border-2 border-white/20"
                      style={{
                        backgroundColor: POLLEN_CATEGORIES[treeCategory].color,
                        boxShadow: `0 0 20px ${POLLEN_CATEGORIES[treeCategory].color}40`,
                      }}
                    >
                      <span className="font-bold text-white drop-shadow-md">
                        Tree:
                      </span>{" "}
                      <span className="text-white font-medium drop-shadow-sm">
                        {POLLEN_CATEGORIES[treeCategory].label} (
                        {day.peakPollen.tree.toFixed(1)})
                      </span>
                    </div>
                    <div
                      className="rounded-xl p-3 text-sm border-2 border-white/20"
                      style={{
                        backgroundColor: POLLEN_CATEGORIES[grassCategory].color,
                        boxShadow: `0 0 20px ${POLLEN_CATEGORIES[grassCategory].color}40`,
                      }}
                    >
                      <span className="font-bold text-white drop-shadow-md">
                        Grass:
                      </span>{" "}
                      <span className="text-white font-medium drop-shadow-sm">
                        {POLLEN_CATEGORIES[grassCategory].label} (
                        {day.peakPollen.grass.toFixed(1)})
                      </span>
                    </div>
                    <div
                      className="rounded-xl p-3 text-sm border-2 border-white/20"
                      style={{
                        backgroundColor: POLLEN_CATEGORIES[weedCategory].color,
                        boxShadow: `0 0 20px ${POLLEN_CATEGORIES[weedCategory].color}40`,
                      }}
                    >
                      <span className="font-bold text-white drop-shadow-md">
                        Weed:
                      </span>{" "}
                      <span className="text-white font-medium drop-shadow-sm">
                        {POLLEN_CATEGORIES[weedCategory].label} (
                        {day.peakPollen.weed.toFixed(1)})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
