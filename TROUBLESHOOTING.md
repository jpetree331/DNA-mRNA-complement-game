# Deployment Troubleshooting Guide

## Current Issue: Backend Dependencies Not Found

### Problem
```
Error: Cannot find module 'express'
Require stack: /app/backend/server.js
```

### Root Cause
Railway was installing dependencies in the root directory, but the backend needs its own dependencies in the `backend/` directory.

### Solution Applied
Updated Railway configuration to install dependencies in the backend directory:

1. **railway.json**: Changed `buildCommand` to `"cd backend && npm install"`
2. **nixpacks.toml**: Updated install phase to `"cd backend && npm install"`

## Configuration Files

### railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend && npm install"
  },
  "deploy": {
    "startCommand": "cd backend && npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  },
  "variables": {
    "NODE_VERSION": "20"
  }
}
```

### nixpacks.toml
```toml
[phases.install]
cmds = ["cd backend && npm install"]

[phases.build]
cmds = ["echo 'Build complete'"]

[start]
cmd = "cd backend && npm start"
```

## Expected Results

### Backend (Railway)
- ✅ Dependencies installed in `backend/` directory
- ✅ Express server starts successfully
- ✅ Database connection works
- ✅ API endpoints respond

### Frontend (Netlify)
- ✅ Builds with Vite
- ✅ Deploys successfully
- ✅ Proxies API calls to Railway backend

## If Backend Still Fails

### Check Railway Logs
1. Go to Railway dashboard
2. Check deployment logs
3. Look for dependency installation errors

### Common Issues
1. **Node.js version mismatch**: Ensure NODE_VERSION is set to "20"
2. **Missing dependencies**: Check backend/package.json has all required packages
3. **Path issues**: Verify all paths use forward slashes

### Alternative Solutions

#### Option 1: Separate Repositories (Recommended)
1. Create separate GitHub repo for backend
2. Deploy backend from its own repository
3. Update Netlify redirects to new backend URL

#### Option 2: Dockerfile Approach
1. Create `backend/Dockerfile`
2. Use Docker builder instead of Nixpacks
3. More control over build process

#### Option 3: Workspace Configuration
1. Use npm workspaces
2. Configure Railway to build specific workspace
3. More complex but cleaner separation

## Monitoring Deployment

### Railway Backend
- Check deployment status in Railway dashboard
- Monitor logs for errors
- Test health endpoint: `/api/health`

### Netlify Frontend
- Check build status in Netlify dashboard
- Monitor build logs
- Test frontend URL

## Success Criteria

- ✅ Backend API responds to health checks
- ✅ Frontend builds and deploys
- ✅ Database operations work
- ✅ Login system functions
- ✅ Game mechanics work
- ✅ Data access works
- ✅ Clear data functionality works

## Next Steps

1. **Monitor Railway deployment** - Should work now with updated configuration
2. **Test full application** - Login, play game, check data access
3. **Consider separate repositories** - For easier maintenance

## Contact Information

If issues persist:
- Check Railway documentation for Node.js deployment
- Check Netlify documentation for Vite builds
- Consider the separate repositories approach for better isolation
