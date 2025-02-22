import React, { useMemo } from 'react';
import { Calendar, MapPin, User } from 'lucide-react';
import { Survey } from '../types';
import { Link } from 'react-router-dom';

interface SurveyCardProps {
  survey: Survey;
}

export function SurveyCard({ survey }: SurveyCardProps) {
  // Use useMemo to keep the random index stable between re-renders
  const randomIndex = useMemo(() => 
    Math.floor(Math.random() * survey.questions.length),
    [survey.questions.length]
  );

  return (
    <Link to={`/survey/${survey.id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <User size={18} />
            <span>{survey.interviewer}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={18} />
            <span>{new Date(survey.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={18} />
            <span>{survey.location}</span>
          </div>
        </div>
        <div className="space-y-2">
          <p className="font-medium">Sample Question:</p>
          <p className="text-gray-600">{survey.questions[randomIndex]}</p>
        </div>
      </div>
    </Link>
  );
}