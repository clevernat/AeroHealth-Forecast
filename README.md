# AeroHealth Forecast

## 🌍 Project Overview

**AeroHealth Forecast** is a free, accessible, and highly localized public health tool that empowers individuals, especially those with respiratory and allergic conditions, to make informed decisions by providing real-time and predictive data on air quality and airborne allergens.

This project directly addresses the **national importance of public health and environmental monitoring**, providing critical information that can help prevent health complications and improve quality of life for millions of Americans.

## 🎯 Core Mission

Unlike generic weather apps, AeroHealth Forecast focuses specifically on atmospheric conditions that directly impact respiratory health. By combining air quality data with allergen forecasts, this application serves as a comprehensive respiratory health monitoring system.

## ✨ Key Features

### 1. Geolocation-Based Dashboard
- **Automatic Location Detection**: The app requests your location or allows you to search for any location in the U.S.
- **Current Air Quality Index (AQI)**: Displays real-time AQI with a clear color-coded warning system (Green, Yellow, Orange, Red, Purple, Maroon)
- **Primary Pollutant Identification**: Shows which pollutant (PM2.5, PM10, Ozone, NO₂, SO₂, CO) is currently the main concern
- **Allergen Levels**: Displays current levels for Tree, Grass, and Weed Pollen with simple risk scales (Low, Moderate, High, Very High)

### 2. 24-Hour & 5-Day Forecasting
- **Hourly Forecast**: Interactive charts showing AQI and pollen levels for the next 24 hours
- **5-Day Forecast**: Daily summaries of expected peak AQI and allergen levels
- **Visual Data Representation**: Clear, easy-to-read charts using Recharts library

### 3. Interactive Map View
- **Geographic Visualization**: Map view showing your location with color-coded AQI indicators
- **Regional Context**: Understand air quality in your immediate area
- **Color Gradient Legend**: Easy-to-understand visual guide for AQI levels

### 4. Educational Component
- **Pollutant Information**: Click on any pollutant (PM2.5, Ozone, etc.) to learn about:
  - What it is and how it forms
  - Common sources
  - Health impacts and risks
  - Measurement units
- **Allergen Information**: Click on any allergen type to discover:
  - Common sources (specific plant species)
  - Peak seasons in your region
  - Health impacts and symptoms
  - Prevention strategies

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** (App Router) - Modern React framework with server-side rendering
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Recharts** - Composable charting library for data visualization
- **Leaflet** - Interactive maps with OpenStreetMap integration

### Backend
- **Next.js API Routes** - Serverless API endpoints for data fetching
- **Server-side API calls** - Protects API keys and combines data from multiple sources

### Data Sources
- **Primary**: [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api)
  - Free and open-source
  - Comprehensive AQI data (US EPA standard)
  - Pollen forecasts for multiple allergen types
  - No API key required
  - Global coverage with high accuracy

### Deployment
- **Vercel** - Optimized for Next.js applications with automatic deployments

## 📊 Data & Accuracy

### Air Quality Index (AQI)
The application uses the **US EPA Air Quality Index** standard, which provides a consistent measure of air quality:
- **0-50 (Good)**: Green - Air quality is satisfactory
- **51-100 (Moderate)**: Yellow - Acceptable for most people
- **101-150 (Unhealthy for Sensitive Groups)**: Orange - Sensitive individuals should limit outdoor activity
- **151-200 (Unhealthy)**: Red - Everyone may experience health effects
- **201-300 (Very Unhealthy)**: Purple - Health alert for all
- **301-500 (Hazardous)**: Maroon - Emergency conditions

### Pollutants Monitored
- **PM2.5**: Fine particulate matter (≤2.5 micrometers)
- **PM10**: Coarse particulate matter (≤10 micrometers)
- **Ozone (O₃)**: Ground-level ozone
- **Nitrogen Dioxide (NO₂)**: Traffic and industrial emissions
- **Sulfur Dioxide (SO₂)**: Power plant and industrial emissions
- **Carbon Monoxide (CO)**: Incomplete combustion products

### Pollen Types
- **Tree Pollen**: Alder, Birch, Olive (aggregated)
- **Grass Pollen**: Various grass species
- **Weed Pollen**: Ragweed, Mugwort (aggregated)

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/aerohealth-forecast.git
   cd aerohealth-forecast
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

## 📱 Usage

1. **Allow Location Access**: When you first visit the site, allow location access for accurate local data
2. **View Dashboard**: See current AQI and pollen levels at a glance
3. **Explore Forecasts**: Click "24-Hour Forecast" or "5-Day Forecast" to plan ahead
4. **Check the Map**: Use "Map View" to see your location and surrounding air quality
5. **Learn More**: Click on any pollutant or allergen name to learn about its health impacts

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

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the documentation
- Review the educational content within the app

## 🔮 Future Enhancements

- Location search functionality
- Push notifications for air quality alerts
- Historical data trends
- Personalized health recommendations
- Multi-language support
- Mobile app versions (iOS/Android)
- Integration with wearable devices
- Community reporting features

---

**Built with ❤️ for public health**

*AeroHealth Forecast - Breathe Easier, Live Healthier*

