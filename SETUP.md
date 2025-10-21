# DNA Dash - Setup Instructions

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Keys
VITE_API_KEY=your_google_genai_api_key_here

# API Configuration
VITE_API_BASE_URL=http://localhost:3001

# Teacher Names (comma-separated)
VITE_TEACHER_NAMES=Smith,Johnson,Williams,Brown,Jones,Garcia,Miller,Davis,Rodriguez,Martinez

# Data Access Password
VITE_DATA_PASSWORD=biologyresearchcentral
```

## Features Implemented

### ✅ Answer Checking
- The game correctly checks student answers against the expected DNA complement or mRNA sequence
- Provides immediate feedback for correct/incorrect answers

### ✅ mRNA Functionality
- Added mRNA transcription (A→U, T→A, G→C, C→G)
- Mixed DNA complement and mRNA questions randomly
- Visual distinction for U (uracil) in orange color

### ✅ Database Integration
- Turso database integration for storing student attempts
- Automatic database initialization
- Saves all student attempts with metadata

### ✅ Login System
- First Name and Teacher Name input screens
- Fuzzy teacher name matching with predefined names
- Case-insensitive matching with misspelling tolerance

### ✅ Data Access
- Password-protected data button (password: biologyresearchcentral)
- Data view organized by teacher name
- Shows all student attempts with details
- Clear Data button for each teacher to delete their data

### ✅ Teacher Management
- Predefined teacher names in environment variables
- Fuzzy matching algorithm for teacher name recognition
- Automatic grouping of students by matched teacher

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see above)

3. Run the development server:
```bash
npm run dev
```

## Database Setup

The app will automatically create the database tables on first run. For production, update the `VITE_TURSO_DATABASE_URL` and `VITE_TURSO_AUTH_TOKEN` with your Turso credentials.

## Security Notes

- Teacher names and data password are stored in environment variables
- Password is not pushed to GitHub (add .env to .gitignore)
- Database credentials should be kept secure
