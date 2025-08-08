'use client';

import React, { useState } from 'react';
import { Question, QuestionSelectionForm } from '@/types';
import { questionsAPI } from '@/lib/api';
import { SUBJECTS_DATA, getSubjectOptions, getTopicsForSubject, getSubjectName } from '@/data/subjects';

interface QuestionSelectorProps {
  onQuestionsLoaded: (questions: Question[], formData: QuestionSelectionForm) => void;
}

const QuestionSelector: React.FC<QuestionSelectorProps> = ({ onQuestionsLoaded }) => {
  const [formData, setFormData] = useState<QuestionSelectionForm>({
    subject: '',
    topic: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);

  // Helper function to convert UTC timestamp to Asia/Kolkata timezone
  const convertToKolkataTimezone = (utcTimestamp: string): string => {
    if (!utcTimestamp) return utcTimestamp;
    
    try {
      // Check if the timestamp is already in IST format (contains +05:30)
      if (utcTimestamp.includes('+05:30') || utcTimestamp.includes('+0530')) {
        return utcTimestamp; // Already in IST, no conversion needed
      }
      
      // Parse the UTC timestamp (ensure it's treated as UTC)
      const utcString = utcTimestamp.endsWith('Z') ? utcTimestamp : utcTimestamp + 'Z';
      const utcDate = new Date(utcString);
      
      console.log('Parsing UTC date:', utcString, '→', utcDate.toISOString());
      
      // Convert UTC to IST by adding 5 hours 30 minutes (5.5 hours = 19800000 milliseconds)
      const istTimeInMs = utcDate.getTime() + (5.5 * 60 * 60 * 1000);
      const istDate = new Date(istTimeInMs);
      
      console.log('After adding 5.5 hours:', istDate.toISOString());
      
      // Format as ISO string with IST offset
      const isoString = istDate.toISOString();
      const istTimestamp = isoString.replace('Z', '+05:30');
      
      console.log('Final IST timestamp:', istTimestamp);
      
      return istTimestamp;
    } catch (error) {
      console.error('Error converting timestamp:', utcTimestamp, error);
      return utcTimestamp;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // When subject changes, update available topics and clear topic selection
    if (name === 'subject') {
      const topics = getTopicsForSubject(value);
      setAvailableTopics(topics);
      setFormData((prev) => ({
        ...prev,
        subject: value,
        topic: '', // Reset topic when subject changes
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await questionsAPI.fetchQuestions(formData);
      if (response.questions && response.questions.length > 0) {
        // Convert UTC timestamps to Asia/Kolkata timezone for each question
        const convertedQuestions = response.questions.map(question => {
          const originalCreated = question.created_at;
          const originalUpdated = question.updated_at;
          const convertedCreated = convertToKolkataTimezone(question.created_at);
          const convertedUpdated = question.updated_at ? convertToKolkataTimezone(question.updated_at) : question.updated_at;
          
          console.log('Timezone conversion for question:', question._id);
          console.log('Original created_at:', originalCreated);
          console.log('Converted created_at:', convertedCreated);
          if (originalUpdated) {
            console.log('Original updated_at:', originalUpdated);
            console.log('Converted updated_at:', convertedUpdated);
          }
          
          return {
            ...question,
            created_at: convertedCreated,
            updated_at: convertedUpdated
          };
        });
        
        onQuestionsLoaded(convertedQuestions, formData);
      } else {
        setError('No questions found for the selected criteria.');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to fetch questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Fetch Questions</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.subject}
              onChange={handleInputChange}
            >
              <option value="">Select a subject</option>
              {getSubjectOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Choose from available subjects
            </p>
          </div>

          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
              Topic
            </label>
            <select
              id="topic"
              name="topic"
              required
              disabled={!formData.subject || availableTopics.length === 0}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              value={formData.topic}
              onChange={handleInputChange}
            >
              <option value="">
                {!formData.subject ? 'Select a subject first' : 'Select a topic'}
              </option>
              {availableTopics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Choose from available topics for the selected subject
            </p>
          </div>



          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Loading Questions...' : 'Fetch All Questions'}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Available Subjects:</h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
            {getSubjectOptions().map((option) => (
              <div key={option.value} className="flex flex-col">
                <span className="font-medium">{option.label}</span>
                <span className="text-blue-600">({option.code})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionSelector;