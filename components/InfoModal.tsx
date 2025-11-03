"use client";

import { POLLUTANT_INFO, ALLERGEN_INFO } from "@/lib/constants";

interface InfoModalProps {
  type: "pollutant" | "allergen";
  id: string;
  onClose: () => void;
}

export default function InfoModal({ type, id, onClose }: InfoModalProps) {
  const info = type === "pollutant" ? POLLUTANT_INFO[id] : ALLERGEN_INFO[id];

  if (!info) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="glass-dark rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 glass-dark border-b border-white/10 px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                type === "pollutant"
                  ? "bg-gradient-to-br from-blue-400 to-purple-500"
                  : "bg-gradient-to-br from-green-400 to-emerald-500"
              }`}
            >
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {type === "pollutant" ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                )}
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white">{info.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Description */}
          <div className="mb-6 p-5 bg-white/5 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Description
            </h3>
            <p className="text-white/80 leading-relaxed">{info.description}</p>
          </div>

          {/* Common Sources */}
          {((type === "pollutant" && "sources" in info) ||
            (type === "allergen" && "commonSources" in info)) && (
            <div className="mb-6 p-5 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-300"
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
                Common Sources
              </h3>
              <ul className="space-y-2">
                {(type === "pollutant" && "sources" in info
                  ? info.sources
                  : type === "allergen" && "commonSources" in info
                  ? info.commonSources
                  : []
                ).map((source, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-white/80"
                  >
                    <span className="text-blue-400 mt-1">•</span>
                    <span>{source}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Peak Seasons (Allergens only) */}
          {type === "allergen" && "peakSeasons" in info && (
            <div className="mb-6 p-5 bg-white/5 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-yellow-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                Peak Seasons
              </h3>
              <ul className="space-y-2">
                {info.peakSeasons.map((season, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-white/80"
                  >
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>{season}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Health Impacts */}
          <div className="mb-6 p-5 bg-white/5 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Health Impacts
            </h3>
            <ul className="space-y-2">
              {info.healthImpacts.map((impact, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-white/80"
                >
                  <span className="text-red-400 mt-1">•</span>
                  <span>{impact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Measurement Unit (Pollutants only) */}
          {type === "pollutant" && "unit" in info && (
            <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-white/10">
              <p className="text-sm text-white/70 flex items-center gap-2">
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
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Measured in:{" "}
                <span className="font-semibold text-white">{info.unit}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
