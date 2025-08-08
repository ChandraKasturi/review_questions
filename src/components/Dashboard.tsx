'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Question, QuestionSelectionForm } from '@/types';
import QuestionSelector from './QuestionSelector';
import QuestionEditor from './QuestionEditor';
import { LogOut } from 'lucide-react';
import { getSubjectName } from '@/data/subjects';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showEditor, setShowEditor] = useState(false);
  const [selectionData, setSelectionData] = useState<QuestionSelectionForm | null>(null);

  const handleQuestionsLoaded = (loadedQuestions: Question[], formData: QuestionSelectionForm) => {
    setQuestions(loadedQuestions);
    setSelectionData(formData);
    setCurrentQuestionIndex(0);
    setShowEditor(true);
  };

  const handleBackToSelection = () => {
    setShowEditor(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectionData(null);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionUpdate = (updatedQuestion: Question) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = updatedQuestion;
    setQuestions(updatedQuestions);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Question Editor</h1>
            <button
              onClick={logout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {!showEditor ? (
          <QuestionSelector onQuestionsLoaded={handleQuestionsLoaded} />
        ) : (
          <div>
            {/* Navigation Header */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <button
                    onClick={handleBackToSelection}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    ← Back to Selection
                  </button>
                  <div className="mt-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectionData?.subject ? getSubjectName(selectionData.subject) : 'Unknown Subject'} - {selectionData?.topic}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </p>
                    <p className="text-xs text-gray-500">
                      Subject Code: {selectionData?.subject}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

            {/* Question Editor */}
            {questions.length > 0 && (
              <QuestionEditor
                question={questions[currentQuestionIndex]}
                onQuestionUpdate={handleQuestionUpdate}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;