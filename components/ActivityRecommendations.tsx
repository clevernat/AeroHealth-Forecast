"use client";

import { HealthConditions } from "./HealthProfile";

interface ActivityRecommendationsProps {
  aqi: number;
  category: string;
  healthConditions: HealthConditions;
  pollutants?: {
    pm2_5?: number;
    pm10?: number;
    ozone?: number;
  };
}

interface Recommendation {
  activity: string;
  icon: string;
  status: "safe" | "caution" | "avoid";
  message: string;
  tips?: string[];
}

export default function ActivityRecommendations({
  aqi,
  category,
  healthConditions,
  pollutants,
}: ActivityRecommendationsProps) {
  const hasConditions = Object.values(healthConditions).some((v) => v);

  // Generate recommendations based on AQI and health conditions
  const getRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];

    // Outdoor Exercise
    if (aqi <= 50) {
      recommendations.push({
        activity: "Outdoor Exercise",
        icon: "🏃",
        status: "safe",
        message: "Great time for jogging, cycling, or outdoor sports!",
        tips: [
          "Perfect conditions for all outdoor activities",
          "Stay hydrated",
        ],
      });
    } else if (aqi <= 100) {
      if (hasConditions) {
        recommendations.push({
          activity: "Outdoor Exercise",
          icon: "🏃",
          status: "caution",
          message: "Limit prolonged outdoor exertion",
          tips: [
            "Sensitive groups should reduce intense activities",
            "Take breaks indoors",
            "Monitor symptoms",
          ],
        });
      } else {
        recommendations.push({
          activity: "Outdoor Exercise",
          icon: "🏃",
          status: "safe",
          message: "Generally safe for outdoor activities",
          tips: ["Acceptable for most people", "Watch for symptoms"],
        });
      }
    } else if (aqi <= 150) {
      recommendations.push({
        activity: "Outdoor Exercise",
        icon: "🏃",
        status: hasConditions ? "avoid" : "caution",
        message: hasConditions
          ? "Avoid outdoor exercise"
          : "Reduce prolonged outdoor exertion",
        tips: hasConditions
          ? ["Stay indoors", "Use indoor gym or home workouts"]
          : ["Limit intense activities", "Take frequent breaks"],
      });
    } else {
      recommendations.push({
        activity: "Outdoor Exercise",
        icon: "🏃",
        status: "avoid",
        message: "Avoid all outdoor physical activities",
        tips: ["Stay indoors", "Use air purifiers", "Keep windows closed"],
      });
    }

    // Walking/Commuting
    if (aqi <= 100) {
      recommendations.push({
        activity: "Walking/Commuting",
        icon: "🚶",
        status: "safe",
        message: "Safe for walking and outdoor commuting",
      });
    } else if (aqi <= 150) {
      recommendations.push({
        activity: "Walking/Commuting",
        icon: "🚶",
        status: "caution",
        message: hasConditions
          ? "Consider driving or public transit"
          : "Limit time outdoors",
        tips: hasConditions
          ? ["Wear N95 mask if going outside", "Use air-conditioned transport"]
          : ["Take shorter routes", "Avoid busy roads"],
      });
    } else {
      recommendations.push({
        activity: "Walking/Commuting",
        icon: "🚶",
        status: "avoid",
        message: "Minimize outdoor exposure",
        tips: [
          "Use car or public transit",
          "Wear N95 mask",
          "Avoid peak traffic hours",
        ],
      });
    }

    // Windows & Ventilation
    if (aqi <= 50) {
      recommendations.push({
        activity: "Windows & Ventilation",
        icon: "🪟",
        status: "safe",
        message: "Open windows for fresh air circulation",
        tips: [
          "Great time to air out your home",
          "Natural ventilation recommended",
        ],
      });
    } else if (aqi <= 100) {
      recommendations.push({
        activity: "Windows & Ventilation",
        icon: "🪟",
        status: "caution",
        message: "Limit window opening time",
        tips: [
          "Open windows during cooler hours",
          "Use air purifier if available",
        ],
      });
    } else {
      recommendations.push({
        activity: "Windows & Ventilation",
        icon: "🪟",
        status: "avoid",
        message: "Keep windows closed",
        tips: [
          "Use air purifiers indoors",
          "Seal gaps around windows",
          "Use HVAC with HEPA filters",
        ],
      });
    }

    // Air Purifier
    if (aqi > 100 || (aqi > 50 && hasConditions)) {
      const shouldRun = aqi > 150 ? "continuously" : "periodically";
      recommendations.push({
        activity: "Air Purifier",
        icon: "💨",
        status: aqi > 150 ? "avoid" : "caution",
        message: `Run air purifiers ${shouldRun}`,
        tips: [
          `Set to ${aqi > 150 ? "high" : "medium"} speed`,
          "Focus on bedrooms and living areas",
          "Replace filters if needed",
          aqi > 150 ? "Keep running 24/7" : "Run for 2-4 hours",
        ],
      });
    }

    // Children's Outdoor Play
    if (healthConditions.children) {
      if (aqi <= 50) {
        recommendations.push({
          activity: "Children's Outdoor Play",
          icon: "👶",
          status: "safe",
          message: "Safe for children to play outside",
          tips: ["Great time for outdoor activities", "Encourage active play"],
        });
      } else if (aqi <= 100) {
        recommendations.push({
          activity: "Children's Outdoor Play",
          icon: "👶",
          status: "caution",
          message: "Limit outdoor playtime",
          tips: ["Reduce intense activities", "Watch for coughing or wheezing"],
        });
      } else {
        recommendations.push({
          activity: "Children's Outdoor Play",
          icon: "👶",
          status: "avoid",
          message: "Keep children indoors",
          tips: [
            "Indoor activities only",
            "Close windows",
            "Use air purifiers",
          ],
        });
      }
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "bg-green-500/20 border-green-400 text-green-200";
      case "caution":
        return "bg-yellow-500/20 border-yellow-400 text-yellow-200";
      case "avoid":
        return "bg-red-500/20 border-red-400 text-red-200";
      default:
        return "bg-gray-500/20 border-gray-400 text-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe":
        return "✅";
      case "caution":
        return "⚠️";
      case "avoid":
        return "🚫";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className="glass-dark rounded-3xl p-8 animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">💡</span>
        <div>
          <h2 className="text-3xl font-bold text-white">
            Activity Recommendations
          </h2>
          <p className="text-white/70 text-sm mt-1">
            {hasConditions
              ? "Personalized for your health profile"
              : "General recommendations based on current AQI"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`p-5 rounded-2xl border-2 ${getStatusColor(rec.status)}`}
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">{rec.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white">{rec.activity}</h3>
                  <span className="text-xl">{getStatusIcon(rec.status)}</span>
                </div>
                <p className="text-white/90 font-medium">{rec.message}</p>
              </div>
            </div>

            {rec.tips && rec.tips.length > 0 && (
              <ul className="space-y-1 ml-12">
                {rec.tips.map((tip, i) => (
                  <li
                    key={i}
                    className="text-white/70 text-sm flex items-start gap-2"
                  >
                    <span className="text-white/50">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {pollutants && pollutants.pm2_5 > 35 && (
        <div className="mt-6 p-4 bg-red-500/10 rounded-xl border border-red-400/30">
          <p className="text-red-200 text-sm">
            <strong>⚠️ High PM2.5 Alert:</strong> Fine particles at{" "}
            {pollutants.pm2_5.toFixed(1)} µg/m³.
            {hasConditions
              ? " Your health conditions make you more vulnerable. Stay indoors and use air purifiers."
              : " Consider wearing N95 masks outdoors and using air purifiers indoors."}
          </p>
        </div>
      )}
    </div>
  );
}
