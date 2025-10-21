# Railway Backend Deployment Guide

## Option 1: Deploy from Backend Directory (Recommended)

If Railway is having issues with the monorepo structure, create a separate backend repository:

### 1. Create New Repository
1. Create a new GitHub repository: `dna-dash-backend`
2. Copy only the `backend/` folder contents to the new repository
3. Deploy this separate repository to Railway

### 2. Files to Copy
Copy these files from `backend/` to your new repository:
- `server.js`
- `package.json`
- `Dockerfile`
- `.dockerignore`
- `railway.json`

## Option 2: Fix Current Repository

### 1. Update Railway Settings
In your Railway project settings:
1. **Root Directory**: Set to `backend/`
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`

### 2. Environment Variables
Set these in Railway dashboard:
```
TURSO_DATABASE_URL=your_turso_database_url
TURSO_AUTH_TOKEN=your_turso_auth_token
NODE_ENV=production
NODE_VERSION=20
```

### 3. Alternative: Use Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy from backend directory
cd backend
railway deploy
```

## Option 3: Manual Docker Deployment

### 1. Build Docker Image Locally
```bash
cd backend
docker build -t dna-dash-backend .
```

### 2. Push to Docker Hub
```bash
docker tag dna-dash-backend your-username/dna-dash-backend
docker push your-username/dna-dash-backend
```

### 3. Deploy on Railway
- Use Docker Hub image: `your-username/dna-dash-backend`
- Set environment variables
- Deploy

## Troubleshooting

### Common Issues:
1. **Node Version**: Ensure Node 20+ is specified
2. **Dependencies**: Make sure all dependencies are in package.json
3. **Port**: Backend should listen on process.env.PORT or 3001
4. **Health Check**: Ensure `/api/health` endpoint works

### Debug Commands:
```bash
# Check if server starts locally
cd backend
npm install
npm start

# Test health endpoint
curl http://localhost:3001/api/health
```

## Recommended Solution

**Create a separate backend repository** for the cleanest deployment:

1. Create `dna-dash-backend` repository
2. Copy `backend/` contents
3. Deploy to Railway
4. Update frontend `VITE_API_BASE_URL` to point to new backend URL
