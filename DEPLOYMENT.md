# Deployment Guide for AeroHealth Forecast

This guide will help you deploy AeroHealth Forecast to production.

## 🚀 Deploying to Vercel (Recommended)

Vercel is the recommended platform for deploying Next.js applications. It's free for personal projects and provides excellent performance.

### Method 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AeroHealth Forecast"
   git branch -M main
   git remote add origin https://github.com/yourusername/aerohealth-forecast.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up or log in with your GitHub account
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js settings

3. **Configure and Deploy**
   - Project Name: `aerohealth-forecast` (or your choice)
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Click "Deploy"

4. **Done!**
   - Your app will be live at `https://aerohealth-forecast.vercel.app`
   - Every push to `main` will trigger automatic deployments
   - Pull requests get preview deployments

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? Yes
   - Which scope? Your account
   - Link to existing project? No
   - Project name? aerohealth-forecast
   - Directory? ./
   - Override settings? No

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## 🌐 Other Deployment Options

### Netlify

1. **Push to GitHub** (see above)

2. **Deploy on Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy site"

### Self-Hosting (VPS/Cloud)

#### Prerequisites
- Node.js 18+ installed
- PM2 or similar process manager
- Nginx or Apache for reverse proxy

#### Steps

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```
   
   Or with PM2:
   ```bash
   pm2 start npm --name "aerohealth" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx** (example)
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Enable HTTPS** (recommended)
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

### Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS base

   # Install dependencies only when needed
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci

   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build

   # Production image
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   USER nextjs
   EXPOSE 3000
   ENV PORT 3000
   CMD ["node", "server.js"]
   ```

2. **Build and run**
   ```bash
   docker build -t aerohealth-forecast .
   docker run -p 3000:3000 aerohealth-forecast
   ```

## 🔧 Environment Variables

AeroHealth Forecast doesn't require any API keys by default (Open-Meteo is free and open).

If you add additional API sources in the future:

1. **In Vercel**: Go to Project Settings → Environment Variables
2. **In Netlify**: Go to Site Settings → Build & Deploy → Environment
3. **Self-hosted**: Create a `.env.local` file (never commit this!)

## ✅ Post-Deployment Checklist

- [ ] Test the live site on multiple devices
- [ ] Verify geolocation works (requires HTTPS)
- [ ] Check all API endpoints are responding
- [ ] Test all navigation tabs (Dashboard, Hourly, Daily, Map)
- [ ] Verify educational modals open correctly
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Check mobile responsiveness
- [ ] Verify map loads correctly
- [ ] Test with different locations
- [ ] Monitor performance with Lighthouse
- [ ] Set up custom domain (optional)
- [ ] Enable analytics (optional)

## 📊 Performance Optimization

### Vercel Specific
- Enable Edge Functions for faster API responses
- Use Vercel Analytics for monitoring
- Configure caching headers for static assets

### General
- Images are already optimized with Next.js Image component
- API routes cache responses when appropriate
- Static pages are pre-rendered
- Code splitting is automatic with Next.js

## 🔒 Security Considerations

- **HTTPS**: Always use HTTPS in production (automatic with Vercel/Netlify)
- **Geolocation**: Only works over HTTPS
- **API Keys**: If you add paid APIs, use environment variables
- **CORS**: API routes are same-origin by default
- **Rate Limiting**: Consider adding rate limiting for API routes

## 📈 Monitoring

### Recommended Tools
- **Vercel Analytics**: Built-in performance monitoring
- **Google Analytics**: User behavior tracking
- **Sentry**: Error tracking and monitoring
- **Uptime Robot**: Uptime monitoring

## 🆘 Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Clear `.next` folder and rebuild
- Verify all dependencies are installed
- Check for TypeScript errors

### Map Not Loading
- Ensure Leaflet CSS is imported
- Check browser console for errors
- Verify dynamic import is working

### API Errors
- Check Open-Meteo API status
- Verify latitude/longitude are valid
- Check network tab for failed requests

### Geolocation Not Working
- Ensure site is served over HTTPS
- Check browser permissions
- Verify fallback location works

## 📞 Support

If you encounter issues:
1. Check the [README.md](README.md)
2. Review [CONTRIBUTING.md](CONTRIBUTING.md)
3. Open an issue on GitHub
4. Check Vercel/Netlify documentation

---

**Happy Deploying! 🚀**

Your deployment helps make respiratory health information accessible to everyone.

