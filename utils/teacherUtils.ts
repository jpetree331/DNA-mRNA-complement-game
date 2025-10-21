// Get teacher names from environment variable
const getTeacherNames = (): string[] => {
  const teacherNames = (import.meta as any).env?.VITE_TEACHER_NAMES || 'Smith,Johnson,Williams,Brown,Jones,Garcia,Miller,Davis,Rodriguez,Martinez';
  return teacherNames.split(',').map(name => name.trim());
};

// Simple Levenshtein distance calculation for fuzzy matching
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  
  return matrix[str2.length][str1.length];
};

// Find the closest matching teacher name
export const findClosestTeacher = (inputName: string): string => {
  const teacherNames = getTeacherNames();
  const normalizedInput = inputName.toLowerCase().trim();
  
  let bestMatch = teacherNames[0];
  let bestDistance = levenshteinDistance(normalizedInput, teacherNames[0].toLowerCase());
  
  for (const teacherName of teacherNames) {
    const distance = levenshteinDistance(normalizedInput, teacherName.toLowerCase());
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = teacherName;
    }
  }
  
  // If the distance is too high (more than 3 characters different), 
  // return the original input to avoid incorrect matches
  if (bestDistance > 3) {
    return inputName;
  }
  
  return bestMatch;
};

// Normalize teacher name for consistent storage
export const normalizeTeacherName = (teacherName: string): string => {
  return findClosestTeacher(teacherName).toLowerCase();
};
