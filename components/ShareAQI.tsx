"use client";

import { useState } from "react";

interface ShareAQIProps {
  aqi: number;
  category: string;
  location: string;
  pollutants?: {
    pm2_5?: number;
    pm10?: number;
    ozone?: number;
  };
}

export default function ShareAQI({
  aqi,
  category,
  location,
  pollutants,
}: ShareAQIProps) {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "#10b981"; // green
    if (aqi <= 100) return "#f59e0b"; // yellow
    if (aqi <= 150) return "#f97316"; // orange
    if (aqi <= 200) return "#ef4444"; // red
    if (aqi <= 300) return "#a855f7"; // purple
    return "#7f1d1d"; // maroon
  };

  const getAQIEmoji = (aqi: number) => {
    if (aqi <= 50) return "😊";
    if (aqi <= 100) return "😐";
    if (aqi <= 150) return "😷";
    if (aqi <= 200) return "😨";
    if (aqi <= 300) return "☠️";
    return "💀";
  };

  // Generate shareable text
  const getShareText = () => {
    const emoji = getAQIEmoji(aqi);
    return `${emoji} Air Quality in ${location}

AQI: ${aqi} (${category.toUpperCase()})
${pollutants?.pm2_5 ? `PM2.5: ${pollutants.pm2_5.toFixed(1)} µg/m³` : ""}

Check your local air quality at AeroHealth Forecast!
${window.location.origin}`;
  };

  // Generate shareable URL
  const getShareURL = () => {
    const params = new URLSearchParams({
      aqi: aqi.toString(),
      location: location,
      category: category,
    });
    return `${window.location.origin}?${params.toString()}`;
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Share via Web Share API
  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Air Quality in ${location}`,
          text: getShareText(),
          url: getShareURL(),
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    }
  };

  // Share to Twitter
  const shareToTwitter = () => {
    const text = encodeURIComponent(getShareText());
    window.open(
      `https://twitter.com/intent/tweet?text=${text}`,
      "_blank",
      "width=550,height=420"
    );
  };

  // Share to Facebook
  const shareToFacebook = () => {
    const url = encodeURIComponent(getShareURL());
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
      "width=550,height=420"
    );
  };

  // Download as image (canvas-based)
  const downloadImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, "#1e293b");
    gradient.addColorStop(1, "#0f172a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // AQI Circle
    const color = getAQIColor(aqi);
    ctx.fillStyle = color + "40";
    ctx.beginPath();
    ctx.arc(400, 250, 150, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(400, 250, 150, 0, Math.PI * 2);
    ctx.stroke();

    // AQI Number
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 80px Arial";
    ctx.textAlign = "center";
    ctx.fillText(aqi.toString(), 400, 270);

    // Category
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = color;
    ctx.fillText(category.toUpperCase(), 400, 320);

    // Location
    ctx.font = "28px Arial";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(location, 400, 450);

    // Pollutants
    if (pollutants && pollutants.pm2_5 && pollutants.pm10 && pollutants.ozone) {
      ctx.font = "20px Arial";
      ctx.fillStyle = "#cbd5e1";
      ctx.fillText(
        `PM2.5: ${pollutants.pm2_5.toFixed(
          1
        )} µg/m³  |  PM10: ${pollutants.pm10.toFixed(
          1
        )} µg/m³  |  O₃: ${pollutants.ozone.toFixed(0)} µg/m³`,
        400,
        490
      );
    }

    // Footer
    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "#60a5fa";
    ctx.fillText("AeroHealth Forecast", 400, 550);

    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `aqi-${location.replace(/\s+/g, "-")}-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="group px-4 sm:px-5 py-2.5 rounded-2xl flex items-center gap-2 transition-all duration-300 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-600 hover:shadow-2xl hover:shadow-blue-500/50 hover:scale-105 active:scale-95"
      >
        <svg
          className="w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        <span className="text-white font-bold text-sm hidden sm:inline">
          Share
        </span>
      </button>

      {showShareMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowShareMenu(false)}
          />

          <div className="fixed sm:absolute top-20 sm:top-full left-4 right-4 sm:left-auto sm:right-0 mt-2 w-auto sm:w-80 glass-dark rounded-3xl p-6 z-50 animate-fadeIn shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Share Air Quality
              </h3>
              <button
                onClick={() => setShowShareMenu(false)}
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

            <div className="space-y-2.5">
              {typeof navigator !== "undefined" && "share" in navigator && (
                <button
                  onClick={shareNative}
                  className="group w-full flex items-center gap-3 p-4 rounded-2xl bg-white/5 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                >
                  <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                    📱
                  </span>
                  <span className="text-white font-semibold">Share...</span>
                </button>
              )}

              <button
                onClick={copyToClipboard}
                className="group w-full flex items-center gap-3 p-4 rounded-2xl bg-white/5 hover:bg-gradient-to-r hover:from-gray-500/20 hover:to-slate-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                  {copied ? "✅" : "📋"}
                </span>
                <span className="text-white font-semibold">
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </span>
              </button>

              <button
                onClick={shareToTwitter}
                className="group w-full flex items-center gap-3 p-4 rounded-2xl bg-blue-500/20 hover:bg-blue-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-blue-400/30"
              >
                <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                  🐦
                </span>
                <span className="text-white font-semibold">
                  Share on Twitter
                </span>
              </button>

              <button
                onClick={shareToFacebook}
                className="group w-full flex items-center gap-3 p-4 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-blue-500/30"
              >
                <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                  📘
                </span>
                <span className="text-white font-semibold">
                  Share on Facebook
                </span>
              </button>

              <button
                onClick={downloadImage}
                className="group w-full flex items-center gap-3 p-4 rounded-2xl bg-purple-500/20 hover:bg-purple-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-purple-400/30"
              >
                <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
                  🖼️
                </span>
                <span className="text-white font-semibold">Download Image</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
