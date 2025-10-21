import React, { useState } from 'react';
import { User } from '../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim() || !teacherName.trim()) {
      setError('Please enter both your first name and teacher name');
      return;
    }

    if (firstName.trim().length < 2) {
      setError('First name must be at least 2 characters');
      return;
    }

    if (teacherName.trim().length < 2) {
      setError('Teacher name must be at least 2 characters');
      return;
    }

    // Import the teacher matching function
    import('../utils/teacherUtils').then(({ findClosestTeacher, normalizeTeacherName }) => {
      const matchedTeacher = findClosestTeacher(teacherName.trim());
      const normalizedTeacher = normalizeTeacherName(teacherName.trim());
      
      const user: User = {
        firstName: firstName.trim(),
        teacherName: matchedTeacher,
        normalizedTeacherName: normalizedTeacher
      };
      
      onLogin(user);
    });
  };

  return (
    <div className="text-center p-8">
      <h1 className="text-5xl font-bold text-cyan-400 mb-4 font-display animate-pulse">DNA Dash</h1>
      <p className="text-slate-300 mb-8 max-w-lg mx-auto">Enter your information to start the genetic sequencing mission!</p>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-6">
          <label htmlFor="firstName" className="block text-slate-300 text-left mb-2 font-display">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-3 text-center text-xl bg-slate-900 border-2 border-cyan-500 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            placeholder="Enter your first name"
            autoFocus
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="teacherName" className="block text-slate-300 text-left mb-2 font-display">
            Teacher Name
          </label>
          <input
            id="teacherName"
            type="text"
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            className="w-full p-3 text-center text-xl bg-slate-900 border-2 border-cyan-500 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            placeholder="Enter your teacher's name"
          />
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}
        
        <button 
          type="submit"
          className="bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-cyan-500 transition-transform transform hover:scale-105 font-display text-xl w-full"
        >
          Start Mission
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
