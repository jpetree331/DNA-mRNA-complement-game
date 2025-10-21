
export const INITIAL_LIVES = 3;
export const BASE_POINTS_PER_BASE = 10;
export const TIME_BONUS_MULTIPLIER = 2;

interface LevelConfig {
    [level: number]: {
        length: number;
        time: number;
    }
}

export const LEVEL_CONFIG: LevelConfig = {
  1: { length: 6, time: 20 },
  2: { length: 8, time: 25 },
  3: { length: 10, time: 30 },
  4: { length: 13, time: 35 },
  5: { length: 16, time: 40 },
  6: { length: 20, time: 45 },
};

export const MAX_LEVEL = Object.keys(LEVEL_CONFIG).length;
export const HIGH_SCORE_KEY = 'dnaDashHighScore';
