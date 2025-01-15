import React from 'react';
import { LearningContent as LearningContentType, QuizQuestion } from '../types';

type Props = {
  content: LearningContentType;
};

export function LearningContent({ content }: Props) {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<number[]>([]);
  const [showResults, setShowResults] = React.useState(false);

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const calculateScore = () => {
    if (!content.questions) return 0;
    return content.questions.reduce((score, question, index) => {
      return score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
  };

  if (content.questions) {
    return (
      <div className="w-full max-w-2xl">
        {!showResults ? (
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">
                Question {currentQuestion + 1} of {content.questions.length}
              </h3>
              <p className="mb-4">{content.questions[currentQuestion].question}</p>
              <div className="space-y-3">
                {content.questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion, index)}
                    className={`w-full p-3 text-left rounded-lg border transition-all ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50"
              >
                Previous
              </button>
              {currentQuestion === content.questions.length - 1 ? (
                <button
                  onClick={() => setShowResults(true)}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  Show Results
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Quiz Results</h3>
            <p className="text-lg mb-4">
              You scored {calculateScore()} out of {content.questions.length}
            </p>
            <button
              onClick={() => {
                setShowResults(false);
                setCurrentQuestion(0);
                setSelectedAnswers([]);
              }}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            >
              Retry Quiz
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl prose prose-blue">
      <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
      <div className="whitespace-pre-wrap">{content.content}</div>
    </div>
  );
}