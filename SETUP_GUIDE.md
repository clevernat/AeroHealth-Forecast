# AeroHealth Forecast - Setup Guide

## 🔥 Getting Real Wildfire Data from NASA FIRMS

### Step 1: Request NASA FIRMS API Key

1. **Visit the NASA FIRMS API Registration Page:**
   - Go to: https://firms.modaps.eosdis.nasa.gov/api/area/

2. **Click "Request a MAP_KEY":**
   - You'll see a form to request your API key

3. **Fill Out the Registration Form:**
   - **Email Address:** Enter your valid email address
   - **First Name:** Your first name
   - **Last Name:** Your last name
   - **Organization:** Your organization or "Personal Project"
   - **Intended Use:** Describe your use case, e.g., "Air quality monitoring web application"
   - **Country:** Select your country

4. **Submit the Form:**
   - Click "Submit" to send your request

5. **Verify Your Email:**
   - Check your email inbox for a verification email from NASA FIRMS
   - Click the verification link in the email

6. **Receive Your MAP_KEY:**
   - After verification, you'll receive another email with your MAP_KEY
   - This usually happens within a few minutes

### Step 2: Configure Your API Key

1. **Create a `.env.local` file** in the root of your project:
   ```bash
   touch .env.local
   ```

2. **Add your NASA FIRMS API key** to `.env.local`:
   ```bash
   NASA_FIRMS_API_KEY=your_actual_map_key_here
   ```

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

### Step 3: Verify Integration

1. **Open your browser** and navigate to your app
2. **Go to the Map view**
3. **Enable "Show Sources" toggle**
4. **Check the browser console:**
   - If configured correctly, you should see real wildfire data
   - If not configured, you'll see: "NASA FIRMS API key not configured - using mock wildfire data"

---

## 📊 What Data Does NASA FIRMS Provide?

NASA FIRMS (Fire Information for Resource Management System) provides:

- **Real-time fire detection** from VIIRS (Visible Infrared Imaging Radiometer Suite)
- **Fire location** (latitude/longitude)
- **Fire brightness** (temperature in Kelvin)
- **FRP (Fire Radiative Power)** - measured in MW (megawatts)
- **Confidence level** - low, nominal, or high
- **Acquisition date and time**
- **Satellite source** - NOAA-20, Suomi NPP, etc.

### Data Sources Available:

- **VIIRS_NOAA20_NRT** - Near Real-Time data from NOAA-20 satellite (used in this app)
- **VIIRS_SNPP_NRT** - Near Real-Time data from Suomi NPP satellite
- **MODIS_NRT** - Near Real-Time data from MODIS sensors

---

## 🌐 Other Data Sources Used

### 1. **Open-Meteo API** (No API Key Required)
- **Air Quality Data:** AQI, PM2.5, PM10, Ozone, NO2, SO2, CO
- **Weather Data:** Temperature, humidity, wind speed/direction
- **Pollen Data:** Grass, tree, weed pollen levels
- **Historical Data:** Up to 30 days of historical air quality data

**Endpoint:** `https://air-quality-api.open-meteo.com/v1/air-quality`

### 2. **OpenStreetMap Overpass API** (No API Key Required)
- **Highway Data:** Major roads and highways
- **Industrial Areas:** Factories and industrial zones
- **Airports:** Airport locations
- **Ports:** Seaport locations

**Endpoint:** `https://overpass-api.de/api/interpreter`

---

## 🚀 Features Implemented

### ✅ 1. Animated Wind Arrows
- **CSS animations** for flowing effect
- **Pulsing glow** on wind arrows
- **Reduced particle count** on mobile devices

### ✅ 2. Real NASA FIRMS Integration
- **Live wildfire data** from NASA satellites
- **FRP-based severity** calculation
- **Confidence level** filtering
- **Fallback to mock data** when API key not configured

### ✅ 3. Caching Layer
- **In-memory caching** for all API endpoints
- **Smart TTL (Time To Live):**
  - AQI Grid: 15 minutes
  - Wind Data: 30 minutes
  - Pollution Sources: 24 hours (infrastructure)
  - Wildfires: 1 hour (more volatile)
  - Pollen: 1 hour
