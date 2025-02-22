import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, User, Download } from 'lucide-react';
import { Survey, mockData } from '../types';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const CHART_COLORS = [
  'rgba(255, 99, 132, 0.8)',
  'rgba(54, 162, 235, 0.8)',
  'rgba(255, 206, 86, 0.8)',
  'rgba(75, 192, 192, 0.8)',
  'rgba(153, 102, 255, 0.8)',
  'rgba(255, 159, 64, 0.8)',
  'rgba(255, 99, 132, 0.8)',
  'rgba(54, 162, 235, 0.8)',
  'rgba(255, 206, 86, 0.8)',
  'rgba(75, 192, 192, 0.8)',
];

export function SurveyDetail() {
  const { id } = useParams();
  
  // In a real app, this would fetch from Nostr
  const surveys: Survey[] = JSON.parse(localStorage.getItem('surveys') || '[]');
  const allSurveys = [...surveys, ...mockData];
  const survey = allSurveys.find(s => s.id === id);

  if (!survey) {
    return <div>Survey not found</div>;
  }

  const downloadCSV = () => {
    const headers = ['Question', 'Answer'];
    const rows = survey.questions.flatMap((q, i) => 
      survey.answers[i].map(a => [q, a])
    );
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `survey-${survey.id}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getChartData = (answers: string[]) => {
    // Count occurrences of each answer
    const answerCounts = answers.reduce((acc: { [key: string]: number }, answer) => {
      acc[answer] = (acc[answer] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(answerCounts),
      datasets: [
        {
          data: Object.values(answerCounts),
          backgroundColor: CHART_COLORS.slice(0, Object.keys(answerCounts).length),
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="text-blue-600 hover:text-blue-500 mb-4 block">
        ← Back to Home
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Survey Details</h1>
          <button
            onClick={downloadCSV}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 flex items-center gap-2"
          >
            <Download size={20} />
            Download CSV
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
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

        <div className="space-y-8">
          {survey.questions.map((question, index) => (
            <div key={index} className="border-b pb-6">
              <p className="font-medium text-gray-900 mb-4">Q: {question}</p>
              <div className="h-64">
                <Pie data={getChartData(survey.answers[index])} options={chartOptions} />
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Total responses: {survey.answers[index].length}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}