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
    { key: "allergies" as const, label: "Allergies", icon: "🤧", color: "purple" },
    { key: "heartDisease" as const, label: "Heart Disease", icon: "❤️", color: "red" },
    { key: "copd" as const, label: "COPD", icon: "🫁", color: "orange" },
    { key: "pregnancy" as const, label: "Pregnancy", icon: "🤰", color: "pink" },
    { key: "children" as const, label: "Children in Household", icon: "👶", color: "green" },
    { key: "elderly" as const, label: "Elderly (65+)", icon: "👴", color: "gray" },
  ];

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`glass-dark px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-white/20 transition-all ${
          hasAnyCondition ? "ring-2 ring-blue-400" : ""
        }`}
      >
        <span className="text-2xl">👤</span>
        <span className="text-white font-medium">Health Profile</span>
        {hasAnyCondition && (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
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
          <div className="absolute top-full right-0 mt-2 w-96 glass-dark rounded-2xl p-6 z-50 animate-fadeIn">
            <h3 className="text-xl font-bold text-white mb-4">
              Personalized Health Profile
            </h3>
            <p className="text-white/70 text-sm mb-6">
              Select your health conditions to receive personalized air quality
              recommendations and activity suggestions.
            </p>

            <div className="space-y-3">
              {conditionsList.map(({ key, label, icon, color }) => (
                <button
                  key={key}
                  onClick={() => toggleCondition(key)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                    conditions[key]
                      ? `bg-${color}-500/20 ring-2 ring-${color}-400`
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <span className="text-2xl">{icon}</span>
                  <span className="text-white font-medium flex-1 text-left">
                    {label}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      conditions[key]
                        ? `border-${color}-400 bg-${color}-500`
                        : "border-white/30"
                    }`}
                  >
                    {conditions[key] && (
                      <svg
                        className="w-4 h-4 text-white"
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

