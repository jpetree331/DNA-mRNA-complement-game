
import React from 'react';

interface HeaderProps {
    score: number;
    highScore: number;
    level: number;
    lives: number;
}

const Header: React.FC<HeaderProps> = ({ score, highScore, level, lives }) => {
    return (
        <div className="w-full max-w-4xl mx-auto p-4 bg-slate-900/50 backdrop-blur-sm border-b border-cyan-500/30 rounded-t-lg">
            <div className="flex justify-between items-center text-slate-200 font-display">
                <div>
                    <span className="text-cyan-400">Score:</span> {score}
                    <span className="text-xs text-slate-400 ml-4">High: {highScore}</span>
                </div>
                <div className="text-2xl">
                    <span className="text-cyan-400">Level:</span> {level}
                </div>
                <div>
                    <span className="text-cyan-400">Lives:</span>
                    <span className="text-red-500 ml-2">{'♥'.repeat(lives)}</span>
                </div>
            </div>
        </div>
    );
};

export default Header;
