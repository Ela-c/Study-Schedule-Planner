interface QuizQuestion {
  question: string;
  answer: string;
}

interface QuizResponse {
  questions: QuizQuestion[];
}

// Mock function to generate quiz questions from notes
export const generateQuiz = async (notes: string): Promise<QuizResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Test case 1: Empty notes
  if (!notes.trim()) {
    throw new Error('Please enter some study notes first');
  }

  // Test case 2: Notes too short
  if (notes.length < 50) {
    throw new Error('Please provide more detailed notes (at least 50 characters)');
  }

  // Test case 3: Notes too long
  if (notes.length > 5000) {
    throw new Error('Notes are too long. Please limit to 5000 characters');
  }

  // Test case 4: Invalid content (no proper sentences)
  if (!notes.includes('.') && !notes.includes('!') && !notes.includes('?')) {
    throw new Error('Please provide notes with proper sentences (ending with . ! or ?)');
  }

  // Simple mock implementation that creates questions from the notes
  const sentences = notes
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20); // Only use sentences with some length

  if (sentences.length === 0) {
    throw new Error('No valid content found in the notes. Please provide complete sentences.');
  }

  // Generate 3-5 questions from the sentences
  const numQuestions = Math.min(Math.max(3, Math.floor(sentences.length / 2)), 5);
  const questions: QuizQuestion[] = [];

  for (let i = 0; i < numQuestions; i++) {
    const sentence = sentences[i % sentences.length];
    const words = sentence.split(' ');
    
    // Create a fill-in-the-blank question
    const blankIndex = Math.floor(Math.random() * (words.length - 2)) + 1;
    const answer = words[blankIndex];
    words[blankIndex] = '_____';
    
    questions.push({
      question: `Fill in the blank: ${words.join(' ')}`,
      answer: answer
    });
  }

  return { questions };
}; 