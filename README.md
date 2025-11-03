# AeroHealth Forecast 🌍💨

> **A modern, real-time air quality and allergen monitoring application for public health**

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**AeroHealth Forecast** is a free, accessible, and highly localized public health tool that empowers individuals—especially those with respiratory and allergic conditions—to make informed decisions by providing **real-time** and predictive data on air quality and airborne allergens.

This project directly addresses the **national importance of public health and environmental monitoring**, providing critical information that can help prevent health complications and improve quality of life for millions of Americans.

![AeroHealth Forecast Dashboard](https://img.shields.io/badge/Status-Production%20Ready-success)

---

## 🇺🇸 National Importance & Scope

**This project serves the entire United States and addresses a critical national public health need.**

### Why This Matters

- **🏥 Public Health Crisis**: According to the American Lung Association, over **40% of Americans** (137 million people) live in areas with unhealthy air quality
- **💰 Economic Impact**: Air pollution costs the U.S. economy over **$5 billion annually** in healthcare expenses and lost productivity
- **👶 Vulnerable Populations**: Children, elderly, pregnant women, and those with respiratory conditions are at highest risk
- **🌍 Climate Change**: Increasing wildfires, extreme weather, and pollution events make real-time monitoring more critical than ever

### National Coverage

AeroHealth Forecast provides **coast-to-coast coverage** across all 50 states:

- ✅ **25+ Major Metropolitan Areas**: From New York to Los Angeles, Chicago to Miami
- ✅ **All Geographic Regions**: Northeast, Southeast, Midwest, Southwest, West, Mountain, Alaska, Hawaii
- ✅ **Location Search**: Any U.S. city, address, or ZIP code
- ✅ **Real-Time Data**: Updated every 30 minutes nationwide
- ✅ **Free & Accessible**: No cost barrier for any American

**This is not a local tool—it's a national public health resource.**

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

### 📈 **Advanced Forecasting System**

- **24-Hour Forecast**: Interactive Recharts visualization with:

  - **Dual View Modes**: Toggle between "Overview" and "By Pollutant"
  - **Overview Mode**: Combined AQI and pollen trends
  - **By Pollutant Mode**: Individual charts for each pollutant (PM2.5, PM10, O₃, NO₂, SO₂, CO)
  - Peak time identification for each pollutant
  - Color-coded gradient area charts
  - Custom tooltips with detailed information

- **6-7 Day Extended Forecast**: Comprehensive daily outlook with:

  - Peak AQI and average AQI values
  - Peak pollen levels for all allergen types
  - **Trend Analysis**: Improving/Worsening/Stable indicators
  - Week average, peak AQI, and best AQI metrics
  - Visual trend indicators with percentage changes
  - Color-coded badges for quick scanning

- **Historical Data Comparison**: Compare today's air quality with:
  - Last week's data
  - 2 weeks ago
  - 1 month ago
  - Percentage change indicators (↑ worse / ↓ better)
  - Smart trend insights with actionable recommendations

### 🗺️ **Advanced Interactive Map**

- **Leaflet Integration**: Professional mapping with OpenStreetMap
- **Location Search**: Search any city or address worldwide
- **Color-Coded Markers**: Location marker changes color based on current AQI
- **Pollution Source Mapping**: Visualize nearby pollution sources:
  - 🏭 Industrial facilities (red markers)
  - 🛣️ Major highways and motorways (orange markers)
  - 🔥 Active wildfires from NASA FIRMS (fire markers)
  - Distance indicators for each source
  - Severity ratings (high/medium/low)
- **Interactive Popups**: Click markers for detailed information
- **AQI Legend**: Visual guide showing all AQI categories
- **Wind Overlay**: Real-time wind direction and speed visualization
- **Responsive Design**: Works seamlessly on mobile and desktop

### 🗺️ **National Air Quality Map** ⭐ NEW

**Demonstrates National Scope for EB2-NIW Petition**

- **Coast-to-Coast Coverage**: Real-time air quality data across the entire United States
- **Major Metropolitan Areas**: Covers 25+ major U.S. cities including:
  - Northeast: New York, Boston, Philadelphia, Albany
  - Southeast: Atlanta, Miami, Charlotte, Nashville, New Orleans
  - Midwest: Chicago, Detroit, Minneapolis, St. Louis, Indianapolis
  - Southwest: Houston, Dallas, Phoenix, San Antonio
  - West: Los Angeles, San Francisco, Seattle, Portland, Denver, Las Vegas
  - Mountain: Salt Lake City, Boise
  - Alaska & Hawaii: Anchorage, Honolulu
- **Interactive City Markers**: Color-coded circular markers based on current AQI
- **Click for Details**: Click any city marker to view:
  - Current AQI value and category
  - Real-time air quality status
  - Link to detailed hourly/daily forecasts
- **National Legend**: Visual AQI scale from Good (green) to Hazardous (maroon)
- **Automatic Updates**: Data refreshes every 30 minutes
- **Geographic Center**: Map centered on continental U.S. for optimal viewing
- **Zoom Controls**: Zoom from national view (zoom 4) to regional detail (zoom 10)
- **Future Enhancement**: County-level choropleth view (3000+ counties) coming soon

**Why This Matters for National Interest:**
This feature demonstrates that AeroHealth Forecast serves the **entire nation**, not just a single locality. By providing real-time air quality data from Alaska to Hawaii, from Maine to Florida, the application addresses a **nationwide public health need**. This national scope is critical for the EB2-NIW petition, showing that the project benefits Americans across all 50 states.

### 🏥 **Health & Personalized Recommendations**

- **Health Profile System**:

  - Create personalized health profiles
  - Track conditions: Asthma, Allergies, Heart Disease, COPD, Pregnancy, Children, Elderly
  - Privacy-first: All data stored locally in browser
  - Visual indicators for active conditions

- **AI-Powered Activity Recommendations**:
  - Personalized advice based on AQI and health profile
  - Activity-specific guidance:
    - 🏃 Outdoor exercise (jogging, cycling, sports)
    - 🚶 Walking and commuting
    - 🪟 Windows and ventilation
    - 💨 Air purifier usage and settings
    - 👶 Children's outdoor play
  - Color-coded status: Safe ✅ / Caution ⚠️ / Avoid 🚫
  - Detailed tips for each activity
  - Special alerts for high PM2.5 levels

### 📱 **Social & Sharing Features**

- **Share Air Quality Reports**:

  - Copy to clipboard
  - Native share API (mobile)
  - Share to Twitter
  - Share to Facebook
  - Download as image with AQI visualization
  - Shareable URLs with embedded AQI data

- **Community Reports System**:

  - Report local observations: Smoke 🔥, Dust 💨, Odor 👃, Pollen 🌸
  - Upvote system for community validation
  - Location-based filtering (within ~50km)
  - Time-based filtering (last 24 hours)
  - Real-time community insights

- **Public Health Dashboard**:
  - City-wide statistics for health officials
  - Population at risk estimates
  - AQI trend charts (7-day forecast)
  - Air quality distribution analytics
  - Public health recommendations
  - Actionable advice for officials

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
  - ✅ **6-7 Day Forecasts** - Extended predictive capabilities
  - ✅ **EPA Standards** - US AQI calculations
  - ✅ **Pollen Data** - Multiple allergen types

- **[NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/)** (Fire Information for Resource Management System)

  - ✅ **Real-time wildfire data** - Active fire detection
  - ✅ **VIIRS satellite data** - High-resolution fire monitoring
  - ✅ **Global coverage** - Worldwide fire tracking
  - ✅ **Free API access** - NASA public data

- **[OpenStreetMap Overpass API](https://overpass-api.de/)**
  - ✅ **Pollution source mapping** - Industrial facilities and highways
  - ✅ **Real-time data** - Up-to-date infrastructure information
  - ✅ **Global coverage** - Worldwide mapping data
  - ✅ **Free and open** - Community-driven data

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

3. **Set up environment variables** (Optional - for NASA FIRMS wildfire data)

   Create a `.env.local` file:

   ```bash
   NASA_FIRMS_API_KEY=your_api_key_here
   ```

   Get your free API key from [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/api/area/)

   > **Note**: The app works without this key, but wildfire markers won't appear on the map.

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
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
4. **(Optional)** Add environment variable in Vercel dashboard:
   - Key: `NASA_FIRMS_API_KEY`
   - Value: Your NASA FIRMS API key
5. Deploy!

Alternatively, use the Vercel CLI:

```bash
npm install -g vercel
vercel
```

> **Note**: The NASA FIRMS API key is optional. The app will work without it, but wildfire data won't be displayed on the map.

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

**Seven Main Views**:

1. **📊 Dashboard** (Default)

   - Current AQI with circular indicator
   - Primary pollutant highlighted
   - All 6 pollutants displayed
   - Current pollen levels for 3 allergen types
   - Click any pollutant/allergen to learn more

2. **⏰ 24-Hour Forecast**

   - Toggle between "Overview" and "By Pollutant" views
   - Interactive AQI trend chart
   - Individual pollutant charts (PM2.5, PM10, O₃, NO₂, SO₂, CO)
   - Pollen forecast chart (3 lines)
   - Hover over chart for detailed values
   - Plan your next 24 hours

3. **📅 6-7 Day Forecast**

   - Extended daily forecast cards
   - Peak and average AQI
   - Trend analysis (improving/worsening/stable)
   - Week average, peak, and best AQI metrics
   - All pollen types with badges
   - Historical comparison (last week, 2 weeks, 1 month)
   - Week-ahead planning

4. **🗺️ Map View**

   - Search any location worldwide
   - Your location on OpenStreetMap
   - Color-coded AQI marker
   - Pollution source markers (factories, highways, wildfires)
   - Wind direction overlay
   - Interactive popups with details
   - AQI legend for reference

5. **📜 History**

   - Compare today's AQI with historical data
   - View trends from last week, 2 weeks ago, 1 month ago
   - Percentage change indicators
   - Smart insights and recommendations

6. **🏥 Health**

   - Create personalized health profile
   - Get activity recommendations based on AQI
   - Air purifier usage suggestions
   - Personalized health alerts

7. **📊 Public Health**

   - City-wide statistics dashboard
   - Population at risk estimates
   - AQI trend analytics
   - Public health recommendations

8. **🌍 National Map** ⭐ NEW
   - **Coast-to-coast air quality coverage**
   - Real-time AQI for 25+ major U.S. cities
   - Interactive color-coded markers
   - Click any city for detailed AQI information
   - Demonstrates **national scope** of the application
   - Serves all 50 states from Alaska to Hawaii

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
│   ├── AQICard.tsx                      # Current AQI display with pollutant grid
│   ├── PollenCard.tsx                   # Current pollen levels display
│   ├── HourlyForecast.tsx               # 24-hour forecast charts (dual view modes)
│   ├── DailyForecast.tsx                # 6-7 day forecast cards with trends
│   ├── MapView.tsx                      # Leaflet map with pollution sources
│   ├── InfoModal.tsx                    # Educational content modals
│   ├── HealthProfile.tsx                # Health condition management
│   ├── ActivityRecommendations.tsx      # Personalized activity advice
│   ├── ShareAQI.tsx                     # Social sharing functionality
│   ├── CommunityReports.tsx             # User-generated reports
│   └── PublicHealthDashboard.tsx        # Statistics and analytics
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

- 🔔 **Push Notifications**: Alerts for poor air quality
- 🌐 **Multi-Language Support**: Spanish, Chinese, and more
- 📱 **Mobile Apps**: Native iOS and Android versions
- ⌚ **Wearable Integration**: Apple Watch, Fitbit support
- 🗺️ **Heatmaps**: Regional air quality visualization
- 📊 **Data Export**: Download your local air quality history
- 🤖 **AI Predictions**: Machine learning for better forecasts
- 🏥 **Health Integration**: Connect with health apps

### Recently Completed ✅

- ✅ **National Air Quality Map**: Coast-to-coast coverage of 25+ major U.S. cities ⭐ NEW
- ✅ **Location Search**: Search by city name or ZIP code
- ✅ **Historical Trends**: View past AQI and pollen data with comparisons
- ✅ **Personalized Recommendations**: Based on health conditions
- ✅ **Community Features**: User-reported air quality observations
- ✅ **Pollution Source Mapping**: Industrial facilities, highways, wildfires
- ✅ **Extended Forecasts**: 6-7 day forecasts with trend analysis
- ✅ **Social Sharing**: Share air quality reports on social media
- ✅ **Public Health Dashboard**: Statistics for health officials

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

**Version**: 2.0.0 (Production Ready)

---

## 🆕 What's New in v2.0

### Major Features Added

1. **🌍 National Air Quality Map** ⭐ NEW

   - **Coast-to-coast coverage** of 25+ major U.S. cities
   - Real-time AQI data from Alaska to Hawaii
   - Interactive color-coded city markers
   - Click any city for detailed AQI information
   - **Demonstrates national scope** for EB2-NIW petition
   - Serves all 50 states with real-time data

2. **🗺️ Advanced Map Features**

   - Location search with geocoding
   - Pollution source mapping (factories, highways, wildfires)
   - NASA FIRMS wildfire integration
   - Wind direction overlay
   - Interactive pollution source markers

3. **📈 Enhanced Forecasting**

   - Extended to 6-7 day forecasts
   - Dual-view 24-hour forecast (Overview + By Pollutant)
   - Individual pollutant trend charts
   - Historical data comparison (1 week, 2 weeks, 1 month)
   - Trend analysis with percentage changes

4. **🏥 Health & Recommendations**

   - Personalized health profiles
   - AI-powered activity recommendations
   - Air purifier usage suggestions
   - Condition-specific health alerts

5. **📱 Social & Community**

   - Share air quality reports (Twitter, Facebook, clipboard, image)
   - Community observation reports
   - Upvote system for community validation
   - Public health dashboard for officials

6. **🎨 UI/UX Improvements**
   - Sleek, modern, mobile-responsive design
   - Gradient buttons with hover animations
   - Full-screen modals on mobile
   - Enhanced glassmorphism effects
   - Better touch targets for mobile users
