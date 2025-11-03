"use client";

import { DailyForecast as DailyForecastType } from "@/types";
import { getAQICategory, getPollenCategory } from "@/lib/utils";
import { AQI_CATEGORIES, POLLEN_CATEGORIES } from "@/lib/constants";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

interface DailyForecastProps {
  data: DailyForecastType[];
}

export default function DailyForecast({ data }: DailyForecastProps) {
  // Prepare chart data
  const chartData = data.map((day) => ({
    date: format(new Date(day.date), "EEE, MMM d"),
    shortDate: format(new Date(day.date), "EEE"),
    peakAQI: day.peakAQI,
    avgAQI: day.avgAQI,
    tree: day.peakPollen.tree,
    grass: day.peakPollen.grass,
    weed: day.peakPollen.weed,
  }));

  // Calculate trend analysis
  const calculateTrend = () => {
    if (data.length < 2) return { direction: "stable", percentage: 0 };

    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));

    const firstAvg =
      firstHalf.reduce((sum, d) => sum + d.avgAQI, 0) / firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, d) => sum + d.avgAQI, 0) / secondHalf.length;

    const change = ((secondAvg - firstAvg) / firstAvg) * 100;

    if (Math.abs(change) < 5) return { direction: "stable", percentage: 0 };
    return {
      direction: change > 0 ? "worsening" : "improving",
      percentage: Math.abs(Math.round(change)),
    };
  };

  const trend = calculateTrend();
  const avgAQI = Math.round(
    data.reduce((sum, d) => sum + d.avgAQI, 0) / data.length
  );
  const peakAQI = Math.max(...data.map((d) => d.peakAQI));
  const bestAQI = Math.min(...data.map((d) => d.avgAQI));

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
        <h2 className="text-3xl font-bold text-white">
          {data.length}-Day Extended Forecast
        </h2>
      </div>

      {/* Trend Analysis Summary */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 border border-white/20 rounded-xl p-4">
          <p className="text-white/70 text-sm mb-1">Week Average</p>
          <p className="text-2xl font-bold text-white">{avgAQI}</p>
          <p className="text-xs text-white/60 mt-1">
            {getAQICategory(avgAQI).replace(/_/g, " ").toUpperCase()}
          </p>
        </div>
        <div className="bg-white/10 border border-white/20 rounded-xl p-4">
          <p className="text-white/70 text-sm mb-1">Peak AQI</p>
          <p className="text-2xl font-bold text-white">{peakAQI}</p>
          <p className="text-xs text-white/60 mt-1">Highest expected</p>
        </div>
        <div className="bg-white/10 border border-white/20 rounded-xl p-4">
          <p className="text-white/70 text-sm mb-1">Best AQI</p>
          <p className="text-2xl font-bold text-white">{bestAQI}</p>
          <p className="text-xs text-white/60 mt-1">Lowest expected</p>
        </div>
        <div className="bg-white/10 border border-white/20 rounded-xl p-4">
          <p className="text-white/70 text-sm mb-1">Trend</p>
          <div className="flex items-center gap-2">
            {trend.direction === "improving" && (
              <>
                <span className="text-2xl">📉</span>
                <div>
                  <p className="text-lg font-bold text-green-400">Improving</p>
                  <p className="text-xs text-white/60">-{trend.percentage}%</p>
                </div>
              </>
            )}
            {trend.direction === "worsening" && (
              <>
                <span className="text-2xl">📈</span>
                <div>
                  <p className="text-lg font-bold text-red-400">Worsening</p>
                  <p className="text-xs text-white/60">+{trend.percentage}%</p>
                </div>
              </>
            )}
            {trend.direction === "stable" && (
              <>
                <span className="text-2xl">➡️</span>
                <div>
                  <p className="text-lg font-bold text-blue-400">Stable</p>
                  <p className="text-xs text-white/60">±{trend.percentage}%</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Trend Charts Section */}
      <div className="mb-8 space-y-6">
        {/* AQI Trend Chart */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-blue-300"
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
            Air Quality Trend
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id="peakAQIGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="avgAQIGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              {/* AQI Category Reference Areas */}
              <ReferenceArea y1={0} y2={50} fill="#10b981" fillOpacity={0.05} />
              <ReferenceArea
                y1={51}
                y2={100}
                fill="#fbbf24"
                fillOpacity={0.05}
              />
              <ReferenceArea
                y1={101}
                y2={150}
                fill="#f97316"
                fillOpacity={0.05}
              />
              <ReferenceArea
                y1={151}
                y2={200}
                fill="#ef4444"
                fillOpacity={0.05}
              />
              <ReferenceArea
                y1={201}
                y2={300}
                fill="#9333ea"
                fillOpacity={0.05}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="shortDate"
                stroke="#fff"
                style={{ fontSize: "12px", fontWeight: "bold" }}
              />
              <YAxis
                stroke="#fff"
                style={{ fontSize: "12px", fontWeight: "bold" }}
                label={{
                  value: "AQI",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#fff", fontWeight: "bold" },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  color: "#fff",
                  fontWeight: "bold",
                  padding: "12px",
                }}
                labelStyle={{ color: "#60a5fa", marginBottom: "8px" }}
                labelFormatter={(value) => {
                  // Find the full date from chartData
                  const dataPoint = chartData.find(
                    (d) => d.shortDate === value
                  );
                  return dataPoint ? dataPoint.date : value;
                }}
              />
              <Legend
                wrapperStyle={{
                  color: "#fff",
                  fontWeight: "bold",
                  paddingTop: "10px",
                }}
              />
              <Area
                type="monotone"
                dataKey="peakAQI"
                stroke="#60a5fa"
                strokeWidth={3}
                fill="url(#peakAQIGradient)"
                name="Peak AQI"
                dot={{ fill: "#60a5fa", r: 5, strokeWidth: 2, stroke: "#fff" }}
              />
              <Area
                type="monotone"
                dataKey="avgAQI"
                stroke="#93c5fd"
                strokeWidth={2}
                fill="url(#avgAQIGradient)"
                name="Average AQI"
                dot={{ fill: "#93c5fd", r: 4, strokeWidth: 2, stroke: "#fff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pollen Trend Chart */}
        <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-green-300"
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
            Pollen Trends
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="shortDate"
                stroke="#fff"
                style={{ fontSize: "12px", fontWeight: "bold" }}
              />
              <YAxis
                stroke="#fff"
                style={{ fontSize: "12px", fontWeight: "bold" }}
                label={{
                  value: "Pollen Level",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#fff", fontWeight: "bold" },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "12px",
                  color: "#fff",
                  fontWeight: "bold",
                  padding: "12px",
                }}
                labelStyle={{ color: "#34d399", marginBottom: "8px" }}
                labelFormatter={(value) => {
                  // Find the full date from chartData
                  const dataPoint = chartData.find(
                    (d) => d.shortDate === value
                  );
                  return dataPoint ? dataPoint.date : value;
                }}
              />
              <Legend
                wrapperStyle={{
                  color: "#fff",
                  fontWeight: "bold",
                  paddingTop: "10px",
                }}
              />
              <Line
                type="monotone"
                dataKey="tree"
                stroke="#34d399"
                strokeWidth={3}
                name="Tree Pollen"
                dot={{ fill: "#34d399", r: 5, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="grass"
                stroke="#fbbf24"
                strokeWidth={3}
                name="Grass Pollen"
                dot={{ fill: "#fbbf24", r: 5, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="weed"
                stroke="#f87171"
                strokeWidth={3}
                name="Weed Pollen"
                dot={{ fill: "#f87171", r: 5, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Day-by-Day Details Section */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <svg
            className="w-6 h-6 text-purple-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          Daily Details
        </h3>
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
