"use client";

import { HourlyForecast as HourlyForecastType } from "@/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

interface HourlyForecastProps {
  data: HourlyForecastType[];
}

export default function HourlyForecast({ data }: HourlyForecastProps) {
  const chartData = data.map((item) => ({
    time: format(new Date(item.timestamp), "ha"),
    fullDateTime: format(new Date(item.timestamp), "EEE, MMM d, h:mm a"),
    timestamp: item.timestamp,
    AQI: item.aqi,
    "Tree Pollen": item.pollen.tree,
    "Grass Pollen": item.pollen.grass,
    "Weed Pollen": item.pollen.weed,
  }));

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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white">24-Hour Forecast</h2>
      </div>

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
    </div>
  );
}
