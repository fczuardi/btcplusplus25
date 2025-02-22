import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { SurveyDetail } from './pages/SurveyDetail';
import { SurveyList } from './pages/SurveyList';
import { NewSurveyForm } from './components/NewSurveyForm';

function App() {
  return (
    <Router basename="/survey-repository">
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/survey/:id" element={<SurveyDetail />} />
          <Route path="/surveys" element={<SurveyList />} />
          <Route path="/new" element={
            <div className="max-w-2xl mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Submit New Survey</h1>
              <NewSurveyForm />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;