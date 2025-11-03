"use client";

import { useState, useEffect } from "react";

interface Notification {
  id: string;
  type: "warning" | "danger" | "info";
  title: string;
  message: string;
  icon: string;
}

interface NotificationBannerProps {
  aqi: number;
  pollutionSources?: Array<{
    type: string;
    name: string;
    distance?: number;
    severity?: string;
  }>;
}

export default function NotificationBanner({
  aqi,
  pollutionSources = [],
}: NotificationBannerProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newNotifications: Notification[] = [];

    // AQI-based notifications
    if (aqi > 150) {
      newNotifications.push({
        id: "aqi-unhealthy",
        type: "danger",
        title: "⚠️ Unhealthy Air Quality",
        message: `AQI is ${aqi}. Everyone should avoid prolonged outdoor activities.`,
        icon: "🚨",
      });
    } else if (aqi > 100) {
      newNotifications.push({
        id: "aqi-sensitive",
        type: "warning",
        title: "⚠️ Unhealthy for Sensitive Groups",
        message: `AQI is ${aqi}. Sensitive groups should limit outdoor activities.`,
        icon: "⚠️",
      });
    }

    // Pollution source notifications
    const nearbyWildfires = pollutionSources.filter(
      (s) => s.type === "wildfire" && (s.distance || 0) < 50
    );

    if (nearbyWildfires.length > 0) {
      newNotifications.push({
        id: "wildfire-alert",
        type: "danger",
        title: "🔥 Wildfire Alert",
        message: `${nearbyWildfires.length} active fire(s) detected within 50km. Air quality may be affected.`,
        icon: "🔥",
      });
    }

    const nearbyHighways = pollutionSources.filter(
      (s) => s.type === "highway" && (s.distance || 0) < 2
    );

    if (nearbyHighways.length > 0) {
      newNotifications.push({
        id: "highway-proximity",
        type: "info",
        title: "🛣️ Near Major Highway",
        message: `You are within 2km of a major highway. Traffic emissions may affect local air quality.`,
        icon: "🛣️",
      });
    }

    const highSeveritySources = pollutionSources.filter(
      (s) => s.severity === "high" && (s.distance || 0) < 10
    );

    if (highSeveritySources.length > 0) {
      newNotifications.push({
        id: "high-severity-source",
        type: "warning",
        title: "⚠️ High-Impact Pollution Source Nearby",
        message: `${highSeveritySources.length} high-impact pollution source(s) detected within 10km.`,
        icon: "⚠️",
      });
    }

    setNotifications(newNotifications);
  }, [aqi, pollutionSources]);

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  const visibleNotifications = notifications.filter(
    (n) => !dismissed.has(n.id)
  );

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="space-y-3 mb-6 animate-fadeIn">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`relative overflow-hidden rounded-2xl border-2 p-4 shadow-lg transition-all duration-300 hover:shadow-xl ${
            notification.type === "danger"
              ? "bg-red-500/20 border-red-500/50 backdrop-blur-sm"
              : notification.type === "warning"
              ? "bg-orange-500/20 border-orange-500/50 backdrop-blur-sm"
              : "bg-blue-500/20 border-blue-500/50 backdrop-blur-sm"
          }`}
        >
          {/* Animated background gradient */}
          <div
            className={`absolute inset-0 opacity-10 ${
              notification.type === "danger"
                ? "bg-gradient-to-r from-red-500 to-pink-500"
                : notification.type === "warning"
                ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                : "bg-gradient-to-r from-blue-500 to-cyan-500"
            }`}
          />

          <div className="relative flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  notification.type === "danger"
                    ? "bg-red-500/30"
                    : notification.type === "warning"
                    ? "bg-orange-500/30"
                    : "bg-blue-500/30"
                }`}
              >
                {notification.icon}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white mb-1">
                {notification.title}
              </h3>
              <p className="text-white/90 text-sm">{notification.message}</p>
            </div>

            {/* Dismiss button */}
            <button
              onClick={() => handleDismiss(notification.id)}
              className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Dismiss notification"
            >
              <svg
                className="w-5 h-5 text-white"
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

          {/* Pulse animation for danger notifications */}
          {notification.type === "danger" && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-red-500/20 animate-pulse" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

