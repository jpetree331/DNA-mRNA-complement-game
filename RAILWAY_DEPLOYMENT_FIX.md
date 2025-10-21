# Railway Backend Deployment - Final Solution

## The Problem
Railway is trying to install frontend dependencies (React, Vite, etc.) for the backend deployment because it's looking at the root `package.json` which contains both frontend and backend dependencies.

## Solution Options

### Option 1: Railway Dashboard Settings (Recommended)
1. Go to your Railway project dashboard
2. **Settings** → **Deploy** → **Root Directory**: Set to `backend/`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Environment Variables**:
   ```
   TURSO_DATABASE_URL=your_turso_database_url
   TURSO_AUTH_TOKEN=your_turso_auth_token
   NODE_ENV=production
   ```

### Option 2: Separate Backend Repository (Most Reliable)
1. Create new GitHub repository: `dna-dash-backend`
2. Copy only these files from `backend/` folder:
   - `server.js`
   - `package.json`
   - `package-lock.json`
   - `Dockerfile`
   - `.dockerignore`
3. Deploy this separate repository to Railway
4. Update frontend `VITE_API_BASE_URL` to new backend URL

### Option 3: Use Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway new dna-dash-backend

# Copy backend files to new directory
# Deploy
railway deploy
```

## Why This Happens
Railway's automatic detection sees the root `package.json` with frontend dependencies and tries to install them for the backend deployment, causing conflicts.

## Recommended Action
**Use Option 1** (Railway Dashboard Settings) first. If that doesn't work, use **Option 2** (separate repository) for the cleanest solution.

The separate repository approach eliminates all monorepo conflicts and gives you a clean backend deployment.