- **Reduced API calls** and improved performance

### ✅ 4. Mobile Optimization
- **Responsive design** for all screen sizes
- **Reduced particle count** on mobile (wind arrows: every 5th point vs every 3rd)
- **Smaller heatmap radius** on mobile (20px vs 30px)
- **Touch-friendly controls** and markers
- **Adaptive grid size** (3x3 on mobile vs 5x5 on desktop)

### ✅ 5. Historical Data Tracking
- **7, 14, or 30-day trends** with time range selector
- **AQI trend chart** with gradient area visualization
- **Pollutant comparison** (PM2.5, PM10, Ozone)
- **Summary statistics:**
  - Average AQI
  - Peak AQI
  - Best AQI
  - Trend indicator (📈/📉)

### ✅ 6. Pollution Notifications
- **Smart alerts** based on AQI levels:
  - Unhealthy (AQI > 150)
  - Unhealthy for Sensitive Groups (AQI > 100)
- **Wildfire alerts** when fires detected within 50km
- **Highway proximity warnings** within 2km
- **High-severity source alerts** within 10km
- **Dismissible notifications** with animated backgrounds
- **Color-coded severity:**
  - 🔴 Danger (red)
  - 🟠 Warning (orange)
  - 🔵 Info (blue)

---

## 🎨 UI/UX Enhancements

### Interactive Map Features:
- **Heatmap Overlay** - Color-gradient pollution visualization
- **Wind Direction & Speed** - Animated wind patterns
- **Pollution Source Tracking** - Highways, factories, wildfires, airports, ports
- **Toggle controls** for each layer
- **Loading states** and error handling

### Chart Enhancements:
- **Interactive tooltips** with full date/time
- **Hover effects** with animated activeDots
- **Gradient fills** for visual appeal
- **Fixed margins** to prevent label cutoff
- **Improved grid visibility**

---

## 📱 Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🔧 Troubleshooting

### Issue: "NASA FIRMS API key not configured"
**Solution:** Make sure you've added `NASA_FIRMS_API_KEY` to `.env.local` and restarted the dev server.

### Issue: No wildfire data showing
**Solution:** 
1. Check if there are active fires in your region
2. Verify your API key is correct
3. Check browser console for API errors
4. Try increasing the radius parameter

### Issue: Map not loading
**Solution:**
1. Check browser console for errors
2. Ensure you've allowed location access
3. Try refreshing the page
4. Check internet connection

### Issue: Slow performance on mobile
**Solution:**
1. Mobile optimization is already implemented
2. Try disabling some map layers (heatmap, wind, sources)
3. Clear browser cache
4. Close other apps to free up memory

---

## 📚 API Rate Limits

### NASA FIRMS:
- **No official rate limit** for MAP_KEY users
- **Recommended:** Cache data for at least 1 hour
- **Best practice:** Don't make more than 1 request per minute

### Open-Meteo:
- **Free tier:** 10,000 requests per day
- **No API key required**
- **Recommended:** Cache data for 15-30 minutes

### OpenStreetMap Overpass:
- **Rate limit:** ~2 requests per second
- **Recommended:** Cache infrastructure data for 24 hours (changes infrequently)

---

## 🎯 Next Steps

### Potential Enhancements:
1. **User Preferences** - Save notification settings, favorite locations
2. **Push Notifications** - Browser push notifications for severe alerts
3. **Database Integration** - Store historical data in a database
4. **User Accounts** - Save preferences and history across devices
5. **Share Feature** - Share air quality reports on social media
6. **Offline Mode** - Service worker for offline functionality
7. **Multi-language Support** - Internationalization (i18n)
8. **Dark/Light Mode Toggle** - User-selectable themes

---

## 📞 Support

For issues or questions:
- Check the [GitHub Issues](https://github.com/clevernat/AeroHealth-Forecast/issues)
- Review the [NASA FIRMS Documentation](https://firms.modaps.eosdis.nasa.gov/api/)
- Review the [Open-Meteo Documentation](https://open-meteo.com/en/docs)

---

## 📄 License

This project is open source and available under the MIT License.

