import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Brain } from 'lucide-react';

const Navigation: React.FC = () => {
  return (
    <nav className="flex items-center space-x-6">
      <Link 
        to="/" 
        className="flex items-center text-blue-100 hover:text-white transition-colors"
      >
        <BookOpen size={20} className="mr-2" />
        <span>Schedule Planner</span>
      </Link>
      <Link 
        to="/quiz-generator" 
        className="flex items-center text-blue-100 hover:text-white transition-colors"
      >
        <Brain size={20} className="mr-2" />
        <span>Quiz Generator</span>
      </Link>
    </nav>
  );
};

export default Navigation; 