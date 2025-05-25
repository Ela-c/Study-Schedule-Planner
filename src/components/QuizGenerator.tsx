import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { generateQuiz } from '../utils/quizApi';

interface QuizQuestion {
  question: string;
  answer: string;
}

const QuizGenerator: React.FC = () => {
  const [notes, setNotes] = useState<string>('');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string, duration: number = 3000) => {
    setNotification(message);
    setTimeout(() => setNotification(null), duration);
  };

  const handleGenerateQuiz = async () => {
    if (!notes.trim()) {
      showNotification('Please enter some study notes first');
      return;
    }

    setIsLoading(true);
    setError(null);
    showNotification('Processing Notes for Quiz...');

    try {
      const data = await generateQuiz(notes);
      setQuestions(data.questions);
      showNotification('Quiz Questions Generated!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate quiz. Please try again.';
      setError(errorMessage);
      showNotification('Error generating quiz', 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-md">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Quiz Generator</h1>
              <p className="text-blue-100">Create custom quizzes to test your knowledge</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Notification */}
        {notification && (
          <div className="fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fadeIn z-50">
            {notification}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Notes Input Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="bg-blue-50 p-5 border-b border-blue-100">
            <h2 className="text-xl font-semibold text-blue-900">Generate Quiz from Notes</h2>
            <p className="text-blue-700 text-sm mt-1">Paste your study notes or textbook snippets below</p>
          </div>

          <div className="p-5">
            <textarea
              id="studyNotes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your study notes here..."
              className="w-full h-64 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleGenerateQuiz}
                disabled={isLoading}
                className="btn btn-primary flex items-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Quiz'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quiz Display Section */}
        {questions.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-green-50 p-5 border-b border-green-100">
              <h2 className="text-xl font-semibold text-green-900">Generated Quiz Questions</h2>
              <p className="text-green-700 text-sm mt-1">Test your understanding with these questions</p>
            </div>

            <div className="p-5">
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Question {index + 1}
                    </h3>
                    <p className="text-gray-700">{question.question}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      Answer: {question.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-gray-300 py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Study Schedule Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default QuizGenerator; 