
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, QuestionType, User, GameAttempt } from './types';
import { generateDnaStrand, getCorrectAnswer } from './utils/dnaUtils';
import { getMissionBriefing, getFunFact } from './services/geminiService';
import { saveGameAttempt } from './services/apiService';
import { LEVEL_CONFIG, INITIAL_LIVES, MAX_LEVEL, HIGH_SCORE_KEY, BASE_POINTS_PER_BASE, TIME_BONUS_MULTIPLIER } from './constants';
import Header from './components/Header';
import DnaDisplay from './components/DnaDisplay';
import Spinner from './components/Spinner';
import LoginScreen from './components/LoginScreen';
import DataView from './components/DataView';
import PasswordPrompt from './components/PasswordPrompt';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.Login);
    const [level, setLevel] = useState(1);
    const [lives, setLives] = useState(INITIAL_LIVES);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [currentStrand, setCurrentStrand] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [questionType, setQuestionType] = useState<QuestionType>(QuestionType.DNAComplement);
    const [userInput, setUserInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(LEVEL_CONFIG[1].time);
    const [isLoading, setIsLoading] = useState(false);
    const [missionBriefing, setMissionBriefing] = useState('');
    const [funFact, setFunFact] = useState('');
    const [feedback, setFeedback] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const storedHighScore = localStorage.getItem(HIGH_SCORE_KEY);
        if (storedHighScore) {
            setHighScore(parseInt(storedHighScore, 10));
        }
    }, []);

    useEffect(() => {
        if (gameState === GameState.Playing && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && gameState === GameState.Playing) {
            handleIncorrectAnswer("Time's up!");
        }
    }, [gameState, timeLeft]);

    const startLevel = useCallback(async (levelNum: number) => {
        setIsLoading(true);
        setFeedback('');
        setUserInput('');
        const config = LEVEL_CONFIG[levelNum];
        const newStrand = generateDnaStrand(config.length);
        setCurrentStrand(newStrand);
        
        // Randomly choose question type
        const randomType = Math.random() < 0.5 ? QuestionType.DNAComplement : QuestionType.mRNA;
        setQuestionType(randomType);
        const answer = getCorrectAnswer(newStrand, randomType);
        setCorrectAnswer(answer);
        
        setTimeLeft(config.time);
        
        const briefing = await getMissionBriefing(levelNum);
        setMissionBriefing(briefing);
        
        setIsLoading(false);
        setGameState(GameState.MissionBriefing);
    }, []);

    const handleStartGame = useCallback(() => {
        setScore(0);
        setLives(INITIAL_LIVES);
        setLevel(1);
        startLevel(1);
    }, [startLevel]);

    const handleNextLevel = useCallback(() => {
        const nextLevel = level + 1;
        if (nextLevel > MAX_LEVEL) {
            setFeedback("Congratulations! You've completed all sequences!");
            setGameState(GameState.GameOver);
        } else {
            setLevel(nextLevel);
            startLevel(nextLevel);
        }
    }, [level, startLevel]);

    const handleIncorrectAnswer = (message: string) => {
        const newLives = lives - 1;
        setLives(newLives);
        setFeedback(message);
        setTimeout(() => setFeedback(''), 2000);

        if (newLives <= 0) {
            setGameState(GameState.GameOver);
            if (score > highScore) {
                setHighScore(score);
                localStorage.setItem(HIGH_SCORE_KEY, score.toString());
            }
        } else {
            setUserInput('');
            setTimeLeft(LEVEL_CONFIG[level].time);
        }
    };
    
    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!user) return;
        
        const isCorrect = userInput.toUpperCase() === correctAnswer;
        const points = LEVEL_CONFIG[level].length * BASE_POINTS_PER_BASE;
        const timeBonus = timeLeft * TIME_BONUS_MULTIPLIER;
        const totalScore = isCorrect ? points + timeBonus : 0;
        
        // Save attempt to database
        const attempt: Omit<GameAttempt, 'id'> = {
            userFirstName: user.firstName,
            teacherName: user.teacherName,
            normalizedTeacherName: user.normalizedTeacherName,
            questionType: questionType,
            originalStrand: currentStrand,
            userAnswer: userInput.toUpperCase(),
            correctAnswer: correctAnswer,
            isCorrect: isCorrect,
            level: level,
            score: totalScore,
            timestamp: new Date().toISOString()
        };
        
        await saveGameAttempt(attempt);
        
        if (isCorrect) {
            setScore(prev => prev + totalScore);
            
            setIsLoading(true);
            const fact = await getFunFact();
            setFunFact(fact);
            setIsLoading(false);
            setGameState(GameState.LevelComplete);
        } else {
            handleIncorrectAnswer("Incorrect sequence!");
        }
    }, [userInput, correctAnswer, level, timeLeft, user, questionType, currentStrand]);
    
    useEffect(() => {
        if(userInput.length === currentStrand.length && currentStrand.length > 0) {
            handleSubmit();
        }
    }, [userInput, currentStrand, handleSubmit]);

    useEffect(() => {
      if (gameState === GameState.Playing) {
        inputRef.current?.focus();
      }
    }, [gameState]);

    const handleLogin = (userData: User) => {
        setUser(userData);
        setGameState(GameState.Start);
    };

    const handleDataAccess = () => {
        setShowPasswordPrompt(true);
    };

    const handlePasswordSuccess = () => {
        setShowPasswordPrompt(false);
        setGameState(GameState.DataView);
    };

    const handlePasswordCancel = () => {
        setShowPasswordPrompt(false);
    };

    const handleBackFromData = () => {
        setGameState(GameState.Start);
    };


    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center p-8 min-h-[300px]">
                    <Spinner />
                    <p className="mt-4 text-cyan-300 font-display">Analyzing Genetic Data...</p>
                </div>
            );
        }

        switch (gameState) {
            case GameState.Login:
                return <LoginScreen onLogin={handleLogin} onDataAccess={handleDataAccess} />;
            case GameState.DataView:
                return <DataView onBack={handleBackFromData} />;
            case GameState.Start:
                return (
                    <div className="text-center p-8">
                        <h1 className="text-5xl font-bold text-cyan-400 mb-4 font-display animate-pulse">DNA Dash</h1>
                        <p className="text-slate-300 mb-6 max-w-lg mx-auto">Test your knowledge of DNA base pairing and mRNA transcription! Complete the sequences before time runs out.</p>
                        <div className="bg-slate-900/50 p-4 rounded-lg mb-8 max-w-2xl mx-auto">
                            <h3 className="text-xl font-bold text-cyan-400 mb-2 font-display">Pairing Rules</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-lg font-bold text-green-400 mb-2">DNA Complement</h4>
                                    <p className="text-slate-200"><span className="font-bold text-red-400">A</span>denine pairs with <span className="font-bold text-blue-400">T</span>hymine</p>
                                    <p className="text-slate-200"><span className="font-bold text-green-400">G</span>uanine pairs with <span className="font-bold text-yellow-400">C</span>ytosine</p>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-purple-400 mb-2">mRNA Transcription</h4>
                                    <p className="text-slate-200"><span className="font-bold text-red-400">A</span>denine → <span className="font-bold text-orange-400">U</span>racil</p>
                                    <p className="text-slate-200"><span className="font-bold text-blue-400">T</span>hymine → <span className="font-bold text-red-400">A</span>denine</p>
                                    <p className="text-slate-200"><span className="font-bold text-green-400">G</span>uanine → <span className="font-bold text-yellow-400">C</span>ytosine</p>
                                    <p className="text-slate-200"><span className="font-bold text-yellow-400">C</span>ytosine → <span className="font-bold text-green-400">G</span>uanine</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <button onClick={handleStartGame} className="bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-cyan-500 transition-transform transform hover:scale-105 font-display text-xl">
                                Start Mission
                            </button>
                        </div>
                    </div>
                );
            case GameState.MissionBriefing:
                 return (
                    <div className="text-center p-8">
                        <h2 className="text-3xl font-bold text-cyan-400 mb-4 font-display">Level {level} Briefing</h2>
                        <p className="text-slate-300 mb-8 max-w-2xl mx-auto">{missionBriefing}</p>
                        <button onClick={() => { setGameState(GameState.Playing); inputRef.current?.focus(); }} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-500 transition-transform transform hover:scale-105 font-display text-xl">
                            Begin Sequencing
                        </button>
                    </div>
                );
            case GameState.Playing:
                const questionTypeText = questionType === QuestionType.DNAComplement ? 'DNA Complement' : 'mRNA Transcription';
                const instructionText = questionType === QuestionType.DNAComplement 
                    ? 'Enter Complementary Strand:' 
                    : 'Enter mRNA Strand:';
                return (
                    <div className="p-4 sm:p-8 flex flex-col items-center">
                        <div className="mb-4 text-2xl font-bold font-display">
                            Time Left: <span className={timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-green-400"}>{timeLeft}s</span>
                        </div>
                        <div className="mb-4 p-3 bg-slate-900/50 rounded-lg">
                            <span className="text-cyan-400 font-bold">Question Type: </span>
                            <span className="text-slate-200">{questionTypeText}</span>
                        </div>
                        <p className="text-lg text-slate-300 mb-2">Replicate this DNA Strand:</p>
                        <DnaDisplay strand={currentStrand} />
                        <p className="text-lg text-slate-300 mt-4 mb-2">{instructionText}</p>
                        <form onSubmit={handleSubmit} className="w-full max-w-md">
                            <input
                                ref={inputRef}
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value.toUpperCase())}
                                maxLength={currentStrand.length}
                                className="w-full p-3 text-center text-xl font-mono bg-slate-900 border-2 border-cyan-500 rounded-lg text-slate-100 tracking-[0.2em] focus:outline-none focus:ring-2 focus:ring-cyan-300"
                                placeholder={"?".repeat(currentStrand.length)}
                                autoFocus
                            />
                        </form>
                        {feedback && <p className="mt-4 text-2xl font-bold text-red-500 animate-bounce">{feedback}</p>}
                    </div>
                );
            case GameState.LevelComplete:
                 return (
                    <div className="text-center p-8">
                        <h2 className="text-3xl font-bold text-green-400 mb-4 font-display">Sequence Complete!</h2>
                        <p className="text-slate-300 mb-2 font-bold text-xl">Well done, scientist!</p>
                        <div className="bg-slate-900/50 p-4 rounded-lg my-6 max-w-2xl mx-auto">
                           <h3 className="text-xl font-bold text-cyan-400 mb-2 font-display">Genetic Fun Fact</h3>
                           <p className="text-slate-200">{funFact}</p>
                        </div>
                        <button onClick={handleNextLevel} className="bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-cyan-500 transition-transform transform hover:scale-105 font-display text-xl">
                            Next Level
                        </button>
                    </div>
                );

            case GameState.GameOver:
                return (
                    <div className="text-center p-8">
                        <h2 className="text-4xl font-bold text-red-500 mb-4 font-display">Game Over</h2>
                        <p className="text-2xl text-slate-200 mb-2">Final Score: <span className="text-cyan-400">{score}</span></p>
                        <p className="text-xl text-slate-300 mb-8">High Score: <span className="text-yellow-400">{highScore}</span></p>
                        <button onClick={handleStartGame} className="bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-cyan-500 transition-transform transform hover:scale-105 font-display text-xl">
                            Play Again
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="bg-slate-900 text-slate-200 min-h-screen flex items-center justify-center p-4 bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/seed/dna/1920/1080?blur=5')"}}>
            <main className="w-full max-w-4xl bg-slate-800/70 backdrop-blur-md rounded-lg shadow-2xl shadow-cyan-500/10 border border-slate-700">
                {gameState !== GameState.Start && gameState !== GameState.Login && gameState !== GameState.DataView && <Header score={score} highScore={highScore} level={level} lives={lives} />}
                <div className="min-h-[400px] flex items-center justify-center">
                    {renderContent()}
                </div>
            </main>
            {showPasswordPrompt && (
                <PasswordPrompt 
                    onSuccess={handlePasswordSuccess}
                    onCancel={handlePasswordCancel}
                />
            )}
        </div>
    );
};

export default App;
