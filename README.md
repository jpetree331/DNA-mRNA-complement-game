# DNA Dash - A Base Pairing Game

A comprehensive educational game for learning DNA base pairing and mRNA transcription, with teacher data tracking and deployment-ready architecture.

## 🧬 Features

### Educational Gameplay
- **DNA Complement Questions**: Practice A↔T, G↔C base pairing
- **mRNA Transcription Questions**: Learn A→U, T→A, G→C, C→G transcription
- **Mixed Question Types**: Randomly alternates between DNA complement and mRNA questions
- **Progressive Difficulty**: 6 levels with increasing strand length and time pressure
- **Real-time Feedback**: Immediate validation of student answers

### Teacher Management
- **Student Login**: First name and teacher name collection
- **Fuzzy Teacher Matching**: Handles misspellings and case variations
- **Data Tracking**: All student attempts saved with detailed metadata
- **Teacher Dashboard**: View student progress organized by teacher
- **Clear Data**: Remove specific teacher's data with confirmation

### Technical Features
- **Answer Validation**: Correctly checks DNA complement and mRNA sequences
- **Database Integration**: Turso database for persistent data storage
- **API Architecture**: RESTful backend with Express.js
- **Deployment Ready**: Configured for Railway (backend) and Netlify (frontend)
- **Fallback Support**: Local storage backup if API unavailable

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Git
- Turso account (for database)
- Railway account (for backend)
- Netlify account (for frontend)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jpetree331/DNA-mRNA-complement-game.git
   cd DNA-mRNA-complement-game
   ```

2. **Install dependencies**:
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

3. **Set up environment variables**:
   Create `.env` file in root directory:
   ```env
   VITE_API_KEY=your_google_genai_api_key
   VITE_API_BASE_URL=http://localhost:3001
   VITE_TEACHER_NAMES=Smith,Johnson,Williams,Brown,Jones,Garcia,Miller,Davis,Rodriguez,Martinez
   VITE_DATA_PASSWORD=biologyresearchcentral
   ```

4. **Start development servers**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend  
   npm run dev
   ```

5. **Access the game**: Open http://localhost:5173

## 🏗️ Architecture

### Frontend (React + Vite)
- **Components**: Modular React components for game logic and UI
- **Services**: API client with localStorage fallback
- **Utils**: DNA/mRNA processing and teacher name matching
- **Types**: TypeScript interfaces for type safety

### Backend (Express.js)
- **API Endpoints**: RESTful endpoints for data operations
- **Database**: Turso SQLite integration
- **CORS**: Cross-origin resource sharing enabled
- **Health Check**: Monitoring endpoint for deployment

### Database Schema
```sql
CREATE TABLE game_attempts (
  id TEXT PRIMARY KEY,
  user_first_name TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  normalized_teacher_name TEXT NOT NULL,
  question_type TEXT NOT NULL,
  original_strand TEXT NOT NULL,
  user_answer TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  level INTEGER NOT NULL,
  score INTEGER NOT NULL,
  timestamp TEXT NOT NULL
);
```

## 🌐 Deployment

### Railway Backend Deployment
1. Connect GitHub repository to Railway
2. Set environment variables:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `NODE_ENV=production`
3. Railway auto-deploys on git push

### Netlify Frontend Deployment
1. Connect GitHub repository to Netlify
2. Set environment variables:
   - `VITE_API_BASE_URL` (Railway backend URL)
   - `VITE_TEACHER_NAMES`
   - `VITE_DATA_PASSWORD`
   - `VITE_API_KEY`
3. Netlify auto-deploys on git push

### Database Setup (Turso)
```bash
# Install Turso CLI
curl -sSfL https://get.turso.install.turso.tech/install.sh | bash

# Create database
turso db create dna-dash

# Get credentials
turso db show dna-dash --url
turso db tokens create dna-dash
```

## 📊 Data Management

### Student Data Tracking
- **Attempt Recording**: Every student answer saved with metadata
- **Teacher Grouping**: Students automatically grouped by teacher name
- **Fuzzy Matching**: Handles teacher name variations and misspellings
- **Data Export**: Teachers can view detailed student progress

### Teacher Dashboard Features
- **Teacher Selection**: Choose teacher to view their students
- **Student Progress**: Individual attempt history
- **Question Analysis**: DNA complement vs mRNA performance
- **Clear Data**: Remove specific teacher's data

## 🔧 Configuration

### Environment Variables

**Frontend (Netlify)**:
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_TEACHER_NAMES` - Comma-separated teacher names
- `VITE_DATA_PASSWORD` - Data access password
- `VITE_API_KEY` - Google Gemini API key

**Backend (Railway)**:
- `TURSO_DATABASE_URL` - Database connection URL
- `TURSO_AUTH_TOKEN` - Database authentication token
- `NODE_ENV` - Environment (production)

### Teacher Names
Default teacher names can be customized via environment variable:
```
Smith,Johnson,Williams,Brown,Jones,Garcia,Miller,Davis,Rodriguez,Martinez
```

## 🎮 Game Mechanics

### Question Types
1. **DNA Complement**: A↔T, G↔C base pairing
2. **mRNA Transcription**: A→U, T→A, G→C, C→G

### Scoring System
- **Base Points**: 10 points per correct base
- **Time Bonus**: 2 points per second remaining
- **Lives System**: 3 lives, lose one for incorrect answers
- **Level Progression**: 6 levels with increasing difficulty

### Educational Value
- **Visual Learning**: Color-coded bases for easy recognition
- **Immediate Feedback**: Real-time answer validation
- **Progressive Difficulty**: Gradual increase in complexity
- **Mixed Practice**: Both DNA and mRNA concepts

## 📁 Project Structure

```
dna-dash_-a-base-pairing-game/
├── backend/                 # Express.js API server
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── components/             # React components
│   ├── DataView.tsx        # Teacher dashboard
│   ├── LoginScreen.tsx     # Student login
│   ├── PasswordPrompt.tsx  # Data access protection
│   └── ...
├── services/               # API and database services
│   ├── apiService.ts       # API client
│   └── databaseService.ts  # Database operations
├── utils/                  # Utility functions
│   ├── dnaUtils.ts         # DNA/mRNA processing
│   └── teacherUtils.ts     # Teacher name matching
├── netlify.toml            # Netlify configuration
├── railway.json            # Railway configuration
└── README.md              # This file
```

## 🔒 Security Features

- **Password Protection**: Data access requires password
- **Environment Variables**: Sensitive data in environment
- **Input Validation**: Sanitized user inputs
- **Confirmation Dialogs**: Destructive actions require confirmation

## 📈 Performance

- **API Fallback**: Local storage backup if API unavailable
- **Efficient Queries**: Optimized database operations
- **Caching**: Static asset optimization
- **Responsive Design**: Mobile-friendly interface

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues or questions:
1. Check the documentation
2. Review environment variables
3. Verify database connection
4. Check deployment logs

---

**DNA Dash** - Making genetics education interactive and engaging! 🧬✨