const express = require('express');
const cors = require('cors');
const { createClient } = require('@libsql/client');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Initialize database
const initializeDatabase = async () => {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS game_attempts (
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
      )
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Initialize database on startup
initializeDatabase();

// Routes
app.post('/api/attempts', async (req, res) => {
  try {
    const {
      userFirstName,
      teacherName,
      normalizedTeacherName,
      questionType,
      originalStrand,
      userAnswer,
      correctAnswer,
      isCorrect,
      level,
      score
    } = req.body;

    const id = require('crypto').randomUUID();
    const timestamp = new Date().toISOString();

    await client.execute({
      sql: `
        INSERT INTO game_attempts (
          id, user_first_name, teacher_name, normalized_teacher_name,
          question_type, original_strand, user_answer, correct_answer,
          is_correct, level, score, timestamp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        id,
        userFirstName,
        teacherName,
        normalizedTeacherName,
        questionType,
        originalStrand,
        userAnswer,
        correctAnswer,
        isCorrect,
        level,
        score,
        timestamp
      ]
    });

    res.json({ success: true, id });
  } catch (error) {
    console.error('Error saving attempt:', error);
    res.status(500).json({ error: 'Failed to save attempt' });
  }
});

app.get('/api/attempts', async (req, res) => {
  try {
    const result = await client.execute(`
      SELECT * FROM game_attempts 
      ORDER BY normalized_teacher_name, timestamp DESC
    `);
    
    const attemptsByTeacher = {};
    
    for (const row of result.rows) {
      const attempt = {
        id: row.id,
        userFirstName: row.user_first_name,
        teacherName: row.teacher_name,
        normalizedTeacherName: row.normalized_teacher_name,
        questionType: row.question_type,
        originalStrand: row.original_strand,
        userAnswer: row.user_answer,
        correctAnswer: row.correct_answer,
        isCorrect: Boolean(row.is_correct),
        level: row.level,
        score: row.score,
        timestamp: row.timestamp,
      };
      
      if (!attemptsByTeacher[attempt.normalizedTeacherName]) {
        attemptsByTeacher[attempt.normalizedTeacherName] = [];
      }
      attemptsByTeacher[attempt.normalizedTeacherName].push(attempt);
    }
    
    res.json(attemptsByTeacher);
  } catch (error) {
    console.error('Error fetching attempts:', error);
    res.status(500).json({ error: 'Failed to fetch attempts' });
  }
});

app.delete('/api/attempts/teacher/:teacherName', async (req, res) => {
  try {
    const { teacherName } = req.params;
    
    await client.execute({
      sql: 'DELETE FROM game_attempts WHERE normalized_teacher_name = ?',
      args: [teacherName]
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error clearing teacher data:', error);
    res.status(500).json({ error: 'Failed to clear teacher data' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
