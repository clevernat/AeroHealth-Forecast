"use client";

import { useState, useEffect } from "react";

export interface HealthConditions {
  asthma: boolean;
  allergies: boolean;
  heartDisease: boolean;
  copd: boolean;
  pregnancy: boolean;
  children: boolean;
  elderly: boolean;
}

interface HealthProfileProps {
  onProfileChange?: (conditions: HealthConditions) => void;
}

export default function HealthProfile({ onProfileChange }: HealthProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [conditions, setConditions] = useState<HealthConditions>({
    asthma: false,
    allergies: false,
    heartDisease: false,
    copd: false,
    pregnancy: false,
    children: false,
    elderly: false,
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("healthProfile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConditions(parsed);
        onProfileChange?.(parsed);
      } catch (e) {
        console.error("Failed to load health profile:", e);
      }
    }
  }, []);

  // Save to localStorage when conditions change
  useEffect(() => {
    localStorage.setItem("healthProfile", JSON.stringify(conditions));
    onProfileChange?.(conditions);
  }, [conditions, onProfileChange]);

  const toggleCondition = (key: keyof HealthConditions) => {
    setConditions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const hasAnyCondition = Object.values(conditions).some((v) => v);

  const conditionsList = [
    { key: "asthma" as const, label: "Asthma", icon: "🫁", color: "blue" },
    {
      key: "allergies" as const,
      label: "Allergies",
      icon: "🤧",
      color: "purple",
    },
    {
      key: "heartDisease" as const,
      label: "Heart Disease",
      icon: "❤️",
      color: "red",
    },
    { key: "copd" as const, label: "COPD", icon: "🫁", color: "orange" },
    {
      key: "pregnancy" as const,
      label: "Pregnancy",
      icon: "🤰",
      color: "pink",
    },
    {
      key: "children" as const,
      label: "Children in Household",
      icon: "👶",
      color: "green",
    },
    {
      key: "elderly" as const,
      label: "Elderly (65+)",
      icon: "👴",
      color: "gray",
    },
  ];

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative overflow-hidden px-4 sm:px-5 py-2.5 rounded-2xl flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 ${
          hasAnyCondition
            ? "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 shadow-lg shadow-purple-500/50"
            : "glass-dark hover:bg-white/20"
        }`}
      >
        <span className="text-xl sm:text-2xl transition-transform duration-300 group-hover:rotate-12">
          👤
        </span>
        <span className="text-white font-bold text-sm hidden sm:inline">
          Health Profile
        </span>
        <span className="text-white font-bold text-sm sm:hidden">Health</span>
        {hasAnyCondition && (
          <span className="bg-white text-purple-600 text-xs px-2.5 py-1 rounded-full font-bold shadow-lg animate-pulse">
            {Object.values(conditions).filter((v) => v).length}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="fixed sm:absolute top-20 sm:top-full left-4 right-4 sm:left-auto sm:right-0 mt-2 w-auto sm:w-96 max-w-md glass-dark rounded-3xl p-6 sm:p-8 z-50 animate-fadeIn shadow-2xl border border-white/20 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Health Profile
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="sm:hidden w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
            <p className="text-white/70 text-sm mb-6 leading-relaxed">
              Select your health conditions to receive personalized air quality
              recommendations and activity suggestions.
            </p>

            <div className="space-y-2.5">
              {conditionsList.map(({ key, label, icon, color }) => (
                <button
                  key={key}
                  onClick={() => toggleCondition(key)}
                  className={`group w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
                    conditions[key]
                      ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 ring-2 ring-purple-400 shadow-lg"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <span className="text-2xl sm:text-3xl transition-transform duration-300 group-hover:scale-110">
                    {icon}
                  </span>
                  <span className="text-white font-semibold flex-1 text-left text-sm sm:text-base">
                    {label}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      conditions[key]
                        ? "border-purple-400 bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg"
                        : "border-white/30 group-hover:border-white/50"
                    }`}
                  >
                    {conditions[key] && (
                      <svg
                        className="w-4 h-4 text-white animate-scaleIn"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-400/30">
              <p className="text-blue-200 text-sm">
                💡 <strong>Privacy Note:</strong> Your health profile is stored
                locally on your device and never sent to any server.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
