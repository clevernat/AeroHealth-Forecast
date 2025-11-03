"use client";

import { useState, useEffect } from "react";
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
import { format, subDays } from "date-fns";

interface HistoricalDataPoint {
  date: string;
  aqi: number;
  pm25: number;
  pm10: number;
  ozone: number;
}

interface HistoricalDataProps {
  latitude: number;
  longitude: number;
}

export default function HistoricalData({
  latitude,
  longitude,
}: HistoricalDataProps) {
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(7);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setLoading(true);
      try {
        // Fetch historical data from Open-Meteo
        const endDate = new Date();
        const startDate = subDays(endDate, timeRange);

        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=pm10,pm2_5,ozone,us_aqi&start_date=${format(
          startDate,
          "yyyy-MM-dd"
        )}&end_date=${format(endDate, "yyyy-MM-dd")}&timezone=auto`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.hourly) {
          // Aggregate hourly data into daily averages
          const dailyData: { [key: string]: HistoricalDataPoint } = {};

          data.hourly.time.forEach((time: string, index: number) => {
            const date = format(new Date(time), "MMM dd");

            if (!dailyData[date]) {
              dailyData[date] = {
                date,
                aqi: 0,
                pm25: 0,
                pm10: 0,
                ozone: 0,
              };
            }

            dailyData[date].aqi += data.hourly.us_aqi?.[index] || 0;
            dailyData[date].pm25 += data.hourly.pm2_5?.[index] || 0;
            dailyData[date].pm10 += data.hourly.pm10?.[index] || 0;
            dailyData[date].ozone += data.hourly.ozone?.[index] || 0;
          });

          // Calculate averages
          const result = Object.values(dailyData).map((day) => ({
            date: day.date,
            aqi: Math.round(day.aqi / 24),
            pm25: Math.round(day.pm25 / 24),
            pm10: Math.round(day.pm10 / 24),
            ozone: Math.round(day.ozone / 24),
          }));

          setHistoricalData(result);
        }
      } catch (error) {
        console.error("Error fetching historical data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [latitude, longitude, timeRange]);

  return (
    <div className="glass-dark rounded-3xl p-8 shadow-2xl animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">Historical Trends</h2>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2">
          {[7, 14, 30].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days as 7 | 14 | 30)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === days
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* AQI Trend */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">
              Air Quality Index Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="aqi"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#aqiGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pollutants Comparison */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">
              Pollutant Levels Over Time
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={historicalData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend
                  wrapperStyle={{ color: "#fff" }}
                  iconType="line"
                />
                <Line
                  type="monotone"
                  dataKey="pm25"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="PM2.5"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="pm10"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="PM10"
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="ozone"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Ozone"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {historicalData.length > 0 && (
              <>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-white/70 text-sm mb-1">Avg AQI</p>
                  <p className="text-2xl font-bold text-white">
                    {Math.round(
                      historicalData.reduce((sum, d) => sum + d.aqi, 0) /
                        historicalData.length
                    )}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-white/70 text-sm mb-1">Peak AQI</p>
                  <p className="text-2xl font-bold text-white">
                    {Math.max(...historicalData.map((d) => d.aqi))}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-white/70 text-sm mb-1">Best AQI</p>
                  <p className="text-2xl font-bold text-white">
                    {Math.min(...historicalData.map((d) => d.aqi))}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-white/70 text-sm mb-1">Trend</p>
                  <p className="text-2xl font-bold text-white">
                    {historicalData[historicalData.length - 1].aqi >
                    historicalData[0].aqi
                      ? "📈"
                      : "📉"}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

