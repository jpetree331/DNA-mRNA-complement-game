# Monorepo Deployment Solution

## Current Status

✅ **Backend**: Successfully deployed on Railway
✅ **Frontend**: Package.json restored, should deploy on Netlify

## The Problem

The monorepo structure (frontend + backend in one repository) creates conflicts:
- Railway needs backend dependencies in root package.json
- Netlify needs frontend dependencies in root package.json
- This creates a circular dependency issue

## Current Working Solution

### 1. Root package.json (Frontend)
```json
{
  "name": "dna-dash:-a-base-pairing-game",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@google/genai": "^1.24.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

### 2. Railway Configuration
- Uses `railway.json` to specify backend directory
- Uses `nixpacks.toml` to configure build process
- Uses `.railwayrc` to force npm install instead of npm ci

### 3. Netlify Configuration
- Uses `netlify.toml` to build frontend
- Proxies API calls to Railway backend

## Recommended Long-term Solution

### Option 1: Separate Repositories (Recommended)
1. Create separate GitHub repository for backend
2. Deploy backend from its own repository
3. Keep frontend in current repository
4. Update Netlify redirects to point to new backend URL

### Option 2: Monorepo with Workspaces
1. Use npm workspaces to separate frontend/backend
2. Configure Railway to build only backend workspace
3. Configure Netlify to build only frontend workspace

## Current Deployment Status

### Backend (Railway)
- ✅ Successfully deployed
- ✅ Database connected
- ✅ API endpoints working
- URL: https://dna-dash-backend-production.up.railway.app

### Frontend (Netlify)
- ✅ Package.json restored
- ✅ Build script available
- ⏳ Should deploy successfully now

## Environment Variables

### Railway (Backend)
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `TEACHER_NAMES`
- `DATA_PASSWORD`

### Netlify (Frontend)
- `VITE_API_BASE_URL` = `https://dna-dash-backend-production.up.railway.app`
- `VITE_TEACHER_NAMES`
- `VITE_DATA_PASSWORD`

## Next Steps

1. **Monitor Netlify deployment** - Should work now with restored package.json
2. **Test full application** - Login, play game, check data access
3. **Consider separate repositories** - For easier maintenance and deployment

## Troubleshooting

### If Frontend Still Fails
1. Check Netlify build logs
2. Verify all dependencies are in package.json
3. Ensure build script exists

### If Backend Fails
1. Check Railway logs
2. Verify environment variables
3. Check database connection

### If Both Fail
1. Consider separate repositories
2. Use workspace configuration
3. Contact support for platform-specific issues

## Success Criteria

- ✅ Backend API responds to health checks
- ✅ Frontend builds and deploys
- ✅ Database operations work
- ✅ Login system functions
- ✅ Game mechanics work
- ✅ Data access works
- ✅ Clear data functionality works

## Final Notes

The current setup should work, but separate repositories would be more maintainable. The monorepo approach requires careful configuration and can be fragile during updates.
