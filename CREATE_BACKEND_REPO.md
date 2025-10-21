# Create Separate Backend Repository - Step by Step

## The Problem
Railway keeps trying to install frontend dependencies (React, Vite, etc.) because it's looking at the root `package.json` which contains both frontend and backend dependencies.

## Solution: Separate Backend Repository

### Step 1: Create New GitHub Repository
1. Go to GitHub and create a new repository: `dna-dash-backend`
2. Make it public or private (your choice)

### Step 2: Copy Backend Files
Copy these files from your current project to the new repository:

**Files to Copy:**
- `backend/server.js`
- `backend/package.json`
- `backend/package-lock.json`
- `backend/Dockerfile`
- `backend/.dockerignore`
- `backend/railway.json`

### Step 3: Create README.md for Backend
Create a `README.md` in the new repository:
```markdown
# DNA Dash Backend API

Express.js backend for the DNA Dash educational game.

## Environment Variables
- `TURSO_DATABASE_URL` - Turso database URL
- `TURSO_AUTH_TOKEN` - Turso authentication token
- `NODE_ENV` - Environment (production)

## Deployment
Deploy to Railway with the included configuration.
```

### Step 4: Deploy to Railway
1. Connect the new `dna-dash-backend` repository to Railway
2. Set environment variables:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `NODE_ENV=production`
3. Deploy (should work without issues)

### Step 5: Update Frontend
Update your frontend's `VITE_API_BASE_URL` to point to the new backend URL.

## Why This Works
- ✅ **No Frontend Dependencies**: Only backend packages
- ✅ **Clean Structure**: No monorepo conflicts
- ✅ **Railway Compatibility**: Standard Node.js deployment
- ✅ **Environment Isolation**: Backend and frontend separate

## Alternative: Railway CLI
If you have Railway CLI installed:
```bash
# Create new project
railway new dna-dash-backend

# Copy backend files to new directory
# Deploy
railway deploy
```

This approach will eliminate all the deployment issues you've been experiencing!
