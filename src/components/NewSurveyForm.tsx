import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Survey } from '../types';
import { Upload, AlertCircle, Plus, Minus } from 'lucide-react';
import { NostrLogin } from './NostrLogin';

export function NewSurveyForm() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(['']);
  const [answers, setAnswers] = useState<string[][]>([['']]);
  const [error, setError] = useState<string | null>(null);
  const [nostrPubkey, setNostrPubkey] = useState<string | null>(null);

  const handleCSVUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => 
          row.split(',').map(cell => 
            cell.trim().replace(/^["']|["']$/g, '') // Remove quotes if present
          )
        );

        // Get headers (questions) from the first row
        const headers = rows[0];
        if (headers.length < 2) {
          setError('Invalid CSV format: No questions found');
          return;
        }

        // Remove timestamp and interviewer columns
        const questionIndexes = headers.slice(1, -1).map((_, index) => index + 1);
        const questions = headers.slice(1, -1);

        // Group answers by question
        const answersByQuestion = questionIndexes.map(questionIndex => {
          return rows.slice(1) // Skip header row
            .map(row => row[questionIndex])
            .filter(answer => answer && answer.trim() !== ''); // Remove empty answers
        });

        if (questions.length === 0) {
          setError('No valid questions found in CSV file');
          return;
        }

        setQuestions(questions);
        setAnswers(answersByQuestion);
        setError(null);

        // Pre-fill the date field with today's date
        const dateInput = document.querySelector('input[name="date"]') as HTMLInputElement;
        if (dateInput) {
          const today = new Date().toISOString().split('T')[0];
          dateInput.value = today;
        }
      } catch (err) {
        console.error('CSV parsing error:', err);
        setError('Failed to parse CSV file. Please ensure it has the correct format from Google Forms.');
      }
    };
    reader.readAsText(file);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nostrPubkey) {
      alert('Please login with Nostr first');
      return;
    }
    
    const formData = new FormData(e.target as HTMLFormElement);
    
    const newSurvey: Survey = {
      id: Date.now().toString(),
      interviewer: nostrPubkey,
      date: formData.get('date') as string,
      location: formData.get('location') as string,
      questions: questions.filter(q => q.trim() !== ''),
      answers: answers.map(answerSet => answerSet.filter(a => a.trim() !== '')),
      nostrPubkey
    };

    // In a real app, this would be handled by Nostr
    const existingSurveys = JSON.parse(localStorage.getItem('surveys') || '[]');
    localStorage.setItem('surveys', JSON.stringify([newSurvey, ...existingSurveys]));
    
    navigate('/');
  };

  const addAnswer = (questionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = [...newAnswers[questionIndex], ''];
    setAnswers(newAnswers);
  };

  const removeAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = newAnswers[questionIndex].filter((_, idx) => idx !== answerIndex);
    setAnswers(newAnswers);
  };

  const addQuestion = () => {
    setQuestions([...questions, '']);
    setAnswers([...answers, ['']]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        {!nostrPubkey ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interviewer Authentication</label>
            <NostrLogin onLogin={setNostrPubkey} />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700">Interviewer</label>
            <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200">
              <code className="text-sm text-gray-800">{nostrPubkey}</code>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          required
          defaultValue={new Date().toISOString().split('T')[0]}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          name="location"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Questions & Answers</h3>
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <button
              type="button"
              className="bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-2"
            >
              <Upload size={16} />
              Upload CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-md flex items-start gap-2">
            <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-8">
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="bg-gray-50 p-4 rounded-lg">
              <input
                type="text"
                value={question}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[qIndex] = e.target.value;
                  setQuestions(newQuestions);
                }}
                placeholder="Question"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-4"
              />
              <div className="space-y-2">
                {answers[qIndex]?.map((answer, aIndex) => (
                  <div key={aIndex} className="flex gap-2">
                    <input
                      type="text"
                      value={answer}
                      onChange={(e) => {
                        const newAnswers = [...answers];
                        newAnswers[qIndex][aIndex] = e.target.value;
                        setAnswers(newAnswers);
                      }}
                      placeholder={`Answer ${aIndex + 1}`}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {answers[qIndex].length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAnswer(qIndex, aIndex)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Minus size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addAnswer(qIndex)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-500 flex items-center gap-1"
              >
                <Plus size={16} />
                Add another answer
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addQuestion}
          className="mt-4 text-sm text-blue-600 hover:text-blue-500 flex items-center gap-1"
        >
          <Plus size={16} />
          Add another question
        </button>
      </div>

      <button
        type="submit"
        disabled={!nostrPubkey}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Submit Survey
      </button>
    </form>
  );
}