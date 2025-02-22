import React from 'react';
import { SurveyCard } from '../components/SurveyCard';
import { Survey, mockData } from '../types';
import { Link } from 'react-router-dom';

export function SurveyList() {
  // In a real app, this would fetch from Nostr
  const surveys: Survey[] = JSON.parse(localStorage.getItem('surveys') || '[]');
  const allSurveys = [...surveys, ...mockData];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="text-blue-600 hover:text-blue-500 mb-4 block">
        ← Back to Home
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Surveys</h1>

      <div className="space-y-6">
        {allSurveys.map(survey => (
          <SurveyCard key={survey.id} survey={survey} />
        ))}
      </div>
    </div>
  );
}