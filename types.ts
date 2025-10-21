
export enum GameState {
  Login,
  Start,
  MissionBriefing,
  Playing,
  LevelComplete,
  GameOver,
  DataView,
}

export enum QuestionType {
  DNAComplement,
  mRNA,
}

export interface User {
  firstName: string;
  teacherName: string;
  normalizedTeacherName: string;
}

export interface GameAttempt {
  id: string;
  userFirstName: string;
  teacherName: string;
  normalizedTeacherName: string;
  questionType: QuestionType;
  originalStrand: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  level: number;
  score: number;
  timestamp: string;
}
