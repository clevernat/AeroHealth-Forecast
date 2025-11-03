"use client";

import { HourlyForecast as HourlyForecastType } from "@/types";
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
} from "recharts";
import { format } from "date-fns";
import { useState } from "react";

interface HourlyForecastProps {
  data: HourlyForecastType[];
}

export default function HourlyForecast({ data }: HourlyForecastProps) {
  const [selectedView, setSelectedView] = useState<"overview" | "pollutants">(
    "overview"
  );

  const chartData = data.map((item) => ({
    time: format(new Date(item.timestamp), "ha"),
    fullDateTime: format(new Date(item.timestamp), "EEE, MMM d, h:mm a"),
    timestamp: item.timestamp,
    AQI: item.aqi,
    "PM2.5": item.pollutants?.pm2_5 || 0,
    PM10: item.pollutants?.pm10 || 0,
    "Ozone (O₃)": item.pollutants?.ozone || 0,
    "NO₂": item.pollutants?.no2 || 0,
    "SO₂": item.pollutants?.so2 || 0,
    CO: item.pollutants?.co || 0,
    "Tree Pollen": item.pollen.tree,
    "Grass Pollen": item.pollen.grass,
    "Weed Pollen": item.pollen.weed,
  }));

  // Find peak times for each pollutant
  const findPeakTime = (pollutant: string) => {
    const maxValue = Math.max(
      ...chartData.map((d) => d[pollutant as keyof typeof d] as number)
    );
    const peakData = chartData.find(
      (d) => d[pollutant as keyof typeof d] === maxValue
    );
    return peakData ? peakData.time : "N/A";
  };

  return (
    <div className="glass-dark rounded-3xl p-8 shadow-2xl animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">24-Hour Forecast</h2>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedView("overview")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedView === "overview"
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setSelectedView("pollutants")}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedView === "pollutants"
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            By Pollutant
          </button>
        </div>
      </div>

      {selectedView === "overview" && (
        <>
          <div className="mb-8 p-6 bg-white/10 rounded-2xl border border-white/20">
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
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
              Air Quality Index
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.3)"
                  vertical={true}
                  horizontal={true}
                />
                <XAxis
                  dataKey="time"
                  stroke="#fff"
                  style={{ fontSize: "12px", fontWeight: "bold" }}
                />
                <YAxis
                  stroke="#fff"
                  style={{ fontSize: "12px", fontWeight: "bold" }}
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
                    // Find the full date/time from chartData
                    const dataPoint = chartData.find((d) => d.time === value);
                    return dataPoint ? dataPoint.fullDateTime : value;
                  }}
                />
                <Legend wrapperStyle={{ color: "#fff", fontWeight: "bold" }} />
                <Line
                  type="monotone"
                  dataKey="AQI"
                  stroke="#60a5fa"
                  strokeWidth={3}
                  dot={{ fill: "#60a5fa", r: 4 }}
                  activeDot={{
                    r: 8,
                    fill: "#60a5fa",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-6 bg-white/10 rounded-2xl border border-white/20">
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
              Pollen Levels
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.3)"
                  vertical={true}
                  horizontal={true}
                />
                <XAxis
                  dataKey="time"
                  stroke="#fff"
                  style={{ fontSize: "12px", fontWeight: "bold" }}
                />
                <YAxis
                  stroke="#fff"
                  style={{ fontSize: "12px", fontWeight: "bold" }}
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
                    // Find the full date/time from chartData
                    const dataPoint = chartData.find((d) => d.time === value);
                    return dataPoint ? dataPoint.fullDateTime : value;
                  }}
                />
                <Legend wrapperStyle={{ color: "#fff", fontWeight: "bold" }} />
                <Line
                  type="monotone"
                  dataKey="Tree Pollen"
                  stroke="#34d399"
                  strokeWidth={3}
                  dot={{ fill: "#34d399", r: 4 }}
                  activeDot={{
                    r: 8,
                    fill: "#34d399",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Grass Pollen"
                  stroke="#fbbf24"
                  strokeWidth={3}
                  dot={{ fill: "#fbbf24", r: 4 }}
                  activeDot={{
                    r: 8,
                    fill: "#fbbf24",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Weed Pollen"
                  stroke="#f87171"
                  strokeWidth={3}
                  dot={{ fill: "#f87171", r: 4 }}
                  activeDot={{
                    r: 8,
                    fill: "#f87171",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {selectedView === "pollutants" && (
        <div className="space-y-6">
          {/* PM2.5 Chart */}
          <div className="p-6 bg-white/10 rounded-2xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                PM2.5 (Fine Particles)
              </h3>
              <div className="text-right">
                <p className="text-sm text-white/70">Peak Time</p>
                <p className="text-lg font-bold text-orange-400">
                  {findPeakTime("PM2.5")}
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPM25" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb923c" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="time"
                  stroke="#fff"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#fff"
                  style={{ fontSize: "12px" }}
                  label={{
                    value: "µg/m³",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#fff",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="PM2.5"
                  stroke="#fb923c"
                  fillOpacity={1}
                  fill="url(#colorPM25)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* PM10 Chart */}
          <div className="p-6 bg-white/10 rounded-2xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                PM10 (Coarse Particles)
              </h3>
              <div className="text-right">
                <p className="text-sm text-white/70">Peak Time</p>
                <p className="text-lg font-bold text-amber-400">
                  {findPeakTime("PM10")}
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPM10" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="time"
                  stroke="#fff"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#fff"
                  style={{ fontSize: "12px" }}
                  label={{
                    value: "µg/m³",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#fff",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="PM10"
                  stroke="#fbbf24"
                  fillOpacity={1}
                  fill="url(#colorPM10)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Ozone Chart */}
          <div className="p-6 bg-white/10 rounded-2xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Ozone (O₃)</h3>
              <div className="text-right">
                <p className="text-sm text-white/70">Peak Time</p>
                <p className="text-lg font-bold text-sky-400">
                  {findPeakTime("Ozone (O₃)")}
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorOzone" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="time"
                  stroke="#fff"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#fff"
                  style={{ fontSize: "12px" }}
                  label={{
                    value: "µg/m³",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#fff",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="Ozone (O₃)"
                  stroke="#38bdf8"
                  fillOpacity={1}
                  fill="url(#colorOzone)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* NO2 Chart */}
          <div className="p-6 bg-white/10 rounded-2xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                Nitrogen Dioxide (NO₂)
              </h3>
              <div className="text-right">
                <p className="text-sm text-white/70">Peak Time</p>
                <p className="text-lg font-bold text-red-400">
                  {findPeakTime("NO₂")}
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorNO2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="time"
                  stroke="#fff"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#fff"
                  style={{ fontSize: "12px" }}
                  label={{
                    value: "µg/m³",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#fff",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="NO₂"
                  stroke="#f87171"
                  fillOpacity={1}
                  fill="url(#colorNO2)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* SO2 Chart */}
          <div className="p-6 bg-white/10 rounded-2xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                Sulfur Dioxide (SO₂)
              </h3>
              <div className="text-right">
                <p className="text-sm text-white/70">Peak Time</p>
                <p className="text-lg font-bold text-purple-400">
                  {findPeakTime("SO₂")}
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSO2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="time"
                  stroke="#fff"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#fff"
                  style={{ fontSize: "12px" }}
                  label={{
                    value: "µg/m³",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#fff",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="SO₂"
                  stroke="#c084fc"
                  fillOpacity={1}
                  fill="url(#colorSO2)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* CO Chart */}
          <div className="p-6 bg-white/10 rounded-2xl border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">
                Carbon Monoxide (CO)
              </h3>
              <div className="text-right">
                <p className="text-sm text-white/70">Peak Time</p>
                <p className="text-lg font-bold text-green-400">
                  {findPeakTime("CO")}
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCO" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="time"
                  stroke="#fff"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#fff"
                  style={{ fontSize: "12px" }}
                  label={{
                    value: "µg/m³",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#fff",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="CO"
                  stroke="#4ade80"
                  fillOpacity={1}
                  fill="url(#colorCO)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
