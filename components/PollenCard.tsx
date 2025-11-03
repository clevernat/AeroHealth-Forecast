"use client";

import { PollenData } from "@/types";
import { POLLEN_CATEGORIES } from "@/lib/constants";

interface PollenCardProps {
  data: PollenData;
  onAllergenClick: (allergen: string) => void;
}

export default function PollenCard({ data, onAllergenClick }: PollenCardProps) {
  const pollenTypes = [
    {
      name: "Tree Pollen",
      icon: "M5 3v16h16v2H3V3h2z",
      data: data.tree,
      key: "tree",
    },
    {
      name: "Grass Pollen",
      icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
      data: data.grass,
      key: "grass",
    },
    {
      name: "Weed Pollen",
      icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z",
      data: data.weed,
      key: "weed",
    },
  ];

  return (
    <div className="glass-dark rounded-3xl p-8 shadow-2xl card-hover animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
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
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          Pollen Levels
        </h2>
      </div>

      {/* Pollen Types */}
      <div className="space-y-4">
        {pollenTypes.map((pollen) => {
          const categoryInfo = POLLEN_CATEGORIES[pollen.data.category];
          return (
            <button
              key={pollen.key}
              onClick={() => onAllergenClick(pollen.key)}
              className="w-full p-5 bg-white/10 hover:bg-white/15 rounded-2xl border border-white/20 hover:border-white/30 transition-all group text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400/30 to-emerald-500/30 rounded-xl flex items-center justify-center border border-green-400/20">
                    <svg
                      className="w-5 h-5 text-green-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={pollen.icon}
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-bold group-hover:text-green-200 transition-colors">
                      {pollen.name}
                    </div>
                    <div className="text-xs text-white/80 font-medium">
                      Level: {pollen.data.level.toFixed(1)}
                    </div>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-white/70 group-hover:text-white transition-colors"
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
              </div>
              <div
                className="rounded-xl p-4 text-center border-2 border-white/20"
                style={{
                  backgroundColor: categoryInfo.color,
                  boxShadow: `0 0 30px ${categoryInfo.color}60, inset 0 0 20px rgba(255,255,255,0.1)`,
                }}
              >
                <div className="font-bold text-white text-lg drop-shadow-md">
                  {categoryInfo.label}
                </div>
                <div className="text-sm text-white font-medium mt-1 drop-shadow-sm">
                  {categoryInfo.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 p-4 bg-white/10 rounded-2xl border border-white/20">
        <p className="text-sm text-white/90 text-center font-medium">
          💡 Click on any pollen type to learn more about sources and health
          impacts
        </p>
      </div>
    </div>
  );
}
