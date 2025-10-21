# DNA Dash - Deployment Guide

## Railway Backend Deployment

### 1. Prepare Backend
The backend is located in the `backend/` directory with:
- `server.js` - Express API server
- `package.json` - Dependencies and scripts
- `railway.json` - Railway configuration

### 2. Deploy to Railway

1. **Create Railway Account**: Sign up at [railway.app](https://railway.app)

2. **Connect Repository**: 
   - Connect your GitHub repository to Railway
   - Railway will detect the `railway.json` configuration

3. **Set Environment Variables** in Railway dashboard:
   ```
   TURSO_DATABASE_URL=your_turso_database_url
   TURSO_AUTH_TOKEN=your_turso_auth_token
   NODE_ENV=production
   ```

4. **Deploy**: Railway will automatically deploy when you push to your repository

### 3. Get Backend URL
After deployment, Railway will provide a URL like:
```
https://your-app-name.railway.app
```

## Netlify Frontend Deployment

### 1. Prepare Frontend
The frontend is configured with:
- `netlify.toml` - Netlify configuration
- Environment variables for API connection

### 2. Deploy to Netlify

1. **Create Netlify Account**: Sign up at [netlify.com](https://netlify.com)

2. **Connect Repository**:
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`

3. **Set Environment Variables** in Netlify dashboard:
   ```
   VITE_API_BASE_URL=https://your-railway-backend-url.railway.app
   VITE_TEACHER_NAMES=Smith,Johnson,Williams,Brown,Jones,Garcia,Miller,Davis,Rodriguez,Martinez
   VITE_DATA_PASSWORD=biologyresearchcentral
   VITE_API_KEY=your_google_genai_api_key
   ```

4. **Update netlify.toml**: Replace `your-railway-backend-url.railway.app` with your actual Railway URL

5. **Deploy**: Netlify will automatically deploy when you push to your repository

## Database Setup (Turso)

### 1. Create Turso Database
```bash
# Install Turso CLI
curl -sSfL https://get.turso.install.turso.tech/install.sh | bash

# Create database
turso db create dna-dash

# Get database URL and auth token
turso db show dna-dash --url
turso db tokens create dna-dash
```

### 2. Use Database Credentials
- Set `TURSO_DATABASE_URL` in Railway environment variables
- Set `TURSO_AUTH_TOKEN` in Railway environment variables

## Environment Variables Summary

### Railway Backend
- `TURSO_DATABASE_URL` - Turso database URL
- `TURSO_AUTH_TOKEN` - Turso authentication token
- `NODE_ENV=production`

### Netlify Frontend
- `VITE_API_BASE_URL` - Railway backend URL
- `VITE_TEACHER_NAMES` - Comma-separated teacher names
- `VITE_DATA_PASSWORD` - Password for data access
- `VITE_API_KEY` - Google Gemini API key

## API Endpoints

The backend provides these endpoints:
- `POST /api/attempts` - Save game attempt
- `GET /api/attempts` - Get all attempts by teacher
- `DELETE /api/attempts/teacher/:teacherName` - Clear teacher data
- `GET /api/health` - Health check

## Local Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
npm install
npm run dev
```

## Production URLs
- Frontend: `https://your-netlify-app.netlify.app`
- Backend: `https://your-railway-app.railway.app`
- API: `https://your-railway-app.railway.app/api/*`
