import React from 'react';
import { CheckCircle, Circle, Clock, BookOpen, PenTool } from 'lucide-react';
import type { Chapter, Milestone } from '../types/lms';

interface ChapterListProps {
  chapters: Chapter[];
}

export default function ChapterList({ chapters }: ChapterListProps) {
  const getMilestoneIcon = (type: Milestone['type']) => {
    switch (type) {
      case 'theory':
        return <BookOpen className="h-4 w-4" />;
      case 'homework':
        return <PenTool className="h-4 w-4" />;
      case 'exam':
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {chapters.map((chapter) => (
        <div key={chapter.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{chapter.title}</h3>
            <span className="text-sm text-gray-500">
              {chapter.duration} minutes
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">{chapter.description}</p>
          
          <div className="space-y-3">
            {chapter.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-[#ff751d]">
                    {getMilestoneIcon(milestone.type)}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {milestone.title}
                  </span>
                </div>
                {milestone.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}