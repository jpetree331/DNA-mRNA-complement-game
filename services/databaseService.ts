import { createClient } from '@libsql/client';
import { GameAttempt, QuestionType } from '../types';

const client = createClient({
  url: (import.meta as any).env?.VITE_TURSO_DATABASE_URL || 'file:local.db',
  authToken: (import.meta as any).env?.VITE_TURSO_AUTH_TOKEN,
});

export const initializeDatabase = async (): Promise<void> => {
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

export const saveGameAttempt = async (attempt: Omit<GameAttempt, 'id'>): Promise<void> => {
  try {
    const id = crypto.randomUUID();
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
        attempt.userFirstName,
        attempt.teacherName,
        attempt.normalizedTeacherName,
        attempt.questionType,
        attempt.originalStrand,
        attempt.userAnswer,
        attempt.correctAnswer,
        attempt.isCorrect,
        attempt.level,
        attempt.score,
        attempt.timestamp
      ]
    });
  } catch (error) {
    console.error('Error saving game attempt:', error);
  }
};

export const getGameAttemptsByTeacher = async (): Promise<Record<string, GameAttempt[]>> => {
  try {
    const result = await client.execute(`
      SELECT * FROM game_attempts 
      ORDER BY normalized_teacher_name, timestamp DESC
    `);
    
    const attemptsByTeacher: Record<string, GameAttempt[]> = {};
    
    for (const row of result.rows) {
      const attempt: GameAttempt = {
        id: row.id as string,
        userFirstName: row.user_first_name as string,
        teacherName: row.teacher_name as string,
        normalizedTeacherName: row.normalized_teacher_name as string,
        questionType: row.question_type as QuestionType,
        originalStrand: row.original_strand as string,
        userAnswer: row.user_answer as string,
        correctAnswer: row.correct_answer as string,
        isCorrect: Boolean(row.is_correct),
        level: row.level as number,
        score: row.score as number,
        timestamp: row.timestamp as string,
      };
      
      if (!attemptsByTeacher[attempt.normalizedTeacherName]) {
        attemptsByTeacher[attempt.normalizedTeacherName] = [];
      }
      attemptsByTeacher[attempt.normalizedTeacherName].push(attempt);
    }
    
    return attemptsByTeacher;
  } catch (error) {
    console.error('Error fetching game attempts:', error);
    return {};
  }
};

export const clearTeacherData = async (normalizedTeacherName: string): Promise<void> => {
  try {
    await client.execute({
      sql: 'DELETE FROM game_attempts WHERE normalized_teacher_name = ?',
      args: [normalizedTeacherName]
    });
    console.log(`Cleared data for teacher: ${normalizedTeacherName}`);
  } catch (error) {
    console.error('Error clearing teacher data:', error);
    throw error;
  }
};
