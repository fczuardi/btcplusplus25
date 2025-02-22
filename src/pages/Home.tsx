import React from 'react';
import { Link } from 'react-router-dom';
import { SurveyCard } from '../components/SurveyCard';
import { Survey, mockData } from '../types';
import { ClipboardList } from 'lucide-react';

export function Home() {
  // In a real app, this would fetch from Nostr
  const surveys: Survey[] = JSON.parse(localStorage.getItem('surveys') || '[]');
  const allSurveys = [...surveys, ...mockData];
  const recentSurveys = allSurveys.slice(0, 2);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Survey Repository</h1>
          <p className="mt-2 text-gray-600">Browse and submit survey responses</p>
        </div>
        <Link
          to="/new"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <ClipboardList size={20} />
          New Survey
        </Link>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Submissions</h2>
        {recentSurveys.map(survey => (
          <SurveyCard key={survey.id} survey={survey} />
        ))}
      </div>

      <div className="mt-8">
        <Link
          to="/surveys"
          className="text-blue-600 hover:text-blue-500"
        >
          View all surveys →
        </Link>
      </div>
    </div>
  );
}