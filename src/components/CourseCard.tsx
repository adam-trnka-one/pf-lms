import React from 'react';
import { Clock, BookOpen, Award } from 'lucide-react';
import type { Course } from '../types/lms';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const totalMilestones = course.chapters.reduce((sum, chapter) => 
    sum + chapter.milestones.length, 0);
  const completedMilestones = course.chapters.reduce((sum, chapter) => 
    sum + chapter.milestones.filter(m => m.completed).length, 0);
  const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4">{course.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{Math.round(course.totalDuration / 60)} hours</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{course.chapters.length} chapters</span>
          </div>
          <div className="flex items-center">
            <Award className="h-4 w-4 mr-1" />
            <span>Certificate</span>
          </div>
        </div>

        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-[#ff751d]">
                Progress
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-[#ff751d]">{Math.round(progress)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
            <div
              style={{ width: `${progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#ff751d]"
            />
          </div>
        </div>

        <button className="w-full bg-[#ff751d] text-white py-2 px-4 rounded-md hover:bg-[#e66b1a] transition-colors">
          Continue Learning
        </button>
      </div>
    </div>
  );
}