import React from 'react';
import { FileText, Code } from 'lucide-react';
import type { ExamSection as ExamSectionType } from '../types/lms';

interface ExamSectionProps {
  section: ExamSectionType;
}

export default function ExamSection({ section }: ExamSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {section.type === 'theoretical' ? (
            <FileText className="h-5 w-5 text-[#ff751d]" />
          ) : (
            <Code className="h-5 w-5 text-[#ff751d]" />
          )}
          <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
        </div>
        <span className="text-sm text-gray-500">
          {section.questionCount} questions
        </span>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>
          {section.type === 'theoretical' 
            ? 'Test your theoretical knowledge and understanding of key concepts.'
            : 'Demonstrate your practical skills and ability to apply your knowledge.'}
        </p>
      </div>
    </div>
  );
}