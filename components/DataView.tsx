import React, { useState, useEffect } from 'react';
import { GameAttempt } from '../types';
import { getGameAttemptsByTeacher, clearTeacherData } from '../services/apiService';
import Spinner from './Spinner';

interface DataViewProps {
  onBack: () => void;
}

const DataView: React.FC<DataViewProps> = ({ onBack }) => {
  const [attemptsByTeacher, setAttemptsByTeacher] = useState<Record<string, GameAttempt[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [clearingData, setClearingData] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await getGameAttemptsByTeacher();
        setAttemptsByTeacher(data);
        if (Object.keys(data).length > 0) {
          setSelectedTeacher(Object.keys(data)[0]);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getQuestionTypeText = (questionType: string) => {
    return questionType === 'DNAComplement' ? 'DNA Complement' : 'mRNA Transcription';
  };

  const getCorrectnessIcon = (isCorrect: boolean) => {
    return isCorrect ? '✅' : '❌';
  };

  const getStudentsByTeacher = (teacherName: string) => {
    const attempts = attemptsByTeacher[teacherName] || [];
    const studentsMap = new Map<string, GameAttempt[]>();
    
    attempts.forEach(attempt => {
      const studentName = attempt.userFirstName;
      if (!studentsMap.has(studentName)) {
        studentsMap.set(studentName, []);
      }
      studentsMap.get(studentName)!.push(attempt);
    });
    
    return studentsMap;
  };

  const handleClearTeacherData = async (teacherName: string) => {
    if (!window.confirm(`Are you sure you want to clear all data for ${teacherName}? This action cannot be undone.`)) {
      return;
    }

    setClearingData(teacherName);
    try {
      await clearTeacherData(teacherName);
      // Reload data after clearing
      const data = await getGameAttemptsByTeacher();
      setAttemptsByTeacher(data);
      
      // If we cleared the selected teacher's data, reset selection
      if (selectedTeacher === teacherName) {
        const remainingTeachers = Object.keys(data);
        setSelectedTeacher(remainingTeachers.length > 0 ? remainingTeachers[0] : null);
      }
    } catch (error) {
      console.error('Error clearing teacher data:', error);
      alert('Failed to clear data. Please try again.');
    } finally {
      setClearingData(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 min-h-[300px]">
        <Spinner />
        <p className="mt-4 text-cyan-300 font-display">Loading student data...</p>
      </div>
    );
  }

  const teachers = Object.keys(attemptsByTeacher);
  const selectedAttempts = selectedTeacher ? attemptsByTeacher[selectedTeacher] : [];
  const studentsMap = selectedTeacher ? getStudentsByTeacher(selectedTeacher) : new Map();
  const students = Array.from(studentsMap.keys());
  const selectedStudentAttempts = selectedStudent && studentsMap.has(selectedStudent) ? studentsMap.get(selectedStudent)! : [];

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-cyan-400 font-display">Student Data</h2>
        <button
          onClick={onBack}
          className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors"
        >
          Back to Game
        </button>
      </div>

      {teachers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-300 text-xl">No student data available yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Teacher Selection */}
          <div className="bg-slate-900/50 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-cyan-400 mb-3 font-display">Select Teacher</h3>
            <div className="flex flex-wrap gap-2">
              {teachers.map((teacher) => (
                <div key={teacher} className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTeacher(teacher)}
                    className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                      selectedTeacher === teacher
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {teacher} ({attemptsByTeacher[teacher].length} attempts)
                  </button>
                  <button
                    onClick={() => handleClearTeacherData(teacher)}
                    disabled={clearingData === teacher}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={`Clear all data for ${teacher}`}
                  >
                    {clearingData === teacher ? 'Clearing...' : 'Clear Data'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Student List */}
          {selectedTeacher && (
            <div className="bg-slate-900/50 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-cyan-400 mb-4 font-display">
                Students in {selectedTeacher}'s Class
              </h3>
              
              {students.length === 0 ? (
                <p className="text-slate-300">No students recorded for this teacher.</p>
              ) : (
                <div className="space-y-4">
                  {/* Student Selection */}
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-slate-300 mb-2">Select Student:</h4>
                    <div className="flex flex-wrap gap-2">
                      {students.map((studentName) => {
                        const studentAttempts = studentsMap.get(studentName) || [];
                        const totalScore = studentAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
                        const correctCount = studentAttempts.filter(attempt => attempt.isCorrect).length;
                        const totalAttempts = studentAttempts.length;
                        
                        return (
                          <button
                            key={studentName}
                            onClick={() => setSelectedStudent(studentName)}
                            className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                              selectedStudent === studentName
                                ? 'bg-cyan-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                          >
                            {studentName} ({totalAttempts} attempts, {correctCount} correct, {totalScore} points)
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected Student's Attempts */}
                  {selectedStudent && (
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                      <h4 className="text-lg font-bold text-cyan-400 mb-4 font-display">
                        {selectedStudent}'s Attempts
                      </h4>
                      
                      {selectedStudentAttempts.length === 0 ? (
                        <p className="text-slate-300">No attempts recorded for this student.</p>
                      ) : (
                        <div className="space-y-3">
                          {selectedStudentAttempts.map((attempt) => (
                            <div key={attempt.id} className="bg-slate-700/50 p-3 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <span className="text-slate-400">Level {attempt.level}</span>
                                  <span className="text-slate-400 ml-2">Score: {attempt.score}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-slate-400 text-sm">{formatTimestamp(attempt.timestamp)}</span>
                                  <div className="text-lg">{getCorrectnessIcon(attempt.isCorrect)}</div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div>
                                  <p className="text-slate-300 text-sm mb-1">
                                    <span className="font-bold">Question Type:</span> {getQuestionTypeText(attempt.questionType)}
                                  </p>
                                  <p className="text-slate-300 text-sm mb-1">
                                    <span className="font-bold">Original Strand:</span> {attempt.originalStrand}
                                  </p>
                                  <p className="text-slate-300 text-sm">
                                    <span className="font-bold">Correct Answer:</span> {attempt.correctAnswer}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-slate-300 text-sm">
                                    <span className="font-bold">Student Answer:</span> {attempt.userAnswer}
                                  </p>
                                  {!attempt.isCorrect && (
                                    <p className="text-red-400 text-sm mt-1">
                                      Incorrect - Expected: {attempt.correctAnswer}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataView;
