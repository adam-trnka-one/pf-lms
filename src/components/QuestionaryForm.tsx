import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react';
import type { ChapterMilestone } from '../types/course';

interface QuestionaryFormProps {
  milestone: ChapterMilestone;
  onComplete: () => void;
}

export default function QuestionaryForm({ milestone, onComplete }: QuestionaryFormProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<{ [key: number]: boolean }>({
    0: true // First question expanded by default
  });
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);

  const toggleQuestion = (index: number) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length !== milestone.questions?.length) {
      alert('Please answer all questions');
      return;
    }
    
    const isAllCorrect = milestone.questions?.every((_, index) => 
      answers[index] === milestone.questions![index].correctAnswer
    );
    
    setAllCorrect(isAllCorrect);
    setShowFeedback(true);
    
    if (isAllCorrect) setTimeout(onComplete, 1500);
  };

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
    setShowFeedback(false);
  };

  return (
    <div className="mt-4">
      <form id={`milestone-${milestone.id}`} className="space-y-4">
        {milestone.questions?.map((q, qIndex) => (
          <div key={qIndex} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleQuestion(qIndex)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ff751d] text-white flex items-center justify-center text-sm">
                  {qIndex + 1}
                </span>
                <p className="font-medium text-gray-900">{q.question}</p>
              </div>
              {expandedQuestions[qIndex] ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </button>
            {expandedQuestions[qIndex] && (
              <div className="p-4 pt-0 border-t border-gray-100">
                <div className="space-y-3">
                  {q.answers.map((answer, aIndex) => (
                    <label
                      key={aIndex}
                      className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
                        showFeedback && answers[qIndex] === aIndex
                          ? answers[qIndex] === q.correctAnswer
                            ? 'bg-green-50'
                            : 'bg-red-50'
                          : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${milestone.id}-${qIndex}`}
                        value={aIndex}
                        checked={answers[qIndex] === aIndex}
                        onChange={() => handleAnswerChange(qIndex, aIndex)}
                        className="text-[#ff751d] focus:ring-[#ff751d]"
                      />
                      <span className="text-gray-700 flex-1">{answer}</span>
                      {showFeedback && answers[qIndex] === aIndex && (
                        answers[qIndex] === q.correctAnswer ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )
                      )}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={showFeedback && allCorrect ? onComplete : handleSubmit}
            className={`px-6 py-2 text-white rounded-lg transition-colors ${
              showFeedback && allCorrect
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-[#ff751d] hover:bg-[#e66b1a]'
            }`}
          >
            {showFeedback && allCorrect ? 'Continue' : 'Submit Answers'}
          </button>
        </div>
      </form>
    </div>
  );
}