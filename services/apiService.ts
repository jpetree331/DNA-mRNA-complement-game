import { GameAttempt, QuestionType } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3001';

export const saveGameAttempt = async (attempt: Omit<GameAttempt, 'id'>): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/attempts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attempt),
    });

    if (!response.ok) {
      throw new Error('Failed to save attempt');
    }

    await response.json();
  } catch (error) {
    console.error('Error saving game attempt:', error);
    // Fallback to local storage if API fails
    const localAttempts = JSON.parse(localStorage.getItem('dnaDashAttempts') || '[]');
    localAttempts.push({ ...attempt, id: crypto.randomUUID() });
    localStorage.setItem('dnaDashAttempts', JSON.stringify(localAttempts));
  }
};

export const getGameAttemptsByTeacher = async (): Promise<Record<string, GameAttempt[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/attempts`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch attempts');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching game attempts:', error);
    // Fallback to local storage if API fails
    const localAttempts = JSON.parse(localStorage.getItem('dnaDashAttempts') || '[]');
    const attemptsByTeacher: Record<string, GameAttempt[]> = {};
    
    for (const attempt of localAttempts) {
      if (!attemptsByTeacher[attempt.normalizedTeacherName]) {
        attemptsByTeacher[attempt.normalizedTeacherName] = [];
      }
      attemptsByTeacher[attempt.normalizedTeacherName].push(attempt);
    }
    
    return attemptsByTeacher;
  }
};

export const clearTeacherData = async (normalizedTeacherName: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/attempts/teacher/${encodeURIComponent(normalizedTeacherName)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to clear teacher data');
    }

    await response.json();
  } catch (error) {
    console.error('Error clearing teacher data:', error);
    // Fallback to local storage if API fails
    const localAttempts = JSON.parse(localStorage.getItem('dnaDashAttempts') || '[]');
    const filteredAttempts = localAttempts.filter(
      (attempt: GameAttempt) => attempt.normalizedTeacherName !== normalizedTeacherName
    );
    localStorage.setItem('dnaDashAttempts', JSON.stringify(filteredAttempts));
    throw error;
  }
};
