"use client";

import { useState, useEffect } from "react";

interface CommunityReport {
  id: string;
  type: "smoke" | "dust" | "odor" | "pollen" | "other";
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  timestamp: number;
  upvotes: number;
  userVoted?: boolean;
}

interface CommunityReportsProps {
  latitude: number;
  longitude: number;
  locationName: string;
}

export default function CommunityReports({
  latitude,
  longitude,
  locationName,
}: CommunityReportsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [newReport, setNewReport] = useState({
    type: "smoke" as CommunityReport["type"],
    description: "",
  });

  // Load reports from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("communityReports");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setReports(parsed);
      } catch (e) {
        console.error("Failed to load reports:", e);
      }
    }
  }, []);

  // Save reports to localStorage
  const saveReports = (updatedReports: CommunityReport[]) => {
    localStorage.setItem("communityReports", JSON.stringify(updatedReports));
    setReports(updatedReports);
  };

  // Submit new report
  const submitReport = () => {
    if (!newReport.description.trim()) return;

    const report: CommunityReport = {
      id: Date.now().toString(),
      type: newReport.type,
      description: newReport.description,
      location: locationName,
      latitude,
      longitude,
      timestamp: Date.now(),
      upvotes: 0,
    };

    const updatedReports = [report, ...reports];
    saveReports(updatedReports);

    // Reset form
    setNewReport({ type: "smoke", description: "" });
    setShowReportForm(false);
  };

  // Upvote report
  const upvoteReport = (id: string) => {
    const updatedReports = reports.map((r) => {
      if (r.id === id && !r.userVoted) {
        return { ...r, upvotes: r.upvotes + 1, userVoted: true };
      }
      return r;
    });
    saveReports(updatedReports);
  };

  // Filter reports by proximity (within ~50km)
  const nearbyReports = reports.filter((r) => {
    const distance = Math.sqrt(
      Math.pow(r.latitude - latitude, 2) + Math.pow(r.longitude - longitude, 2)
    );
    return distance < 0.5; // Roughly 50km
  });

  // Filter recent reports (last 24 hours)
  const recentReports = nearbyReports.filter(
    (r) => Date.now() - r.timestamp < 24 * 60 * 60 * 1000
  );

  const reportTypes = [
    { value: "smoke", label: "Smoke", icon: "🔥", color: "red" },
    { value: "dust", label: "Dust", icon: "💨", color: "orange" },
    { value: "odor", label: "Odor", icon: "👃", color: "yellow" },
    { value: "pollen", label: "Pollen", icon: "🌸", color: "pink" },
    { value: "other", label: "Other", icon: "📝", color: "gray" },
  ];

  const getTypeInfo = (type: string) => {
    return reportTypes.find((t) => t.value === type) || reportTypes[4];
  };

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-dark px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-white/20 transition-all"
      >
        <span className="text-2xl">👥</span>
        <span className="text-white font-medium">Community</span>
        {recentReports.length > 0 && (
          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            {recentReports.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute top-full right-0 mt-2 w-96 glass-dark rounded-2xl p-6 z-50 animate-fadeIn max-h-[600px] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                Community Reports
              </h3>
              <button
                onClick={() => setShowReportForm(!showReportForm)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all"
              >
                + Report
              </button>
            </div>

            {showReportForm && (
              <div className="mb-6 p-4 bg-white/5 rounded-xl">
                <h4 className="text-white font-medium mb-3">
                  Report Air Quality Observation
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="text-white/70 text-sm mb-2 block">
                      Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {reportTypes.map((type) => (
                        <button
                          key={type.value}
                          onClick={() =>
                            setNewReport((prev) => ({
                              ...prev,
                              type: type.value as CommunityReport["type"],
                            }))
                          }
                          className={`p-2 rounded-lg text-center transition-all ${
                            newReport.type === type.value
                              ? `bg-${type.color}-500/30 ring-2 ring-${type.color}-400`
                              : "bg-white/5 hover:bg-white/10"
                          }`}
                        >
                          <div className="text-2xl mb-1">{type.icon}</div>
                          <div className="text-white text-xs">{type.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-white/70 text-sm mb-2 block">
                      Description
                    </label>
                    <textarea
                      value={newReport.description}
                      onChange={(e) =>
                        setNewReport((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Describe what you're observing..."
                      className="w-full bg-white/10 text-white rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={submitReport}
                      disabled={!newReport.description.trim()}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white py-2 rounded-lg font-medium transition-all"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => setShowReportForm(false)}
                      className="px-4 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg font-medium transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {recentReports.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-6xl mb-3 block">🌍</span>
                  <p className="text-white/70">
                    No recent reports in your area
                  </p>
                  <p className="text-white/50 text-sm mt-2">
                    Be the first to report air quality observations!
                  </p>
                </div>
              ) : (
                recentReports.map((report) => {
                  const typeInfo = getTypeInfo(report.type);
                  return (
                    <div
                      key={report.id}
                      className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{typeInfo.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium">
                              {typeInfo.label}
                            </span>
                            <span className="text-white/50 text-xs">
                              {formatTimestamp(report.timestamp)}
                            </span>
                          </div>
                          <p className="text-white/80 text-sm mb-2">
                            {report.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-white/50">
                            <span>📍 {report.location}</span>
                            <button
                              onClick={() => upvoteReport(report.id)}
                              disabled={report.userVoted}
                              className={`flex items-center gap-1 ${
                                report.userVoted
                                  ? "text-blue-400"
                                  : "hover:text-blue-400"
                              } transition-colors`}
                            >
                              <span>👍</span>
                              <span>{report.upvotes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

