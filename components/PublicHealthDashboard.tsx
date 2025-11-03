"use client";

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface PublicHealthDashboardProps {
  dailyForecast: Array<{
    date: string;
    peakAQI: number;
    avgAQI: number;
  }>;
  currentAQI: number;
  location: string;
}

export default function PublicHealthDashboard({
  dailyForecast,
  currentAQI,
  location,
}: PublicHealthDashboardProps) {
  // Calculate statistics
  const avgAQI = Math.round(
    dailyForecast.reduce((sum, day) => sum + day.avgAQI, 0) / dailyForecast.length
  );
  const peakAQI = Math.max(...dailyForecast.map((d) => d.peakAQI));
  const bestAQI = Math.min(...dailyForecast.map((d) => d.avgAQI));

  // Calculate health impact estimates
  const getHealthImpact = () => {
    const unhealthyDays = dailyForecast.filter((d) => d.avgAQI > 100).length;
    const moderateDays = dailyForecast.filter(
      (d) => d.avgAQI > 50 && d.avgAQI <= 100
    ).length;
    const goodDays = dailyForecast.filter((d) => d.avgAQI <= 50).length;

    return { unhealthyDays, moderateDays, goodDays };
  };

  const healthImpact = getHealthImpact();

  // Estimate population at risk (example calculations)
  const estimatePopulationAtRisk = () => {
    // These are example percentages - in a real app, you'd use actual demographic data
    const totalPopulation = 1000000; // Example: 1 million people
    const sensitiveGroups = totalPopulation * 0.25; // 25% have asthma, allergies, etc.
    const children = totalPopulation * 0.22; // 22% children
    const elderly = totalPopulation * 0.15; // 15% elderly

    if (currentAQI > 150) {
      return {
        general: Math.round(totalPopulation * 0.8),
        sensitive: Math.round(sensitiveGroups),
        children: Math.round(children),
        elderly: Math.round(elderly),
      };
    } else if (currentAQI > 100) {
      return {
        general: 0,
        sensitive: Math.round(sensitiveGroups),
        children: Math.round(children * 0.5),
        elderly: Math.round(elderly * 0.5),
      };
    } else if (currentAQI > 50) {
      return {
        general: 0,
        sensitive: Math.round(sensitiveGroups * 0.3),
        children: 0,
        elderly: 0,
      };
    }

    return { general: 0, sensitive: 0, children: 0, elderly: 0 };
  };

  const atRisk = estimatePopulationAtRisk();
  const totalAtRisk = atRisk.general + atRisk.sensitive + atRisk.children + atRisk.elderly;

  // Prepare chart data
  const trendData = dailyForecast.map((day) => ({
    date: new Date(day.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    "Average AQI": day.avgAQI,
    "Peak AQI": day.peakAQI,
  }));

  const categoryData = [
    { category: "Good (0-50)", days: healthImpact.goodDays, color: "#10b981" },
    { category: "Moderate (51-100)", days: healthImpact.moderateDays, color: "#f59e0b" },
    { category: "Unhealthy (101+)", days: healthImpact.unhealthyDays, color: "#ef4444" },
  ];

  const getAQICategory = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  };

  const getRecommendations = () => {
    if (currentAQI > 150) {
      return [
        "Issue public health advisory",
        "Recommend school outdoor activity cancellations",
        "Advise vulnerable populations to stay indoors",
        "Increase public transit to reduce vehicle emissions",
        "Activate emergency air quality response plan",
      ];
    } else if (currentAQI > 100) {
      return [
        "Alert sensitive groups (asthma, heart disease, elderly)",
        "Recommend reducing prolonged outdoor exertion",
        "Increase air quality monitoring frequency",
        "Prepare public health messaging",
      ];
    } else if (currentAQI > 50) {
      return [
        "Monitor sensitive populations",
        "Maintain regular air quality updates",
        "Prepare for potential deterioration",
      ];
    }
    return ["Maintain routine monitoring", "No special actions required"];
  };

  return (
    <div className="glass-dark rounded-3xl p-8 animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">📊</span>
        <div>
          <h2 className="text-3xl font-bold text-white">
            Public Health Dashboard
          </h2>
          <p className="text-white/70 text-sm mt-1">
            City-wide air quality statistics for {location}
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-light rounded-2xl p-5">
          <div className="text-white/70 text-sm mb-2">Current AQI</div>
          <div className="text-4xl font-bold text-white mb-1">{currentAQI}</div>
          <div className="text-sm text-white/80">{getAQICategory(currentAQI)}</div>
        </div>

        <div className="glass-light rounded-2xl p-5">
          <div className="text-white/70 text-sm mb-2">7-Day Average</div>
          <div className="text-4xl font-bold text-white mb-1">{avgAQI}</div>
          <div className="text-sm text-white/80">{getAQICategory(avgAQI)}</div>
        </div>

        <div className="glass-light rounded-2xl p-5">
          <div className="text-white/70 text-sm mb-2">Peak AQI</div>
          <div className="text-4xl font-bold text-white mb-1">{peakAQI}</div>
          <div className="text-sm text-white/80">Highest expected</div>
        </div>

        <div className="glass-light rounded-2xl p-5">
          <div className="text-white/70 text-sm mb-2">Best AQI</div>
          <div className="text-4xl font-bold text-white mb-1">{bestAQI}</div>
          <div className="text-sm text-white/80">Lowest expected</div>
        </div>
      </div>

      {/* Population at Risk */}
      {totalAtRisk > 0 && (
        <div className="mb-8 p-6 bg-red-500/10 rounded-2xl border border-red-400/30">
          <h3 className="text-xl font-bold text-white mb-4">
            ⚠️ Estimated Population at Risk
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {atRisk.general > 0 && (
              <div>
                <div className="text-3xl font-bold text-red-300">
                  {(atRisk.general / 1000).toFixed(0)}K
                </div>
                <div className="text-white/70 text-sm">General Population</div>
              </div>
            )}
            {atRisk.sensitive > 0 && (
              <div>
                <div className="text-3xl font-bold text-orange-300">
                  {(atRisk.sensitive / 1000).toFixed(0)}K
                </div>
                <div className="text-white/70 text-sm">Sensitive Groups</div>
              </div>
            )}
            {atRisk.children > 0 && (
              <div>
                <div className="text-3xl font-bold text-yellow-300">
                  {(atRisk.children / 1000).toFixed(0)}K
                </div>
                <div className="text-white/70 text-sm">Children</div>
              </div>
            )}
            {atRisk.elderly > 0 && (
              <div>
                <div className="text-3xl font-bold text-purple-300">
                  {(atRisk.elderly / 1000).toFixed(0)}K
                </div>
                <div className="text-white/70 text-sm">Elderly (65+)</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Trend Chart */}
        <div className="glass-light rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">AQI Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="date" stroke="#ffffff80" style={{ fontSize: "12px" }} />
              <YAxis stroke="#ffffff80" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Average AQI"
                stroke="#60a5fa"
                strokeWidth={2}
                dot={{ fill: "#60a5fa", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Peak AQI"
                stroke="#f87171"
                strokeWidth={2}
                dot={{ fill: "#f87171", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="glass-light rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Air Quality Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="category" stroke="#ffffff80" style={{ fontSize: "11px" }} />
              <YAxis stroke="#ffffff80" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="days" fill="#60a5fa" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass-light rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          📋 Public Health Recommendations
        </h3>
        <ul className="space-y-2">
          {getRecommendations().map((rec, index) => (
            <li key={index} className="flex items-start gap-3 text-white/80">
              <span className="text-blue-400 mt-1">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

