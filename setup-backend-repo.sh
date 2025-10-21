#!/bin/bash

# Script to set up separate backend repository
echo "Setting up separate backend repository for Railway deployment..."

# Create backend directory structure
mkdir -p dna-dash-backend
cd dna-dash-backend

# Copy backend files
echo "Copying backend files..."
cp ../backend/server.js .
cp ../backend/package.json .
cp ../backend/package-lock.json .
cp ../backend/Dockerfile .
cp ../backend/.dockerignore .
cp ../backend/railway.json .

# Create README.md
echo "Creating README.md..."
cat > README.md << 'EOF'
# DNA Dash Backend API

Express.js backend for the DNA Dash educational game.

## Environment Variables
- `TURSO_DATABASE_URL` - Turso database URL
- `TURSO_AUTH_TOKEN` - Turso authentication token
- `NODE_ENV` - Environment (production)

## Deployment
Deploy to Railway with the included configuration.

## API Endpoints
- `POST /api/attempts` - Save game attempt
- `GET /api/attempts` - Get all attempts by teacher
- `DELETE /api/attempts/teacher/:teacherName` - Clear teacher data
- `GET /api/health` - Health check
EOF

# Create .gitignore
echo "Creating .gitignore..."
cat > .gitignore << 'EOF'
node_modules/
*.log
.env
.env.local
.env.production
*.db
*.db-journal
EOF

echo "Backend repository setup complete!"
echo "Next steps:"
echo "1. Create new GitHub repository: dna-dash-backend"
echo "2. Copy files from dna-dash-backend/ to the new repository"
echo "3. Deploy to Railway"
echo "4. Update frontend VITE_API_BASE_URL"
