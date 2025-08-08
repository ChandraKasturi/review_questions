'use client';

import React, { useState, useEffect } from 'react';
import { Question } from '@/types';
import { questionsAPI } from '@/lib/api';
import ImageUploader from './ImageUploader';
import { Save } from 'lucide-react';

interface QuestionEditorProps {
  question: Question;
  onQuestionUpdate: (updatedQuestion: Question) => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ question, onQuestionUpdate }) => {
  const [editedQuestion, setEditedQuestion] = useState<Question>(question);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Update local state when question prop changes (for navigation)
  useEffect(() => {
    // Only clear save message if we're navigating to a different question
    // If it's the same question ID, it's just an update from save operation
    if (editedQuestion._id !== question._id) {
      setSaveMessage(null);
    }
    
    setEditedQuestion(question);
  }, [question, editedQuestion._id]);

  // Helper function to get current timestamp in Asia/Kolkata timezone
  const getCurrentKolkataTimestamp = () => {
    const now = new Date();
    const kolkataOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const kolkataTime = new Date(now.getTime() + kolkataOffset - (now.getTimezoneOffset() * 60 * 1000));
    return kolkataTime.toISOString().replace('Z', '+05:30');
  };

  // Helper function to format date in Asia/Kolkata timezone
  const formatDateInKolkata = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    // Create date object from the string (handles both UTC and IST formats)
    const date = new Date(dateString);
    
    // Convert to Asia/Kolkata timezone and format
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    
    try {
      const formatted = date.toLocaleString('en-GB', options);
      return formatted + ' As/Kol';
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return dateString + ' (format error)';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedQuestion((prev) => ({
      ...prev,
      [name]: name === 'level' || name === 'marks' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleImageUpload = (imageData: string, type: 'question' | 'explanation') => {
    setEditedQuestion((prev) => ({
      ...prev,
      [type === 'question' ? 'question_image' : 'explaination_image']: imageData,
    }));
  };

  const handleClipboardPaste = async (type: 'question' | 'explanation') => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        for (const type_clipboard of clipboardItem.types) {
          if (type_clipboard.startsWith('image/')) {
            const blob = await clipboardItem.getType(type_clipboard);
            const reader = new FileReader();
            reader.onload = () => {
              handleImageUpload(reader.result as string, type);
            };
            reader.readAsDataURL(blob);
            return;
          }
        }
      }
      alert('No image found in clipboard');
    } catch (error) {
      console.error('Failed to read clipboard:', error);
      alert('Failed to read clipboard. Please try uploading a file instead.');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage(null);

    try {
      const response = await questionsAPI.updateQuestion({ question_data: editedQuestion });
      
      if (response.success) {
        // Use the updated_at timestamp from the API response
        const updatedQuestion = {
          ...editedQuestion,
          updated_at: response.updated_at || getCurrentKolkataTimestamp()
        };
        
        setEditedQuestion(updatedQuestion);
        onQuestionUpdate(updatedQuestion);
        setSaveMessage({ type: 'success', message: '✅ Question saved successfully!' });
        
        // Clear success message after 4 seconds
        setTimeout(() => {
          setSaveMessage(null);
        }, 4000);
      } else {
        setSaveMessage({ type: 'error', message: 'Failed to update question.' });
        // Clear error message after 6 seconds
        setTimeout(() => setSaveMessage(null), 6000);
      }
    } catch (error) {
      console.error('Error updating question:', error);
      setSaveMessage({ type: 'error', message: 'Error updating question. Please try again.' });
      // Clear error message after 6 seconds
      setTimeout(() => setSaveMessage(null), 6000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Save Message - Toast Notification */}
      {saveMessage && (
        <div 
          className={`fixed top-4 right-4 z-[9999] p-6 rounded-lg shadow-2xl max-w-sm min-w-[300px] border-2 transform transition-all duration-300 ${
            saveMessage.type === 'success' 
              ? 'bg-green-100 text-green-900 border-green-500' 
              : 'bg-red-100 text-red-900 border-red-500'
          }`}
          style={{ 
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
          }}
        >
          <div className="flex items-center space-x-3">
            <div className={`flex-shrink-0 text-2xl ${
              saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {saveMessage.type === 'success' ? '✅' : '❌'}
            </div>
            <div>
              <p className="font-bold text-lg">{saveMessage.message}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Debug notification - temporary */}
      {saveMessage && (
        <div className="bg-red-500 text-white p-4 text-center text-xl font-bold">
          DEBUG: {saveMessage.message}
        </div>
      )}

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Source Image */}
          <div className="space-y-4">
            {editedQuestion.source_image_view_url && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Source Image</h3>
                <div className="border rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={editedQuestion.source_image_view_url}
                    alt="Source"
                    className="w-full h-auto"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Source: {editedQuestion.source_image_name} from {editedQuestion.source_folder_name}
                </p>
              </div>
            )}

            {/* Question Metadata */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Question Information</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div>
                  <span className="font-medium">Created:</span> {formatDateInKolkata(editedQuestion.created_at)}
                </div>
                {editedQuestion.updated_at && (
                  <div>
                    <span className="font-medium">Last Updated:</span> {formatDateInKolkata(editedQuestion.updated_at)}
                  </div>
                )}
                <div>
                  <span className="font-medium">Question ID:</span> {editedQuestion._id}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Question Fields */}
          <div className="space-y-6">
            {/* Question */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question *
              </label>
              <textarea
                name="question"
                value={editedQuestion.question}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the question..."
              />
            </div>

            {/* MCQ Options - Only show for MCQ questions */}
            {editedQuestion.question_type === 'MCQ' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Option 1
                    </label>
                    <input
                      type="text"
                      name="option1"
                      value={editedQuestion.option1 || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter option 1..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Option 2
                    </label>
                    <input
                      type="text"
                      name="option2"
                      value={editedQuestion.option2 || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter option 2..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Option 3
                    </label>
                    <input
                      type="text"
                      name="option3"
                      value={editedQuestion.option3 || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter option 3..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Option 4
                    </label>
                    <input
                      type="text"
                      name="option4"
                      value={editedQuestion.option4 || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter option 4..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correct Answer
                    </label>
                    <select
                      name="correctanswer"
                      value={editedQuestion.correctanswer || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select correct answer</option>
                      <option value="option1">Option 1</option>
                      <option value="option2">Option 2</option>
                      <option value="option3">Option 3</option>
                      <option value="option4">Option 4</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Model Answer - Hide for MCQ questions */}
            {editedQuestion.question_type !== 'MCQ' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model Answer
              </label>
              <textarea
                name="model_answer"
                value={editedQuestion.model_answer}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the model answer..."
              />
            </div>
            )}

            {/* Grading Criteria - Hide for MCQ questions */}
            {editedQuestion.question_type !== 'MCQ' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grading Criteria
              </label>
              <textarea
                name="grading_criteria"
                value={editedQuestion.grading_criteria}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter grading criteria..."
              />
            </div>
            )}

            {/* Explanation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explanation
              </label>
              <textarea
                name="explaination"
                value={editedQuestion.explaination}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter explanation..."
              />
            </div>
            {/* Question Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Type
                </label>
                <select
                  name="question_type"
                  value={editedQuestion.question_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="VERY_SHORT_ANSWER">Very Short Answer</option>
                  <option value="SHORT_ANSWER">Short Answer</option>
                  <option value="LONG_ANSWER">Long Answer</option>
                  <option value="MCQ">Multiple Choice (MCQ)</option>
                  <option value="TRUEFALSE">True/False</option>
                  <option value="CASE_STUDY">Case Study</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marks
                </label>
                <input
                  type="number"
                  name="marks"
                  value={editedQuestion.marks}
                  onChange={handleInputChange}
                  min={1}
                  max={100}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <select
                  name="level"
                  value={editedQuestion.level}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={1}>Easy</option>
                  <option value={2}>Medium</option>
                  <option value={3}>Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Set
                </label>
                <input
                  type="text"
                  name="questionset"
                  value={editedQuestion.questionset}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Subject and Topic */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={editedQuestion.subject}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic
                </label>
                <input
                  type="text"
                  name="topic"
                  value={editedQuestion.topic}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtopic
                </label>
                <input
                  type="text"
                  name="subtopic"
                  value={editedQuestion.subtopic}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Images */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Image
                </label>
                <ImageUploader
                  onImageUpload={(imageData) => handleImageUpload(imageData, 'question')}
                  onClipboardPaste={() => handleClipboardPaste('question')}
                  currentImage={editedQuestion.question_image}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Explanation Image
                </label>
                <ImageUploader
                  onImageUpload={(imageData) => handleImageUpload(imageData, 'explanation')}
                  onClipboardPaste={() => handleClipboardPaste('explanation')}
                  currentImage={editedQuestion.explaination_image}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              saving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Question'}
          </button>
        </div>
      </div>


    </div>
  );
};

export default QuestionEditor;