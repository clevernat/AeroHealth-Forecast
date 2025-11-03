# AeroHealth Forecast 🌍💨

> **A modern, real-time air quality and allergen monitoring application for public health**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**AeroHealth Forecast** is a free, accessible, and highly localized public health tool that empowers individuals—especially those with respiratory and allergic conditions—to make informed decisions by providing **real-time** and predictive data on air quality and airborne allergens.

This project directly addresses the **national importance of public health and environmental monitoring**, providing critical information that can help prevent health complications and improve quality of life for millions of Americans.

![AeroHealth Forecast Dashboard](https://img.shields.io/badge/Status-Production%20Ready-success)

---

## 🎯 Core Mission

Unlike generic weather apps, AeroHealth Forecast focuses specifically on atmospheric conditions that directly impact respiratory health. By combining **real-time air quality data** with **allergen forecasts**, this application serves as a comprehensive respiratory health monitoring system with:

- ✅ **Real-time data updates** every 30 minutes
- ✅ **Manual refresh capability** for instant updates
- ✅ **Modern, accessible UI** with glassmorphic design
- ✅ **Zero cost** - completely free to use
- ✅ **No API keys required** - ready to deploy immediately

---

## ✨ Key Features

### 🔄 **Real-Time Data System**

- **Automatic Updates**: Data refreshes automatically every 30 minutes
- **Manual Refresh**: One-click refresh button for instant updates
- **Last Updated Timestamp**: Always know when data was last fetched
- **Cache-Busting Technology**: Ensures you always get fresh, current data
- **No Stale Data**: Advanced caching strategy prevents outdated information

### 📊 **Geolocation-Based Dashboard**

- **Automatic Location Detection**: Uses browser geolocation for precise local data
- **Current Air Quality Index (AQI)**: Real-time AQI with EPA-standard color-coded system
  - 🟢 Good (0-50)
  - 🟡 Moderate (51-100)
  - 🟠 Unhealthy for Sensitive Groups (101-150)
  - 🔴 Unhealthy (151-200)
  - 🟣 Very Unhealthy (201-300)
  - 🟤 Hazardous (301-500)
- **Primary Pollutant Identification**: Automatically identifies the most concerning pollutant
- **Interactive Pollutant Grid**: Click any pollutant to learn more
  - PM2.5 (Fine Particulate Matter)
  - PM10 (Coarse Particulate Matter)
  - Ozone (O₃)
  - Nitrogen Dioxide (NO₂)
  - Sulfur Dioxide (SO₂)
  - Carbon Monoxide (CO)
- **Allergen Levels**: Real-time pollen data for:
  - 🌳 Tree Pollen (Alder, Birch, Olive)
  - 🌾 Grass Pollen
  - 🌿 Weed Pollen (Ragweed, Mugwort)

### 📈 **24-Hour & 5-Day Forecasting**

- **Hourly Forecast**: Interactive Recharts visualization showing:
  - AQI trends for the next 24 hours
  - Pollen levels (Tree, Grass, Weed) with color-coded lines
  - Custom tooltips with detailed information
- **5-Day Forecast**: Daily cards displaying:
  - Peak AQI values
  - Average AQI
  - All pollen types with color-coded badges
  - Easy-to-scan visual layout

### 🗺️ **Interactive Map View**

- **Leaflet Integration**: Professional mapping with OpenStreetMap
- **Color-Coded Markers**: Location marker changes color based on current AQI
- **Interactive Popup**: Click marker for detailed location information
- **AQI Legend**: Visual guide showing all AQI categories
- **Responsive Design**: Works seamlessly on mobile and desktop

### 🎓 **Educational Component**

- **Pollutant Information Modals**: Click any pollutant to learn:
  - Scientific description
  - Common sources and origins
  - Health impacts and risks
  - Measurement units and standards
- **Allergen Information Modals**: Click any allergen to discover:
  - Common plant sources
  - Peak seasons by region
  - Allergy symptoms
  - Health impacts and prevention strategies
- **Glassmorphic Modal Design**: Beautiful, modern UI for educational content

---

## 🎨 **Modern UI/UX Design**

### Glassmorphic Design System

- **Purple Gradient Background**: Beautiful gradient from `#667eea` to `#764ba2`
- **Glassmorphism Effects**: Frosted glass appearance with backdrop blur
- **High Contrast Text**: White text with 80-90% opacity for perfect readability
- **Drop Shadows**: Text shadows ensure legibility on all backgrounds
- **Smooth Animations**: Fade-in effects and hover transitions
- **Responsive Layout**: Mobile-first design that scales beautifully

### Visual Elements

- **Gradient Icons**: Blue-to-purple gradient on all header icons
- **Color-Coded Badges**: Instant visual recognition of risk levels
- **Circular AQI Indicator**: Large, prominent display with glow effects
- **Interactive Hover States**: Smooth scale and shadow transitions
- **Loading States**: Animated spinner with glassmorphic card
- **Error Handling**: User-friendly error messages with retry options

### Typography

- **Inter Font**: Modern, highly legible Google Font
- **Font Weights**: Strategic use of medium (500) and bold (700) weights
- **Responsive Sizing**: Scales appropriately across all devices

---

## 🛠️ Technology Stack

### Frontend Framework

- **Next.js 15** (App Router)
  - React 18+ with Server Components
  - Automatic code splitting
  - Optimized image loading
  - Built-in API routes
- **TypeScript 5**
  - Full type safety
  - Enhanced IDE support
  - Reduced runtime errors
  - Better code documentation

### Styling & UI

- **Tailwind CSS 3**
  - Utility-first CSS framework
  - Custom glassmorphism utilities
  - Responsive design system
  - JIT (Just-In-Time) compilation
- **Custom CSS**
  - Glassmorphic effects (`.glass`, `.glass-dark`)
  - Smooth animations
  - Gradient backgrounds

### Data Visualization

- **Recharts 2**
  - Composable charting library
  - Responsive charts
  - Custom tooltips and styling
  - Line charts for trends
  - Area charts for forecasts

### Mapping

- **Leaflet 1.9**
  - Interactive maps
  - OpenStreetMap integration
  - Custom markers and popups
  - Dynamic imports (SSR-safe)
- **React-Leaflet 4**
  - React bindings for Leaflet
  - Component-based map building

### Backend & API

- **Next.js API Routes**
  - Serverless functions
  - Edge-optimized
  - Real-time data fetching
  - Cache control headers
- **Route Segment Config**
  - `dynamic = "force-dynamic"` - Disables static optimization
  - `revalidate = 0` - Prevents caching for real-time data

### Data Sources

- **[Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api)**
  - ✅ **100% Free** - No API key required
  - ✅ **Open Source** - Transparent data sources
  - ✅ **High Accuracy** - Combines multiple data sources
  - ✅ **Global Coverage** - Works worldwide
  - ✅ **Real-Time Updates** - Hourly data updates
  - ✅ **5-Day Forecasts** - Predictive capabilities
  - ✅ **EPA Standards** - US AQI calculations
  - ✅ **Pollen Data** - Multiple allergen types

### Deployment & Hosting

- **Vercel** (Recommended)
  - Optimized for Next.js
  - Automatic deployments from Git
  - Edge network (CDN)
  - Zero configuration
  - Free tier available
- **Alternative**: Any Node.js hosting platform

---

## 📊 Data & Accuracy

### Air Quality Index (AQI)

The application uses the **US EPA Air Quality Index** standard with precise breakpoint calculations:

| AQI Range | Category                       | Color     | Health Implications                                                    |
| --------- | ------------------------------ | --------- | ---------------------------------------------------------------------- |
| 0-50      | Good                           | 🟢 Green  | Air quality is satisfactory, and air pollution poses little or no risk |
| 51-100    | Moderate                       | 🟡 Yellow | Acceptable for most people, but sensitive individuals should be aware  |
| 101-150   | Unhealthy for Sensitive Groups | 🟠 Orange | Sensitive groups should limit prolonged outdoor exertion               |
| 151-200   | Unhealthy                      | 🔴 Red    | Everyone may experience health effects                                 |
| 201-300   | Very Unhealthy                 | 🟣 Purple | Health alert: everyone should avoid prolonged outdoor exertion         |
| 301-500   | Hazardous                      | 🟤 Maroon | Emergency conditions: everyone should avoid all outdoor exertion       |

### Pollutants Monitored

Each pollutant is calculated using EPA-standard breakpoints:

| Pollutant                 | Symbol | Unit  | Primary Sources                              |
| ------------------------- | ------ | ----- | -------------------------------------------- |
| Fine Particulate Matter   | PM2.5  | µg/m³ | Vehicle exhaust, power plants, wildfires     |
| Coarse Particulate Matter | PM10   | µg/m³ | Dust, construction, agriculture              |
| Ozone                     | O₃     | ppb   | Vehicle emissions + sunlight (photochemical) |
| Nitrogen Dioxide          | NO₂    | ppb   | Traffic, power plants, industrial facilities |
| Sulfur Dioxide            | SO₂    | ppb   | Coal/oil combustion, metal smelting          |
| Carbon Monoxide           | CO     | ppm   | Vehicle exhaust, incomplete combustion       |

**Primary Pollutant Algorithm**: The app automatically identifies which pollutant has the highest AQI value and displays it prominently.

### Pollen Types & Aggregation

| Allergen Type | Sources               | Aggregation Method                |
| ------------- | --------------------- | --------------------------------- |
| 🌳 Tree       | Alder, Birch, Olive   | Maximum value of all tree species |
| 🌾 Grass      | Various grass species | Direct from API                   |
| 🌿 Weed       | Ragweed, Mugwort      | Maximum value of all weed species |

**Pollen Categories**:

- **Low** (0-2.4): Most people won't experience symptoms
- **Moderate** (2.5-4.8): Some allergy sufferers may have symptoms
- **High** (4.9-7.2): Most allergy sufferers will have symptoms
- **Very High** (7.3+): Almost all allergy sufferers will have symptoms

### Real-Time Data Architecture

```
User Browser
    ↓
Frontend (Next.js)
    ↓ (fetch with timestamp + no-cache headers)
API Routes (/api/aqi, /api/pollen)
    ↓ (force-dynamic, revalidate=0)
Open-Meteo API
    ↓
Real-Time Data (updated hourly)
```

**Cache-Busting Strategy**:

1. **Frontend**: Timestamp parameter (`&t=${Date.now()}`) + `cache: "no-store"`
2. **API Routes**: `dynamic = "force-dynamic"` + `revalidate = 0`
3. **External Fetch**: Cache-Control headers prevent any caching
4. **Result**: Always fresh, never stale data

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/clevernat/AeroHealth-Forecast.git
   cd AeroHealth-Forecast
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build settings
4. Deploy!

Alternatively, use the Vercel CLI:

```bash
npm install -g vercel
vercel
```

---

## 📱 Usage Guide

### First Visit

1. **Allow Location Access**

   - Browser will request location permission
   - Click "Allow" for accurate local data
   - Location is only used for API requests (never stored)

2. **View Dashboard**
   - See current AQI with color-coded indicator
   - Check pollen levels for Tree, Grass, and Weed
   - Note the "Last Updated" timestamp

### Navigation

**Four Main Views**:

1. **📊 Dashboard** (Default)

   - Current AQI with circular indicator
   - Primary pollutant highlighted
   - All 6 pollutants displayed
   - Current pollen levels for 3 allergen types
   - Click any pollutant/allergen to learn more

2. **⏰ 24-Hour Forecast**

   - Interactive AQI trend chart
   - Pollen forecast chart (3 lines)
   - Hover over chart for detailed values
   - Plan your next 24 hours

3. **📅 5-Day Forecast**

   - Daily forecast cards
   - Peak and average AQI
   - All pollen types with badges
   - Week-ahead planning

4. **🗺️ Map View**
   - Your location on OpenStreetMap
   - Color-coded AQI marker
   - Interactive popup with details
   - AQI legend for reference

### Real-Time Features

**Auto-Refresh**:

- Data automatically updates every 30 minutes
- Console logs "Auto-refreshing data..." when triggered
- No page reload required

**Manual Refresh**:

- Click the "Refresh Data" button in the header
- Spinning icon indicates refresh in progress
- Timestamp updates to show new data time
- Get instant updates anytime

### Educational Features

**Learn About Pollutants**:

1. Click any pollutant name (PM2.5, Ozone, etc.)
2. Modal opens with detailed information:
   - What it is and how it forms
   - Common sources
   - Health impacts
   - Measurement units
3. Click outside or press ESC to close

**Learn About Allergens**:

1. Click any allergen type (Tree, Grass, Weed)
2. Modal shows:
   - Specific plant sources
   - Peak seasons by region
   - Allergy symptoms
   - Health recommendations
3. Close modal when done

---

## 🏥 Public Health Impact

### Who Benefits?

- **Asthma Patients**: Monitor triggers and plan outdoor activities
- **Allergy Sufferers**: Track pollen levels and prepare accordingly
- **Parents**: Protect children from harmful air quality
- **Elderly Individuals**: Avoid exposure during high-risk periods
- **Athletes**: Plan outdoor exercise when air quality is safe
- **General Public**: Stay informed about environmental health risks

### National Importance

- **Respiratory Disease Prevention**: Helps prevent asthma attacks and COPD exacerbations
- **Healthcare Cost Reduction**: Reduces emergency room visits and hospitalizations
- **Public Awareness**: Educates citizens about environmental health
- **Climate Change Adaptation**: Provides tools to cope with increasing air quality challenges
- **Equity in Health Information**: Free access ensures everyone can protect their health

## 🔒 Privacy & Security

- **No Data Collection**: The app does not store or transmit personal information
- **Location Privacy**: Location data is only used for API requests and never stored
- **Client-Side Processing**: Most data processing happens in your browser
- **No Tracking**: No analytics or tracking scripts

## 🤝 Contributing

Contributions are welcome! This is a public health tool, and improvements benefit everyone.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Open-Meteo**: For providing free, high-quality air quality and pollen data
- **US EPA**: For establishing the Air Quality Index standard
- **OpenStreetMap**: For map data and tiles
- **Next.js Team**: For the excellent framework
- **Public Health Community**: For inspiring this project

---

## 🏗️ Technical Architecture

### Project Structure

```
AeroHealth-Forecast/
├── app/
│   ├── api/
│   │   ├── aqi/
│   │   │   └── route.ts          # AQI data endpoint (force-dynamic)
│   │   └── pollen/
│   │       └── route.ts          # Pollen data endpoint (force-dynamic)
│   ├── globals.css               # Global styles + glassmorphism utilities
│   ├── layout.tsx                # Root layout with Inter font
│   └── page.tsx                  # Main app with real-time refresh logic
├── components/
│   ├── AQICard.tsx               # Current AQI display with pollutant grid
│   ├── PollenCard.tsx            # Current pollen levels display
│   ├── HourlyForecast.tsx        # 24-hour forecast charts
│   ├── DailyForecast.tsx         # 5-day forecast cards
│   ├── MapView.tsx               # Leaflet map integration
│   └── InfoModal.tsx             # Educational content modals
├── lib/
│   ├── constants.ts              # AQI/pollen categories, pollutant info
│   └── utils.ts                  # AQI calculations, helper functions
├── types/
│   └── index.ts                  # TypeScript type definitions
└── public/                       # Static assets
```

### Key Implementation Details

**Real-Time Data Flow**:

1. User opens app → Geolocation requested
2. Location obtained → `fetchData()` called
3. Frontend adds timestamp to API URLs
4. API routes fetch from Open-Meteo (no caching)
5. Data processed and returned
6. UI updates with new data
7. Auto-refresh timer set for 30 minutes
8. Repeat from step 3

**Cache Prevention Strategy**:

- **Browser Level**: `cache: "no-store"` in fetch options
- **Next.js Level**: `dynamic = "force-dynamic"` in route config
- **API Level**: Cache-Control headers on external requests
- **URL Level**: Timestamp query parameter for uniqueness

**State Management**:

- React `useState` for component state
- `useEffect` for side effects (geolocation, auto-refresh)
- `useCallback` for memoized functions
- No external state management library needed

**Performance Optimizations**:

- Dynamic imports for Leaflet (SSR-safe)
- Code splitting by route
- Optimized bundle sizes
- Lazy loading of charts
- Efficient re-renders

---

## 📞 Support & Contact

### Getting Help

- 📖 **Documentation**: You're reading it!
- 🐛 **Bug Reports**: [Open an issue](https://github.com/clevernat/AeroHealth-Forecast/issues)
- 💡 **Feature Requests**: [Open an issue](https://github.com/clevernat/AeroHealth-Forecast/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/clevernat/AeroHealth-Forecast/discussions)

### FAQ

**Q: Do I need an API key?**
A: No! The app uses the free Open-Meteo API with no authentication required.

**Q: How often does data update?**
A: Automatically every 30 minutes, or manually with the refresh button.

**Q: Does it work outside the US?**
A: Yes! Open-Meteo provides global coverage.

**Q: Is my location data stored?**
A: No. Location is only used for API requests and never stored or transmitted.

**Q: Can I use this commercially?**
A: Yes! It's MIT licensed - free for commercial use.

---

## 🔮 Future Enhancements

### Planned Features

- 🔍 **Location Search**: Search by city name or ZIP code
- 🔔 **Push Notifications**: Alerts for poor air quality
- 📈 **Historical Trends**: View past AQI and pollen data
- 👤 **Personalized Recommendations**: Based on health conditions
- 🌐 **Multi-Language Support**: Spanish, Chinese, and more
- 📱 **Mobile Apps**: Native iOS and Android versions
- ⌚ **Wearable Integration**: Apple Watch, Fitbit support
- 👥 **Community Features**: User-reported air quality
- 🗺️ **Heatmaps**: Regional air quality visualization
- 📊 **Data Export**: Download your local air quality history
- 🤖 **AI Predictions**: Machine learning for better forecasts
- 🏥 **Health Integration**: Connect with health apps

### Contributing Ideas

Have a feature idea? Open an issue on GitHub or submit a pull request!

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐ on GitHub!

---

**Built with ❤️ for public health**

_AeroHealth Forecast - Breathe Easier, Live Healthier_

---

**Repository**: [github.com/clevernat/AeroHealth-Forecast](https://github.com/clevernat/AeroHealth-Forecast)

**Live Demo**: Deploy your own in minutes with Vercel!

**Version**: 1.0.0 (Production Ready)
