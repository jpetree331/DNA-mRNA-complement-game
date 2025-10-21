# Create Separate Backend Repository

Since Railway is having issues with the monorepo structure, here's how to create a separate backend repository:

## Step 1: Create New Repository
1. Go to GitHub and create a new repository: `dna-dash-backend`
2. Make it public or private (your choice)

## Step 2: Copy Backend Files
Copy these files from your current project to the new repository:

### Files to Copy:
- `backend/server.js`
- `backend/package.json`
- `backend/package-lock.json`
- `backend/Dockerfile`
- `backend/.dockerignore`
- `backend/railway.json`
- `backend/deploy.sh`

### Create README.md for Backend:
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

## Step 3: Deploy to Railway
1. Connect the new `dna-dash-backend` repository to Railway
2. Set environment variables:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `NODE_ENV=production`
3. Deploy

## Step 4: Update Frontend
Update your frontend's `VITE_API_BASE_URL` to point to the new backend URL.

## Alternative: Railway CLI
If you have Railway CLI installed:
```bash
# Create new project
railway new dna-dash-backend

# Copy backend files to new directory
# Deploy
railway deploy
```

This approach will eliminate the monorepo issues and give you a clean backend deployment.
