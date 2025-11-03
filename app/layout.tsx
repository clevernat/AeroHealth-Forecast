import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AeroHealth Forecast - Air Quality & Allergen Monitoring",
  description: "Real-time and predictive air quality and allergen data for respiratory health",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

