import React, { useState } from 'react';

interface PasswordPromptProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const PasswordPrompt: React.FC<PasswordPromptProps> = ({ onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const correctPassword = (import.meta as any).env?.VITE_DATA_PASSWORD || 'biologyresearchcentral';
    
    if (password === correctPassword) {
      onSuccess();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-8 rounded-lg shadow-2xl border border-slate-700 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4 font-display text-center">
          Data Access
        </h2>
        <p className="text-slate-300 mb-6 text-center">
          Enter the password to access student data:
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 text-center text-xl bg-slate-900 border-2 border-cyan-500 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              placeholder="Enter password"
              autoFocus
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-300 text-center">
              {error}
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-slate-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-500 transition-colors"
            >
              Access Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordPrompt;
